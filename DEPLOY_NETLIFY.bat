@echo off
echo 🚀 Direct Deploy to Netlify...
echo.

echo 📝 Adding changes...
git add .

if "%1"=="" (
    set /p commit_msg="Enter commit message: "
) else (
    set "commit_msg=%*"
)

echo 💬 Committing...
git commit -m "%commit_msg%"

echo 📤 Pushing to GitHub...
git push origin main

echo.
echo ✅ Files pushed to GitHub successfully!
echo.
echo 🌐 If Netlify is connected to GitHub, your site will update automatically.
echo 💡 If not connected yet, go to netlify.com and connect your repository.
echo.
pause
