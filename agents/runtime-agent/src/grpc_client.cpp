#include "grpc_client.hpp"

GrpcClient::GrpcClient(std::shared_ptr<grpc::Channel> channel)
    : stub_(runtime::RuntimeService::NewStub(channel)) {}

void GrpcClient::send(int cpu_id, float usage) {
    runtime::Metrics request;

    request.set_source("cpp");
    request.set_cpu_id(cpu_id);
    request.set_cpu_usage(usage);

    runtime::Metrics reply;
    grpc::ClientContext context;

    grpc::Status status = stub_->SendMetrics(&context, request, &reply);
    if (!status.ok()) {
        std::cerr << "❌ C++ Agent: SendMetrics failed: " << status.error_message() << std::endl;
    }
}
