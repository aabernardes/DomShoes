// === Modal Functionality ===
import { qs, on } from '../../modules/utils.js';

/**
 * Sets up event listeners and functions for a modal element.
 * @param {HTMLElement} modalOverlay - The modal overlay element.
 * @param {HTMLElement} [triggerButton] - Optional button that triggers the modal opening.
 */
export function setupModal(modalOverlay, triggerButton) {
    if (!modalOverlay) {
        console.warn("Modal overlay element not found.");
        return;
    }

    const modalDialog = qs('.modal', modalOverlay); // Find the actual modal dialog inside
    const closeButton = qs('.modal-close-button', modalOverlay);

    if (!modalDialog) {
         console.warn("Modal dialog element (.modal) not found inside the overlay.");
         return;
    }

    const openModal = () => {
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
         console.log('Modal opened');
    };

    const closeModal = () => {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore background scrolling
         console.log('Modal closed');
    };

    // Open modal via trigger button
    if (triggerButton) {
        on(triggerButton, 'click', (e) => {
            e.preventDefault(); // Prevent default link behavior if it's an <a>
            openModal();
        });
    }

    // Close modal via close button
    if (closeButton) {
        on(closeButton, 'click', closeModal);
    }

    // Close modal by clicking on the overlay background
    on(modalOverlay, 'click', (event) => {
        // Check if the click target is the overlay itself, not the dialog content
        if (event.target === modalOverlay) {
            closeModal();
        }
    });

    // Close modal with the Escape key
    on(document, 'keydown', (event) => {
        if (event.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });

    console.log(`Modal setup complete for overlay:`, modalOverlay);

    // Return functions to control modal programmatically if needed
    return { openModal, closeModal };
}


/** Specific setup for the Login/Register modal */
export function setupLoginModal(modalElement, triggerElement) {
    const { openModal, closeModal } = setupModal(modalElement, triggerElement);

    const loginForm = qs('#loginForm', modalElement);
    const registerForm = qs('#registerForm', modalElement); // Assuming you might add a register form
    const switchToRegisterLink = qs('#switchToRegister', modalElement);
    const switchToLoginLink = qs('#switchToLogin', modalElement);

    // Add form submission logic if needed here or in a separate auth module

    // Logic to switch between login/register views within the modal
    if (loginForm && registerForm && switchToRegisterLink && switchToLoginLink) {
         switchToRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
        });

         switchToLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            registerForm.style.display = 'none';
            loginForm.style.display = 'block';
        });
    }

     return { openModal, closeModal };
}


// --- Example Initialization (if this file is loaded directly) ---
// document.addEventListener('DOMContentLoaded', () => {
//     const loginModal = qs('#login-modal');
//     const loginButton = qs('#login-button');
//     if (loginModal && loginButton) {
//         setupLoginModal(loginModal, loginButton);
//     }
// });
