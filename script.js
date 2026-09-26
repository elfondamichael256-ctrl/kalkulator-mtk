/* =========================================
   0. USER LOGIN INFO & LOGOUT
   ========================================= */
document.addEventListener("DOMContentLoaded", () => {
  // Ambil data user yang login
  const userData = JSON.parse(localStorage.getItem("mathToolsUser") || "null");

  if (userData) {
    const name = userData.name || "User";
    const email = userData.email || "-";
    const isGuest = userData.isGuest === true;
    const planLabel = isGuest ? "Guest Plan" : "Free Plan";
    const badgeIcon = isGuest ? "fa-user-secret" : "fa-crown";

    const loginTime = userData.loginTime
      ? new Date(userData.loginTime).toLocaleString("id-ID", {
          dateStyle: "long",
          timeStyle: "short",
        })
      : "-";

    // Sidebar footer
    function updateSidebarUser(name, planLabel) {
      const userNameEl = document.getElementById("userNameDisplay");
      const userEmailEl = document.getElementById("userEmailDisplay");
      if (userNameEl) userNameEl.textContent = name;
      if (userEmailEl) userEmailEl.textContent = planLabel;
    }
    updateSidebarUser(name, planLabel); // <-- FIX: sebelumnya fungsi ini tidak pernah dipanggil

    // Halaman Info Akun
    const accountName = document.getElementById("accountName");
    const accountEmail = document.getElementById("accountEmail");
    const detailName = document.getElementById("detailName");
    const detailEmail = document.getElementById("detailEmail");
    const detailLoginTime = document.getElementById("detailLoginTime");

    if (accountName) accountName.textContent = name;
    if (accountEmail) accountEmail.textContent = email;
    if (detailName) detailName.textContent = name;
    if (detailEmail) detailEmail.textContent = email;
    if (detailLoginTime) detailLoginTime.textContent = loginTime;

    // Update badge plan di kartu profil
    const badgeEl = document.querySelector(".account-badge");
    if (badgeEl) {
      badgeEl.innerHTML = `<i class="fas ${badgeIcon}"></i> ${planLabel}`;
    }
  }
});

document.addEventListener("DOMContentLoaded", function () {
  /* ============================================
     1. TOGGLE SIDEBAR COLLAPSE (Tombol Hamburger)
     ============================================ */
  const collapseBtn = document.getElementById("collapseBtn");
  if (collapseBtn) {
    collapseBtn.addEventListener("click", function () {
      document.body.classList.toggle("sidebar-collapsed");

      const icon = this.querySelector("i");
      if (icon) {
        icon.classList.toggle("fa-chevron-left");
        icon.classList.toggle("fa-chevron-right");
      }
    });
  }

  /* ============================================
     2. TOGGLE NAV SECTION (Buka/Tutup Sub-menu)
     ============================================ */
  document.querySelectorAll(".nav-section-header").forEach((header) => {
    header.addEventListener("click", function () {
      const section = this.closest(".nav-section");
      section.classList.toggle("open");
    });
  });
});

// Fungsi logout global
function logout() {
  const userData = JSON.parse(localStorage.getItem("mathToolsUser") || "null");
  const isGuest = userData && userData.isGuest === true;

  const msg = isGuest
    ? "Keluar dari mode Guest?"
    : "Yakin ingin logout dari akun ini?";

  if (confirm(msg)) {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("mathToolsUser");
    window.location.href = "login.html";
  }
}

/* =========================================
   1. SIDEBAR TOGGLE
   ========================================= */
const sidebar = document.getElementById("sidebar");
const toggleBtn = document.getElementById("toggleBtn");
const collapseBtn = document.getElementById("collapseBtn");
const overlay = document.getElementById("overlay");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll(".section");
const body = document.body;

const MOBILE_BREAKPOINT = 992;
const isMobile = () => window.innerWidth <= MOBILE_BREAKPOINT;

toggleBtn.addEventListener("click", () => {
  if (isMobile()) {
    sidebar.classList.add("open");
    overlay.classList.add("show");
  } else {
    body.classList.toggle("sidebar-collapsed");
    localStorage.setItem(
      "sidebarCollapsed",
      body.classList.contains("sidebar-collapsed") ? "1" : "0",
    );
  }
});

