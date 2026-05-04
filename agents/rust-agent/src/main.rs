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
    
    // Connect to the gRPC gateway with retries
    let gateway_addr = std::env::var("GATEWAY_ADDR").unwrap_or_else(|_| "http://localhost:50051".to_string());
    
    let client = loop {
        match RuntimeServiceClient::connect(gateway_addr.clone()).await {
            Ok(c) => break c,
            Err(e) => {
                eprintln!("⏳ Waiting for gRPC Gateway... ({})", e);
                tokio::time::sleep(Duration::from_secs(2)).await;
            }
        }
    };
    
    let mut client = client;
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
                node_id: m.node_id,
                memory_mb: m.memory_mb,
                timestamp_ms: m.timestamp_ms,
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