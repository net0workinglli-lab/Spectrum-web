#!/bin/bash
# Script tự động: Build → Deploy → Git

echo "🚀 Bước 1: Deploying to Firebase..."
firebase deploy

if [ $? -eq 0 ]; then
    echo "✅ Deploy thành công!"
    
    echo "📝 Bước 2: Committing to Git..."
    git add .
    git commit -m "Deploy $(date '+%Y-%m-%d %H:%M:%S')"
    git push
    
    if [ $? -eq 0 ]; then
        echo "✅ Git push thành công!"
        echo "🎉 Hoàn thành tất cả!"
    else
        echo "❌ Git push thất bại!"
        exit 1
    fi
else
    echo "❌ Deploy thất bại!"
    exit 1
fi
