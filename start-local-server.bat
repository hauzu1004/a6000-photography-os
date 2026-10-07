@echo off
setlocal
cd /d "%~dp0"
echo ======================================
echo   A6000 + 50mm OS - Local Server V17
echo ======================================
echo.
where node >nul 2>nul
if %errorlevel%==0 (
  echo Starting Node server at http://localhost:3001
  echo Press Ctrl+C to stop
  echo.
  call npx serve . -l 3001
  exit /b
)
echo Node.js was not found. Run: npx serve . -l 3001
pause
