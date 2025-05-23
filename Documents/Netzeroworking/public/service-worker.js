if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
      console.log('Service Worker đăng ký thành công:', registration);
    }).catch(function(error) {
      console.log('Service Worker đăng ký thất bại:', error);
    });
  }

// Cập nhật Service Worker
navigator.serviceWorker.getRegistration().then(reg => {
  if (reg) reg.update();
});
// Lắng nghe sự kiện 'controllerchange' để tải lại trang khi Service Worker mới được kích hoạt
navigator.serviceWorker.addEventListener('controllerchange', () => {
  window.location.reload();
});

self.addEventListener('install', event => {
  self.skipWaiting();
});

