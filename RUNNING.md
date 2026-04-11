# Project Run Guide

This guide provides instructions on how to set up and run the various components of the NUMA Runtime Intelligence system.

## Prerequisites

Ensure you have the following installed on your system:
- **Node.js** (v18 or later) & **npm**
- **PostgreSQL**
- **CMake** & **C++ Compiler** (supporting C++17)
- **Rust** & **Cargo**
- **libnuma-dev** (for the C++ agent)
- **gRPC** & **Protobuf** dev libraries

---

## 1. Database Setup

The project includes a shell script to automate the PostgreSQL setup.

```bash
# From the project root
chmod +x setup_db.sh
./setup_db.sh
```

**What this script does:**
1. Installs PostgreSQL and its dependencies.
2. Creates a database named `runtime_metrics`.
3. Creates a `metrics` table.
4. Sets the `postgres` user password to `your_password`.

> [!NOTE]
> If you already have PostgreSQL installed, you can skip the installation part of the script or manually run the SQL commands found in `setup_db.sh`.

---

## 2. Gateway Service

The Gateway service acts as a bridge between the agents (via gRPC) and the dashboard (via REST).

```bash
cd services/gateway
npm install
npm start
```

The gateway will start on:
- **gRPC**: `0.0.0.0:50051`
- **REST API**: `http://localhost:3001`

---

## 3. Runtime Dashboard

The dashboard provides a real-time visualization of CPU metrics.

```bash
cd dashboards/runtime-dashboard
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the terminal-styled dashboard.

---

## 4. Telemetry Agents

You can run either the C++ agent, the Rust agent, or both simultaneously.

### C++ Agent
```bash
cd agents/runtime-agent
mkdir -p build && cd build
cmake ..
make
./runtime_agent
```

### Rust Agent
```bash
cd agents/rust-agent
cargo run
```

---

## Architecture Overview

- **Agents**: Collect CPU/NUMA metrics and send them to the Gateway via gRPC.
- **Gateway**: Receives gRPC streams, persists data to PostgreSQL, and serves a REST API for the dashboard.
- **Dashboard**: Fetches the latest metrics from the Gateway and displays them in a high-performance UI.
- **Persistence**: PostgreSQL stores the history of metrics for real-time and historical analysis.
