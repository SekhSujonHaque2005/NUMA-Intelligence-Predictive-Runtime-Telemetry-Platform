#include "runtime.pb.h"

#include <algorithm>

#include <google/protobuf/io/coded_stream.h>
#include <google/protobuf/extension_set.h>
#include <google/protobuf/wire_format_lite.h>
#include <google/protobuf/descriptor.h>
#include <google/protobuf/generated_message_reflection.h>
#include <google/protobuf/reflection_ops.h>
#include <google/protobuf/wire_format.h>
#include <google/protobuf/port_def.inc>
namespace runtime {
class MetricsDefaultTypeInternal {
 public:
  ::PROTOBUF_NAMESPACE_ID::internal::ExplicitlyConstructed<Metrics> _instance;
} _Metrics_default_instance_;
}
static void InitDefaultsscc_info_Metrics_runtime_2eproto() {
  GOOGLE_PROTOBUF_VERIFY_VERSION;

  {
    void* ptr = &::runtime::_Metrics_default_instance_;
    new (ptr) ::runtime::Metrics();
    ::PROTOBUF_NAMESPACE_ID::internal::OnShutdownDestroyMessage(ptr);
  }
  ::runtime::Metrics::InitAsDefaultInstance();
}

::PROTOBUF_NAMESPACE_ID::internal::SCCInfo<0> scc_info_Metrics_runtime_2eproto =
    {{ATOMIC_VAR_INIT(::PROTOBUF_NAMESPACE_ID::internal::SCCInfoBase::kUninitialized), 0, 0, InitDefaultsscc_info_Metrics_runtime_2eproto}, {}};

static ::PROTOBUF_NAMESPACE_ID::Metadata file_level_metadata_runtime_2eproto[1];
static constexpr ::PROTOBUF_NAMESPACE_ID::EnumDescriptor const** file_level_enum_descriptors_runtime_2eproto = nullptr;
static constexpr ::PROTOBUF_NAMESPACE_ID::ServiceDescriptor const** file_level_service_descriptors_runtime_2eproto = nullptr;

const ::PROTOBUF_NAMESPACE_ID::uint32 TableStruct_runtime_2eproto::offsets[] PROTOBUF_SECTION_VARIABLE(protodesc_cold) = {
  ~0u,
  PROTOBUF_FIELD_OFFSET(::runtime::Metrics, _internal_metadata_),
  ~0u,
  ~0u,
  ~0u,
  PROTOBUF_FIELD_OFFSET(::runtime::Metrics, source_),
  PROTOBUF_FIELD_OFFSET(::runtime::Metrics, cpu_id_),
  PROTOBUF_FIELD_OFFSET(::runtime::Metrics, cpu_usage_),
};
static const ::PROTOBUF_NAMESPACE_ID::internal::MigrationSchema schemas[] PROTOBUF_SECTION_VARIABLE(protodesc_cold) = {
  { 0, -1, sizeof(::runtime::Metrics)},
};

static ::PROTOBUF_NAMESPACE_ID::Message const * const file_default_instances[] = {
  reinterpret_cast<const ::PROTOBUF_NAMESPACE_ID::Message*>(&::runtime::_Metrics_default_instance_),
};

const char descriptor_table_protodef_runtime_2eproto[] PROTOBUF_SECTION_VARIABLE(protodesc_cold) =
  "\n\rruntime.proto\022\007runtime\"<\n\007Metrics\022\016\n\006s"
  "ource\030\001 \001(\t\022\016\n\006cpu_id\030\002 \001(\005\022\021\n\tcpu_usage"
  "\030\003 \001(\0022C\n\016RuntimeService\0221\n\013SendMetrics\022"
  "\020.runtime.Metrics\032\020.runtime.Metricsb\006pro"
  "to3"
  ;
