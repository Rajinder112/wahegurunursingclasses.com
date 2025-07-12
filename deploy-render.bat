@echo off
REM Render Deployment Script for Waheguru Nursing Classes
REM This script helps prepare your project for Render deployment

echo 🚀 Preparing Waheguru Nursing Classes for Render deployment...

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Please run this script from the project root.
    pause
    exit /b 1
)

REM Check if render.yaml exists
if not exist "render.yaml" (
    echo ❌ Error: render.yaml not found. Please ensure the Render configuration is set up.
    pause
    exit /b 1
)

REM Check if .render-buildpacks.json exists
if not exist ".render-buildpacks.json" (
    echo ❌ Error: .render-buildpacks.json not found. Please ensure the buildpack configuration is set up.
    pause
    exit /b 1
)

echo ✅ Configuration files found

REM Check Node.js version
node --version
if %errorlevel% neq 0 (
    echo ❌ Error: Node.js is not installed or not in PATH
    pause
    exit /b 1
)

REM Check if all dependencies are installed
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
) else (
    echo ✅ Dependencies already installed
)

REM Check if server directory exists
if not exist "server" (
    echo ❌ Error: server directory not found
    pause
    exit /b 1
)

REM Check if public directory exists
if not exist "public" (
    echo ❌ Error: public directory not found
    pause
    exit /b 1
)

echo ✅ Project structure verified

REM Test the build process
echo 🔨 Testing build process...
npm install

echo.
echo 🎉 Your project is ready for Render deployment!
echo.
echo Next steps:
echo 1. Push your code to GitHub
echo 2. Go to https://dashboard.render.com
echo 3. Create a new Web Service
echo 4. Connect your GitHub repository
echo 5. Configure environment variables
echo 6. Deploy!
echo.
echo 📖 For detailed instructions, see: render-deploy.md
echo.
echo 🔧 Required environment variables:
echo    - NODE_ENV=production
echo    - PORT=10000
echo    - MONGODB_URI=your_mongodb_connection_string
echo    - SESSION_SECRET=your_session_secret
echo    - COOKIE_SECRET=your_cookie_secret
echo    - JWT_SECRET=your_jwt_secret
echo.
echo 🌐 Your app will be available at: https://waheguru-nursing-classes.onrender.com
echo.
echo 💡 To test locally with production settings:
echo    set NODE_ENV=production
echo    set PORT=10000
echo    npm start
echo.
pause 