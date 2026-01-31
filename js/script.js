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
// SCALE-TO-FIT FUNCTIONALITY
// ==============================

function scaleToFit() {
    // Your design's base dimensions (adjust these to match your design)
    const baseWidth = 1024;
    const baseHeight = 768;
    
    // Calculate scale factors
    const scaleX = window.innerWidth / baseWidth;
    const scaleY = window.innerHeight / baseHeight;
    
    // Use the smaller scale to fit everything in view
    const scale = Math.min(scaleX, scaleY);
    
    // Apply the scale to zoom-root instead of body
    const zoomRoot = document.getElementById('zoom-root');
    if (zoomRoot) {
        zoomRoot.style.transform = `scale(${scale})`;
    }
    
    // Store for CSS variable (optional, for any CSS that needs it)
    document.documentElement.style.setProperty('--zoom-level', scale);
}

// Scale on load and resize
window.addEventListener('resize', scaleToFit);
window.addEventListener('load', scaleToFit);

// Initial scale
scaleToFit();

if (!resetButton) {
    resetButton = document.getElementById('resetButton');
}

// ==============================
// ZOOM FUNCTIONALITY (SAFE ZONE)
// ==============================

const zoomRoot = document.getElementById('zoom-root');
let zoomLevel = 1;
const MIN_ZOOM = 0.85;
const MAX_ZOOM = 1.6;

function applyZoom() {
    if (!zoomRoot) return;
    
    // Get the current scale from scaleToFit
    const baseScale = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--zoom-level') || 1);
    
    // Apply both the base scale and zoom level
    const combinedScale = baseScale * zoomLevel;
    zoomRoot.style.transform = `scale(${combinedScale})`;
    
    if (zoomLevel > 1) {
        // Enable scrolling when zoomed in
        document.documentElement.style.overflow = 'auto';
        document.body.style.overflow = 'visible';
        
        // Remove flexbox centering to allow scrolling
        document.body.style.display = 'block';
        document.body.style.position = 'relative';
        
        // Center the zoom-root manually for scrolling
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
        // At normal zoom - restore centering with flexbox
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
        document.body.style.display = 'flex';
        document.body.style.position = 'relative';
        
        // Reset position to let flexbox handle centering
        zoomRoot.style.position = 'relative';
        zoomRoot.style.left = 'auto';
        zoomRoot.style.top = 'auto';
        
        // Reset scroll position
        window.scrollTo(0, 0);
    }
    
    // Smoothly recenter as zoom approaches 1.0
    if (zoomLevel <= 1.5 && zoomLevel > 1) {
        const currentScrollX = window.scrollX;
        const currentScrollY = window.scrollY;
        
        // Calculate how much to recenter (0 at 1.5x, 1 at 1.0x)
        const recenterAmount = (1.5 - zoomLevel) / 0.5;
        
        // Smoothly scroll toward center
        window.scrollTo(
            currentScrollX * (1 - recenterAmount),
            currentScrollY * (1 - recenterAmount)
        );
    }
}

