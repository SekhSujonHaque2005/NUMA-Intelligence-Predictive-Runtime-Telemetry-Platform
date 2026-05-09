use sysinfo::System;
use crate::metrics::Metrics;
use std::{thread, time::Duration};

pub fn collect_metrics() -> Vec<Metrics> {
    let mut system = System::new_all();

    system.refresh_cpu_usage();
    thread::sleep(Duration::from_millis(200));
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
            node_id: 0,
            memory_mb: 0.0,
            timestamp_ms: now,
        });
    }

    result
}
