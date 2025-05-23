
// ✅ Kiểm tra và khởi tạo Firebase
try {
  if (typeof firebase === 'undefined') {
    console.error("Firebase SDK không được tải.");
    throw new Error("Firebase SDK không khả dụng.");
  }

  if (!firebase.apps.length) {
    const firebaseConfig = {
  apiKey: "AIzaSyBN_gVKsQiqyQeJYAJUpRrr06NGdq4Ld6U",
  authDomain: "netzeroworking.firebaseapp.com",
  projectId: "netzeroworking",
  storageBucket: "netzeroworking.firebasestorage.app",
  messagingSenderId: "804064394134",
  appId: "1:804064394134:web:aa0abd6241c769a96cbbb7"
    };
    firebase.initializeApp(firebaseConfig);
  }
} catch (error) {
  console.error("Lỗi khi khởi tạo Firebase:", error);
}

const db = firebase.firestore ? firebase.firestore() : null;
if (!db) {
  console.error("Firestore không khả dụng.");
}

// ✅ Lấy UID từ URL
function getUidFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('uid');
}

// ✅ Hàm làm sạch dữ liệu vCard
function sanitizeVcardData(str) {
  if (!str) return '';
  return str.replace(/[\r\n]+/g, ' ').replace(/;/g, ',').replace(/:/g, '-').trim();
}

// ✅ Hàm render liên kết mạng xã hội
function renderSocialLinks(socialLinks) {
  const container = document.getElementById("previewSocials");
  if (!container) {
    console.error("Không tìm thấy previewSocials trong DOM.");
    return;
  }

  container.innerHTML = "";
  const iconMap = {
    facebook: "<i class='fab fa-facebook-f'></i>",
    instagram: "<i class='fab fa-instagram'></i>",
    linkedin: "<i class='fab fa-linkedin-in'></i>",
    github: "<i class='fab fa-github'></i>",
    tiktok: "<i class='fab fa-tiktok'></i>",
    wechat: "<i class='fab fa-weixin'></i>",
    whatsapp: "<i class='fab fa-whatsapp'></i>",
    zalo: "<i class='icons8-zalo'></i>"
  };

  Object.entries(socialLinks).forEach(([platform, url]) => {
    if (url) {
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.classList.add("social-link", platform);
      const icon = iconMap[platform] || "<i class='fas fa-share-alt'></i>";
      link.innerHTML = icon; // Không hiển thị tên
      container.appendChild(link);
    }
  });
}


// ✅ Tải dữ liệu vCard và mạng xã hội
let isAltMode = false;
let mainData = {};
let altData = {};
let userData = {};
let socialLinks = {};

async function loadVcardData() {
  const uid = getUidFromUrl();
  if (!uid || !db) {
    alert("Không có UID hoặc Firestore không khả dụng.");
    return;
  }

  try {
    const userDoc = await db.collection('users').doc(uid).get();
    const vcardDoc = await db.collection('vcards').doc(uid).get();
    if (!vcardDoc.exists) {
      alert("Không tìm thấy vCard.");
      return;
    }

    userData = userDoc.exists ? userDoc.data() : {};
    const vcard = vcardDoc.data();

    mainData = {
      avatarUrl: vcard.avatarUrl || "",
      fullName: vcard.fullName || "Name",
      email: vcard.email || "Email",
      phone: vcard.phone || "Phone",
      address: vcard.address || "Address",
      company: vcard.company || "Company",
      website: vcard.website || "#",
    };

    const alt = vcard.altLang || {};
    altData = {
      avatarUrl: vcard.avatarUrl || "",
      fullName: alt.fullName || "Alt Name",
      email: alt.email || "Alt Email",
      phone: alt.phone || "Alt Phone",
      address: alt.address || "Alt Address",
      company: alt.company || "Alt Company",
      website: alt.website || "#",
    };

    socialLinks = userData.socialLinks || {};
    renderData();
  } catch (error) {
    console.error("Lỗi tải dữ liệu vCard:", error);
    alert("Có lỗi khi truy xuất thông tin vCard.");
  }
}

