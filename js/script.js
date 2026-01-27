const envelope = document.getElementById('envelope');
const mainContent = document.getElementById('mainContent');
const rsvpForm = document.getElementById('rsvpForm');
const hero = document.querySelector('.hero');
const resetButton = document.getElementById('resetButton');
const flowersContainer = document.querySelector('.flowers-container');
const flower1Container = document.querySelector('.flower-1-container');
const saveTheDateContainer = document.querySelector('.save-the-date-container');
const additionalImagesContainer = document.querySelector('.additional-images-container');

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
        }, 7000); // 5500ms (flowers appear) + 1500ms (flower fade-in animation completes)
    }
});

resetButton.addEventListener('click', function () {
    localStorage.removeItem('envelopeOpened');
    location.reload();
});