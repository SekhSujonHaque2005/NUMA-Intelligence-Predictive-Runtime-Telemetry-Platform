#include "grpc_client.hpp"
#include "logger.hpp"

#include <chrono>
#include <thread>
#include <sstream>

GrpcClient::GrpcClient(std::shared_ptr<grpc::Channel> channel)
    : stub_(runtime::RuntimeService::NewStub(channel)) {}

void GrpcClient::send(int cpu_id, float usage, int node_id, float memory_mb, 
                      double local_lat, double remote_lat, uint64_t timestamp) {
    constexpr int MAX_RETRIES = 3;
    constexpr int BASE_BACKOFF_MS = 100;

    // --- Backpressure / Circuit Breaker ---
    if (consecutive_failures_ > 5) {
        auto now = std::chrono::steady_clock::now();
        if (std::chrono::duration_cast<std::chrono::seconds>(now - last_success_time_).count() < 10) {
            return; // Stay quiet for 10s
        }
    }

    runtime::Metrics request;
    request.set_source("cpp");
    request.set_cpu_id(cpu_id);
    request.set_cpu_usage(usage);
    request.set_node_id(node_id);
    request.set_memory_mb(memory_mb);
    request.set_local_latency_ns(local_lat);
    request.set_remote_latency_ns(remote_lat);
    request.set_timestamp_ms(timestamp);

    for (int attempt = 1; attempt <= MAX_RETRIES; ++attempt) {
        runtime::Metrics reply;
        grpc::ClientContext context;
        context.set_deadline(std::chrono::system_clock::now() + std::chrono::seconds(2));

        grpc::Status status = stub_->SendMetrics(&context, request, &reply);

        if (status.ok()) {
            consecutive_failures_ = 0;
            last_success_time_ = std::chrono::steady_clock::now();
            return;
        }

        consecutive_failures_++;
        
        auto code = status.error_code();
        if (code != grpc::StatusCode::UNAVAILABLE && code != grpc::StatusCode::DEADLINE_EXCEEDED) {
            return; // Non-retryable
        }

        if (attempt < MAX_RETRIES) {
            int backoff = BASE_BACKOFF_MS * (1 << (attempt - 1));
            std::this_thread::sleep_for(std::chrono::milliseconds(backoff));
        }
    }
}
