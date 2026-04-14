/* ============================================================
   PYQ Hub India — Complete Script
   
   HOW TO ADD REAL PYQ FILES (Folder Structure):
   -----------------------------------------------
   Create folders like this in your project:
   
   pyqs/
   ├── sainik-school/
   │   ├── class-6/
   │   │   ├── 2024/
   │   │   │   ├── maths.pdf
   │   │   │   ├── gk.pdf
   │   │   │   └── english.pdf
   │   │   └── 2023/
   │   │       └── maths.pdf
   │   └── class-9/
   │       └── 2024/
   ├── navodaya/
   │   └── class-6/
   │       └── 2024/
   ├── jee/
   │   ├── 2024/
   │   │   ├── paper1-physics.pdf
   │   │   └── paper2-maths.pdf
   │   └── 2023/
   └── neet/
       └── 2024/
   
   Then update the PYQ_DATA array below with:
   - view: 'pyqs/sainik-school/class-6/2024/maths.pdf'
   - download: 'pyqs/sainik-school/class-6/2024/maths.pdf'
   ============================================================ */

const PYQ_DATA = [
    // ── Sainik School ──
    {
        title: 'Sainik School Class 6 — Mathematics 2024',
        year: '2024', class: '6', subject: 'Maths', exam: 'Sainik School',
        view: 'pyqs/sainik-school/class-6/2024/maths.pdf',
        download: 'pyqs/sainik-school/class-6/2024/maths.pdf'
    },
    {
        title: 'Sainik School Class 6 — GK & Intelligence 2024',
        year: '2024', class: '6', subject: 'GK', exam: 'Sainik School',
        view: 'pyqs/sainik-school/class-6/2024/gk.pdf',
        download: 'pyqs/sainik-school/class-6/2024/gk.pdf'
    },
    {
        title: 'Sainik School Class 6 — English 2023',
        year: '2023', class: '6', subject: 'English', exam: 'Sainik School',
        view: 'pyqs/sainik-school/class-6/2023/english.pdf',
        download: 'pyqs/sainik-school/class-6/2023/english.pdf'
    },
    {
        title: 'Sainik School Class 9 — Maths 2023',
        year: '2023', class: '9', subject: 'Maths', exam: 'Sainik School',
        view: 'pyqs/sainik-school/class-9/2023/maths.pdf',
        download: 'pyqs/sainik-school/class-9/2023/maths.pdf'
    },
    {
        title: 'Sainik School Class 6 — Intelligence 2022',
        year: '2022', class: '6', subject: 'GK', exam: 'Sainik School',
        view: '#', download: '#'
    },

    // ── Navodaya ──
    {
        title: 'Navodaya (JNVST) Class 6 — Full Paper 2024',
        year: '2024', class: '6', subject: 'Maths', exam: 'Navodaya',
        view: 'pyqs/navodaya/class-6/2024/full-paper.pdf',
        download: 'pyqs/navodaya/class-6/2024/full-paper.pdf'
    },
    {
        title: 'Navodaya (JNVST) Class 6 — Full Paper 2023',
        year: '2023', class: '6', subject: 'Maths', exam: 'Navodaya',
        view: '#', download: '#'
    },
    {
        title: 'Navodaya Class 6 — GK & Language 2022',
        year: '2022', class: '6', subject: 'GK', exam: 'Navodaya',
        view: '#', download: '#'
    },

    // ── JEE ──
    {
        title: 'JEE Main 2024 — Physics (Paper 1)',
        year: '2024', class: '12', subject: 'Physics', exam: 'JEE',
        view: 'pyqs/jee/2024/physics-paper1.pdf',
        download: 'pyqs/jee/2024/physics-paper1.pdf'
    },
    {
        title: 'JEE Main 2024 — Chemistry (Paper 1)',
        year: '2024', class: '12', subject: 'Chemistry', exam: 'JEE',
        view: 'pyqs/jee/2024/chemistry-paper1.pdf',
        download: 'pyqs/jee/2024/chemistry-paper1.pdf'
    },
    {
        title: 'JEE Main 2024 — Maths (Paper 2)',
        year: '2024', class: '12', subject: 'Maths', exam: 'JEE',
        view: '#', download: '#'
    },
    {
        title: 'JEE Advanced 2023 — Physics',
        year: '2023', class: '12', subject: 'Physics', exam: 'JEE',
        view: '#', download: '#'
    },
    {
        title: 'JEE Main 2022 — Full Paper Set A',
        year: '2022', class: '12', subject: 'Maths', exam: 'JEE',
        view: '#', download: '#'
    },

    // ── NEET ──
    {
        title: 'NEET 2024 — Biology',
        year: '2024', class: '12', subject: 'Biology', exam: 'NEET',
        view: 'pyqs/neet/2024/biology.pdf',
        download: 'pyqs/neet/2024/biology.pdf'
    },
    {
        title: 'NEET 2024 — Physics',
        year: '2024', class: '12', subject: 'Physics', exam: 'NEET',
        view: '#', download: '#'
    },
    {
        title: 'NEET 2023 — Biology',
        year: '2023', class: '12', subject: 'Biology', exam: 'NEET',
        view: '#', download: '#'
    },
    {
        title: 'NEET 2023 — Chemistry',
        year: '2023', class: '12', subject: 'Chemistry', exam: 'NEET',
        view: '#', download: '#'
    },
    {
        title: 'NEET 2022 — Full Paper',
        year: '2022', class: '12', subject: 'Biology', exam: 'NEET',
        view: '#', download: '#'
    },

    // ── RIMC ──
    {
        title: 'RIMC Entrance 2024 — Maths',
        year: '2024', class: '6', subject: 'Maths', exam: 'RIMC',
        view: '#', download: '#'
    },
    {
        title: 'RIMC Entrance 2023 — English',
        year: '2023', class: '6', subject: 'English', exam: 'RIMC',
        view: '#', download: '#'
    },

    // ── RMS ──
    {
        title: 'RMS Ajmer Class 6 — Maths 2024',
        year: '2024', class: '6', subject: 'Maths', exam: 'RMS',
        view: '#', download: '#'
    },
    {
        title: 'RMS Ajmer Class 6 — English 2023',
        year: '2023', class: '6', subject: 'English', exam: 'RMS',
        view: '#', download: '#'
    },

    // ── Olympiads ──
    {
        title: 'SOF IMO Class 6 — Maths Olympiad 2024',
        year: '2024', class: '6', subject: 'Maths', exam: 'Olympiads',
        view: '#', download: '#'
    },
    {
        title: 'SOF NSO Class 8 — Science Olympiad 2023',
        year: '2023', class: '8', subject: 'Physics', exam: 'Olympiads',
        view: '#', download: '#'
    },
];

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
});

