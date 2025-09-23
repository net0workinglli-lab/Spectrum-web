#!/bin/bash
# Script tự động push code
echo "🚀 Đang đẩy code lên GitHub..."
git add .
git commit -m "Update $(date '+%Y-%m-%d %H:%M:%S')"
git push
echo "✅ Hoàn thành!"
