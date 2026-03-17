#include "runtime.hpp"
#include <thread>
#include <chrono>

int main() {
    Runtime runtime(4);

    runtime.start();

    std::this_thread::sleep_for(std::chrono::seconds(5));

    runtime.stop();

    return 0;
}