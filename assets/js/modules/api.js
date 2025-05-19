// === Simulated API Module ===
// This module simulates network requests and returns mock data.

const MOCK_DELAY = 500; // Simulate network latency (in milliseconds)

// --- Mock Data ---

const allSizes = ["36", "37", "38", "39", "40", "41", "42", "43", "44"];
const colors1 = [
    { name: 'White/Black', hex: '#FFFFFF/#000000' },
    { name: 'Grey/Red', hex: '#808080/#FF0000' },
    { name: 'Blue/White', hex: '#0000FF/#FFFFFF' }
];
const colors2 = [
    { name: 'Beige/Brown', hex: '#F5F5DC/#A52A2A' },
    { name: 'Black/White', hex: '#000000/#FFFFFF' },
    { name: 'Brown/White', hex: '#A52A2A/#FFFFFF' }
];
const colors3 = [
    { name: 'Black', hex: '#000000' },
    { name: 'Red/Black', hex: '#FF0000/#000000' },
    { name: 'Olive/Black', hex: '#808000/#000000' }
];
const colors4 = [
    { name: 'Black/Grey', hex: '#000000/#808080' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Orange/Black', hex: '#FFA500/#000000' }
];
const colors5 = [
    { name: 'Navy/White', hex: '#000080/#FFFFFF' },
    { name: 'Black/Neon Green', hex: '#000000/#39FF14' },
    { name: 'Grey/White', hex: '#808080/#FFFFFF' }
];
const colors6 = [
    { name: 'Red', hex: '#FF0000' },
    { name: 'Black/White', hex: '#000000/#FFFFFF' },
    { name: 'White/Grey', hex: '#FFFFFF/#808080' }
];
const colors7 = [
    { name: 'Black', hex: '#000000' },
    { name: 'Brown', hex: '#A52A2A' },
    { name: 'Dark Brown', hex: '#8B4513' }
];
const colors8 = [
    { name: 'Brown/Beige', hex: '#A52A2A/#F5F5DC' },
    { name: 'Black/Brown', hex: '#000000/#A52A2A' },
    { name: 'Dark Brown/Grey', hex: '#8B4513/#808080' }
];

const mockProducts = [
    {
        id: 1,
        name: "DomRunner Pro",
        description: "Tênis de corrida de alta performance, leve e com excelente retorno de energia.",
        fullDescription: "O DomRunner Pro é o tênis ideal para corredores que buscam performance e conforto. Com tecnologia de ponta, este modelo oferece um ótimo retorno de energia a cada passada, além de ser extremamente leve. Seu cabedal é feito de mesh respirável, mantendo os pés frescos e secos durante todo o percurso. O solado de borracha de alta durabilidade garante tração e estabilidade em diferentes superfícies. Ideal para treinos intensos e competições.",
        price: 499.90,
        category: "Corrida",
        image: "/assets/images/products/placeholder-shoe-1.png",
        featured: true,
        sizes: allSizes,
        colors: colors1,
        material: "Mesh",
        careInstructions: ["Machine wash cold", "Do not bleach", "Tumble dry low"],
        rating: 4.8
    },
    {
        id: 2,
        name: "DomCasual Comfort",
        description: "Tênis casual, perfeito para o dia a dia, com um design moderno e muito confortável.",
        fullDescription: "O DomCasual Comfort é a escolha ideal para quem busca conforto e estilo no dia a dia. Este tênis casual possui um design moderno e versátil, combinando com diferentes estilos de roupa. O seu interior acolchoado e o solado flexível proporcionam o máximo de conforto, tornando-o perfeito para longas caminhadas ou para passar o dia inteiro em pé. Seu material sintético de alta qualidade garante durabilidade e fácil limpeza.",
        price: 349.90,
        category: "Casual",
        image: "/assets/images/products/placeholder-shoe-2.png",
        featured: true,
        sizes: allSizes,
        colors: colors2,
        material: "Synthetic",
        careInstructions: ["Wipe with a damp cloth", "Air dry", "Avoid direct sunlight"],
        rating: 4.5
    },
    {
        id: 3,
        name: "DomTrail Explorer",
        description: "Tênis robusto para trilhas, com excelente aderência e proteção.",
        fullDescription: "O DomTrail Explorer é feito para os aventureiros que não abrem mão de segurança e conforto durante suas trilhas. Este tênis possui um solado de borracha tratorada, que oferece aderência máxima em terrenos irregulares. Seu cabedal reforçado protege os pés de pedras e obstáculos, enquanto a tecnologia de amortecimento absorve impactos, tornando cada passo mais confortável. Ideal para trilhas leves e pesadas.",
        price: 599.90,
        category: "Trilha",
        image: "/assets/images/products/placeholder-shoe-3.png",
        featured: false,
        sizes: allSizes,
        colors: colors3,
        material: "Leather",
        careInstructions: ["Clean with leather cleaner", "Apply leather conditioner", "Avoid soaking"],
        rating: 3.9
    },
    {
        id: 4,
        name: "DomSkate Classic",
        description: "Tênis clássico para skatistas, com design durável e ótima aderência.",
        fullDescription: "O DomSkate Classic é o tênis ideal para skatistas que buscam durabilidade e estilo. Seu design clássico, combinado com um solado vulcanizado de alta aderência, oferece o controle necessário para realizar manobras com confiança. O cabedal de lona reforçada garante resistência ao desgaste, enquanto o interior acolchoado proporciona conforto durante longas sessões de skate. Este é o modelo ideal para quem busca tradição e performance no skate.",
        price: 299.90,
        category: "Skate",
        image: "/assets/images/products/placeholder-shoe-4.png",
        featured: true,
        sizes: allSizes,
        colors: colors4,
        material: "Canvas",
        careInstructions: ["Brush off dirt", "Hand wash with mild soap", "Air dry in shade"],
        rating: 4.7
    },
    {
        id: 5,
        name: "DomFit Trainer",
        description: "Tênis versátil para treinos na academia, estável e com ótimo suporte.",
        fullDescription: "O DomFit Trainer é o tênis perfeito para seus treinos na academia. Sua estrutura oferece estabilidade e suporte para diversos tipos de exercício, desde levantamento de peso até treinos cardiovasculares. O cabedal de mesh respirável mantém seus pés confortáveis e secos, enquanto o solado de borracha proporciona tração em diferentes superfícies. Com o DomFit Trainer, você terá o suporte necessário para atingir seus objetivos de fitness.",
        price: 399.90,
        category: "Treino",
        image: "/assets/images/products/placeholder-shoe-5.png",
        featured: false,
        sizes: allSizes,
        colors: colors5,
        material: "Mesh",
        careInstructions: ["Machine wash cold", "Do not bleach", "Tumble dry low"],
        rating: 4.4
    },
    {
        id: 6,
        name: "DomRunner Lite",
        description: "Tênis básico para corridas leves e caminhadas, confortável e acessível.",
        fullDescription: "O DomRunner Lite é o tênis ideal para quem está começando a correr ou busca um calçado confortável para caminhadas. Seu design leve e flexível proporciona um ótimo conforto, enquanto o solado de borracha garante uma boa tração. Este modelo é a escolha certa para atividades físicas leves, oferecendo um excelente custo-benefício. Ideal para quem busca simplicidade e conforto.",
        price: 249.90,
        category: "Corrida",
        image: "/assets/images/products/placeholder-shoe-6.png",
        featured: true,
        sizes: allSizes,
        colors: colors6,
        material: "Mesh",
        careInstructions: ["Machine wash cold", "Do not bleach", "Tumble dry low"],
        rating: 4.2
    },
    {
        id: 7,
        name: "DomElegance Social",
        description: "Sapato social elegante, com o conforto que só a Dom oferece.",
        fullDescription: "O DomElegance Social combina a elegância de um sapato social com o conforto que você espera da Dom. Este modelo é perfeito para ocasiões formais, reuniões de negócios ou para quem busca um estilo mais sofisticado no dia a dia. Seu acabamento em couro de alta qualidade, combinado com um design clássico, fazem dele a escolha ideal para quem não abre mão da elegância. O interior acolchoado e a palmilha confortável garantem que você possa usar este sapato por horas sem sentir desconforto.",
        price: 459.90,
        category: "Social",
        image: "/assets/images/products/placeholder-shoe-7.png",
        featured: false,
        sizes: allSizes,
        colors: colors7,
        material: "Leather",
        careInstructions: ["Clean with leather cleaner", "Apply leather conditioner", "Avoid soaking"],
        rating: 4.3
    },
    {
        id: 8,
        name: "DomAdventure Boot",
        description: "Bota resistente para aventuras, com durabilidade e proteção extra.",
        fullDescription: "A DomAdventure Boot é a bota ideal para quem busca aventuras e não abre mão de proteção. Seu design robusto e materiais resistentes, como o couro reforçado, oferecem durabilidade e proteção extra para seus pés. O solado tratorado garante excelente aderência em diferentes tipos de terreno, enquanto o cano alto protege seus tornozelos. A DomAdventure Boot é feita para quem busca se aventurar com segurança e conforto.",
        price: 699.90,
        category: "Trilha",
        image: "/assets/images/products/placeholder-shoe-8.png",
        featured: false,
        sizes: allSizes,
        colors: colors8,
        material: "Leather",
        careInstructions: ["Clean with leather cleaner", "Apply leather conditioner", "Avoid soaking"],
        rating: 4.1
    },
];

const mockCategories = ["Corrida", "Casual", "Trilha", "Skate", "Treino", "Social"];

const mockOrders = [
    { id: 101, date: "2024-07-20", total: 849.80, status: "Entregue", items: [{ productId: 1, quantity: 1 }, { productId: 2, quantity: 1 }] },
    { id: 102, date: "2024-07-22", total: 299.90, status: "Enviado", items: [{ productId: 4, quantity: 1 }] },
    { id: 103, date: "2024-07-25", total: 699.80, status: "Processando", items: [{ productId: 2, quantity: 2 }] },
];

const mockReviews = [
    // DomRunner Pro Reviews
    { id: 1, productId: 1, userId: 1, rating: 5, comment: "Excelente para corridas longas. Super confortável!", date: "2024-03-15" },
    { id: 2, productId: 1, userId: 2, rating: 4, comment: "Muito bom, mas achei o preço um pouco alto.", date: "2024-05-22" },
    { id: 3, productId: 1, userId: 3, rating: 5, comment: "Melhor tênis de corrida que já tive! Recomendo.", date: "2024-01-08" },
    { id: 4, productId: 1, userId: 4, rating: 3, comment: "Confortável, mas a durabilidade poderia ser melhor.", date: "2023-12-19" },
    { id: 5, productId: 1, userId: 5, rating: 5, comment: "Perfeito para treinos diários e competições.", date: "2024-04-02" },
    { id: 6, productId: 1, userId: 6, rating: 4, comment: "Ótima performance, mas um pouco apertado no início.", date: "2023-10-11" },
    { id: 7, productId: 1, userId: 7, rating: 5, comment: "Excelente amortecimento. Meus joelhos agradecem!", date: "2024-02-28" },
    { id: 8, productId: 1, userId: 8, rating: 4, comment: "Produto de alta qualidade.", date: "2024-06-05" },

    // DomCasual Comfort Reviews
    { id: 9, productId: 2, userId: 9, rating: 5, comment: "Super estiloso e combina com tudo!", date: "2024-01-22" },
    { id: 10, productId: 2, userId: 10, rating: 4, comment: "Conforto incrível para usar o dia todo.", date: "2024-03-08" },
    { id: 11, productId: 2, userId: 11, rating: 5, comment: "Ótimo custo-benefício. Recomendo!", date: "2023-11-14" },
    { id: 12, productId: 2, userId: 12, rating: 3, comment: "Bonito, mas o material poderia ser mais resistente.", date: "2023-09-27" },
    { id: 13, productId: 2, userId: 13, rating: 5, comment: "Adorei o design e o conforto!", date: "2024-02-16" },
    { id: 14, productId: 2, userId: 14, rating: 4, comment: "Bom para usar no trabalho e em saídas casuais.", date: "2024-04-29" },
    { id: 15, productId: 2, userId: 15, rating: 3, comment: "O conforto é bom, mas poderia ter mais opções de cores.", date: "2023-08-05" },
    { id: 16, productId: 2, userId: 16, rating: 5, comment: "Meu tênis favorito para o dia a dia.", date: "2023-12-01" },

    // DomTrail Explorer Reviews
    { id: 17, productId: 3, userId: 17, rating: 4, comment: "Bom para trilhas leves, mas não muito confortável em longas caminhadas.", date: "2023-10-29" },
    { id: 18, productId: 3, userId: 18, rating: 3, comment: "Esperava mais da aderência. Escorreguei algumas vezes.", date: "2024-01-05" },
    { id: 19, productId: 3, userId: 19, rating: 4, comment: "Robusto e durável, mas um pouco pesado.", date: "2024-03-18" },
    { id: 20, productId: 3, userId: 20, rating: 5, comment: "Excelente para trilhas! Me senti seguro o tempo todo.", date: "2023-11-09" },
    { id: 21, productId: 3, userId: 21, rating: 2, comment: "Machucou meu tornozelo. Não recomendaria.", date: "2024-04-12" },
    { id: 22, productId: 3, userId: 22, rating: 5, comment: "Ótima aderência em terrenos molhados.", date: "2023-08-20" },
    { id: 23, productId: 3, userId: 23, rating: 4, comment: "Resistente, bom para trilhas moderadas.", date: "2024-02-07" },

    // DomSkate Classic Reviews
    { id: 24, productId: 4, userId: 24, rating: 5, comment: "Excelente para skate. A melhor aderência que já vi.", date: "2023-09-15" },
    { id: 25, productId: 4, userId: 25, rating: 4, comment: "Muito confortável para andar de skate o dia todo.", date: "2024-01-28" },
    { id: 26, productId: 4, userId: 26, rating: 5, comment: "Design clássico e durável.", date: "2023-12-03" },
    { id: 27, productId: 4, userId: 27, rating: 3, comment: "Bom, mas desgasta rápido com uso intenso.", date: "2024-03-20" },
    { id: 28, productId: 4, userId: 28, rating: 5, comment: "O tênis perfeito para as minhas manobras!", date: "2023-11-22" },
    { id: 29, productId: 4, userId: 29, rating: 4, comment: "Boa aderência, mas poderia ser mais leve.", date: "2024-05-05" },
    { id: 30, productId: 4, userId: 30, rating: 5, comment: "Recomendo para todos os skatistas!", date: "2024-02-18" },

    // DomFit Trainer Reviews
    { id: 31, productId: 5, userId: 31, rating: 5, comment: "O melhor tênis que já tive para treinos na academia.", date: "2024-02-22" },
    { id: 32, productId: 5, userId: 32, rating: 4, comment: "Estável e confortável para vários exercícios.", date: "2023-11-28" },
    { id: 33, productId: 5, userId: 33, rating: 3, comment: "Um pouco apertado no início, mas melhora com o uso.", date: "2024-04-09" },
    { id: 34, productId: 5, userId: 34, rating: 5, comment: "Excelente suporte para levantamento de peso.", date: "2023-10-15" },
    { id: 35, productId: 5, userId: 35, rating: 4, comment: "Ótima qualidade, mas poderia ter mais cores.", date: "2024-01-19" },
    { id: 36, productId: 5, userId: 36, rating: 5, comment: "Perfeito para treinos intensos.", date: "2024-03-01" },
    { id: 37, productId: 5, userId: 37, rating: 4, comment: "Meu tênis preferido para ir na academia.", date: "2023-08-29" },

    // DomRunner Lite Reviews
    { id: 38, productId: 6, userId: 38, rating: 4, comment: "Leve e confortável para corridas curtas.", date: "2024-04-22" },
    { id: 39, productId: 6, userId: 39, rating: 3, comment: "Bom para caminhadas, mas não muito para corridas longas.", date: "2023-12-10" },
    { id: 40, productId: 6, userId: 40, rating: 5, comment: "Ótimo custo-benefício. Perfeito para iniciantes.", date: "2024-01-03" },
    { id: 41, productId: 6, userId: 41, rating: 4, comment: "Confortável e com um preço acessível.", date: "2023-09-07" },
    { id: 42, productId: 6, userId: 42, rating: 5, comment: "Superou minhas expectativas. Muito leve!", date: "2024-02-14" },
    { id: 43, productId: 6, userId: 43, rating: 3, comment: "Simples e funcional, ótimo para o que eu precisava.", date: "2023-11-05" },
    { id: 44, productId: 6, userId: 44, rating: 4, comment: "Vale muito a pena pelo preço.", date: "2024-03-29" },

    //DomElegance Social Reviews
    { id: 45, productId: 7, userId: 45, rating: 5, comment: "Muito elegante, perfeito para ocasiões formais.", date: "2024-03-12" },
    { id: 46, productId: 7, userId: 46, rating: 4, comment: "Confortável para usar por horas, adorei!", date: "2023-08-18" },
    { id: 47, productId: 7, userId: 47, rating: 3, comment: "Bonito, mas achei um pouco apertado no início.", date: "2024-01-25" },
    { id: 48, productId: 7, userId: 48, rating: 5, comment: "O sapato ideal para o trabalho!", date: "2023-11-02" },
    { id: 49, productId: 7, userId: 49, rating: 4, comment: "O material é muito bom e tem um bom acabamento.", date: "2024-02-09" },
    { id: 50, productId: 7, userId: 50, rating: 5, comment: "Comprei para uma festa e foi um sucesso.", date: "2023-10-21" },
    { id: 51, productId: 7, userId: 51, rating: 3, comment: "É elegante, mas não tão confortável quanto eu esperava.", date: "2024-04-05" },

    //DomAdventure Boot Reviews
    { id: 52, productId: 8, userId: 52, rating: 4, comment: "Muito robusta, perfeita para aventuras.", date: "2024-01-10" },
    { id: 53, productId: 8, userId: 53, rating: 3, comment: "Um pouco pesada, mas protege bem os pés.", date: "2023-09-22" },
    { id: 54, productId: 8, userId: 54, rating: 5, comment: "Excelente aderência, não escorreguei nenhuma vez.", date: "2024-02-26" },
    { id: 55, productId: 8, userId: 55, rating: 4, comment: "Confortável para usar em longas caminhadas.", date: "2023-12-14" },
    { id: 56, productId: 8, userId: 56, rating: 5, comment: "A melhor bota que já tive para trilhas.", date: "2024-04-19" },
    { id: 57, productId: 8, userId: 57, rating: 4, comment: "Recomendo para quem gosta de se aventurar.", date: "2023-11-08" },
    { id: 58, productId: 8, userId: 58, rating: 3, comment: "A bota é resistente, mas não tão confortável quanto eu esperava.", date: "2024-03-03" },
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
            const reviews = getReviewsByProductId(productId);
            const productWithReviews = {...product, reviews};

            resolve(productWithReviews);
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
 * Simulates adding a new review.
 * @param {object} reviewData - Review details (productId, userId, rating, comment).
 * @returns {Promise<object>} Promise resolving with review confirmation.
 */
export const submitReview = (reviewData) => {
    console.log('API Call: submitReview', reviewData);
    return new Promise((resolve) => {
        setTimeout(() => {
            const newReviewId = Math.max(...mockReviews.map(r => r.id)) + 1;
            const newReview = {
                id: newReviewId,
                date: new Date().toISOString().split('T')[0], // Current date as YYYY-MM-DD
                ...reviewData
            };
            mockReviews.push(newReview);

            const confirmation = {
                success: true,
                message: "Review adicionada com sucesso!",
                review: newReview
            };
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
 * Simulates fetching all reviews with the specified product id.
 * @param {number | string} productId - The ID of the product.
 * @returns {Promise<object|null>} Promise resolving with product data or null if not found.
 */
export const getReviewsByProductId = (productId) => {
    console.log('API Call: getReviewsByProductId', productId);
    const id = parseInt(productId, 10); // Ensure ID is a number

    return new Promise((resolve) => {
        setTimeout(() => {
            const reviews = mockReviews.filter(r => r.productId === id) || [];
            resolve(reviews);
        }, MOCK_DELAY / 2); // Faster for single item fetch
    });
};

/**
 * Simulates fetching all reviews.
 * @returns {Promise<Array<object>>} Promise resolving with all reviews.
 */
export const getAllStoreReviews = () => {
    console.log('API Call: getAllStoreReviews');
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([...mockReviews]); // Return a copy
        }, MOCK_DELAY / 2);
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