// Optional: keyboard zoom (Cmd/Ctrl + / -)
document.addEventListener('keydown', (e) => {
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

window.addEventListener(
    'wheel',
    (e) => {
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
    },
    { passive: false }
);

// Add visible class to envelope-front on page load
setTimeout(() => {
    const envelopeFront = document.querySelector('.envelope-front');
    if (envelopeFront) {
        envelopeFront.classList.add('visible');
    }
}, 100);

setTimeout(() => {
    envelope.classList.add('ready');
}, 2000);

envelope.addEventListener('click', function () {
    if (!this.classList.contains('flipped') && this.classList.contains('ready')) {
        // Stage 1: Flip envelope (immediate)
        this.classList.add('flipped');

        if (flowersContainer) flowersContainer.classList.add('flipped');
        if (flower1Container) flower1Container.classList.add('flipped');
        if (saveTheDateContainer) saveTheDateContainer.classList.add('flipped');
        if (additionalImagesContainer) additionalImagesContainer.classList.add('flipped');

        // Stage 2: Open flap (NORMAL timing)
        setTimeout(() => {
            this.classList.add('opened');
        }, 1000);

        // Stage 3: Photos animate automatically via CSS (.opened on envelope)

        // Stage 4: Flowers and images reappear AFTER photos finish
        setTimeout(() => {
            if (flowersContainer) flowersContainer.classList.add('opened');
            if (flower1Container) flower1Container.classList.add('opened');
            if (saveTheDateContainer) saveTheDateContainer.classList.add('show');
            if (additionalImagesContainer) additionalImagesContainer.classList.add('show');
        }, 5500);

        localStorage.setItem('envelopeOpened', 'true');

        // Stage 5: Show reset button AFTER all animations complete
        setTimeout(() => {
            resetButton.classList.add('show');
        }, 7000);
    }
});

resetButton.addEventListener('click', function () {
    // Get fresh references to containers
    let photosContainer = document.getElementById('photosContainer');
    let infoCardContainer = document.getElementById('infoCardContainer');
    
    // Get individual flower elements - matching the HTML class names
    const flower1 = document.querySelector('.flower-1-container .flowers');
    const flower2 = document.querySelector('.flowers-container .flower-2');
    const flower3 = document.querySelector('.flowers-container .flower-3');
    const saveTheDateImage = document.querySelector('.save-the-date-container .image-1');
    const additionalImage1 = document.querySelector('.additional-images-container .image-1');
    const additionalImage2 = document.querySelector('.additional-images-container .image-2');
    const additionalImage3 = document.querySelector('.additional-images-container .image-3');
    
    // Get envelope elements
    const envelopeElement = document.querySelector('.envelope');
    const envelopeBackBottom = document.querySelector('.envelope-back-bottom');
    const envelopeBackTop = document.querySelector('.envelope-back-top');
    const envelopeFlapInside = document.querySelector('.envelope-flap-inside');
    const envelopeFlap = document.querySelector('.envelope-flap');
    const seal = document.querySelector('.seal');
    const envelopeFront = document.querySelector('.envelope-front');
    
    // Step 1: Fade out everything smoothly with !important to override animations
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
    
    // Fade out individual flower elements
    [flower1, flower2, flower3, saveTheDateImage, additionalImage1, additionalImage2, additionalImage3].forEach(element => {
        if (element) {
            element.style.cssText = 'transition: opacity 0.8s ease-out !important; opacity: 0 !important;';
        }
    });
    
    // Fade out envelope back elements
    [envelopeBackBottom, envelopeBackTop, envelopeFlapInside, envelopeFlap, seal].forEach(element => {
        if (element) {
            element.style.cssText = 'transition: opacity 0.8s ease-out !important; opacity: 0 !important;';
        }
    });
    
    // Fade out envelope front
    if (envelopeFront) {
        envelopeFront.classList.remove('visible');
    }
    
    if (photosContainer) {
        photosContainer.style.cssText = 'transition: opacity 0.8s ease-out !important; opacity: 0 !important;';
    }
    if (infoCardContainer) {
        infoCardContainer.style.cssText = 'transition: opacity 0.8s ease-out !important; opacity: 0 !important;';
    }
    
    // Fade out the entire envelope container - DON'T use cssText with !important
    envelope.style.transition = 'opacity 0.8s ease-out';
    envelope.style.opacity = '0';
    
    // Hide reset button with fade
    this.style.transition = 'opacity 0.3s ease-out';
    this.style.opacity = '0';
    
    // Step 2: After fade out completes, reset everything
    setTimeout(() => {
        // CRITICAL: Disable transitions on envelope elements to prevent visible flip
        if (envelopeElement) {
            envelopeElement.style.transition = 'none';
        }
        if (envelopeFlap) {
            envelopeFlap.style.transition = 'none';
        }
        
        // Remove all state classes from envelope while transitions are disabled
        envelope.classList.remove('flipped', 'opened', 'ready');
        
        // Force a reflow to ensure the class removal takes effect
        void envelope.offsetWidth;
        
        // Re-enable transitions after a brief moment
        setTimeout(() => {
            if (envelopeElement) {
                envelopeElement.style.transition = '';
            }
            if (envelopeFlap) {
                envelopeFlap.style.transition = '';
            }
        }, 50);
        
        // CRITICAL FIX: Remove ALL inline styles properly
        envelope.removeAttribute('style');
        
        // Force reflow
        void envelope.offsetWidth;
        
        // Now set only what we need for the fade-in
        envelope.style.opacity = '0';
        
        // Reset photos and info card - use DOM removal/reinsertion to fully reset animations
        if (photosContainer) {
            // Save all photo data
            const photoData = [];
            photosContainer.querySelectorAll('.photo').forEach(photo => {
                photoData.push({
                    backgroundImage: photo.style.backgroundImage
                });
            });
            
            // Remove all photos from DOM
            photosContainer.innerHTML = '';
            
            // Force reflow
            void photosContainer.offsetWidth;
            
            // Re-create photos with fresh state
            photoData.forEach(data => {
                const newPhoto = document.createElement('div');
                newPhoto.className = 'photo';
                newPhoto.style.backgroundImage = data.backgroundImage;
                photosContainer.appendChild(newPhoto);
            });
            
            // Reset container styles
            photosContainer.style.cssText = '';
        }
        
        if (infoCardContainer) {
            // Save info card data
            const infoCard = infoCardContainer.querySelector('.info-card');
            const bgImage = infoCard ? infoCard.style.backgroundImage : '';
            
            // Remove and recreate
            infoCardContainer.innerHTML = '';
            void infoCardContainer.offsetWidth;
            
            const newInfoCard = document.createElement('div');
            newInfoCard.className = 'info-card';
            newInfoCard.style.backgroundImage = bgImage;
            infoCardContainer.appendChild(newInfoCard);
            
            // Reset container styles
            infoCardContainer.style.cssText = '';
        }
        
        // Reset flowers
        if (flowersContainer) {
            flowersContainer.classList.remove('flipped', 'opened');
            flowersContainer.style.cssText = '';
        }
        if (flower1Container) {
            flower1Container.classList.remove('flipped', 'opened');
            flower1Container.style.cssText = '';
        }
        
        // Reset individual flower styles
        [flower1, flower2, flower3, saveTheDateImage, additionalImage1, additionalImage2, additionalImage3].forEach(element => {
            if (element) {
                element.style.cssText = '';
                element.style.animation = 'none';
                element.style.opacity = '0';
            }
        });
        
        // Reset envelope text, stamp, and postal wave
        const envelopeText = document.querySelector('.envelope-text');
        const stamp = document.querySelector('.stamp');
        const postalWave = document.querySelector('.postal-wave');
        const clickText = document.querySelector('.click-text');
        
        [envelopeText, stamp, postalWave].forEach(element => {
            if (element) {
                element.style.animation = 'none';
                element.style.opacity = '0';
            }
        });
        
        // Reset click-text - force animation restart
        if (clickText) {
            // Remove animation
            clickText.style.animation = 'none';
            clickText.style.opacity = '0';
            // Force reflow
            void clickText.offsetWidth;
            // Clear inline styles to let CSS take over
            clickText.style.animation = '';
            clickText.style.opacity = '';
        }
        
        // Reset envelope back elements
        [envelopeBackBottom, envelopeBackTop, envelopeFlapInside, envelopeFlap, seal].forEach(element => {
            if (element) {
                element.style.cssText = '';
            }
        });
        
        // Reset additional images
        if (saveTheDateContainer) {
            saveTheDateContainer.classList.remove('flipped', 'show');
            saveTheDateContainer.style.cssText = '';
        }
        if (additionalImagesContainer) {
            additionalImagesContainer.classList.remove('flipped', 'show');
            additionalImagesContainer.style.cssText = '';
        }
        
        // Reset button styles
        resetButton.style.opacity = '';
        resetButton.style.transition = '';
        resetButton.classList.remove('show');
        
        // Clear localStorage
        localStorage.removeItem('envelopeOpened');
        
        // Add a small delay then trigger fade-in animations to mirror initial load
        setTimeout(() => {
            // Trigger envelope fade-in
            envelope.style.animation = 'fadeInUp 0.8s ease-out';
            
            // Clear the animation AND opacity after it completes
            setTimeout(() => {
                envelope.style.animation = '';
                envelope.style.opacity = '';
                // Add ready class immediately after animation completes
                envelope.classList.add('ready');
            }, 800);
            
            // Trigger envelope-front fade-in by adding visible class
            if (envelopeFront) {
                setTimeout(() => {
                    envelopeFront.classList.add('visible');
                }, 400); // 0.4s delay to match CSS
            }
            
            // Trigger flower animations
            if (flower1) {
                flower1.style.animation = 'fadeInUpFlowers 1.2s ease-out 0.5s forwards';
            }
            if (flower2) {
                flower2.style.animation = 'fadeInUpFlowers 1.2s ease-out 0.7s forwards';
            }
            if (flower3) {
                flower3.style.animation = 'fadeInUpFlowers 1.2s ease-out 0.9s forwards';
            }
            
            // Trigger text, stamp, and postal wave animations
            const envelopeText = document.querySelector('.envelope-text');
            const stamp = document.querySelector('.stamp');
            const postalWave = document.querySelector('.postal-wave');
            
            if (envelopeText) {
                envelopeText.style.animation = 'fadeInText 0.8s ease-out 1.6s forwards';
            }
            if (stamp) {
                stamp.style.animation = 'fadeInStamp 0.6s ease-out 1.2s forwards';
            }
            if (postalWave) {
                postalWave.style.animation = 'fadeInStamp 0.6s ease-out 1.4s forwards';
            }
            
            // Trigger save-the-date animation
            if (saveTheDateImage) {
                saveTheDateImage.style.animation = 'fadeInUpFlowers 1.2s ease-out 0s forwards';
            }
            
            // Trigger additional images animations
            if (additionalImage1) {
                additionalImage1.style.animation = 'fadeInUpFlowers 1.2s ease-out 0.2s forwards';
            }
            if (additionalImage2) {
                additionalImage2.style.animation = 'fadeInUpFlowers 1.2s ease-out 0.4s forwards';
            }
            if (additionalImage3) {
                additionalImage3.style.animation = 'fadeInUpFlowers 1.2s ease-out 0.4s forwards';
            }
        }, 100);
    }, 800); // Wait for fade out to complete
});