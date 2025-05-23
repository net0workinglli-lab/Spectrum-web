// ✅ CONFIG FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyBN_gVKsQiqyQeJYAJUpRrr06NGdq4Ld6U",
  authDomain: "netzeroworking.firebaseapp.com",
  projectId: "netzeroworking",
  storageBucket: "netzeroworking.firebasestorage.app",
  messagingSenderId: "804064394134",
  appId: "1:804064394134:web:aa0abd6241c769a96cbbb7"
};

// Khởi tạo Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// ✅ Hàm chung để quản lý modal
function toggleModal(modalId, show) {
  const modal = document.getElementById(modalId);
  if (!modal) {
    console.error(`Không tìm thấy modal với ID: ${modalId}`);
    return;
  }
  document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
  if (show) modal.classList.remove('hidden');
  else modal.classList.add('hidden');
}


// ✅ Kiểm tra URL hợp lệ
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

// ✅ Xử lý DOM Loaded
document.addEventListener("DOMContentLoaded", () => {
  // DOM ELEMENTS
  const elements = {
    loginForm: document.getElementById("loginForm"),
    loginBtn: document.getElementById("loginBtn"),
    logoutBtn: document.getElementById("logoutBtn"),
    userPanel: document.getElementById("userPanel"),
    userInfo: document.getElementById("userInfo"),
    vcardForm: document.getElementById("vcardForm"),
    saveBtn: document.getElementById("saveBtn"),
    viewBtn: document.getElementById("viewVcardBtn"),
    modal: document.getElementById("vcardModal"),
    closeModal: document.getElementById("closeVcard"),
    shareVcardLinkBtn: document.getElementById("shareVcardLink"),
    openEditBtn: document.getElementById("openEditModal"),
    closeEditBtn: document.getElementById("closeEditModal"),
    editModal: document.getElementById("editModal"),
    openSocialModal: document.getElementById("openSocialModal"),
    closeSocialModal: document.getElementById("closeSocialModal"),
    saveSocialLinksBtn: document.getElementById("saveSocialLinks"),
    avatarUpload: document.getElementById("avatarUpload"),
    avatarPreview: document.getElementById("avatarPreview")
  };

  // Kiểm tra và log phần tử bị thiếu
  const missingElements = Object.entries(elements)
    .filter(([key, value]) => !value)
    .map(([key]) => key);

  if (missingElements.length > 0) {
    console.error("Các phần tử DOM bị thiếu:", missingElements);
    return;
  }

  // Gán biến
  const {
    loginForm,
    loginBtn,
    logoutBtn,
    userPanel,
    userInfo,
    vcardForm,
    saveBtn,
    viewBtn,
    modal,
    closeModal,
    shareVcardLinkBtn,
    openEditBtn,
    closeEditBtn,
    editModal,
    openSocialModal,
    closeSocialModal,
    saveSocialLinksBtn,
    avatarUpload,
    avatarPreview
  } = elements;

  // Đăng nhập
  loginBtn.addEventListener("click", async () => {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("password").value.trim();
    if (!email || !password) return alert("Please enter your email and password.");

    try {
      await auth.signInWithEmailAndPassword(email, password);
      // alert("Login successful!");
    } catch (err) {
      alert("Login failed: " + err.message);
    }
  });

  // Đăng ký (1)
  const registerBtn = document.getElementById("registerBtn");
registerBtn.addEventListener("click", async () => {
  const email = document.getElementById("registerEmail").value.trim();
  const password = document.getElementById("registerPassword").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();
  const activationCode = document.getElementById("activationCode").value.trim().toUpperCase();

  // Kiểm tra cơ bản
  if (!email || !password || !confirmPassword || !activationCode) {
    return alert("Please fill in all required information.");
  }

  if (password !== confirmPassword) {
    return alert("Passwords do not match.");
  }

  try {
    const codeRef = firestore.collection("activation_codes").doc(activationCode);
    const codeSnap = await codeRef.get();

    // Kiểm tra mã xác nhận tồn tại
    if (!codeSnap.exists) {
      return alert("Incorrect verification code.");
    }

    const codeData = codeSnap.data();

    if (codeData.used) {
      return alert("The confirmation code has already been used.");
    }

    // Tạo tài khoản
    const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // Đánh dấu mã đã dùng
    await codeRef.update({
  used: true,
  usedBy: email,
  usedAt: firebase.firestore.FieldValue.serverTimestamp(),
  uid: user.uid, // <-- dòng này rất quan trọng
});


    // Lưu trạng thái đồng ý điều khoản vào Firestore collection "users"
    const userRef = firestore.collection("users").doc(user.uid);
    await userRef.set({
      email: email,
      agreedToTerms: true,
      agreedAt: firebase.firestore.FieldValue.serverTimestamp(),
      termsVersion: "v1.0", // bạn đổi version điều khoản nếu cần
    }, { merge: true });


    alert("Sign-up completed successfully!");
  } catch (err) {
    console.error(err);
    alert("Failed to register. Please try again: " + err.message);
  }
});

// Tạo mã xác nhận (1)
const firestore = firebase.firestore();
const auth = firebase.auth();

// Kiểm tra người dùng đăng nhập
const checkUserLogin = async () => {
  const user = firebase.auth().currentUser;

  // Nếu không có người dùng đăng nhập, không thực hiện gì cả
  if (!user) {
    showAlert("You must log in to access the admin panel.");
    return;
  }

  // Kiểm tra email của người dùng
  if (user.email === "nguyenphuocsang0303@gmail.com") {
    // Hiển thị nút Tạo mã nếu đúng email
    document.getElementById("generateCodeBtn").style.display = "inline-block";
  } else {
    // Nếu không phải email này, ẩn nút
    document.getElementById("generateCodeBtn").style.display = "none";
  }
};

// Tạo mã xác nhận (1)
// Hàm tạo mã ngẫu nhiên
const generateCode = (length = 8) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Ghi link NFC redirect dạng /u/{code}
const baseUrl = "https://netzeroworking.web.app/u/";

// Hàm tạo nhiều mã với gói đăng ký
const createMultipleActivationCodes = async (quantity = 1, length = 8, selectedPackage = "Basic") => {
  const batch = firestore.batch();

  for (let i = 0; i < quantity; i++) {
    const code = generateCode(length);
    const codeRef = firestore.collection("activation_codes").doc(code);
    const nfcLink = `${baseUrl}${code}`;

    batch.set(codeRef, {
      code,
      used: false,
      usedBy: null,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      nfcLink,
      uid: null,
      package: selectedPackage // Lưu gói
    });
  }

  try {
    await batch.commit();
    alert(`Đã tạo ${quantity} mã xác nhận với gói ${selectedPackage}.`);
    closeCreateCodeModal();
  } catch (error) {
    console.error("Lỗi khi tạo mã:", error);
    alert("Đã xảy ra lỗi khi tạo mã.");
  }
};

// Mở và đóng modal
const openCreateCodeModal = () => {
  document.getElementById("createCodeModal").classList.remove("hidden");
};
const closeCreateCodeModal = () => {
  document.getElementById("createCodeModal").classList.add("hidden");
};

// Nút mở modal
document.getElementById("generateCodeBtn").addEventListener("click", openCreateCodeModal);

// Nút đóng modal
document.getElementById("closeCreateCodeModal").addEventListener("click", closeCreateCodeModal);

// Nút tạo mã
document.getElementById("createCodeBtn").addEventListener("click", () => {
  const quantity = parseInt(document.getElementById("codeQuantity").value) || 1;
  const selectedPackage = document.getElementById("packageSelect").value;
  createMultipleActivationCodes(quantity, 8, selectedPackage);
});

// Chỉ admin được tạo mã
firebase.auth().onAuthStateChanged((user) => {
  const btn = document.getElementById("generateCodeBtn");
  if (user && user.email === "nguyenphuocsang0303@gmail.com") {
    btn.style.display = "inline-block";
  } else {
    btn.style.display = "none";
  }
});


// Hiển thị modal danh sách mã (2)
// Hàm mở modal danh sách mã
const openCodeListModal = () => {
  document.getElementById("codeListModal").classList.remove("hidden");
  loadActivationCodes(); // Tải danh sách mã khi modal mở
};

// Hàm đóng modal danh sách mã
const closeCodeListModal = () => {
  document.getElementById("codeListModal").classList.add("hidden");
};

// Tải danh sách mã từ Firestore và hiển thị
const loadActivationCodes = async () => {
  const tbody = document.getElementById("codeListTableBody");
  tbody.innerHTML = "<tr><td colspan='5'>Đang tải...</td></tr>"; // 5 cột

  try {
    const snapshot = await firestore
      .collection("activation_codes")
      .orderBy("createdAt", "desc")
      .get();

    if (snapshot.empty) {
      tbody.innerHTML = "<tr><td colspan='5'>Chưa có mã nào.</td></tr>";
      return;
    }

    tbody.innerHTML = ""; // Xóa "Đang tải..." trước khi thêm dữ liệu
    snapshot.forEach(doc => {
      const data = doc.data();
      const row = document.createElement("tr");

      const nfcLink = `https://netzeroworking.web.app/u/${data.code}`;

      row.innerHTML = `
        <td>${data.code}</td>
        <td style="color: ${data.used ? 'red' : 'green'};">
          ${data.used ? 'Used' : 'Available'}
        </td>
        <td>${data.usedBy || '-'}</td>
        <td>${data.createdAt?.toDate().toLocaleString() || '-'}</td>
        <td><a href="${nfcLink}" target="_blank">${nfcLink}</a></td>
      `;
      tbody.appendChild(row);
    });
  } catch (error) {
    console.error("Lỗi khi tải danh sách mã:", error);
    tbody.innerHTML = "<tr><td colspan='5'>Lỗi khi tải danh sách.</td></tr>";
  }
};


// Kiểm tra trạng thái người dùng đăng nhập và hiển thị nút chỉ cho người có email nhất định
firebase.auth().onAuthStateChanged((user) => {
  const showCodeListBtn = document.getElementById("showCodeListBtn");

  if (showCodeListBtn) {
    if (user?.email === "nguyenphuocsang0303@gmail.com") {
      showCodeListBtn.style.display = "inline-block"; // Hiển thị nút nếu đúng email
    } else {
      showCodeListBtn.style.display = "none"; // Ẩn nút nếu không đúng email
    }
  }
});

// Sự kiện mở modal danh sách mã
document.getElementById("showCodeListBtn").addEventListener("click", () => {
  openCodeListModal();
});

// Sự kiện đóng modal danh sách mã
document.getElementById("closeCodeListModal").addEventListener("click", () => {
  closeCodeListModal();
});

// Tải xuống danh sách mã
document.getElementById("exportExcelBtn").addEventListener("click", () => {
  const table = document.getElementById("codeListTableBody");
  const rows = Array.from(table.querySelectorAll("tr"));

  // Header có thêm cột NFC Link
  const data = [["Code", "Status", "User", "Date Created", "NFC Link"]];

  rows.forEach(row => {
    const cols = row.querySelectorAll("td");
    if (cols.length >= 5) {
      data.push([
        cols[0].innerText, // Code
        cols[1].innerText, // Status
        cols[2].innerText, // User
        cols[3].innerText, // Date Created
        cols[4].innerText  // NFC Link (dạng URL)
      ]);
    }
  });

  const worksheet = XLSX.utils.aoa_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "DanhSachMa");

  XLSX.writeFile(workbook, "danh_sach_ma.xlsx");
});


// Modal đăng ký (3)
const signupModal = document.getElementById("signup");
const openSignupBtn = document.getElementById("openSignup"); // Nút mở modal đăng ký
const closeSignupBtn = document.getElementById("closeSignup");

// Mở modal đăng ký
openSignupBtn.addEventListener("click", () => {
  signupModal.classList.remove("hidden");
});

// Đóng modal đăng ký
closeSignupBtn.addEventListener("click", () => {
  signupModal.classList.add("hidden");
});

// Đóng khi click ra ngoài modal-content
window.addEventListener("click", (event) => {
  if (event.target === signupModal) {
    signupModal.classList.add("hidden");
  }
});

  // Đăng xuất
  logoutBtn.addEventListener("click", async () => {
    try {
      await auth.signOut();
      alert("You have been logged out!");
    } catch (err) {
      alert("An error occurred while logging out: " + err.message);
    }
  });

  // Theo dõi trạng thái đăng nhập
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      loginForm.style.display = "none";
      userPanel.classList.remove("hidden");

      const userRef = db.collection('users').doc(user.uid);
      const vcardRef = db.collection('vcards').doc(user.uid);

      // Gộp truy vấn Firestore để tối ưu hiệu suất
      const [userDoc, vcardDoc] = await Promise.all([userRef.get(), vcardRef.get()]);

      // Nếu chưa có thông tin user trong collection 'users', tạo mới
      if (!userDoc.exists) {
        await userRef.set({
          uid: user.uid,
          name: user.displayName || "No Name",
          email: user.email,
          photoURL: user.photoURL || "",
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
      }

      // Hiển thị verified badge
      showVerifiedBadge(userDoc.data());

      // Load dữ liệu vCard từ Firestore
      // === Load dữ liệu vCard từ Firestore (cả main + alt) ===
if (vcardDoc.exists) {
  const data = vcardDoc.data();

  // Main language
  document.getElementById("fullName").value = data.fullName || "";
  document.getElementById("vcardEmail").value = data.email || "";
  document.getElementById("phone").value = data.phone || "";
  document.getElementById("address").value = data.address || "";
  document.getElementById("company").value = data.company || "";
  document.getElementById("website").value = data.website || "";
  avatarPreview.src = data.avatarUrl || "";
  avatarPreview.setAttribute("data-uploaded-url", data.avatarUrl || "");
  document.getElementById("userFullName").textContent = data.fullName || "";
  document.getElementById("userCompany").textContent = data.company || "";

  // Alt language
  const altLang = data.altLang || {};
  document.getElementById("fullName_alt").value = altLang.fullName || "";
  document.getElementById("vcardEmail_alt").value = altLang.email || "";
  document.getElementById("phone_alt").value = altLang.phone || "";
  document.getElementById("address_alt").value = altLang.address || "";
  document.getElementById("company_alt").value = altLang.company || "";
  document.getElementById("website_alt").value = altLang.website || "";

  // Vô hiệu hóa form sau khi load
  vcardForm.querySelectorAll('input').forEach(input => input.disabled = true);
  saveBtn.textContent = "Edit";
}


      // Load liên kết mạng xã hội
      loadSocialLinks();
    } else {
      loginForm.style.display = "block";
      userPanel.classList.add("hidden");
      userInfo.textContent = "";
    }
  });

  // Danh bạ thứ 2
  const tabPrimary = document.getElementById("tabPrimary");
