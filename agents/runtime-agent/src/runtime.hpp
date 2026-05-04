#pragma once
#include <vector>
#include <thread>
#include <atomic>
#include <mutex>
#include <condition_variable>
#include <memory>
#include <string>
#include <grpcpp/grpcpp.h>
#include "metrics.hpp"

class Runtime {
public:
    Runtime(int threads, const std::string& gateway_addr);
    void start();
    void stop();

private:
    int thread_count;
    std::string gateway_addr_;
    std::vector<std::thread> workers;
    std::atomic<bool> running;

    // Shared gRPC channel — thread-safe, multiplexes over one TCP connection
    std::shared_ptr<grpc::Channel> channel_;

    // Graceful shutdown signaling
    std::mutex mtx_;
    std::condition_variable cv_;

    void worker_task(int id);
};
