@echo off
echo 🚀 Quick Deploy to Netlify...
echo.

echo 📝 Adding changes...
git add .

echo 💬 Quick commit...
git commit -m "Quick update - %date% %time%"

echo 📤 Pushing to GitHub...
git push origin main

echo.
echo ✅ Deployed! Check your Netlify site in 1-2 minutes.
echo.
pause