const tabSecondary = document.getElementById("tabSecondary");
const primaryTab = document.getElementById("primaryInfoTab");
const secondaryTab = document.getElementById("secondaryInfoTab");

tabPrimary.addEventListener("click", () => {
  tabPrimary.classList.add("active");
  tabSecondary.classList.remove("active");
  primaryTab.style.display = "block";
  secondaryTab.style.display = "none";
});

tabSecondary.addEventListener("click", () => {
  tabSecondary.classList.add("active");
  tabPrimary.classList.remove("active");
  secondaryTab.style.display = "block";
  primaryTab.style.display = "none";
});


  // ✅ Lưu hoặc cập nhật thông tin vCard
  // === Lưu hoặc cập nhật thông tin vCard (cả main + alt) ===
saveBtn.addEventListener("click", async (event) => {
  event.preventDefault();

  if (saveBtn.textContent === "Edit") {
    vcardForm.querySelectorAll('input').forEach(input => input.disabled = false);
    saveBtn.textContent = "Save information";
    return;
  }

  // Ngôn ngữ chính
  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("vcardEmail").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();
  const company = document.getElementById("company").value.trim();
  const website = document.getElementById("website").value.trim();

  // Ngôn ngữ phụ
  const fullNameAlt = document.getElementById("fullName_alt").value.trim();
  const emailAlt = document.getElementById("vcardEmail_alt").value.trim();
  const phoneAlt = document.getElementById("phone_alt").value.trim();
  const addressAlt = document.getElementById("address_alt").value.trim();
  const companyAlt = document.getElementById("company_alt").value.trim();
  const websiteAlt = document.getElementById("website_alt").value.trim();

  const avatarUrl = avatarPreview.getAttribute("data-uploaded-url") || "";

  if (!fullName || !email) {
    return alert("Please provide your full name and email address.");
  }

  const user = auth.currentUser;
  if (!user) return alert("You need to log in first.");

  const userInfo = {
    fullName,
    email,
    phone,
    address,
    company,
    website,
    avatarUrl,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),

    altLang: {
      fullName: fullNameAlt,
      email: emailAlt,
      phone: phoneAlt,
      address: addressAlt,
      company: companyAlt,
      website: websiteAlt
    }
  };

  try {
    await db.collection('vcards').doc(user.uid).set(userInfo);
    alert("Information has been saved!");
    vcardForm.querySelectorAll('input').forEach(input => input.disabled = true);
    saveBtn.textContent = "Edit";
  } catch (error) {
    console.error("Error saving information:", error);
    alert("Failed to save information.");
  }
});



  // ✅ Xem vCard
