# 🚀 How to Run — Component by Component

This guide explains how to run **each part** of the NUMA Runtime Intelligence platform **separately**.

> [!IMPORTANT]
> **Startup Order Matters!** Follow this sequence:
> 1. Database → 2. Gateway → 3. Dashboard → 4. Agent(s)

---

## 🏃 Running Components Separately (Tab-by-Tab)

To run the system in separate terminal tabs for verification, follow these steps:

1. **Database (Postgres)**:
   ```bash
   docker-compose up -d postgres
   ```
2. **Backend (Gateway)**:
   ```bash
   cd services/gateway && npm start
   ```
3. **Frontend (Dashboard)**:
   ```bash
   cd dashboards/runtime-dashboard && npm run dev
   ```
4. **C++ Agent**:
   ```bash
   cd agents/runtime-agent/build && ./runtime_agent
   ```
5. **Rust Agent**:
   ```bash
   cd agents/rust-agent && cargo run --release
   ```

---

## Prerequisites

| Tool | Version | Check Command |
|------|---------|---------------|
| **Node.js** | v18+ | `node --version` |
| **npm** | v9+ | `npm --version` |
| **PostgreSQL** | 15+ | `psql --version` |
| **CMake** | 3.10+ | `cmake --version` |
| **C++ Compiler** | C++17 support | `g++ --version` |
| **Rust & Cargo** | Latest stable | `rustc --version` |
| **Protobuf** | v3+ | `protoc --version` |
| **libnuma-dev** | — | `dpkg -l libnuma-dev` |
| **gRPC C++ libs** | — | `pkg-config --modversion grpc++` |

Install all prerequisites on Ubuntu/Debian:

```bash
# System dependencies
sudo apt update && sudo apt install -y \
  build-essential cmake pkg-config \
  libgrpc++-dev protobuf-compiler-grpc libprotobuf-dev \
  libnuma-dev postgresql postgresql-contrib

# Rust (if not installed)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Node.js via nvm (if not installed)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install 20
```

---

## Part 1: Database (PostgreSQL)

The database stores all telemetry metrics collected by the agents.

### Option A — Automated Setup Script

```bash
# From the project root
chmod +x setup_db.sh
./setup_db.sh
```

**What the script does:**
1. Installs PostgreSQL (if not present)
2. Starts the PostgreSQL service
3. Creates the `runtime_metrics` database
4. Creates the `metrics` table
5. Sets the `postgres` user password to `your_password`

### Option B — Manual Setup

```bash
# Start PostgreSQL
sudo service postgresql start

# Create the database
sudo -u postgres psql -c "CREATE DATABASE runtime_metrics;"

# Create the metrics table
sudo -u postgres psql -d runtime_metrics -c "
CREATE TABLE IF NOT EXISTS metrics (
    id SERIAL PRIMARY KEY,
    source TEXT,
    cpu_id INT,
    cpu_usage FLOAT,
    timestamp BIGINT
);
"

# Set password for connection
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'your_password';"
```

### Option C — Docker (Standalone Database)

```bash
docker run -d \
  --name numa-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=your_password \
  -e POSTGRES_DB=runtime_metrics \
  -v $(pwd)/databases/postgres/init.sql:/docker-entrypoint-initdb.d/init.sql \
  -p 5432:5432 \
  postgres:15
```

### ✅ Verify Database

```bash
sudo -u postgres psql -d runtime_metrics -c "\dt"
# Should show the "metrics" table
```

---

## Part 2: Gateway Service (Node.js)

The Gateway is the central hub — it receives gRPC streams from agents, persists data to PostgreSQL, and serves a REST API + WebSocket for the dashboard.

```bash
# Navigate to the gateway
cd services/gateway

# Install dependencies
npm install

# Start the gateway
npm start
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `postgresql://postgres:your_password@localhost:5432/runtime_metrics` | PostgreSQL connection string |

To override:

```bash
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/runtime_metrics" npm start
```

### ✅ Verify Gateway

Once running, you should see output indicating:
- **gRPC server** listening on `0.0.0.0:50051`
- **REST API** listening on `http://localhost:3001`

Test the REST endpoint:

```bash
curl http://localhost:3001/metrics
# Should return JSON (empty array [] if no agents are connected yet)
```

---

## Part 3: Runtime Dashboard (Next.js)

The dashboard provides real-time visualization of CPU and NUMA telemetry.

```bash
# Navigate to the dashboard
cd dashboards/runtime-dashboard

# Install dependencies
npm install

# Start the dev server
npm run dev
```

### ✅ Verify Dashboard