function renderData() {
  const data = isAltMode ? altData : mainData;
  // const socials = isAltMode ? (socialLinks.altLang || {}) : socialLinks;
  const socials = isAltMode
  ? (Object.keys(socialLinks.altLang || {}).length > 0 ? socialLinks.altLang : socialLinks)
  : socialLinks;


  document.getElementById("previewAvatar").src = data.avatarUrl;
  document.getElementById("previewName").textContent = data.fullName;
  document.getElementById("previewEmail").textContent = data.email;
  document.getElementById("previewPhone").textContent = data.phone;
  document.getElementById("previewAddress").textContent = data.address;
  document.getElementById("previewCompany").textContent = data.company;
  document.getElementById("previewWebsite").href = data.website;
  document.getElementById("previewWebsite").textContent = data.website;

  document.getElementById("verifiedBadgeModal").style.display = userData.verified ? "inline-block" : "none";

  renderSocialLinks(socials);
}

function renderSocialLinks(socials) {
  const container = document.getElementById("previewSocials");
  container.innerHTML = "";
  for (const [platform, url] of Object.entries(socials)) {
    if (url) {
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.classList.add("social-link", platform);

      // Xử lý riêng icon cho Zalo và WeChat
      if (platform === "zalo") {
        a.innerHTML = `<i class="icons8-zalo"></i>`;
      } else if (platform === "wechat") {
        a.innerHTML = `<i class='fab fa-weixin'></i>`;
      } else {
        // Mặc định dùng Font Awesome cho các mạng khác
        a.innerHTML = `<i class="fa-brands fa-${platform}"></i>`;
      }

      container.appendChild(a);
    }
  }
}


document.getElementById("tabToggle").addEventListener("click", () => {
  isAltMode = !isAltMode;
  // document.getElementById("toggleLabel").textContent = isAltMode ? "Secondary" : "Primary";
  document.getElementById("tabToggle").classList.toggle("active", isAltMode);
  renderData(); // cập nhật lại nội dung ngay
});

loadVcardData();





// Chuyển ảnh từ URL sang base64
function imageUrlToBase64(url, maxSize = 512) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous"; // Xử lý CORS

    img.onload = function () {
      // Tính toán tỷ lệ giữ nguyên tỉ lệ ảnh
      let width = img.width;
      let height = img.height;
      const scale = Math.min(maxSize / width, maxSize / height);
      width = width * scale;
      height = height * scale;

      // Tạo canvas và resize ảnh
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      try {
        const dataURL = canvas.toDataURL("image/jpeg", 0.8); // Nén ảnh
        const base64 = dataURL.split(",")[1]; // Bỏ phần đầu data:image/jpeg;base64,
        resolve(base64);
      } catch (err) {
        reject("Không thể chuyển ảnh thành base64.");
      }
    };

    img.onerror = function () {
      reject("Không thể tải ảnh từ URL.");
    };

    img.src = url;
  });
}


