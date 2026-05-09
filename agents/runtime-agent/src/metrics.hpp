#pragma once
#include <cstdint>

struct Metrics {
    int cpu_id;
    int numa_node;
    float cpu_usage;
    float memory_used_mb;
    double local_latency_ns; 
    double remote_latency_ns; 
    uint64_t timestamp_ms;   
};
