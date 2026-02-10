// DOM 元素获取
const themeToggle = document.getElementById('theme-toggle');
const musicToggle = document.getElementById('music-toggle');
const musicIcon = document.querySelector('.music-icon');
const bgm = document.getElementById('bgm');
const prevWish = document.querySelector('.prev-wish');
const nextWish = document.querySelector('.next-wish');
const wishCards = document.querySelectorAll('.wish-card');
const customWish = document.getElementById('custom-wish');
const previewText = document.getElementById('preview-text');
const copyWish = document.getElementById('copy-wish');
const resetWish = document.getElementById('reset-wish');
const backToTop = document.getElementById('back-to-top');
const fireworks = document.getElementById('fireworks');
const ctx = fireworks.getContext('2d');

// 设置画布大小
function resizeCanvas() {
    fireworks.width = window.innerWidth;
    fireworks.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// 主题切换功能
let currentTheme = 0;
const themes = ['', 'theme-blue', 'theme-pink'];

themeToggle.addEventListener('click', () => {
    currentTheme = (currentTheme + 1) % themes.length;
    document.body.className = themes[currentTheme];
});

// 音乐控制功能
let isMusicPlaying = false;

musicToggle.addEventListener('click', () => {
    if (isMusicPlaying) {
        bgm.pause();
        musicIcon.textContent = '🔇';
    } else {
        bgm.play().catch(error => {
            console.log('音乐播放需要用户交互:', error);
        });
        musicIcon.textContent = '🔊';
    }
    isMusicPlaying = !isMusicPlaying;
});

// 祝福卡片切换功能
let currentWishIndex = 0;

function updateWishCard() {
    wishCards.forEach((card, index) => {
        if (index === currentWishIndex) {
            card.classList.add('active');
        } else {
            card.classList.remove('active');
        }
    });
}

prevWish.addEventListener('click', () => {
    currentWishIndex = (currentWishIndex - 1 + wishCards.length) % wishCards.length;
    updateWishCard();
});

nextWish.addEventListener('click', () => {
    currentWishIndex = (currentWishIndex + 1) % wishCards.length;
    updateWishCard();
});

// 定制祝福卡片功能
customWish.addEventListener('input', () => {
    previewText.textContent = customWish.value || '输入你的祝福内容...';
});

copyWish.addEventListener('click', () => {
    const wishText = customWish.value || '输入你的祝福内容...';
    navigator.clipboard.writeText(wishText).then(() => {
        alert('祝福已复制到剪贴板！');
    }).catch(err => {
        console.error('复制失败:', err);
    });
});

resetWish.addEventListener('click', () => {
    customWish.value = '';
    previewText.textContent = '输入你的祝福内容...';
});

// 返回顶部功能
backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// 滚动显示返回顶部按钮
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTop.style.display = 'block';
    } else {
        backToTop.style.display = 'none';
    }
});

// 烟花效果
class Firework {
    constructor() {
        this.x = Math.random() * window.innerWidth;
        this.y = window.innerHeight;
        this.vx = (Math.random() - 0.5) * 10;
        this.vy = -Math.random() * 10 - 5;
        this.alpha = 1;
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        this.particles = [];
        this.exploded = false;
    }

    update() {
        if (!this.exploded) {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += 0.2;
            
            if (this.vy >= 0) {
                this.exploded = true;
                this.createParticles();
            }
        } else {
            this.particles.forEach(particle => particle.update());
            this.particles = this.particles.filter(particle => particle.alpha > 0);
        }
    }

    createParticles() {
        for (let i = 0; i < 100; i++) {
            this.particles.push(new Particle(this.x, this.y, this.color));
        }
    }

    draw() {
        if (!this.exploded) {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        } else {
            this.particles.forEach(particle => particle.draw());
        }
    }
}

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 8;
        this.vy = (Math.random() - 0.5) * 8;
        this.alpha = 1;
        this.color = color;
        this.size = Math.random() * 3 + 1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.1;
        this.alpha -= 0.02;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// 烟花动画
const fireworksArray = [];

function animateFireworks() {
    ctx.clearRect(0, 0, fireworks.width, fireworks.height);
    
    if (Math.random() < 0.02) {
        fireworksArray.push(new Firework());
    }
    
    fireworksArray.forEach(firework => {
        firework.update();
        firework.draw();
    });
    
    // 优化烟花数组管理
    for (let i = fireworksArray.length - 1; i >= 0; i--) {
        const firework = fireworksArray[i];
        if (firework.exploded && firework.particles.length === 0) {
            fireworksArray.splice(i, 1);
        }
    }
    
    requestAnimationFrame(animateFireworks);
}

animateFireworks();

// 页面加载动画
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('fade-in');
    
    // 尝试自动播放音乐
    bgm.play().catch(error => {
        console.log('音乐播放需要用户交互:', error);
    });
});

// 滚动触发动画
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('slide-in');
        }
    });
}, observerOptions);

// 观察需要动画的元素
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});