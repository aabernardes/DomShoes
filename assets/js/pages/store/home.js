
import { qs, on, showToast } from '../../modules/utils.js';
import { setupHeroSlider } from './slider.js';
import { getProducts } from '../../modules/api.js';
import { renderProductCard } from './product-card.js'; // Assuming a function to render product cards

document.addEventListener('DOMContentLoaded', () => {
    console.log("Home page JS loaded.");

    // Initialize Hero Slider
    console.log("Setting up hero slider...");
    setupHeroSlider('.hero-slider');

    // Coupon Banner Interaction
    console.log("Setting up coupon banner...");
    const couponButton = qs('#coupon-button');
    const couponCodeDisplay = qs('#coupon-code'); // Assuming an element to display the code

    if (couponButton && couponCodeDisplay) {
        const couponCode = couponCodeDisplay.textContent || "DOM10"; // Get code from display or default
        console.log("Coupon code:", couponCode);

        on(couponButton, 'click', () => {
            console.log("Coupon button clicked.");
            try {
                // Attempt to copy to clipboard
                if (!navigator.clipboard) {
                    throw new Error("Clipboard API not available");
                }
                navigator.clipboard.writeText(couponCode)
                    .then(() => {
                        console.log("Coupon copied successfully.");
                        showToast(`Cupom "${couponCode}" copiado!`, 'success');
                        couponButton.textContent = 'Copiado!';
                        couponButton.disabled = true;
                         setTimeout(() => {
                             couponButton.textContent = 'Pegar Cupom';
                             couponButton.disabled = false;
                         }, 2000); // Reset after 2 seconds
                    })
                    .catch(err => {
                         console.error('Failed to copy coupon: ', err);
                         // Fallback for older browsers or if permission denied
                          showToast(`Use o cupom: ${couponCode}`, 'info', 5000);
                          couponButton.textContent = 'Use o Código!';
                           couponButton.disabled = true;
                           setTimeout(() => {
                             couponButton.textContent = 'Pegar Cupom';
                              couponButton.disabled = false;
                           }, 3000);
                    });
            } catch (err) {
                 console.error('Clipboard API error or not available:', err);
                 showToast(`Use o cupom: ${couponCode}`, 'info', 5000);
                  couponButton.textContent = 'Use o Código!';
                  couponButton.disabled = true;
                  setTimeout(() => {
                    couponButton.textContent = 'Pegar Cupom';
                     couponButton.disabled = false;
                  }, 3000);
            }
        });
    } else {
        console.warn("Coupon button or code display element not found.");
    }


    // Load Featured Products
    console.log("Loading featured products...");
    const featuredProductsContainer = qs('#featured-products .card-grid');
    if (featuredProductsContainer) {
        loadFeaturedProducts(featuredProductsContainer);
    } else {
         console.error("Featured products container (#featured-products .card-grid) not found.");
    }

});


async function loadFeaturedProducts(container) {
    console.log("loadFeaturedProducts: Starting fetch...");
    container.innerHTML = '<p>Carregando produtos...</p>'; // Loading state
    try {
        const products = await getProducts({ featured: true }); // Use simulated API
        console.log("loadFeaturedProducts: Products received:", products);

        container.innerHTML = ''; // Clear loading state

        if (products && products.length > 0) {
             console.log(`loadFeaturedProducts: Rendering ${products.length} featured products.`);
            products.forEach(product => {
                 try {
                     const productCardElement = renderProductCard(product);
                    if (productCardElement) {
                        container.appendChild(productCardElement);
                    } else {
                         console.warn("renderProductCard returned null for product:", product);
                    }
                 } catch (renderError) {
                     console.error("Error rendering product card for:", product, renderError);
                      container.appendChild(createElement('div', {class: 'product-item error-placeholder'}, 'Erro ao renderizar produto'));
                 }

            });
        } else {
            console.log("loadFeaturedProducts: No featured products found.");
            container.innerHTML = '<p>Nenhum produto em destaque encontrado.</p>';
        }
    } catch (error) {
        console.error("loadFeaturedProducts: Error fetching featured products:", error);
        container.innerHTML = '<p class="error-message">Erro ao carregar produtos. Tente novamente mais tarde.</p>';
    }
    console.log("loadFeaturedProducts: Finished.");
}
