const envelope = document.getElementById('envelope');
const mainContent = document.getElementById('mainContent');
const rsvpForm = document.getElementById('rsvpForm');
const hero = document.querySelector('.hero');
let resetButton = document.getElementById('resetButton');
const flowersContainer = document.querySelector('.flowers-container');
const flower1Container = document.querySelector('.flower-1-container');
const saveTheDateContainer = document.querySelector('.save-the-date-container');
const additionalImagesContainer = document.querySelector('.additional-images-container');

// ==============================
// MOBILE DETECTION
// ==============================

function isMobile() {
    return window.innerWidth <= 1023;
}

// ==============================
// SCALE-TO-FIT FUNCTIONALITY
// ==============================

function scaleToFit() {
    const zoomRoot = document.getElementById('zoom-root');
    if (!zoomRoot) return;

    const baseWidth = 1024;
    const baseHeight = 768;

    // Use visual viewport if available (fixes mobile pinch zoom)
    const viewportWidth = window.visualViewport?.width || window.innerWidth;
    const viewportHeight = window.visualViewport?.height || window.innerHeight;

    const scaleX = viewportWidth / baseWidth;
    const scaleY = viewportHeight / baseHeight;
    const fitScale = Math.min(scaleX, scaleY);

    // MOBILE behavior
    if (isMobile()) {
        // Different base dimensions for different states
        const baseWidth = document.body.classList.contains('mobile-opened') ? 768 : 1024;
        const baseHeight = document.body.classList.contains('mobile-opened') ? 1024 : 768;

        const scaleX = viewportWidth / baseWidth;
        const scaleY = viewportHeight / baseHeight;
        const mobileScale = Math.min(scaleX, scaleY);

        let zoomMultiplier = document.body.classList.contains('mobile-opened') ? 1.0 : 1.3;

        if (!document.body.classList.contains('mobile-opened')) {
            if (window.innerWidth <= 479) zoomMultiplier = 1.25;
            else if (window.innerWidth >= 768) zoomMultiplier = 1.4;
        }

        const finalScale = mobileScale * zoomMultiplier;

        zoomRoot.style.transform = `scale(${finalScale})`;
        zoomRoot.style.transformOrigin = document.body.classList.contains('mobile-opened')
            ? 'top center'
            : 'center center';
        document.documentElement.style.setProperty('--zoom-level', finalScale);
        return;
    }
    // DESKTOP behavior
    zoomRoot.style.transform = `scale(${fitScale})`;
    document.documentElement.style.setProperty('--zoom-level', fitScale);
}

window.addEventListener('resize', scaleToFit);
window.addEventListener('load', scaleToFit);
window.visualViewport?.addEventListener('resize', scaleToFit);
scaleToFit();

if (!resetButton) {
    resetButton = document.getElementById('resetButton');
}

// ==============================
// ZOOM FUNCTIONALITY (DESKTOP ONLY)
// ==============================

const zoomRoot = document.getElementById('zoom-root');
let zoomLevel = 1;
const MIN_ZOOM = 0.85;
const MAX_ZOOM = 1.6;

function applyZoom() {
    if (!zoomRoot || isMobile()) return;

    const baseScale = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--zoom-level')
    ) || 1;

    const combinedScale = baseScale * zoomLevel;
    zoomRoot.style.transform = `scale(${combinedScale})`;

    if (zoomLevel > 1) {
        document.documentElement.style.overflow = 'auto';
        document.body.style.overflow = 'visible';
        document.body.style.display = 'block';
        document.body.style.position = 'relative';

        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const contentWidth = 1024 * combinedScale;
        const contentHeight = 768 * combinedScale;

        const leftOffset = Math.max(0, (windowWidth - contentWidth) / 2);
        const topOffset = Math.max(0, (windowHeight - contentHeight) / 2);

        zoomRoot.style.position = 'absolute';
        zoomRoot.style.left = `${leftOffset}px`;
        zoomRoot.style.top = `${topOffset}px`;
    } else {
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
        document.body.style.display = 'flex';
        document.body.style.position = 'relative';

        zoomRoot.style.position = 'relative';
        zoomRoot.style.left = 'auto';
        zoomRoot.style.top = 'auto';

        window.scrollTo(0, 0);
    }

    if (zoomLevel <= 1.5 && zoomLevel > 1) {
        const recenterAmount = (1.5 - zoomLevel) / 0.5;
        window.scrollTo(
            window.scrollX * (1 - recenterAmount),
            window.scrollY * (1 - recenterAmount)
        );
    }
}

