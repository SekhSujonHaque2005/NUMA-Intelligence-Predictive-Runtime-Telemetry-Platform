#pragma once
#include <grpcpp/grpcpp.h>
#include "runtime.grpc.pb.h"

class GrpcClient {
public:
    GrpcClient(std::shared_ptr<grpc::Channel> channel);

    void send(int cpu_id, float usage);

private:
    std::unique_ptr<runtime::RuntimeService::Stub> stub_;
};
