@echo off
setlocal
set "ROOT=%~dp0"

echo Starting HTLSTUDIO
echo Site: http://localhost:5173
echo.
echo Close the window to stop the server.
echo.

start "HTLSTUDIO Web" /D "%ROOT%frontend" cmd /k npm run dev
