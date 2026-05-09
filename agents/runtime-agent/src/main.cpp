#include "runtime.hpp"
#include "logger.hpp"

#include <thread>
#include <chrono>
#include <csignal>
#include <atomic>
#include <cstdlib>
#include <string>

std::atomic<bool> keep_running(true);

void signal_handler(int) {
    keep_running.store(false);
}

int main() {
    std::signal(SIGINT,  signal_handler);
    std::signal(SIGTERM, signal_handler);

    const char* env = std::getenv("GATEWAY_ADDR");
    std::string gateway = env ? env : "localhost:50051";

    Log::info("C++ NUMA Agent starting");
    Log::info("Gateway: " + gateway);

    Runtime runtime(4, gateway);
    runtime.start();

    while (keep_running.load()) {
        std::this_thread::sleep_for(std::chrono::seconds(1));
    }

    Log::info("Shutting down...");
    runtime.stop();
    Log::info("Clean exit");

    return 0;
}