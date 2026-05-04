#pragma once
#include <grpcpp/grpcpp.h>
#include "runtime.grpc.pb.h"

class GrpcClient {
public:
    GrpcClient(std::shared_ptr<grpc::Channel> channel);

    void send(int cpu_id, float usage, int node_id, float memory_mb, 
              double local_lat, double remote_lat, uint64_t timestamp);

private:
    std::unique_ptr<runtime::RuntimeService::Stub> stub_;
    int consecutive_failures_ = 0;
    std::chrono::steady_clock::time_point last_success_time_;
};
