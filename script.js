// ============================================
// KELEŞ TEAM WEBSITE v4.0 - INTERACTIVE FEATURES
// ============================================

// ============================================
// SCROLL PROGRESS BAR + NAVBAR SCROLL EFFECT & ACTIVE LINK
// ============================================

const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');
const scrollProgressEl = document.getElementById('scrollProgress');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Scroll progress bar
    if (scrollProgressEl) {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? (currentScroll / docHeight) * 100 : 0;
        scrollProgressEl.style.width = pct + '%';
    }

    // Scrolled class
    if (currentScroll > 80) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Active nav link
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (currentScroll >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// ============================================
// MOBILE NAV TOGGLE
// ============================================

const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        const spans = navToggle.querySelectorAll('span');
        navMenu.classList.contains('open')
            ? spans.forEach((s, i) => {
                if (i === 0) s.style.transform = 'rotate(45deg) translate(5px, 5px)';
                if (i === 1) s.style.opacity = '0';
                if (i === 2) s.style.transform = 'rotate(-45deg) translate(5px, -5px)';
            })
            : spans.forEach(s => {
                s.style.transform = '';
                s.style.opacity = '';
            });
    });

    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            navToggle.querySelectorAll('span').forEach(s => {
                s.style.transform = '';
                s.style.opacity = '';
            });
        });
    });
}

// ============================================
// SMOOTH SCROLL FOR NAVIGATION
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 75;
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
    });
});

// ============================================
// ANIMATED COUNTER FOR STATS
// ============================================

const animateCounter = (element, target, duration = 2000) => {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                animateCounter(stat, target);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsGrid = document.querySelector('.stats-grid');
if (statsGrid) statsObserver.observe(statsGrid);

// ============================================
// GALLERY FILTER
// ============================================

const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        galleryItems.forEach(item => {
            if (filter === 'all') {
                item.classList.remove('hidden');
            } else {
                const cat = item.getAttribute('data-category');
                if (cat === filter) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            }
        });
    });
});

// ============================================
// GALLERY LIGHTBOX & NAVIGATION
// ============================================

const modal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalClose = document.getElementById('modalClose');
const modalPrev = document.getElementById('modalPrev');
const modalNext = document.getElementById('modalNext');
const modalCounter = document.getElementById('modalCounter');
const modalBackdrop = document.getElementById('modalBackdrop');
const modalCaption = document.getElementById('modalCaption');

let currentImageIndex = 0;
let visibleImages = [];

const getVisibleImages = () => {
    return Array.from(galleryItems).filter(item => !item.classList.contains('hidden'));
};

const updateModalImage = (index) => {
    currentImageIndex = index;
    modalImage.style.opacity = '0';
    modalImage.style.transform = 'scale(0.95)';
    setTimeout(() => {
        visibleImages = getVisibleImages();
        modalImage.src = visibleImages[currentImageIndex].querySelector('img').src;
        const labelEl = visibleImages[currentImageIndex].querySelector('.gallery-label');
        if (modalCaption && labelEl) modalCaption.textContent = labelEl.textContent;
        modalImage.style.opacity = '1';
        modalImage.style.transform = 'scale(1)';
        modalImage.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        if (modalCounter) {
            modalCounter.textContent = `${currentImageIndex + 1} / ${visibleImages.length}`;
        }
    }, 220);
};

galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
        visibleImages = getVisibleImages();
        const index = visibleImages.indexOf(item);
        if (index === -1) return;
        updateModalImage(index);
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

if (modalPrev) {
    modalPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        visibleImages = getVisibleImages();
        let newIndex = currentImageIndex - 1;
        if (newIndex < 0) newIndex = visibleImages.length - 1;
        updateModalImage(newIndex);
    });
}

if (modalNext) {
    modalNext.addEventListener('click', (e) => {
        e.stopPropagation();
        visibleImages = getVisibleImages();
        let newIndex = currentImageIndex + 1;
        if (newIndex >= visibleImages.length) newIndex = 0;
        updateModalImage(newIndex);
    });
}

const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
};

if (modalClose) modalClose.addEventListener('click', closeModal);
if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

document.addEventListener('keydown', (e) => {
    if (!modal || !modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft' && modalPrev) modalPrev.click();
    if (e.key === 'ArrowRight' && modalNext) modalNext.click();
});

let touchStartX = 0;
if (modal) {
    modal.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    modal.addEventListener('touchend', (e) => {
        const diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 50) {
            if (diff > 0 && modalNext) modalNext.click();
            else if (modalPrev) modalPrev.click();
        }
    });
}

// ============================================
// ANNOUNCEMENT BANNER CLOSE
// ============================================

const bannerClose = document.getElementById('bannerClose');
const announcementBanner = document.getElementById('announcementBanner');

if (bannerClose && announcementBanner) {
    bannerClose.addEventListener('click', () => {
        announcementBanner.style.opacity = '0';
        announcementBanner.style.transition = 'opacity 0.3s ease';
        setTimeout(() => {
            announcementBanner.classList.add('hidden');
        }, 300);
    });
}

// ============================================
// LIVE MEMBER COUNT ANIMATION
// ============================================

const liveCountEl = document.getElementById('liveCount');
if (liveCountEl) {
    const baseCount = 47;
    setInterval(() => {
        const delta = Math.floor(Math.random() * 5) - 2;
        const newCount = Math.max(30, baseCount + delta);
        liveCountEl.textContent = newCount;
    }, 8000);
}

