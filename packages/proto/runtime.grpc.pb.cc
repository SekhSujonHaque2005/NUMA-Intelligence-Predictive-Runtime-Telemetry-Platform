#include "runtime.pb.h"
#include "runtime.grpc.pb.h"

#include <functional>
#include <grpcpp/impl/codegen/async_stream.h>
#include <grpcpp/impl/codegen/async_unary_call.h>
#include <grpcpp/impl/codegen/channel_interface.h>
#include <grpcpp/impl/codegen/client_unary_call.h>
#include <grpcpp/impl/codegen/client_callback.h>
#include <grpcpp/impl/codegen/message_allocator.h>
#include <grpcpp/impl/codegen/method_handler.h>
#include <grpcpp/impl/codegen/rpc_service_method.h>
#include <grpcpp/impl/codegen/server_callback.h>
#include <grpcpp/impl/codegen/server_callback_handlers.h>
#include <grpcpp/impl/codegen/server_context.h>
#include <grpcpp/impl/codegen/service_type.h>
#include <grpcpp/impl/codegen/sync_stream.h>
namespace runtime {

static const char* RuntimeService_method_names[] = {
  "/runtime.RuntimeService/SendMetrics",
};

std::unique_ptr< RuntimeService::Stub> RuntimeService::NewStub(const std::shared_ptr< ::grpc::ChannelInterface>& channel, const ::grpc::StubOptions& options) {
  (void)options;
  std::unique_ptr< RuntimeService::Stub> stub(new RuntimeService::Stub(channel));
  return stub;
}

RuntimeService::Stub::Stub(const std::shared_ptr< ::grpc::ChannelInterface>& channel)
  : channel_(channel), rpcmethod_SendMetrics_(RuntimeService_method_names[0], ::grpc::internal::RpcMethod::NORMAL_RPC, channel)
  {}

::grpc::Status RuntimeService::Stub::SendMetrics(::grpc::ClientContext* context, const ::runtime::Metrics& request, ::runtime::Metrics* response) {
  return ::grpc::internal::BlockingUnaryCall(channel_.get(), rpcmethod_SendMetrics_, context, request, response);
}

void RuntimeService::Stub::experimental_async::SendMetrics(::grpc::ClientContext* context, const ::runtime::Metrics* request, ::runtime::Metrics* response, std::function<void(::grpc::Status)> f) {
  ::grpc_impl::internal::CallbackUnaryCall(stub_->channel_.get(), stub_->rpcmethod_SendMetrics_, context, request, response, std::move(f));
}

void RuntimeService::Stub::experimental_async::SendMetrics(::grpc::ClientContext* context, const ::grpc::ByteBuffer* request, ::runtime::Metrics* response, std::function<void(::grpc::Status)> f) {
  ::grpc_impl::internal::CallbackUnaryCall(stub_->channel_.get(), stub_->rpcmethod_SendMetrics_, context, request, response, std::move(f));
}

void RuntimeService::Stub::experimental_async::SendMetrics(::grpc::ClientContext* context, const ::runtime::Metrics* request, ::runtime::Metrics* response, ::grpc::experimental::ClientUnaryReactor* reactor) {
  ::grpc_impl::internal::ClientCallbackUnaryFactory::Create(stub_->channel_.get(), stub_->rpcmethod_SendMetrics_, context, request, response, reactor);
}

void RuntimeService::Stub::experimental_async::SendMetrics(::grpc::ClientContext* context, const ::grpc::ByteBuffer* request, ::runtime::Metrics* response, ::grpc::experimental::ClientUnaryReactor* reactor) {
  ::grpc_impl::internal::ClientCallbackUnaryFactory::Create(stub_->channel_.get(), stub_->rpcmethod_SendMetrics_, context, request, response, reactor);
}

::grpc::ClientAsyncResponseReader< ::runtime::Metrics>* RuntimeService::Stub::AsyncSendMetricsRaw(::grpc::ClientContext* context, const ::runtime::Metrics& request, ::grpc::CompletionQueue* cq) {
  return ::grpc_impl::internal::ClientAsyncResponseReaderFactory< ::runtime::Metrics>::Create(channel_.get(), cq, rpcmethod_SendMetrics_, context, request, true);
}

::grpc::ClientAsyncResponseReader< ::runtime::Metrics>* RuntimeService::Stub::PrepareAsyncSendMetricsRaw(::grpc::ClientContext* context, const ::runtime::Metrics& request, ::grpc::CompletionQueue* cq) {
  return ::grpc_impl::internal::ClientAsyncResponseReaderFactory< ::runtime::Metrics>::Create(channel_.get(), cq, rpcmethod_SendMetrics_, context, request, false);
}

RuntimeService::Service::Service() {
  AddMethod(new ::grpc::internal::RpcServiceMethod(
      RuntimeService_method_names[0],
      ::grpc::internal::RpcMethod::NORMAL_RPC,
      new ::grpc::internal::RpcMethodHandler< RuntimeService::Service, ::runtime::Metrics, ::runtime::Metrics>(
          [](RuntimeService::Service* service,
             ::grpc_impl::ServerContext* ctx,
             const ::runtime::Metrics* req,
             ::runtime::Metrics* resp) {
               return service->SendMetrics(ctx, req, resp);
             }, this)));
}

RuntimeService::Service::~Service() {
}

::grpc::Status RuntimeService::Service::SendMetrics(::grpc::ServerContext* context, const ::runtime::Metrics* request, ::runtime::Metrics* response) {
  (void) context;
  (void) request;
  (void) response;
  return ::grpc::Status(::grpc::StatusCode::UNIMPLEMENTED, "");
}


}
