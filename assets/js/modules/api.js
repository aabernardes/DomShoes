// === Simulated API Module ===
// This module simulates network requests and returns mock data.

const MOCK_DELAY = 500; // Simulate network latency (in milliseconds)

// --- Mock Data ---

const mockProducts = [
    { id: 1, name: "DomRunner Pro", description: "Tênis de corrida leve e responsivo.", price: 499.90, category: "Corrida", image: "assets/images/products/placeholder-shoe-1.png", featured: true },
    { id: 2, name: "DomCasual Comfort", description: "Estilo casual para o dia a dia com máximo conforto.", price: 349.90, category: "Casual", image: "assets/images/products/placeholder-shoe-2.png", featured: true },
    { id: 3, name: "DomTrail Explorer", description: "Encare trilhas com segurança e aderência.", price: 599.90, category: "Trilha", image: "assets/images/products/placeholder-shoe-3.png", featured: false },
    { id: 4, name: "DomSkate Classic", description: "Design clássico para skatistas.", price: 299.90, category: "Skate", image: "assets/images/products/placeholder-shoe-4.png", featured: true },
    { id: 5, name: "DomFit Trainer", description: "Versatilidade para seus treinos na academia.", price: 399.90, category: "Treino", image: "assets/images/products/placeholder-shoe-5.png", featured: false },
    { id: 6, name: "DomRunner Lite", description: "Modelo básico para corridas leves e caminhadas.", price: 249.90, category: "Corrida", image: "assets/images/products/placeholder-shoe-6.png", featured: true },
    { id: 7, name: "DomElegance Social", description: "Sapato social com conforto Dom.", price: 459.90, category: "Social", image: "assets/images/products/placeholder-shoe-7.png", featured: false },
    { id: 8, name: "DomAdventure Boot", description: "Bota resistente para aventuras.", price: 699.90, category: "Trilha", image: "assets/images/products/placeholder-shoe-8.png", featured: false },
];

const mockCategories = ["Corrida", "Casual", "Trilha", "Skate", "Treino", "Social"];

const mockOrders = [
    { id: 101, date: "2024-07-20", total: 849.80, status: "Entregue", items: [{ productId: 1, quantity: 1 }, { productId: 2, quantity: 1 }] },
    { id: 102, date: "2024-07-22", total: 299.90, status: "Enviado", items: [{ productId: 4, quantity: 1 }] },
    { id: 103, date: "2024-07-25", total: 699.80, status: "Processando", items: [{ productId: 2, quantity: 2 }] },
];

const mockSales = mockOrders.map(order => ({ // Simplified for admin view
    id: order.id,
    date: order.date,
    customerName: `Cliente ${order.id}`, // Simulate customer names
    total: order.total,
    status: order.status,
}));

const mockDashboardData = {
    totalSales: 1849.50,
    newOrders: 1,
    pendingOrders: 1,
    totalProducts: mockProducts.length,
    popularProducts: [
        { id: 2, name: "DomCasual Comfort", salesCount: 3 },
        { id: 1, name: "DomRunner Pro", salesCount: 1 },
        { id: 4, name: "DomSkate Classic", salesCount: 1 },
    ],
    recentActivity: [
        { type: 'order', description: 'Novo pedido #103 recebido', time: 'Há 2 horas' },
        { type: 'product', description: 'Produto "DomRunner Lite" atualizado', time: 'Ontem' },
        { type: 'login', description: 'Login de admin bem-sucedido', time: 'Ontem' },
    ]
};

let mockSiteCustomization = {
    heroBannerText: "Super Promoção DomShoes!",
    heroBannerImage: "assets/images/banners/banner-placeholder-1.jpg",
    activeCouponCode: "DOM10",
    couponDiscount: 10, // Percentage
};

// --- Simulated API Functions ---

/**
 * Simulates fetching all products or filtering by category/search term.
 * @param {object} [filters] - Optional filters.
 * @param {string} [filters.category] - Category to filter by.
 * @param {string} [filters.search] - Search term.
 * @param {boolean} [filters.featured] - Filter featured products.
 * @returns {Promise<Array<object>>} Promise resolving with product data.
 */
export const getProducts = (filters = {}) => {
    console.log('API Call: getProducts', filters);
    return new Promise((resolve) => {
        setTimeout(() => {
            let results = [...mockProducts]; // Copy mock data
            if (filters.category) {
                results = results.filter(p => p.category.toLowerCase() === filters.category.toLowerCase());
            }
            if (filters.search) {
                const searchTerm = filters.search.toLowerCase();
                results = results.filter(p =>
                    p.name.toLowerCase().includes(searchTerm) ||
                    p.description.toLowerCase().includes(searchTerm)
                );
            }
            if (filters.featured) {
                results = results.filter(p => p.featured);
            }
            resolve(results);
        }, MOCK_DELAY);
    });
};

