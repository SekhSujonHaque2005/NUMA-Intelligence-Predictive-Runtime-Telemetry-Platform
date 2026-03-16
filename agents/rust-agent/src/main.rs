use sysinfo::System;
use std::{thread, time::Duration};

fn main() {
    let mut sys = System::new_all();

    loop {
        sys.refresh_all();

        println!("--- System Telemetry ---");

        println!("Total memory: {:.2} GB", sys.total_memory() as f64 / 1024.0 / 1024.0);
        println!("Used memory : {:.2} GB", sys.used_memory() as f64 / 1024.0 / 1024.0);

        let cpus = sys.cpus();
        for i in 0..cpus.len() {
            println!("CPU {} usage: {:.2}%", i, cpus[i].cpu_usage());
        }

        println!("-------------------------");

        thread::sleep(Duration::from_secs(2));
    }
}