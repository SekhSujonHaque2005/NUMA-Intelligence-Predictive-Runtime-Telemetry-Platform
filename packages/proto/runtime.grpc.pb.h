#ifndef GRPC_runtime_2eproto__INCLUDED
#define GRPC_runtime_2eproto__INCLUDED

#include "runtime.pb.h"

#include <functional>
#include <grpc/impl/codegen/port_platform.h>
#include <grpcpp/impl/codegen/async_generic_service.h>
#include <grpcpp/impl/codegen/async_stream.h>
#include <grpcpp/impl/codegen/async_unary_call.h>
#include <grpcpp/impl/codegen/client_callback.h>
#include <grpcpp/impl/codegen/client_context.h>
#include <grpcpp/impl/codegen/completion_queue.h>
#include <grpcpp/impl/codegen/message_allocator.h>
#include <grpcpp/impl/codegen/method_handler.h>
#include <grpcpp/impl/codegen/proto_utils.h>
#include <grpcpp/impl/codegen/rpc_method.h>
#include <grpcpp/impl/codegen/server_callback.h>
#include <grpcpp/impl/codegen/server_callback_handlers.h>
#include <grpcpp/impl/codegen/server_context.h>
#include <grpcpp/impl/codegen/service_type.h>
#include <grpcpp/impl/codegen/status.h>
#include <grpcpp/impl/codegen/stub_options.h>
#include <grpcpp/impl/codegen/sync_stream.h>