/**
 * Simulates fetching a single product by ID.
 * @param {number | string} productId - The ID of the product.
 * @returns {Promise<object|null>} Promise resolving with product data or null if not found.
 */
export const getProductById = (productId) => {
     console.log('API Call: getProductById', productId);
     const id = parseInt(productId, 10); // Ensure ID is a number
    return new Promise((resolve) => {
        setTimeout(() => {
            const product = mockProducts.find(p => p.id === id) || null;
            resolve(product);
        }, MOCK_DELAY / 2); // Faster for single item fetch
    });
};

/**
 * Simulates fetching product categories.
 * @returns {Promise<Array<string>>} Promise resolving with category names.
 */
export const getCategories = () => {
     console.log('API Call: getCategories');
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([...mockCategories]); // Return a copy
        }, MOCK_DELAY / 3);
    });
};

/**
 * Simulates submitting an order.
 * @param {object} orderData - Order details (customer info, items).
 * @returns {Promise<object>} Promise resolving with order confirmation.
 */
export const submitOrder = (orderData) => {
     console.log('API Call: submitOrder', orderData);
    return new Promise((resolve) => {
        setTimeout(() => {
            const newOrderId = Math.max(...mockOrders.map(o => o.id)) + 1;
             const confirmation = {
                success: true,
                orderId: newOrderId,
                message: `Pedido #${newOrderId} confirmado com sucesso!`,
                estimatedDelivery: "3-5 dias úteis"
            };
            // Optionally, add to mockOrders (though it won't persist)
            console.log("Simulating order persistence:", confirmation);
            resolve(confirmation);
        }, MOCK_DELAY * 1.5); // Longer delay for submission
    });
};

/**
 * Simulates user login.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object>} Promise resolving with login status and user info.
 */
export const loginUser = (email, password) => {
    console.log('API Call: loginUser', email);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (email === "user@domshoes.com" && password === "password") {
                resolve({
                    success: true,
                    user: { name: "Usuário Dom", email: "user@domshoes.com" },
                    message: "Login bem-sucedido!"
                });
            } else {
                 reject({ success: false, message: "Email ou senha inválidos." });
            }
        }, MOCK_DELAY);
    });
};

/**
 * Simulates user registration.
 * @param {object} userData - User details (name, email, password).
 * @returns {Promise<object>} Promise resolving with registration status.
 */
export const registerUser = (userData) => {
    console.log('API Call: registerUser', userData.email);
    return new Promise((resolve, reject) => {
         setTimeout(() => {
            // Simulate check if email exists (always succeed for now)
            if (userData.email && userData.name && userData.password) {
                 resolve({
                    success: true,
                    user: { name: userData.name, email: userData.email },
                    message: "Registro realizado com sucesso! Faça o login."
                });
            } else {
                 reject({ success: false, message: "Erro no registro. Verifique os dados." });
            }

        }, MOCK_DELAY);
    });
};


/**
 * Simulates fetching user order history.
 * @param {string} userId - ID or token of the logged-in user (ignored in mock).
 * @returns {Promise<Array<object>>} Promise resolving with order history.
 */
export const getOrderHistory = (userId) => {
    console.log('API Call: getOrderHistory for user', userId);
     return new Promise((resolve) => {
        setTimeout(() => {
            // Resolve with a copy, potentially mapping product names
            const historyWithProductNames = mockOrders.map(order => ({
                ...order,
                items: order.items.map(item => {
                    const product = mockProducts.find(p => p.id === item.productId);
                    return { ...item, productName: product ? product.name : 'Produto não encontrado' };
                })
            }));
            resolve(historyWithProductNames);
        }, MOCK_DELAY);
    });
};

// --- Admin API Functions ---

/**
 * Simulates admin login.
 * @param {string} username
 * @param {string} password
 * @returns {Promise<object>} Promise resolving with login status.
 */
export const loginAdmin = (username, password) => {
    console.log('API Call: loginAdmin', username);
    return new Promise((resolve, reject) => {
         setTimeout(() => {
            if (username === "admin" && password === "adminpass") {
                resolve({ success: true, message: "Login de administrador bem-sucedido!" });
            } else {
                 reject({ success: false, message: "Usuário ou senha de admin inválidos." });
            }
        }, MOCK_DELAY);
    });
};

/**
 * Simulates fetching dashboard summary data.
 * @returns {Promise<object>} Promise resolving with dashboard data.
 */
export const getDashboardData = () => {
    console.log('API Call: getDashboardData');
     return new Promise((resolve) => {
        setTimeout(() => {
            resolve({...mockDashboardData}); // Return a copy
        }, MOCK_DELAY);
    });
};

