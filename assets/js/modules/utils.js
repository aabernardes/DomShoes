
// === Utility Functions Module ===

/**
 * Formats a number as Brazilian currency (BRL).
 * @param {number} value - The number to format.
 * @returns {string} The formatted currency string (e.g., "R$ 1.234,56").
 */
export const formatCurrency = (value) => {
    if (typeof value !== 'number' || isNaN(value)) {
         // console.warn("formatCurrency: Invalid input value:", value);
        return "R$ 0,00"; // Return default for invalid input
    }
    try {
        return value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });
    } catch (e) {
         console.error("formatCurrency: Error formatting value:", value, e);
         return "R$ ---,--"; // Return error placeholder
    }
};

/**
 * Selects a single DOM element. Short alias for document.querySelector.
 * @param {string} selector - The CSS selector.
 * @param {Document | Element} [context=document] - The context to search within.
 * @returns {Element | null} The found element or null.
 */
export const qs = (selector, context = document) => {
    if (!selector || typeof selector !== 'string') {
         console.warn("qs: Invalid selector provided:", selector);
         return null;
    }
    try {
        return context.querySelector(selector);
    } catch (e) {
         console.error(`qs: Error querying selector "${selector}":`, e);
         return null;
    }
};

/**
 * Selects multiple DOM elements. Short alias for document.querySelectorAll.
 * @param {string} selector - The CSS selector.
 * @param {Document | Element} [context=document] - The context to search within.
 * @returns {NodeListOf<Element>} A NodeList of found elements (possibly empty).
 */
export const qsa = (selector, context = document) => {
     if (!selector || typeof selector !== 'string') {
         console.warn("qsa: Invalid selector provided:", selector);
         return document.querySelectorAll(null); // Return empty NodeList
    }
    try {
        return context.querySelectorAll(selector);
    } catch (e) {
         console.error(`qsa: Error querying selector "${selector}":`, e);
         return document.querySelectorAll(null); // Return empty NodeList
    }
};

/**
 * Adds an event listener to an element. Handles delegation.
 * @param {EventTarget} target - The target element or document/window.
 * @param {string} eventType - The type of event (e.g., 'click').
 * @param {string | Function} selectorOrHandler - CSS selector for delegation OR the handler function.
 * @param {Function} [handler] - The handler function (if using delegation).
 * @param {object} [options] - Optional event listener options.
 */
export const on = (target, eventType, selectorOrHandler, handler, options = {}) => {
    if (!target || !eventType || !selectorOrHandler) {
        console.warn("on: Invalid arguments provided for event listener.", { target, eventType, selectorOrHandler });
        return;
    }

    try {
        if (typeof selectorOrHandler === 'function') {
            // No delegation
            handler = selectorOrHandler;
            target.addEventListener(eventType, handler, options);
        } else if (typeof selectorOrHandler === 'string' && typeof handler === 'function') {
            // Delegation
            target.addEventListener(eventType, (event) => {
                 try {
                    // Check if the event target or its ancestor matches the selector
                    const delegateTarget = event.target.closest(selectorOrHandler);
                    // Ensure the matched element is within the original target's subtree
                    if (delegateTarget && target.contains(delegateTarget)) {
                         handler.call(delegateTarget, event); // Set 'this' context to the matched element
                    }
                 } catch(delegationError) {
                    console.error(`on (delegation): Error in handler for event "${eventType}" on selector "${selectorOrHandler}":`, delegationError);
                 }
            }, options);
        } else {
            console.warn("on: Invalid arguments. Provide either a handler function or a selector string and handler function.", { selectorOrHandler, handler });
        }
    } catch (e) {
         console.error(`on: Error adding event listener for "${eventType}" on target:`, target, e);
    }
};


/**
 * Creates a DOM element with optional attributes and content.
 * @param {string} tag - The HTML tag name (e.g., 'div', 'button').
 * @param {object} [attributes={}] - An object of attributes { attrName: value }. Special keys: 'text' for textContent, 'html' for innerHTML, 'class' for classList.add.
 * @param {...(Node | string)} [children] - Child nodes or strings to append.
 * @returns {Element | null} The created element or null on error.
 */
export const createElement = (tag, attributes = {}, ...children) => {
    if (!tag || typeof tag !== 'string') {
        console.error("createElement: Invalid tag name provided:", tag);
        return null;
    }
    try {
        const element = document.createElement(tag);

        for (const key in attributes) {
            if (key === 'text') {
                element.textContent = attributes[key];
            } else if (key === 'html') {
                element.innerHTML = attributes[key];
            } else if (key === 'class') {
                // Ensure value is a string before splitting
                if (typeof attributes[key] === 'string') {
                    const classes = attributes[key].split(' ').filter(Boolean);
                    if(classes.length > 0) element.classList.add(...classes);
                } else {
                     console.warn(`createElement: Invalid class attribute value for tag "${tag}":`, attributes[key]);
                }
            } else if (key.startsWith('data-')) {
                 // Convert camelCase to kebab-case if necessary (though dataset handles it)
                 // const dataKey = key.substring(5).replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
                element.dataset[key.substring(5)] = attributes[key];
            } else if (key === 'style' && typeof attributes[key] === 'string') {
                element.style.cssText = attributes[key];
            }
             else {
                 // Handle boolean attributes correctly (e.g., required, disabled)
                 if (typeof attributes[key] === 'boolean') {
                     if (attributes[key]) {
                         element.setAttribute(key, ''); // Set boolean attribute if true
                     }
                 } else {
                    element.setAttribute(key, attributes[key]);
                 }
            }
        }

        children.forEach(child => {
             try {
                if (child instanceof Node) {
                    element.appendChild(child);
                } else if (typeof child === 'string' || typeof child === 'number') {
                    element.appendChild(document.createTextNode(String(child)));
                } else if (child !== null && child !== undefined) {
                     console.warn(`createElement: Invalid child type for tag "${tag}":`, child);
                }
             } catch (appendChildError) {
                  console.error(`createElement: Error appending child to tag "${tag}":`, child, appendChildError);
             }
        });

        return element;
    } catch (e) {
        console.error(`createElement: Error creating element for tag "${tag}":`, e);
        return null;
    }
};

