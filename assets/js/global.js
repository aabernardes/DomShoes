
import { qs, on, getCurrentUser, setCurrentUser, createElement } from './modules/utils.js';
import { updateHeader } from './pages/store/auth.js';
import { getCartItemCount } from './modules/cart.js';
import { setupLoginModal } from './pages/store/modal.js';
import { setupFloatingButtons } from './pages/store/floating-buttons.js'; // Import necessary utils

let isInitialized = false; // Flag to prevent double initialization

document.addEventListener('DOMContentLoaded', async () => {
    if (isInitialized) {
        console.warn('Global JS already initialized. Skipping.');
        return;
    }
    isInitialized = true;
    console.log("Global JS: DOMContentLoaded fired. Initializing...");

    // --- Update Header ---
    updateHeader();
    
    //---Add cart button----
    console.log('Global JS: Adding cart button to header.');
    const headerActions = qs('.header-actions');
    if (headerActions) {
        const cartLink = createElement('a', { href: '/store/cart.html', class: 'btn btn-icon btn-cart', 'aria-label': 'Ver carrinho' });
        cartLink.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-cart" viewBox="0 0 16 16"><path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 4 0 2 2 0 0 0-4 0m7 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0"/><div id="cart-count" class="cart-count zero"></div></svg>`;

        headerActions.appendChild(cartLink);
    } else {
        console.warn('Global JS: header actions not found');
    }

    // --- Header Cart Count Update ---
     console.log("Global JS: Setting up cart count update.");
     const cartCountElement = qs('#cart-count');
     







    // --- Header Cart Count Update ---
    

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