collapseBtn.addEventListener("click", () => {
  if (!isMobile()) {
    body.classList.toggle("sidebar-collapsed");
    localStorage.setItem(
      "sidebarCollapsed",
      body.classList.contains("sidebar-collapsed") ? "1" : "0",
    );
  }
});

overlay.addEventListener("click", () => {
  sidebar.classList.remove("open");
  overlay.classList.remove("show");
});

navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const target = link.getAttribute("data-section");

    navLinks.forEach((l) => l.classList.remove("active"));
    link.classList.add("active");

    sections.forEach((s) => s.classList.remove("active"));
    const el = document.getElementById(target);
    if (el) el.classList.add("active");

    if (isMobile()) {
      sidebar.classList.remove("open");
      overlay.classList.remove("show");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

window.addEventListener("DOMContentLoaded", () => {
  if (!isMobile() && localStorage.getItem("sidebarCollapsed") === "1") {
    body.classList.add("sidebar-collapsed");
  }
});

let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (!isMobile()) {
      sidebar.classList.remove("open");
      overlay.classList.remove("show");
      if (localStorage.getItem("sidebarCollapsed") === "1") {
        body.classList.add("sidebar-collapsed");
      }
    } else {
      body.classList.remove("sidebar-collapsed");
    }
  }, 150);
});

/* =========================================
   DASHBOARD: SAPAAN, JAM & TANGGAL LIVE
   ========================================= */
document.addEventListener("DOMContentLoaded", () => {
  const greetingEl = document.getElementById("dashboardGreeting");
  const titleEl = document.getElementById("dashboardTitle");
  const clockEl = document.getElementById("dashboardClock");
  const dateEl = document.getElementById("dashboardDate");

  // Sapaan sesuai waktu + nama user
  if (greetingEl && titleEl) {
    const userData = JSON.parse(
      localStorage.getItem("mathToolsUser") || "null",
    );
    const name = userData && userData.name ? userData.name : null;
    const hour = new Date().getHours();

    let waktu = "Selamat Datang";
    if (hour >= 4 && hour < 11) waktu = "Selamat Pagi";
    else if (hour >= 11 && hour < 15) waktu = "Selamat Siang";
    else if (hour >= 15 && hour < 18) waktu = "Selamat Sore";
    else waktu = "Selamat Malam";

    greetingEl.textContent = `${waktu} 👋`;
    titleEl.textContent = name
      ? `Halo, ${name}!`
      : "Selamat Datang di MathTools Enterprise";
  }

  // Jam & tanggal live
  function updateClock() {
    if (!clockEl || !dateEl) return;
    const now = new Date();
    clockEl.textContent = now.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
    dateEl.textContent = now.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  }
  updateClock();
  setInterval(updateClock, 1000 * 30); // update tiap 30 detik cukup untuk jam
});

/* =========================================
   3. KALKULATOR BIASA
   ========================================= */
const display = document.getElementById("display");
let currentInput = "0";
let shouldResetDisplay = false;

function appendToDisplay(value) {
  if (shouldResetDisplay) {
    currentInput = "0";
    shouldResetDisplay = false;
  }
  if (currentInput === "0" && value !== ".") {
    currentInput = value;
  } else {
    currentInput += value;
  }
  display.value = currentInput;
}

function clearDisplay() {
  currentInput = "0";
  display.value = currentInput;
  shouldResetDisplay = false;
}

function deleteLast() {
  currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : "0";
  display.value = currentInput;
}

function calculate() {
  try {
    let expression = currentInput
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/−/g, "-");
    expression = expression.replace(/(\d+(\.\d+)?)%/g, "($1/100)");
    const result = eval(expression);

    if (!isFinite(result)) {
      display.value = "Error";
      currentInput = "0";
    } else {
      const rounded = Math.round(result * 100000000) / 100000000;
      display.value = rounded;
      currentInput = rounded.toString();
    }
    shouldResetDisplay = true;
  } catch (err) {
    display.value = "Error";
    currentInput = "0";
    shouldResetDisplay = true;
  }
}