Open [http://localhost:3000](http://localhost:3000) in your browser.

> [!NOTE]
> The dashboard fetches data from the Gateway at `http://localhost:3001`. Make sure the Gateway (Part 2) is running before opening the dashboard.

---

## Part 4: Telemetry Agents

You can run **either** agent or **both** simultaneously. They collect CPU/NUMA metrics and stream them to the Gateway via gRPC.

### 4A: C++ Runtime Agent

This agent reads real NUMA topology and CPU metrics from the Linux kernel.

```bash
# Navigate to the C++ agent
cd agents/runtime-agent

# Build
mkdir -p build && cd build
cmake ..
make

# Run
./runtime_agent
```

#### Build Dependencies

The C++ agent requires:
- `libgrpc++-dev` — gRPC C++ library
- `protobuf-compiler-grpc` — Protobuf compiler with gRPC plugin
- `libnuma-dev` — NUMA API library
- `pkg-config` — Build configuration tool

#### ✅ Verify C++ Agent

When running, the agent will print logs showing:
- Connection to gRPC gateway at `localhost:50051`
- Periodic CPU/NUMA metric readings being streamed

> [!TIP]
> If the build fails with "grpc_cpp_plugin not found", ensure it's installed:
> ```bash
> which grpc_cpp_plugin
> # If missing: sudo apt install protobuf-compiler-grpc
> ```

---

### 4B: Rust Telemetry Agent

A cross-platform agent that collects system metrics using the `sysinfo` crate.

```bash
# Navigate to the Rust agent
cd agents/rust-agent

# Build and run
cargo run
```

For a release build (optimized):

```bash
cargo run --release
```

#### Build Dependencies

The Rust agent requires:
- `protobuf-compiler` (protoc) — for compiling `.proto` files at build time
- Rust toolchain (rustc, cargo)

#### ✅ Verify Rust Agent

When running, the agent will:
- Connect to the Gateway gRPC endpoint at `localhost:50051`
- Stream CPU usage metrics at regular intervals
- Print telemetry data to stdout

---

## Full Stack — Docker Compose (All-in-One)

To run **everything** together with a single command:

```bash
# From the project root
docker-compose up --build
```

This starts:
- **PostgreSQL** on port `5432`
- **Gateway** (gRPC on `50051`, REST on `3001`)
- **Both agents** running inside the monolith container

> [!NOTE]
> When using Docker Compose, the dashboard is **not** included in the container. Run it separately:
> ```bash
> cd dashboards/runtime-dashboard
> npm install && npm run dev
> ```
> Then open [http://localhost:3000](http://localhost:3000).

---

## Quick Reference

| Component | Directory | Command | Port(s) |
|-----------|-----------|---------|---------|
| **Database** | `/` (root) | `./setup_db.sh` | `5432` |
| **Gateway** | `services/gateway` | `npm start` | `3001` (REST), `50051` (gRPC) |
| **Dashboard** | `dashboards/runtime-dashboard` | `npm run dev` | `3000` |
| **C++ Agent** | `agents/runtime-agent` | `mkdir -p build && cd build && cmake .. && make && ./runtime_agent` | — (connects to `50051`) |
| **Rust Agent** | `agents/rust-agent` | `cargo run` | — (connects to `50051`) |
| **All (Docker)** | `/` (root) | `docker-compose up --build` | `3001`, `5432`, `50051` |

---

## Architecture Flow

```
┌─────────────────┐     ┌─────────────────┐
│  C++ Agent      │     │  Rust Agent      │
│  (NUMA metrics) │     │  (CPU metrics)   │
└────────┬────────┘     └────────┬─────────┘
         │  gRPC :50051          │  gRPC :50051
         └───────────┬───────────┘
                     ▼
           ┌─────────────────┐
           │  Gateway Service │
           │  (Node.js)       │
           │  REST :3001      │
           │  gRPC :50051     │
           └────────┬─────────┘
                    │
         ┌──────────┴──────────┐
         ▼                     ▼
┌─────────────────┐  ┌─────────────────┐
│  PostgreSQL     │  │  Dashboard       │
│  :5432          │  │  (Next.js)       │
│  (persistence)  │  │  :3000           │
└─────────────────┘  └─────────────────┘
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `ECONNREFUSED :5432` | PostgreSQL isn't running. Run `sudo service postgresql start` |
| `ECONNREFUSED :50051` | Gateway isn't running. Start it first with `npm start` in `services/gateway` |
| Dashboard shows no data | Ensure Gateway is running AND at least one agent is connected |
| C++ build fails | Install deps: `sudo apt install libgrpc++-dev protobuf-compiler-grpc libnuma-dev` |
| Rust build fails on protoc | Install: `sudo apt install protobuf-compiler` |
| Port already in use | Kill existing process: `lsof -ti :PORT \| xargs kill -9` |
