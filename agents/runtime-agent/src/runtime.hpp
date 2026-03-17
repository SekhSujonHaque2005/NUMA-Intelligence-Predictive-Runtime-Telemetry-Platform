#pragma once
#include <vector>
#include <thread>
#include <atomic>
#include "metrics.hpp"

class Runtime {
public:
    Runtime(int threads);
    void start();
    void stop();

private:
    int thread_count;
    std::vector<std::thread> workers;
    std::atomic<bool> running;

    void worker_task(int id);
};