document.addEventListener("keydown", (e) => {
  const calcSection = document.getElementById("calculator");
  if (!calcSection || !calcSection.classList.contains("active")) return;
  if (e.target.tagName === "INPUT" && e.target.id !== "display") return;

  const k = e.key;
  if (/[0-9]/.test(k)) appendToDisplay(k);
  else if (k === ".") appendToDisplay(".");
  else if (["+", "-", "*", "/"].includes(k)) appendToDisplay(k);
  else if (k === "%") appendToDisplay("%");
  else if (k === "Enter" || k === "=") {
    e.preventDefault();
    calculate();
  } else if (k === "Backspace") deleteLast();
  else if (k === "Escape") clearDisplay();
});

/* =========================================
   3. HELPER FUNCTIONS
   ========================================= */
function showResult(id, html) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = html;
  el.classList.add("show");
}

function hideResult(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove("show");
  el.innerHTML = "";
}

const angkaValid = (...vals) =>
  vals.every((v) => v !== "" && v !== null && !isNaN(v));

function formatNumber(num) {
  if (num === null || num === undefined || isNaN(num)) return "-";
  // Bulatkan ke 10 desimal
  const rounded = Math.round(num * 1e10) / 1e10;
  if (Number.isInteger(rounded)) return rounded.toLocaleString("id-ID");
  return rounded.toLocaleString("id-ID", { maximumFractionDigits: 10 });
}

/* =========================================
   4. BARISAN ARITMETIKA
   Un = a + (n-1)b
   ========================================= */
function hitungBarisanAritmetika() {
  const a = parseFloat(document.getElementById("baA").value);
  const b = parseFloat(document.getElementById("baB").value);
  const n = parseInt(document.getElementById("baN").value);

  if (!angkaValid(a, b, n) || n <= 0) {
    showResult(
      "resultBarisanAritmetika",
      `
            <div class="warning-box" style="padding: 10px; border-radius: 6px; background: #fef2f2; border-left: 3px solid #ef4444; color: #991b1b;">
                <strong>⚠️ Input tidak valid!</strong> Pastikan a, b, dan n (n > 0) terisi angka.
            </div>`,
    );
    return;
  }

  const Un = a + (n - 1) * b;

  // Buat deret suku (maksimal 15 suku agar tidak kepanjangan)
  const suku = [];
  const tampilMaks = Math.min(n, 15);
  for (let i = 0; i < tampilMaks; i++) {
    suku.push(a + i * b);
  }
  const deretText =
    suku.map((v) => formatNumber(v)).join(", ") +
    (n > tampilMaks ? ", ..." : "");

  showResult(
    "resultBarisanAritmetika",
    `
        <div class="result-row"><span>Suku pertama (a)</span><span>${formatNumber(a)}</span></div>
        <div class="result-row"><span>Beda (b)</span><span>${formatNumber(b)}</span></div>
        <div class="result-row"><span>Suku ke-n (n)</span><span>${n}</span></div>
        <p style="margin-top: 12px; font-weight: 600; color: #0f172a;">Deret suku:</p>
        <div class="deret-text">${deretText}</div>
        <p style="margin-top: 12px; font-size: 0.86rem; color: #64748b; font-family: 'SF Mono', monospace;">
            Un = a + (n − 1)b = ${formatNumber(a)} + (${n} − 1) × ${formatNumber(b)}
        </p>
        <span class="answer-final"><i class="fas fa-check-circle"></i> U${n} = ${formatNumber(Un)}</span>
    `,
  );
}

function resetBarisanAritmetika() {
  document.getElementById("baA").value = "";
  document.getElementById("baB").value = "";
  document.getElementById("baN").value = "";
  hideResult("resultBarisanAritmetika");
}

/* =========================================
   5. BARISAN GEOMETRI
   Un = a × r^(n-1)
   ========================================= */
