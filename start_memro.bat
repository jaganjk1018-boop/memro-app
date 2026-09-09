@echo off
echo ===================================================
echo   Memro Cognitive Companion - Installer & Runner
echo ===================================================
echo.
cd /d "%~dp0"

if not exist node_modules (
    echo [1/2] Installing dependencies, please wait...
    call npm install
) else (
    echo [1/2] Dependencies already installed. Skipping...
)

echo.
echo [2/2] Starting development server...
echo.
call npm run dev
pause
