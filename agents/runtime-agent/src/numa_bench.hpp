#pragma once
#include <vector>
#include <chrono>
#include <random>
#include <algorithm>

#ifdef __linux__
#include <numa.h>
#endif

class NumaBench {
public:
    struct LatencyResult {
        double local_latency_ns;
        double remote_latency_ns;
    };

    static LatencyResult run(int local_node, size_t size_mb = 1) {
        LatencyResult result = {0.0, 0.0};
#ifdef __linux__
        if (numa_available() == -1) return result;

        int max_node = numa_max_node();
        int remote_node = (local_node + 1) % (max_node + 1);
        if (remote_node == local_node && max_node > 0) {
            remote_node = (local_node + 1) % (max_node + 1);
        }

        result.local_latency_ns = measure_node_latency(local_node, size_mb);
        
        if (remote_node != local_node) {
            result.remote_latency_ns = measure_node_latency(remote_node, size_mb);
        } else {
            result.remote_latency_ns = result.local_latency_ns;
        }
#else
        (void)local_node;
        (void)size_mb;
#endif
        return result;
    }

private:
#ifdef __linux__
    static double measure_node_latency(int node, size_t size_mb) {
        size_t size = size_mb * 1024 * 1024;
        void* ptr = numa_alloc_onnode(size, node);
        if (!ptr) return 0.0;

        size_t num_elements = size / sizeof(void*);
        void** data = static_cast<void**>(ptr);
        
        std::vector<size_t> indices(num_elements);
        for (size_t i = 0; i < num_elements; ++i) indices[i] = i;
        
        std::random_device rd;
        std::mt19937 g(rd());
        std::shuffle(indices.begin(), indices.end(), g);

        for (size_t i = 0; i < num_elements - 1; ++i) {
            data[indices[i]] = &data[indices[i+1]];
        }
        data[indices[num_elements - 1]] = &data[indices[0]];

        auto start = std::chrono::high_resolution_clock::now();
        
        void** volatile curr = &data[indices[0]];
        const size_t iterations = 1000000;
        for (size_t i = 0; i < iterations; ++i) {
            curr = static_cast<void**>(*curr);
        }

        auto end = std::chrono::high_resolution_clock::now();
        (void)curr;
        numa_free(ptr, size);

        auto diff = std::chrono::duration_cast<std::chrono::nanoseconds>(end - start);
        return static_cast<double>(diff.count()) / iterations;
    }
#endif
};