namespace runtime {
class RuntimeService final {
 public:
  static constexpr char const* service_full_name() {
    return "runtime.RuntimeService";
  }
  class StubInterface {
   public:
    virtual ~StubInterface() {}
    virtual ::grpc::Status SendMetrics(::grpc::ClientContext* context, const ::runtime::Metrics& request, ::runtime::Metrics* response) = 0;
    std::unique_ptr< ::grpc::ClientAsyncResponseReaderInterface< ::runtime::Metrics>> AsyncSendMetrics(::grpc::ClientContext* context, const ::runtime::Metrics& request, ::grpc::CompletionQueue* cq) {
      return std::unique_ptr< ::grpc::ClientAsyncResponseReaderInterface< ::runtime::Metrics>>(AsyncSendMetricsRaw(context, request, cq));
    }
    std::unique_ptr< ::grpc::ClientAsyncResponseReaderInterface< ::runtime::Metrics>> PrepareAsyncSendMetrics(::grpc::ClientContext* context, const ::runtime::Metrics& request, ::grpc::CompletionQueue* cq) {
      return std::unique_ptr< ::grpc::ClientAsyncResponseReaderInterface< ::runtime::Metrics>>(PrepareAsyncSendMetricsRaw(context, request, cq));
    }
    class experimental_async_interface {
     public:
      virtual ~experimental_async_interface() {}
      virtual void SendMetrics(::grpc::ClientContext* context, const ::runtime::Metrics* request, ::runtime::Metrics* response, std::function<void(::grpc::Status)>) = 0;
      virtual void SendMetrics(::grpc::ClientContext* context, const ::grpc::ByteBuffer* request, ::runtime::Metrics* response, std::function<void(::grpc::Status)>) = 0;
      #ifdef GRPC_CALLBACK_API_NONEXPERIMENTAL
      virtual void SendMetrics(::grpc::ClientContext* context, const ::runtime::Metrics* request, ::runtime::Metrics* response, ::grpc::ClientUnaryReactor* reactor) = 0;
      #else
      virtual void SendMetrics(::grpc::ClientContext* context, const ::runtime::Metrics* request, ::runtime::Metrics* response, ::grpc::experimental::ClientUnaryReactor* reactor) = 0;
      #endif
      #ifdef GRPC_CALLBACK_API_NONEXPERIMENTAL
      virtual void SendMetrics(::grpc::ClientContext* context, const ::grpc::ByteBuffer* request, ::runtime::Metrics* response, ::grpc::ClientUnaryReactor* reactor) = 0;
      #else
      virtual void SendMetrics(::grpc::ClientContext* context, const ::grpc::ByteBuffer* request, ::runtime::Metrics* response, ::grpc::experimental::ClientUnaryReactor* reactor) = 0;
      #endif
    };
    #ifdef GRPC_CALLBACK_API_NONEXPERIMENTAL
    typedef class experimental_async_interface async_interface;
    #endif
    #ifdef GRPC_CALLBACK_API_NONEXPERIMENTAL
    async_interface* async() { return experimental_async(); }
    #endif
    virtual class experimental_async_interface* experimental_async() { return nullptr; }
  private:
    virtual ::grpc::ClientAsyncResponseReaderInterface< ::runtime::Metrics>* AsyncSendMetricsRaw(::grpc::ClientContext* context, const ::runtime::Metrics& request, ::grpc::CompletionQueue* cq) = 0;
    virtual ::grpc::ClientAsyncResponseReaderInterface< ::runtime::Metrics>* PrepareAsyncSendMetricsRaw(::grpc::ClientContext* context, const ::runtime::Metrics& request, ::grpc::CompletionQueue* cq) = 0;
  };
  class Stub final : public StubInterface {
   public:
    Stub(const std::shared_ptr< ::grpc::ChannelInterface>& channel);
    ::grpc::Status SendMetrics(::grpc::ClientContext* context, const ::runtime::Metrics& request, ::runtime::Metrics* response) override;
    std::unique_ptr< ::grpc::ClientAsyncResponseReader< ::runtime::Metrics>> AsyncSendMetrics(::grpc::ClientContext* context, const ::runtime::Metrics& request, ::grpc::CompletionQueue* cq) {
      return std::unique_ptr< ::grpc::ClientAsyncResponseReader< ::runtime::Metrics>>(AsyncSendMetricsRaw(context, request, cq));
    }
    std::unique_ptr< ::grpc::ClientAsyncResponseReader< ::runtime::Metrics>> PrepareAsyncSendMetrics(::grpc::ClientContext* context, const ::runtime::Metrics& request, ::grpc::CompletionQueue* cq) {
      return std::unique_ptr< ::grpc::ClientAsyncResponseReader< ::runtime::Metrics>>(PrepareAsyncSendMetricsRaw(context, request, cq));
    }
    class experimental_async final :
      public StubInterface::experimental_async_interface {
     public:
      void SendMetrics(::grpc::ClientContext* context, const ::runtime::Metrics* request, ::runtime::Metrics* response, std::function<void(::grpc::Status)>) override;
      void SendMetrics(::grpc::ClientContext* context, const ::grpc::ByteBuffer* request, ::runtime::Metrics* response, std::function<void(::grpc::Status)>) override;
      #ifdef GRPC_CALLBACK_API_NONEXPERIMENTAL
      void SendMetrics(::grpc::ClientContext* context, const ::runtime::Metrics* request, ::runtime::Metrics* response, ::grpc::ClientUnaryReactor* reactor) override;
      #else
      void SendMetrics(::grpc::ClientContext* context, const ::runtime::Metrics* request, ::runtime::Metrics* response, ::grpc::experimental::ClientUnaryReactor* reactor) override;
      #endif
      #ifdef GRPC_CALLBACK_API_NONEXPERIMENTAL
      void SendMetrics(::grpc::ClientContext* context, const ::grpc::ByteBuffer* request, ::runtime::Metrics* response, ::grpc::ClientUnaryReactor* reactor) override;
      #else
      void SendMetrics(::grpc::ClientContext* context, const ::grpc::ByteBuffer* request, ::runtime::Metrics* response, ::grpc::experimental::ClientUnaryReactor* reactor) override;
      #endif
     private:
      friend class Stub;
      explicit experimental_async(Stub* stub): stub_(stub) { }
      Stub* stub() { return stub_; }
      Stub* stub_;
    };
    class experimental_async_interface* experimental_async() override { return &async_stub_; }

   private:
    std::shared_ptr< ::grpc::ChannelInterface> channel_;
    class experimental_async async_stub_{this};
    ::grpc::ClientAsyncResponseReader< ::runtime::Metrics>* AsyncSendMetricsRaw(::grpc::ClientContext* context, const ::runtime::Metrics& request, ::grpc::CompletionQueue* cq) override;
    ::grpc::ClientAsyncResponseReader< ::runtime::Metrics>* PrepareAsyncSendMetricsRaw(::grpc::ClientContext* context, const ::runtime::Metrics& request, ::grpc::CompletionQueue* cq) override;
    const ::grpc::internal::RpcMethod rpcmethod_SendMetrics_;
  };
  static std::unique_ptr<Stub> NewStub(const std::shared_ptr< ::grpc::ChannelInterface>& channel, const ::grpc::StubOptions& options = ::grpc::StubOptions());