document.addEventListener('keydown', (e) => {
    if (isMobile()) return;
    if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '=')) {
        e.preventDefault();
        zoomLevel = Math.min(MAX_ZOOM, zoomLevel + 0.1);
        applyZoom();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === '-') {
        e.preventDefault();
        zoomLevel = Math.max(MIN_ZOOM, zoomLevel - 0.1);
        applyZoom();
    }
});

window.addEventListener('wheel', (e) => {
    if (isMobile()) return;
    if (e.ctrlKey) {
        e.preventDefault();
        const ZOOM_STEP = 0.08;
        if (e.deltaY < 0) {
            zoomLevel = Math.min(MAX_ZOOM, zoomLevel + ZOOM_STEP);
        } else {
            zoomLevel = Math.max(MIN_ZOOM, zoomLevel - ZOOM_STEP);
        }
        applyZoom();
    }
}, { passive: false });


// ==============================
// ENVELOPE FRONT REVEAL
// ==============================

setTimeout(() => {
    const envelopeFront = document.querySelector('.envelope-front');
    if (envelopeFront) {
        envelopeFront.classList.add('visible');
    }
}, 100);

setTimeout(() => {
    envelope.classList.add('ready');
}, 2000);


// ==============================
// ENVELOPE CLICK HANDLER
// ==============================

envelope.addEventListener('click', function () {
    if (!this.classList.contains('flipped') && this.classList.contains('ready')) {

        // Stage 1: Flip
        this.classList.add('flipped');

        if (flowersContainer) flowersContainer.classList.add('flipped');
        if (flower1Container) flower1Container.classList.add('flipped');
        if (saveTheDateContainer) saveTheDateContainer.classList.add('flipped');
        if (additionalImagesContainer) additionalImagesContainer.classList.add('flipped');

        // Stage 2: Open flap
        setTimeout(() => {
            this.classList.add('opened');
        }, 1000);

        // Stage 3: Fade + layout transition synced to flap
        setTimeout(() => {
            document.body.classList.add('envelope-fade-out');

            // After fade completes → unlock scroll + mobile layout
            setTimeout(() => {
                document.body.classList.add('mobile-opened');
                document.documentElement.style.overflow = 'visible';
                resetButton.classList.add('show');
            }, 1200); // fade duration
        }, 3600); // flip (1000ms) + flap (1500ms) + buffer

        // Desktop timeline unchanged
        if (!isMobile()) {
            setTimeout(() => {
                if (flowersContainer) flowersContainer.classList.add('opened');
                if (flower1Container) flower1Container.classList.add('opened');
                if (saveTheDateContainer) saveTheDateContainer.classList.add('show');
                if (additionalImagesContainer) additionalImagesContainer.classList.add('show');
            }, 5500);

            setTimeout(() => {
                resetButton.classList.add('show');
            }, 7000);
        }

        localStorage.setItem('envelopeOpened', 'true');
    }
});


// ==============================
// RESET BUTTON HANDLER
// ==============================

