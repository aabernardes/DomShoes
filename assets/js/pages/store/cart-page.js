import { qs, on, formatCurrency, createElement, showToast, qsa } from '../../modules/utils.js';
import { getCart, removeFromCart, updateCartItemQuantity, clearCart, getCartTotal, getCartItemCount } from '../../modules/cart.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log("Cart page JS loaded.");

    const cartItemsList = qs('#cart-items-list');
    const emptyCartMessage = qs('#empty-cart-message');
    const cartSummaryContainer = qs('#cart-summary-container');

    const checkoutButton = qs('#checkout-button');

    if (!cartItemsList || !emptyCartMessage || !cartSummaryContainer || !checkoutButton) {
        console.error('One or more cart page elements not found.');
        return showToast('Erro ao carregar o carrinho.', 'error');
    }

    const loadingIndicator = qs('#cart-content').querySelector('p');

    console.log("Cart elements found in the DOM");
    const clearCartButton = qs('#clear-cart-button'); // Assuming you add this button
    if (clearCartButton) {
        console.log("Setting up listener for clear cart button.");
        on(clearCartButton, 'click', () => {
            if(confirm('Tem certeza que deseja esvaziar o carrinho?')) {
                console.log("Clearing cart...");
                clearCart();
                displayCartItems();
                displayCartSummary(); // Re-render to show empty state
            }
        });
    } else {
       console.log("Clear cart button not found.");
    } 

     window.addEventListener('itemAdded', () => { displayCartItems(); displayCartSummary()});
     // Event listeners to update the cart
    window.addEventListener('cartUpdated', () => { displayCartItems(); displayCartSummary()});
    displayCartItems();
    if (loadingIndicator) loadingIndicator.style.display = 'none';
    displayCartSummary();

    on(cartItemsList, 'click', '.btn-remove-item', handleRemoveItem);
    on(cartItemsList, 'click', '.btn-quantity-change', handleQuantityChange);

});

function displayCartItems() {
    const cartItemsList = qs('#cart-items-list');
    const emptyCartMessage = qs('#empty-cart-message');
    const cartContent = qs('#cart-content');
    if (!cartItemsList || !emptyCartMessage || !cartContent) {
        console.error("displayCartItems: One or more cart elements not found."); 
        return;
    }
    console.log("displayCartItems: Function called");

    cartItemsList.innerHTML = '';

    const cart = getCart();
    console.log("displayCartItems: Cart data:", cart);

     if (getCartItemCount(cart) === 0) {
        emptyCartMessage.style.display = 'block';
         cartContent.style.display = 'none';
    } else {
        emptyCartMessage.style.display = 'none';
        cartContent.style.display = 'block';

        Object.keys(cart).forEach(productId => {
             const item = cart[productId];
            cartItemsList.appendChild(createCartItemElement({ ...item, productId: parseInt(productId, 10) }));
        });
    }

}


function displayCartSummary() {
    const cartSummaryContainer = qs('#cart-summary-container');
    const checkoutButton = qs('#checkout-button');
    const cart = getCart();
    console.log("displayCartSummary: Cart data:", cart);

    if (!cartSummaryContainer || !checkoutButton) return;

    if (getCartItemCount(cart) === 0) {
        cartSummaryContainer.style.display = 'none';
        checkoutButton.classList.add('disabled');
         checkoutButton.disabled = true;
         checkoutButton.setAttribute('aria-disabled', 'true');
    } else {
        cartSummaryContainer.style.display = 'block';
         checkoutButton.classList.remove('disabled');
          checkoutButton.disabled = false;
         checkoutButton.removeAttribute('aria-disabled');
        const total = getCartTotal();

        cartSummaryContainer.innerHTML = `
            <h3>Resumo do Pedido</h3>
            <div class="summary-row">
                <span>Subtotal:</span>
                <span id="summary-subtotal">${formatCurrency(total)}</span>
            </div>
        `;
    }
}


