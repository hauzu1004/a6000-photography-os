@echo off
echo ======================================
echo   A6000 Photography OS - Local Server
echo ======================================
echo.
echo Starting server at http://localhost:8000
echo Press Ctrl+C to stop
echo.
python -m http.server 8000