  class Service : public ::grpc::Service {
   public:
    Service();
    virtual ~Service();
    virtual ::grpc::Status SendMetrics(::grpc::ServerContext* context, const ::runtime::Metrics* request, ::runtime::Metrics* response);
  };
  template <class BaseClass>
  class WithAsyncMethod_SendMetrics : public BaseClass {
   private:
    void BaseClassMustBeDerivedFromService(const Service*) {}
   public:
    WithAsyncMethod_SendMetrics() {
      ::grpc::Service::MarkMethodAsync(0);
    }
    ~WithAsyncMethod_SendMetrics() override {
      BaseClassMustBeDerivedFromService(this);
    }
    ::grpc::Status SendMetrics(::grpc::ServerContext*, const ::runtime::Metrics*, ::runtime::Metrics*) override {
      abort();
      return ::grpc::Status(::grpc::StatusCode::UNIMPLEMENTED, "");
    }
    void RequestSendMetrics(::grpc::ServerContext* context, ::runtime::Metrics* request, ::grpc::ServerAsyncResponseWriter< ::runtime::Metrics>* response, ::grpc::CompletionQueue* new_call_cq, ::grpc::ServerCompletionQueue* notification_cq, void *tag) {
      ::grpc::Service::RequestAsyncUnary(0, context, request, response, new_call_cq, notification_cq, tag);
    }
  };
  typedef WithAsyncMethod_SendMetrics<Service > AsyncService;
  template <class BaseClass>
  class ExperimentalWithCallbackMethod_SendMetrics : public BaseClass {
   private:
    void BaseClassMustBeDerivedFromService(const Service*) {}
   public:
    ExperimentalWithCallbackMethod_SendMetrics() {
    #ifdef GRPC_CALLBACK_API_NONEXPERIMENTAL
      ::grpc::Service::
    #else
      ::grpc::Service::experimental().
    #endif
        MarkMethodCallback(0,
          new ::grpc_impl::internal::CallbackUnaryHandler< ::runtime::Metrics, ::runtime::Metrics>(
            [this](
    #ifdef GRPC_CALLBACK_API_NONEXPERIMENTAL
                   ::grpc::CallbackServerContext*
    #else
                   ::grpc::experimental::CallbackServerContext*
    #endif
                     context, const ::runtime::Metrics* request, ::runtime::Metrics* response) { return this->SendMetrics(context, request, response); }));}
    void SetMessageAllocatorFor_SendMetrics(
        ::grpc::experimental::MessageAllocator< ::runtime::Metrics, ::runtime::Metrics>* allocator) {
    #ifdef GRPC_CALLBACK_API_NONEXPERIMENTAL
      ::grpc::internal::MethodHandler* const handler = ::grpc::Service::GetHandler(0);
    #else
      ::grpc::internal::MethodHandler* const handler = ::grpc::Service::experimental().GetHandler(0);
    #endif
      static_cast<::grpc_impl::internal::CallbackUnaryHandler< ::runtime::Metrics, ::runtime::Metrics>*>(handler)
              ->SetMessageAllocator(allocator);
    }
    ~ExperimentalWithCallbackMethod_SendMetrics() override {
      BaseClassMustBeDerivedFromService(this);
    }
    ::grpc::Status SendMetrics(::grpc::ServerContext*, const ::runtime::Metrics*, ::runtime::Metrics*) override {
      abort();
      return ::grpc::Status(::grpc::StatusCode::UNIMPLEMENTED, "");
    }
    #ifdef GRPC_CALLBACK_API_NONEXPERIMENTAL
    virtual ::grpc::ServerUnaryReactor* SendMetrics(
      ::grpc::CallbackServerContext*, const ::runtime::Metrics*, ::runtime::Metrics*)
    #else
    virtual ::grpc::experimental::ServerUnaryReactor* SendMetrics(
      ::grpc::experimental::CallbackServerContext*, const ::runtime::Metrics*, ::runtime::Metrics*)
    #endif
      { return nullptr; }
  };
  #ifdef GRPC_CALLBACK_API_NONEXPERIMENTAL
  typedef ExperimentalWithCallbackMethod_SendMetrics<Service > CallbackService;
  #endif

