cmake_minimum_required(VERSION 3.10)

project(runtime_agent)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Production-grade warnings
add_compile_options(-Wall -Wextra -Wpedantic)

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