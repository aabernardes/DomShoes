
import { qs, on, getCurrentUser, setCurrentUser } from './modules/utils.js'; // Import necessary utils
import { getCartItemCount } from './modules/cart.js';
import { setupLoginModal } from './pages/store/modal.js';
import { setupFloatingButtons } from './pages/store/floating-buttons.js';

let isInitialized = false; // Flag to prevent double initialization

document.addEventListener('DOMContentLoaded', () => {
    if (isInitialized) {
        console.warn("Global JS already initialized. Skipping.");
        return;
    }
    isInitialized = true;
    console.log("Global JS: DOMContentLoaded fired. Initializing...");

    // --- Header Cart Count Update ---
    console.log("Global JS: Setting up cart count update.");
    const cartCountElement = qs('#cart-count');

    const updateCartCount = () => {
        if (cartCountElement) {
            try {
                const count = getCartItemCount();
                cartCountElement.textContent = count > 0 ? count : '';
                cartCountElement.classList.toggle('zero', count === 0);
                 // console.log("Global JS: Cart count updated in header:", count);
            } catch (e) {
                 console.error("Global JS: Error updating cart count:", e);
            }
        } else {
            // console.warn("Global JS: Cart count element (#cart-count) not found.");
        }
    };

    // Initial update
    updateCartCount();

    // Listen for custom 'cartUpdated' event dispatched by cart.js
    window.addEventListener('cartUpdated', () => {
        console.log("Global JS: Received 'cartUpdated' event.");
        updateCartCount();
    });

    // --- Header Login/Profile Button & Modal ---
    console.log("Global JS: Setting up header buttons and modal...");
    const loginButton = qs('#login-button'); // Button in header that opens modal
    const profileLink = qs('#profile-link'); // Link shown when logged in (e.g., on profile.html)
    const loginModalElement = qs('#login-modal'); // The modal overlay itself
    const user = getCurrentUser();

     // Update header buttons based on login status
     if (user) {
         console.log("Global JS: User is logged in.", user);
         if(loginButton) loginButton.style.display = 'none'; // Hide Login button
         if(profileLink) profileLink.style.display = 'inline-block'; // Show Profile link
          // If there's a logout button specific to the header, handle it here
         // const headerLogoutButton = qs('#header-logout-button');
         // if(headerLogoutButton) { ... add logout logic ... }
     } else {
         console.log("Global JS: User is not logged in.");
         if(loginButton) loginButton.style.display = 'inline-block'; // Show Login button
         if(profileLink) profileLink.style.display = 'none'; // Hide Profile link
     }

    // Setup modal trigger only if the modal and button exist
    if (loginButton && loginModalElement) {
        console.log("Global JS: Found login button and modal, setting up modal trigger.");
        setupLoginModal(loginModalElement, loginButton);
    } else {
        if (!loginButton) console.log("Global JS: Login button (#login-button) not found.");
        if (!loginModalElement) console.log("Global JS: Login modal (#login-modal) not found.");
    }

    // Listen for auth changes to update header buttons
    window.addEventListener('userAuthChanged', () => {
        console.log("Global JS: Received 'userAuthChanged' event.");
         const updatedUser = getCurrentUser();
         if (updatedUser) {
             if(loginButton) loginButton.style.display = 'none';
             if(profileLink) profileLink.style.display = 'inline-block';
         } else {
             if(loginButton) loginButton.style.display = 'inline-block';
             if(profileLink) profileLink.style.display = 'none';
         }
    });


    // --- Responsive Header Class ---
    // Add class to body if header search bar wraps (Can be removed if not used)
    /*
    console.log("Global JS: Setting up responsive header check.");
    const header = qs('#main-header');
    const checkHeaderWrap = () => {
        if (!header) return;
        // ... (rest of the wrap check logic)
    };
     checkHeaderWrap();
     window.addEventListener('resize', checkHeaderWrap);
     */


    // --- Setup Floating Buttons (Back to Top / WhatsApp) ---
    console.log("Global JS: Setting up floating buttons.");
    setupFloatingButtons();

     // --- Simple Search Bar Simulation ---
     console.log("Global JS: Setting up search form.");
     const searchForm = qs('#search-form');
     const searchInput = qs('#search-input');
     if(searchForm && searchInput) {
        on(searchForm, 'submit', (e) => {
            e.preventDefault();
            const searchTerm = searchInput.value.trim();
             console.log("Global JS: Search submitted with term:", searchTerm);
            if(searchTerm) {
                // Redirect to category/search results page
                window.location.href = `/store/category.html?search=${encodeURIComponent(searchTerm)}`;
            } else {
                console.log("Global JS: Search term is empty, not redirecting.");
            }
        });
     } else {
        console.warn("Global JS: Search form or input not found.");
     }


    // Add more global initializations here if needed

     console.log("Global JS: Initialization complete.");
});
