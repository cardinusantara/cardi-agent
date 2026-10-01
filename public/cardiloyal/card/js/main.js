// ==========================================
// 0. Asynchronous Parallel Component Loader
// ==========================================
async function loadComponents() {
    const elements = Array.from(document.querySelectorAll('[data-include]'));
    await Promise.all(elements.map(async (el) => {
        const file = el.getAttribute('data-include');
        if (file) {
            const compName = file.split('/').pop().replace(/\.html$/, '');
            const targetUrl = `/cardiloyal/card/components/${compName}.html`;
            try {
                const response = await fetch(targetUrl);
                if (response.ok) {
                    el.outerHTML = await response.text();
                } else {
                    console.error(`Gagal memuat komponen ${targetUrl}: Status ${response.status}`);
                }
            } catch (err) {
                console.error(`Error memuat komponen ${targetUrl}:`, err);
            }
        }
    }));
    // Inisialisasi seluruh fitur & interaksi setelah komponen termuat di DOM
    initPageFeatures();
}

document.addEventListener('DOMContentLoaded', loadComponents);

// ==========================================
// Inisialisasi Seluruh Fitur & Interaksi Halaman
// ==========================================
function initPageFeatures() {
    // 0. Setup Lenis Smooth Scroll & GSAP ScrollTrigger (ala GoTap)
    initLenisAndScrollTrigger();

    // 1. Sistem Navigasi Responsif 0ms Delay & Scrollspy
    setupInstantNavigation();
    setupScrollSpy();

    // 1c. Animasi Scroll Reveal GSAP ala GoTap
    initScrollRevealAnimations();

    // 1d. Modal Checkout & Integrasi Xendit
    initCheckoutModal();

    // 1b. Mobile Menu Drawer Toggle (0ms Instant Toggle)
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileMenu.classList.toggle('hidden');
        });

        // Tutup menu drawer saat klik di luar
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                mobileMenu.classList.add('hidden');
            }
        });
    }

            // 2. Hero 3D Card Flip (360 Degree Flip Interactive) & Audio Feedback
            function toggleHeroCard(e) {
                if (e && typeof e.stopPropagation === 'function') {
                    e.stopPropagation();
                }
                const card = document.getElementById('heroCard3D');
                if (card) {
                    card.classList.toggle('is-flipped');
                    try {
                        getAudioContext();
                        playNfcTapChime();
                    } catch (err) {}
                }
            }

            // Pastikan event listener untuk interaksi kartu Hero terpasang aman
            const heroCard = document.getElementById('heroCard3D');
            if (heroCard) {
                heroCard.onclick = toggleHeroCard;
            }
            const heroFlipBtns = document.querySelectorAll('button[onclick*="toggleHeroCard"]');
            heroFlipBtns.forEach(btn => {
                btn.onclick = toggleHeroCard;
            });

            // 2b. Spesifikasi Plakat 3D Card Toggle & Auto-Idle Flip Animation
            let specCardAutoFlipTimer = null;
            let isSpecCardHovered = false;

            function switchSpecCard(side) {
                const card = document.getElementById('specCard3D');
                const tabFront = document.getElementById('tabSpecFront');
                const tabBack = document.getElementById('tabSpecBack');
                const dotFront = document.getElementById('dotSpecFront');
                const dotBack = document.getElementById('dotSpecBack');
                const badgeText = document.getElementById('specBadgeText');

                if (!card) return;

                const isCurrentlyFlipped = card.classList.contains('is-flipped');
                let shouldBeBack = true;

                if (side === 'front') {
                    shouldBeBack = false;
                } else if (side === 'back') {
                    shouldBeBack = true;
                } else if (side === 'toggle') {
                    shouldBeBack = !isCurrentlyFlipped;
                }

                if (shouldBeBack) {
                    card.classList.add('is-flipped');
                    if (tabFront) {
                        tabFront.className = 'text-xs font-semibold text-slate-500 hover:text-slate-900 rounded-lg cursor-pointer transition-all py-1.5 px-4';
                    }
                    if (tabBack) {
                        tabBack.className = 'text-xs font-semibold text-slate-900 bg-white shadow-xs rounded-lg cursor-pointer transition-all py-1.5 px-4';
                    }
                    if (dotFront) {
                        dotFront.className = 'h-1.5 rounded-full transition-all duration-300 cursor-pointer w-1.5 bg-slate-300 hover:bg-slate-400';
                    }
                    if (dotBack) {
                        dotBack.className = 'h-1.5 rounded-full transition-all duration-300 cursor-pointer w-5 bg-brand-500';
                    }
                } else {
                    card.classList.remove('is-flipped');
                    if (tabFront) {
                        tabFront.className = 'text-xs font-semibold text-slate-900 bg-white shadow-xs rounded-lg cursor-pointer transition-all py-1.5 px-4';
                    }
                    if (tabBack) {
                        tabBack.className = 'text-xs font-semibold text-slate-500 hover:text-slate-900 rounded-lg cursor-pointer transition-all py-1.5 px-4';
                    }
                    if (dotFront) {
                        dotFront.className = 'h-1.5 rounded-full transition-all duration-300 cursor-pointer w-5 bg-brand-500';
                    }
                    if (dotBack) {
                        dotBack.className = 'h-1.5 rounded-full transition-all duration-300 cursor-pointer w-1.5 bg-slate-300 hover:bg-slate-400';
                    }
                }
                try {
                    getAudioContext();
                    playNfcTapChime();
                } catch (err) {}
            }

            // Pastikan event listener kontrol kartu spesifikasi terpasang
            const specCard = document.getElementById('specCard3D');
            if (specCard) {
                specCard.onclick = () => switchSpecCard('toggle');
            }
            const tabSpecFrontEl = document.getElementById('tabSpecFront');
            if (tabSpecFrontEl) {
                tabSpecFrontEl.onclick = () => switchSpecCard('front');
            }
            const tabSpecBackEl = document.getElementById('tabSpecBack');
            if (tabSpecBackEl) {
                tabSpecBackEl.onclick = () => switchSpecCard('back');
            }
            const dotSpecFrontEl = document.getElementById('dotSpecFront');
            if (dotSpecFrontEl) {
                dotSpecFrontEl.onclick = () => switchSpecCard('front');
            }
            const dotSpecBackEl = document.getElementById('dotSpecBack');
            if (dotSpecBackEl) {
                dotSpecBackEl.onclick = () => switchSpecCard('back');
            }

            // Auto-idle flip every 4 seconds (flips smoothly when not hovered)
            function startSpecAutoFlip() {
                if (specCardAutoFlipTimer) clearInterval(specCardAutoFlipTimer);
                specCardAutoFlipTimer = setInterval(() => {
                    if (!isSpecCardHovered) {
                        switchSpecCard('toggle');
                    }
                }, 4000);
            }

            const specContainer = document.getElementById('specContainer');
            if (specContainer) {
                specContainer.addEventListener('mouseenter', () => {
                    isSpecCardHovered = true;
                });
                specContainer.addEventListener('mouseleave', () => {
                    isSpecCardHovered = false;
                });
            }

            // Auto-flip active when section is in viewport
            const specSection = document.getElementById('spesifikasi');
            if (specSection && 'IntersectionObserver' in window) {
                const specObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            startSpecAutoFlip();
                        } else {
                            if (specCardAutoFlipTimer) clearInterval(specCardAutoFlipTimer);
                        }
                    });
                }, { threshold: 0.15 });
                specObserver.observe(specSection);
            } else {
                startSpecAutoFlip();
            }

            // 3. Web Audio API NFC Tap Chime Synthesizer
            const ANIMATION_CYCLE_MS = 3800;
            const TAP_MOMENT_OFFSET_MS = 1368; // Tepat saat HP nempel ke akrilik (36% dari 3.8s)

            let audioCtx = null;
            let isMuted = false;
            let isPaused = false;
            let chimeIntervalId = null;

            function getAudioContext() {
                if (!audioCtx) {
                    const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
                    if (AudioCtxClass) {
                        audioCtx = new AudioCtxClass();
                    }
                }
                if (audioCtx && audioCtx.state === 'suspended') {
                    audioCtx.resume();
                }
                return audioCtx;
            }

            function playNfcTapChime() {
                if (isMuted || isPaused) return;

                try {
                    const ctx = getAudioContext();
                    if (!ctx) return;
                    if (ctx.state === 'suspended') {
                        ctx.resume();
                    }
                    if (ctx.state !== 'running') return;

                    const t = ctx.currentTime;

                    // Nada 1: Ketukan Haptik Fisik ke Akrilik (140Hz -> 50Hz)
                    const osc0 = ctx.createOscillator();
                    const gain0 = ctx.createGain();
                    osc0.type = 'triangle';
                    osc0.frequency.setValueAtTime(140, t);
                    osc0.frequency.exponentialRampToValueAtTime(50, t + 0.05);
                    gain0.gain.setValueAtTime(0.22, t);
                    gain0.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
                    osc0.connect(gain0);
                    gain0.connect(ctx.destination);
                    osc0.start(t);
                    osc0.stop(t + 0.05);

                    // Nada 2: Resonansi Induksi NFC (1568 Hz -> 1760 Hz)
                    const osc1 = ctx.createOscillator();
                    const gain1 = ctx.createGain();
                    osc1.type = 'sine';
                    osc1.frequency.setValueAtTime(1567.98, t);
                    osc1.frequency.exponentialRampToValueAtTime(1760.00, t + 0.08);
                    gain1.gain.setValueAtTime(0.18, t);
                    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.32);
                    osc1.connect(gain1);
                    gain1.connect(ctx.destination);
                    osc1.start(t);
                    osc1.stop(t + 0.32);

                    // Nada 3: Ting Kristal 5 Bintang Sukses (2637 Hz + Harmoni 3135 Hz)
                    const osc2 = ctx.createOscillator();
                    const gain2 = ctx.createGain();
                    osc2.type = 'sine';
                    osc2.frequency.setValueAtTime(2637.02, t + 0.04);
                    gain2.gain.setValueAtTime(0.20, t + 0.04);
                    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.50);
                    osc2.connect(gain2);
                    gain2.connect(ctx.destination);
                    osc2.start(t + 0.04);
                    osc2.stop(t + 0.50);

                    const osc3 = ctx.createOscillator();
                    const gain3 = ctx.createGain();
                    osc3.type = 'sine';
                    osc3.frequency.setValueAtTime(3135.96, t + 0.06);
                    gain3.gain.setValueAtTime(0.12, t + 0.06);
                    gain3.gain.exponentialRampToValueAtTime(0.001, t + 0.40);
                    osc3.connect(gain3);
                    gain3.connect(ctx.destination);
                    osc3.start(t + 0.06);
                    osc3.stop(t + 0.40);
                } catch (err) {
                    console.log('Audio gesture needed:', err);
                }
            }

            function scheduleNextTapChime() {
                if (isPaused) return;
                setTimeout(() => {
                    if (!isPaused) {
                        playNfcTapChime();
                    }
                }, TAP_MOMENT_OFFSET_MS);
            }

            function startChimeScheduler() {
                if (chimeIntervalId) clearInterval(chimeIntervalId);
                scheduleNextTapChime();
                chimeIntervalId = setInterval(scheduleNextTapChime, ANIMATION_CYCLE_MS);
            }

            startChimeScheduler();

            // Buka izin Web Audio secara otomatis saat ada interaksi pengguna
            const unlockAudioOnGesture = () => {
                getAudioContext();
                ['click', 'touchstart', 'pointerdown', 'mousedown', 'keydown', 'scroll'].forEach(evt => {
                    window.removeEventListener(evt, unlockAudioOnGesture);
                });
            };
            ['click', 'touchstart', 'pointerdown', 'mousedown', 'keydown', 'scroll'].forEach(evt => {
                window.addEventListener(evt, unlockAudioOnGesture, { passive: true });
            });

            // Otomatis sinkronkan audio & animasi ketika section Cara Kerja terlihat di layar
            const caraKerjaSection = document.getElementById('cara-kerja');
            if (caraKerjaSection && 'IntersectionObserver' in window) {
                const caraKerjaObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            isPaused = false;
                            startChimeScheduler();
                        } else {
                            isPaused = true;
                            if (chimeIntervalId) clearInterval(chimeIntervalId);
                        }
                    });
                }, { threshold: 0.2 });
                caraKerjaObserver.observe(caraKerjaSection);
            } else {
                startChimeScheduler();
            }

            // Interaksi klik manual pada kartu langkah 3
            const cardStep3 = document.getElementById('cardStep3');
            if (cardStep3) {
                cardStep3.addEventListener('click', () => {
                    getAudioContext();
                    playNfcTapChime();
                });
            }

            // 4. FAQ Accordion Toggle
            document.querySelectorAll('.faq-accordion').forEach(item => {
                item.addEventListener('click', () => {
                    const content = item.querySelector('.faq-content');
                    const icon = item.querySelector('.faq-icon');
                    const isHidden = content.classList.contains('hidden');

                    // Close other faqs
                    document.querySelectorAll('.faq-content').forEach(c => c.classList.add('hidden'));
                    document.querySelectorAll('.faq-icon').forEach(i => i.textContent = '+');

                    if (isHidden) {
                        content.classList.remove('hidden');
                        icon.textContent = '−';
                    }
                });
            });

    // Pastikan fungsi interaksi global dapat dipanggil dari atribut onclick di HTML komponen
    window.toggleHeroCard = toggleHeroCard;
    window.switchSpecCard = switchSpecCard;
    window.playNfcTapChime = playNfcTapChime;
    window.getAudioContext = getAudioContext;
}

