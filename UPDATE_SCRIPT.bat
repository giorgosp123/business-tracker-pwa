@echo off
echo 🚀 Updating Business Tracker PWA...
echo.

echo 📝 Adding changes to Git...
git add .

echo 💬 Creating commit...
set /p commit_message="Enter commit message: "
git commit -m "%commit_message%"

echo 📤 Pushing to GitHub...
git push origin main

echo.
echo ✅ Update complete! 
echo 🌐 Your site will be automatically updated on Netlify in 1-2 minutes.
echo.
pause
