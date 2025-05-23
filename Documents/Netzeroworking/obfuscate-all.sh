#!/bin/bash

echo "🔁 Đang mã hóa các tệp JavaScript..."

# Mã hóa main.js nếu chưa có tệp mã hóa
if [ ! -f public/js/main.obfuscated.js ]; then
  echo "Mã hóa main.js..."
  javascript-obfuscator public/js/main.js --output public/js/main.obfuscated.js --compact true --self-defending true
  if [ $? -eq 0 ]; then
    echo "✅ Mã hóa main.js thành công!"
  else
    echo "❌ Lỗi khi mã hóa main.js"
  fi
fi

# Mã hóa view-vcard.js nếu chưa có tệp mã hóa
if [ ! -f public/js/view-vcard.obfuscated.js ]; then
  echo "Mã hóa view-vcard.js..."
  javascript-obfuscator public/js/view-vcard.js --output public/js/view-vcard.obfuscated.js --compact true --self-defending true
  if [ $? -eq 0 ]; then
    echo "✅ Mã hóa view-vcard.js thành công!"
  else
    echo "❌ Lỗi khi mã hóa view-vcard.js"
  fi
fi

echo "✅ Mã hóa hoàn tất!"
