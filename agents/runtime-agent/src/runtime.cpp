#include "runtime.hpp"
#include "grpc_client.hpp"
#include "cpu_stats.hpp"
#include "logger.hpp"
#include "numa_bench.hpp"

#include <chrono>
#include <random>
#include <cmath>
#include <sstream>

#ifdef __linux__
#include <sched.h>
#include <pthread.h>
#include <numa.h>
#elif defined(_WIN32)
#include <windows.h>
#endif

// ---------------------------------------------------------------------------
// NUMA / CPU helpers
// ---------------------------------------------------------------------------

static bool is_numa_available() {
#ifdef __linux__
    return numa_available() != -1;
#elif defined(_WIN32)
    ULONG highestNode;
    return GetNumaHighestNodeNumber(&highestNode) && highestNode > 0;
#else
    return false;
#endif
}

static void bind_thread_to_cpu(int cpu_id) {
#ifdef __linux__
    cpu_set_t cpuset;
    CPU_ZERO(&cpuset);
    CPU_SET(cpu_id, &cpuset);
    pthread_setaffinity_np(pthread_self(), sizeof(cpu_set_t), &cpuset);
#elif defined(_WIN32)
    SetThreadAffinityMask(GetCurrentThread(), static_cast<DWORD_PTR>(1) << cpu_id);
#endif
    (void)cpu_id;
}

// ---------------------------------------------------------------------------
// Runtime
// ---------------------------------------------------------------------------

Runtime::Runtime(int threads, const std::string& gateway_addr)
    : thread_count(threads)
    , gateway_addr_(gateway_addr)
    , running(false) {}

void Runtime::start() {
    // Strip protocol prefix for bare gRPC channel
    std::string addr = gateway_addr_;
    if (addr.find("http://") == 0)  addr = addr.substr(7);
    if (addr.find("https://") == 0) addr = addr.substr(8);

    // Create ONE shared channel — gRPC channels are thread-safe
    channel_ = grpc::CreateChannel(addr, grpc::InsecureChannelCredentials());
    Log::info("Shared gRPC channel created → " + addr);

    running.store(true);

    for (int i = 0; i < thread_count; i++) {
        workers.emplace_back(&Runtime::worker_task, this, i);
    }

    Log::info("Runtime started with " + std::to_string(thread_count) + " worker threads");
}

void Runtime::stop() {
    running.store(false);
    cv_.notify_all();  // Wake sleeping workers immediately

    for (auto& t : workers) {
        if (t.joinable()) t.join();
    }

    Log::info("Runtime stopped — all workers joined");
}

void Runtime::worker_task(int id) {
    // ── Safe CPU binding ────────────────────────────────────────────────
    const unsigned int hw = std::thread::hardware_concurrency();
    const int cpu = (hw > 0) ? (id % static_cast<int>(hw)) : 0;
    int node = 0;

    if (is_numa_available()) {
#ifdef __linux__
        node = cpu % (numa_max_node() + 1);
        numa_run_on_node(node);
        numa_set_preferred(node);  // Memory locality — critical for NUMA perf
#endif
        std::ostringstream oss;
        oss << "[NUMA] Thread " << id << " → node " << node << " (cpu " << cpu << ")";
        Log::info(oss.str());
    } else {
        bind_thread_to_cpu(cpu);
        std::ostringstream oss;
        oss << "[AFFINITY] Thread " << id << " → cpu " << cpu;
        Log::info(oss.str());
    }

    // ── Per-thread gRPC stub (lightweight) from shared channel ──────────
    GrpcClient client(channel_);

    // ── Real CPU stats reader ───────────────────────────────────────────
    CpuStats stats;
    stats.sample();  // Seed first snapshot (returns zeros)

    // ── Thread-safe RNG (fallback if /proc/stat not available) ──────────
    thread_local std::mt19937 rng(std::random_device{}());
    std::uniform_int_distribution<> dist(0, 100);

    // ── Adaptive send: track last sent value ────────────────────────────
    float last_sent_usage = -1.0f;
    constexpr float CHANGE_THRESHOLD = 5.0f;  // Only send on ≥5% delta
    
    auto last_bench_time = std::chrono::steady_clock::now();
    double current_local_lat = 0.0;
    double current_remote_lat = 0.0;

    // ── Worker loop ─────────────────────────────────────────────────────
    while (running.load()) {
        auto now_steady = std::chrono::steady_clock::now();
        
        // Run benchmark every 10 seconds
        if (std::chrono::duration_cast<std::chrono::seconds>(now_steady - last_bench_time).count() >= 10) {
            auto bench = NumaBench::run(node);
            current_local_lat = bench.local_latency_ns;
            current_remote_lat = bench.remote_latency_ns;
            last_bench_time = now_steady;
            
            std::ostringstream oss;
            oss << "[BENCH] Node " << node << " Latency: Local=" << current_local_lat 
                << "ns, Remote=" << current_remote_lat << "ns";
            Log::debug(oss.str());
        }

        auto now_ms = static_cast<uint64_t>(
            std::chrono::duration_cast<std::chrono::milliseconds>(
                std::chrono::system_clock::now().time_since_epoch()
            ).count()
        );

        // Read real CPU usage
        auto cpu_usages = stats.sample();
        float usage = 0.0f;
        
        if (cpu < static_cast<int>(cpu_usages.size())) {
            usage = cpu_usages[cpu];
        } else {
            usage = static_cast<float>(dist(rng)); // Fallback to RNG if /proc/stat is unreadable
        }

        // Build enriched metrics
        Metrics m;
        m.cpu_id        = cpu;
        m.numa_node     = node;
        m.cpu_usage     = usage;
        m.memory_used_mb = CpuStats::node_memory_used_mb(node);
        m.local_latency_ns = current_local_lat;
        m.remote_latency_ns = current_remote_lat;
        m.timestamp_ms  = now_ms;

        // Adaptive send: skip if change is below threshold
        if (last_sent_usage < 0.0f ||
            std::fabs(usage - last_sent_usage) >= CHANGE_THRESHOLD) {

            client.send(m.cpu_id, m.cpu_usage, m.numa_node, m.memory_used_mb, 
                        m.local_latency_ns, m.remote_latency_ns, m.timestamp_ms);
            last_sent_usage = usage;
        }

        // Graceful sleep — wakes immediately on stop()
        {
            std::unique_lock<std::mutex> lock(mtx_);
            cv_.wait_for(lock, std::chrono::milliseconds(500),
                         [this] { return !running.load(); });
        }
    }

    Log::debug("Worker " + std::to_string(id) + " exiting");
}
