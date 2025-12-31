// ============= MAGNETIC REPULSION EFFECT (From 2026.html) =============
class MagneticElements {
    constructor() {
        this.container = document.getElementById('magneticContainer');
        if (!this.container) return;
        
        this.numItems = 40;
        this.chars = ['2', '0', '2', '6', '★', '●', '✦', '✨', '🎉', '🎊', '💫'];
        this.colors = ['#FFB800', '#FF6B35', '#FF006E', '#8338EC', '#4ECDC4', '#FFF275'];
        this.floatingElements = [];
        this.mouseX = -1000;
        this.mouseY = -1000;
        this.isActive = true;
        
        this.init();
        this.setupEventListeners();
        this.animate();
    }
    
    init() {
        for (let i = 0; i < this.numItems; i++) {
            const span = document.createElement('span');
            span.classList.add('floating-char');
            span.innerText = this.chars[Math.floor(Math.random() * this.chars.length)];
            
            // Random styling
            const size = Math.random() * 70 + 30; // 30px to 100px
            span.style.fontSize = `${size}px`;
            span.style.fontWeight = Math.random() > 0.5 ? '800' : '300';
            span.style.color = this.colors[Math.floor(Math.random() * this.colors.length)];
            span.style.opacity = 0.4 + Math.random() * 0.4;
            
            // Initial Position (Spread across screen)
            let posX = (Math.random() * 90 + 5) + '%';
            let posY = Math.random() * 90 + 5 + '%';
            
            span.style.left = posX;
            span.style.top = posY;
            
            // Store physics data
            const x = window.innerWidth * (parseFloat(posX)/100);
            const y = window.innerHeight * (parseFloat(posY)/100);
            
            this.floatingElements.push({
                element: span,
                originX: x,
                originY: y,
                x: x,
                y: y,
                vx: 0,
                vy: 0,
                mass: size / 15,
                rotation: Math.random() * 360
            });
            
            this.container.appendChild(span);
        }
    }
    
    setupEventListeners() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            
            // Create trail on landing screen
            if (this.isActive) {
                this.createTrail(e.clientX, e.clientY);
            }
        });
        
        window.addEventListener('resize', () => {
            this.floatingElements.forEach(item => {
                const posX = parseFloat(item.element.style.left);
                const posY = parseFloat(item.element.style.top);
                item.originX = window.innerWidth * (posX/100);
                item.originY = window.innerHeight * (posY/100);
            });
        });
    }
    
    createTrail(x, y) {
        const dot = document.createElement('div');
        dot.classList.add('cursor-trail');
        dot.style.left = (x - 5) + 'px';
        dot.style.top = (y - 5) + 'px';
        document.body.appendChild(dot);
        
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * 25;
        const tx = Math.cos(angle) * dist;
        const ty = Math.sin(angle) * dist;
        
        dot.animate([
            { transform: 'scale(1)', opacity: 0.6 },
            { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
        ], {
            duration: 1200,
            easing: 'ease-out',
            fill: 'forwards'
        }).onfinish = () => dot.remove();
    }
    
    animate() {
        if (!this.isActive) return;
        
        this.floatingElements.forEach(item => {
            // Distance to mouse
            const dx = this.mouseX - item.x;
            const dy = this.mouseY - item.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            const repulsionRadius = 200;
            
            if (dist < repulsionRadius && dist > 0) {
                const force = (repulsionRadius - dist) / repulsionRadius;
                const angle = Math.atan2(dy, dx);
                
                // Push away from mouse
                item.vx -= Math.cos(angle) * force * 3;
                item.vy -= Math.sin(angle) * force * 3;
                
                // Add rotation
                item.rotation += force * 10;
            }
            
            // Return to origin (Spring force)
            const ox = item.originX - item.x;
            const oy = item.originY - item.y;
            
            item.vx += ox * 0.03;
            item.vy += oy * 0.03;
            
            // Friction
            item.vx *= 0.92;
            item.vy *= 0.92;
            
            // Update position
            item.x += item.vx;
            item.y += item.vy;
            
            // Apply transform
            const deltaX = item.x - item.originX;
            const deltaY = item.y - item.originY;
            item.element.style.transform = `translate(${deltaX}px, ${deltaY}px) rotate(${item.rotation}deg)`;
        });
        
        requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        this.isActive = false;
        this.container.innerHTML = '';
    }
}

