/* ============================================================
   PYQ Hub India Ã¢â‚¬â€ Complete Script
   
   HOW TO ADD REAL PYQ FILES (Folder Structure):
   -----------------------------------------------
   Create folders like this in your project:
   
   pyqs/
   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ sainik-school/
   Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ class-6/
   Ã¢â€â€š   Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ 2024/
   Ã¢â€â€š   Ã¢â€â€š   Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ maths.pdf
   Ã¢â€â€š   Ã¢â€â€š   Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ gk.pdf
   Ã¢â€â€š   Ã¢â€â€š   Ã¢â€â€š   Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ english.pdf
   Ã¢â€â€š   Ã¢â€â€š   Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ 2023/
   Ã¢â€â€š   Ã¢â€â€š       Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ maths.pdf
   Ã¢â€â€š   Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ class-9/
   Ã¢â€â€š       Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ 2024/
   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ navodaya/
   Ã¢â€â€š   Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ class-6/
   Ã¢â€â€š       Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ 2024/
   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ jee/
   Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ 2024/
   Ã¢â€â€š   Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ paper1-physics.pdf
   Ã¢â€â€š   Ã¢â€â€š   Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ paper2-maths.pdf
   Ã¢â€â€š   Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ 2023/
   Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ neet/
       Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ 2024/
   
   Then update the PYQ_DATA array below with:
   - view: 'pyqs/sainik-school/class-6/2024/maths.pdf'
   - download: 'pyqs/sainik-school/class-6/2024/maths.pdf'
   ============================================================ */

