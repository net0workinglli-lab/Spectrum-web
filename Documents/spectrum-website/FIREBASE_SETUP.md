# Firebase Authentication Setup

## Cần thực hiện trong Firebase Console:

### 1. Enable Authentication
1. Truy cập [Firebase Console](https://console.firebase.google.com/project/spec-9233a)
2. Vào **Authentication** trong menu bên trái
3. Click **Get Started**
4. Chọn tab **Sign-in method**

### 2. Enable Email/Password Authentication
1. Click **Email/Password**
2. Enable **Email/Password** provider
3. Click **Save**

### 3. Enable Google Authentication
1. Click **Google**
2. Enable Google provider
3. Chọn project support email
4. Click **Save**

### 4. Cấu hình Authorized Domains
1. Trong **Settings** tab của Authentication
2. Thêm domain: `spec-9233a.web.app`
3. Thêm domain: `localhost` (cho development)

### 5. Test Authentication
Sau khi enable, test trên website:
- Click User icon → Sign In
- Thử đăng ký tài khoản mới
- Thử đăng nhập với Google

## Firebase Config đã được cấu hình:
- Project ID: spec-9233a
- API Key: AIzaSyCR2Bbg35WB7n7rZxOvsO_KiUciD5MzRVc
- Auth Domain: spec-9233a.firebaseapp.com
