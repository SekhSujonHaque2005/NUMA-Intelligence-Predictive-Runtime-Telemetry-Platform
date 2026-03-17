mod metrics;
mod collector;

use std::{thread, time::Duration};

fn main() {
    loop {
        let metrics = collector::collect_metrics();

        for m in metrics {
            println!("[Rust Agent] CPU {} Usage: {}%", m.cpu_id, m.cpu_usage);
        }

        println!("---------------------------");

        thread::sleep(Duration::from_secs(1));
    }
}