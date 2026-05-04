# NUMA Intelligence - Windows One-Line Installer
Write-Host "🚀 Initializing NUMA Intelligence Agent..." -ForegroundColor Cyan

# 1. Detect Environment
Write-Host "📦 Platform detected: Windows" -ForegroundColor Green

# 2. Check for Visual Studio Build Tools
if (!(Get-Command "cmake.exe" -ErrorAction SilentlyContinue)) {
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
