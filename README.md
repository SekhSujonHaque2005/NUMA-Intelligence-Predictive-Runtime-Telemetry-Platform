# ⚡️ NUMA Intelligence: Predictive Runtime & Telemetry Platform

![NUMA Intelligence Hero](docs/assets/hero.png)

<div align="center">

![Status](https://img.shields.io/badge/System-Operational-0070f3?style=for-the-badge&logo=statuspage)
![License](https://img.shields.io/badge/License-MIT-white?style=for-the-badge)
![Tech](https://img.shields.io/badge/Stack-C++%20%7C%20Rust%20%7C%20Node%20%7C%20Next-black?style=for-the-badge)

**An enterprise-grade, hardware-affirmative observability suite designed for high-performance NUMA architectures.**

[Demo Video](https://github.com/SekhsujonHaque2005/NUMA-Intelligence-Predictive-Runtime-Telemetry-Platform#) • [Documentation](docs/architecture.md) • [Project Report](PROJECT_REPORT.md)

</div>

---

## 🔥 Why This Matters

In the era of massive core counts, the bottleneck has shifted from raw compute to **Memory Locality**. Traditional monitoring tools treat all memory as equal, but in **Non-Uniform Memory Access (NUMA)** systems, accessing remote memory can be **3-5x slower** than local access.

**NUMA Intelligence** solves this "Hidden Latency" by:
- **Exposing Reality**: Visualizing per-core memory contention that `top` and `htop` miss.
- **Predictive Health**: Identifying thermal and workload patterns that precede hardware failure.
- **Hardware-Affirmative Design**: Providing developers the data they need to pin threads and optimize memory-aware applications.

---

## 🏗 High-Level Architecture

The platform operates as a coordinated ecosystem, bridging low-level system polling with high-fidelity React visualizations.

```mermaid
graph TD
    subgraph "Hardware Edge (Polling Agents)"
        CPP["C++ Runtime Agent<br/>(Low-Latency / Affinity)"]
        RUST["Rust Telemetry Agent<br/>(Memory-Safe / High-Perf)"]
    end

    subgraph "The Nexus (Communication Bridge)"
        GW["Node.js Gateway<br/>(gRPC Server + WS Broadcast)"]
    end

    subgraph "Persistence Layer"
        DB[("PostgreSQL / TimescaleDB<br/>(Time-Series Optimized)")]
    end

    subgraph "Presentation Layer"
        UI["Next.js Engineering Dashboard<br/>(React Server Components)"]
    end

    %% Communication Flows
    CPP -- "gRPC Stream (Protobuf)" --> GW
    RUST -- "gRPC Stream (Protobuf)" --> GW
    GW -- "INSERT (Batch)" --> DB
    GW -- "WebSocket (Real-Time)" --> UI
    UI -- "REST API (Historical)" --> G
    GW -- "Read Path" --> DB

    %% Aesthetics
    classDef hardware fill:#0a0a0a,stroke:#0070f3,stroke-width:2px,color:#fff;
    classDef gateway fill:#0a0a0a,stroke:#f5a623,stroke-width:2px,color:#fff;
    classDef db fill:#0a0a0a,stroke:#666,stroke-width:2px,color:#fff;
    classDef ui fill:#0a0a0a,stroke:#fff,stroke-width:2px,color:#fff;

    class CPP,RUST hardware;
    class GW gateway;
    class DB db;
    class UI ui;
```

---

## 🛠 Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Edge Agents** | ![C++](https://img.shields.io/badge/C++17-00599C?logo=c%2B%2B&logoColor=white) ![Rust](https://img.shields.io/badge/Rust-black?logo=rust&logoColor=white) |
| **Communication** | ![gRPC](https://img.shields.io/badge/gRPC-4285F4?logo=google&logoColor=white) ![WebSockets](https://img.shields.io/badge/WebSockets-white?logo=socket.io&logoColor=black) |
| **Gateway** | ![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white) ![Express](https://img.shields.io/badge/Express-black?logo=express&logoColor=white) |
| **Database** | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?logo=postgresql&logoColor=white) ![TimescaleDB](https://img.shields.io/badge/TimescaleDB-F15A24?logo=timescale&logoColor=white) |
| **Frontend** | ![Next.js](https://img.shields.io/badge/Next.js%2014-black?logo=next.js&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS%204-06B6D4?logo=tailwindcss&logoColor=white) |

---

## 📡 Protocol Specifications

The system utilizes strongly-typed **Protocol Buffers** to ensure high-performance serialization across the polyglot stack.

```protobuf
service RuntimeService {
  // Bi-directional stream or unary rpc for metric ingestion
  rpc SendMetrics (Metrics) returns (MetricsReply) {}
}

message Metrics {
  string source = 1;     // e.g., "cpp-agent-01"
  int32 cpu_id = 2;      // Target CPU Core ID
  float cpu_usage = 3;   // Real-time workload percentage
}
```

---

## 🚀 Getting Started

### 1️⃣ Database Setup
Ensure PostgreSQL is running, then initialize the telemetry schema:
```bash
./setup_db.sh
```

### 2️⃣ Start The Gateway
The central bridge for all telemetry data:
```bash
cd services/gateway && npm start
```

### 3️⃣ Launch Polling Agents
Deploy your choice of agents (or both) to the target hardware:
- **Rust Agent**: `cd agents/rust-agent && cargo run`
- **C++ Agent**: `cd agents/runtime-agent/build && ./runtime_agent`

### 4️⃣ Open Dashboard
View real-time hardware intelligence:
```bash
cd dashboards/runtime-dashboard && npm run dev
```
Navigate to: `http://localhost:3000`

---

## ⚖️ License
Released under the [MIT License](LICENSE). Built for high-performance engineering teams.

---
<div align="center">
<b>© 2026 NUMA Intelligence Platform. Built for the Edge.</b>
</div>
