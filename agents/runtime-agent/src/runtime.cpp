#include "runtime.hpp"
#include <iostream>
#include <chrono>
#include <cstdlib>
#include <numa.h>
#include "grpc_client.hpp"
#include <cstdlib>
#include <numa.h>

#ifdef __linux__
#include <sched.h>
#include <pthread.h>
#endif

bool is_numa_available() {
    return numa_available() != -1;
}

void bind_thread(int cpu_id) {
#ifdef __linux__
    cpu_set_t cpuset;
    CPU_ZERO(&cpuset);
    CPU_SET(cpu_id, &cpuset);
    pthread_setaffinity_np(pthread_self(), sizeof(cpu_set_t), &cpuset);
#endif
}

Runtime::Runtime(int threads)
    : thread_count(threads), running(false) {}

void Runtime::worker_task(int id) {
    if (is_numa_available()) {
        int node = id % (numa_max_node() + 1);

        numa_run_on_node(node);

        std::cout << "[NUMA MODE] Thread " << id
                  << " running on node " << node << "\n";
    } else {
        bind_thread(id);

        std::cout << "[CPU AFFINITY MODE] Thread " << id
                  << " bound to CPU " << id << "\n";
    }

    const char* gateway_env = std::getenv("GATEWAY_ADDR");
    std::string gateway_addr = gateway_env ? gateway_env : "localhost:50051";

    // Strip http:// or https:// for C++ gRPC client
    if (gateway_addr.find("http://") == 0) {
        gateway_addr = gateway_addr.substr(7);
    } else if (gateway_addr.find("https://") == 0) {
        gateway_addr = gateway_addr.substr(8);
    }

    GrpcClient client(
        grpc::CreateChannel(gateway_addr,
        grpc::InsecureChannelCredentials())
    );

    while (running) {
        Metrics m;
        m.cpu_id = id;
        m.cpu_usage = rand() % 100;

        client.send(m.cpu_id, m.cpu_usage);

        std::this_thread::sleep_for(std::chrono::milliseconds(500));
    }
}

void Runtime::start() {
    running = true;

    for (int i = 0; i < thread_count; i++) {
        workers.emplace_back(&Runtime::worker_task, this, i);
    }
}

void Runtime::stop() {
    running = false;

    for (auto &t : workers) {
        if (t.joinable()) t.join();
    }
}
