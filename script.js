// Variabel
let ekspresi = "";
let hasilDitampilkan = false;
let history = [];

// Fungsi untuk membuat partikel background
function createParticles() {
    const particlesContainer = document.querySelector('.particles');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 3 + 1;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(57, 255, 20, ${Math.random() * 0.3 + 0.1});
            border-radius: 50%;
            left: ${posX}%;
            top: ${posY}%;
            animation: float ${duration}s ${delay}s infinite linear;
        `;
        
        particlesContainer.appendChild(particle);
    }
}

// Tambahkan keyframe animasi float
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Fungsi faktorial
function faktorial(n) {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

// Fungsi permutasi P(n,r)
function permutasi(n, r) {
    return faktorial(n) / faktorial(n - r);
}

// Fungsi kombinasi C(n,r)
function kombinasi(n, r) {
    return faktorial(n) / (faktorial(r) * faktorial(n - r));
}

// Fungsi KPK (Kelipatan Persekutuan Terkecil)
function kpk(a, b) {
    return (a * b) / fpb(a, b);
}

// Fungsi FPB (Faktor Persekutuan Terbesar)
function fpb(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
        let t = b;
        b = a % b;
        a = t;
    }
    return a;
}

// Fungsi klik tombol
function klikTombol(teks) {
    // Simpan history
    if (teks === '=' && ekspresi) {
        history.push(ekspresi);
    }
    
    if (teks === 'C') {
        ekspresi = "";
        hasilDitampilkan = false;
        updateHistory();
    } else if (teks === '⌫') {
        if (hasilDitampilkan) {
            ekspresi = "";
            hasilDitampilkan = false;
            updateHistory();
        } else {
            ekspresi = ekspresi.slice(0, -1);
        }
    } else if (teks === '=') {
        try {
            // Ganti simbol untuk evaluasi
            let ekspresiEval = ekspresi
                .replace(/×/g, '*')
                .replace(/÷/g, '/')
                .replace(/−/g, '-');
            
            // Handle fungsi aritmetika
            ekspresiEval = ekspresiEval.replace(/x²/g, '**2');
            ekspresiEval = ekspresiEval.replace(/x³/g, '**3');
            ekspresiEval = ekspresiEval.replace(/xʸ/g, '**');
            
            // Handle akar
            ekspresiEval = ekspresiEval.replace(/√\(/g, 'Math.sqrt(');
            
            // Handle trigonometri (dalam derajat)
            ekspresiEval = ekspresiEval.replace(/sin\(/g, 'Math.sin(Math.PI/180*');
            ekspresiEval = ekspresiEval.replace(/cos\(/g, 'Math.cos(Math.PI/180*');
            ekspresiEval = ekspresiEval.replace(/tan\(/g, 'Math.tan(Math.PI/180*');
            
            // Handle logaritma
            ekspresiEval = ekspresiEval.replace(/log\(/g, 'Math.log10(');
            ekspresiEval = ekspresiEval.replace(/ln\(/g, 'Math.log(');
            ekspresiEval = ekspresiEval.replace(/eˣ\(/g, 'Math.exp(');
            
            // Handle konstanta
            ekspresiEval = ekspresiEval.replace(/π/g, 'Math.PI');
            ekspresiEval = ekspresiEval.replace(/e(?![ˣxp])/g, 'Math.E');
            
            // Handle persen
            ekspresiEval = ekspresiEval.replace(/%/g, '/100');
            
            // Handle faktorial
            ekspresiEval = ekspresiEval.replace(/(\d+)!/g, (match, num) => faktorial(parseInt(num)));
            
            // Tutup kurung yang belum ditutup
            let openCount = (ekspresiEval.match(/\(/g) || []).length;
            let closeCount = (ekspresiEval.match(/\)/g) || []).length;
            for (let i = 0; i < openCount - closeCount; i++) {
                ekspresiEval += ')';
            }
            
            // Evaluasi ekspresi
            let hasil = eval(ekspresiEval);
            
            // Format hasil
            if (typeof hasil === 'number') {
                if (!isFinite(hasil)) {
                    throw new Error("Infinity");
                }
                if (Number.isInteger(hasil)) {
                    hasil = parseInt(hasil);
                } else {
                    hasil = parseFloat(hasil.toFixed(10));
                }
            }
            
            // Update history
            updateHistory(ekspresi + ' =');
            ekspresi = String(hasil);
            hasilDitampilkan = true;
            
            // Animasi display
            animateDisplay();
            
        } catch (error) {
            ekspresi = "Error";
            hasilDitampilkan = true;
            updateHistory();
            shakeDisplay();
        }
    } else if (['sin', 'cos', 'tan', 'log', 'ln', 'eˣ'].includes(teks)) {
        ekspresi += teks + '(';
    } else if (teks === '√') {
        ekspresi += '√(';
    } else if (teks === 'π') {
        ekspresi += 'π';
    } else if (teks === '%') {
        ekspresi += '%';
    } else if (['x²', 'x³', 'xʸ'].includes(teks)) {
        ekspresi += teks;
    } else {
        if (hasilDitampilkan) {
            if ('0123456789.'.includes(teks)) {
                ekspresi = teks;
                updateHistory();
            } else {
                ekspresi += teks;
            }
            hasilDitampilkan = false;
        } else {
            ekspresi += teks;
        }
    }
    
    updateDisplay();
}

// Fungsi update display
function updateDisplay() {
    const display = document.getElementById('display');
    if (ekspresi === "") {
        display.value = "0";
    } else {
        display.value = ekspresi;
    }
}

// Fungsi update history
function updateHistory(resultText) {
    const historyDisplay = document.getElementById('displayHistory');
    if (resultText) {
        historyDisplay.textContent = resultText;
    } else if (ekspresi === "") {
        historyDisplay.textContent = "";
    }
}

// Animasi display
function animateDisplay() {
    const display = document.getElementById('display');
    display.style.transform = 'scale(1.03)';
    display.style.transition = 'transform 0.2s ease';
    
    setTimeout(() => {
        display.style.transform = 'scale(1)';
    }, 200);
}

// Animasi shake untuk error
function shakeDisplay() {
    const display = document.getElementById('display');
    display.style.animation = 'shake 0.5s ease';
    setTimeout(() => {
        display.style.animation = '';
    }, 500);
}

// Keyboard event listener
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    if ('0123456789.'.includes(key)) {
        klikTombol(key);
        event.preventDefault();
    } else if (key === '+') {
        klikTombol('+');
        event.preventDefault();
    } else if (key === '-') {
        klikTombol('-');
        event.preventDefault();
    } else if (key === '*') {
        klikTombol('×');
        event.preventDefault();
    } else if (key === '/') {
        klikTombol('÷');
        event.preventDefault();
    } else if (key === 'Enter') {
        klikTombol('=');
        event.preventDefault();
    } else if (key === 'Backspace') {
        klikTombol('⌫');
        event.preventDefault();
    } else if (key === 'Escape') {
        klikTombol('C');
        event.preventDefault();
    } else if (key === '(') {
        klikTombol('(');
        event.preventDefault();
    } else if (key === ')') {
        klikTombol(')');
        event.preventDefault();
    } else if (key === '^') {
        klikTombol('xʸ');
        event.preventDefault();
    }
});

// Inisialisasi
window.addEventListener('load', () => {
    createParticles();
    updateDisplay();
});

// ==================== FUNGSI PANEL INFORMASI ====================

// Toggle panel informasi
function toggleInfoPanel() {
    const infoContent = document.getElementById('infoContent');
    const toggleBtn = document.querySelector('.info-toggle-btn');
    
    infoContent.classList.toggle('show');
    toggleBtn.classList.toggle('active');
}

// Switch tab
function switchTab(tabName, btnElement) {
    // Sembunyikan semua tab content
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Hapus active dari semua tab button
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Tampilkan tab yang dipilih
    document.getElementById(`tab-${tabName}`).classList.add('active');
    btnElement.classList.add('active');
}

// Fungsi tampilkan jawaban soal (VERSI BARU - Jawaban benar-benar tersembunyi)
function tampilkanJawaban(btnElement, jawaban) {
    // Cari parent soal-card
    const soalCard = btnElement.closest('.soal-card');
    
    // Cari elemen answer-result dalam soal-card yang sama
    const answerResult = soalCard.querySelector('.answer-result');
    
    // Cek apakah jawaban sedang ditampilkan
    const isShowing = answerResult.classList.contains('show');
    
    if (isShowing) {
        // Sembunyikan jawaban
        answerResult.classList.remove('show');
        btnElement.innerHTML = '👁️ Lihat Jawaban';
        btnElement.style.background = 'linear-gradient(145deg, #3498DB, #2980B9)';
    } else {
        // Update teks jawaban
        answerResult.innerHTML = `Jawaban: <strong>${jawaban}</strong>`;
        
        // Tampilkan jawaban dengan animasi
        answerResult.classList.add('show');
        btnElement.innerHTML = '🙈 Sembunyikan Jawaban';
        btnElement.style.background = 'linear-gradient(145deg, #E74C3C, #C0392B)';
        
        // Efek getar pada kartu soal
        soalCard.style.transform = 'scale(1.02)';
        setTimeout(() => {
            soalCard.style.transform = 'scale(1)';
        }, 200);
    }
}

// Fungsi untuk mereset semua jawaban (digunakan saat pindah tab)
function resetAllAnswers() {
    const allAnswerResults = document.querySelectorAll('.answer-result');
    const allAnswerBtns = document.querySelectorAll('.answer-btn');
    
    allAnswerResults.forEach(result => {
        result.classList.remove('show');
    });
    
    allAnswerBtns.forEach(btn => {
        btn.innerHTML = '👁️ Lihat Jawaban';
        btn.style.background = 'linear-gradient(145deg, #3498DB, #2980B9)';
    });
}