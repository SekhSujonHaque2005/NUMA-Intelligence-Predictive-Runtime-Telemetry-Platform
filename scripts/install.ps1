Write-Host "Initializing NUMA Intelligence Agent..." -ForegroundColor Cyan
$START_DIR = Get-Location

Write-Host "Platform detected: Windows" -ForegroundColor Green

if (!(Test-Path "agents/runtime-agent/CMakeLists.txt")) {
    Write-Host "Source code not found. Cloning from GitHub..." -ForegroundColor Cyan
    if (Test-Path "NUMA-Intelligence-Predictive-Runtime-Telemetry-Platform") {
        Remove-Item -Recurse -Force "NUMA-Intelligence-Predictive-Runtime-Telemetry-Platform"
    }
    git clone https://github.com/SekhSujonHaque2005/NUMA-Intelligence-Predictive-Runtime-Telemetry-Platform.git
    cd NUMA-Intelligence-Predictive-Runtime-Telemetry-Platform
}

if (Get-Command "cmake" -ErrorAction SilentlyContinue) {
    Write-Host "Building Agent..." -ForegroundColor Cyan
    cd agents/runtime-agent
    if (!(Test-Path "build")) { New-Item -ItemType Directory -Force -Path "build" }
    cd build
    cmake .. -G "Visual Studio 17 2022" -A x64
    cmake --build . --config Release
    if (Test-Path "Release/runtime_agent.exe") {
        Copy-Item "Release/runtime_agent.exe" "$START_DIR"
        Write-Host "Build Successful!" -ForegroundColor Green
    }
    cd ../../..
} else {
    Write-Host "CMake not found. Please install CMake and Visual Studio C++ Build Tools." -ForegroundColor Yellow
}

$finalUrl = if ($env:GATEWAY_ADDR) { $env:GATEWAY_ADDR } else { "https://your-render-url.com" }

Write-Host "`nReady to Connect!" -ForegroundColor Green
