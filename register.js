// 1. FOG EFFECT (Atmospheric Life)
const canvas = document.getElementById('fogCanvas');
const ctx = canvas.getContext('2d');

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

let smokeParticles = [];
class Smoke {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 300 + 150;
        this.velocity = Math.random() * 0.4 + 0.1;
        this.opacity = Math.random() * 0.15;
    }
    draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
    update() {
        this.x += this.velocity;
        if (this.x > canvas.width + this.size) this.x = -this.size;
    }
}

for (let i = 0; i < 25; i++) smokeParticles.push(new Smoke());

function animateFog() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    smokeParticles.forEach(s => { s.update(); s.draw(); });
    requestAnimationFrame(animateFog);
}
animateFog();

// 2. COUNTDOWN LOGIC
const eventDate = new Date("May 22, 2026 20:00:00").getTime();
setInterval(() => {
    const now = new Date().getTime();
    const diff = eventDate - now;
    const time = diff > 0 ? diff : 0;

    document.getElementById('days').innerText = String(Math.floor(time / (1000 * 60 * 60 * 24))).padStart(2, '0');
    document.getElementById('hours').innerText = String(Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
    document.getElementById('minutes').innerText = String(Math.floor((time % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
    document.getElementById('seconds').innerText = String(Math.floor((time % (1000 * 60)) / 1000)).padStart(2, '0');
}, 1000);

// 3. SCROLL PARALLAX
window.addEventListener('scroll', () => {
    const scroll = window.scrollY;
    const hero = document.getElementById('hero-countdown');
    if (hero) {
        hero.style.opacity = 1 - (scroll / 700);
        hero.style.transform = `scale(${1 + scroll / 1200}) translateY(${scroll * 0.3}px)`;
    }
});

// 4. FORM SUBMIT & REDIRECT
document.getElementById('kainosForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('.glory-btn');
    // --- REPLACE THIS WITH YOUR ACTUAL GROUP LINK ---
    const groupInviteLink = "https://chat.whatsapp.com/IFLMEVPgzhfB2T19NM4Tm3?mode=gi_t";

    // Cinematic Feedback
    submitBtn.disabled = true;
    submitBtn.style.opacity = "0.6";
    submitBtn.innerHTML = "<span>SEALING REGISTRATION...</span>";

    // Prepare data for FormSubmit AJAX
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    fetch(form.action, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            submitBtn.innerHTML = "<span>PORTAL OPENED.</span>";
            setTimeout(() => {
                window.location.href = groupInviteLink;
            }, 1000);
        } else {
            throw new Error('FormSubmit error');
        }
    })
    .catch(error => {
        console.error("Submission failed, redirecting anyway:", error);
        // Fail-safe: If the email fails, we still want them in the group.
        window.location.href = groupInviteLink;
    });
});