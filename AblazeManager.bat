@echo off
title Ablaze Luxe — Management Engine
echo Checking environment...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Python is not installed or not in your PATH.
    echo Please install Python from python.org and try again.
    pause
    exit
)

echo Launching Ablaze Luxe Experience...
echo.
echo IMPORTANT: Close VS Code Live Server (Port 5500) if it is running.
echo The site is now running on http://127.0.0.1:5080
echo.

:: Start server in background
start /b python app.py

:: Wait for server to warm up
timeout /t 3 /nobreak >nul

:: Launch browser
start http://127.0.0.1:5080
start http://127.0.0.1:5080/admin

echo.
echo Engine is running. Keep this window open.
echo Press any key to stop the server and close.
pause >nul
taskkill /f /im python.exe >nul 2>&1
exit
