import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";
import pkg from "pg";
import express from "express";
import cors from "cors";
import { WebSocketServer } from "ws";
import { createServer } from "http";

const { Pool } = pkg;

const db = new Pool(process.env.DATABASE_URL ? {
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes("neon.tech") ? { rejectUnauthorized: false } : false
} : {
  user: "postgres",
  host: "localhost",
  database: "runtime_metrics",
  password: "your_password",
  port: 5432,
});


// Load proto
const PROTO_PATH = path.resolve("../../packages/proto/runtime.proto");

const packageDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const grpcObject = grpc.loadPackageDefinition(packageDef);

const runtimePackage = grpcObject.runtime;

// WebSocket Broadcast Helper
const clients = new Set();

// SERVICE IMPLEMENTATION
async function SendMetrics(call, callback) {
  const data = call.request;

  // Robustly handle both snake_case and camelCase
  const source = (data.source || "unknown").trim();
  const cpu_id = parseInt(data.cpu_id ?? data.cpuId ?? 0);
  const cpu_usage = parseFloat(data.cpu_usage ?? data.cpuUsage ?? 0);

  const metric = { 
    source, 
    cpu_id, 
    cpu_usage, 
    timestamp: new Date().toLocaleTimeString() 
  };

  // Broadcast to all connected WebSocket clients
  const message = JSON.stringify([metric]); // Dashboard expects an array
  clients.forEach(client => {
    if (client.readyState === 1) { // 1 = OPEN
      client.send(message);
    }
  });

  try {
    await db.query(
      "INSERT INTO metrics (source, cpu_id, cpu_usage, timestamp) VALUES ($1, $2, $3, $4)",
      [source, cpu_id, cpu_usage, Date.now()]
    );
    callback(null, data);
  } catch (err) {
    console.error("DB Insert Error:", err);
    callback(err);
  }
}

// HTTP API SERVER (Express)
const app = express();
app.use(cors());

// Health check endpoint
app.get("/api/health", (req, res) => res.json({ status: "healthy" }));

// Get real-time metrics (latest record per source/cpu_id)
app.get("/api/metrics/realtime", async (req, res) => {
  try {
    const query = `
      SELECT DISTINCT ON (source, cpu_id)
        id, source, cpu_id, cpu_usage, timestamp
      FROM metrics
      ORDER BY source, cpu_id, timestamp DESC;
    `;
    const result = await db.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error("API Error:", err);
    res.status(500).json({ error: "Failed to fetch metrics" });
  }
});
// Database Initialization
const initDb = async () => {
  try {
    console.log("🛠  Initializing Database...");
    await db.query(`
      CREATE TABLE IF NOT EXISTS metrics (
        id SERIAL PRIMARY KEY,
        source VARCHAR(50),
        cpu_id INTEGER,
        cpu_usage DOUBLE PRECISION,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Table 'metrics' is ready.");
    
    // Clear table on start
    console.log("🧹 Cleaning old metrics data...");
    await db.query("TRUNCATE TABLE metrics");
  } catch (err) {
    console.error("❌ Database initialization failed:", err);
  }
};
initDb();

// START HTTP & WebSocket SERVER
const HTTP_PORT = process.env.PORT || 3001;
const httpServer = createServer(app);
const wss = new WebSocketServer({ server: httpServer });

wss.on("connection", (ws) => {
  console.log("🔌 WebSocket client connected");
  clients.add(ws);
  ws.on("close", () => {
    console.log("🔌 WebSocket client disconnected");
    clients.delete(ws);
  });
});

httpServer.listen(HTTP_PORT, "0.0.0.0", () => {
  console.log(`🌐 Dashboard API & WebSocket running on http://localhost:${HTTP_PORT}`);
});

// START gRPC SERVER
const server = new grpc.Server();

server.addService(runtimePackage.RuntimeService.service, {
  SendMetrics,
});

server.bindAsync(
  "0.0.0.0:50051",
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) {
      console.error("Failed to bind gRPC server:", err);
      return;
    }
    console.log(`🚀 gRPC Gateway running on port ${port}`);
  }
);