const PYQ_DATA = [
    // Ã¢â€â‚¬Ã¢â€â‚¬ Sainik School Ã¢â€â‚¬Ã¢â€â‚¬
    {
        title: 'Sainik School Class 6 Ã¢â‚¬â€ Mathematics 2024',
        year: '2024', class: '6', subject: 'Maths', exam: 'Sainik School',
        view: 'pyqs/sainik-school/class-6/2024/maths.pdf',
        download: 'pyqs/sainik-school/class-6/2024/maths.pdf'
    },
    {
        title: 'Sainik School Class 6 Ã¢â‚¬â€ GK & Intelligence 2024',
        year: '2024', class: '6', subject: 'GK', exam: 'Sainik School',
        view: 'pyqs/sainik-school/class-6/2024/gk.pdf',
        download: 'pyqs/sainik-school/class-6/2024/gk.pdf'
    },
    {
        title: 'Sainik School Class 6 Ã¢â‚¬â€ English 2023',
        year: '2023', class: '6', subject: 'English', exam: 'Sainik School',
        view: 'pyqs/sainik-school/class-6/2023/english.pdf',
        download: 'pyqs/sainik-school/class-6/2023/english.pdf'
    },
    {
        title: 'Sainik School Class 9 Ã¢â‚¬â€ Maths 2023',
        year: '2023', class: '9', subject: 'Maths', exam: 'Sainik School',
        view: 'pyqs/sainik-school/class-9/2023/maths.pdf',
        download: 'pyqs/sainik-school/class-9/2023/maths.pdf'
    },
    {
        title: 'Sainik School Class 6 Ã¢â‚¬â€ Intelligence 2022',
        year: '2022', class: '6', subject: 'GK', exam: 'Sainik School',
        view: '#', download: '#'
    },

    // Ã¢â€â‚¬Ã¢â€â‚¬ Navodaya Ã¢â€â‚¬Ã¢â€â‚¬
    {
        title: 'Navodaya (JNVST) Class 6 Ã¢â‚¬â€ Full Paper 2024',
        year: '2024', class: '6', subject: 'Maths', exam: 'Navodaya',
        view: 'pyqs/navodaya/class-6/2024/full-paper.pdf',
        download: 'pyqs/navodaya/class-6/2024/full-paper.pdf'
    },
    {
        title: 'Navodaya (JNVST) Class 6 Ã¢â‚¬â€ Full Paper 2023',
        year: '2023', class: '6', subject: 'Maths', exam: 'Navodaya',
        view: '#', download: '#'
    },
    {
        title: 'Navodaya Class 6 Ã¢â‚¬â€ GK & Language 2022',
        year: '2022', class: '6', subject: 'GK', exam: 'Navodaya',
        view: '#', download: '#'
    },

    // Ã¢â€â‚¬Ã¢â€â‚¬ JEE Ã¢â€â‚¬Ã¢â€â‚¬
    {
        title: 'JEE Main 2024 Ã¢â‚¬â€ Physics (Paper 1)',
        year: '2024', class: '12', subject: 'Physics', exam: 'JEE',
        view: 'pyqs/jee/2024/physics-paper1.pdf',
        download: 'pyqs/jee/2024/physics-paper1.pdf'
    },
    {
        title: 'JEE Main 2024 Ã¢â‚¬â€ Chemistry (Paper 1)',
        year: '2024', class: '12', subject: 'Chemistry', exam: 'JEE',
        view: 'pyqs/jee/2024/chemistry-paper1.pdf',
        download: 'pyqs/jee/2024/chemistry-paper1.pdf'
    },
    {
        title: 'JEE Main 2024 Ã¢â‚¬â€ Maths (Paper 2)',
        year: '2024', class: '12', subject: 'Maths', exam: 'JEE',
        view: '#', download: '#'
    },
    {
        title: 'JEE Advanced 2023 Ã¢â‚¬â€ Physics',
        year: '2023', class: '12', subject: 'Physics', exam: 'JEE',
        view: '#', download: '#'
    },
    {
        title: 'JEE Main 2022 Ã¢â‚¬â€ Full Paper Set A',
        year: '2022', class: '12', subject: 'Maths', exam: 'JEE',
        view: '#', download: '#'
    },

    // Ã¢â€â‚¬Ã¢â€â‚¬ NEET Ã¢â€â‚¬Ã¢â€â‚¬
    {
        title: 'NEET 2024 Ã¢â‚¬â€ Biology',
        year: '2024', class: '12', subject: 'Biology', exam: 'NEET',
        view: 'pyqs/neet/2024/biology.pdf',
        download: 'pyqs/neet/2024/biology.pdf'
    },
    {
        title: 'NEET 2024 Ã¢â‚¬â€ Physics',
        year: '2024', class: '12', subject: 'Physics', exam: 'NEET',
        view: '#', download: '#'
    },
    {
        title: 'NEET 2023 Ã¢â‚¬â€ Biology',
        year: '2023', class: '12', subject: 'Biology', exam: 'NEET',
        view: '#', download: '#'
    },
    {
        title: 'NEET 2023 Ã¢â‚¬â€ Chemistry',
        year: '2023', class: '12', subject: 'Chemistry', exam: 'NEET',
        view: '#', download: '#'
    },
    {
        title: 'NEET 2022 Ã¢â‚¬â€ Full Paper',
        year: '2022', class: '12', subject: 'Biology', exam: 'NEET',
        view: '#', download: '#'
    },

    // Ã¢â€â‚¬Ã¢â€â‚¬ RIMC Ã¢â€â‚¬Ã¢â€â‚¬
    {
        title: 'RIMC Entrance 2024 Ã¢â‚¬â€ Maths',
        year: '2024', class: '6', subject: 'Maths', exam: 'RIMC',
        view: '#', download: '#'
    },
    {
        title: 'RIMC Entrance 2023 Ã¢â‚¬â€ English',
        year: '2023', class: '6', subject: 'English', exam: 'RIMC',
        view: '#', download: '#'
    },

    // Ã¢â€â‚¬Ã¢â€â‚¬ RMS Ã¢â€â‚¬Ã¢â€â‚¬
    {
        title: 'RMS Ajmer Class 6 Ã¢â‚¬â€ Maths 2024',
        year: '2024', class: '6', subject: 'Maths', exam: 'RMS',
        view: '#', download: '#'
    },
    {
        title: 'RMS Ajmer Class 6 Ã¢â‚¬â€ English 2023',
        year: '2023', class: '6', subject: 'English', exam: 'RMS',
        view: '#', download: '#'
    },

    // Ã¢â€â‚¬Ã¢â€â‚¬ Olympiads Ã¢â€â‚¬Ã¢â€â‚¬
    {
        title: 'SOF IMO Class 6 Ã¢â‚¬â€ Maths Olympiad 2024',
        year: '2024', class: '6', subject: 'Maths', exam: 'Olympiads',
        view: '#', download: '#'
    },
    {
        title: 'SOF NSO Class 8 Ã¢â‚¬â€ Science Olympiad 2023',
        year: '2023', class: '8', subject: 'Physics', exam: 'Olympiads',
        view: '#', download: '#'
    },

    // â”€â”€ CBSE Boards â”€â”€
    {
        title: 'CBSE Class 10 â€” Maths Standard 2024',
        year: '2024', class: '10', subject: 'Maths', exam: 'CBSE',
        view: '#', download: '#'
    },
    {
        title: 'CBSE Class 12 â€” Physics 2023',
        year: '2023', class: '12', subject: 'Physics', exam: 'CBSE',
        view: '#', download: '#'
    },

    // â”€â”€ NDA â”€â”€
    {
        title: 'NDA 1 2024 â€” Mathematics',
        year: '2024', class: 'Defence', subject: 'Maths', exam: 'NDA',
        view: '#', download: '#'
    },
    {
        title: 'NDA 2 2023 â€” General Ability Test',
        year: '2023', class: 'Defence', subject: 'GK', exam: 'NDA',
        view: '#', download: '#'
    },

    // â”€â”€ CDS â”€â”€
    {
        title: 'CDS 1 2024 â€” Elementary Maths',
        year: '2024', class: 'Defence', subject: 'Maths', exam: 'CDS',
        view: '#', download: '#'
    },
    {
        title: 'CDS 2 2023 â€” English',
        year: '2023', class: 'Defence', subject: 'English', exam: 'CDS',
        view: '#', download: '#'
    },

    // â”€â”€ BHU â”€â”€
    {
        title: 'BHU CHS Class 6 â€” Entrance 2024',
        year: '2024', class: '6', subject: 'Maths', exam: 'BHU',
        view: '#', download: '#'
    },
    {
        title: 'BHU CHS Class 9 â€” Entrance 2023',
        year: '2023', class: '9', subject: 'Maths', exam: 'BHU',
        view: '#', download: '#'
    },

    // â”€â”€ Simultala Awasiya Vidyalaya â”€â”€
    {
        title: 'Simultala Class 6 Mains â€” 2024',
        year: '2024', class: '6', subject: 'Maths', exam: 'Simultala',
        view: '#', download: '#'
    },

    // â”€â”€ Ram Krishan Mission â”€â”€
    {
        title: 'RKM Vidyapith Class 6 â€” Selection 2024',
        year: '2024', class: '6', subject: 'Maths', exam: 'Ram Krishan Mission',
        view: '#', download: '#'
    },

    // â”€â”€ CUET â”€â”€
    {
        title: 'CUET UG 2024 â€” General Test',
        year: '2024', class: '12', subject: 'GK', exam: 'CUET',
        view: '#', download: '#'
    },
    {
        title: 'CUET UG 2024 â€” Physics',
        year: '2024', class: '12', subject: 'Physics', exam: 'CUET',
        view: '#', download: '#'
    }
];