viewBtn.addEventListener('click', () => {
  // Main language
  document.getElementById('previewAvatar').src = avatarPreview.src || '';
  document.getElementById('previewName').textContent = document.getElementById('fullName').value || 'Chưa nhập tên';
  document.getElementById('previewEmail').textContent = document.getElementById('vcardEmail').value || '';
  document.getElementById('previewPhone').textContent = document.getElementById('phone').value || '';
  document.getElementById('previewAddress').textContent = document.getElementById('address').value || '';
  document.getElementById('previewCompany').textContent = document.getElementById('company').value || '';

  const website = document.getElementById('website').value;
  const websiteLink = document.getElementById('previewWebsite');
  websiteLink.href = website || '#';
  websiteLink.textContent = website || 'No website';

  // Alt language
  document.getElementById('previewAltName').textContent = document.getElementById('fullName_alt').value || '';
  document.getElementById('previewAltEmail').textContent = document.getElementById('vcardEmail_alt').value || '';
  document.getElementById('previewAltPhone').textContent = document.getElementById('phone_alt').value || '';
  document.getElementById('previewAltAddress').textContent = document.getElementById('address_alt').value || '';
  document.getElementById('previewAltCompany').textContent = document.getElementById('company_alt').value || '';

  const altWebsite = document.getElementById('website_alt').value;
  const altWebsiteLink = document.getElementById('previewAltWebsite');
  altWebsiteLink.href = altWebsite || '#';
  altWebsiteLink.textContent = altWebsite || 'No website';

  toggleModal('vcardModal', true);
});


// ✅ Đóng modal
closeModal.addEventListener('click', () => {
  toggleModal('vcardModal', false);
});

// === Xử lý chuyển tab (giữ 1 đoạn code gọn) ===
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    // Bỏ active khỏi tất cả button và tab-content
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));

    // Thêm active cho tab được chọn
    btn.classList.add('active');
    const tabId = btn.getAttribute('data-tab');
    document.getElementById(tabId).classList.add('active');
  });
});

// Toogle tab indicator
const toggle = document.getElementById('tabToggle');
const toggleLabel = document.getElementById('toggleLabel');
const mainTab = document.getElementById('mainTab');
const altTab = document.getElementById('altTab');

toggle.addEventListener('click', () => {
  const isActive = toggle.classList.toggle('active');

  // Toggle hiển thị tab
  mainTab.classList.toggle('active', !isActive);
  altTab.classList.toggle('active', isActive);

  // Cập nhật tiêu đề động
  toggleLabel.textContent = isActive ? 'Alt' : 'Primary';
});





  // ✅ Sao chép URL vCard
  shareVcardLinkBtn.addEventListener("click", async () => {
    const user = auth.currentUser;
    if (!user) return alert("Bạn chưa đăng nhập!");

    const vcardLink = `${window.location.origin}/vcard.html?uid=${user.uid}`;
    try {
      await navigator.clipboard.writeText(vcardLink);
      alert("The vCard link has been copied to your clipboard!");
    } catch (error) {
      console.error("Failed to copy the link:", error);
      alert("Failed to copy the link!");
    }
  });

  // ✅ Modal chỉnh sửa thông tin
  openEditBtn.addEventListener("click", () => toggleModal("editModal", true));
  closeEditBtn.addEventListener("click", () => toggleModal("editModal", false));

  // Đóng modal khi click bên ngoài
  window.addEventListener("click", (e) => {
    if (e.target === editModal) toggleModal("editModal", false);
    if (e.target === modal) toggleModal("vcardModal", false);
    if (e.target === document.getElementById("socialModal")) toggleModal("socialModal", false);
  });

  // ✅ Modal mạng xã hội
  openSocialModal.addEventListener("click", () => {
    loadSocialLinks();
    toggleModal("socialModal", true);
  });

  closeSocialModal.addEventListener("click", () => toggleModal("socialModal", false));

  saveSocialLinksBtn.addEventListener("click", saveSocialLinks);
});

// ✅ Hàm hiển thị Verified Badge
function showVerifiedBadge(userData) {
  const verifiedBadge = document.getElementById('verifiedBadge');
  const verifiedBadgeModal = document.getElementById('verifiedBadgeModal');
  if (!verifiedBadge || !verifiedBadgeModal || !userData) return;
  verifiedBadge.style.display = userData.verified === true ? 'inline-block' : 'none';
  verifiedBadgeModal.style.display = userData.verified === true ? 'inline-block' : 'none';
}

// ✅ Xử lý xem trước và upload ảnh đại diện
function previewAvatar(event) {
  const file = event.target.files[0];
  if (!file) {
    alert("Please select an image.");
    event.target.value = null;
    return;
  }
  if (!file.type.startsWith("image/")) {
    alert("Please choose a valid image.");
    event.target.value = null;
    return;
  }

  const reader = new FileReader();
  reader.onload = function () {
    document.getElementById("avatarPreview").src = reader.result;
  };
  reader.onerror = function () {
    alert("Error reading the image file.");
    event.target.value = null;
  };
  reader.readAsDataURL(file);

  uploadAvatarToFirebase(file);
}

async function uploadAvatarToFirebase(file) {
  const user = auth.currentUser;
  if (!user) return alert("You need to log in to upload an image.");

  const avatarRef = storage.ref().child(`avatars/${user.uid}/avatar.jpg`);

  try {
    // 🔁 Xóa ảnh cũ nếu tồn tại
    const userDoc = await db.collection('vcards').doc(user.uid).get();
    const oldUrl = userDoc.data()?.avatarUrl;

    if (oldUrl) {
      try {
        const oldRef = storage.refFromURL(oldUrl);
        await oldRef.delete();
        console.log("Đã xóa ảnh cũ thành công.");
      } catch (deleteErr) {
        console.warn("Không thể xoá ảnh cũ (có thể ảnh đã bị xoá):", deleteErr);
      }
    }

    // ⬆️ Upload ảnh mới
    const snapshot = await avatarRef.put(file);
    const downloadURL = await snapshot.ref.getDownloadURL();
    console.log("Ảnh mới đã được tải lên:", downloadURL);

    await updateAvatarURLInFirestore(downloadURL);
  } catch (err) {
    console.error("Lỗi khi upload ảnh:", err);
    alert("Không thể upload ảnh đại diện.");
  }
}

function updateAvatarURLInFirestore(downloadURL) {
  const user = auth.currentUser;
  if (!user) return alert("Bạn cần đăng nhập để lưu ảnh.");

  const vcardRef = db.collection('vcards').doc(user.uid);

  return vcardRef.update({
    avatarUrl: downloadURL
  }).then(() => {
    console.log("URL ảnh đã được cập nhật trong Firestore.");
    const avatarElem = document.getElementById("avatarPreview");
    avatarElem.src = downloadURL;
    avatarElem.setAttribute("data-uploaded-url", downloadURL);
  }).catch((error) => {
    console.error("Lỗi khi cập nhật Firestore:", error);
    alert("Không thể lưu URL ảnh vào Firestore.");
  });
}


// ✅ Tải và render liên kết mạng xã hội
async function loadSocialLinks() {
  const user = auth.currentUser;
  if (!user) return;

  const doc = await db.collection("users").doc(user.uid).get();
  const socialLinks = doc.exists ? doc.data().socialLinks || {} : {};

  document.getElementById("facebookLink").value = socialLinks.facebook || "";
  document.getElementById("instagramLink").value = socialLinks.instagram || "";
  document.getElementById("linkedinLink").value = socialLinks.linkedin || "";
  document.getElementById("githubLink").value = socialLinks.github || "";
  document.getElementById("tiktokLink").value = socialLinks.tiktok || "";
  document.getElementById("wechatLink").value = socialLinks.wechat || "";
  document.getElementById("whatsappLink").value = socialLinks.whatsapp || "";
  document.getElementById("zaloLink").value = socialLinks.zalo || "";

  renderSocialLinks(socialLinks);
}

function renderSocialLinks(socialLinks) {
  const container = document.getElementById("previewSocials");
  if (!container) {
    console.error("Không tìm thấy previewSocials trong DOM.");
    return;
  }
  container.innerHTML = "";

  Object.entries(socialLinks).forEach(([platform, url]) => {
    if (url) {
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.classList.add("social-link", platform);

      let icon;
      switch (platform) {
        case "facebook": icon = "<i class='fab fa-facebook'></i>"; break;
        case "instagram": icon = "<i class='fab fa-instagram'></i>"; break;
        case "linkedin": icon = "<i class='fab fa-linkedin'></i>"; break;
        case "github": icon = "<i class='fab fa-github'></i>"; break;
        case "tiktok": icon = "<i class='fab fa-tiktok'></i>"; break;
        case "wechat": icon = "<i class='fab fa-weixin'></i>"; break;
        case "whatsapp": icon = "<i class='fab fa-whatsapp'></i>"; break;
        case "zalo": icon = "<i class='icons8-zalo'></i>"; break; // hoặc dùng icon tuỳ chỉnh nếu không có FontAwesome
        default: icon = "<i class='fas fa-share-alt'></i>";
      }

      link.innerHTML = icon + " " + platform.charAt(0).toUpperCase() + platform.slice(1);
      container.appendChild(link);
    }
  });
}

