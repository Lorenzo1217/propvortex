#!/bin/bash

# Script to set up production database connection for Prisma Studio
# This creates a .env file with the DATABASE_URL for Prisma to use

echo "🔧 Setting up Prisma Studio for production database access..."
echo ""

# Check if .env file exists (not .env.local)
if [ -f ".env" ]; then
    echo "📁 Found existing .env file"
    echo "📦 Creating backup at .env.backup..."
    cp .env .env.backup
    echo "✅ Backup created successfully"
    echo ""
fi

# Create new .env file with template
echo "📝 Creating new .env file with database connection template..."
cat > .env << 'EOF'
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
EOF

echo "✅ .env file created successfully"
echo ""
echo "📋 Next steps:"
echo ""
echo "1. Get your database URL from Vercel:"
echo "   → Go to https://vercel.com/dashboard"
echo "   → Click on your PropVortex project"
echo "   → Navigate to Settings → Environment Variables"
echo "   → Find DATABASE_URL and click the eye icon to reveal"
echo "   → Copy the entire PostgreSQL connection string"
echo ""
echo "2. Update the .env file:"
echo "   → Open .env in your editor"
echo "   → Replace YOUR_NEON_DATABASE_URL_HERE with your actual database URL"
echo "   → Save the file"
echo ""
echo "3. Run Prisma Studio:"
echo "   → npx prisma studio"
echo "   → This will open Prisma Studio in your browser at http://localhost:5555"
echo ""
echo "⚠️  Important: Never commit the .env file to git!"
echo "    The .gitignore should already exclude it, but double-check."
echo ""
echo "✨ Done! Remember to update the DATABASE_URL before running Prisma Studio."