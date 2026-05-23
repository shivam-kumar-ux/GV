/* PYQ Hub — UI script (data from js/pyq-loader.js + pyq-default.js) */

var PYQ_DATA = window.PYQ_DATA || [];
var EXAM_DETAILS_DATA = window.EXAM_DETAILS_DATA || {};

window.gvPyqApplyContent = function (raw) {
  if (window.GVPyqLoader && window.GVPyqLoader.apply) window.GVPyqLoader.apply(raw);
  if (typeof renderPYQs === 'function') renderPYQs(PYQ_DATA);
};

/* ============================================================
   DOM Ready
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initCursorGlow();
    initNavbar();
    initHeroSearch();
    initFilters();
    initExamCards();
    initCounters();
    initScrollAnimations();
    renderPYQs(PYQ_DATA);
    linkifyFooterContacts();
});

function linkifyFooterContacts() {
    const footerItems = document.querySelectorAll('.footer-col li');
    if (!footerItems.length) return;

    footerItems.forEach((item) => {
        if (item.querySelector('a')) return;

        const text = item.textContent.replace(/\s+/g, ' ').trim();

        if (text.includes('gyanodayvidyalaya2018@gmail.com')) {
            item.innerHTML = item.innerHTML.replace(
                'gyanodayvidyalaya2018@gmail.co',
                '<a href="mailto:gyanodayvidyalaya2018@gmail.co">gyanodayvidyalaya2018@gmail.co</a>'
            );
        }

        if (text.includes('+91 9955596394')) {
            item.innerHTML = item.innerHTML.replace(
                '+91 99555 96394',
                '<a href="tel:++919955596394">+91 99555 96394</a>'
            );
        }

        if (text.includes('Shahpur, Nawada, Bihar')) {
            item.innerHTML = item.innerHTML.replace(
                'Shahpur, Nawada, Bihar',
                '<a href="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d903.334259228528!2d85.67884364066265!3d25.0904499346888!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f2597715f9d119%3A0x77e39801e9e150c2!2sGyanoday%20Vidyalaya!5e0!3m2!1sen!2sin!4v1772235313008!5m2!1sen!2sin" target="_blank" rel="noopener noreferrer">Shahpur, Nawada, Bihar</a>'
            );
        }
    });
}

/* Loader  */
function initLoader() {
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        setTimeout(() => loader.classList.add('gone'), 600);
    });
    // Fallback
    setTimeout(() => loader.classList.add('gone'), 2500);
}

/* Cursor Glow */
function initCursorGlow() {
    const glow = document.getElementById('cursorGlow');
    if (!glow || window.matchMedia('(pointer: coarse)').matches) return;
    document.addEventListener('mousemove', e => {
        glow.style.left = e.clientX + 'px';
        glow.style.top  = e.clientY + 'px';
    });
}

/* Navbar  */
function initNavbar() {
    const navbar    = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu   = document.getElementById('navMenu');

    // Scroll effect
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    });

    // Mobile toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('open');
    });

    // Close on link click
    navMenu.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('open');
        });
    });

    // Active link on scroll
    const sections = document.querySelectorAll('section[id], footer[id]');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(s => {
            if (window.scrollY >= s.offsetTop - 120) current = s.id;
        });
        document.querySelectorAll('.nav-link').forEach(l => {
            l.classList.toggle('active', l.getAttribute('href') === `#${current}`);
        });
    });
}

/* Hero Search */
function initHeroSearch() {
    const btn = document.getElementById('heroSearchBtn');
    if (!btn) return;
    btn.addEventListener('click', () => {
        const exam    = document.getElementById('heroExam').value;
        const cls     = document.getElementById('heroClass').value;

        // Apply to sidebar filters
        if (document.getElementById('examFilter'))    document.getElementById('examFilter').value    = exam;
        if (document.getElementById('classFilter'))   document.getElementById('classFilter').value   = cls;

        // Scroll to PYQ section
        document.getElementById('pyqs')?.scrollIntoView({ behavior: 'smooth' });

        // Filter
        applyFilters();
    });
}

/* Filters */
function initFilters() {
    ['examFilter','yearFilter','classFilter','sortFilter'].forEach(id => {
        document.getElementById(id)?.addEventListener('change', applyFilters);
    });
    document.getElementById('clearFilters')?.addEventListener('click', clearFiltersAction);
}

function applyFilters() {
    const exam    = (document.getElementById('examFilter')?.value    || '').toLowerCase();
    const year    = (document.getElementById('yearFilter')?.value    || '');
    const cls     = (document.getElementById('classFilter')?.value   || '');
    const sort    = document.getElementById('sortFilter')?.value || 'newest';

    let filtered = PYQ_DATA.filter(item => {
        return (!exam    || item.exam.toLowerCase().includes(exam))    &&
               (!year    || item.year    === year)                     &&
               (!cls     || item.class   === cls);
    });

    // Sort
    if (sort === 'newest')  filtered.sort((a,b) => b.year - a.year);
    if (sort === 'oldest')  filtered.sort((a,b) => a.year - b.year);
    if (sort === 'az')      filtered.sort((a,b) => a.title.localeCompare(b.title));

    renderPYQs(filtered);
}

