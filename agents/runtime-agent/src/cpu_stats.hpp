#pragma once
#include <fstream>
#include <sstream>
#include <string>
#include <vector>
#include <cstdint>
#include <cctype>

#if defined(_WIN32)
#include <windows.h>
#elif defined(__APPLE__)
#include <mach/mach.h>
#include <mach/processor_info.h>
#include <mach/mach_host.h>
#endif

/// Reads real per-CPU usage from system APIs (Linux, Windows, macOS).
class CpuStats {
public:
#if defined(_WIN32)
    struct CpuSnapshot {
        FILETIME idleTime;
        FILETIME kernelTime;
        FILETIME userTime;

        uint64_t to_uint64(const FILETIME& ft) const {
            return (static_cast<uint64_t>(ft.dwHighDateTime) << 32) | ft.dwLowDateTime;
        }
    };
#elif defined(__APPLE__)
    struct CpuSnapshot {
        host_cpu_load_info_data_t load;
    };
#else
    struct CpuSnapshot {
        uint64_t user    = 0;
        uint64_t nice    = 0;
        uint64_t system  = 0;
        uint64_t idle    = 0;
        uint64_t iowait  = 0;
        uint64_t irq     = 0;
        uint64_t softirq = 0;
        uint64_t steal   = 0;

        uint64_t total_active() const {
            return user + nice + system + irq + softirq + steal;
        }
        uint64_t total() const {
            return total_active() + idle + iowait;
        }
    };
#endif

    std::vector<float> sample() {
#if defined(_WIN32)
        FILETIME idleTime, kernelTime, userTime;
        if (GetSystemTimes(&idleTime, &kernelTime, &userTime)) {
            CpuSnapshot current = {idleTime, kernelTime, userTime};
            if (has_prev_) {
                uint64_t idle = current.to_uint64(current.idleTime) - prev_win_.to_uint64(prev_win_.idleTime);
                uint64_t kernel = current.to_uint64(current.kernelTime) - prev_win_.to_uint64(prev_win_.kernelTime);
                uint64_t user = current.to_uint64(current.userTime) - prev_win_.to_uint64(prev_win_.userTime);
                uint64_t total = kernel + user;
                if (total > 0) {
                    float usage = 100.0f * static_cast<float>(total - idle) / static_cast<float>(total);
                    prev_win_ = current;
                    return std::vector<float>(std::thread::hardware_concurrency(), usage); // Windows aggregate
                }
            }
            prev_win_ = current;
            has_prev_ = true;
        }
        return std::vector<float>(std::thread::hardware_concurrency(), 0.0f);

#elif defined(__APPLE__)
        host_cpu_load_info_data_t load;
        mach_msg_type_number_t count = HOST_CPU_LOAD_INFO_COUNT;
        if (host_statistics(mach_host_self(), HOST_CPU_LOAD_INFO, (host_info_t)&load, &count) == KERN_SUCCESS) {
            if (has_prev_) {
                uint64_t user = load.cpu_ticks[CPU_STATE_USER] - prev_mac_.load.cpu_ticks[CPU_STATE_USER];
                uint64_t system = load.cpu_ticks[CPU_STATE_SYSTEM] - prev_mac_.load.cpu_ticks[CPU_STATE_SYSTEM];
                uint64_t idle = load.cpu_ticks[CPU_STATE_IDLE] - prev_mac_.load.cpu_ticks[CPU_STATE_IDLE];
                uint64_t total = user + system + idle;
                if (total > 0) {
                    float usage = 100.0f * static_cast<float>(user + system) / static_cast<float>(total);
                    prev_mac_.load = load;
                    return std::vector<float>(std::thread::hardware_concurrency(), usage);
                }
            }
            prev_mac_.load = load;
            has_prev_ = true;
        }
        return std::vector<float>(std::thread::hardware_concurrency(), 0.0f);

#else
        auto current = read_proc_stat();
        std::vector<float> usage(current.size(), 0.0f);
        if (prev_.size() == current.size()) {
            for (size_t i = 0; i < current.size(); ++i) {
                uint64_t d_total  = current[i].total() - prev_[i].total();
                uint64_t d_active = current[i].total_active() - prev_[i].total_active();
                if (d_total > 0) {
                    usage[i] = 100.0f * static_cast<float>(d_active) / static_cast<float>(d_total);
                }
            }
        }
        prev_ = std::move(current);
        return usage;
#endif
    }

    static float node_memory_used_mb(int node) {
#if defined(_WIN32)
        ULONGLONG free_mem = 0;
        if (GetNumaAvailableMemoryNode(static_cast<UCHAR>(node), &free_mem)) {
            return static_cast<float>(free_mem) / (1024.0f * 1024.0f); // Windows returns bytes
        }
        return 0.0f;
#elif defined(__linux__)
        std::string path = "/sys/devices/system/node/node" + std::to_string(node) + "/meminfo";
        std::ifstream f(path);
        if (!f.is_open()) return 0.0f;
        uint64_t mem_total = 0, mem_free = 0;
        std::string line;
        while (std::getline(f, line)) {
            if (line.find("MemTotal") != std::string::npos) mem_total = parse_meminfo_kb(line);
            else if (line.find("MemFree") != std::string::npos) mem_free = parse_meminfo_kb(line);
        }
        return static_cast<float>(mem_total - mem_free) / 1024.0f;
#else
        (void)node;
        return 0.0f;
#endif
    }

private:
#if defined(_WIN32)
    CpuSnapshot prev_win_;
#elif defined(__APPLE__)
    CpuSnapshot prev_mac_;
#else
    std::vector<CpuSnapshot> prev_;
#endif
    bool has_prev_ = false;

#if defined(__linux__)
    static std::vector<CpuSnapshot> read_proc_stat() {
        std::vector<CpuSnapshot> cpus;
        std::ifstream f("/proc/stat");
        if (!f.is_open()) return cpus;

        std::string line;
        while (std::getline(f, line)) {
            // Per-CPU lines: "cpu0 user nice system idle iowait irq softirq steal ..."
            // Skip the aggregate "cpu " line (no digit after "cpu")
            if (line.compare(0, 3, "cpu") != 0) continue;
            if (line.size() < 4 || !std::isdigit(line[3])) continue;

            std::istringstream iss(line);
            std::string label;
            CpuSnapshot s;
            iss >> label
                >> s.user >> s.nice >> s.system >> s.idle
                >> s.iowait >> s.irq >> s.softirq >> s.steal;

            cpus.push_back(s);
        }

        return cpus;
    }

    static uint64_t parse_meminfo_kb(const std::string& line) {
        // Extract the numeric value from a line like "Node 0 MemTotal:   16384 kB"
        uint64_t val = 0;
        bool found_colon = false;
        std::string num_str;
        for (char c : line) {
            if (c == ':') { found_colon = true; continue; }
            if (found_colon && std::isdigit(c)) num_str += c;
        }
        if (!num_str.empty()) val = std::stoull(num_str);
        return val;
    }
#endif
};
