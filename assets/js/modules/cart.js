// === Cart Module (using localStorage) ===

const CART_STORAGE_KEY = 'domShoesCart';

/**
 * Retrieves the current cart items from localStorage.
 * @returns {Array<object>} Array of cart items [{ productId, name, price, image, quantity }].
 */
export const getCartItems = () => {
    const cartJson = localStorage.getItem(CART_STORAGE_KEY);
    try {
        return cartJson ? JSON.parse(cartJson) : [];
    } catch (e) {
        console.error("Error parsing cart JSON from localStorage:", e);
        return []; // Return empty array on error
    }
};

/**
 * Saves the entire cart array to localStorage.
 * @param {Array<object>} cartItems - The array of cart items to save.
 */
const saveCartItems = (cartItems) => {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
        // Dispatch a custom event to notify other parts of the app (like the header count)
        window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (e) {
        console.error("Error saving cart to localStorage:", e);
        // Optionally, notify the user if storage is full or unavailable
    }
};

/**
 * Adds a product to the cart or increments its quantity.
 * @param {object} product - The product object to add ({ id, name, price, image }).
 * @param {number} [quantity=1] - The quantity to add.
 */
export const addToCart = (product, quantity = 1) => {
    if (!product || !product.id) {
        console.error("Invalid product data provided to addToCart.");
        return;
    }
    if (quantity <= 0) return; // Don't add zero or negative quantity

    const cartItems = getCartItems();
    const existingItemIndex = cartItems.findIndex(item => item.productId === product.id);

    if (existingItemIndex > -1) {
        // Item exists, increment quantity
        cartItems[existingItemIndex].quantity += quantity;
    } else {
        // Item does not exist, add new item
        cartItems.push({
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity,
        });
    }

    saveCartItems(cartItems);
    console.log(`Added ${quantity} of product ${product.id} to cart.`);
};

/**
 * Updates the quantity of a specific item in the cart.
 * If quantity becomes 0 or less, the item is removed.
 * @param {number | string} productId - The ID of the product to update.
 * @param {number} newQuantity - The new quantity for the item.
 */
export const updateCartItemQuantity = (productId, newQuantity) => {
     const id = parseInt(productId, 10);
    if (isNaN(id)) {
        console.error("Invalid productId provided to updateCartItemQuantity.");
        return;
    }

    let cartItems = getCartItems();
    const itemIndex = cartItems.findIndex(item => item.productId === id);

    if (itemIndex > -1) {
        if (newQuantity > 0) {
            cartItems[itemIndex].quantity = newQuantity;
            console.log(`Updated quantity for product ${id} to ${newQuantity}.`);
        } else {
            // Remove item if quantity is zero or less
            cartItems.splice(itemIndex, 1);
            console.log(`Removed product ${id} from cart due to zero quantity.`);
        }
        saveCartItems(cartItems);
    } else {
        console.warn(`Product ${id} not found in cart for quantity update.`);
    }
};

/**
 * Removes an item completely from the cart.
 * @param {number | string} productId - The ID of the product to remove.
 */
export const removeFromCart = (productId) => {
    const id = parseInt(productId, 10);
     if (isNaN(id)) {
        console.error("Invalid productId provided to removeFromCart.");
        return;
    }

    let cartItems = getCartItems();
    const initialLength = cartItems.length;
    cartItems = cartItems.filter(item => item.productId !== id);

    if (cartItems.length < initialLength) {
        saveCartItems(cartItems);
        console.log(`Removed product ${id} from cart.`);
    } else {
         console.warn(`Product ${id} not found in cart for removal.`);
    }
};

/**
 * Calculates the total number of items in the cart.
 * @returns {number} The total count of all items (sum of quantities).
 */
export const getCartItemCount = () => {
    const cartItems = getCartItems();
    return cartItems.reduce((total, item) => total + item.quantity, 0);
};

/**
 * Calculates the total price of all items in the cart.
 * @returns {number} The total price.
 */
export const getCartTotal = () => {
    const cartItems = getCartItems();
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
};

/**
 * Clears the entire cart from localStorage.
 */
export const clearCart = () => {
    localStorage.removeItem(CART_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('cartUpdated')); // Notify update
    console.log("Cart cleared.");
};

// --- Example Usage (can be removed or commented out) ---
/*
// Add items
addToCart({ id: 1, name: "Shoe A", price: 100, image: "img_a.jpg" });
addToCart({ id: 2, name: "Shoe B", price: 150, image: "img_b.jpg" }, 2);
addToCart({ id: 1, name: "Shoe A", price: 100, image: "img_a.jpg" }); // Increment quantity

// Update quantity
updateCartItemQuantity(2, 1); // Decrease Shoe B quantity
updateCartItemQuantity(1, 5); // Increase Shoe A quantity

// Remove item
removeFromCart(2);

// Get info
console.log("Cart Items:", getCartItems());
console.log("Total Items:", getCartItemCount());
console.log("Cart Total:", getCartTotal());

// Clear cart
// clearCart();
// console.log("Cart after clearing:", getCartItems());
*/