async function generateVcard() {
  console.log("generateVcard được gọi");

  const elements = {
    name: document.getElementById('previewName'),
    phone: document.getElementById('previewPhone'),
    email: document.getElementById('previewEmail'),
    address: document.getElementById('previewAddress'),
    company: document.getElementById('previewCompany'),
    website: document.getElementById('previewWebsite'),
    avatar: document.getElementById('previewAvatar'),
    socialsContainer: document.getElementById('previewSocials')
  };

  const missingElements = Object.entries(elements)
    .filter(([_, el]) => !el)
    .map(([key]) => key);

  if (missingElements.length > 0) {
    console.error("Các phần tử DOM bị thiếu khi tạo vCard:", missingElements);
    alert("Không thể tạo vCard do thiếu thông tin.");
    return;
  }

  const vcardData = {
    name: sanitizeVcardData(elements.name.textContent),
    phone: sanitizeVcardData(elements.phone.textContent),
    email: sanitizeVcardData(elements.email.textContent),
    address: sanitizeVcardData(elements.address.textContent),
    company: sanitizeVcardData(elements.company.textContent),
    website: sanitizeVcardData(elements.website.href)
  };

  // Lấy avatar base64 nếu có
  let base64Photo = "";
  if (elements.avatar && elements.avatar.src) {
    try {
      base64Photo = await imageUrlToBase64(elements.avatar.src);
    } catch (err) {
      console.warn("Không thể chuyển ảnh sang base64:", err);
    }
  }

  // 🔁 Lấy mạng xã hội từ previewSocials
  let socialItems = '';
  const socialLinks = elements.socialsContainer.querySelectorAll('a');
  let counter = 1;
  socialLinks.forEach(link => {
    const url = link.href;
    const platformClass = [...link.classList].find(cls => cls !== 'social-link');
    const label = platformClass ? platformClass.charAt(0).toUpperCase() + platformClass.slice(1) : 'Social';

    if (url) {
      socialItems += `item${counter}.URL:${url}\n`;
      socialItems += `item${counter}.X-ABLabel:${label}\n`;
      counter++;
    }
  });

  if (!vcardData.name && !vcardData.email && !vcardData.phone) {
    alert("Không có thông tin liên lạc để lưu.");
    return;
  }

  // ✨ Tạo nội dung vCard
  const vCard = `
BEGIN:VCARD
VERSION:3.0
N:;${vcardData.name};;;
FN:${vcardData.name}
ORG:${vcardData.company}
TEL;TYPE=WORK,CELL:${vcardData.phone}
EMAIL;TYPE=INTERNET:${vcardData.email}
ADR;TYPE=HOME:;;${vcardData.address}
URL:${vcardData.website}
${socialItems.trim()}
${base64Photo ? `PHOTO;ENCODING=b;TYPE=JPEG:${base64Photo}` : ""}
END:VCARD
  `.trim();

  // 📁 Tải file vCard
  try {
    const blob = new Blob([vCard], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const fileName = vcardData.name ? `${vcardData.name}-vCard.vcf` : 'contact.vcf';

    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isAndroid = /Android/i.test(navigator.userAgent);

    if (isIOS) {
      window.location.href = url;
    } else if (isAndroid) {
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => {
        alert("Nếu danh bạ không tự động mở, vui lòng vào thư mục Downloads và mở file .vcf.");
      }, 2000);
    } else {
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      alert("Contact saved successfully!");
    }
  } catch (error) {
    console.error("Lỗi khi tạo vCard:", error);
    alert("An error occurred while saving the contact.");
  }
}