function hitungBarisanGeometri() {
  const a = parseFloat(document.getElementById("bgA").value);
  const r = parseFloat(document.getElementById("bgR").value);
  const n = parseInt(document.getElementById("bgN").value);

  if (!angkaValid(a, r, n) || n <= 0) {
    showResult(
      "resultBarisanGeometri",
      `
            <div class="warning-box" style="padding: 10px; border-radius: 6px; background: #fef2f2; border-left: 3px solid #ef4444; color: #991b1b;">
                <strong>⚠️ Input tidak valid!</strong> Pastikan a, r, dan n (n > 0) terisi angka.
            </div>`,
    );
    return;
  }

  if (r === 0 && n > 1) {
    showResult(
      "resultBarisanGeometri",
      `
            <div class="warning-box" style="padding: 10px; border-radius: 6px; background: #fef2f2; border-left: 3px solid #ef4444; color: #991b1b;">
                <strong>⚠️ Rasio tidak boleh 0 untuk n > 1!</strong>
            </div>`,
    );
    return;
  }

  const Un = a * Math.pow(r, n - 1);

  // Deret suku
  const suku = [];
  const tampilMaks = Math.min(n, 15);
  for (let i = 0; i < tampilMaks; i++) {
    suku.push(a * Math.pow(r, i));
  }
  const deretText =
    suku.map((v) => formatNumber(v)).join(", ") +
    (n > tampilMaks ? ", ..." : "");

  showResult(
    "resultBarisanGeometri",
    `
        <div class="result-row"><span>Suku pertama (a)</span><span>${formatNumber(a)}</span></div>
        <div class="result-row"><span>Rasio (r)</span><span>${formatNumber(r)}</span></div>
        <div class="result-row"><span>Suku ke-n (n)</span><span>${n}</span></div>
        <p style="margin-top: 12px; font-weight: 600; color: #0f172a;">Deret suku:</p>
        <div class="deret-text">${deretText}</div>
        <p style="margin-top: 12px; font-size: 0.86rem; color: #64748b; font-family: 'SF Mono', monospace;">
            Un = a × r<sup>n−1</sup> = ${formatNumber(a)} × ${formatNumber(r)}<sup>${n - 1}</sup>
        </p>
        <span class="answer-final"><i class="fas fa-check-circle"></i> U${n} = ${formatNumber(Un)}</span>
    `,
  );
}

function resetBarisanGeometri() {
  document.getElementById("bgA").value = "";
  document.getElementById("bgR").value = "";
  document.getElementById("bgN").value = "";
  hideResult("resultBarisanGeometri");
}

/* =========================================
   6. DERET ARITMETIKA
   Sn = n/2 × (2a + (n-1)b)
   ========================================= */
function hitungDeretAritmetika() {
  const a = parseFloat(document.getElementById("daA").value);
  const b = parseFloat(document.getElementById("daB").value);
  const n = parseInt(document.getElementById("daN").value);

  if (!angkaValid(a, b, n) || n <= 0) {
    showResult(
      "resultDeretAritmetika",
      `
            <div class="warning-box" style="padding: 10px; border-radius: 6px; background: #fef2f2; border-left: 3px solid #ef4444; color: #991b1b;">
                <strong>⚠️ Input tidak valid!</strong> Pastikan a, b, dan n (n > 0) terisi angka.
            </div>`,
    );
    return;
  }

  const Sn = (n / 2) * (2 * a + (n - 1) * b);
  const Un = a + (n - 1) * b;

  // Deret suku
  const suku = [];
  const tampilMaks = Math.min(n, 15);
  for (let i = 0; i < tampilMaks; i++) {
    suku.push(a + i * b);
  }
  const deretText =
    suku.map((v) => formatNumber(v)).join(" + ") +
    (n > tampilMaks ? " + ..." : "");

  showResult(
    "resultDeretAritmetika",
    `
        <div class="result-row"><span>Suku pertama (a)</span><span>${formatNumber(a)}</span></div>
        <div class="result-row"><span>Beda (b)</span><span>${formatNumber(b)}</span></div>
        <div class="result-row"><span>Banyak suku (n)</span><span>${n}</span></div>
        <div class="result-row"><span>Suku ke-n (Un)</span><span>${formatNumber(Un)}</span></div>
        <p style="margin-top: 12px; font-weight: 600; color: #0f172a;">Deret:</p>
        <div class="deret-text">${deretText}${n > tampilMaks ? ` + ... + ${formatNumber(Un)}` : ""}</div>
        <p style="margin-top: 12px; font-size: 0.86rem; color: #64748b; font-family: 'SF Mono', monospace;">
            Sn = n/2 × (2a + (n−1)b)<br>
            S${n} = ${n}/2 × (2 × ${formatNumber(a)} + (${n} − 1) × ${formatNumber(b)})
        </p>
        <span class="answer-final"><i class="fas fa-check-circle"></i> S${n} = ${formatNumber(Sn)}</span>
    `,
  );
}

