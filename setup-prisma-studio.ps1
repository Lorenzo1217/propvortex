# Script to set up production database connection for Prisma Studio
# This creates a .env file with the DATABASE_URL for Prisma to use

Write-Host "🔧 Setting up Prisma Studio for production database access..." -ForegroundColor Blue
Write-Host ""

# Check if .env file exists (not .env.local)
if (Test-Path ".env") {
    Write-Host "📁 Found existing .env file" -ForegroundColor Yellow
    Write-Host "📦 Creating backup at .env.backup..." -ForegroundColor Yellow
    Copy-Item -Path ".env" -Destination ".env.backup" -Force
    Write-Host "✅ Backup created successfully" -ForegroundColor Green
    Write-Host ""
}

# Create new .env file with template
Write-Host "📝 Creating new .env file with database connection template..." -ForegroundColor Yellow

$envContent = @"
# Production Database URL from Vercel/Neon
# Get this from Vercel → Settings → Environment Variables → DATABASE_URL
# 
# To find your database URL:
# 1. Go to https://vercel.com/dashboard
# 2. Click on your PropVortex project
# 3. Navigate to Settings → Environment Variables
# 4. Find DATABASE_URL and click the eye icon to reveal the value
# 5. Copy the entire PostgreSQL connection string
# 6. Replace YOUR_NEON_DATABASE_URL_HERE below with your actual URL
#
# The URL should look like:
# postgresql://username:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require

DATABASE_URL="YOUR_NEON_DATABASE_URL_HERE"
"@

Set-Content -Path ".env" -Value $envContent -Encoding UTF8

Write-Host "✅ .env file created successfully" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Get your database URL from Vercel:" -ForegroundColor White
Write-Host "   → Go to https://vercel.com/dashboard" -ForegroundColor Gray
Write-Host "   → Click on your PropVortex project" -ForegroundColor Gray
Write-Host "   → Navigate to Settings → Environment Variables" -ForegroundColor Gray
Write-Host "   → Find DATABASE_URL and click the eye icon to reveal" -ForegroundColor Gray
Write-Host "   → Copy the entire PostgreSQL connection string" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Update the .env file:" -ForegroundColor White
Write-Host "   → Open .env in your editor" -ForegroundColor Gray
Write-Host "   → Replace YOUR_NEON_DATABASE_URL_HERE with your actual database URL" -ForegroundColor Gray
Write-Host "   → Save the file" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Run Prisma Studio:" -ForegroundColor White
Write-Host "   → npx prisma studio" -ForegroundColor Gray
Write-Host "   → This will open Prisma Studio in your browser at http://localhost:5555" -ForegroundColor Gray
Write-Host ""
Write-Host "⚠️  Important: Never commit the .env file to git!" -ForegroundColor Red
Write-Host "    The .gitignore should already exclude it, but double-check." -ForegroundColor Red
Write-Host ""
Write-Host "✨ Done! Remember to update the DATABASE_URL before running Prisma Studio." -ForegroundColor Green