/**
 * Simulates fetching all sales/orders for admin.
 * @returns {Promise<Array<object>>} Promise resolving with sales data.
 */
export const getSales = () => {
    console.log('API Call: getSales (Admin)');
     return new Promise((resolve) => {
        setTimeout(() => {
            resolve([...mockSales]); // Return a copy
        }, MOCK_DELAY);
    });
};

/**
 * Simulates fetching details for a specific sale/order.
 * @param {number | string} saleId - The ID of the sale/order.
 * @returns {Promise<object|null>} Promise resolving with sale details or null.
 */
export const getSaleDetail = (saleId) => {
    console.log('API Call: getSaleDetail', saleId);
    const id = parseInt(saleId, 10);
    return new Promise((resolve) => {
        setTimeout(() => {
             const order = mockOrders.find(o => o.id === id);
             if (order) {
                 const saleDetail = {
                     ...order,
                     customerName: `Cliente ${order.id}`, // Simulate customer lookup
                     customerEmail: `cliente${order.id}@email.com`,
                     shippingAddress: `Rua Fictícia ${id}, 123, Cidade - UF`,
                     items: order.items.map(item => {
                        const product = mockProducts.find(p => p.id === item.productId);
                        return {
                            productId: item.productId,
                            name: product ? product.name : 'Produto Desconhecido',
                            quantity: item.quantity,
                            price: product ? product.price : 0,
                            subtotal: product ? product.price * item.quantity : 0,
                            image: product ? product.image : 'assets/images/products/placeholder-shoe-1.png'
                        };
                     })
                 };
                 resolve(saleDetail);
             } else {
                 resolve(null);
             }
        }, MOCK_DELAY / 2);
    });
};

/**
 * Simulates saving/updating a product.
 * @param {object} productData - Product details.
 * @returns {Promise<object>} Promise resolving with save status and product data.
 */
export const saveProduct = (productData) => {
    console.log('API Call: saveProduct', productData);
    return new Promise((resolve) => {
         setTimeout(() => {
            let savedProduct;
            if (productData.id) { // Update existing
                 const index = mockProducts.findIndex(p => p.id === productData.id);
                 if (index > -1) {
                     mockProducts[index] = { ...mockProducts[index], ...productData };
                     savedProduct = mockProducts[index];
                      console.log("Simulating product update:", savedProduct);
                 } else {
                    // Handle error: Product not found for update (shouldn't happen in mock)
                 }

            } else { // Add new
                 const newId = Math.max(...mockProducts.map(p => p.id)) + 1;
                 savedProduct = { ...productData, id: newId };
                 mockProducts.push(savedProduct);
                 console.log("Simulating product add:", savedProduct);
            }

             resolve({
                 success: true,
                 product: savedProduct,
                 message: `Produto ${savedProduct.id ? 'atualizado' : 'adicionado'} com sucesso!`
             });
        }, MOCK_DELAY);
    });
};

/**
 * Simulates deleting a product.
 * @param {number | string} productId - The ID of the product to delete.
 * @returns {Promise<object>} Promise resolving with deletion status.
 */
export const deleteProduct = (productId) => {
    console.log('API Call: deleteProduct', productId);
    const id = parseInt(productId, 10);
    return new Promise((resolve) => {
         setTimeout(() => {
            const initialLength = mockProducts.length;
            mockProducts = mockProducts.filter(p => p.id !== id);
            const success = mockProducts.length < initialLength;
             console.log("Simulating product delete. Success:", success);
            resolve({
                success: success,
                message: success ? "Produto excluído com sucesso!" : "Erro ao excluir produto."
            });
        }, MOCK_DELAY);
    });
};

/**
 * Simulates fetching site customization settings.
 * @returns {Promise<object>} Promise resolving with settings.
 */
export const getSiteCustomization = () => {
    console.log('API Call: getSiteCustomization');
     return new Promise((resolve) => {
        setTimeout(() => {
            resolve({...mockSiteCustomization}); // Return copy
        }, MOCK_DELAY / 2);
    });
};

/**
 * Simulates saving site customization settings.
 * @param {object} settingsData - New settings.
 * @returns {Promise<object>} Promise resolving with save status.
 */
export const saveSiteCustomization = (settingsData) => {
    console.log('API Call: saveSiteCustomization', settingsData);
     return new Promise((resolve) => {
        setTimeout(() => {
             mockSiteCustomization = { ...mockSiteCustomization, ...settingsData };
              console.log("Simulating settings save:", mockSiteCustomization);
             resolve({ success: true, message: "Configurações salvas com sucesso!" });
        }, MOCK_DELAY);
    });
};
