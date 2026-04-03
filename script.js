const navLinks = document.querySelectorAll('#primary-nav a');
const sections = document.querySelectorAll('section[id]');

function updateActiveNav() {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNav);
updateActiveNav();

// Mobile nav toggle
const navToggleButton = document.getElementById('nav-toggle');
const primaryNav = document.getElementById('primary-nav');

function closeMobileNav() {
    if (!primaryNav) return;
    primaryNav.classList.remove('nav-open');
    if (navToggleButton) navToggleButton.setAttribute('aria-expanded', 'false');
}

function toggleMobileNav() {
    if (!primaryNav) return;
    const willOpen = !primaryNav.classList.contains('nav-open');
    primaryNav.classList.toggle('nav-open', willOpen);
    if (navToggleButton) navToggleButton.setAttribute('aria-expanded', String(willOpen));
}

if (navToggleButton && primaryNav) {
    navToggleButton.addEventListener('click', toggleMobileNav);
    primaryNav.addEventListener('click', (e) => {
        const target = e.target;
        if (!(target instanceof Element)) return;
        const link = target.closest('a');
        if (!link) return;
        closeMobileNav();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMobileNav();
    });
}

// Scroll reveal animations (IntersectionObserver)
const revealTargets = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
        });
    },
    { threshold: 0.12, rootMargin: '0px 0px -10% 0px' }
);

revealTargets.forEach((el) => revealObserver.observe(el));

// Theme toggle (dark/light)
const themeToggle = document.getElementById('theme-toggle');
const themeToggleIcon = document.getElementById('theme-toggle-icon');
const THEME_KEY = 'portfolio-theme';

function setTheme(theme) {
    const isLight = theme === 'light';
    document.documentElement.classList.toggle('theme-light', isLight);

    if (themeToggle) {
        themeToggle.setAttribute(
            'aria-label',
            isLight ? 'Switch to dark mode' : 'Switch to light mode'
        );
    }

    if (themeToggleIcon) {
        themeToggleIcon.classList.remove('fa-moon', 'fa-sun');
        themeToggleIcon.classList.add(isLight ? 'fa-moon' : 'fa-sun');
    }
}

function getInitialTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') return saved;

    const prefersLight =
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: light)').matches;

    return prefersLight ? 'light' : 'dark';
}

setTheme(getInitialTheme());

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const isLightNow = document.documentElement.classList.contains('theme-light');
        const nextTheme = isLightNow ? 'dark' : 'light';

        localStorage.setItem(THEME_KEY, nextTheme);
        setTheme(nextTheme);
    });
}