static const ::PROTOBUF_NAMESPACE_ID::internal::DescriptorTable*const descriptor_table_runtime_2eproto_deps[1] = {
};
static ::PROTOBUF_NAMESPACE_ID::internal::SCCInfoBase*const descriptor_table_runtime_2eproto_sccs[1] = {
  &scc_info_Metrics_runtime_2eproto.base,
};
static ::PROTOBUF_NAMESPACE_ID::internal::once_flag descriptor_table_runtime_2eproto_once;
const ::PROTOBUF_NAMESPACE_ID::internal::DescriptorTable descriptor_table_runtime_2eproto = {
  false, false, descriptor_table_protodef_runtime_2eproto, "runtime.proto", 163,
  &descriptor_table_runtime_2eproto_once, descriptor_table_runtime_2eproto_sccs, descriptor_table_runtime_2eproto_deps, 1, 0,
  schemas, file_default_instances, TableStruct_runtime_2eproto::offsets,
  file_level_metadata_runtime_2eproto, 1, file_level_enum_descriptors_runtime_2eproto, file_level_service_descriptors_runtime_2eproto,
};

static bool dynamic_init_dummy_runtime_2eproto = (static_cast<void>(::PROTOBUF_NAMESPACE_ID::internal::AddDescriptors(&descriptor_table_runtime_2eproto)), true);
namespace runtime {

void Metrics::InitAsDefaultInstance() {
}
class Metrics::_Internal {
 public:
};

Metrics::Metrics(::PROTOBUF_NAMESPACE_ID::Arena* arena)
  : ::PROTOBUF_NAMESPACE_ID::Message(arena) {
  SharedCtor();
  RegisterArenaDtor(arena);
}
Metrics::Metrics(const Metrics& from)
  : ::PROTOBUF_NAMESPACE_ID::Message() {
  _internal_metadata_.MergeFrom<::PROTOBUF_NAMESPACE_ID::UnknownFieldSet>(from._internal_metadata_);
  source_.UnsafeSetDefault(&::PROTOBUF_NAMESPACE_ID::internal::GetEmptyStringAlreadyInited());
  if (!from._internal_source().empty()) {
    source_.Set(&::PROTOBUF_NAMESPACE_ID::internal::GetEmptyStringAlreadyInited(), from._internal_source(),
      GetArena());
  }
  ::memcpy(&cpu_id_, &from.cpu_id_,
    static_cast<size_t>(reinterpret_cast<char*>(&cpu_usage_) -
    reinterpret_cast<char*>(&cpu_id_)) + sizeof(cpu_usage_));
}

void Metrics::SharedCtor() {
  ::PROTOBUF_NAMESPACE_ID::internal::InitSCC(&scc_info_Metrics_runtime_2eproto.base);
  source_.UnsafeSetDefault(&::PROTOBUF_NAMESPACE_ID::internal::GetEmptyStringAlreadyInited());
  ::memset(&cpu_id_, 0, static_cast<size_t>(
      reinterpret_cast<char*>(&cpu_usage_) -
      reinterpret_cast<char*>(&cpu_id_)) + sizeof(cpu_usage_));
}

Metrics::~Metrics() {
  SharedDtor();
  _internal_metadata_.Delete<::PROTOBUF_NAMESPACE_ID::UnknownFieldSet>();
}

void Metrics::SharedDtor() {
  GOOGLE_DCHECK(GetArena() == nullptr);
  source_.DestroyNoArena(&::PROTOBUF_NAMESPACE_ID::internal::GetEmptyStringAlreadyInited());
}

void Metrics::ArenaDtor(void* object) {
  Metrics* _this = reinterpret_cast< Metrics* >(object);
  (void)_this;
}
void Metrics::RegisterArenaDtor(::PROTOBUF_NAMESPACE_ID::Arena*) {
}
void Metrics::SetCachedSize(int size) const {
  _cached_size_.Set(size);
}
const Metrics& Metrics::default_instance() {
  ::PROTOBUF_NAMESPACE_ID::internal::InitSCC(&::scc_info_Metrics_runtime_2eproto.base);
  return *internal_default_instance();
}

void Metrics::Clear() {
  ::PROTOBUF_NAMESPACE_ID::uint32 cached_has_bits = 0;
  (void) cached_has_bits;
  source_.ClearToEmpty(&::PROTOBUF_NAMESPACE_ID::internal::GetEmptyStringAlreadyInited(), GetArena());
  ::memset(&cpu_id_, 0, static_cast<size_t>(
      reinterpret_cast<char*>(&cpu_usage_) -
      reinterpret_cast<char*>(&cpu_id_)) + sizeof(cpu_usage_));
  _internal_metadata_.Clear<::PROTOBUF_NAMESPACE_ID::UnknownFieldSet>();
}

const char* Metrics::_InternalParse(const char* ptr, ::PROTOBUF_NAMESPACE_ID::internal::ParseContext* ctx) {
#define CHK_(x) if (PROTOBUF_PREDICT_FALSE(!(x))) goto failure
  ::PROTOBUF_NAMESPACE_ID::Arena* arena = GetArena(); (void)arena;
  while (!ctx->Done(&ptr)) {
    ::PROTOBUF_NAMESPACE_ID::uint32 tag;
    ptr = ::PROTOBUF_NAMESPACE_ID::internal::ReadTag(ptr, &tag);
    CHK_(ptr);
    switch (tag >> 3) {
      case 1:
        if (PROTOBUF_PREDICT_TRUE(static_cast<::PROTOBUF_NAMESPACE_ID::uint8>(tag) == 10)) {
          auto str = _internal_mutable_source();
          ptr = ::PROTOBUF_NAMESPACE_ID::internal::InlineGreedyStringParser(str, ptr, ctx);
          CHK_(::PROTOBUF_NAMESPACE_ID::internal::VerifyUTF8(str, "runtime.Metrics.source"));
          CHK_(ptr);
        } else goto handle_unusual;
        continue;
      case 2:
        if (PROTOBUF_PREDICT_TRUE(static_cast<::PROTOBUF_NAMESPACE_ID::uint8>(tag) == 16)) {
          cpu_id_ = ::PROTOBUF_NAMESPACE_ID::internal::ReadVarint64(&ptr);
          CHK_(ptr);
        } else goto handle_unusual;
        continue;
      case 3:
        if (PROTOBUF_PREDICT_TRUE(static_cast<::PROTOBUF_NAMESPACE_ID::uint8>(tag) == 29)) {
          cpu_usage_ = ::PROTOBUF_NAMESPACE_ID::internal::UnalignedLoad<float>(ptr);
          ptr += sizeof(float);
        } else goto handle_unusual;
        continue;
      default: {
      handle_unusual:
        if ((tag & 7) == 4 || tag == 0) {
          ctx->SetLastTag(tag);
          goto success;
        }
        ptr = UnknownFieldParse(tag,
            _internal_metadata_.mutable_unknown_fields<::PROTOBUF_NAMESPACE_ID::UnknownFieldSet>(),
            ptr, ctx);
        CHK_(ptr != nullptr);
        continue;
      }
    }
  }
success:
  return ptr;
failure:
  ptr = nullptr;
  goto success;
#undef CHK_
}

::PROTOBUF_NAMESPACE_ID::uint8* Metrics::_InternalSerialize(
    ::PROTOBUF_NAMESPACE_ID::uint8* target, ::PROTOBUF_NAMESPACE_ID::io::EpsCopyOutputStream* stream) const {
  ::PROTOBUF_NAMESPACE_ID::uint32 cached_has_bits = 0;
  (void) cached_has_bits;

  if (this->source().size() > 0) {
    ::PROTOBUF_NAMESPACE_ID::internal::WireFormatLite::VerifyUtf8String(
      this->_internal_source().data(), static_cast<int>(this->_internal_source().length()),
      ::PROTOBUF_NAMESPACE_ID::internal::WireFormatLite::SERIALIZE,
      "runtime.Metrics.source");
    target = stream->WriteStringMaybeAliased(
        1, this->_internal_source(), target);
  }

  if (this->cpu_id() != 0) {
    target = stream->EnsureSpace(target);
    target = ::PROTOBUF_NAMESPACE_ID::internal::WireFormatLite::WriteInt32ToArray(2, this->_internal_cpu_id(), target);
  }

  if (!(this->cpu_usage() <= 0 && this->cpu_usage() >= 0)) {
    target = stream->EnsureSpace(target);
    target = ::PROTOBUF_NAMESPACE_ID::internal::WireFormatLite::WriteFloatToArray(3, this->_internal_cpu_usage(), target);
  }

  if (PROTOBUF_PREDICT_FALSE(_internal_metadata_.have_unknown_fields())) {
    target = ::PROTOBUF_NAMESPACE_ID::internal::WireFormat::InternalSerializeUnknownFieldsToArray(
        _internal_metadata_.unknown_fields<::PROTOBUF_NAMESPACE_ID::UnknownFieldSet>(::PROTOBUF_NAMESPACE_ID::UnknownFieldSet::default_instance), target, stream);
  }
  return target;
}

size_t Metrics::ByteSizeLong() const {
  size_t total_size = 0;

  ::PROTOBUF_NAMESPACE_ID::uint32 cached_has_bits = 0;
  (void) cached_has_bits;

  if (this->source().size() > 0) {
    total_size += 1 +
      ::PROTOBUF_NAMESPACE_ID::internal::WireFormatLite::StringSize(
        this->_internal_source());
  }

  if (this->cpu_id() != 0) {
    total_size += 1 +
      ::PROTOBUF_NAMESPACE_ID::internal::WireFormatLite::Int32Size(
        this->_internal_cpu_id());
  }

  if (!(this->cpu_usage() <= 0 && this->cpu_usage() >= 0)) {
    total_size += 1 + 4;
  }

  if (PROTOBUF_PREDICT_FALSE(_internal_metadata_.have_unknown_fields())) {
    return ::PROTOBUF_NAMESPACE_ID::internal::ComputeUnknownFieldsSize(
        _internal_metadata_, total_size, &_cached_size_);
  }
  int cached_size = ::PROTOBUF_NAMESPACE_ID::internal::ToCachedSize(total_size);
  SetCachedSize(cached_size);
  return total_size;
}

void Metrics::MergeFrom(const ::PROTOBUF_NAMESPACE_ID::Message& from) {
  GOOGLE_DCHECK_NE(&from, this);
  const Metrics* source =
      ::PROTOBUF_NAMESPACE_ID::DynamicCastToGenerated<Metrics>(
          &from);
  if (source == nullptr) {
    ::PROTOBUF_NAMESPACE_ID::internal::ReflectionOps::Merge(from, this);
  } else {
    MergeFrom(*source);
  }
}

void Metrics::MergeFrom(const Metrics& from) {
  GOOGLE_DCHECK_NE(&from, this);
  _internal_metadata_.MergeFrom<::PROTOBUF_NAMESPACE_ID::UnknownFieldSet>(from._internal_metadata_);
  ::PROTOBUF_NAMESPACE_ID::uint32 cached_has_bits = 0;
  (void) cached_has_bits;

  if (from.source().size() > 0) {
    _internal_set_source(from._internal_source());
  }
  if (from.cpu_id() != 0) {
    _internal_set_cpu_id(from._internal_cpu_id());
  }
  if (!(from.cpu_usage() <= 0 && from.cpu_usage() >= 0)) {
    _internal_set_cpu_usage(from._internal_cpu_usage());
  }
}

void Metrics::CopyFrom(const ::PROTOBUF_NAMESPACE_ID::Message& from) {
  if (&from == this) return;
  Clear();
  MergeFrom(from);
}

void Metrics::CopyFrom(const Metrics& from) {
  if (&from == this) return;
  Clear();
  MergeFrom(from);
}

bool Metrics::IsInitialized() const {
  return true;
}

void Metrics::InternalSwap(Metrics* other) {
  using std::swap;
  _internal_metadata_.Swap<::PROTOBUF_NAMESPACE_ID::UnknownFieldSet>(&other->_internal_metadata_);
  source_.Swap(&other->source_, &::PROTOBUF_NAMESPACE_ID::internal::GetEmptyStringAlreadyInited(), GetArena());
  ::PROTOBUF_NAMESPACE_ID::internal::memswap<
      PROTOBUF_FIELD_OFFSET(Metrics, cpu_usage_)
      + sizeof(Metrics::cpu_usage_)
      - PROTOBUF_FIELD_OFFSET(Metrics, cpu_id_)>(
          reinterpret_cast<char*>(&cpu_id_),
          reinterpret_cast<char*>(&other->cpu_id_));
}

::PROTOBUF_NAMESPACE_ID::Metadata Metrics::GetMetadata() const {
  return GetMetadataStatic();
}

}
PROTOBUF_NAMESPACE_OPEN
template<> PROTOBUF_NOINLINE ::runtime::Metrics* Arena::CreateMaybeMessage< ::runtime::Metrics >(Arena* arena) {
  return Arena::CreateMessageInternal< ::runtime::Metrics >(arena);
}
PROTOBUF_NAMESPACE_CLOSE
#include <google/protobuf/port_undef.inc>
