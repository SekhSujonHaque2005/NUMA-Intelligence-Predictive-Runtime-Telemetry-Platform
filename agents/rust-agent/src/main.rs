mod metrics;
mod collector;

use std::{thread, time::Duration};
use tonic::Request;
use runtime::runtime_service_client::RuntimeServiceClient;
use runtime::Metrics as ProtoMetrics;

pub mod runtime {
    tonic::include_proto!("runtime");
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    println!("🚀 Starting Rust Telemetry Agent...");
    
    // Connect to the gRPC gateway
    let gateway_addr = std::env::var("GATEWAY_ADDR").unwrap_or_else(|_| "http://localhost:50051".to_string());
    let mut client = RuntimeServiceClient::connect(gateway_addr).await?;
    println!("✅ Connected to gRPC Gateway");

    loop {
        let metrics = collector::collect_metrics();

        for m in metrics {
            println!("[Rust Agent] CPU {} Usage: {}%", m.cpu_id, m.cpu_usage);
            
            // Send to gateway
            let request = Request::new(ProtoMetrics {
                source: "rust".to_string(),
                cpu_id: m.cpu_id as i32,
                cpu_usage: m.cpu_usage,
            });

            match client.send_metrics(request).await {
                Ok(_) => {},
                Err(e) => eprintln!("❌ Error sending metrics: {}", e),
            }
        }

        println!("---------------------------");
        thread::sleep(Duration::from_secs(1));
    }
}