// Download QR code
document.getElementById("downloadQR").addEventListener("click", () => {
  const canvas = document.querySelector("#qrCode canvas");
  if (!canvas) return alert("Không tìm thấy mã QR!");

  const link = document.createElement("a");
  link.download = "qr-code.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});


// ✅ Hàm tạo và hiển thị mã QR trong modal
function generateQrCode() {
  const qrModal = document.getElementById("qrModal");
  const qrCodeDiv = document.getElementById("qrCode");
  const showQrBtn = document.getElementById("showQrBtn");

  if (!qrModal || !qrCodeDiv || !showQrBtn) {
    console.error("Không tìm thấy các phần tử cần thiết cho mã QR.");
    return;
  }

  // Đảm bảo modal ẩn khi khởi tạo
  qrModal.style.display = "none";

  // Lấy URL hiện tại
  const currentUrl = window.location.href;
  if (!currentUrl) {
    console.error("Không thể lấy URL hiện tại.");
    return;
  }

  // Xóa nội dung cũ và tạo mã QR
  qrCodeDiv.innerHTML = "";
  new QRCode(qrCodeDiv, {
    text: currentUrl,
    width: 170,
    height: 170,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  });

  // Gắn sự kiện hiển thị modal
  showQrBtn.addEventListener("click", () => {
    console.log("Nút QR được nhấp, hiển thị modal");
    qrModal.style.display = "flex";
  });

  // Đóng modal khi nhấp ra ngoài
  qrModal.addEventListener("click", (e) => {
    if (e.target === qrModal) {
      console.log("Nhấp ra ngoài modal, ẩn modal");
      qrModal.style.display = "none";
    }
  });
}

// ✅ Xử lý DOM Loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded kích hoạt");

  const elements = {
    previewAvatar: document.getElementById("previewAvatar"),
    previewName: document.getElementById("previewName"),
    previewEmail: document.getElementById("previewEmail"),
    previewPhone: document.getElementById("previewPhone"),
    previewAddress: document.getElementById("previewAddress"),
    previewCompany: document.getElementById("previewCompany"),
    previewWebsite: document.getElementById("previewWebsite"),
    previewSocials: document.getElementById("previewSocials"),
    verifiedBadgeModal: document.getElementById("verifiedBadgeModal"),
    saveToContactsBtn: document.getElementById("saveToContactsBtn"),
    showQrBtn: document.getElementById("showQrBtn"),
    qrModal: document.getElementById("qrModal")
  };

  if (!elements.saveToContactsBtn) {
    console.error("Không tìm thấy saveToContactsBtn trong DOM.");
    return;
  }
  if (!elements.showQrBtn || !elements.qrModal) {
    console.error("Không tìm thấy các phần tử cần thiết cho mã QR.");
    return;
  }

  console.log("Tất cả phần tử quan trọng được tìm thấy");

  elements.saveToContactsBtn.addEventListener("click", () => {
    console.log("saveToContactsBtn được click");
    generateVcard();
  });

  loadVcardData();
  generateQrCode(); // Chỉ khởi tạo mã QR, không hiển thị modal
});


