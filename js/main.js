// ===== Navbar Scroll Effect =====
const navbar = document.getElementById('navbar');

function handleNavScroll() {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

window.addEventListener('scroll', handleNavScroll);
handleNavScroll();

// ===== Mobile Menu =====
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');

if (burger && navLinks) {
    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });
}

// ===== Cursor-Reactive Particles =====
const particlesContainer = document.getElementById('particles');

if (particlesContainer) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;';
    particlesContainer.appendChild(canvas);

    let mouseX = -1000;
    let mouseY = -1000;
    let particles = [];
    const PARTICLE_COUNT = 60;
    const MOUSE_RADIUS = 180;

    function resizeCanvas() {
        const rect = particlesContainer.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Track mouse relative to hero section
    const heroSection = particlesContainer.closest('.hero') || particlesContainer.parentElement;
    document.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    });

    document.addEventListener('mouseleave', () => {
        mouseX = -1000;
        mouseY = -1000;
    });

    // Particle colors from our literary palette
    const colors = [
        { r: 212, g: 165, b: 116 }, // gold
        { r: 114, g: 47, b: 55 },   // burgundy
        { r: 74, g: 124, b: 89 },   // green
        { r: 230, g: 201, b: 168 }, // light gold
        { r: 154, g: 74, b: 84 },   // light burgundy
    ];

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.baseX = this.x;
            this.baseY = this.y;
            this.size = Math.random() * 3 + 1;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.alpha = Math.random() * 0.4 + 0.1;
            this.baseAlpha = this.alpha;
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = (Math.random() - 0.5) * 0.3;
            this.driftSpeed = Math.random() * 0.005 + 0.002;
            this.driftOffset = Math.random() * Math.PI * 2;
            this.pulseSpeed = Math.random() * 0.02 + 0.01;
            this.pulseOffset = Math.random() * Math.PI * 2;
        }

        update(time) {
            // Gentle drifting motion
            this.x += this.vx + Math.sin(time * this.driftSpeed + this.driftOffset) * 0.2;
            this.y += this.vy + Math.cos(time * this.driftSpeed + this.driftOffset * 0.7) * 0.15;

            // Pulsing alpha
            this.alpha = this.baseAlpha + Math.sin(time * this.pulseSpeed + this.pulseOffset) * 0.1;

            // Mouse interaction — particles are attracted/repelled
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < MOUSE_RADIUS) {
                const force = (1 - dist / MOUSE_RADIUS) * 0.8;
                // Gentle attraction + swirl
                const angle = Math.atan2(dy, dx);
                this.x += Math.cos(angle + 1.2) * force * 1.5;
                this.y += Math.sin(angle + 1.2) * force * 1.5;
                // Brighten near cursor
                this.alpha = Math.min(0.8, this.alpha + force * 0.5);
                // Grow near cursor
                this.renderSize = this.size + force * 3;
            } else {
                this.renderSize = this.size;
            }

            // Wrap around edges
            if (this.x < -20) this.x = canvas.width + 20;
            if (this.x > canvas.width + 20) this.x = -20;
            if (this.y < -20) this.y = canvas.height + 20;
            if (this.y > canvas.height + 20) this.y = -20;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.renderSize || this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.alpha})`;
            ctx.fill();
        }
    }

    // Initialize particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }

    // Draw connecting lines between nearby particles
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    const opacity = (1 - dist / 120) * 0.08;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(212, 165, 116, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    // Mouse connection lines
    function drawMouseConnections() {
        particles.forEach(p => {
            const dx = mouseX - p.x;
            const dy = mouseY - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < MOUSE_RADIUS) {
                const opacity = (1 - dist / MOUSE_RADIUS) * 0.2;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(mouseX, mouseY);
                ctx.strokeStyle = `rgba(212, 165, 116, ${opacity})`;
                ctx.lineWidth = 0.8;
                ctx.stroke();
            }
        });
    }

    function animate(time) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.update(time);
            p.draw();
        });

        drawConnections();
        drawMouseConnections();

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
}

// ===== Cursor Glow Effect =====
const cursorGlow = document.createElement('div');
cursorGlow.className = 'cursor-glow';
document.body.appendChild(cursorGlow);

let glowX = 0, glowY = 0;
let currentGlowX = 0, currentGlowY = 0;

document.addEventListener('mousemove', (e) => {
    glowX = e.clientX;
    glowY = e.clientY;
});

function updateGlow() {
    currentGlowX += (glowX - currentGlowX) * 0.08;
    currentGlowY += (glowY - currentGlowY) * 0.08;
    cursorGlow.style.left = currentGlowX + 'px';
    cursorGlow.style.top = currentGlowY + 'px';
    requestAnimationFrame(updateGlow);
}

updateGlow();

// ===== Text Split & Character Animation =====
function splitTextToChars(element) {
    const text = element.textContent;
    element.textContent = '';
    element.classList.add('text-animate');

    let charIndex = 0;
    const words = text.split(' ');

    words.forEach((word, wordIdx) => {
        const wordSpan = document.createElement('span');
        wordSpan.classList.add('word');

        for (let i = 0; i < word.length; i++) {
            const charSpan = document.createElement('span');
            charSpan.classList.add('char');
            charSpan.textContent = word[i];
            charSpan.style.animationDelay = (charIndex * 0.03) + 's';
            wordSpan.appendChild(charSpan);
            charIndex++;
        }

        element.appendChild(wordSpan);

        if (wordIdx < words.length - 1) {
            const space = document.createTextNode('\u00A0');
            element.appendChild(space);
            charIndex++;
        }
    });
}

// Animate section titles on scroll
const titleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
            entry.target.dataset.animated = 'true';
            splitTextToChars(entry.target);
            titleObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.section-title').forEach(title => {
    titleObserver.observe(title);
});

// ===== Stats Counter Animation =====
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');

    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        if (!target || counter.dataset.animated === 'true') return;

        const duration = 2000;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            counter.textContent = Math.floor(target * eased);

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                counter.textContent = target;
                counter.dataset.animated = 'true';
            }
        }

        requestAnimationFrame(update);
    });
}

// ===== Intersection Observer for Scroll Animations =====
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -30px 0px'
};

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.about-card, .service-card, .article-card, .contact-card').forEach((el, index) => {
    el.classList.add('fade-in');
    el.style.transitionDelay = (index % 4) * 0.1 + 's';
    fadeObserver.observe(el);
});

// Reveal observer for other elements
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('.section-header, .cta-card, .contact-form-wrapper, .contact-info').forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
});

// Stats observer
const statsSection = document.querySelector('.stats');
if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    statsObserver.observe(statsSection);
}

// ===== Articles Category Filter =====
const filterBtns = document.querySelectorAll('.filter-btn');
const articleCards = document.querySelectorAll('.article-card');
const articlesEmpty = document.getElementById('articlesEmpty');

function filterArticles(category) {
    let visibleCount = 0;

    articleCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (category === 'all' || cardCategory === category) {
            card.classList.remove('hidden');
            visibleCount++;
        } else {
            card.classList.add('hidden');
        }
    });

    if (articlesEmpty) {
        articlesEmpty.style.display = visibleCount === 0 ? 'block' : 'none';
    }
}

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterArticles(btn.getAttribute('data-category'));
    });
});

// Handle category from URL params
const urlParams = new URLSearchParams(window.location.search);
const categoryParam = urlParams.get('category');
if (categoryParam) {
    const targetBtn = document.querySelector(`.filter-btn[data-category="${categoryParam}"]`);
    if (targetBtn) {
        filterBtns.forEach(b => b.classList.remove('active'));
        targetBtn.classList.add('active');
        filterArticles(categoryParam);
    }
}

// ===== Contact Form =====
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = contactForm.querySelector('#name').value.trim();
        const phone = contactForm.querySelector('#phone').value.trim();
        const email = contactForm.querySelector('#email').value.trim();
        const subject = contactForm.querySelector('#subject');
        const subjectText = subject.options[subject.selectedIndex]
            ? subject.options[subject.selectedIndex].text
            : '';
        const message = contactForm.querySelector('#message').value.trim();

        const body = [
            'Имя: ' + name,
            phone ? 'Телефон: ' + phone : '',
            email ? 'Email: ' + email : '',
            subjectText ? 'Тема: ' + subjectText : '',
            message ? '\nСообщение:\n' + message : ''
        ].filter(Boolean).join('\n');

        const mailtoLink = 'mailto:info@olwrite.ru'
            + '?subject=' + encodeURIComponent('Заявка с сайта: ' + (subjectText || 'Общий вопрос'))
            + '&body=' + encodeURIComponent(body);

        window.location.href = mailtoLink;

        contactForm.style.display = 'none';
        if (formSuccess) {
            formSuccess.style.display = 'block';
        }
    });
}
