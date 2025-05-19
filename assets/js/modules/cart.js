// === Cart Module (using localStorage) ===

 
const CART_STORAGE_KEY = 'domShoesCart';

// Helper function to check if a product object is valid
const isValidProduct = (product) => {
    return product && typeof product === 'object' &&
        typeof product.id === 'number' && !isNaN(product.id) &&
        typeof product.name === 'string' && product.name.trim() !== '' &&
        typeof product.price === 'number' && !isNaN(product.price) &&
        product.price >= 0 &&
        typeof product.image === 'string' && product.image.trim() !== '';
};
/**
 * Retrieves the current cart items from localStorage.
 * @returns {object} Cart object with { productId: { product details, quantity } }.
 */

export const getCart = () => {
    return getCartItems();
};

const getCartItems = () => {
     console.log("getCartItems: Getting cart data...");
     const cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '{}');
     console.log("getCartItems: Cart data:", cart);
     return cart;

};

/**
 * Saves the cart object to localStorage and dispatches events.
 * @param {object} cartItems - The cart object to save.
 * @param {string} eventType - The type of event to dispatch.
 * @param {object} [detail] - Additional detail data for the event.
 */
const saveCartItems = (cartItems, eventType, detail = {}) => {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));

        // Dispatch general cart updated event
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { ...detail, cart: cartItems } }));

        // Dispatch specific event based on the action
        if (eventType) {
            window.dispatchEvent(new CustomEvent(eventType, { detail: { ...detail, cart: cartItems } }));
        }
    } catch (e) {
        console.error("Error saving cart to localStorage:", e);
        // Optionally, notify the user if storage is full or unavailable
    }
};


/**
 * Adds a product to the cart or increments its quantity.
 * @param {object} product - The product object to add.
 * @param {number} [quantity=1] - The quantity to add.
 */
export const addToCart = (product, quantity = 1) => {
    console.log("addToCart: Adding to cart:", product, quantity);
    if (!isValidProduct(product)) {
        console.error("Invalid product data provided to addToCart:", product);
        return;
    }
    if (quantity <= 0) return; // Don't add zero or negative quantity

    const cartItems = getCartItems();
    
    if (cartItems[product.id]) {
        cartItems[product.id].quantity += quantity;
    } else {
        cartItems[product.id] = { ...product, quantity: quantity };
    }
    saveCartItems(cartItems, 'itemAdded', { productId: product.id, quantity });
    console.log(`addToCart: Added ${quantity} of product ${product.id} to cart. New cart:`, cartItems);
};

/**
 * Updates the quantity of a specific item in the cart.
 * Updates the quantity of a specific item in the cart.
 * Updates the quantity of a specific item in the cart.
 * @param {number | string} productId - The ID of the product to update.
 * @param {number} newQuantity - The new quantity for the item.
 * @param {number | string} productId - The ID of the product to update.
 * @param {number | string} productId - The ID of the product to update.
 * @param {number} newQuantity - The new quantity for the item.
 */
export const updateCartItemQuantity = (productId, newQuantity) => {
    const id = parseInt(productId, 10);
    if (isNaN(id)) {
        console.error("Invalid productId provided to updateCartItemQuantity.");
        return;
    }

    const cartItems = getCartItems();
    if (cartItems[id]) {
        if (newQuantity > 0) {
            cartItems[id].quantity = newQuantity;
            saveCartItems(cartItems, 'quantityUpdated', { productId: id, quantity: newQuantity });
            console.log(`updateCartItemQuantity: Updated quantity for product ${id} to ${newQuantity}.`);
        } else {
            delete cartItems[id];
            saveCartItems(cartItems, 'itemRemoved', { productId: id });
            console.log(`updateCartItemQuantity: Removed product ${id} from cart due to zero quantity.`);
        }
    } else {
        console.warn(`Product ${id} not found in cart for quantity update.`);
    }
    console.log("updateCartItemQuantity: Updated cart:", cartItems);
};

/**
 * Removes an item completely from the cart.
 * @param {number | string} productId - The ID of the product to remove.
 */
export const removeFromCart = (productId) => {
    console.log("removeFromCart: Removing from cart:", productId);
    const id = parseInt(productId, 10);
     if (isNaN(id)) {
        console.error("Invalid productId provided to removeFromCart.");
        return;
    }

    const cartItems = getCartItems();
    if (cartItems[id]) {
        delete cartItems[id];
        saveCartItems(cartItems, 'itemRemoved', { productId: id });
        console.log(`removeFromCart: Removed product ${id} from cart. New cart:`, cartItems);
    } else {
        console.warn(`Product ${id} not found in cart for removal.`);
    }
    console.log(`Removed product ${id} from cart.`);
};

/**
 * Calculates the total number of items in the cart.
 * @returns {number} The total count of all items (sum of quantities).
 */
export const getCartItemCount = () => {
    const cart = getCartItems();
    return Object.values(cart).reduce((total, item) => total + item.quantity, 0);

};

/**
 * Calculates the total price of all items in the cart.
 * @returns {number} The total price.
 */
export const getCartTotal = () => {
    const cart = getCartItems();
    return Object.values(cart).reduce((total, item) => total + (item.price * item.quantity), 0);
};

/**
 * Clears the entire cart from localStorage.
 */
export const clearCart = () => {
    saveCartItems({}, 'cartCleared');
    console.log("Cart cleared.");
};
