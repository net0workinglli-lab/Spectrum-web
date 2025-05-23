// scan-logs.js
const fs = require('fs');
const path = require('path');

const keywords = ['email', 'uid', 'token', 'currentuser'];
const targetExt = ['.js'];

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    const lower = line.toLowerCase();
    if (line.includes('console.log') || line.includes('console.debug')) {
      if (keywords.some(keyword => lower.includes(keyword))) {
        console.log(`⚠️  [${filePath}:${index + 1}] → ${line.trim()}`);
      }
    }
  });
}

function walk(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      walk(fullPath);
    } else if (targetExt.includes(path.extname(file))) {
      scanFile(fullPath);
    }
  });
}

// 📂 Bắt đầu từ thư mục public/js/
walk(path.resolve(__dirname, 'public/js'));
