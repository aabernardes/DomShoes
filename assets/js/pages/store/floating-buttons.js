// === Floating Buttons Functionality ===

import { qs, on, scrollToTop } from '../../modules/utils.js';

export function setupFloatingButtons() {
    const backToTopButton = qs('#back-to-top');
    // WhatsApp button is likely just a link, no specific JS needed unless tracking clicks etc.

    if (!backToTopButton) {
        // console.log("Back to top button not found.");
        return;
    }

    const scrollThreshold = 300; // Pixels from top before showing the button

    const toggleVisibility = () => {
        if (window.scrollY > scrollThreshold) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    };

    // Check visibility on scroll
    on(window, 'scroll', toggleVisibility);

    // Check visibility on load (in case page loads already scrolled down)
    toggleVisibility();

    // Add click listener to scroll to top
    on(backToTopButton, 'click', (e) => {
        e.preventDefault();
        scrollToTop();
    });

    console.log("Floating buttons setup complete.");
}

// --- Initialization ---
// This should be called from global.js or the main page script
// document.addEventListener('DOMContentLoaded', setupFloatingButtons);