// ✅ Hàm xử lý modal chia sẻ
async function handleContactModal() {
  const sharingModal = document.getElementById("sharingModal");
  const showContactBtn = document.getElementById("showContactBtn");
  const submitContactBtn = document.getElementById("submitContactBtn");
  const closeContactBtn = document.getElementById("closeContactBtn");
  const contactName = document.getElementById("contactName");
  const contactPhone = document.getElementById("contactPhone");
  const contactEmail = document.getElementById("contactEmail");
  const contactMessage = document.getElementById("contactMessage"); // 👈 sửa thành contactMessage

  if (!sharingModal || !showContactBtn || !submitContactBtn || !closeContactBtn || !contactName || !contactPhone || !contactEmail || !contactMessage) {
    console.error("Không tìm thấy các phần tử cần thiết cho modal chia sẻ:", {
      sharingModal: !!sharingModal,
      showContactBtn: !!showContactBtn,
      submitContactBtn: !!submitContactBtn,
      closeContactBtn: !!closeContactBtn,
      contactName: !!contactName,
      contactPhone: !!contactPhone,
      contactEmail: !!contactEmail,
      contactMessage: !!contactMessage
    });
    return;
  }

  console.log("Modal chia sẻ được khởi tạo thành công");
  sharingModal.style.display = "none";

  showContactBtn.addEventListener("click", () => {
    console.log("Nút chia sẻ được nhấp, hiển thị modal");
    sharingModal.style.display = "flex";
  });

  closeContactBtn.addEventListener("click", () => {
    sharingModal.style.display = "none";
    contactName.value = "";
    contactPhone.value = "";
    contactEmail.value = "";
    contactMessage.value = ""; // 👈 reset message
  });

  sharingModal.addEventListener("click", (e) => {
    if (e.target === sharingModal) {
      sharingModal.style.display = "none";
      contactName.value = "";
      contactPhone.value = "";
      contactEmail.value = "";
      contactMessage.value = ""; // 👈 reset message
    }
  });

  submitContactBtn.addEventListener("click", async () => {
    const name = contactName.value.trim();
    const phone = contactPhone.value.trim();
    const email = contactEmail.value.trim();
    const message = contactMessage.value.trim(); // 👈 lấy message
    const uid = getUidFromUrl();
    const publicKey = "c0pykJZDQk_GkjRbV";
    const serviceID = "service_2b5umi3";
    // Thêm phần xử lý kiểm tra và cập nhật giới hạn gửi hàng tháng
    const canSend = await checkAndUpdateMonthlyLimit(uid);
if (!canSend) return;


    if (!name || !phone || !email) {
      alert("Vui lòng nhập đầy đủ họ tên, số điện thoại và email.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Email không hợp lệ.");
      return;
    }
    if (!/^\+?\d{10,15}$/.test(phone)) {
      alert("Số điện thoại không hợp lệ.");
      return;
    }
    if (!uid || !db) {
      alert("Có lỗi xảy ra, vui lòng thử lại sau.");
      return;
    }

    try {
      submitContactBtn.disabled = true;
      submitContactBtn.textContent = "Đang gửi...";

      const vcardRef = db.collection('vcards').doc(uid);
      const vcardDoc = await vcardRef.get();
      if (!vcardDoc.exists || !vcardDoc.data().email) {
        alert("Không tìm thấy email vCard.");
        return;
      }

      const vcardEmail = vcardDoc.data().email;

      await db.collection('contacts').add({
        uid,
        name,
        phone,
        email,
        message, // 👈 lưu message vào Firestore
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });

      const vCard = `
BEGIN:VCARD
VERSION:3.0
N:;${name};;;
FN:${name}
TEL;TYPE=WORK,CELL:${phone}
EMAIL;TYPE=INTERNET:${email}
NOTE:${message}
END:VCARD
      `.trim();

      const recipientParams = {
        to_email: vcardEmail,
        to_name: vcardDoc.data().fullName || "Người nhận",
        name,
        phone,
        email,
        message,
        vcard_content: vCard
      };

      const senderParams = {
        to_email: email,
        to_name: name,
        name,
        phone,
        email,
        message,
        vcard_content: vCard
      };

      console.log("Gửi email tới người nhận...");
      await emailjs.send(serviceID, "template_6bxee9l", recipientParams, publicKey);
      console.log("Gửi email tới người gửi...");
      await emailjs.send(serviceID, "template_wvz0cco", senderParams, publicKey);

      alert("Thông tin đã được gửi thành công!");
      sharingModal.style.display = "none";
      contactName.value = "";
      contactPhone.value = "";
      contactEmail.value = "";
      contactMessage.value = ""; // 👈 reset message sau khi gửi
    } catch (error) {
      console.error("Lỗi khi gửi thông tin:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      submitContactBtn.disabled = false;
      submitContactBtn.textContent = "Gửi";
    }
  });

}


// ✅ Xử lý DOM Loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded kích hoạt");

  const elements = {
    previewAvatar: document.getElementById("previewAvatar"),
    previewName: document.getElementById("previewName"),
    previewEmail: document.getElementById("previewEmail"),
    previewPhone: document.getElementById("previewPhone"),
    previewAddress: document.getElementById("previewAddress"),
    previewCompany: document.getElementById("previewCompany"),
    previewWebsite: document.getElementById("previewWebsite"),
    previewSocials: document.getElementById("previewSocials"),
    verifiedBadgeModal: document.getElementById("verifiedBadgeModal"),
    saveToContactsBtn: document.getElementById("saveToContactsBtn"),
    showQrBtn: document.getElementById("showQrBtn"),
    qrModal: document.getElementById("qrModal"),
    showContactBtn: document.getElementById("showContactBtn"),
    sharingModal: document.getElementById("sharingModal")
  };

  if (!elements.saveToContactsBtn) {
    console.error("Không tìm thấy saveToContactsBtn trong DOM.");
    return;
  }
  if (!elements.showQrBtn || !elements.qrModal) {
    console.error("Không tìm thấy các phần tử cần thiết cho mã QR.");
    return;
  }
  if (!elements.showContactBtn || !elements.sharingModal) {
    console.error("Không tìm thấy các phần tử cần thiết cho modal chia sẻ:", {
      showContactBtn: !!elements.showContactBtn,
      sharingModal: !!elements.sharingModal
    });
    return;
  }

  console.log("Tất cả phần tử quan trọng được tìm thấy");

  elements.saveToContactsBtn.addEventListener("click", () => {
    console.log("saveToContactsBtn được click");
    generateVcard();
  });

  loadVcardData();
  generateQrCode();
  handleContactModal();
});



