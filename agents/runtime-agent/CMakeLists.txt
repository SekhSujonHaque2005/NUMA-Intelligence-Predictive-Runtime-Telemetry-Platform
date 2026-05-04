cmake_minimum_required(VERSION 3.10)

project(runtime_agent)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Production-grade warnings
add_compile_options(-Wall -Wextra -Wpedantic)

# Find Dependencies
find_package(PkgConfig REQUIRED)
find_package(Protobuf REQUIRED)
pkg_check_modules(GRPC REQUIRED grpc++)

# Generate C++ files from .proto
set(PROTO_DIR "${CMAKE_CURRENT_SOURCE_DIR}/../../packages/proto")
set(PROTO_SRC "${PROTO_DIR}/runtime.proto")

set(PROTO_PB_CC "${CMAKE_CURRENT_BINARY_DIR}/runtime.pb.cc")
set(PROTO_PB_H "${CMAKE_CURRENT_BINARY_DIR}/runtime.pb.h")
set(GRPC_PB_CC "${CMAKE_CURRENT_BINARY_DIR}/runtime.grpc.pb.cc")
set(GRPC_PB_H "${CMAKE_CURRENT_BINARY_DIR}/runtime.grpc.pb.h")

add_custom_command(
    OUTPUT "${PROTO_PB_CC}" "${PROTO_PB_H}"
    COMMAND protoc --cpp_out="${CMAKE_CURRENT_BINARY_DIR}" -I "${PROTO_DIR}" "${PROTO_SRC}"
    DEPENDS "${PROTO_SRC}"
)

add_custom_command(
    OUTPUT "${GRPC_PB_CC}" "${GRPC_PB_H}"
    COMMAND protoc --plugin=protoc-gen-grpc=`which grpc_cpp_plugin` --grpc_out="${CMAKE_CURRENT_BINARY_DIR}" -I "${PROTO_DIR}" "${PROTO_SRC}"
    DEPENDS "${PROTO_SRC}"
)

add_executable(runtime_agent
    src/main.cpp
    src/runtime.cpp
    src/grpc_client.cpp
    "${PROTO_PB_CC}"
    "${GRPC_PB_CC}"
)

include_directories(
    ${GRPC_INCLUDE_DIRS}
    ${Protobuf_INCLUDE_DIRS}
    ${CMAKE_CURRENT_BINARY_DIR}
    ${PROTO_DIR}
)

# Platform-specific linking
if(UNIX AND NOT APPLE)
    set(PLATFORM_LIBS numa pthread)
elseif(WIN32)
    set(PLATFORM_LIBS psapi)
else()
    set(PLATFORM_LIBS "")
endif()

target_link_libraries(runtime_agent
    ${PLATFORM_LIBS}
    ${GRPC_LIBRARIES}
    ${Protobuf_LIBRARIES}
)