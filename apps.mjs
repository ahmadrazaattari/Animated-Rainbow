// --- Core Engine ---

let audioCtx, masterGain;
let timeScale = 1.0, isVortex = false, weatherType = 'normal';
const rainbowColors = ["#FF1E1E", "#FF7D1E", "#FFFF1E", "#1EFF1E", "#1E1EFF", "#7D1EFF", "#FF1EFF"];
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

// --- Audio System ---

function initAudio() {
    if (audioCtx) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.2;
    masterGain.connect(audioCtx.destination);
}

function playSound(freq, type = 'sine', dur = 1, vol = 0.1) {
    if (!audioCtx) initAudio();
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    g.gain.setValueAtTime(vol, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + dur);
    osc.connect(g); g.connect(masterGain);
    osc.start(); osc.stop(audioCtx.currentTime + dur);
}

// --- Visual System ---

function setupArcs() {
    const container = document.getElementById('viewport');
    container.innerHTML = "";
    const vWidth = container.offsetWidth;
    rainbowColors.forEach((color, i) => {
        const arc = document.createElement('div');
        arc.className = "arc";
        const size = vWidth - (i * (vWidth / 15));
        arc.style.width = size + "px";
        arc.style.height = (size / 2) + "px";
        arc.style.border = `${Math.max(1, size / 90)}px solid ${color}`;
        arc.style.borderBottom = "none";
        arc.style.zIndex = 50 - i;
        container.appendChild(arc);
    });
}

function flash(v) {
    document.documentElement.style.setProperty('--flash-opacity', v);
    setTimeout(() => document.documentElement.style.setProperty('--flash-opacity', '0'), 100);
}

// --- 26 Alphabetical Logic (A-Z) ---

window.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    if (!audioCtx) initAudio();
    switch (key) {
        case 'a': // Auto Mode (Ritual Sequence)
            "lpvrtfsnm".split('').forEach((k, i) => setTimeout(() => window.dispatchEvent(new KeyboardEvent('keydown', { key: k })), i * 1800));
            break;
        case 'b': // Bombardment
            particles.forEach(p => { p.vx *= 25; p.vy *= 25; });
            playSound(80, 'sawtooth', 0.8, 0.4);
            break;
        case 'c': // Constant Velocity
            timeScale = 1.0;
            particles.forEach(p => { p.vx = (Math.random() - 0.5) * 0.5; p.vy = (Math.random() - 0.5) * 0.5; });
            break;
        case 'd': // Dusting
            particles.forEach(p => p.s = 0.5);
            document.documentElement.style.setProperty('--bloom', '0px');
            break;
        case 'e': // Eccentric
            document.documentElement.style.setProperty('--sway-speed', '0.5s');
            setTimeout(() => document.documentElement.style.setProperty('--sway-speed', '20s'), 4000);
            break;
        case 'f': // Fleet Footed
            timeScale = 8.0; playSound(800, 'sine', 0.5);
            setTimeout(() => timeScale = 1.0, 3000);
            break;
        case 'g': // Gaseous
            particles.forEach(p => p.s = 8);
            document.documentElement.style.setProperty('--bloom', '15px');
            break;
        case 'h': // Hue
            document.documentElement.style.setProperty('--hue-rotate', (Math.random() * 360) + 'deg');
            break;
        case 'i': // Infrared
            document.body.style.filter = "contrast(1.5) brightness(0.7) sepia(1) hue-rotate(-50deg)";
            break;
        case 'j': // Distortion
            document.documentElement.style.setProperty('--distortion', '15px');
            setTimeout(() => document.documentElement.style.setProperty('--distortion', '0px'), 2500);
            break;
        case 'k': // Magnetic Waves
            isVortex = !isVortex; playSound(60, 'sine', 4);
            break;
        case 'l': // Lightening
            flash(0.9); playSound(40, 'square', 2.5, 0.5);
            break;
        case 'm': // Misty
            document.documentElement.style.setProperty('--fog-opacity', '0.8');
            break;
        case 'n': // Molten
            document.body.style.backgroundColor = "#210";
            document.documentElement.style.setProperty('--bloom', '25px');
            timeScale = 0.2;
            break;
        case 'o': // Out Gassed
            document.querySelectorAll('.arc').forEach(a => a.style.opacity = "0.02");
            setTimeout(() => document.querySelectorAll('.arc').forEach(a => a.style.opacity = "0.3"), 4000);
            break;
        case 'p': // Theme Changing
            const bgs = ["#000", "#001a00", "#00001a", "#1a0000"];
            document.body.style.backgroundColor = bgs[Math.floor(Math.random() * bgs.length)];
            break;
        case 'q': // Quasary
            flash(1.0); playSound(1500, 'triangle', 0.2);
            break;
        case 'r': // Rainy
            weatherType = 'rain'; playSound(150, 'sine', 8, 0.05);
            break;
        case 's': // Snowball
            weatherType = 'snow'; playSound(2500, 'sine', 0.1, 0.02);
            break;
        case 't': // Thunder Bolt
            flash(1.0); document.documentElement.style.setProperty('--shake', '15px');
            playSound(30, 'sawtooth', 1, 0.6);
            setTimeout(() => document.documentElement.style.setProperty('--shake', '0px'), 150);
            break;
        case 'u': // Refracting
            document.body.style.filter = "invert(1) saturate(5)";
            setTimeout(() => document.body.style.filter = "none", 2000);
            break;
        case 'v': // Spectrum
            document.body.style.filter = "saturate(10)";
            setTimeout(() => document.body.style.filter = "none", 5000);
            break;
        case 'w': // UV Rays
            document.body.style.filter = "hue-rotate(240deg) brightness(1.5)";
            setTimeout(() => document.body.style.filter = "none", 3000);
            break;
        case 'x': // Supernova
            flash(1.0);
            "shmnp".split('').forEach(k => window.dispatchEvent(new KeyboardEvent('keydown', { key: k })));
            playSound(100, 'sine', 5, 0.4);
            break;
        case 'y': // Superheated
            document.body.style.backgroundColor = "#410";
            playSound(200, 'triangle', 2);
            break;
        case 'z': // Drizzling
            weatherType = 'rain'; timeScale = 0.5;
            playSound(300, 'sine', 5, 0.02);
            break;
    }
});

// --- Render Loop ---

function frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    particles.forEach(p => {
        ctx.beginPath();
        if (weatherType === 'rain') {
            ctx.globalAlpha = 0.35;
            ctx.rect(p.x, p.y, 1, 15);
            p.y += 15 * timeScale;
        } else if (weatherType === 'snow') {
            ctx.globalAlpha = 0.7;
            ctx.arc(p.x, p.y, p.s * 1.8, 0, Math.PI * 2);
            p.y += 1.5 * timeScale;
            p.x += Math.sin(p.y / 60) * 2;
        } else {
            ctx.globalAlpha = 0.15;
            ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
            p.x += p.vx * timeScale;
            p.y += p.vy * timeScale;
        }
        if (isVortex) {
            p.x += (canvas.width / 2 - p.x) * 0.02;
            p.y += (canvas.height / 2 - p.y) * 0.02;
        }
        if (p.y > canvas.height) p.y = -20;
        if (p.x > canvas.width) p.x = 0;
        if (p.x < 0) p.x = canvas.width;
        ctx.fill();
    });
    requestAnimationFrame(frame);
}

window.onload = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = Array.from({ length: 500 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        s: Math.random() * 1.4 + 0.2
    }));
    setupArcs();
    frame();
};

window.onresize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    setupArcs();
};