/// Coppy
document.querySelectorAll(".copy-btn").forEach(button => {
  button.addEventListener("click", () => {
    const targetId = button.dataset.target;
    const targetElement = document.getElementById(targetId);

    if (!targetElement) {
      alert("Không tìm thấy phần tử cần sao chép.");
      return;
    }

    const text = targetElement.textContent.trim();

    if (!text) {
      alert("Không có nội dung để sao chép.");
      return;
    }

    navigator.clipboard.writeText(text)
      .then(() => alert("Đã sao chép thành công!"))
      .catch(err => {
        console.error("Lỗi khi sao chép:", err);
        alert("Sao chép thất bại.");
      });
  });
});




// Xử lý số lượt truy cập hồ sơ
// Firebase đã được khởi tạo từ trước
const params = new URLSearchParams(window.location.search);
const uid = params.get("uid");

function shouldCountView(uid) {
  const lastViewTime = localStorage.getItem(`lastView_${uid}`);
  const now = Date.now();

  if (!lastViewTime || now - parseInt(lastViewTime) > 10 * 60 * 1000) {
    localStorage.setItem(`lastView_${uid}`, now.toString());
    return true;
  }
  return false;
}

function formatViewCount(count) {
  if (count < 1000) return count.toString();
  if (count < 1000000) return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return (count / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
}

async function handleViewCount(uid) {
  const userRef = db.collection("users").doc(uid);

  try {
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      console.warn("Không tìm thấy người dùng");
      return;
    }

    const data = userDoc.data();
    const currentCount = data.viewCount || 0;
    const showView = data.showViewCount ?? true; // Mặc định là true nếu chưa có

    // Ẩn/hiện phần hiển thị
    const viewSection = document.getElementById("viewCountDisplay");
    if (viewSection) {
      viewSection.style.display = showView ? "inline-flex" : "none";
    }

    // Cập nhật số lượt truy cập nếu cần
    if (shouldCountView(uid)) {
      await db.runTransaction(async (transaction) => {
        const doc = await transaction.get(userRef);
        if (!doc.exists) return;
        const current = doc.data().viewCount || 0;
        transaction.update(userRef, { viewCount: current + 1 });
      });
      console.log("Đã tăng viewCount");
    }

    // Luôn cập nhật số lượt hiện tại (kể cả không tăng)
    const updatedDoc = await userRef.get();
    const updatedCount = updatedDoc.data().viewCount || 0;
    const displayEl = document.getElementById("viewCountNumber");
    if (displayEl) {
      displayEl.innerText = formatViewCount(updatedCount);
    }
  } catch (err) {
    console.error("Lỗi khi xử lý lượt xem:", err);
  }
}

if (uid) {
  handleViewCount(uid);
}



// Animation loading
const animation = lottie.loadAnimation({
  container: document.getElementById('lottieAnimation'),
  renderer: 'svg',
  loop: true,
  autoplay: true,
  path: '/animations/loader.json' // Đường dẫn đúng đến file JSON
});

// Tự động dừng và ẩn animation + overlay sau 3 giây
setTimeout(() => {
  animation.stop(); // Dừng animation
  document.getElementById('lottieAnimation').style.display = 'none'; // Ẩn animation

  const overlay = document.getElementById('loadingOverlay');
  overlay.style.opacity = '0'; // Cho hiệu ứng mượt
  overlay.style.transition = 'opacity 0.5s ease';

  // Sau khi hiệu ứng mờ hoàn tất, ẩn hẳn overlay
  setTimeout(() => {
    overlay.style.display = 'none';
  }, 500); // trùng với thời gian transition
}, 3000);



