# Deployment Planning Notes

## Backend Monolith (Render)
- Component 1: Node.js Gateway (HTTP, WS, gRPC)
- Component 2: C++ Runtime Agent (Simulating workload)
- Component 3: Rust Telemetry Agent (Simulating workload)
- Process Manager: Bash script or `concurrently`

## Database (Neon)
- Use Neon Serverless Postgres.
- Connection string via `DATABASE_URL`.

## Frontend (Vercel)
- Next.js Dashboard.
- Configurable `NEXT_PUBLIC_GATEWAY_URL`.

## Constraints Check
- Render RAM: 512MB. 
- Estimates: Node (150MB) + Agents (50MB) + OS/Overhead (50MB) = ~250MB. (Safe)
- Build Time: C++ and Rust compilation might take 2-4 mins. (Safe)

## Deployment Readiness
- [x] gRPC Gateway migration logic implemented (auto-updates DB schema).
- [x] Node.js server cleaned of non-standard symbols for better log readability.
- [x] Database initialization script synchronized with production telemetry.
- [x] Environment variables (`DATABASE_URL`, `GATEWAY_ADDR`) verified.
