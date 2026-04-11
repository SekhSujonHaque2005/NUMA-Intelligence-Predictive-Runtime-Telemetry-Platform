#include "runtime.hpp"
#include <thread>
#include <chrono>
#include <csignal>
#include <iostream>
#include <atomic>

std::atomic<bool> keep_running(true);

void signal_handler(int) {
    keep_running = false;
}

int main() {
    std::signal(SIGINT, signal_handler);

    Runtime runtime(4);
    runtime.start();

    std::cout << "🚀 C++ Agent running continuously. Press Ctrl+C to stop.\n";

    while (keep_running) {
        std::this_thread::sleep_for(std::chrono::seconds(1));
    }

    std::cout << "\n🛑 Stopping C++ Agent...\n";
    runtime.stop();

    return 0;
}