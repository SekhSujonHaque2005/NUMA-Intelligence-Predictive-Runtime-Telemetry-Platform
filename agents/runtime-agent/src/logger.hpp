#pragma once
#include <iostream>
#include <sstream>
#include <string>
#include <chrono>
#include <iomanip>
#include <thread>
#include <mutex>

namespace Log {

enum class Level { DEBUG, INFO, WARN, ERROR };

inline const char* level_str(Level l) {
    switch (l) {
        case Level::DEBUG: return "DEBUG";
        case Level::INFO:  return "INFO ";
        case Level::WARN:  return "WARN ";
        case Level::ERROR: return "ERROR";
    }
    return "?????";
}

inline const char* level_color(Level l) {
    switch (l) {
        case Level::DEBUG: return "\033[36m";  // cyan
        case Level::INFO:  return "\033[32m";  // green
        case Level::WARN:  return "\033[33m";  // yellow
        case Level::ERROR: return "\033[31m";  // red
    }
    return "\033[0m";
}

inline std::string timestamp() {
    auto now = std::chrono::system_clock::now();
    auto ms  = std::chrono::duration_cast<std::chrono::milliseconds>(
                   now.time_since_epoch()) % 1000;
    auto t   = std::chrono::system_clock::to_time_t(now);
    std::tm tm{};
    localtime_r(&t, &tm);

    std::ostringstream oss;
    oss << std::put_time(&tm, "%H:%M:%S")
        << '.' << std::setfill('0') << std::setw(3) << ms.count();
    return oss.str();
}

inline std::string thread_tag() {
    std::ostringstream oss;
    oss << std::this_thread::get_id();
    return oss.str();
}

// Global mutex to prevent interleaved log lines
inline std::mutex& log_mutex() {
    static std::mutex mtx;
    return mtx;
}

inline void log(Level level, const std::string& msg) {
    const char* color = level_color(level);
    const char* reset = "\033[0m";

    std::ostringstream oss;
    oss << color << "[" << timestamp() << "] "
        << "[" << level_str(level) << "] "
        << "[T:" << thread_tag() << "] "
        << reset << msg << "\n";

    std::lock_guard<std::mutex> lock(log_mutex());
    std::cerr << oss.str();
}

inline void debug(const std::string& msg) { log(Level::DEBUG, msg); }
inline void info(const std::string& msg)  { log(Level::INFO,  msg); }
inline void warn(const std::string& msg)  { log(Level::WARN,  msg); }
inline void error(const std::string& msg) { log(Level::ERROR, msg); }

} // namespace Log
