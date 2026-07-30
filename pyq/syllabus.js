document.addEventListener('DOMContentLoaded', () => {

    // ── Active Nav Link via IntersectionObserver ──────────────────────────────
    const sections = document.querySelectorAll('.syllabus-card');
    const navLinks = document.querySelectorAll('.nav-link');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => link.classList.remove('active'));
                const active = document.querySelector(`.nav-link[href="#${id}"]`);
                if (active) active.classList.add('active');
            }
        });
    }, {
        root: null,
        rootMargin: '-15% 0px -65% 0px',
        threshold: 0
    });

    sections.forEach(s => observer.observe(s));

    // ── Smooth scroll to hash on load ────────────────────────────────────────
    if (window.location.hash) {
        const target = document.querySelector(window.location.hash);
        if (target) {
            setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
        }
    }

    // ── Scroll-reveal animation with staggered delay ─────────────────────────
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                entry.target.style.animationDelay = `${i * 0.05}s`;
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.06 });

    sections.forEach(s => revealObserver.observe(s));

    // ── Highlight active nav link on click ───────────────────────────────────
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

});