function resetDeretAritmetika() {
  document.getElementById("daA").value = "";
  document.getElementById("daB").value = "";
  document.getElementById("daN").value = "";
  hideResult("resultDeretAritmetika");
}

/* =========================================
   7. DERET GEOMETRI
   Sn = a(r^n - 1)/(r - 1), r ≠ 1
   Sn = n × a, jika r = 1
   ========================================= */
function hitungDeretGeometri() {
  const a = parseFloat(document.getElementById("dgA").value);
  const r = parseFloat(document.getElementById("dgR").value);
  const n = parseInt(document.getElementById("dgN").value);

  if (!angkaValid(a, r, n) || n <= 0) {
    showResult(
      "resultDeretGeometri",
      `
            <div class="warning-box" style="padding: 10px; border-radius: 6px; background: #fef2f2; border-left: 3px solid #ef4444; color: #991b1b;">
                <strong>⚠️ Input tidak valid!</strong> Pastikan a, r, dan n (n > 0) terisi angka.
            </div>`,
    );
    return;
  }

  let Sn, rumusText;
  if (r === 1) {
    Sn = n * a;
    rumusText = `S${n} = n × a = ${n} × ${formatNumber(a)} (karena r = 1)`;
  } else {
    Sn = (a * (Math.pow(r, n) - 1)) / (r - 1);
    rumusText = `S${n} = a × (r<sup>n</sup> − 1) / (r − 1)<br>
                     S${n} = ${formatNumber(a)} × (${formatNumber(r)}<sup>${n}</sup> − 1) / (${formatNumber(r)} − 1)`;
  }

  const Un = a * Math.pow(r, n - 1);

  // Deret suku
  const suku = [];
  const tampilMaks = Math.min(n, 15);
  for (let i = 0; i < tampilMaks; i++) {
    suku.push(a * Math.pow(r, i));
  }
  const deretText =
    suku.map((v) => formatNumber(v)).join(" + ") +
    (n > tampilMaks ? " + ..." : "");

  showResult(
    "resultDeretGeometri",
    `
        <div class="result-row"><span>Suku pertama (a)</span><span>${formatNumber(a)}</span></div>
        <div class="result-row"><span>Rasio (r)</span><span>${formatNumber(r)}</span></div>
        <div class="result-row"><span>Banyak suku (n)</span><span>${n}</span></div>
        <div class="result-row"><span>Suku ke-n (Un)</span><span>${formatNumber(Un)}</span></div>
        <p style="margin-top: 12px; font-weight: 600; color: #0f172a;">Deret:</p>
        <div class="deret-text">${deretText}${n > tampilMaks ? ` + ... + ${formatNumber(Un)}` : ""}</div>
        <p style="margin-top: 12px; font-size: 0.86rem; color: #64748b; font-family: 'SF Mono', monospace;">
            ${rumusText}
        </p>
        <span class="answer-final"><i class="fas fa-check-circle"></i> S${n} = ${formatNumber(Sn)}</span>
    `,
  );
}

function resetDeretGeometri() {
  document.getElementById("dgA").value = "";
  document.getElementById("dgR").value = "";
  document.getElementById("dgN").value = "";
  hideResult("resultDeretGeometri");
}

/* =========================================
   8. DERET GEOMETRI TAK TERHINGGA
   S∞ = a / (1 - r), |r| < 1
   ========================================= */