// ========================================================
// 1. SETUP LENIS SMOOTH SCROLL & GSAP SCROLLTRIGGER (ALA GOTAP)
// ========================================================
function initLenisAndScrollTrigger() {
    if (typeof Lenis === 'undefined' || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('Lenis atau GSAP belum termuat.');
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
    });

    window.lenis = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
}

// ========================================================
// 2. ANIMASI SCROLL REVEAL GSAP ALA GOTAP
// ========================================================
function initScrollRevealAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    // 1. Kartu 3D di Hero section (sedikit membesar dan melayang saat di-scroll)
    const heroCardCol = document.querySelector('#heroCard3D')?.closest('.lg\\:col-span-5');
    if (heroCardCol) {
        gsap.fromTo(heroCardCol,
            { opacity: 0, y: 35, scale: 0.95 },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.85,
                ease: 'power2.out',
                clearProps: 'opacity'
            }
        );

        gsap.to(heroCardCol, {
            scrollTrigger: {
                trigger: heroCardCol.closest('section') || heroCardCol,
                start: 'top top',
                end: 'bottom top',
                scrub: 1.2
            },
            y: -50,
            scale: 1.05,
            ease: 'none'
        });
    }

    // 2. 3 Kotak langkah di section #cara-kerja (muncul berurutan / stagger)
    const stepCards = document.querySelectorAll('#cara-kerja .grid > div');
    if (stepCards.length) {
        gsap.fromTo(stepCards,
            { y: 35, opacity: 0 },
            {
                scrollTrigger: {
                    trigger: '#cara-kerja',
                    start: 'top 88%',
                    toggleActions: 'play none none none',
                    once: true
                },
                y: 0,
                opacity: 1,
                duration: 0.75,
                stagger: 0.15,
                ease: 'power2.out',
                clearProps: 'all'
            }
        );
    }

    // 3. Showcase Mockup HP & Feature Cards di #fitur & #solusi
    const fiturMockup = document.querySelector('#fitur img')?.parentElement;
    if (fiturMockup) {
        gsap.fromTo(fiturMockup,
            { y: 35, opacity: 0, scale: 0.96 },
            {
                scrollTrigger: {
                    trigger: '#fitur',
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                    once: true
                },
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.8,
                ease: 'power2.out',
                clearProps: 'all'
            }
        );
    }

    const solusiMockup = document.querySelector('#solusi img')?.parentElement;
    if (solusiMockup) {
        gsap.fromTo(solusiMockup,
            { y: 35, opacity: 0, scale: 0.96 },
            {
                scrollTrigger: {
                    trigger: '#solusi',
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                    once: true
                },
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.8,
                ease: 'power2.out',
                clearProps: 'all'
            }
        );
    }

    const featureCards = document.querySelectorAll('#solusi .space-y-4 > div, #fitur .space-y-4 > div');
    if (featureCards.length) {
        gsap.fromTo(featureCards,
            { y: 25, opacity: 0 },
            {
                scrollTrigger: {
                    trigger: featureCards[0]?.closest('section') || '#solusi',
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                    once: true
                },
                y: 0,
                opacity: 1,
                duration: 0.65,
                stagger: 0.12,
                ease: 'power2.out',
                clearProps: 'all'
            }
        );
    }

    // 4. Kartu harga paket reseller di #paket (muncul berurutan / stagger)
    const paketCards = document.querySelectorAll('#paket .max-w-5xl > div');
    if (paketCards.length) {
        gsap.fromTo(paketCards,
            { y: 35, opacity: 0 },
            {
                scrollTrigger: {
                    trigger: '#paket',
                    start: 'top 88%',
                    toggleActions: 'play none none none',
                    once: true
                },
                y: 0,
                opacity: 1,
                duration: 0.75,
                stagger: 0.18,
                ease: 'power2.out',
                clearProps: 'all'
            }
        );
    }

    // Safeguard anti-blank: memastikan elemen selalu terlihat jika ScrollTrigger belum memicu
    setTimeout(() => {
        document.querySelectorAll('#cara-kerja .grid > div, #paket .max-w-5xl > div').forEach(el => {
            if (getComputedStyle(el).opacity === '0') {
                el.style.opacity = '1';
                el.style.transform = 'none';
            }
        });
    }, 2000);

    ScrollTrigger.refresh();
}