function createCartItemElement(item) {
    const subtotal = item.price * item.quantity;

    const itemElement = createElement('div', { class: 'cart-item', 'data-product-id': item.productId });
    // Image
    const imageContainer = createElement('div', { class: 'cart-item-image' });
    imageContainer.appendChild(   
        createElement('img', { src: item.image, alt: item.name })
        );


    // Details
    const detailsDiv = createElement('div', { class: 'cart-item-details' });
    detailsDiv.appendChild(createElement('div', { class: 'cart-item-name' },
         createElement('a', {href: `/store/product-detail.html?id=${item.productId}`, text: item.name})
    ).textContent = item.name);
     // Optional: Add options like size/color if stored in cart item
    // detailsDiv.appendChild(createElement('div', { class: 'cart-item-options', text: `Tamanho: M` }));
     detailsDiv.appendChild(createElement('div', { class: 'cart-item-price mobile-only', text: `Unit: ${formatCurrency(item.price)}` })); // Show unit price on mobile maybe
    itemElement.appendChild(detailsDiv);

    // Unit Price (Desktop)
    itemElement.appendChild(createElement('div', { class: 'cart-item-price desktop-only' }, formatCurrency(item.price)));

    // Quantity Selector
    const quantityDiv = createElement('div', { class: 'cart-item-quantity' });
    const quantitySelector = createElement('div', { class: 'quantity-selector' });
    quantitySelector.appendChild(createElement('button', { class: 'btn-quantity-change btn-minus', 'aria-label': 'Diminuir quantidade', 'data-action': 'decrease' }, '-'));
    quantitySelector.appendChild(createElement('input', { type: 'number', value: item.quantity, min: '1', 'aria-label': 'Quantidade', class: 'quantity-input', readonly: true })); // Readonly preferred with buttons
    quantitySelector.appendChild(createElement('button', { class: 'btn-quantity-change btn-plus', 'aria-label': 'Aumentar quantidade', 'data-action': 'increase' }, '+'));
    quantityDiv.appendChild(quantitySelector);
    itemElement.appendChild(quantityDiv);

    // Subtotal
    itemElement.appendChild(createElement('div', { class: 'cart-item-subtotal' }, formatCurrency(subtotal)));

    // Remove Button
    const removeDiv = createElement('div', { class: 'cart-item-remove' });
    const removeButton = createElement('button', { class: 'btn-remove-item', 'aria-label': 'Remover item' });
    removeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
            <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
          </svg>`;
        removeDiv.appendChild(removeButton);
        itemElement.insertBefore(imageContainer, itemElement.firstChild);
    itemElement.appendChild(removeDiv);


    // Add specific classes for desktop/mobile visibility if needed based on cart.css
    // Debounce resize checks if performance is an issue
    const updateVisibility = () => {
         qsa('.desktop-only', itemElement).forEach(el => el.style.display = window.innerWidth <= 768 ? 'none' : '');
         qsa('.mobile-only', itemElement).forEach(el => el.style.display = window.innerWidth > 768 ? 'none' : '');
    }
   updateVisibility(); // Initial check
    // window.addEventListener('resize', debounce(updateVisibility, 100));


    return itemElement;
}

function handleRemoveItem(event) {
    const button = event.target.closest('.btn-remove-item');
    if (!button) return;
    console.log("handleRemoveItem: Remove button clicked.");


    const itemElement = button.closest('.cart-item');
    if (!itemElement) {
        console.error("handleRemoveItem: Could not find parent .cart-item");
        return;
    }
    const productId = itemElement.dataset.productId;
    const productNameElement = itemElement.querySelector('.cart-item-name a');
    const productName = productNameElement ? productNameElement.textContent.trim() : 'este item';

    if (!productId) {
        console.error("handleRemoveItem: Could not find product ID in data attribute");
        return;
    }

    // Optional: Confirmation dialog
    if (confirm(`Tem certeza que deseja remover "${productName}" do carrinho?`)) {
        console.log(`handleRemoveItem: Removing product ${productId}.`);
        removeFromCart(productId);
        displayCartItems();
         displayCartSummary(); // Re-render the cart
    } else {
        console.log("handleRemoveItem: Removal cancelled by user.");
    }
}

function handleQuantityChange(event) {
    const button = event.target.closest('.btn-quantity-change');
    if (!button) return;
    console.log("handleQuantityChange: Button clicked:", button.dataset.action);

    const action = button.dataset.action;
    const itemElement = button.closest('.cart-item');
    if (!itemElement) {
        console.error("handleQuantityChange: Could not find parent .cart-item");
        return;
    }
    const productId = itemElement.dataset.productId;
    const quantityInput = qs('.quantity-input', itemElement);
    if (!quantityInput) {
        console.error("handleQuantityChange: Could not find .quantity-input");
        return;
    }
    if (!productId) {
         console.error("handleQuantityChange: Could not find product ID in data attribute");
        return;
    }

    let currentQuantity = parseInt(quantityInput.value, 10);
    let newQuantity;

    if (action === 'increase') {
        newQuantity = currentQuantity + 1;
    } else if (action === 'decrease') {
        newQuantity = currentQuantity - 1;
    } else {
        return; // Should not happen
    }

    console.log(`handleQuantityChange: Product ID: ${productId}, Action: ${action}, Current Qty: ${currentQuantity}, New Qty: ${newQuantity}`);


    if (newQuantity >= 1) {
        updateCartItemQuantity(productId, newQuantity);
        displayCartItems();
         displayCartSummary();
    } else if (newQuantity === 0 && action === 'decrease') {
        // Confirm removal if quantity becomes 0 via '-' button
        const productNameElement = itemElement.querySelector('.cart-item-name a');
        const productName = productNameElement ? productNameElement.textContent.trim() : 'este item';
        if (confirm(`Remover ${productName} do carrinho?`)) {
             console.log(`handleQuantityChange: Removing product ${productId} due to zero quantity.`);
             removeFromCart(productId);
             displayCartItems();
             displayCartSummary();
        } else {
            console.log("handleQuantityChange: Removal cancelled by user.");
        }
    }
}