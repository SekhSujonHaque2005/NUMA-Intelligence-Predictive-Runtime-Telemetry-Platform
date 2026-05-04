#pragma once
#include <cstdint>

struct Metrics {
    int cpu_id;
    int numa_node;
    float cpu_usage;
    float memory_used_mb;    // NUMA-node-local memory usage
    double local_latency_ns; // Real-world local memory latency
    double remote_latency_ns; // Real-world remote memory latency
    uint64_t timestamp_ms;   // epoch milliseconds
};