// Refresh ScrollTrigger jika seluruh aset/gambar eksternal selesai termuat
window.addEventListener('load', () => {
    if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
    }
});

// ========================================================
// 3. SISTEM NAVIGASI RESPONSIF INSTAN (0MS DELAY DENGAN DUKUNGAN LENIS)
// ========================================================
let activeScrollRAF = null;

function snappyScrollTo(targetY, duration = 360) {
    if (activeScrollRAF) {
        cancelAnimationFrame(activeScrollRAF);
        activeScrollRAF = null;
    }

    const startY = window.pageYOffset;
    const diff = targetY - startY;
    if (Math.abs(diff) < 2) return;

    let startTime = null;

    function easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }

    function step(currentTime) {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = easeOutQuart(progress);

        window.scrollTo(0, startY + diff * ease);

        if (progress < 1) {
            activeScrollRAF = requestAnimationFrame(step);
        } else {
            window.scrollTo(0, targetY);
            activeScrollRAF = null;
        }
    }

    const onUserCancel = (e) => {
        if (e.isTrusted && activeScrollRAF) {
            cancelAnimationFrame(activeScrollRAF);
            activeScrollRAF = null;
            ['wheel', 'touchstart', 'pointerdown'].forEach(evt => {
                window.removeEventListener(evt, onUserCancel);
            });
        }
    };
    ['wheel', 'touchstart', 'pointerdown'].forEach(evt => {
        window.addEventListener(evt, onUserCancel, { passive: true });
    });

    activeScrollRAF = requestAnimationFrame(step);
}

