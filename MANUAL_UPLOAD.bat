@echo off
echo 📦 Preparing files for manual Netlify upload...
echo.

if not exist "netlify-upload" mkdir netlify-upload

echo 📁 Copying files...
copy "dashboard.html" "netlify-upload\"
copy "manifest.json" "netlify-upload\"
copy "sw.js" "netlify-upload\"
copy "index.html" "netlify-upload\" 2>nul
copy "logo.png" "netlify-upload\" 2>nul

echo.
echo ✅ Files ready in netlify-upload folder!
echo.
echo 📋 Manual Upload Instructions:
echo 1. Go to netlify.com
echo 2. Drag the 'netlify-upload' folder to the deploy area
echo 3. Your site will be updated instantly!
echo.
echo 📂 Opening netlify-upload folder...
start netlify-upload
echo.
pause