  typedef ExperimentalWithCallbackMethod_SendMetrics<Service > ExperimentalCallbackService;
  template <class BaseClass>
  class WithGenericMethod_SendMetrics : public BaseClass {
   private:
    void BaseClassMustBeDerivedFromService(const Service*) {}
   public:
    WithGenericMethod_SendMetrics() {
      ::grpc::Service::MarkMethodGeneric(0);
    }
    ~WithGenericMethod_SendMetrics() override {
      BaseClassMustBeDerivedFromService(this);
    }
    ::grpc::Status SendMetrics(::grpc::ServerContext*, const ::runtime::Metrics*, ::runtime::Metrics*) override {
      abort();
      return ::grpc::Status(::grpc::StatusCode::UNIMPLEMENTED, "");
    }
  };
  template <class BaseClass>
  class WithRawMethod_SendMetrics : public BaseClass {
   private:
    void BaseClassMustBeDerivedFromService(const Service*) {}
   public:
    WithRawMethod_SendMetrics() {
      ::grpc::Service::MarkMethodRaw(0);
    }
    ~WithRawMethod_SendMetrics() override {
      BaseClassMustBeDerivedFromService(this);
    }
    ::grpc::Status SendMetrics(::grpc::ServerContext*, const ::runtime::Metrics*, ::runtime::Metrics*) override {
      abort();
      return ::grpc::Status(::grpc::StatusCode::UNIMPLEMENTED, "");
    }
    void RequestSendMetrics(::grpc::ServerContext* context, ::grpc::ByteBuffer* request, ::grpc::ServerAsyncResponseWriter< ::grpc::ByteBuffer>* response, ::grpc::CompletionQueue* new_call_cq, ::grpc::ServerCompletionQueue* notification_cq, void *tag) {
      ::grpc::Service::RequestAsyncUnary(0, context, request, response, new_call_cq, notification_cq, tag);
    }
  };
  template <class BaseClass>
  class ExperimentalWithRawCallbackMethod_SendMetrics : public BaseClass {
   private:
    void BaseClassMustBeDerivedFromService(const Service*) {}
   public:
    ExperimentalWithRawCallbackMethod_SendMetrics() {
    #ifdef GRPC_CALLBACK_API_NONEXPERIMENTAL
      ::grpc::Service::
    #else
      ::grpc::Service::experimental().
    #endif
        MarkMethodRawCallback(0,
          new ::grpc_impl::internal::CallbackUnaryHandler< ::grpc::ByteBuffer, ::grpc::ByteBuffer>(
            [this](
    #ifdef GRPC_CALLBACK_API_NONEXPERIMENTAL
                   ::grpc::CallbackServerContext*
    #else
                   ::grpc::experimental::CallbackServerContext*
    #endif
                     context, const ::grpc::ByteBuffer* request, ::grpc::ByteBuffer* response) { return this->SendMetrics(context, request, response); }));
    }
    ~ExperimentalWithRawCallbackMethod_SendMetrics() override {
      BaseClassMustBeDerivedFromService(this);
    }
    ::grpc::Status SendMetrics(::grpc::ServerContext*, const ::runtime::Metrics*, ::runtime::Metrics*) override {
      abort();
      return ::grpc::Status(::grpc::StatusCode::UNIMPLEMENTED, "");
    }
    #ifdef GRPC_CALLBACK_API_NONEXPERIMENTAL
    virtual ::grpc::ServerUnaryReactor* SendMetrics(
      ::grpc::CallbackServerContext* , const ::grpc::ByteBuffer* , ::grpc::ByteBuffer*)
    #else
    virtual ::grpc::experimental::ServerUnaryReactor* SendMetrics(
      ::grpc::experimental::CallbackServerContext* , const ::grpc::ByteBuffer* , ::grpc::ByteBuffer*)
    #endif
      { return nullptr; }
  };
  template <class BaseClass>
  class WithStreamedUnaryMethod_SendMetrics : public BaseClass {
   private:
    void BaseClassMustBeDerivedFromService(const Service*) {}
   public:
    WithStreamedUnaryMethod_SendMetrics() {
      ::grpc::Service::MarkMethodStreamed(0,
        new ::grpc::internal::StreamedUnaryHandler<
          ::runtime::Metrics, ::runtime::Metrics>(
            [this](::grpc_impl::ServerContext* context,
                   ::grpc_impl::ServerUnaryStreamer<
                     ::runtime::Metrics, ::runtime::Metrics>* streamer) {
                       return this->StreamedSendMetrics(context,
                         streamer);
                  }));
    }
    ~WithStreamedUnaryMethod_SendMetrics() override {
      BaseClassMustBeDerivedFromService(this);
    }
    ::grpc::Status SendMetrics(::grpc::ServerContext*, const ::runtime::Metrics*, ::runtime::Metrics*) override {
      abort();
      return ::grpc::Status(::grpc::StatusCode::UNIMPLEMENTED, "");
    }
    virtual ::grpc::Status StreamedSendMetrics(::grpc::ServerContext* context, ::grpc::ServerUnaryStreamer< ::runtime::Metrics,::runtime::Metrics>* server_unary_streamer) = 0;
  };
  typedef WithStreamedUnaryMethod_SendMetrics<Service > StreamedUnaryService;
  typedef Service SplitStreamedService;
  typedef WithStreamedUnaryMethod_SendMetrics<Service > StreamedService;
};

}


#endif
