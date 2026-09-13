/* =========================================
   FORM LOGIN - MathTools Enterprise
   ========================================= */

const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

// Toggle panel animasi
signUpButton.addEventListener('click', () => {
    container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
    container.classList.remove("right-panel-active");
});

/* =========================================
   SIGN UP HANDLER
   User bisa isi nama, email, password BEBAS
   Setelah sign up → langsung ke index.html
   ========================================= */
const signupForm = document.getElementById('signupForm');

signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value.trim();

    // Validasi sederhana: pastikan tidak kosong
    if (!name || !email || !password) {
        alert('Mohon isi semua kolom!');
        return;
    }

    // Simpan data user ke localStorage (untuk ditampilkan di website utama)
    const userData = {
        name: name,
        email: email,
        loginTime: new Date().toISOString()
    };
    localStorage.setItem('mathToolsUser', JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', 'true');

    // Redirect ke halaman utama
    window.location.href = 'index.html';
});

/* =========================================
   SIGN IN HANDLER
   Login bebas (tidak ada validasi database)
   ========================================= */
const signinForm = document.getElementById('signinForm');

signinForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('signinEmail').value.trim();
    const password = document.getElementById('signinPassword').value.trim();

    if (!email || !password) {
        alert('Mohon isi email/username dan password!');
        return;
    }

    // Ambil data user yang tersimpan (jika ada)
    let userData = JSON.parse(localStorage.getItem('mathToolsUser') || 'null');

    // Kalau belum pernah sign up, buat data default dari input sign in
    if (!userData) {
        userData = {
            name: email.split('@')[0],
            email: email,
            loginTime: new Date().toISOString()
        };
        localStorage.setItem('mathToolsUser', JSON.stringify(userData));
    }

    localStorage.setItem('isLoggedIn', 'true');

    // Redirect ke halaman utama
    window.location.href = 'index.html';
});

/* =========================================
   GUEST PLAN - Masuk tanpa akun
   ========================================= */
function loginAsGuest() {
    // Simpan data guest ke localStorage
    const guestData = {
        name: 'Guest User',
        email: 'guest@mathtools.com',
        loginTime: new Date().toISOString(),
        isGuest: true
    };

    localStorage.setItem('mathToolsUser', JSON.stringify(guestData));
    localStorage.setItem('isLoggedIn', 'true');

    // Langsung ke halaman utama
    window.location.href = 'index.html';
}