// ============================================
// TYPING EFFECT FOR HERO SUBTITLE
// ============================================

const typingEl = document.getElementById('typingText');
if (typingEl) {
    const phrases = [
        'Güç · Sadakat · Kardeşlik',
        'FiveM\'in En Güçlü Ailesi',
        'ANADOLUXKELES Şampiyonu',
        'Sokaklarda Saygı Görürüz'
    ];
    let phrIdx = 0, charIdx = 0, deleting = false;

    const typeLoop = () => {
        const current = phrases[phrIdx];
        typingEl.textContent = deleting
            ? current.substring(0, charIdx--)
            : current.substring(0, charIdx++);

        let speed = deleting ? 40 : 80;

        if (!deleting && charIdx === current.length + 1) {
            speed = 2200;
            deleting = true;
        } else if (deleting && charIdx === 0) {
            deleting = false;
            phrIdx = (phrIdx + 1) % phrases.length;
            speed = 400;
        }

        setTimeout(typeLoop, speed);
    };
    setTimeout(typeLoop, 1200);
}

// ============================================
// SCROLL REVEAL ANIMATIONS
// ============================================

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, i * 80);
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.card, .team-card, .discord-card, .gallery-item, .stat-card, .announcement-card, .rule-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(25px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    revealObserver.observe(el);
});

// ============================================
// PARTICLES IN HERO
// ============================================

const createParticles = () => {
    const container = document.getElementById('heroParticles');
    if (!container) return;

    const particleCount = 40;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        const size = Math.random() * 3 + 1.5;
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: var(--color-primary);
            opacity: ${Math.random() * 0.5 + 0.1};
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            box-shadow: 0 0 ${size * 3}px var(--color-primary);
            pointer-events: none;
        `;

        const duration = Math.random() * 12 + 8;
        const delay = Math.random() * -20;

        particle.animate([
            { transform: 'translateY(0) translateX(0)', opacity: 0 },
            { transform: `translateY(-${Math.random() * 80 + 40}px) translateX(${Math.random() * 30 - 15}px)`, opacity: 0.7 },
            { transform: `translateY(-${Math.random() * 160 + 80}px) translateX(${Math.random() * 60 - 30}px)`, opacity: 0 }
        ], {
            duration: duration * 1000,
            iterations: Infinity,
            delay: delay * 1000,
            easing: 'ease-in-out'
        });

        container.appendChild(particle);
    }
};

// ============================================
// CUSTOM CURSOR
// ============================================

const createCursorEffect = () => {
    const cursor = document.getElementById('custom-cursor');
    const follower = document.getElementById('cursor-follower');
    if (!cursor || !follower) return;
    if (window.innerWidth <= 768) {
        cursor.style.display = 'none';
        follower.style.display = 'none';
        return;
    }

    let followerX = 0, followerY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        cursorX = e.clientX;
        cursorY = e.clientY;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
    });

    const animateFollower = () => {
        followerX += (cursorX - followerX) * 0.12;
        followerY += (cursorY - followerY) * 0.12;
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';
        requestAnimationFrame(animateFollower);
    };
    animateFollower();

    document.querySelectorAll('a, button, .gallery-item, .card').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(2)';
            cursor.style.opacity = '0.5';
            follower.style.transform = 'translate(-50%, -50%) scale(1.5)';
            follower.style.borderColor = 'rgba(220, 10, 10, 0.8)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.opacity = '1';
            follower.style.transform = 'translate(-50%, -50%) scale(1)';
            follower.style.borderColor = 'rgba(220, 10, 10, 0.5)';
        });
    });
};

// ============================================
// DISCORD LIVE STATUS
// ============================================

const fetchDiscordStatus = async () => {
    try {
        const guildId = '1202283946340237312';
        const response = await fetch(`https://discord.com/api/guilds/${guildId}/widget.json`);
        const data = await response.json();
        if (data && data.presence_count !== undefined && liveCountEl && data.presence_count > 0) {
            liveCountEl.textContent = data.presence_count;
        }
    } catch (error) {
        // Silent fail
    }
};

fetchDiscordStatus();

// ============================================
// PARALLAX HERO
// ============================================

window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    const scrollY = window.pageYOffset;
    if (scrollY < window.innerHeight) {
        hero.style.setProperty('--parallax-y', scrollY * 0.35 + 'px');
    }
});

// ============================================
// BACK TO TOP BUTTON
// ============================================

const backToTop = document.getElementById('backToTop');
if (backToTop) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ============================================
// PAGE LOAD & PRE-LOADER
// ============================================

window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');

    createParticles();
    createCursorEffect();

    setTimeout(() => {
        if (preloader) {
            preloader.style.opacity = '0';
            preloader.style.transition = 'opacity 0.7s ease';
            setTimeout(() => {
                preloader.style.display = 'none';
                document.body.classList.add('loaded');
            }, 700);
        }
    }, 1200);
});

// ============================================
// CONSOLE MESSAGE
// ============================================

console.log('%c🔥 KELEŞ TEAM v4.0 🔥', 'color: #dc0a0a; font-size: 24px; font-weight: bold;');
console.log('%cFiveM\'in En Güçlü Ailesi | ANADOLUXKELES Şampiyonu', 'color: #ff6b6b; font-size: 14px;');
