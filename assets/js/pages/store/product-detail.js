import { qs, on, getUrlParameter, formatCurrency, showToast, createElement } from '../../modules/utils.js';
import { getProductById /*, getProductReviews */ } from '../../modules/api.js'; // getProductReviews is commented out as it's not used in this basic example
import { addToCart } from '../../modules/cart.js';

document.addEventListener('DOMContentLoaded', async () => {
    const productId = getUrlParameter('id');
    const mainContentContainer = qs('main .container'); // Query the main container for placing content

    // Use a more specific container for product details if it exists in HTML
    const productDetailSection = qs('.product-detail-container');

    if (!productId) {
        // Handle error: No product ID provided
        if (mainContentContainer) {
            mainContentContainer.innerHTML = '<p class="alert alert-danger margin-top-lg">Produto não encontrado. ID inválido.</p>';
        }
        console.error("Product ID not found in URL.");
        showToast('Erro: ID do produto não fornecido.', 'error');
        return;
    }

    // --- Loading Indicator ---
    const loadingIndicator = createElement('p', {class: 'loading-indicator margin-top-lg text-center', textContent: 'Carregando detalhes do produto...'});
    if (mainContentContainer) mainContentContainer.appendChild(loadingIndicator);


    // --- Fetch Product Data ---
    try {
        const product = await getProductById(productId); // Assuming this fetches all product data

        if (loadingIndicator) loadingIndicator.remove();

        if (!product) {
            // Handle error: Product not found
             if (mainContentContainer) {
                 mainContentContainer.innerHTML = `<p class="alert alert-warning margin-top-lg">Produto com ID ${productId} não encontrado.</p>`;
             }
             console.error(`Product with ID ${productId} not found.`);
             showToast('Produto não encontrado.', 'warning');
             return;
        }

        // --- Render Product Details into the existing HTML structure ---
        // We assume the main HTML structure exists and we populate its elements
        populateProductDetails(product);


        // --- Query elements NOW that they are in the HTML ---
        const quantityInput = qs('#product-quantity'); // Use the correct ID from our HTML structure
        const addToCartButton = qs('#add-to-cart-btn'); // Use the correct ID
        const btnMinus = qs('.quantity-selector .btn-minus');
        const btnPlus = qs('.quantity-selector .btn-plus');
        const mainProductImage = qs('#main-product-image');
        const thumbnailContainer = qs('.product-gallery .thumbnails');

        // --- Setup Gallery (if thumbnails exist) ---
        if (thumbnailContainer && product.images && product.images.length > 1) {
            renderThumbnails(product.images, mainProductImage, thumbnailContainer);
        } else if (thumbnailContainer) {
             // Remove thumbnail container if only one image or none
             thumbnailContainer.remove();
        }


        // --- Event Listeners ---
        if (btnMinus && btnPlus && quantityInput) {
            setupQuantityControls(btnMinus, btnPlus, quantityInput);
        }

        if (addToCartButton && quantityInput) {
            on(addToCartButton, 'click', () => {
                const quantity = parseInt(quantityInput.value, 10) || 1;
                // You might need to get selected options (size, color) here too
                // const selectedSize = qs('#size-select').value; // Example for getting option

                if (quantity > 0) {
                    // Pass product and quantity (and options if applicable) to cart module
                    addToCart(product, quantity);
                    // Show feedback to user
                     showToast(`${quantity}x ${product.name} adicionado ao carrinho!`, 'success');
                } else {
                     showToast('Por favor, insira uma quantidade válida.', 'error');
                }
            });
        }

         console.log("Product detail page loaded for:", product.name);

         // --- Optional: Load Reviews ---
         // You would typically fetch reviews separately or ensure they are in the product object
         // renderReviews(product.reviews); // Need a function to render reviews

    } catch (error) {
        if (loadingIndicator) loadingIndicator.remove();
         if (mainContentContainer) {
            mainContentContainer.innerHTML = '<p class="alert alert-danger margin-top-lg">Erro ao carregar os detalhes do produto. Tente novamente mais tarde.</p>';
         }
        console.error("Error fetching product details:", error);
        showToast('Erro ao carregar o produto.', 'error');
    }
});

/**
 * Populates the existing HTML structure with product data.
 * Assumes the structure from the HTML file is already present.
 * @param {object} product - The product data object.
 */
