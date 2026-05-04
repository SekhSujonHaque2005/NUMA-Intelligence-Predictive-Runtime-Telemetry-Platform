# --- Stage 1: Build C++ Agent ---
FROM debian:bookworm-slim AS cpp-builder
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    libgrpc++-dev \
    protobuf-compiler-grpc \
    libprotobuf-dev \
    libnuma-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /build
COPY packages/proto ./packages/proto
COPY agents/runtime-agent ./agents/runtime-agent

# Regenerate Proto files
RUN protoc -I ./packages/proto --cpp_out=./packages/proto --grpc_out=./packages/proto \
    --plugin=protoc-gen-grpc=/usr/bin/grpc_cpp_plugin ./packages/proto/runtime.proto

WORKDIR /build/agents/runtime-agent
RUN mkdir -p build && cd build && cmake -DCMAKE_BUILD_TYPE=Release .. && make -j1

# --- Stage 2: Build Rust Agent ---
FROM rust:latest AS rust-builder
RUN apt-get update && apt-get install -y \
    protobuf-compiler \
    libnuma-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /build
COPY agents/rust-agent ./agents/rust-agent
COPY packages/proto ./packages/proto
WORKDIR /build/agents/rust-agent
RUN cargo build --release --jobs 1

# --- Stage 3: Final Image ---
FROM node:20-bookworm-slim
RUN apt-get update && apt-get install -y \
    libnuma-dev \
    libgrpc++-dev \
    libprotobuf-dev \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy Binaries
COPY --from=cpp-builder /build/agents/runtime-agent/build/runtime_agent /app/bin/runtime_agent
COPY --from=rust-builder /build/agents/rust-agent/target/release/rust-agent /app/bin/rust-agent

# Copy Gateway and Root configs
COPY services/gateway /app/services/gateway
COPY packages/proto /app/packages/proto
COPY infrastructure/start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Install Gateway Dependencies
WORKDIR /app/services/gateway
RUN npm install

# Environment Variables
ENV NODE_ENV=production
ENV GATEWAY_ADDR=http://localhost:50051

# Expose HTTP/WS Port
EXPOSE 3001
# Expose gRPC Port internally
EXPOSE 50051

WORKDIR /app
CMD ["/app/start.sh"]
