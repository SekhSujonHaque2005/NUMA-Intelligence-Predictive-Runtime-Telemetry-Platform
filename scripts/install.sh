#!/bin/bash

# NUMA Intelligence - One-Line Installer
# Usage: curl -sSL https://your-domain.com/install.sh | bash

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Initializing NUMA Intelligence Agent...${NC}"

# 1. Detect and Prepare Environment
OS_TYPE=$(uname -s)
echo -e "📦 Platform detected: ${GREEN}$OS_TYPE${NC}"

if [ ! -f "CMakeLists.txt" ]; then
    echo -e "${BLUE}📂 Source code not found. Cloning from GitHub...${NC}"
    rm -rf NUMA-Intelligence-Predictive-Runtime-Telemetry-Platform
    git clone https://github.com/SekhSujonHaque2005/NUMA-Intelligence-Predictive-Runtime-Telemetry-Platform.git
    cd NUMA-Intelligence-Predictive-Runtime-Telemetry-Platform
fi

# 2. Check for dependencies
if [[ "$OS_TYPE" == "Linux" ]]; then
    echo -e "🛠  Checking for libnuma..."
    if ! dpkg -s libnuma-dev >/dev/null 2>&1; then
        echo -e "${RED}⚠️  Missing libnuma-dev. Please run: sudo apt install libnuma-dev cmake g++${NC}"
    fi
fi

# 3. Build Agent
echo -e "🏗  Building high-performance telemetry engine..."
mkdir -p build && cd build
if command -v cmake >/dev/null 2>&1; then
    cmake .. >/dev/null && make -j$(nproc) >/dev/null
    if [ -f "runtime_agent" ]; then
        cp runtime_agent ..
        echo -e "${GREEN}✨ Build Successful!${NC}"
    fi
fi
cd ..

# 4. Final Instructions
FINAL_URL=${GATEWAY_ADDR:-"https://numa-intelligence-predictive-runtime.onrender.com"}

echo -e "\n${GREEN}✅ Installation Complete!${NC}"
echo -e "To connect your hardware to the live dashboard, run:"
echo -e "\n${BLUE}export GATEWAY_ADDR=\"$FINAL_URL\"${NC}"
echo -e "${BLUE}./runtime_agent${NC}\n"