function populateProductDetails(product) {
    // Get elements by their IDs or classes assuming they exist in the HTML
    const productTitleEl = qs('#product-title');
    const mainProductImageEl = qs('#main-product-image');
    const productBrandEl = qs('#product-brand');
    const productCategoryEl = qs('#product-category');
    const reviewCountEl = qs('#review-count');
    const retailPriceEl = qs('#retail-price');
    const wholesalePriceEl = qs('#wholesale-price'); // Element for wholesale price
    const minQuantityEl = qs('#min-quantity'); // Element for min quantity
    const productDescriptionContentEl = qs('#product-description-content'); // Container for description/details
    const productReviewsListEl = qs('#product-reviews-list'); // Container for reviews list
    const productOptionsContainer = qs('.product-options'); // Container for options


    // Populate basic info
    if (productTitleEl) productTitleEl.textContent = product.name;
    if (mainProductImageEl && product.images && product.images.length > 0) {
         mainProductImageEl.src = product.images[0]; // Use the first image as main
         mainProductImageEl.alt = product.name; // Set alt text
    } else if (mainProductImageEl) {
        // Handle case with no images, maybe set a placeholder
        mainProductImageEl.src = '../assets/images/placeholder-product.png';
        mainProductImageEl.alt = 'Imagem indisponível';
    }

    if (productBrandEl) productBrandEl.textContent = product.brand || 'N/A'; // Assuming product has brand property
    if (productCategoryEl) productCategoryEl.textContent = product.category || 'N/A'; // Assuming product has category property
    if (reviewCountEl) reviewCountEl.textContent = product.reviewCount || 0; // Assuming product has reviewCount

    // Populate Pricing
    if (retailPriceEl) retailPriceEl.textContent = formatCurrency(product.retailPrice || product.price || 0); // Use retailPrice if available, fallback to price
    if (wholesalePriceEl && product.wholesalePrice) {
        wholesalePriceEl.textContent = formatCurrency(product.wholesalePrice);
         // Show the wholesale price container if data exists (assuming it's hidden by default CSS)
        const wholesalePriceContainer = wholesalePriceEl.closest('.price-wholesale');
        if(wholesalePriceContainer) wholesalePriceContainer.style.display = ''; // Or 'block', 'flex' depending on layout
    }
    if (minQuantityEl && product.minQuantity) { // Assuming product has minQuantity
        minQuantityEl.textContent = product.minQuantity;
    }


    // Populate Description/Details
    if (productDescriptionContentEl) {
         // Assuming product.description is HTML or text
         productDescriptionContentEl.innerHTML = product.description || '<p>Descrição não disponível.</p>';
         // If product.details is an array, you could iterate and add them here
    }

    // Populate Product Options (Size, Color etc.)
    if (productOptionsContainer && product.options && product.options.length > 0) {
         productOptionsContainer.innerHTML = ''; // Clear loading text
         product.options.forEach(option => {
             const optionGroup = createElement('div', {class: 'form-group'});
             const label = createElement('label', {
                 htmlFor: `${option.name.toLowerCase()}-select`,
                 textContent: `${option.name}:`
             });
             const select = createElement('select', {
                 id: `${option.name.toLowerCase()}-select`,
                 class: 'form-control'
             });

             createElement('option', { value: '', textContent: `Selecione um ${option.name.toLowerCase()}` }, select); // Default option

             if (option.values && option.values.length > 0) {
                 option.values.forEach(value => {
                     createElement('option', { value: value, textContent: value }, select);
                 });
             }
             optionGroup.appendChild(label);
             optionGroup.appendChild(select);
             productOptionsContainer.appendChild(optionGroup);
         });
    } else if (productOptionsContainer) {
        // Remove options container if no options
        productOptionsContainer.remove();
    }


    // Note: Rendering Reviews and Related Products would require additional functions
    // renderReviews(product.reviews); // Assuming product.reviews exists
    // renderRelatedProducts(product.relatedProducts); // Assuming product.relatedProducts exists
}


/**
 * Renders thumbnail images and sets up click handlers.
 * @param {string[]} images - Array of image URLs.
 * @param {HTMLImageElement} mainImageEl - The main image element.
 * @param {HTMLElement} thumbnailContainer - The container for thumbnails.
 */
function renderThumbnails(images, mainImageEl, thumbnailContainer) {
    thumbnailContainer.innerHTML = ''; // Clear existing content
    images.forEach((imageUrl, index) => {
        const thumbnail = createElement('img', {
            src: imageUrl,
            alt: `Thumbnail ${index + 1}`,
            class: 'thumbnail',
            dataset: { imageUrl: imageUrl } // Store full image URL
        });

        if (index === 0) {
            thumbnail.classList.add('active'); // Mark first thumbnail as active
        }

        on(thumbnail, 'click', () => {
            // Change main image source
            if (mainImageEl) mainImageEl.src = imageUrl;

            // Update active class
            qs('.thumbnail.active', thumbnailContainer)?.classList.remove('active');
            thumbnail.classList.add('active');
        });

        thumbnailContainer.appendChild(thumbnail);
    });
}


/**
 * Sets up event listeners for quantity input controls (+/- buttons).
 * @param {HTMLButtonElement} btnMinus - The minus button element.
 * @param {HTMLButtonElement} btnPlus - The plus button element.
 * @param {HTMLInputElement} quantityInput - The quantity input element.
 */
function setupQuantityControls(btnMinus, btnPlus, quantityInput) {
    on(btnMinus, 'click', () => {
        let currentValue = parseInt(quantityInput.value, 10);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
        // Optional: Disable minus button if value is 1
        // if (quantityInput.value == 1) btnMinus.disabled = true;
        // btnPlus.disabled = false;
    });

    on(btnPlus, 'click', () => {
        let currentValue = parseInt(quantityInput.value, 10);
         // Optional: Add max quantity check if needed
        quantityInput.value = currentValue + 1;
        // Optional: Enable minus button if value goes above 1
        // btnMinus.disabled = false;
        // if (quantityInput.value >= maxQuantity) btnPlus.disabled = true; // If max exists
    });

    // Prevent non-numeric input and ensure min value
    on(quantityInput, 'change', () => {
        let currentValue = parseInt(quantityInput.value, 10);
        if (isNaN(currentValue) || currentValue < 1) {
            quantityInput.value = 1;
        }
         // Optional: Adjust button states based on value
        // btnMinus.disabled = quantityInput.value == 1;
        // if (maxQuantity) btnPlus.disabled = quantityInput.value >= maxQuantity;
    });
}

// Helper function (assuming it's in utils.js)
// function formatCurrency(value) {
//     return `R$ ${value.toFixed(2).replace('.', ',')}`;
// }