/**
 * Debounces a function, ensuring it's only called after a certain delay
 * since the last time it was invoked.
 * @param {Function} func - The function to debounce.
 * @param {number} delay - The debounce delay in milliseconds.
 * @returns {Function} The debounced function.
 */
export const debounce = (func, delay) => {
    let timeoutId;
    return function(...args) { // Use function keyword to preserve 'this'
        const context = this;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(context, args);
        }, delay);
    };
};

/**
 * Gets a URL parameter by name.
 * @param {string} name - The name of the parameter.
 * @param {string} [url=window.location.href] - The URL to parse (defaults to current URL).
 * @returns {string | null} The parameter value or null if not found.
 */
export const getUrlParameter = (name, url = window.location.href) => {
    if (!name) return null;
    name = name.replace(/[\[\]]/g, '\\$&');
    try {
        const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
        const results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    } catch (e) {
         console.error(`getUrlParameter: Error parsing parameter "${name}" from URL "${url}":`, e);
         return null;
    }
};


/**
 * Scrolls smoothly to the top of the page.
 */
export const scrollToTop = () => {
    try {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    } catch (e) {
         console.error("scrollToTop: Error scrolling:", e);
         // Fallback for very old browsers
         window.scrollTo(0, 0);
    }
};

/**
 * Shows a simple feedback message (e.g., after adding to cart).
 * Creates a temporary element.
 * @param {string} message - The message to display.
 * @param {string} [type='success'] - The type ('success', 'error', 'info').
 * @param {number} [duration=3000] - How long the message stays visible (ms).
 */
export const showToast = (message, type = 'success', duration = 3000) => {
    console.log(`showToast: [${type}] ${message}`);
    try {
        const toast = createElement('div', {
            class: `toast-message ${type}`,
            text: message,
            role: 'alert', // Accessibility
            style: `
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background-color: ${type === 'success' ? 'var(--success-green, #4CAF50)' : type === 'error' ? 'var(--error-red, #f44336)' : 'var(--accent-blue, #3498db)'};
                color: var(--primary-white, #ffffff);
                padding: var(--spacing-sm, 8px) var(--spacing-md, 16px);
                border-radius: var(--border-radius-sm, 4px);
                box-shadow: var(--box-shadow-medium, 0 3px 6px rgba(0,0,0,0.16));
                z-index: 1100;
                opacity: 0;
                transition: opacity 0.3s ease, bottom 0.3s ease;
                max-width: 90%;
                text-align: center;
            `
        });

         if (!toast) {
             console.error("showToast: Failed to create toast element.");
             return;
         }

        document.body.appendChild(toast);

        // Animate in using requestAnimationFrame for smoother start
        requestAnimationFrame(() => {
             requestAnimationFrame(() => { // Double RAF ensures styles are applied before transition starts
                toast.style.opacity = '1';
                toast.style.bottom = '30px';
             });
        });

        // Automatically remove after duration
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.bottom = '20px';
            toast.addEventListener('transitionend', () => {
                 if (toast.parentNode) {
                     toast.remove();
                 }
            }, { once: true });
        }, duration);
    } catch (e) {
         console.error("showToast: Error displaying toast:", e);
    }
};

/**
 * Gets the current user data from localStorage (simulated).
 * @returns {object | null} User data or null if not logged in.
 */
export const getCurrentUser = () => {
    try {
        const userJson = localStorage.getItem('domShoesUser');
        return userJson ? JSON.parse(userJson) : null;
    } catch (e) {
         console.error("getCurrentUser: Error reading user data from localStorage:", e);
        return null;
    }
};

/**
 * Sets the current user data in localStorage (simulated).
 * @param {object | null} userData - User data object or null to log out.
 */
export const setCurrentUser = (userData) => {
    try {
        if (userData) {
            localStorage.setItem('domShoesUser', JSON.stringify(userData));
             console.log("setCurrentUser: User data saved.", userData);
        } else {
            localStorage.removeItem('domShoesUser');
             console.log("setCurrentUser: User data removed (logout).");
        }
         window.dispatchEvent(new CustomEvent('userAuthChanged')); // Notify header etc.
    } catch (e) {
         console.error("setCurrentUser: Error saving user data to localStorage:", e);
    }
};

/**
 * Gets the current admin login status from localStorage (simulated).
 * @returns {boolean} True if admin is logged in.
 */
export const isAdminLoggedIn = () => {
     try {
        return localStorage.getItem('domShoesAdminLoggedIn') === 'true';
    } catch (e) {
         console.error("isAdminLoggedIn: Error reading admin status from localStorage:", e);
         return false;
    }
};

/**
 * Sets the admin login status in localStorage (simulated).
 * @param {boolean} loggedIn - True if logged in, false otherwise.
 */
export const setAdminLoggedIn = (loggedIn) => {
    try {
        if (loggedIn) {
            localStorage.setItem('domShoesAdminLoggedIn', 'true');
             console.log("setAdminLoggedIn: Admin status set to logged in.");
        } else {
            localStorage.removeItem('domShoesAdminLoggedIn');
             console.log("setAdminLoggedIn: Admin status removed (logout).");
        }
        window.dispatchEvent(new CustomEvent('adminAuthChanged')); // Notify redirects etc.
    } catch (e) {
         console.error("setAdminLoggedIn: Error saving admin status to localStorage:", e);
    }
};