/* ── Loader ── */
function initLoader() {
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        setTimeout(() => loader.classList.add('gone'), 600);
    });
    // Fallback
    setTimeout(() => loader.classList.add('gone'), 2500);
}

/* ── Cursor Glow ── */
function initCursorGlow() {
    const glow = document.getElementById('cursorGlow');
    if (!glow || window.matchMedia('(pointer: coarse)').matches) return;
    document.addEventListener('mousemove', e => {
        glow.style.left = e.clientX + 'px';
        glow.style.top  = e.clientY + 'px';
    });
}

/* ── Navbar ── */
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

/* ── Hero Search ── */
function initHeroSearch() {
    const btn = document.getElementById('heroSearchBtn');
    if (!btn) return;
    btn.addEventListener('click', () => {
        const exam    = document.getElementById('heroExam').value;
        const cls     = document.getElementById('heroClass').value;
        const subject = document.getElementById('heroSubject').value;

        // Apply to sidebar filters
        if (document.getElementById('examFilter'))    document.getElementById('examFilter').value    = exam;
        if (document.getElementById('classFilter'))   document.getElementById('classFilter').value   = cls;
        if (document.getElementById('subjectFilter')) document.getElementById('subjectFilter').value = subject;

        // Scroll to PYQ section
        document.getElementById('pyqs')?.scrollIntoView({ behavior: 'smooth' });

        // Filter
        applyFilters();
    });
}

/* ── Filters ── */
function initFilters() {
    ['examFilter','yearFilter','classFilter','subjectFilter','sortFilter'].forEach(id => {
        document.getElementById(id)?.addEventListener('change', applyFilters);
    });
    document.getElementById('clearFilters')?.addEventListener('click', clearFiltersAction);
}

function applyFilters() {
    const exam    = (document.getElementById('examFilter')?.value    || '').toLowerCase();
    const year    = (document.getElementById('yearFilter')?.value    || '');
    const cls     = (document.getElementById('classFilter')?.value   || '');
    const subject = (document.getElementById('subjectFilter')?.value || '').toLowerCase();
    const sort    = document.getElementById('sortFilter')?.value || 'newest';

    let filtered = PYQ_DATA.filter(item => {
        return (!exam    || item.exam.toLowerCase().includes(exam))    &&
               (!year    || item.year    === year)                     &&
               (!cls     || item.class   === cls)                      &&
               (!subject || item.subject.toLowerCase().includes(subject));
    });

    // Sort
    if (sort === 'newest')  filtered.sort((a,b) => b.year - a.year);
    if (sort === 'oldest')  filtered.sort((a,b) => a.year - b.year);
    if (sort === 'az')      filtered.sort((a,b) => a.title.localeCompare(b.title));

    renderPYQs(filtered);
}

window.clearFiltersAction = function() {
    ['examFilter','yearFilter','classFilter','subjectFilter'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    renderPYQs(PYQ_DATA);
};

/* ── Render PYQs ── */
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
                <span class="pyq-tag">📚 ${item.exam}</span>
                <span class="pyq-tag">🎓 Class ${item.class}</span>
                <span class="pyq-tag">📖 ${item.subject}</span>
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

/* ── Exam Cards ── */
function initExamCards() {
    document.querySelectorAll('.exam-card').forEach(card => {
        // Set glow color
        const color = card.dataset.color || '#FF5A1F';
        card.querySelector('.card-glow').style.background =
            `radial-gradient(circle at 0% 0%, ${color}18 0%, transparent 70%)`;

        card.addEventListener('click', () => {
            const exam = card.dataset.exam;
            const filter = document.getElementById('examFilter');
            if (filter) filter.value = exam;
            applyFilters();
            document.getElementById('pyqs')?.scrollIntoView({ behavior: 'smooth' });
        });
    });
}

/* ── Animated Counters ── */
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

/* ── Scroll Animations ── */
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