window.clearFiltersAction = function() {
    ['examFilter','yearFilter','classFilter'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    renderPYQs(PYQ_DATA);
};

/* Render PYQs */
function renderPYQs(data) {
    const grid    = document.getElementById('pyqGrid');
    const noRes   = document.getElementById('noResults');
    const counter = document.getElementById('resultsCount');

    if (!grid) return;

    grid.innerHTML = '';

    if (data.length === 0) {
        noRes?.classList.remove('hidden');
        if (counter) counter.textContent = 'No papers found';
        return;
    }

    noRes?.classList.add('hidden');
    if (counter) counter.textContent = `Showing ${data.length} paper${data.length !== 1 ? 's' : ''}`;

    data.forEach((item, i) => {
        const card = document.createElement('div');
        card.className = 'pyq-card';
        card.style.animationDelay = `${i * 0.05}s`;
        card.innerHTML = `
            <div class="pyq-card-top">
                <h4>${item.title}</h4>
                <span class="pyq-year-badge">${item.year}</span>
            </div>
            <div class="pyq-tags">
                <span class="pyq-tag">${item.exam}</span>
                <span class="pyq-tag">Class ${item.class}</span>
                <span class="pyq-tag">${item.subject}</span>
            </div>
            <div class="pyq-actions">
                <a href="${item.view}" target="_blank" class="pyq-btn pyq-btn-view">
                    <i class="fas fa-eye"></i> View
                </a>
                <a href="${item.download}" download class="pyq-btn pyq-btn-pdf">
                    <i class="fas fa-file-pdf"></i> Download PDF
                </a>
            </div>
        `;
        grid.appendChild(card);
    });
}

/* Exam Cards */
function initExamCards() {
    const modal = document.getElementById('examModal');
    const overlay = document.getElementById('examModalOverlay');
    const closeBtn = document.getElementById('examModalClose');
    const browseBtn = document.getElementById('modalBrowseBtn');

    if (!modal) return;

    const closeModal = () => {
        modal.classList.remove('active');
        overlay.classList.remove('active');
    };

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);

    document.querySelectorAll('.exam-card').forEach(card => {
        // Set glow color
        const color = card.dataset.color || '#2878EB';
        card.querySelector('.card-glow').style.background = `radial-gradient(circle at 0% 0%, ${color}18 0%, transparent 70%)`;

        card.addEventListener('click', () => {
            const exam = card.dataset.exam;
            
            // Setup Format
            if (typeof EXAM_DETAILS_DATA !== 'undefined') {
                const data = EXAM_DETAILS_DATA[exam];
                if (data) {

                    document.getElementById('modalTitle').textContent = exam;
                    document.getElementById('modalSubtitle').textContent = data.subtitle;
                    document.getElementById('modalFormatContent').innerHTML = data.format;
                    
                    // Redirect to the newly generated Syllabus detail page using a URL hash matching the exam
                    const formattedId = exam.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    document.getElementById('modalSyllabusBtn').href = 'syllabus.html#syllabus-' + formattedId;
                } else {
                    document.getElementById('modalTitle').textContent = exam;
                    document.getElementById('modalSubtitle').textContent = "";
                    document.getElementById('modalFormatContent').innerHTML = "<p>Format details currently unavailable.</p>";
                    document.getElementById('modalSyllabusBtn').href = 'syllabus.html';
                }
            }

            // Setup Browse Button Event
            browseBtn.onclick = (e) => {
                e.preventDefault();
                closeModal();
                const filter = document.getElementById('examFilter');
                if (filter) filter.value = exam;
                if (typeof applyFilters === 'function') applyFilters();
                document.getElementById('pyqs')?.scrollIntoView({ behavior: 'smooth' });
            };

            // Show Modal
            modal.classList.add('active');
            overlay.classList.add('active');
        });
    });
}

/* Animated Counters */
function initCounters() {
    const counters = document.querySelectorAll('.stat-num');
    if (!counters.length) return;

    const format = (num, target) => {
        if (target >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (target >= 10000)   return (num / 1000).toFixed(0) + 'K';
        return Math.floor(num).toString();
    };

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el     = entry.target;
            const target = +el.dataset.target;
            const dur    = 1800;
            const start  = performance.now();
            const tick   = (now) => {
                const progress = Math.min((now - start) / dur, 1);
                const ease     = 1 - Math.pow(1 - progress, 3);
                el.textContent = format(target * ease, target);
                if (progress < 1) requestAnimationFrame(tick);
                else el.textContent = format(target, target);
            };
            requestAnimationFrame(tick);
            observer.unobserve(el);
        });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
}

/* Scroll Animations */
function initScrollAnimations() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.exam-card, .feature-card, .section-title, .section-sub').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}