const EXAM_DETAILS_DATA = {
    "Sainik School": {
        emoji: "ðŸŽ–ï¸",
        subtitle: "AISSEE â€” All India Sainik School Entrance Exam",
        format: "<ul><li><strong>Class 6:</strong> Maths (150 marks), Intelligence (50), Language (50), GK (50). Total: 300 Marks.</li><li><strong>Class 9:</strong> Maths (200), Intelligence (50), English (50), General Science (50), Social Studies (50). Total: 400 Marks.</li><li><strong>Mode:</strong> OMR based written exam.</li></ul>",
        syllabus: "#"
    },
    "Navodaya": {
        emoji: "ðŸ«",
        subtitle: "JNVST â€” Jawahar Navodaya Vidyalaya Selection Test",
        format: "<ul><li><strong>Class 6:</strong> Mental Ability (50 marks), Arithmetic (25 marks), Language (25 marks). Total: 100 Marks.</li><li><strong>Format:</strong> Objective multiple-choice questions. Time: 2 hours.</li></ul>",
        syllabus: "#"
    },
    "JEE": {
        emoji: "âš™ï¸",
        subtitle: "IIT/NIT Engineering Entrance",
        format: "<ul><li><strong>JEE Main:</strong> Physics, Chemistry, Maths (100 marks each). Total: 300 marks. Contains MCQs and Numerical Value questions.</li><li><strong>JEE Advanced:</strong> Two papers. Physics, Chemistry, Maths. Pattern varies every year.</li></ul>",
        syllabus: "#"
    },
    "NEET": {
        emoji: "ðŸ©º",
        subtitle: "National Eligibility cum Entrance Test",
        format: "<ul><li><strong>Subjects:</strong> Physics (180), Chemistry (180), Botany (180), Zoology (180).</li><li><strong>Format:</strong> 200 MCQs (Attempt 180). Total: 720 Marks. Marking: +4 for correct, -1 for incorrect.</li></ul>",
        syllabus: "#"
    },
    "RIMC": {
        emoji: "âš”ï¸",
        subtitle: "Rashtriya Indian Military College",
        format: "<ul><li><strong>Subjects:</strong> English (125 Marks), Mathematics (200 Marks), General Knowledge (75 Marks).</li><li><strong>Format:</strong> Descriptive mathematics and english. Objective GK.</li><li><strong>Interview:</strong> Viva Voce (50 Marks).</li></ul>",
        syllabus: "#"
    },
    "Olympiads": {
        emoji: "ðŸ†",
        subtitle: "SOF IMO, NSO, IEO",
        format: "<ul><li><strong>Format:</strong> Logical Reasoning, Subject Specific section, and Achievers Section.</li><li><strong>Type:</strong> Objective MCQs. No negative marking.</li></ul>",
        syllabus: "#"
    },
    "CBSE": {
        emoji: "ðŸ“",
        subtitle: "Class 10th & 12th Board",
        format: "<ul><li><strong>Format:</strong> 80 Marks theory, 20 Marks internal assessment (typical).</li><li><strong>Sections:</strong> Objective type (MCQs), Short Answer, Long Answer.</li></ul>",
        syllabus: "#"
    },
    "NDA": {
        emoji: "ðŸª–",
        subtitle: "National Defence Academy",
        format: "<ul><li><strong>Paper 1:</strong> Mathematics (300 Marks, 2.5 hours).</li><li><strong>Paper 2:</strong> General Ability Test (600 Marks, 2.5 hours - English 200, GK 400).</li><li><strong>SSB Interview:</strong> 900 Marks.</li></ul>",
        syllabus: "#"
    },
    "CDS": {
        emoji: "âš”ï¸",
        subtitle: "Combined Defence Services",
        format: "<ul><li><strong>For IMA/INA/AFA:</strong> English (100), GK (100), Elementary Maths (100).</li><li><strong>For OTA:</strong> English (100), General Knowledge (100).</li></ul>",
        syllabus: "#"
    },
    "BHU": {
        emoji: "ðŸ›ï¸",
        subtitle: "Banaras Hindu University (CHS)",
        format: "<ul><li><strong>Format:</strong> 100 MCQs (Maths, Science, Hindi, English, GK/Social). Total: 100 Marks.</li><li><strong>Level:</strong> Dependent on the admission class standard (Class 6, 9, or 11).</li></ul>",
        syllabus: "#"
    },
    "Simultala": {
        emoji: "ðŸ«",
        subtitle: "Simultala Awasiya Vidyalaya",
        format: "<ul><li><strong>Prelims:</strong> Objective test (150 Marks).</li><li><strong>Mains:</strong> Two papers. Paper 1 (Maths 100, Reasoning 50). Paper 2 (Hindi 40, English 40, Science 40, SST 30). Total: 300 Marks.</li></ul>",
        syllabus: "#"
    },
    "Ram Krishan Mission": {
        emoji: "ðŸ•‰ï¸",
        subtitle: "RKM Vidyapith",
        format: "<ul><li><strong>Subjects:</strong> English, Mathematics, Bengali/Hindi, and General Science.</li><li><strong>Format:</strong> Written Descriptive and Objective mixing.</li></ul>",
        syllabus: "#"
    },
    "CUET": {
        emoji: "ðŸŽ“",
        subtitle: "Common University Entrance Test",
        format: "<ul><li><strong>Section IA & IB:</strong> Languages (13 and 20 languages).</li><li><strong>Section II:</strong> Domain Specific Subjects (27 Subjects).</li><li><strong>Section III:</strong> General Test (Logic, Quant, GK).</li></ul>",
        syllabus: "#"
    }
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

        if (text.includes('info@pyqhubindia.com')) {
            item.innerHTML = item.innerHTML.replace(
                'info@pyqhubindia.com',
                '<a href="mailto:info@pyqhubindia.com">info@pyqhubindia.com</a>'
            );
        }

        if (text.includes('+91 98765 43210')) {
            item.innerHTML = item.innerHTML.replace(
                '+91 98765 43210',
                '<a href="tel:+919876543210">+91 98765 43210</a>'
            );
        }

        if (text.includes('Jamshedpur, Jharkhand')) {
            item.innerHTML = item.innerHTML.replace(
                'Jamshedpur, Jharkhand',
                '<a href="https://maps.google.com/?q=Jamshedpur+Jharkhand" target="_blank" rel="noopener noreferrer">Jamshedpur, Jharkhand</a>'
            );
        }
    });
}

