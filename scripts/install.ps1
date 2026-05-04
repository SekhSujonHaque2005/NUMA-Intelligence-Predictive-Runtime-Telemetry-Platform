# NUMA Intelligence - Windows One-Line Installer
Write-Host "🚀 Initializing NUMA Intelligence Agent..." -ForegroundColor Cyan

# 1. Detect and Prepare Environment
Write-Host "📦 Platform detected: Windows" -ForegroundColor Green

if (!(Test-Path "CMakeLists.txt")) {
    Write-Host "📂 Source code not found. Cloning from GitHub..." -ForegroundColor Cyan
    if (Test-Path "NUMA-Intelligence-Predictive-Runtime-Telemetry-Platform") {
        Remove-Item -Recurse -Force "NUMA-Intelligence-Predictive-Runtime-Telemetry-Platform"
    }
    git clone https://github.com/SekhSujonHaque2005/NUMA-Intelligence-Predictive-Runtime-Telemetry-Platform.git
    cd NUMA-Intelligence-Predictive-Runtime-Telemetry-Platform
}

# 2. Build the Agent
if (Get-Command "cmake" -ErrorAction SilentlyContinue) {
    Write-Host "🛠️  Building Agent..." -ForegroundColor Cyan
    cd agents/runtime-agent
    if (!(Test-Path "build")) { New-Item -ItemType Directory -Force -Path "build" }
    cd build
    # Force use of Visual Studio generator for better compatibility
    cmake .. -G "Visual Studio 17 2022" -A x64
    cmake --build . --config Release
    if (Test-Path "Release/runtime_agent.exe") {
        Copy-Item "Release/runtime_agent.exe" "../../.."
        Write-Host "✨ Build Successful!" -ForegroundColor Green
    }
    cd ../../..
} else {
    Write-Host "⚠️  CMake not found. Please install CMake and Visual Studio C++ Build Tools." -ForegroundColor Yellow
}

# 3. Final Instructions
$finalUrl = if ($env:GATEWAY_ADDR) { $env:GATEWAY_ADDR } else { "https://your-render-url.com" }

Write-Host "`n✅ Ready to Connect!" -ForegroundColor Green
Write-Host "To connect your hardware to the live dashboard, run these commands in your terminal:"

Write-Host "`n`-----------------------------------"
Write-Host "`$env:GATEWAY_ADDR = '$finalUrl'" -ForegroundColor Cyan
Write-Host ".\runtime_agent.exe" -ForegroundColor Cyan
Write-Host "`-----------------------------------`n"

if (!(Get-Command "cmake" -ErrorAction SilentlyContinue)) {
    Write-Host "💡 Tip: To build the agent, download CMake here: https://cmake.org/download/" -ForegroundColor Gray
}

if (!(Test-Path "runtime_agent.exe")) {
    Write-Host "`n⚠️  Build failed. Please try running this command from the 'Developer PowerShell for VS 2022' terminal." -ForegroundColor Yellow
}
