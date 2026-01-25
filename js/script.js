const envelope = document.getElementById('envelope');
const mainContent = document.getElementById('mainContent');
const rsvpForm = document.getElementById('rsvpForm');
const hero = document.querySelector('.hero');
const resetButton = document.getElementById('resetButton');

// Check if envelope has been opened before
// const hasOpenedEnvelope = localStorage.getItem('envelopeOpened');

// if (hasOpenedEnvelope === 'true') {
//     // Skip animation and go straight to content
//     hero.style.display = 'none';
//     mainContent.classList.add('visible');
//     // Show reset button immediately if envelope was already opened
//     resetButton.classList.add('show');
// } else {
//     // Enable clicking after all front-side animations complete (2 seconds)
setTimeout(() => {
    envelope.classList.add('ready');
}, 2000);
// }

envelope.addEventListener('click', function() {
    // Only trigger animation if not already started and if ready
    if (!this.classList.contains('flipped') && this.classList.contains('ready')) {
        // Stage 1: Flip the envelope to show the back
        this.classList.add('flipped');
        
        // Stage 2: After flip completes (1s), open the flap
        setTimeout(() => {
            this.classList.add('opened');
        }, 1000);
        
        // Save that envelope has been opened
        localStorage.setItem('envelopeOpened', 'true');
        
        // Stage 3: Show main content after flap opens (total: 1s flip + 1s flap opening + 400ms delay)
        setTimeout(() => {
            mainContent.classList.add('visible');
            // Show reset button after content appears
            setTimeout(() => {
                resetButton.classList.add('show');
            }, 600);
        }, 2400);
    }
});


// Reset button to view animation again
resetButton.addEventListener('click', function() {
    localStorage.removeItem('envelopeOpened');
    location.reload();
});