// ✅ Lưu liên kết mạng xã hội
async function saveSocialLinks() {
  const user = auth.currentUser;
  if (!user) return alert("You need to log in!");

  const socialLinks = {
    facebook: document.getElementById("facebookLink").value.trim(),
    instagram: document.getElementById("instagramLink").value.trim(),
    linkedin: document.getElementById("linkedinLink").value.trim(),
    github: document.getElementById("githubLink").value.trim(),
    tiktok: document.getElementById("tiktokLink").value.trim(),
    wechat: document.getElementById("wechatLink").value.trim(),
    whatsapp: document.getElementById("whatsappLink").value.trim(),
    zalo: document.getElementById("zaloLink").value.trim()
  };

  for (const [platform, url] of Object.entries(socialLinks)) {
    if (url && !isValidUrl(url)) {
      alert(`URL ${platform} không hợp lệ!`);
      return;
    }
  }

  try {
    await db.collection("users").doc(user.uid).update({ socialLinks });
    alert("Successfully saved social media link!");
    renderSocialLinks(socialLinks);
    toggleModal("socialModal", false);
  } catch (error) {
    console.error("Failed to save social media link:", error);
    alert("Failed to save social media link.!");
  }
}

// ✅ Add to Homescreen Popup (iOS)
// function isIos() {
//   return /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
// }

// function isInStandaloneMode() {
//   return ('standalone' in window.navigator) && window.navigator.standalone;
// }

// window.addEventListener('load', () => {
//   if (isIos() && !isInStandaloneMode()) {
//     setTimeout(() => {
//       const iosPrompt = document.getElementById('installPrompt');
//       if (iosPrompt) iosPrompt.classList.remove('hidden');
//     }, 1000);
//   }
// });

// Forgot Password Logic
const forgotPasswordLink = document.getElementById('forgotPasswordLink');
const forgotPasswordModal = document.getElementById('forgotPasswordModal');
const closeForgotPassword = document.getElementById('closeForgotPassword');
const resetPasswordBtn = document.getElementById('resetPasswordBtn');
const forgotEmail = document.getElementById('forgotEmail');

// Mở modal
forgotPasswordLink.addEventListener('click', (e) => {
  e.preventDefault();
  forgotPasswordModal.classList.remove('hidden');
});

// Đóng modal
closeForgotPassword.addEventListener('click', () => {
  forgotPasswordModal.classList.add('hidden');
});

// Gửi email reset
resetPasswordBtn.addEventListener('click', async () => {
  const email = forgotEmail.value.trim();
  if (!email) return alert("Please enter your email.");

  try {
    await auth.sendPasswordResetEmail(email);
    alert("The password reset link has been sent. Please check your inbox");
    forgotPasswordModal.classList.add('hidden');
    forgotEmail.value = '';
  } catch (error) {
    console.error(error);
    alert("An error occurred: " + error.message);
  }
});

