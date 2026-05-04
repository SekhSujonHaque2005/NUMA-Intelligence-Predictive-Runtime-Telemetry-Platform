use sysinfo::System;
use crate::metrics::Metrics;
use std::{thread, time::Duration};

pub fn collect_metrics() -> Vec<Metrics> {
    let mut system = System::new_all();

    // First refresh establishes a baseline
    system.refresh_cpu_usage();
    // Wait briefly so sysinfo can compute the delta
    thread::sleep(Duration::from_millis(200));
    // Second refresh calculates actual usage
    system.refresh_cpu_usage();

    let mut result = Vec::new();

    let now = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_millis() as u64;

    for (i, cpu) in system.cpus().iter().enumerate() {
        result.push(Metrics {
            cpu_id: i,
            cpu_usage: cpu.cpu_usage(),
            node_id: 0, // Placeholder
            memory_mb: 0.0, // Placeholder
            timestamp_ms: now,
        });
    }

    result
}