// ============= PARTICLE BACKGROUND =============
class ParticleBackground {
    constructor() {
        this.canvas = document.getElementById('particleCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 100;
        this.mouse = { x: null, y: null, radius: 150 };
        
        this.init();
        this.animate();
        this.setupEventListeners();
    }

    init() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        // Bright, celebratory colors
        const brightColors = [
            'rgba(255, 184, 0, 0.8)',   // Gold
            'rgba(255, 107, 53, 0.8)',  // Orange
            'rgba(255, 0, 110, 0.8)',   // Pink
            'rgba(131, 56, 236, 0.8)',  // Purple
            'rgba(78, 205, 196, 0.8)',  // Cyan
            'rgba(255, 242, 117, 0.8)'  // Yellow
        ];

        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 4 + 2,
                speedX: (Math.random() - 0.5) * 0.8,
                speedY: (Math.random() - 0.5) * 0.8,
                color: brightColors[Math.floor(Math.random() * brightColors.length)]
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) particle.speedX *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.speedY *= -1;

            // Mouse interaction
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.mouse.radius) {
                const angle = Math.atan2(dy, dx);
                particle.x -= Math.cos(angle) * 2;
                particle.y -= Math.sin(angle) * 2;
            }

            // Draw particle
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        });

        // Connect nearby particles
        this.particles.forEach((p1, i) => {
            this.particles.slice(i + 1).forEach(p2 => {
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    this.ctx.strokeStyle = `rgba(255, 184, 0, ${1 - distance / 120})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                }
            });
        });

        requestAnimationFrame(() => this.animate());
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });
    }
}

// ============= COUNTDOWN TIMER =============
function updateCountdown() {
    const countdownElement = document.getElementById('countdown');
    const newYear = new Date('2026-01-01T00:00:00').getTime();
    const now = new Date().getTime();
    const distance = newYear - now;

    if (distance < 0) {
        countdownElement.innerHTML = "🎉 HAPPY NEW YEAR 2026! 🎉";
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    countdownElement.innerHTML = `
        <span>${days}d</span> : 
        <span>${hours}h</span> : 
        <span>${minutes}m</span> : 
        <span>${seconds}s</span>
    `;

    setTimeout(updateCountdown, 1000);
}

// ============= ENHANCED FIREWORKS =============
class BackgroundFireworks {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = '1';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.opacity = '0.35';
        document.body.appendChild(this.canvas);
        
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        this.fireworks = [];
        this.particles = [];
        
        this.colors = [
            '#FFB800', '#FF6B35', '#FF006E', '#8338EC', 
            '#4ECDC4', '#FFF275', '#FF10F0', '#00F0FF'
        ];
        
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });
        
        this.animate();
    }
    
    createFirework() {
        this.fireworks.push({
            x: Math.random() * this.canvas.width,
            y: this.canvas.height,
            targetY: Math.random() * this.canvas.height * 0.5,
            velocity: 8 + Math.random() * 4,
            color: this.colors[Math.floor(Math.random() * this.colors.length)]
        });
    }
    
    explode(x, y, color) {
        const particleCount = 50 + Math.floor(Math.random() * 50);
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const velocity = 2 + Math.random() * 6;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                life: 1,
                color: color,
                size: 2 + Math.random() * 3
            });
        }
    }
    
    animate() {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw fireworks
        this.fireworks = this.fireworks.filter(fw => {
            fw.y -= fw.velocity;
            
            this.ctx.beginPath();
            this.ctx.arc(fw.x, fw.y, 3, 0, Math.PI * 2);
            this.ctx.fillStyle = fw.color;
            this.ctx.fill();
            
            if (fw.y <= fw.targetY) {
                this.explode(fw.x, fw.y, fw.color);
                return false;
            }
            return true;
        });
        
        // Update and draw particles
        this.particles = this.particles.filter(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.1; // gravity
            p.life -= 0.01;
            
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = p.life;
            this.ctx.fill();
            this.ctx.globalAlpha = 1;
            
            return p.life > 0;
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

function createFirework(x, y) {
    const colors = ['#FFB800', '#FF6B35', '#FF006E', '#8338EC', '#4ECDC4', '#FFF275'];
    const fireworksContainer = document.getElementById('fireworksContainer');
    
    for (let i = 0; i < 40; i++) {
        const firework = document.createElement('div');
        firework.className = 'firework';
        firework.style.left = x + 'px';
        firework.style.top = y + 'px';
        firework.style.background = colors[Math.floor(Math.random() * colors.length)];
        firework.style.boxShadow = `0 0 10px ${colors[Math.floor(Math.random() * colors.length)]}`;
        
        const angle = (Math.PI * 2 * i) / 40;
        const velocity = 50 + Math.random() * 80;
        
        firework.style.setProperty('--tx', Math.cos(angle) * velocity + 'px');
        firework.style.setProperty('--ty', Math.sin(angle) * velocity + 'px');
        
        fireworksContainer.appendChild(firework);
        
        setTimeout(() => firework.remove(), 1200);
    }
}

function autoFireworks() {
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight * 0.6;
    createFirework(x, y);
}

// ============= FORTUNE COOKIE =============
const fortunes = [
    "✨ 2026 brings you boundless creativity and inspiration!",
    "💫 This year, your dreams will manifest into reality!",
    "🌟 Unexpected opportunities will knock on your door in 2026!",
    "🎯 Success follows those who dare to take the leap - that's you!",
    "💝 Love and laughter will fill your days throughout the year!",
    "🚀 Your hard work will finally pay off in spectacular ways!",
    "🌈 2026 is your year to shine brighter than ever before!",
    "⭐ Adventure and excitement await you at every corner!",
    "🎨 Your unique talents will be recognized and celebrated!",
    "🏆 Victory is yours in all your endeavors this year!",
    "💪 You'll discover strength you never knew you had!",
    "🌺 Inner peace and happiness will be your companions!",
    "🎭 2026 will be filled with beautiful memories and moments!",
    "🔮 The universe is aligning in your favor this year!",
    "🌠 Your positive energy will attract amazing people and experiences!"
];

function openFortuneCookie() {
    const cookie = document.getElementById('cookie');
    const fortunePaper = document.getElementById('fortunePaper');
    const fortuneText = document.getElementById('fortuneText');
    
    if (!cookie.classList.contains('opened')) {
        cookie.classList.add('opened');
        const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
        fortuneText.textContent = randomFortune;
        
        // Enhanced confetti effect
        createEnhancedConfetti();
        
        // Shake animation
        cookie.animate([
            { transform: 'rotate(0deg)' },
            { transform: 'rotate(-5deg)' },
            { transform: 'rotate(5deg)' },
            { transform: 'rotate(-5deg)' },
            { transform: 'rotate(5deg)' },
            { transform: 'rotate(0deg)' }
        ], {
            duration: 500,
            easing: 'ease-in-out'
        });
    } else {
        cookie.classList.remove('opened');
        setTimeout(() => {
            fortuneText.textContent = '';
        }, 600);
    }
}

function createEnhancedConfetti() {
    const colors = ['#FFB800', '#FF6B35', '#FF006E', '#8338EC', '#4ECDC4', '#FFF275'];
    const shapes = ['●', '★', '■', '▲', '♦', '✦'];
    
    for (let i = 0; i < 80; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            const isShape = Math.random() > 0.5;
            
            if (isShape) {
                confetti.textContent = shapes[Math.floor(Math.random() * shapes.length)];
                confetti.style.fontSize = (10 + Math.random() * 15) + 'px';
            } else {
                confetti.style.width = (5 + Math.random() * 10) + 'px';
                confetti.style.height = confetti.style.width;
                confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            }
            
            confetti.style.position = 'fixed';
            confetti.style.color = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = (Math.random() * 100) + '%';
            confetti.style.top = '-20px';
            confetti.style.zIndex = '9999';
            confetti.style.pointerEvents = 'none';
            
            document.body.appendChild(confetti);
            
            const duration = 2000 + Math.random() * 1500;
            const rotation = Math.random() * 720 - 360;
            const xMovement = (Math.random() - 0.5) * 300;
            const scale = 0.5 + Math.random() * 0.5;
            
            confetti.animate([
                { 
                    transform: `translateY(0) translateX(0) rotate(0deg) scale(${scale})`, 
                    opacity: 1 
                },
                { 
                    transform: `translateY(${window.innerHeight + 50}px) translateX(${xMovement}px) rotate(${rotation}deg) scale(${scale * 0.5})`, 
                    opacity: 0 
                }
            ], {
                duration: duration,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            });
            
            setTimeout(() => confetti.remove(), duration);
        }, i * 20);
    }
}

// ============= WISH WALL =============
const presetWishes = [
    "✨ Health & Happiness",
    "💰 Prosperity & Success",
    "❤️ Love & Joy",
    "🌟 Dreams Come True",
    "🚀 New Adventures"
];

function addWish(wishText) {
    const wishesContainer = document.getElementById('wishesContainer');
    const wishBubble = document.createElement('div');
    wishBubble.className = 'wish-bubble';
    wishBubble.textContent = wishText;
    wishBubble.style.animationDelay = Math.random() * 2 + 's';
    
    // Add click interaction
    wishBubble.addEventListener('click', () => {
        createWishSparkles(wishBubble);
    });
    
    wishesContainer.appendChild(wishBubble);
    
    // Entrance animation
    wishBubble.animate([
        { transform: 'scale(0) rotate(-180deg)', opacity: 0 },
        { transform: 'scale(1) rotate(0deg)', opacity: 1 }
    ], {
        duration: 600,
        easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
    });
}

function createWishSparkles(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 8; i++) {
        const sparkle = document.createElement('div');
        sparkle.textContent = '✨';
        sparkle.style.position = 'fixed';
        sparkle.style.left = centerX + 'px';
        sparkle.style.top = centerY + 'px';
        sparkle.style.fontSize = '16px';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '10000';
        
        document.body.appendChild(sparkle);
        
        const angle = (Math.PI * 2 * i) / 8;
        const distance = 40 + Math.random() * 30;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        sparkle.animate([
            { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
            { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
        ], {
            duration: 600,
            easing: 'ease-out'
        }).onfinish = () => sparkle.remove();
    }
}

function initializeWishes() {
    presetWishes.forEach((wish, index) => {
        setTimeout(() => addWish(wish), index * 200);
    });
}

// ============= ENHANCED GOAL CARDS INTERACTION =============
function setupGoalCards() {
    const goalCards = document.querySelectorAll('.goal-card');
    
    goalCards.forEach(card => {
        const emoji = card.querySelector('.card-emoji-wrapper');
        
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
            
            // Create burst effect on flip
            if (card.classList.contains('flipped')) {
                createEmojiBurst(card);
            }
        });
        
        // Magnetic effect on hover
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const deltaX = (x - centerX) / centerX;
            const deltaY = (y - centerY) / centerY;
            
            if (emoji) {
                emoji.style.transform = `translate(${deltaX * 10}px, ${deltaY * 10}px) scale(1.1) rotate(${deltaX * 5}deg)`;
            }
        });
        
        card.addEventListener('mouseleave', () => {
            if (emoji) {
                emoji.style.transform = '';
            }
        });
    });
}

// Create emoji burst effect
function createEmojiBurst(card) {
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const emojis = ['✨', '⭐', '💫', '🌟', '✦'];
    
    for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        particle.style.position = 'fixed';
        particle.style.left = centerX + 'px';
        particle.style.top = centerY + 'px';
        particle.style.fontSize = '24px';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '10000';
        
        document.body.appendChild(particle);
        
        const angle = (Math.PI * 2 * i) / 12;
        const distance = 100 + Math.random() * 50;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        particle.animate([
            { transform: 'translate(-50%, -50%) scale(0) rotate(0deg)', opacity: 1 },
            { transform: `translate(${tx}px, ${ty}px) scale(1) rotate(${Math.random() * 360}deg)`, opacity: 0 }
        ], {
            duration: 800 + Math.random() * 400,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }).onfinish = () => particle.remove();
    }
}

// ============= NAVIGATION =============
let magneticEffect = null;

function startJourney() {
    // Get the user's name
    const userName = document.getElementById('userName').value.trim();
    
    // Validate name input
    if (!userName) {
        alert('Please enter your name to begin the journey! 🎊');
        return;
    }
    
    const landingScreen = document.getElementById('landingScreen');
    const experienceScreen = document.getElementById('experienceScreen');
    
    // Store the name for later use
    window.userName = userName;
    
    landingScreen.classList.remove('active');
    experienceScreen.classList.add('active');
    
    // Destroy magnetic effect
    if (magneticEffect) {
        magneticEffect.destroy();
    }
    
    // Show personalized message after interactions
    showPersonalizedMessage();
    
    // Trigger fireworks
    for (let i = 0; i < 5; i++) {
        setTimeout(() => autoFireworks(), i * 300);
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showPersonalizedMessage() {
    const messageSection = document.getElementById('personalizedMessage');
    const messageText = document.getElementById('messageText');
    
    const messages = [
        `Dear ${window.userName}, as we step into 2026, I want to take a moment to thank you for everything you've brought into my life. Your presence and the memories we've shared have been truly special. I wish you a year filled with endless possibilities, boundless joy, and countless moments of success. May every day bring you closer to your dreams and fill your heart with happiness. Here's to new adventures, cherished memories, and a bright future ahead!`,
        `${window.userName}, thank you for being such an important part of my journey. The laughter, moments, and experiences you've brought into my life are treasures I deeply cherish. May 2026 be the year where all your dreams take flight! Wishing you prosperity, good health, and the courage to chase what sets your soul on fire. May you find magic in every moment and strength in every challenge. Cheers to an amazing year ahead!`,
        `Wishing you, ${window.userName}, a spectacular 2026! I'm grateful for all the joy, wisdom, and warmth you've brought into my life. Your friendship means the world to me. May this year bring you peace, prosperity, and all the happiness you deserve. Here's to creating beautiful memories, achieving great milestones, and spreading smiles wherever you go. Happy New Year!`
    ];
    
    // Pick a random message
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    messageText.textContent = randomMessage;
    
    // Show the message after a delay
    setTimeout(() => {
        messageSection.style.display = 'block';
        messageSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 2000);
}

// ============= SOUND CONTROL =============
let soundEnabled = false;

function toggleSound() {
    const soundToggle = document.getElementById('soundToggle');
    const bgMusic = document.getElementById('bgMusic');
    
    soundEnabled = !soundEnabled;
    soundToggle.classList.toggle('muted');
    
    if (soundEnabled) {
        bgMusic.play().catch(e => console.log('Audio play failed:', e));
    } else {
        bgMusic.pause();
    }
}

// ============= SHARE FUNCTIONALITY =============
function shareExperience() {
    const shareData = {
        title: '✨ Happy New Year 2026! ✨',
        text: 'Check out this amazing interactive New Year experience! 🎉',
        url: window.location.href
    };

    if (navigator.share) {
        navigator.share(shareData)
            .then(() => console.log('Shared successfully'))
            .catch((error) => console.log('Error sharing:', error));
    } else {
        // Fallback: Copy to clipboard
        navigator.clipboard.writeText(window.location.href)
            .then(() => {
                alert('✅ Link copied to clipboard!');
            })
            .catch(err => {
                console.error('Could not copy text: ', err);
            });
    }
}

// ============= MOUSE TRAIL EFFECT =============
class MouseTrail {
    constructor() {
        this.particles = [];
        this.colors = ['#FFB800', '#FF6B35', '#FF006E', '#8338EC', '#4ECDC4', '#FFF275'];
        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => {
            this.createParticle(e.clientX, e.clientY);
        });
        this.animate();
    }

    createParticle(x, y) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = '8px';
        particle.style.height = '8px';
        particle.style.borderRadius = '50%';
        const color = this.colors[Math.floor(Math.random() * this.colors.length)];
        particle.style.background = color;
        particle.style.boxShadow = `0 0 10px ${color}`;
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        particle.style.transition = 'all 0.5s ease-out';
        
        document.body.appendChild(particle);
        
        this.particles.push({
            element: particle,
            life: 1
        });

        if (this.particles.length > 40) {
            const old = this.particles.shift();
            old.element.remove();
        }
    }

    animate() {
        this.particles.forEach((particle, index) => {
            particle.life -= 0.02;
            particle.element.style.opacity = particle.life;
            particle.element.style.transform = `scale(${particle.life})`;
            
            if (particle.life <= 0) {
                particle.element.remove();
                this.particles.splice(index, 1);
            }
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// ============= INITIALIZATION =============
document.addEventListener('DOMContentLoaded', () => {
    // Initialize magnetic elements on landing screen
    magneticEffect = new MagneticElements();
    
    // Initialize particle background
    new ParticleBackground();
    
    // Initialize mouse trail
    new MouseTrail();
    
    // Initialize background fireworks
    const bgFireworks = new BackgroundFireworks();
    
    // Launch fireworks continuously
    setInterval(() => {
        if (Math.random() > 0.3) {
            bgFireworks.createFirework();
        }
    }, 800);
    
    // Start countdown
    updateCountdown();
    
    // Auto fireworks every 2 seconds
    setInterval(autoFireworks, 2000);
    
    // Setup event listeners
    document.getElementById('startJourney').addEventListener('click', startJourney);
    document.getElementById('fortuneCookie').addEventListener('click', openFortuneCookie);
    document.getElementById('soundToggle').addEventListener('click', toggleSound);
    document.getElementById('shareButton').addEventListener('click', shareExperience);
    
    // Wish wall
    document.getElementById('sendWish').addEventListener('click', () => {
        const wishInput = document.getElementById('wishInput');
        const wishText = wishInput.value.trim();
        
        if (wishText) {
            addWish(wishText);
            wishInput.value = '';
            createConfetti();
        }
    });
    
    // Enter key for wish input
    document.getElementById('wishInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            document.getElementById('sendWish').click();
        }
    });
    
    // Initialize preset wishes
    setTimeout(initializeWishes, 1000);
    
    // Setup goal cards
    setupGoalCards();
    
    // Click anywhere on landing to create fireworks
    document.getElementById('landingScreen').addEventListener('click', (e) => {
        if (e.target.id !== 'startJourney') {
            createFirework(e.clientX, e.clientY);
        }
    });
});

// ============= PERFORMANCE OPTIMIZATION =============
// Lazy load animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
        }
    });
}, observerOptions);

// Observe sections
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.fortune-section, .wish-wall-section, .goals-section, .final-message');
    sections.forEach(section => observer.observe(section));
});

// ============= EASTER EGGS =============
// Konami Code Easter Egg
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode.splice(-konamiSequence.length - 1, konamiCode.length - konamiSequence.length);
    
    if (konamiCode.join('').includes(konamiSequence.join(''))) {
        // Special surprise
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                autoFireworks();
                createConfetti();
            }, i * 100);
        }
        alert('🎊 You found the secret! May 2026 be LEGENDARY! 🎊');
        konamiCode = [];
    }
});

console.log('%c🎉 Happy New Year 2026! 🎉', 'font-size: 30px; color: gold; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);');
console.log('%cTry the Konami Code for a surprise! ⬆️⬆️⬇️⬇️⬅️➡️⬅️➡️BA', 'font-size: 14px; color: #00F0FF;');