// ✅ Scan card visit
document.addEventListener('DOMContentLoaded', () => {
  // DOM Cache
  const openModalBtn = document.getElementById('openModalBtn');
  const viewCardsBtn = document.getElementById('viewCardsBtn');
  const scanModal = document.getElementById('scanModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const videoElement = document.getElementById('scan-video');
  const captureBtn = document.getElementById('scan-capture');
  const uploadBtn = document.getElementById('scan-uploadBtn');
  const uploadInput = document.getElementById('scan-upload');
  const resultText = document.getElementById('resultText');
  const videoContainer = document.getElementById('video-container');
  const verificationImages = document.getElementById('verificationImages');
  const scanInfoForm = document.getElementById('scan-infoForm');
  const modalContact = document.getElementById('modal-contact');
  const closeContactModalBtn = document.getElementById('closeContactModalBtn');
  const contactList = document.getElementById('contactList');
  const searchInput = document.getElementById('searchInput');

  let currentStream = null;
  let tesseractWorker = null;

  // Kiểm tra các phần tử DOM
  const elements = {
    openModalBtn, viewCardsBtn, scanModal, closeModalBtn, videoElement, captureBtn, uploadBtn,
    uploadInput, resultText, videoContainer, verificationImages, scanInfoForm, modalContact,
    closeContactModalBtn, contactList, searchInput
  };
  Object.entries(elements).forEach(([key, element]) => {
    if (!element) console.error(`Không tìm thấy phần tử DOM: ${key}`);
  });

  // Kiểm tra HTTPS
  if (window.location.protocol !== 'https:') {
    alert('This application requires HTTPS to access the camera on Safari.');
  }

  // Đảm bảo modal-contact ẩn khi load trang
  if (modalContact) {
    modalContact.classList.add('hidden');
    console.log('modal-contact được đặt thành ẩn khi load trang');
  }

  // Kiểm tra trạng thái đăng nhập
  firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
      console.log('Chưa có người dùng đăng nhập');
    } else {
      console.log('Người dùng đã đăng nhập:', user.uid);
      // Tải danh sách danh thiếp khi người dùng đăng nhập
      displayBusinessCards();
    }
  });

  // Khởi tạo Tesseract worker
  async function getTesseractWorker() {
    if (!tesseractWorker) {
      tesseractWorker = await Tesseract.createWorker({
        logger: (m) => console.log('Tesseract progress:', m),
        errorHandler: (err) => console.error('Tesseract error:', err),
        corePath: 'https://unpkg.com/tesseract.js-core@5.1.0/tesseract-core.wasm.js',
        workerPath: 'https://unpkg.com/tesseract.js@5.1.0/dist/worker.min.js',
        langPath: 'https://tessdata.projectnaptha.com/4.0.0_best',
      });
      await tesseractWorker.load();
      await tesseractWorker.loadLanguage('eng+vie');
      await tesseractWorker.initialize('eng+vie');
      await tesseractWorker.setParameters({
        tessedit_pageseg_mode: Tesseract.PSM.AUTO_OSD,
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@.-+ ',
        tessedit_char_blacklist: '~`!#$%^&*()_=[]{}\\|;:"<>?,',
        preserve_interword_spaces: '1',
        tessedit_ocr_engine_mode: Tesseract.OEM.LSTM_ONLY,
        tessedit_min_confidence: 70,
      });
    }
    return tesseractWorker;
  }

  // Hàm lưu danh thiếp vào Firestore (theo UID)
  async function saveBusinessCard(card) {
    try {
      const user = firebase.auth().currentUser;
      if (!user) throw new Error('Vui lòng đăng nhập để lưu danh thiếp');
      const docRef = await db.collection('users').doc(user.uid).collection('businessCards').add(card);
      console.log('Đã lưu danh thiếp với ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Lỗi khi lưu danh thiếp:', error);
      throw error;
    }
  }

  // Hàm cập nhật danh thiếp trong Firestore (theo UID)
  async function updateBusinessCard(docId, card) {
    try {
      const user = firebase.auth().currentUser;
      if (!user) throw new Error('Vui lòng đăng nhập để cập nhật danh thiếp');
      await db.collection('users').doc(user.uid).collection('businessCards').doc(docId).update(card);
      console.log('Đã cập nhật danh thiếp với ID:', docId);
    } catch (error) {
      console.error('Lỗi khi cập nhật danh thiếp:', error);
      throw error;
    }
  }

  // Hàm lấy danh sách danh thiếp từ Firestore (theo UID)
  async function getBusinessCards() {
    try {
      const user = firebase.auth().currentUser;
      if (!user) return [];
      const snapshot = await db.collection('users').doc(user.uid).collection('businessCards').get();
      const cards = [];
      snapshot.forEach(doc => {
        cards.push({ id: doc.id, ...doc.data() });
      });
      return cards;
    } catch (error) {
      console.error('Lỗi khi lấy danh thiếp:', error);
      return [];
    }
  }

  // Hàm xóa danh thiếp từ Firestore (theo UID)
  async function deleteBusinessCard(docId) {
    try {
      const user = firebase.auth().currentUser;
      if (!user) throw new Error('Vui lòng đăng nhập để xóa danh thiếp');
      await db.collection('users').doc(user.uid).collection('businessCards').doc(docId).delete();
      console.log('Đã xóa danh thiếp với ID:', docId);
    } catch (error) {
      console.error('Lỗi khi xóa danh thiếp:', error);
      throw error;
    }
  }

  // Hàm lưu danh thiếp vào danh bạ thiết bị bằng vCard
  async function saveToDeviceContacts(card) {
    const vCardData = {
      name: card.name || '',
      company: card.company || '',
      phone: card.phone || '',
      email: card.email || '',
      address: card.address || '',
      position: card.position || ''
    };

    const vCard = `
BEGIN:VCARD
VERSION:3.0
N:;${vCardData.name};;;
FN:${vCardData.name}
ORG:${vCardData.company}
TITLE:${vCardData.position}
TEL;TYPE=WORK,CELL:${vCardData.phone}
EMAIL;TYPE=INTERNET:${vCardData.email}
ADR;TYPE=WORK:;;${vCardData.address}
END:VCARD
    `.trim();

    try {
      const blob = new Blob([vCard], { type: 'text/vcard' });
      const url = URL.createObjectURL(blob);
      const fileName = vCardData.name ? `${vCardData.name}-vCard.vcf` : 'contact.vcf';

      const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
      const isAndroid = /Android/i.test(navigator.userAgent);

      if (isIOS) {
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => {
          alert('The vCard file has been downloaded. Please open it in your Contacts app to add the contact.');
        }, 1000);
      } else if (isAndroid) {
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => {
          alert('File vCard đã được tải. Vui lòng vào thư mục Downloads và mở file .vcf để thêm vào danh bạ.');
        }, 1000);
      } else {
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        alert('Đã tải file vCard thành công! Vui lòng mở file để thêm vào danh bạ.');
      }
    } catch (error) {
      console.error('Lỗi khi tạo vCard:', error);
      alert('Có lỗi khi lưu liên hệ: ' + error.message);
    }
  }

  // Hàm hiển thị danh sách danh thiếp
  async function displayBusinessCards(filter = '') {
    if (!contactList) return;
    contactList.innerHTML = '';
    const cards = await getBusinessCards();

    // Lọc danh thiếp theo từ khóa
    const filteredCards = cards.filter(card => {
      if (!filter) return true;
      const searchText = filter.toLowerCase();
      return (
        (card.name && card.name.toLowerCase().includes(searchText)) ||
        (card.email && card.email.toLowerCase().includes(searchText)) ||
        (card.company && card.company.toLowerCase().includes(searchText))
      );
    });

    if (filteredCards.length === 0) {
      contactList.innerHTML = '<p class="no-cards">Không tìm thấy danh thiếp nào.</p>';
      return;
    }

    filteredCards.forEach(card => {
      const cardDiv = document.createElement('div');
      cardDiv.className = 'card-item';
      cardDiv.setAttribute('data-id', card.id);
      cardDiv.setAttribute('data-state', 'view');
      console.log(`Khởi tạo card-item ${card.id} với trạng thái mặc định: view`);

      const viewContent = `
        <div class="view-content">
          <p><strong>Họ và tên:</strong> ${card.name || 'N/A'}</p>
          <p><strong>Email:</strong> ${card.email || 'N/A'}</p>
          <p><strong>Điện thoại:</strong> ${card.phone || 'N/A'}</p>
          <p><strong>Công ty:</strong> ${card.company || 'N/A'}</p>
          <p><strong>Địa chỉ:</strong> ${card.address || 'N/A'}</p>
          <p><strong>Chức vụ:</strong> ${card.position || 'N/A'}</p>
        </div>
      `;
      const editContent = `
        <form class="edit-form" id="edit-form-${card.id}">
          <input type="text" name="name" placeholder="Họ và tên" value="${card.name || ''}">
          <input type="email" name="email" placeholder="Email" value="${card.email || ''}">
          <input type="text" name="phone" placeholder="Số điện thoại" value="${card.phone || ''}">
          <input type="text" name="company" placeholder="Công ty" value="${card.company || ''}">
          <input type="text" name="address" placeholder="Địa chỉ" value="${card.address || ''}">
          <input type="text" name="position" placeholder="Chức vụ" value="${card.position || ''}">
          <button type="submit">Save</button>
        </form>
      `;
      cardDiv.innerHTML = `
        ${viewContent}
        ${editContent}
        <div class="button-group">
          <button class="save-contact-btn" data-id="${card.id}">Save Contact</button>
          <button class="edit-btn" data-id="${card.id}">Edit</button>
          <button class="delete-btn" data-id="${card.id}"><i class="fa-solid fa-trash-can" style="color: #ff004c;"></i></button>
        </div>
      `;
      contactList.appendChild(cardDiv);

      updateCardState(cardDiv, 'view');
    });

    function updateCardState(cardDiv, state) {
      cardDiv.setAttribute('data-state', state);
      const viewContent = cardDiv.querySelector('.view-content');
      const editForm = cardDiv.querySelector('.edit-form');
      const editBtn = cardDiv.querySelector('.edit-btn');
      const saveContactBtn = cardDiv.querySelector('.save-contact-btn');
      const deleteBtn = cardDiv.querySelector('.delete-btn');

      if (state === 'view') {
        viewContent.style.display = 'block';
        editForm.style.display = 'none';
        editBtn.textContent = 'Edit';
        editBtn.classList.remove('cancel');
        saveContactBtn.style.display = 'block';
        deleteBtn.style.display = 'block';
        console.log(`Cập nhật card-item ${cardDiv.getAttribute('data-id')} sang trạng thái: view`);
      } else {
        viewContent.style.display = 'none';
        editForm.style.display = 'block';
        editBtn.textContent = 'Cancel';
        editBtn.classList.add('cancel');
        saveContactBtn.style.display = 'none';
        deleteBtn.style.display = 'none';
        console.log(`Cập nhật card-item ${cardDiv.getAttribute('data-id')} sang trạng thái: edit`);
      }
    }

    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const docId = e.target.getAttribute('data-id') || e.target.parentElement.getAttribute('data-id');
        const confirmDelete = confirm('Bạn có chắc chắn muốn xóa danh thiếp này?');
        if (!confirmDelete) return;

        try {
          await deleteBusinessCard(docId);
          alert('Đã xóa danh thiếp!');
          displayBusinessCards(filter);
        } catch (error) {
          alert('Lỗi khi xóa danh thiếp: ' + error.message);
        }
      });
    });

    document.querySelectorAll('.save-contact-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const docId = e.target.getAttribute('data-id');
        const cards = await getBusinessCards();
        const card = cards.find(c => c.id === docId);
        if (card) {
          await saveToDeviceContacts(card);
        } else {
          alert('Không tìm thấy danh thiếp!');
        }
      });
    });

    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const docId = e.target.getAttribute('data-id');
        const cardDiv = document.querySelector(`.card-item[data-id="${docId}"]`);
        const currentState = cardDiv.getAttribute('data-state');

        document.querySelectorAll('.card-item').forEach(otherCard => {
          if (otherCard !== cardDiv) {
            updateCardState(otherCard, 'view');
          }
        });

        updateCardState(cardDiv, currentState === 'view' ? 'edit' : 'view');
      });
    });

    document.querySelectorAll('.edit-form').forEach(form => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const docId = form.id.replace('edit-form-', '');
        const card = {
          name: form.querySelector('input[name="name"]').value,
          email: form.querySelector('input[name="email"]').value,
          phone: form.querySelector('input[name="phone"]').value,
          company: form.querySelector('input[name="company"]').value,
          address: form.querySelector('input[name="address"]').value,
          position: form.querySelector('input[name="position"]').value,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        try {
          await updateBusinessCard(docId, card);
          alert('Đã cập nhật danh thiếp!');
          const cardDiv = document.querySelector(`.card-item[data-id="${docId}"]`);
          updateCardState(cardDiv, 'view');
          displayBusinessCards(filter);
        } catch (error) {
          alert('Lỗi khi cập nhật danh thiếp: ' + error.message);
        }
      });
    });
  }

  // Xử lý tìm kiếm
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const filter = e.target.value.trim();
      displayBusinessCards(filter);
    });
  }

  // Xử lý submit form quét
  if (scanInfoForm) {
    scanInfoForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const user = firebase.auth().currentUser;
      if (!user) {
        alert('Vui lòng đăng nhập để lưu danh thiếp.');
        return;
      }
      const card = {
        name: document.getElementById('scan-name').value,
        email: document.getElementById('scan-email').value,
        phone: document.getElementById('scan-phone').value,
        company: document.getElementById('scan-company').value,
        address: document.getElementById('scan-address').value,
        position: document.getElementById('scan-position').value,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      };
      try {
        await saveBusinessCard(card);
        alert('Business card information has been saved!');
        scanInfoForm.reset();
        if (scanModal) scanModal.classList.add('hidden');
        resetToDefaultState();
      } catch (error) {
        alert('Failed to save business card information: ' + error.message);
      }
    });
  }

  // Xử lý mở modal-contact
  if (viewCardsBtn) {
    viewCardsBtn.addEventListener('click', () => {
      const user = firebase.auth().currentUser;
      if (!user) {
        alert('Vui lòng đăng nhập để xem danh thiếp.');
        return;
      }
      if (modalContact) {
        modalContact.classList.remove('hidden');
        if (searchInput) searchInput.value = '';
        displayBusinessCards();
        console.log('Mở modal-contact và hiển thị danh thiếp');
      } else {
        console.error('Không tìm thấy modal-contact');
      }
    });
  }

  // Xử lý đóng modal-contact
  if (closeContactModalBtn) {
    closeContactModalBtn.addEventListener('click', () => {
      if (modalContact) modalContact.classList.add('hidden');
      console.log('Đóng modal-contact');
    });
  }

  // Hàm khởi tạo camera stream
  async function initializeCamera() {
    try {
      const constraints = {
        video: {
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      };

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Your browser does not support camera access.');
        return false;
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      currentStream = stream;
      if (videoElement) {
        videoElement.srcObject = stream;
        videoElement.setAttribute('playsinline', '');
        await videoElement.play();
        console.log('Camera khởi động thành công');
        return true;
      } else {
        throw new Error('Không tìm thấy videoElement');
      }
    } catch (err) {
      console.error('Không truy cập được camera:', err);
      if (err.name === 'OverconstrainedError') {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          currentStream = stream;
          if (videoElement) {
            videoElement.srcObject = stream;
            videoElement.setAttribute('playsinline', '');
            await videoElement.play();
            console.log('Camera fallback thành công');
            return true;
          } else {
            throw new Error('Không tìm thấy videoElement');
          }
        } catch (fallbackErr) {
          console.error('Lỗi fallback camera:', fallbackErr);
          alert('Không truy cập được camera. Vui lòng kiểm tra quyền truy cập.');
          return false;
        }
      } else {
        alert('Không truy cập được camera. Vui lòng kiểm tra quyền truy cập.');
        return false;
      }
    }
  }

  // Hàm chờ camera sẵn sàng
  async function waitForVideoReady(video, timeout = 5000) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const check = () => {
        if (video.videoWidth > 0 && video.videoHeight > 0) {
          resolve(true);
        } else if (Date.now() - startTime > timeout) {
          reject(new Error('Camera không sẵn sàng trong thời gian chờ'));
        } else {
          setTimeout(check, 100);
        }
      };
      check();
    });
  }

  // Hàm reset trạng thái mặc định
  function resetToDefaultState() {
    const inputs = document.querySelectorAll('#scan-name, #scan-email, #scan-phone, #scan-company, #scan-address, #scan-position');
    inputs.forEach((input) => (input.value = ''));
    if (verificationImages) verificationImages.innerHTML = '';
    if (resultText) {
      resultText.innerText = '';
      resultText.style.display = 'block';
    }
    if (captureBtn) captureBtn.innerText = 'Scan';
    if (videoContainer) videoContainer.style.display = 'block';
    if (currentStream) {
      currentStream.getTracks().forEach((track) => track.stop());
      currentStream = null;
    }
    if (videoElement) videoElement.srcObject = null;
    console.log('Trạng thái được reset');
  }

  // Mở modal và bật camera
  if (openModalBtn) {
    openModalBtn.addEventListener('click', async () => {
      const user = firebase.auth().currentUser;
      if (!user) {
        alert('Vui lòng đăng nhập để quét danh thiếp.');
        return;
      }
      try {
        const permissionStatus = await navigator.permissions.query({ name: 'camera' }).catch(() => ({ state: 'prompt' }));
        if (permissionStatus.state === 'denied') {
          alert('Quyền truy cập camera bị từ chối. Vui lòng cấp quyền trong cài đặt trình duyệt.');
          return;
        }

        if (scanModal) {
          scanModal.classList.remove('hidden');
          resetToDefaultState();
          const cameraStarted = await initializeCamera();
          if (!cameraStarted) {
            scanModal.classList.add('hidden');
          }
        } else {
          console.error('Không tìm thấy scanModal');
        }
      } catch (err) {
        console.error('Lỗi mở camera:', err);
        alert('Không thể mở camera. Vui lòng kiểm tra quyền truy cập.');
      }
    });
  } else {
    console.error('Không tìm thấy openModalBtn');
  }

  // Đóng modal và tắt camera
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', async () => {
      if (scanModal) scanModal.classList.add('hidden');
      resetToDefaultState();
      if (tesseractWorker) {
        await tesseractWorker.terminate();
        tesseractWorker = null;
      }
    });
  } else {
    console.error('Không tìm thấy closeModalBtn');
  }

  // Xử lý tải ảnh
  if (uploadBtn && uploadInput) {
    uploadBtn.addEventListener('click', () => {
      uploadInput.click();
    });
    uploadInput.addEventListener('change', async () => {
      const file = uploadInput.files[0];
      if (!file) {
        if (resultText) resultText.innerText = '❌ Vui lòng chọn một ảnh.';
        return;
      }
      const reader = new FileReader();
      reader.onload = async () => {
        const img = new Image();
        img.onload = async () => {
          const canvas = document.createElement('canvas');
          canvas.width = Math.min(img.width, 1280);
          canvas.height = canvas.width * (img.height / img.width);
          const context = canvas.getContext('2d');
          context.drawImage(img, 0, 0, canvas.width, canvas.height);

          if (resultText) resultText.innerText = 'Scanning...';
          const originalImageData = canvas.toDataURL('image/png');
          const processedCanvas = await preprocessImage(canvas);
          const processedImageData = processedCanvas.toDataURL('image/png');

          if (verificationImages) displayVerificationImages(originalImageData);

          try {
            const worker = await getTesseractWorker();
            const { data: { text } } = await worker.recognize(processedImageData);
            console.log('OCR text:', text);
            if (resultText) resultText.style.display = 'none';
            if (captureBtn) captureBtn.innerText = 'Rescan';
            fillFormFields(text, 'scan');
            if (videoContainer) videoContainer.style.display = 'none';
          } catch (err) {
            console.error('Lỗi OCR:', err);
            if (resultText) {
              resultText.innerText = '❌ Không thể nhận dạng văn bản: ' + err.message;
              resultText.style.display = 'block';
            }
            if (captureBtn) captureBtn.innerText = 'Rescan';
          }
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  } else {
    console.error('Không tìm thấy uploadBtn hoặc uploadInput');
  }

  // Hàm kiểm tra độ mờ
  function isImageBlurry(canvas) {
    let mat = cv.imread(canvas);
    let gray = new cv.Mat();
    cv.cvtColor(mat, gray, cv.COLOR_RGBA2GRAY);
    let laplacian = new cv.Mat();
    cv.Laplacian(gray, laplacian, cv.CV_64F);
    let mean = new cv.Mat();
    let stddev = new cv.Mat();
    cv.meanStdDev(laplacian, mean, stddev);
    let variance = stddev.data64F[0] * stddev.data64F[0];
    mat.delete();
    gray.delete();
    laplacian.delete();
    mean.delete();
    stddev.delete();
    return variance < 100;
  }

  // Hàm xử lý scan
  async function handleScan() {
    console.log('Nút Scan được nhấn');
    try {
      if (captureBtn && captureBtn.innerText === 'Rescan') {
        console.log('Thực hiện Rescan');
        resetToDefaultState();
        const cameraStarted = await initializeCamera();
        if (!cameraStarted && resultText) {
          resultText.innerText = '❌ Không thể khởi động camera.';
          resultText.style.display = 'block';
        }
        return;
      }

      if (!currentStream || !videoElement.srcObject) {
        console.log('Khởi động camera mới');
        const cameraStarted = await initializeCamera();
        if (!cameraStarted && resultText) {
          resultText.innerText = '❌ Không thể khởi động camera.';
          resultText.style.display = 'block';
          return;
        }
      }

      await waitForVideoReady(videoElement).catch((err) => {
        console.error(err);
        if (resultText) {
          resultText.innerText = '❌ Camera chưa sẵn sàng. Vui lòng thử lại.';
          resultText.style.display = 'block';
        }
        return;
      });

      if (!videoElement.videoWidth || !videoElement.videoHeight) {
        console.error('Camera không sẵn sàng');
        if (resultText) {
          resultText.innerText = '❌ Camera chưa sẵn sàng. Vui lòng thử lại.';
          resultText.style.display = 'block';
        }
        return;
      }

      const canvas = document.createElement('canvas');
      const frameRect = videoContainer.getBoundingClientRect();
      const videoWidth = videoElement.videoWidth;
      const videoHeight = videoElement.videoHeight;
      const frameAspectRatio = frameRect.width / frameRect.height;
      const videoAspectRatio = videoWidth / videoHeight;

      canvas.width = frameRect.width * window.devicePixelRatio;
      canvas.height = frameRect.height * window.devicePixelRatio;

      const context = canvas.getContext('2d');
      context.scale(window.devicePixelRatio, window.devicePixelRatio);

      let srcWidth, srcHeight, srcX, srcY;
      if (videoAspectRatio > frameAspectRatio) {
        srcHeight = videoHeight;
        srcWidth = videoHeight * frameAspectRatio;
        srcX = (videoWidth - srcWidth) / 2;
        srcY = 0;
      } else {
        srcWidth = videoWidth;
        srcHeight = videoWidth / frameAspectRatio;
        srcX = 0;
        srcY = (videoHeight - srcHeight) / 2;
      }

      context.drawImage(
        videoElement,
        srcX, srcY, srcWidth, srcHeight,
        0, 0, frameRect.width, frameRect.height
      );

      if (isImageBlurry(canvas)) {
        if (resultText) {
          resultText.innerText = '❌ Ảnh quá mờ. Vui lòng căn chỉnh lại.';
          resultText.style.display = 'block';
        }
        return;
      }

      if (resultText) resultText.innerText = 'Scanning...';
      console.log('Chụp ảnh thành công, bắt đầu tiền xử lý');

      const originalImageData = canvas.toDataURL('image/png');
      const processedCanvas = await preprocessImage(canvas);
      const processedImageData = processedCanvas.toDataURL('image/png');

      if (verificationImages) displayVerificationImages(originalImageData);

      try {
        const worker = await getTesseractWorker();
        const { data: { text } } = await worker.recognize(processedImageData);
        console.log('OCR text:', text);
        if (resultText) resultText.style.display = 'none';
        if (captureBtn) captureBtn.innerText = 'Rescan';
        fillFormFields(text, 'scan');
        if (videoContainer) videoContainer.style.display = 'none';
      } catch (err) {
        console.error('Lỗi OCR:', err);
        if (resultText) {
          resultText.innerText = '❌ Không thể nhận dạng văn bản: ' + err.message;
          resultText.style.display = 'block';
        }
        if (captureBtn) captureBtn.innerText = 'Rescan';
      }

      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
        currentStream = null;
      }
      if (videoElement) videoElement.srcObject = null;
    } catch (err) {
      console.error('Lỗi khi scan:', err);
      if (resultText) {
        resultText.innerText = '❌ Lỗi khi chụp ảnh: ' + err.message;
        resultText.style.display = 'block';
      }
    }
  }

  // Thêm sự kiện click và touchstart cho nút Scan
  if (captureBtn) {
    captureBtn.addEventListener('click', handleScan);
    captureBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      handleScan();
    });
  } else {
    console.error('Không tìm thấy captureBtn');
  }

  // Tiền xử lý ảnh
  async function preprocessImage(canvas) {
    let src = cv.imread(canvas);
    let gray = new cv.Mat();
    let dst = new cv.Mat();

    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
    let temp = new cv.Mat();
    cv.convertScaleAbs(gray, temp, 1.5, 0);
    let corrected = correctPerspective(temp);
    if (!corrected) corrected = temp;

    cv.GaussianBlur(corrected, dst, new cv.Size(3, 3), 0, 0, cv.BORDER_DEFAULT);
    cv.adaptiveThreshold(dst, dst, 255, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY, 11, 2);
    let clahe = new cv.CLAHE(3.0, new cv.Size(8, 8));
    clahe.apply(dst, dst);
    cv.imshow(canvas, dst);

    src.delete();
    gray.delete();
    temp.delete();
    dst.delete();
    clahe.delete();
    if (corrected !== temp) corrected.delete();

    return canvas;
  }

  // Sửa méo góc
  function correctPerspective(src) {
    let gray = src.clone();
    let edges = new cv.Mat();
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();

    cv.Canny(gray, edges, 100, 200);
    cv.findContours(edges, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

    let maxArea = 0;
    let maxContour = null;
    for (let i = 0; i < contours.size(); i++) {
      let area = cv.contourArea(contours.get(i));
      if (area > maxArea && area > gray.rows * gray.cols * 0.1) {
        maxArea = area;
        maxContour = contours.get(i);
      }
    }

    if (!maxContour) {
      edges.delete();
      contours.delete();
      hierarchy.delete();
      return null;
    }

    let peri = cv.arcLength(maxContour, true);
    let approx = new cv.Mat();
    cv.approxPolyDP(maxContour, approx, 0.02 * peri, true);

    if (approx.rows !== 4) {
      edges.delete();
      contours.delete();
      hierarchy.delete();
      approx.delete();
      return null;
    }

    let points = [];
    for (let i = 0; i < 4; i++) {
      points.push([approx.data32F[i * 2], approx.data32F[i * 2 + 1]]);
    }
    points.sort((a, b) => a[0] + a[1] - (b[0] + b[1]));

    let srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
      points[0][0], points[0][1],
      points[1][0], points[1][1],
      points[2][0], points[2][1],
      points[3][0], points[3][1]
    ]);

    let dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
      0, 0,
      gray.cols, 0,
      gray.cols, gray.rows,
      0, gray.rows
    ]);

    let M = cv.getPerspectiveTransform(srcTri, dstTri);
    let dst = new cv.Mat();
    cv.warpPerspective(gray, dst, M, new cv.Size(gray.cols, gray.rows));

    edges.delete();
    contours.delete();
    hierarchy.delete();
    approx.delete();
    srcTri.delete();
    dstTri.delete();
    M.delete();

    return dst;
  }

  // Hiển thị ảnh gốc
  function displayVerificationImages(original) {
    if (verificationImages) {
      verificationImages.innerHTML = `
        <div style="display: flex; flex-wrap: wrap; gap: 20px; justify-content: center;">
          <div>
            <img src="${original}" style="max-width: 250px; height: auto;" alt="Original Image">
          </div>
        </div>
      `;
    }
  }

  // Điền dữ liệu vào form
  function fillFormFields(text, prefix = '') {
    console.log('fillFormFields called with text:', text);
    const nameInput = document.getElementById(`${prefix}-name`);
    const emailInput = document.getElementById(`${prefix}-email`);
    const phoneInput = document.getElementById(`${prefix}-phone`);
    const companyInput = document.getElementById(`${prefix}-company`);
    const addressInput = document.getElementById(`${prefix}-address`);
    const titleInput = document.getElementById(`${prefix}-position`);

    if (!nameInput || !emailInput || !phoneInput || !companyInput || !addressInput || !titleInput) {
      console.error('Một hoặc nhiều input không tồn tại');
      if (resultText) {
        resultText.innerText = '❌ Lỗi: Không tìm thấy các trường nhập liệu.';
        resultText.style.display = 'block';
      }
      return;
    }

    if (!text || text.trim() === '') {
      console.warn('Không có văn bản OCR để xử lý');
      if (resultText) {
        resultText.innerText = '❌ Không tìm thấy văn bản trên danh thiếp.';
        resultText.style.display = 'block';
      }
      return;
    }

    const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
    console.log('OCR lines:', lines);

    const nameRegex = /^[A-ZĐÀ-Ỹ][a-zà-ỹ]*(?:\s+[A-ZĐÀ-Ỹ][a-zà-ỹ]*)*$/i;
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const phoneRegex = /(?:\+?\d{1,3}[\s.-]?)?(?:\(?\d{2,4}\)?[\s.-]?)?\d{3,4}[\s.-]?\d{3,4}/;
    const titleRegex = /(CEO|Founder|Director|Manager|Leader|President|Owner|Co-founder|Chief|Officer|Head|Executive|Giám đốc|Trưởng phòng|Quản lý|Chủ tịch|Điều hành)/i;
    const companyRegex = /(?:company|corp|inc|ltd|co\.|enterprise|tập đoàn|công ty|group)/i;
    const addressRegex = /\d{1,4}\s*[\w\s,.-]*(?:đường|phường|quận|tp|city|street|road|address)/i;

    let name = '';
    let email = '';
    let phone = '';
    let company = '';
    let address = '';
    let title = '';

    for (const line of lines) {
      if (emailRegex.test(line) && !email) {
        email = line.match(emailRegex)[0];
        console.log('Found email:', email);
        continue;
      }
      if (phoneRegex.test(line) && !phone) {
        phone = line.match(phoneRegex)[0];
        console.log('Found phone:', phone);
        continue;
      }
      if (companyRegex.test(line) && !company) {
        company = line;
        console.log('Found company:', company);
        continue;
      }
      if (addressRegex.test(line) && !address) {
        address = line;
        console.log('Found address:', address);
        continue;
      }
      if (titleRegex.test(line) && !title) {
        title = line;
        console.log('Found title:', title);
        continue;
      }
      if (nameRegex.test(line) && !name && line.split(/\s+/).length >= 2 && line.split(/\s+/).length <= 5) {
        name = line;
        console.log('Found name:', name);
      }
    }

    if (!name) {
      name = lines.find(line =>
        !emailRegex.test(line) &&
        !phoneRegex.test(line) &&
        !companyRegex.test(line) &&
        !addressRegex.test(line) &&
        !titleRegex.test(line) &&
        line.split(/\s+/).length >= 2
      ) || '';
      console.log('Fallback name:', name);
    }

    if (!title && name) {
      const nameIndex = lines.indexOf(name);
      if (nameIndex >= 0 && nameIndex + 1 < lines.length) {
        const nextLine = lines[nameIndex + 1];
        if (!emailRegex.test(nextLine) && !phoneRegex.test(nextLine) && !companyRegex.test(nextLine) && !addressRegex.test(nextLine)) {
          title = nextLine;
          console.log('Fallback title:', title);
        }
      }
    }

    nameInput.value = name || '';
    emailInput.value = email || '';
    phoneInput.value = phone || '';
    companyInput.value = company || '';
    addressInput.value = address || '';
    titleInput.value = title || '';

    console.log('Form filled:', {
      name: nameInput.value,
      email: emailInput.value,
      phone: phoneInput.value,
      company: companyInput.value,
      address: addressInput.value,
      title: titleInput.value
    });

    if (!name && !email && !phone && !company && !address && !title) {
      if (resultText) {
        resultText.innerText = '⚠️ Không tìm thấy thông tin phù hợp để điền vào form.';
        resultText.style.display = 'block';
      }
    }
  }

  // Hàm fuzzy matching cho email
  function findPotentialEmail(line) {
    const emailLikeRegex = /[^@\s]+@[^@\s]+\.[^@\s]+/;
    const match = line.match(emailLikeRegex);
    if (match) return match[0];
    const atIndex = line.indexOf('@');
    if (atIndex > 0) {
      const beforeAt = line.substring(0, atIndex).trim();
      const afterAt = line.substring(atIndex + 1).trim();
      if (beforeAt && afterAt) return beforeAt + '@' + afterAt;
    }
    return null;
  }

  // OCV
  function applyGaussianFilter(canvas) {
    let src = cv.imread(canvas);
    let dst = new cv.Mat();
    cv.GaussianBlur(src, dst, new cv.Size(5, 5), 0, 0, cv.BORDER_DEFAULT);
    cv.imshow(canvas, dst);
    src.delete();
    dst.delete();
    return canvas;
  }

  function applyCLAHE(canvas) {
    let src = cv.imread(canvas);
    let dst = new cv.Mat();
    let clahe = new cv.CLAHE(2.0, new cv.Size(8, 8));
    cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY);
    clahe.apply(src, dst);
    cv.imshow(canvas, dst);
    src.delete();
    dst.delete();
    return canvas;
  }
});



