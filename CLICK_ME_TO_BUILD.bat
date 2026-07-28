@echo off
echo ===================================================
echo   AUTOMATIC LUMIO POS DEPLOYMENT BUILDER
echo ===================================================
echo.

echo [1/3] Cleaning old build cache...
node -e "const fs=require('fs'); if(fs.existsSync('.next')) fs.rmSync('.next', {recursive:true, force:true});"
echo.

echo [2/3] Building Next.js application (Please wait)...
call npm run build
if %errorlevel% neq 0 (
    echo.
    echo BUILD FAILED! Please check the errors above.
    pause
    exit /b %errorlevel%
)
echo.

echo [3/3] Creating Zip file for cPanel...
if exist upload_to_cpanel.zip del upload_to_cpanel.zip
powershell Compress-Archive -Path .next, public, server.js, package.json, package-lock.json, .env.local -DestinationPath upload_to_cpanel.zip -Force
echo.

echo ===================================================
echo   SUCCESS! 
echo   Please upload 'upload_to_cpanel.zip' to cPanel.
echo ===================================================
pause
