#!/bin/bash

# Start the Node.js Gateway
echo "🚀 Starting Intel Gateway..."
cd /app/services/gateway && npm start &

# Wait a few seconds for the gateway to initialize its gRPC server
sleep 5

# Start C++ Runtime Agent
echo "🚀 Starting C++ Runtime Agent..."
/app/bin/runtime_agent &

# Start Rust Telemetry Agent
echo "🚀 Starting Rust Telemetry Agent..."
/app/bin/rust-agent &

# Keep the script running to keep the container alive
wait -n

echo "🛑 One of the core processes has exited. Shutting down container..."
exit 1