// Kiểm tra trạng thái check box
document.addEventListener("DOMContentLoaded", function () {
  const registerBtn = document.getElementById("registerBtn");
  const checkbox = document.getElementById("termsCheckbox");
  const closeSignupBtn = document.getElementById("closeSignup");
  const modals = document.querySelectorAll(".modal");

  // Kích hoạt nút Sign Up khi checkbox được tích
  checkbox.addEventListener("change", () => {
    registerBtn.disabled = !checkbox.checked;
  });

  // Xử lý mở modal
  window.openModal = function (id) {
    document.getElementById(id).classList.remove("hidden");
  };

  // Xử lý đóng modal
  window.closeModal = function (id) {
    document.getElementById(id).classList.add("hidden");
  };

  // Click bên ngoài modal để đóng
  window.addEventListener("click", function (event) {
    modals.forEach((modal) => {
      if (event.target === modal && !modal.classList.contains("hidden")) {
        modal.classList.add("hidden");
      }
    });
  });

  // Xử lý đăng ký
  registerBtn.addEventListener("click", function () {
    if (!checkbox.checked) {
      alert("Vui lòng đồng ý với điều khoản và chính sách bảo mật.");
      return;
    }

    // TODO: Thêm logic đăng ký Firebase ở đây
  });

  // Đóng modal đăng ký
  closeSignupBtn.addEventListener("click", () => {
    document.getElementById("signup").classList.add("hidden");
  });
});