resetButton.addEventListener('click', function () {
    const photosContainer = document.getElementById('photosContainer');
    const infoCardContainer = document.getElementById('infoCardContainer');

    const envelopeElement = document.querySelector('.envelope');
    const envelopeBackBottom = document.querySelector('.envelope-back-bottom');
    const envelopeBackTop = document.querySelector('.envelope-back-top');
    const envelopeFlapInside = document.querySelector('.envelope-flap-inside');
    const envelopeFlap = document.querySelector('.envelope-flap');
    const seal = document.querySelector('.seal');
    const envelopeFront = document.querySelector('.envelope-front');

    // Remove mobile-opened state if present
    document.body.classList.remove('mobile-opened');
    document.body.classList.remove('envelope-fade-out');
    document.documentElement.style.overflow = 'hidden';

    // --- Fade out everything ---
    if (flowersContainer) {
        flowersContainer.style.cssText = 'transition: opacity 0.8s ease-out !important; opacity: 0 !important;';
    }
    if (flower1Container) {
        flower1Container.style.cssText = 'transition: opacity 0.8s ease-out !important; opacity: 0 !important;';
    }
    if (saveTheDateContainer) {
        saveTheDateContainer.style.cssText = 'transition: opacity 0.8s ease-out !important; opacity: 0 !important;';
    }
    if (additionalImagesContainer) {
        additionalImagesContainer.style.cssText = 'transition: opacity 0.8s ease-out !important; opacity: 0 !important;';
    }

    // Fade out hero text elements
    const heroText1 = document.querySelector('.hero-text-1');
    const heroText2 = document.querySelector('.hero-text-2');
    if (heroText1) heroText1.style.cssText = 'transition: opacity 0.8s ease-out !important; opacity: 0 !important;';
    if (heroText2) heroText2.style.cssText = 'transition: opacity 0.8s ease-out !important; opacity: 0 !important;';

    // Fade out individual elements
    const flower1 = document.querySelector('.flower-1-container .flower-1');
    const flower2 = document.querySelector('.flowers-container .flower-2');
    const flower3 = document.querySelector('.flowers-container .flower-3');
    const saveTheDateImage = document.querySelector('.save-the-date-container .image-1');
    const additionalImage1 = document.querySelector('.additional-images-container .image-1');
    const additionalImage2 = document.querySelector('.additional-images-container .image-2');
    const additionalImage3 = document.querySelector('.additional-images-container .image-3');

    [flower1, flower2, flower3, saveTheDateImage, additionalImage1, additionalImage2, additionalImage3].forEach(el => {
        if (el) el.style.cssText = 'transition: opacity 0.8s ease-out !important; opacity: 0 !important;';
    });

    [envelopeBackBottom, envelopeBackTop, envelopeFlapInside, envelopeFlap, seal].forEach(el => {
        if (el) el.style.cssText = 'transition: opacity 0.8s ease-out !important; opacity: 0 !important;';
    });

    if (envelopeFront) envelopeFront.classList.remove('visible');

    if (photosContainer) {
        photosContainer.style.cssText = 'transition: opacity 0.8s ease-out !important; opacity: 0 !important;';
    }
    if (infoCardContainer) {
        infoCardContainer.style.cssText = 'transition: opacity 0.8s ease-out !important; opacity: 0 !important;';
    }

    envelope.style.transition = 'opacity 0.8s ease-out';
    envelope.style.opacity = '0';

    this.style.transition = 'opacity 0.3s ease-out';
    this.style.opacity = '0';

    // --- After fade completes, hard-reset state ---
    setTimeout(() => {
        // Disable transitions to prevent visible flip during class removal
        if (envelopeElement) envelopeElement.style.transition = 'none';
        if (envelopeFlap) envelopeFlap.style.transition = 'none';

        envelope.classList.remove('flipped', 'opened', 'ready');
        void envelope.offsetWidth; // force reflow

        setTimeout(() => {
            if (envelopeElement) envelopeElement.style.transition = '';
            if (envelopeFlap) envelopeFlap.style.transition = '';
        }, 50);

        envelope.removeAttribute('style');
        void envelope.offsetWidth;
        envelope.style.opacity = '0';

        // Reset photos via DOM removal/reinsertion to clear animations
        if (photosContainer) {
            const photoData = [];
            photosContainer.querySelectorAll('.photo').forEach(p => {
                photoData.push({ backgroundImage: p.style.backgroundImage });
            });
            photosContainer.innerHTML = '';
            void photosContainer.offsetWidth;
            photoData.forEach(data => {
                const newPhoto = document.createElement('div');
                newPhoto.className = 'photo';
                newPhoto.style.backgroundImage = data.backgroundImage;
                photosContainer.appendChild(newPhoto);
            });
            photosContainer.style.cssText = '';
        }

        if (infoCardContainer) {
            const infoCard = infoCardContainer.querySelector('.info-card');
            const bgImage = infoCard ? infoCard.style.backgroundImage : '';
            infoCardContainer.innerHTML = '';
            void infoCardContainer.offsetWidth;
            const newInfoCard = document.createElement('div');
            newInfoCard.className = 'info-card';
            newInfoCard.style.backgroundImage = bgImage;
            infoCardContainer.appendChild(newInfoCard);
            infoCardContainer.style.cssText = '';
        }

        // Reset flower/decoration containers
        if (flowersContainer) {
            flowersContainer.classList.remove('flipped', 'opened');
            flowersContainer.style.cssText = '';
        }
        if (flower1Container) {
            flower1Container.classList.remove('flipped', 'opened');
            flower1Container.style.cssText = '';
        }

        // Reset individual elements
        [flower1, flower2, flower3, saveTheDateImage, additionalImage1, additionalImage2, additionalImage3].forEach(el => {
            if (el) {
                el.style.cssText = '';
                el.style.animation = 'none';
                el.style.opacity = '0';
            }
        });

        const envelopeText = document.querySelector('.envelope-text');
        const stamp = document.querySelector('.stamp');
        const postalWave = document.querySelector('.postal-wave');
        const clickText = document.querySelector('.click-text');
        const heroText = document.querySelector('.hero-text-1');

        [envelopeText, stamp, postalWave].forEach(el => {
            if (el) { el.style.animation = 'none'; el.style.opacity = '0'; }
        });

        if (clickText) {
            clickText.style.animation = 'none';
            clickText.style.opacity = '0';
            void clickText.offsetWidth;
            clickText.style.animation = '';
            clickText.style.opacity = '';
        }

        if (heroText) {
            heroText.style.animation = 'none';
            heroText.style.opacity = '0';
            void heroText.offsetWidth;
            heroText.style.animation = '';
            heroText.style.opacity = '';
        }

        [envelopeBackBottom, envelopeBackTop, envelopeFlapInside, envelopeFlap, seal].forEach(el => {
            if (el) el.style.cssText = '';
        });

        if (saveTheDateContainer) {
            saveTheDateContainer.classList.remove('flipped', 'show');
            saveTheDateContainer.style.cssText = '';
        }
        if (additionalImagesContainer) {
            additionalImagesContainer.classList.remove('flipped', 'show');
            additionalImagesContainer.style.cssText = '';
        }

        resetButton.style.opacity = '';
        resetButton.style.transition = '';
        resetButton.classList.remove('show');

        localStorage.removeItem('envelopeOpened');

        // --- Trigger re-entry animations ---
        setTimeout(() => {
            envelope.style.animation = 'fadeInUp 0.8s ease-out';

            setTimeout(() => {
                envelope.style.animation = '';
                envelope.style.opacity = '';
                envelope.classList.add('ready');
            }, 800);

            if (envelopeFront) {
                setTimeout(() => { envelopeFront.classList.add('visible'); }, 400);
            }

            // Re-trigger flower/decoration animations (desktop only — on mobile they're hidden)

            const f1 = document.querySelector('.flower-1-container .flower-1');
            const f2 = document.querySelector('.flowers-container .flower-2');
            const f3 = document.querySelector('.flowers-container .flower-3');
            if (f1) f1.style.animation = 'fadeInUpFlowers 1.2s ease-out 0.5s forwards';
            if (f2) f2.style.animation = 'fadeInUpFlowers 1.2s ease-out 0.7s forwards';
            if (f3) f3.style.animation = 'fadeInUpFlowers 1.2s ease-out 0.9s forwards';

            const std = document.querySelector('.save-the-date-container .image-1');
            if (std) std.style.animation = 'fadeInUpFlowers 1.2s ease-out 0s forwards';

            const ai1 = document.querySelector('.additional-images-container .image-1');
            const ai2 = document.querySelector('.additional-images-container .image-2');
            const ai3 = document.querySelector('.additional-images-container .image-3');
            if (ai1) ai1.style.animation = 'fadeInUpFlowers 1.2s ease-out 0.2s forwards';
            if (ai2) ai2.style.animation = 'fadeInUpFlowers 1.2s ease-out 0.4s forwards';
            if (ai3) ai3.style.animation = 'fadeInUpFlowers 1.2s ease-out 0.4s forwards';

            // Re-trigger hero text animations
            const ht1 = document.querySelector('.hero-text-1');
            const ht2 = document.querySelector('.hero-text-2');
            if (ht1) {
                ht1.style.cssText = '';
                ht1.style.animation = 'fadeInDown 1s ease-out 0.8s forwards';
            }
            if (ht2) {
                ht2.style.cssText = '';
                ht2.style.animation = 'fadeInUp 1s ease-out 1.2s forwards';
            }


            const et = document.querySelector('.envelope-text');
            const st = document.querySelector('.stamp');
            const pw = document.querySelector('.postal-wave');
            if (et) et.style.animation = 'fadeInText 0.8s ease-out 1.6s forwards';
            if (st) st.style.animation = 'fadeInStamp 0.6s ease-out 1.2s forwards';
            if (pw) pw.style.animation = 'fadeInStamp 0.6s ease-out 1.4s forwards';
        }, 100);

    }, 800);
});