/* Ã¢â€â‚¬Ã¢â€â‚¬ Loader Ã¢â€â‚¬Ã¢â€â‚¬ */
function initLoader() {
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        setTimeout(() => loader.classList.add('gone'), 600);
    });
    // Fallback
    setTimeout(() => loader.classList.add('gone'), 2500);
}

/* Ã¢â€â‚¬Ã¢â€â‚¬ Cursor Glow Ã¢â€â‚¬Ã¢â€â‚¬ */
function initCursorGlow() {
    const glow = document.getElementById('cursorGlow');
    if (!glow || window.matchMedia('(pointer: coarse)').matches) return;
    document.addEventListener('mousemove', e => {
        glow.style.left = e.clientX + 'px';
        glow.style.top  = e.clientY + 'px';
    });
}

/* Ã¢â€â‚¬Ã¢â€â‚¬ Navbar Ã¢â€â‚¬Ã¢â€â‚¬ */
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

/* Ã¢â€â‚¬Ã¢â€â‚¬ Hero Search Ã¢â€â‚¬Ã¢â€â‚¬ */
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

/* Ã¢â€â‚¬Ã¢â€â‚¬ Filters Ã¢â€â‚¬Ã¢â€â‚¬ */
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

/* Ã¢â€â‚¬Ã¢â€â‚¬ Render PYQs Ã¢â€â‚¬Ã¢â€â‚¬ */
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
                <span class="pyq-tag">Ã°Å¸â€œÅ¡ ${item.exam}</span>
                <span class="pyq-tag">Ã°Å¸Å½â€œ Class ${item.class}</span>
                <span class="pyq-tag">Ã°Å¸â€œâ€“ ${item.subject}</span>
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

/* Ã¢â€â‚¬Ã¢â€â‚¬ Exam Cards Ã¢â€â‚¬Ã¢â€â‚¬ */
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

/* Ã¢â€â‚¬Ã¢â€â‚¬ Animated Counters Ã¢â€â‚¬Ã¢â€â‚¬ */
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

/* Ã¢â€â‚¬Ã¢â€â‚¬ Scroll Animations Ã¢â€â‚¬Ã¢â€â‚¬ */
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

document.addEventListener('DOMContentLoaded', () => {
    if (typeof initLoader === 'function') initLoader();
    if (typeof initCursorGlow === 'function') initCursorGlow();
    if (typeof initNavbar === 'function') initNavbar();
    if (typeof initHeroSearch === 'function') initHeroSearch();
    if (typeof initFilters === 'function') initFilters();
    if (typeof renderPYQs === 'function' && typeof PYQ_DATA !== 'undefined') renderPYQs(PYQ_DATA);
    if (typeof initExamCards === 'function') initExamCards();
    if (typeof initCounters === 'function') initCounters();
    if (typeof initScrollAnimations === 'function') initScrollAnimations();
    if (typeof linkifyFooterContacts === 'function') linkifyFooterContacts();
});