// Date 17/5/25

// fetch('https://api.ipify.org?format=json')
//   .then(response => response.json())
//   .then(data => {
//     console.log("IP của bạn là: " + data.ip);
//   });


// Hàm lấy UID từ URL (ví dụ: ?uid=abc123)
function getUidFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("uid");
}

// Hiển thị tên gói theo uid
function showUserPackage(uid) {
  const container = document.getElementById("userPackage");
  const labelText = container.querySelector(".label-text");
  const iconEl = container.querySelector("i");

  if (!container || !labelText) return;

  // Mặc định loading
  labelText.textContent = "Đang tải...";
  if (iconEl) iconEl.className = "fas fa-spinner fa-spin";

  const iconMap = {
    basic: "fa-check-circle",
    standard: "fa-medal",
    pro: "fa-rocket",
    enterprise: "fa-crown",
    unknown: "fa-question-circle"
  };

  firebase.firestore().collection("users").doc(uid).get()
    .then((doc) => {
      if (doc.exists) {
        const data = doc.data();
        const pkg = (data.package || "unknown").toLowerCase();

        labelText.textContent = `Gói: ${pkg.charAt(0).toUpperCase() + pkg.slice(1)}`;
        if (iconEl) {
          iconEl.className = `fas ${iconMap[pkg] || iconMap.unknown}`;
        }
      } else {
        labelText.textContent = "Không tìm thấy người dùng.";
        if (iconEl) iconEl.className = "fas fa-question-circle";
      }
    })
    .catch((error) => {
      console.error("Lỗi khi lấy gói:", error);
      labelText.textContent = "Đã xảy ra lỗi khi tải gói.";
      if (iconEl) iconEl.className = "fas fa-exclamation-circle";
    });

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
  const uidFromUrl = getUidFromUrl();

  firebase.auth().onAuthStateChanged((user) => {
    if (uidFromUrl) {
      showUserPackage(uidFromUrl);
    } else if (user) {
      showUserPackage(user.uid);
    } else {
      const container = document.getElementById("userPackage");
      const labelText = container?.querySelector(".label-text");
      const iconEl = container?.querySelector("i");
      if (labelText) labelText.textContent = "Vui lòng đăng nhập để xem gói.";
      if (iconEl) iconEl.className = "fas fa-sign-in-alt";
    }
  });
});

