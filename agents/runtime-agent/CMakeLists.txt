cmake_minimum_required(VERSION 3.10)

project(runtime_agent)

set(CMAKE_CXX_STANDARD 17)

add_executable(runtime_agent src/main.cpp)

target_link_libraries(runtime_agent numa)