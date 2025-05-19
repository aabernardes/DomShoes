
import { formatCurrency, showToast, on, createElement } from '../../modules/utils.js'; 
import { addToCart } from '../../modules/cart.js';
/**
 * Creates and returns an HTML element representing a product card.
 * @param {object} product - The product data object ({ id, name, price, image, description }).
 * @returns {HTMLElement | null} The product card element (usually a div with class 'product-item') or null if data is invalid.
 */
export function createProductCard(product) {
    // Basic validation
    if (!product || typeof product !== 'object' || !product.id || !product.name || product.price === undefined || !product.image) {
        console.error("Invalid product data provided to createProductCard:", product);
        const errorElement = createElement('div', { class: 'product-item error-placeholder' });
        errorElement.appendChild(createElement('p', { class: 'error-message' }, 'Erro ao carregar produto'));
        return errorElement; // Return a placeholder error element
        
    }
        console.log("createProductCard: Rendering product card for:", product);

    // console.log("Rendering product card for:", product.name);

    const card = createElement('div', { class: 'product-item' }); // Outer container

    const cardInner = createElement('div', { class: 'card h-100' }); // Inner card structure using card.css

    // Image link to product detail page
    const imageLink = createElement('a', { href: `/store/product-detail.html?id=${product.id}` });
    imageLink.appendChild(createElement('img', { class: 'card-image', src: product.image, alt: product.name }));
    cardInner.appendChild(imageLink);

    // Card Content
    const cardContent = createElement('div', { class: 'card-content' });

    // Title link
    const titleLink = createElement('a', { href: `/store/product-detail.html?id=${product.id}` });
    titleLink.appendChild(createElement('h3', { class: 'card-title', text: product.name }));
    cardContent.appendChild(titleLink);


    // Price
    cardContent.appendChild(createElement('p', { class: 'product-price', text: formatCurrency(product.price) }));

    // Actions (View Details button)
    const cardActions = createElement('div', { class: 'card-actions' });
    cardActions.appendChild(createElement('a', {
        href: `/store/product-detail.html?id=${product.id}`,
        class: 'btn btn-sm btn-outline-red', // Or btn-primary
        text: 'Ver Detalhes'
    }));

    // Quick Add to Cart button - Uncomment and test if needed
    const quickAddButton = createElement('button', {
        class: 'btn btn-sm btn-secondary btn-icon quick-add-button',
        dataset: { productId: product.id },
        'aria-label': 'Adicionar ao carrinho'

        
    });
    quickAddButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart-plus" viewBox="0 0 16 16"><path d="M9 5.5a.5.5 0 0 0-1 0V7H6.5a.5.5 0 0 0 0 1H8v1.5a.5.5 0 0 0 1 0V8h1.5a.5.5 0 0 0 0-1H9z"/><path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1zm3.915 10L3.102 4h10.796l-1.313 7zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0m7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/></svg>`;

    on(quickAddButton,'click',(e) =>{
        console.log(`quickAddButton: Adding ${product.name} to cart.`);
        try {
            addToCart(product, 1);
            // Optionally show feedback
           showToast(`${product.name} adicionado ao carrinho!`, 'success');
        } catch (cartError) {
            console.error("Error adding to cart via quick add:", cartError);
           showToast(`Erro ao adicionar ${product.name} ao carrinho.`, 'error');
        }
    })
    cardActions.appendChild(quickAddButton);

    cardContent.appendChild(cardActions);
    cardInner.appendChild(cardContent);
    card.appendChild(cardInner);

    return card;
}