// Hàm lấy UID từ URL (ví dụ: ?uid=abc123)
function getUidFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("uid");
}

// Hiển thị tên gói theo uid
function showUserPackage(uid) {
  const container = document.getElementById("userPackage");
  const labelText = container.querySelector(".label-text");

  const iconMap = {
    basic: "fa-check-circle",
    standard: "fa-medal",
    pro: "fa-rocket",
    enterprise: "fa-crown",
    unknown: "fa-question-circle"
  };

  // Tìm package trong activation_codes trước
  firebase.firestore()
    .collection("activation_codes")
    .where("uid", "==", uid)
    .get()
    .then(async (querySnapshot) => {
      if (!querySnapshot.empty) {
        // Nếu tìm được trong activation_codes
        const doc = querySnapshot.docs[0];
        const rawPackage = doc.data().package || "unknown";
        const packageName = rawPackage.toLowerCase();

        container.className = `package-label ${packageName}`;
        const iconClass = iconMap[packageName] || iconMap.unknown;
        labelText.innerHTML = `<i class="fa-solid ${iconClass} fa-xs" style="margin-right:6px;"></i>${rawPackage}`;
      } else {
        // Nếu không tìm thấy trong activation_codes thì lấy từ users/{uid}
        try {
          const userDoc = await firebase.firestore().collection("users").doc(uid).get();
          if (userDoc.exists && userDoc.data().package) {
            const rawPackage = userDoc.data().package || "unknown";
            const packageName = rawPackage.toLowerCase();

            container.className = `package-label ${packageName}`;
            const iconClass = iconMap[packageName] || iconMap.unknown;
            labelText.innerHTML = `<i class="fa-solid ${iconClass} fa-xs" style="margin-right:6px;"></i>${rawPackage}`;
          } else {
            // Không tìm thấy package ở cả hai nơi
            container.className = "package-label unknown";
            labelText.innerHTML = `<i class="fa-solid ${iconMap.unknown} fa-xs" style="margin-right:6px;"></i>Không xác định`;
          }
        } catch (error) {
          console.error("Lỗi lấy package từ users:", error);
          container.className = "package-label unknown";
          labelText.innerHTML = `<i class="fa-solid ${iconMap.unknown} fa-xs" style="margin-right:6px;"></i>Lỗi tải gói`;
        }
      }
    })
    .catch((error) => {
      console.error("Lỗi lấy package từ activation_codes:", error);
      container.className = "package-label unknown";
      labelText.innerHTML = `<i class="fa-solid ${iconMap.unknown} fa-xs" style="margin-right:6px;"></i>Lỗi tải gói`;
    });
}



// Khi trang load, lấy UID và hiển thị gói
window.addEventListener("DOMContentLoaded", () => {
  const uid = getUidFromUrl();
  if (uid) {
    showUserPackage(uid);
  } else {
    document.getElementById("userPackage").textContent = "Không có UID trong URL.";
  }
});





// Hàm hiển thị chức năng theo gói
async function checkUserPackageAndShowButton(uid) {
  const btn = document.getElementById("showContactBtn");
  if (!btn) return; // Nếu không có nút thì thôi

  if (!uid) {
    btn.style.display = "none";
    return;
  }

  try {
    const userDoc = await firebase.firestore().collection("users").doc(uid).get();
    if (!userDoc.exists) {
      btn.style.display = "none";
      return;
    }

    const packageName = (userDoc.data().package || "").toLowerCase();
    // if (["standard", "pro", "enterprise"].includes(packageName))
     if (packageName === "pro" || packageName === "enterprise") {
      btn.style.display = "inline-block";
    } else {
      btn.style.display = "none";
    }
  } catch (error) {
    console.error("Lỗi lấy thông tin package:", error);
    btn.style.display = "none";
  }
}

