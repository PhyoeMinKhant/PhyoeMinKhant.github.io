document.addEventListener('DOMContentLoaded', () => {

    /* ─── 1. Theme Toggle ─── */
    const themeToggle = document.getElementById('theme-toggle');
    const themeText = themeToggle?.querySelector('.theme-toggle-text');
    const root = document.documentElement;

    function getPreferredTheme() {
        const stored = localStorage.getItem('theme');
        if (stored === 'light' || stored === 'dark') return stored;
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }

    function applyTheme(theme) {
        root.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        if (themeToggle) {
            const isLight = theme === 'light';
            themeToggle.setAttribute('aria-checked', String(isLight));
            themeToggle.setAttribute(
                'aria-label',
                isLight ? 'Switch to dark mode' : 'Switch to light mode'
            );
            themeToggle.title = isLight ? 'Switch to dark mode' : 'Switch to light mode';
            if (themeText) themeText.textContent = isLight ? 'Dark' : 'Light';
        }
    }

    applyTheme(getPreferredTheme());

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
            applyTheme(next);
        });
    }

    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            applyTheme(e.matches ? 'light' : 'dark');
        }
    });

    /* ─── 2. Typewriter Effect ─── */
    const phrases = [
        'Full Stack Developer',
        'AI Specialist',
        'Django & React Engineer',
        'PyTorch Practitioner',
        'Open Source Enthusiast',
    ];
    const el = document.getElementById('typewriter');
    if (el) {
        let phraseIdx = 0, charIdx = 0, deleting = false;
        function type() {
            const current = phrases[phraseIdx];
            if (!deleting) {
                el.textContent = current.slice(0, ++charIdx);
                if (charIdx === current.length) {
                    deleting = true;
                    setTimeout(type, 1800);
                    return;
                }
            } else {
                el.textContent = current.slice(0, --charIdx);
                if (charIdx === 0) {
                    deleting = false;
                    phraseIdx = (phraseIdx + 1) % phrases.length;
                }
            }
            setTimeout(type, deleting ? 55 : 100);
        }
        setTimeout(type, 600);
    }

    /* ─── 3. Scroll Reveal (IntersectionObserver) ─── */
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    /* ─── 4. Active Nav Link Highlighting ─── */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navLinks.forEach(link => {
                        link.classList.toggle(
                            'active',
                            link.getAttribute('href') === `#${entry.target.id}`
                        );
                    });
                }
            });
        },
        { threshold: 0.35 }
    );
    sections.forEach(s => sectionObserver.observe(s));

    /* ─── 5. Navbar Scroll Style ─── */
    const navbar = document.getElementById('navbar');
    const updateNavbar = () => {
        navbar?.classList.toggle('scrolled', window.scrollY > 60);
    };
    updateNavbar();
    window.addEventListener('scroll', updateNavbar, { passive: true });

    /* ─── 6. Mobile Menu ─── */
    const menuToggle = document.getElementById('menu-toggle');
    const navList = document.getElementById('nav-links');
    if (menuToggle && navList) {
        menuToggle.addEventListener('click', () => {
            navList.classList.toggle('open');
            const isOpen = navList.classList.contains('open');
            menuToggle.setAttribute('aria-expanded', isOpen);
            // Animate hamburger → X
            const spans = menuToggle.querySelectorAll('span');
            if (isOpen) {
                spans[0].style.transform = 'translateY(7px) rotate(45deg)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
            } else {
                spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
            }
        });
        // Close on nav link click
        navList.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navList.classList.remove('open');
                const spans = menuToggle.querySelectorAll('span');
                spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
            });
        });
    }

    /* ─── 7. Active Nav Style (CSS injection) ─── */
    const style = document.createElement('style');
    style.textContent = `.nav-link.active { color: var(--accent) !important; background: rgba(124,109,250,0.08); }`;
    document.head.appendChild(style);

    /* ─── 8. Toast helper ─── */
    const toast = document.getElementById('toast');
    let toastTimer;

    function showToast(message) {
        if (!toast) return;
        clearTimeout(toastTimer);
        toast.textContent = message;
        toast.hidden = false;
        toast.classList.add('is-visible');
        toastTimer = setTimeout(() => {
            toast.classList.remove('is-visible');
            setTimeout(() => { toast.hidden = true; }, 300);
        }, 2400);
    }

    /* ─── 9. Copy to clipboard ─── */
    document.querySelectorAll('[data-copy]').forEach(btn => {
        btn.addEventListener('click', async () => {
            const value = btn.getAttribute('data-copy');
            if (!value) return;
            try {
                await navigator.clipboard.writeText(value);
                btn.classList.add('is-copied');
                showToast('Copied to clipboard');
                setTimeout(() => btn.classList.remove('is-copied'), 1800);
            } catch {
                showToast('Could not copy — please select the text manually');
            }
        });
    });

    /* ─── 10. Contact Form Submission ─── */
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    function setFormStatus(type, message) {
        if (!formStatus) return;
        formStatus.hidden = false;
        formStatus.className = 'form-status';
        formStatus.classList.add(type === 'success' ? 'is-success' : 'is-error');
        formStatus.textContent = message;
    }

    function clearFormStatus() {
        if (!formStatus) return;
        formStatus.hidden = true;
        formStatus.className = 'form-status';
        formStatus.textContent = '';
    }

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('submit-btn');
            const btnText = btn.querySelector('.btn-text');
            const originalText = btnText.textContent;

            btn.disabled = true;
            btnText.textContent = 'Sending…';
            clearFormStatus();

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: new FormData(contactForm),
                    headers: { Accept: 'application/json' }
                });
                const data = await response.json().catch(() => ({}));

                if (response.ok) {
                    btnText.textContent = '✓ Message Sent!';
                    btn.style.background = 'linear-gradient(135deg, #22d3ee, #4ade80)';
                    setFormStatus('success', 'Thanks! Your message was sent — I\'ll get back to you soon.');
                    contactForm.reset();
                } else {
                    btnText.textContent = '✗ Error — Try Again';
                    btn.style.background = 'linear-gradient(135deg, #f43f5e, #fb923c)';
                    const errMsg = data.error || 'Something went wrong. Please try again or email me directly.';
                    setFormStatus('error', errMsg);
                }
            } catch {
                btnText.textContent = '✗ Network Error';
                btn.style.background = 'linear-gradient(135deg, #f43f5e, #fb923c)';
                setFormStatus('error', 'Network error. Check your connection or email me at phyominkhant@ucsy.edu.mm.');
            }

            setTimeout(() => {
                btnText.textContent = originalText;
                btn.style.background = '';
                btn.disabled = false;
            }, 4500);
        });
    }

    /* ─── 11. Subtle Parallax on Hero Spheres ─── */
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 30;
        const y = (e.clientY / window.innerHeight - 0.5) * 30;
        const s1 = document.querySelector('.sphere-1');
        const s2 = document.querySelector('.sphere-2');
        if (s1) s1.style.transform = `translate(${x * 0.6}px, ${y * 0.6}px)`;
        if (s2) s2.style.transform = `translate(${-x * 0.4}px, ${-y * 0.4}px)`;
    }, { passive: true });

});