function hitungGTT() {
  const a = parseFloat(document.getElementById("gttA").value);
  const r = parseFloat(document.getElementById("gttR").value);

  if (!angkaValid(a, r)) {
    showResult(
      "resultGTT",
      `
            <div class="warning-box" style="padding: 10px; border-radius: 6px; background: #fef2f2; border-left: 3px solid #ef4444; color: #991b1b;">
                <strong>⚠️ Input tidak valid!</strong> Pastikan a dan r terisi angka.
            </div>`,
    );
    return;
  }

  const absR = Math.abs(r);

  // Cek konvergen: |r| < 1
  if (absR >= 1) {
    showResult(
      "resultGTT",
      `
            <div style="padding: 14px; border-radius: 6px; background: #fef2f2; border-left: 4px solid #ef4444; color: #991b1b; line-height: 1.7;">
                <strong style="font-size: 0.95rem;">❌ Deret Tidak Konvergen</strong>
                <p style="margin-top: 8px; font-size: 0.88rem;">
                    Deret geometri tak terhingga hanya memiliki jumlah (S∞) jika <strong>|r| &lt; 1</strong>.
                </p>
                <p style="margin-top: 6px; font-size: 0.88rem;">
                    Nilai |r| = ${formatNumber(absR)} ≥ 1, sehingga deret <strong>divergen</strong> (tidak memiliki jumlah tak terhingga).
                </p>
                <p style="margin-top: 6px; font-size: 0.88rem; color: #7f1d1d;">
                    💡 Coba rasio dengan nilai antara −1 dan 1, misalnya r = 0.5 atau r = −0.3.
                </p>
            </div>`,
    );
    return;
  }

  const Sinf = a / (1 - r);

  // Perkiraan suku untuk preview
  const suku = [];
  const previewMaks = 10;
  for (let i = 0; i < previewMaks; i++) {
    suku.push(a * Math.pow(r, i));
  }
  const deretText = suku.map((v) => formatNumber(v)).join(" + ") + " + ...";

  showResult(
    "resultGTT",
    `
        <div class="result-row"><span>Suku pertama (a)</span><span>${formatNumber(a)}</span></div>
        <div class="result-row"><span>Rasio (r)</span><span>${formatNumber(r)}</span></div>
        <div class="result-row"><span>|r|</span><span>${formatNumber(absR)} &lt; 1 ✓</span></div>
        <p style="margin-top: 12px; font-weight: 600; color: #0f172a;">Deret (10 suku pertama):</p>
        <div class="deret-text">${deretText}</div>
        <p style="margin-top: 12px; font-size: 0.86rem; color: #64748b; font-family: 'SF Mono', monospace;">
            S∞ = a / (1 − r)<br>
            S∞ = ${formatNumber(a)} / (1 − ${formatNumber(r)})
        </p>
        <span class="answer-final"><i class="fas fa-infinity"></i> S∞ = ${formatNumber(Sinf)}</span>
    `,
  );
}

function resetGTT() {
  document.getElementById("gttA").value = "";
  document.getElementById("gttR").value = "";
  hideResult("resultGTT");
}

/* =========================================
   9. SOAL LATIHAN — MULTI SECTION
   (Barisan Aritmetika + Barisan Geometri)
   ========================================= */

/**
 * Inisialisasi setiap grup tab soal (per section).
 * Karena ada 2+ section soal (aritmetika & geometri), kita scope
 * event listener per `.exam-tabs` supaya tidak bentrok.
 */
function initExamTabs() {
  document.querySelectorAll(".exam-tabs").forEach((tabGroup) => {
    const tabs = tabGroup.querySelectorAll(".exam-tab");
    // Section parent (untuk cari panel)
    const section = tabGroup.closest(".section");
    if (!section) return;

    const panels = section.querySelectorAll(".exam-panel");

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const target = tab.getAttribute("data-exam");

        // Reset tab di grup ini saja
        tabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");

        // Reset panel di section ini saja
        panels.forEach((p) => p.classList.remove("active"));
        const panel = section.querySelector("#" + CSS.escape(target));
        if (panel) panel.classList.add("active");
      });
    });
  });
}

/**
 * Normalisasi angka: "5.000" / "5,000" / "5000" / "0.8" → number
 * Mendukung desimal dengan titik (0.8) atau koma (0,8).
 */