// Khi trang load, ưu tiên lấy UID từ URL, nếu không có thì lấy user đăng nhập
window.addEventListener("DOMContentLoaded", () => {
  const uidFromUrl = getUidFromUrl(); // Hàm bạn đã định nghĩa ở trên
  if (uidFromUrl) {
    checkUserPackageAndShowButton(uidFromUrl);
  } else {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        checkUserPackageAndShowButton(user.uid);
      } else {
        const btn = document.getElementById("showContactBtn");
        if (btn) btn.style.display = "none";
      }
    });
  }
});


// Xử lý giới hạn gửi từng gói
const PACKAGE_LIMITS = {
  basic: 1,
  standard: 100,
  pro: 200,
  enterprise: 500
};

// Hàm lấy UID từ URL
function getUidFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("uid");
}

//Hàm hiển thị số lượt còn lại
async function showRemainingQuota(uid) {
  const userRef = firebase.firestore().collection("users").doc(uid);
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  try {
    const doc = await userRef.get();
    if (!doc.exists) {
      document.getElementById("remainingQuota").textContent = "Không tìm thấy dữ liệu người dùng.";
      return;
    }

    const data = doc.data();
    const userPackage = (data.package || "basic").toLowerCase();
    const limit = PACKAGE_LIMITS[userPackage] ?? 0;

    let sentCount = data.sentCount || 0;
    const lastResetMonth = data.lastResetMonth || "";

    if (lastResetMonth !== currentMonth) {
      sentCount = 0;
      await userRef.update({
        sentCount: 0,
        lastResetMonth: currentMonth
      });
    }

    const remaining = limit === Infinity ? "∞" : Math.max(limit - sentCount, 0);
    document.getElementById("remainingQuota").textContent = `Lượt còn lại trong tháng: ${remaining}`;
  } catch (err) {
    console.error("Lỗi khi hiển thị quota:", err);
    document.getElementById("remainingQuota").textContent = "Không thể hiển thị lượt còn lại.";
  }
}
// Tự động gọi lại trang
document.addEventListener("DOMContentLoaded", () => {
  const uid = getUidFromUrl();
  if (uid) {
    showRemainingQuota(uid);
  } else {
    document.getElementById("remainingQuota").textContent = "Không có UID.";
  }
});

// Hàm kiểm tra và cập nhật lượt gửi
async function checkAndUpdateMonthlyLimit(uid) {
  const userRef = firebase.firestore().collection("users").doc(uid);
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  try {
    const doc = await userRef.get();
    if (!doc.exists) throw new Error("Không tìm thấy người dùng.");

    const data = doc.data();
    const userPackage = (data.package || "basic").toLowerCase();
    const limit = PACKAGE_LIMITS[userPackage] ?? 0;

    let sentCount = data.sentCount || 0;
    const lastResetMonth = data.lastResetMonth || "";

    // Nếu đã qua tháng mới thì reset
    if (lastResetMonth !== currentMonth) {
      sentCount = 0;
      await userRef.update({
        sentCount: 0,
        lastResetMonth: currentMonth
      });
    }

    const remaining = limit === Infinity ? "∞" : Math.max(limit - sentCount, 0);
    document.getElementById("remainingQuota").textContent = `Lượt còn lại trong tháng: ${remaining}`;

    if (limit !== Infinity && sentCount >= limit) {
      alert("Bạn đã sử dụng hết lượt gửi trong tháng này.");
      return false;
    }

    // Nếu gửi hợp lệ, cập nhật +1
    await userRef.update({
      sentCount: firebase.firestore.FieldValue.increment(1),
      lastResetMonth: currentMonth
    });

    return true;
  } catch (err) {
    console.error("Lỗi khi kiểm tra giới hạn gửi theo tháng:", err);
    alert("Có lỗi khi kiểm tra giới hạn gửi.");
    return false;
  }
}