// Hàm xử lý hiển thị chức năng scan với gói enterprise
document.addEventListener('DOMContentLoaded', () => {
  // DOM Cache
  const openModalBtn = document.getElementById('openModalBtn');
  // ... các phần tử khác bạn đã có

  // Hàm kiểm tra package user
  async function checkUserPackage(uid) {
    if (!uid) return false;

    try {
      const userDoc = await firebase.firestore().collection("users").doc(uid).get();
      if (!userDoc.exists) return false;
      
      const packageName = (userDoc.data().package || "").toLowerCase();
      return packageName === "enterprise";
    } catch (error) {
      console.error("Lỗi khi lấy thông tin package:", error);
      return false;
    }
  }

  // Ẩn nút mặc định
  if (openModalBtn) openModalBtn.style.display = "none";

  // Kiểm tra trạng thái đăng nhập và package
  firebase.auth().onAuthStateChanged(async (user) => {
    if (!user) {
      console.log('Chưa có người dùng đăng nhập');
      if (openModalBtn) openModalBtn.style.display = "none";
    } else {
      console.log('Người dùng đã đăng nhập:', user.uid);

      const isEnterprise = await checkUserPackage(user.uid);

      if (isEnterprise) {
        if (openModalBtn) openModalBtn.style.display = "inline-block"; // Hoặc 'block' tùy kiểu nút
      } else {
        if (openModalBtn) openModalBtn.style.display = "none";
      }

      // Tải danh sách danh thiếp khi người dùng đăng nhập
      displayBusinessCards();
    }
  });
});

// Hiển thị danh sạch liên hệ với user enterprise
async function showContactButtonForEnterprise(uid) {
  const btn = document.getElementById("viewCardsBtn");
  if (!btn) return;

  try {
    const userDoc = await firebase.firestore().collection("users").doc(uid).get();
    if (!userDoc.exists) {
      btn.style.display = "none";
      return;
    }

    const packageName = (userDoc.data().package || "").toLowerCase();
    if (packageName === "enterprise") {
      btn.style.display = "inline-block";  // hiện nút
    } else {
      btn.style.display = "none";  // ẩn nút
    }
  } catch (error) {
    console.error("Lỗi lấy package:", error);
    btn.style.display = "none";
  }
}

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    showContactButtonForEnterprise(user.uid);
  } else {
    const btn = document.getElementById("viewCardsBtn");
    if (btn) btn.style.display = "none";
  }
});



// Hàm xử lý hiển thị số view
document.addEventListener('DOMContentLoaded', () => {
  const toggleEl = document.getElementById("viewCountToggle");
  if (!toggleEl) return;

  firebase.auth().onAuthStateChanged(async (user) => {
    if (!user) return;

    const uid = user.uid;
    const userRef = firebase.firestore().collection("users").doc(uid);

    try {
      const doc = await userRef.get();
      const data = doc.data();
      const showViewCount = data?.showViewCount ?? false;

      // Cập nhật trạng thái ban đầu UI và aria-checked
      toggleEl.setAttribute("aria-checked", showViewCount);
      toggleEl.classList.toggle("active", showViewCount);

      // Xử lý toggle khi click
      toggleEl.addEventListener("click", async () => {
        const isActive = toggleEl.getAttribute("aria-checked") === "true";
        const newState = !isActive;

        // Cập nhật UI
        toggleEl.setAttribute("aria-checked", newState);
        toggleEl.classList.toggle("active", newState);

        // Cập nhật Firestore
        try {
          await userRef.update({ showViewCount: newState });
          console.log("Đã cập nhật showViewCount:", newState);
        } catch (error) {
          console.error("Lỗi cập nhật showViewCount:", error);
        }
      });
    } catch (error) {
      console.error("Lỗi lấy dữ liệu showViewCount:", error);
    }
  });
});


// Xử lý modal cài đặt
const openSettingsBtn = document.getElementById('openSettingsBtn');
const modalSettings = document.getElementById('modal-settings');
const closeSettingsModalBtn = document.getElementById('closeSettingsModalBtn');

openSettingsBtn.addEventListener('click', () => {
  modalSettings.classList.remove('hidden');
});

closeSettingsModalBtn.addEventListener('click', () => {
  modalSettings.classList.add('hidden');
});

