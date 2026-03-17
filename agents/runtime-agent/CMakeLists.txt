cmake_minimum_required(VERSION 3.10)

project(runtime_agent)

set(CMAKE_CXX_STANDARD 17)

add_executable(runtime_agent
    src/main.cpp
    src/runtime.cpp
    src/grpc_client.cpp
    ../../packages/proto/runtime.pb.cc
    ../../packages/proto/runtime.grpc.pb.cc
)

find_package(PkgConfig REQUIRED)
pkg_check_modules(GRPC REQUIRED grpc++)

find_package(Protobuf REQUIRED)

include_directories(
    ${GRPC_INCLUDE_DIRS}
    ${Protobuf_INCLUDE_DIRS}
    ../../packages/proto
)

target_link_libraries(runtime_agent
    numa
    ${GRPC_LIBRARIES}
    ${Protobuf_LIBRARIES}
)