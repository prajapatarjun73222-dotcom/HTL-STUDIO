@echo off
setlocal
set "ROOT=%~dp0"

echo Starting HTLSTUDIO
echo Site: http://localhost:5173
echo API:  http://localhost:5000
echo.
echo MongoDB is the Atlas database named htlstudio.
echo Close each window to stop that server.
echo.

start "HTLSTUDIO API" /D "%ROOT%backend" cmd /k npm run dev
start "HTLSTUDIO Web" /D "%ROOT%frontend" cmd /k npm run dev
