@echo off
echo Starting deployment process...

echo.
echo Step 1: Installing dependencies...
call npm run install-all

echo.
echo Step 2: Building React app...
cd client
call npm run build
cd ..

echo.
echo Deployment preparation complete!
echo.
echo Next steps:
echo 1. Deploy backend to Railway/Render
echo 2. Deploy frontend to Vercel
echo 3. Update REACT_APP_API_URL environment variable
echo.
echo See DEPLOYMENT_GUIDE.md for detailed instructions.
pause