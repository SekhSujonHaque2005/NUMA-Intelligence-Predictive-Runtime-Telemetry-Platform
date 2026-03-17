use sysinfo::System;
use crate::metrics::Metrics;

pub fn collect_metrics() -> Vec<Metrics> {
    let mut system = System::new_all();
    system.refresh_all();

    let mut result = Vec::new();

    for (i, cpu) in system.cpus().iter().enumerate() {
        result.push(Metrics {
            cpu_id: i,
            cpu_usage: cpu.cpu_usage(),
        });
    }

    result
}
