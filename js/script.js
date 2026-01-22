const envelope = document.getElementById('envelope');
const mainContent = document.getElementById('mainContent');
const rsvpForm = document.getElementById('rsvpForm');

envelope.addEventListener('click', function() {
    envelope.classList.add('opened');
    setTimeout(() => {
        mainContent.classList.add('visible');
    }, 400);
});

rsvpForm.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for your RSVP! We\'ll send you a confirmation email soon.');
    rsvpForm.reset();
});