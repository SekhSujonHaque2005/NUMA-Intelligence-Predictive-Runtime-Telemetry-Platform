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

    for (i, cpu) in system.cpus().iter().enumerate() {
        result.push(Metrics {
            cpu_id: i,
            cpu_usage: cpu.cpu_usage(),
        });
    }

    result
}