function setupInstantNavigation() {
    // Tangani semua klik tautan anchor (#) dengan capture: true agar langsung dieksekusi tanpa delay
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;

        const href = link.getAttribute('href');
        if (!href) return;

        // Tutup menu drawer mobile seketika
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
        }

        // Jika klik logo atau link ke "#" / "#top"
        if (href === '#' || href === '#top') {
            e.preventDefault();
            if (window.lenis) {
                window.lenis.scrollTo(0, { duration: 1.0 });
            } else {
                snappyScrollTo(0, 320);
            }
            return;
        }

        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();

            if (window.lenis) {
                // Gunakan Lenis scrollTo yang terintegrasi mulus dengan ScrollTrigger
                window.lenis.scrollTo(target, { offset: -76, duration: 1.1 });
            } else {
                // Fallback snappy scroll
                const headerOffset = 76;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = Math.max(0, elementPosition + window.pageYOffset - headerOffset);
                snappyScrollTo(offsetPosition, 360);
            }

            if (window.history && window.history.pushState) {
                window.history.pushState(null, '', href);
            }
        }
    }, { capture: true });
}

function setupScrollSpy() {
    const sections = ['spesifikasi', 'cara-kerja', 'fitur', 'solusi', 'paket', 'produk', 'faq'];
    const navLinks = document.querySelectorAll('#desktopNav a');

    if (!navLinks.length) return;

    function updateActiveNav() {
        const scrollY = window.pageYOffset + 140;
        let currentSectionId = '';

        for (const id of sections) {
            const el = document.getElementById(id);
            if (el) {
                const top = el.offsetTop;
                const height = el.offsetHeight;
                if (scrollY >= top && scrollY < top + height) {
                    currentSectionId = id;
                    break;
                }
            }
        }

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${currentSectionId}`) {
                link.classList.add('text-brand-500');
                link.classList.remove('text-slate-600');
            } else {
                link.classList.remove('text-brand-500');
                link.classList.add('text-slate-600');
            }
        });
    }

    // Dengarkan event scroll Lenis jika ada, fallback ke window scroll
    if (window.lenis) {
        window.lenis.on('scroll', updateActiveNav);
    } else {
        window.addEventListener('scroll', updateActiveNav, { passive: true });
    }
    updateActiveNav();
}

// ==========================================
// 12. MODAL FORM CHECKOUT & XENDIT INTEGRATION
// ==========================================
let isSubmittingOrder = false;

function openCheckoutModal(e) {
    if (e && typeof e.preventDefault === 'function') {
        e.preventDefault();
    }
    const modal = document.getElementById('checkoutModal');
    const backdrop = document.getElementById('checkoutModalBackdrop');
    const content = document.getElementById('checkoutModalContent');
    const errorBox = document.getElementById('checkoutFormError');

    if (!modal) return;

    if (errorBox) {
        errorBox.classList.add('hidden');
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.classList.add('overflow-hidden');

    requestAnimationFrame(() => {
        if (backdrop) {
            backdrop.classList.remove('opacity-0');
            backdrop.classList.add('opacity-100');
        }
        if (content) {
            content.classList.remove('opacity-0', 'scale-95');
            content.classList.add('opacity-100', 'scale-100');
        }
    });

    const firstInput = document.getElementById('orderCustomerName');
    if (firstInput) {
        setTimeout(() => firstInput.focus(), 150);
    }
}

function closeCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    const backdrop = document.getElementById('checkoutModalBackdrop');
    const content = document.getElementById('checkoutModalContent');

    if (!modal) return;

    if (backdrop) {
        backdrop.classList.remove('opacity-100');
        backdrop.classList.add('opacity-0');
    }
    if (content) {
        content.classList.remove('opacity-100', 'scale-100');
        content.classList.add('opacity-0', 'scale-95');
    }

    setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.classList.remove('overflow-hidden');
    }, 250);
}

// Expose globally so inline onclick handlers work under any condition
window.openCheckoutModal = openCheckoutModal;
window.closeCheckoutModal = closeCheckoutModal;

/**
 * Simpan Data Pesanan ke API Server (/api/orders) & Backup ke LocalStorage
 */
async function saveOrderData(orderData) {
    // 1. Simpan salinan lokal ke localStorage sebagai backup persistensi
    try {
        const orderHistory = JSON.parse(localStorage.getItem('cardi_order_history') || '[]');
        orderHistory.push({ ...orderData, savedAt: new Date().toISOString() });
        localStorage.setItem('cardi_order_history', JSON.stringify(orderHistory));
        localStorage.setItem('cardi_last_order', JSON.stringify(orderData));
    } catch (e) {
        console.warn('Gagal menyimpan pesanan ke localStorage:', e);
    }

    // 2. Kirim data ke endpoint API Supabase (/api/orders)
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500); // Batas 3.5 detik agar alur pembayaran tidak tertahan

        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData),
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (response.ok) {
            const result = await response.json();
            return { success: true, data: result };
        } else {
            console.warn('[Checkout] Endpoint /api/orders status:', response.status);
            return { success: false, status: response.status };
        }
    } catch (err) {
        console.warn('[Checkout] Gagal mengirim data pesanan ke API (tetap lanjut ke pembayaran):', err);
        return { success: false, error: err };
    }
}

function initCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    const backdrop = document.getElementById('checkoutModalBackdrop');
    const closeBtn = document.getElementById('closeCheckoutModalBtn');
    const form = document.getElementById('checkoutForm');
    const submitBtn = document.getElementById('submitOrderBtn');
    const submitBtnText = document.getElementById('submitOrderBtnText');
    const submitBtnIcon = document.getElementById('submitOrderBtnIcon');
    const submitBtnSpinner = document.getElementById('submitOrderBtnSpinner');
    const errorBox = document.getElementById('checkoutFormError');
    const errorMsg = document.getElementById('checkoutFormErrorMsg');

    if (!modal) return;

    // Klik tombol Close
    if (closeBtn) {
        closeBtn.onclick = (e) => {
            e.preventDefault();
            closeCheckoutModal();
        };
    }

    // Klik pada area backdrop
    if (backdrop) {
        backdrop.onclick = (e) => {
            e.preventDefault();
            closeCheckoutModal();
        };
    }

    // Tekan tombol ESC keyboard
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeCheckoutModal();
        }
    });

    // Delegasi klik untuk seluruh tombol checkout di seluruh halaman
    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-open-checkout], a[href*="xen.to/ZlJBcNFb"]');
        if (trigger) {
            e.preventDefault();
            openCheckoutModal(e);
        }
    });

    // Form Submit Handler
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (isSubmittingOrder) return;

            const nameInput = document.getElementById('orderCustomerName');
            const phoneInput = document.getElementById('orderCustomerPhone');
            const addressInput = document.getElementById('orderShippingAddress');
            const mapsInput = document.getElementById('orderGoogleMapsUrl');
            const notesInput = document.getElementById('orderNotes');

            const customerName = nameInput ? nameInput.value.trim() : '';
            let customerPhone = phoneInput ? phoneInput.value.trim() : '';
            const shippingAddress = addressInput ? addressInput.value.trim() : '';
            const googleMapsUrl = mapsInput ? mapsInput.value.trim() : '';
            const notes = notesInput ? notesInput.value.trim() : '';

            // Reset status error visual
            [nameInput, phoneInput, addressInput, mapsInput].forEach((el) => {
                if (el) {
                    el.classList.remove('border-red-400', 'ring-2', 'ring-red-200');
                }
            });

            function showError(message, focusEl) {
                if (errorBox && errorMsg) {
                    errorMsg.textContent = message;
                    errorBox.classList.remove('hidden');
                    errorBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
                if (focusEl) {
                    focusEl.classList.add('border-red-400', 'ring-2', 'ring-red-200');
                    focusEl.focus();
                }
            }

            // Validasi: Nama
            if (!customerName || customerName.length < 2) {
                showError('Mohon isi Nama Lengkap atau Nama Usaha Anda dengan benar.', nameInput);
                return;
            }

            // Validasi: Nomor WhatsApp
            const cleanPhone = customerPhone.replace(/\D/g, '');
            if (!cleanPhone || cleanPhone.length < 8) {
                showError('Mohon masukkan Nomor WhatsApp aktif yang valid (minimal 8 angka).', phoneInput);
                return;
            }

            // Standarisasi nomor telepon
            let formattedPhone = customerPhone;
            if (formattedPhone.startsWith('0')) {
                formattedPhone = formattedPhone.substring(1);
            }
            if (formattedPhone.startsWith('+62')) {
                formattedPhone = formattedPhone.substring(3);
            } else if (formattedPhone.startsWith('62')) {
                formattedPhone = formattedPhone.substring(2);
            }
            formattedPhone = '+62' + formattedPhone.replace(/\D/g, '');

            // Validasi: Alamat Pengiriman
            if (!shippingAddress || shippingAddress.length < 8) {
                showError('Mohon isi Alamat Lengkap Pengiriman untuk pengiriman plakat akrilik fisik.', addressInput);
                return;
            }

            // Validasi: Link Google Maps
            if (!googleMapsUrl || (!googleMapsUrl.includes('maps') && !googleMapsUrl.includes('google') && !googleMapsUrl.includes('g.page') && !googleMapsUrl.startsWith('http'))) {
                showError('Mohon masukkan Link Profil Google Maps Bisnis Anda yang valid.', mapsInput);
                return;
            }

            if (errorBox) {
                errorBox.classList.add('hidden');
            }

            // Set State Loading
            isSubmittingOrder = true;
            if (submitBtn) submitBtn.disabled = true;
            if (submitBtnText) submitBtnText.textContent = 'Memproses...';
            if (submitBtnIcon) submitBtnIcon.classList.add('hidden');
            if (submitBtnSpinner) submitBtnSpinner.classList.remove('hidden');

            const orderPayload = {
                customerName: customerName,
                customerPhone: formattedPhone,
                shippingAddress: shippingAddress,
                googleMapsUrl: googleMapsUrl,
                notes: notes || null,
                productName: 'Plakat Akrilik Google Review NFC',
                productPrice: 69000,
                createdAt: new Date().toISOString()
            };

            // Simpan data pemesan ke API / Supabase
            await saveOrderData(orderPayload);

            // Buka link Xendit
            const xenditCheckoutUrl = 'https://xen.to/ZlJBcNFb';
            try {
                const newWin = window.open(xenditCheckoutUrl, '_blank', 'noopener,noreferrer');
                if (!newWin || newWin.closed || typeof newWin.closed === 'undefined') {
                    window.location.href = xenditCheckoutUrl;
                }
            } catch (err) {
                window.location.href = xenditCheckoutUrl;
            }

            // Tutup modal dan bersihkan form setelah transisi
            setTimeout(() => {
                closeCheckoutModal();
                form.reset();

                // Reset state tombol
                isSubmittingOrder = false;
                if (submitBtn) submitBtn.disabled = false;
                if (submitBtnText) submitBtnText.textContent = 'Lanjut ke Pembayaran';
                if (submitBtnIcon) submitBtnIcon.classList.remove('hidden');
                if (submitBtnSpinner) submitBtnSpinner.classList.add('hidden');
            }, 600);
        });
    }
}

