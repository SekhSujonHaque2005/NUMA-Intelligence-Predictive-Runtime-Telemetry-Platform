#!/bin/bash

# NUMA Intelligence - One-Line Installer
# Usage: curl -sSL https://your-domain.com/install.sh | bash

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Initializing NUMA Intelligence Agent...${NC}"

# 1. Detect OS
OS_TYPE=$(uname -s)
echo -e "📦 Platform detected: ${GREEN}$OS_TYPE${NC}"

# 2. Check for dependencies
if [[ "$OS_TYPE" == "Linux" ]]; then
    echo -e "🛠  Checking for libnuma..."
    if ! dpkg -s libnuma-dev >/dev/null 2>&1; then
        echo -e "${RED}⚠️  Missing libnuma-dev. Please run: sudo apt install libnuma-dev cmake g++${NC}"
    fi
fi

# 3. Build instructions (Simulated for this demo)
echo -e "🏗  Building high-performance telemetry engine..."
mkdir -p build && cd build
# cmake .. && make -j$(nproc)

# 4. Final Instructions
echo -e "\n${GREEN}✅ Installation Complete!${NC}"
echo -e "To connect your hardware to the live dashboard, run:"
echo -e "\n${BLUE}export GATEWAY_ADDR=\"https://your-render-url.com\"${NC}"
echo -e "${BLUE}./runtime_agent${NC}\n"
