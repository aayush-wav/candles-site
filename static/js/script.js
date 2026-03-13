/**
 * ABLAZE LUXE — INTERACTION ENGINE
 * Premium Dark Mode, Grid Warp, and Reveal Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. TEXT DRIFT LOGIC
    const driftText = document.querySelector('.hero-bg-text');
    if (driftText) {
        let driftX = 20;
        setInterval(() => {
            driftX -= 0.05;
            driftText.style.transform = `translateX(${driftX}%)`;
        }, 30);
    }

    // 2. REVEAL ANIMATIONS
    const revealElements = document.querySelectorAll('.reveal');
    const callback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    };
    const observer = new IntersectionObserver(callback, { threshold: 0.1 });
    revealElements.forEach(el => observer.observe(el));

    // 3. DARK MODE TOGGLE
    const toggleBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        toggleBtn.textContent = '☀️';
    }

    toggleBtn.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            toggleBtn.textContent = '🌙';
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            toggleBtn.textContent = '☀️';
        }
    });

    // 4. NAVBAR SCROLL EFFECT
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 5. BOOKING FORM AJAX
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(bookingForm);
            
            try {
                const response = await fetch('/booking', {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();
                if (result.status === 'success') {
                    alert(result.message);
                    bookingForm.reset();
                } else {
                    alert("Something went wrong. Please call us.");
                }
            } catch (err) {
                console.error(err);
                alert("Connection error. Please try again.");
            }
        });
    }

    // 6. GRID WARP CURSOR EFFECT
    const canvas = document.getElementById('warp-canvas');
    const ctx = canvas.getContext('2d');
    
    let width, height, rows, cols;
    const spacing = 100;
    let points = [];
    let mouse = { x: -1000, y: -1000 };

    const resize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        
        cols = Math.ceil(width / spacing) + 1;
        rows = Math.ceil(height / spacing) + 1;
        
        points = [];
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                points.push({
                    baseX: c * spacing,
                    baseY: r * spacing,
                    x: c * spacing,
                    y: r * spacing,
                    vx: 0,
                    vy: 0
                });
            }
        }
    };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    const update = () => {
        points.forEach(p => {
            const dx = mouse.x - p.baseX;
            const dy = mouse.y - p.baseY;
            const distSq = dx * dx + dy * dy;
            const dist = Math.sqrt(distSq);
            
            if (dist < 300) {
                const force = (300 - dist) / 300;
                const angle = Math.atan2(dy, dx);
                const tx = p.baseX - Math.cos(angle) * force * 150;
                const ty = p.baseY - Math.sin(angle) * force * 150;
                
                p.vx += (tx - p.x) * 0.15;
                p.vy += (ty - p.y) * 0.15;
            }

            p.vx += (p.baseX - p.x) * 0.08;
            p.vy += (p.baseY - p.y) * 0.08;
            p.vx *= 0.9;
            p.vy *= 0.9;
            p.x += p.vx;
            p.y += p.vy;
        });
    };

    const draw = () => {
        ctx.clearRect(0, 0, width, height);
        ctx.strokeStyle = localStorage.getItem('theme') === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)';
        ctx.lineWidth = 1;

        // Draw horizontal lines
        for (let r = 0; r < rows; r++) {
            ctx.beginPath();
            for (let c = 0; c < cols; c++) {
                const p = points[r * cols + c];
                if (c === 0) ctx.moveTo(p.x, p.y);
                else ctx.lineTo(p.x, p.y);
            }
            ctx.stroke();
        }

        // Draw vertical lines
        for (let c = 0; c < cols; c++) {
            ctx.beginPath();
            for (let r = 0; r < rows; r++) {
                const p = points[r * cols + c];
                if (r === 0) ctx.moveTo(p.x, p.y);
                else ctx.lineTo(p.x, p.y);
            }
            ctx.stroke();
        }

        update();
        requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    draw();
});