function normalizeNumber(str) {
  if (str === null || str === undefined) return NaN;
  let s = String(str).trim();

  // Kalau ada titik DAN koma → asumsikan titik = pemisah ribuan
  if (s.includes(".") && s.includes(",")) {
    s = s.replace(/\./g, "").replace(",", ".");
  }
  // Kalau hanya ada koma → anggap desimal kalau 1 koma
  else if (s.includes(",")) {
    const parts = s.split(",");
    // 1 koma → desimal (5,5). >1 koma → pemisah ribuan (1,000,000)
    if (parts.length === 2) {
      s = s.replace(",", ".");
    } else {
      s = s.replace(/,/g, "");
    }
  }
  // Kalau hanya ada titik
  else if (s.includes(".")) {
    const parts = s.split(".");
    // 1 titik dan digit setelahnya 1-2 → desimal (0.8)
    if (parts.length === 2 && parts[1].length <= 2 && parts[0].length <= 3) {
      // biarkan sebagai desimal
    } else {
      // pemisah ribuan
      s = s.replace(/\./g, "");
    }
  }

  return parseFloat(s);
}

/**
 * Filter input: hanya izinkan 0-9 . , dan -
 */
function initAnswerInputs() {
  document.querySelectorAll(".user-answer").forEach((input) => {
    // Hindari double-init
    if (input.dataset.filterInit === "1") return;
    input.dataset.filterInit = "1";

    input.addEventListener("input", (e) => {
      e.target.value = e.target.value.replace(/[^0-9.,\-]/g, "");
    });

    // Enter untuk submit
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const btn = input.parentElement.querySelector(".check-btn");
        if (btn && !btn.disabled) btn.click();
      }
    });
  });
}

/**
 * Cek jawaban user
 */
function checkAnswer(btn) {
  const questionItem = btn.closest(".question-item");
  const input = questionItem.querySelector(".user-answer");
  const feedback = questionItem.querySelector(".feedback");

  const correct = normalizeNumber(questionItem.dataset.answer);
  const user = normalizeNumber(input.value);

  input.style.borderColor = "";
  input.style.boxShadow = "";

  if (input.value.trim() === "" || isNaN(user)) {
    feedback.className = "feedback show wrong";
    feedback.innerHTML =
      '<i class="fas fa-exclamation-triangle"></i> Masukkan jawaban terlebih dahulu!';
    return;
  }

  // Toleransi floating point
  const isCorrect = Math.abs(user - correct) < 0.001;

  if (isCorrect) {
    feedback.className = "feedback show correct";
    feedback.innerHTML =
      '<i class="fas fa-check-circle"></i> Jawaban Benar! 🎉';
    input.style.borderColor = "#10b981";
    input.style.boxShadow = "0 0 0 4px rgba(16, 185, 129, 0.15)";
    input.disabled = true;
    btn.disabled = true;
    btn.style.opacity = "0.6";
    btn.style.cursor = "not-allowed";
    btn.innerHTML = '<i class="fas fa-check"></i> Benar';
  } else {
    feedback.className = "feedback show wrong";
    feedback.innerHTML =
      '<i class="fas fa-times-circle"></i> Jawaban Belum Tepat. Coba lagi!';
    input.style.borderColor = "#ef4444";
    input.style.boxShadow = "0 0 0 4px rgba(239, 68, 68, 0.12)";

    input.animate(
      [
        { transform: "translateX(0)" },
        { transform: "translateX(-6px)" },
        { transform: "translateX(6px)" },
        { transform: "translateX(-4px)" },
        { transform: "translateX(4px)" },
        { transform: "translateX(0)" },
      ],
      { duration: 350, easing: "ease-in-out" },
    );
  }
}

/**
 * Toggle pembahasan
 */
function togglePembahasan(btn) {
  const content = btn.nextElementSibling;
  const isHidden = !content.classList.contains("show");

  if (isHidden) {
    content.classList.add("show");
    content.style.display = "block";
    btn.innerHTML = '<i class="fas fa-eye-slash"></i> Sembunyikan Pembahasan';
    btn.classList.add("active");
  } else {
    content.classList.remove("show");
    content.style.display = "none";
    btn.innerHTML = '<i class="fas fa-eye"></i> Tampilkan Pembahasan Lengkap';
    btn.classList.remove("active");
  }
}

/* =========================================
   10. INIT
   ========================================= */
document.addEventListener("DOMContentLoaded", () => {
  initExamTabs();
  initAnswerInputs();
  console.log("✅ MathTools Enterprise siap digunakan!");
});
