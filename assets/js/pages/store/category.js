
import { qs, getUrlParameter, createElement } from '../../modules/utils.js';
import { getProducts } from '../../modules/api.js';
import { renderProductCard } from './product-card.js'; // Re-use product card rendering

document.addEventListener('DOMContentLoaded', () => {
    console.log("Category page JS loaded.");
    const categoryTitleElement = qs('#category-title');
    const productGridElement = qs('#category-product-grid');

    if (!categoryTitleElement || !productGridElement) {
        console.error("Category title (#category-title) or product grid (#category-product-grid) element not found.");
        return;
    }

    const categoryName = getUrlParameter('category');
    const searchTerm = getUrlParameter('search');
    console.log(`Category Name: ${categoryName}, Search Term: ${searchTerm}`);

    let pageTitle = "Todos os Produtos";
    let filters = {};

    if (categoryName) {
        pageTitle = `Categoria: ${decodeURIComponent(categoryName)}`;
        filters.category = categoryName;
    } else if (searchTerm) {
        pageTitle = `Resultados para: "${decodeURIComponent(searchTerm)}"`;
        filters.search = searchTerm;
    }
    console.log("Setting page title to:", pageTitle);
    console.log("Applying filters:", filters);

    categoryTitleElement.textContent = pageTitle;
    document.title = `DomShoes - ${pageTitle}`; // Update page title

    loadCategoryProducts(productGridElement, filters);
});


async function loadCategoryProducts(container, filters) {
    console.log("loadCategoryProducts: Starting fetch with filters:", filters);
    container.innerHTML = '<p>Carregando produtos...</p>'; // Loading state
    try {
        const products = await getProducts(filters); // Use simulated API with filters
        console.log("loadCategoryProducts: Products received:", products);

        container.innerHTML = ''; // Clear loading state

        if (products && products.length > 0) {
            console.log(`loadCategoryProducts: Rendering ${products.length} products.`);
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
                     // Optionally append an error placeholder for this specific card
                     container.appendChild(createElement('div', {class: 'product-item error-placeholder'}, 'Erro ao renderizar produto'));
                }
            });
        } else {
             console.log("loadCategoryProducts: No products found for the given filters.");
             let message = "Nenhum produto encontrado.";
             if (filters.category) {
                message = `Nenhum produto encontrado na categoria "${filters.category}".`;
             } else if (filters.search) {
                 message = `Nenhum produto encontrado para a busca "${filters.search}".`;
             }
             container.innerHTML = `<p>${message}</p>`;
        }
    } catch (error) {
        console.error("loadCategoryProducts: Error fetching products:", error);
        container.innerHTML = '<p class="error-message">Erro ao carregar produtos. Tente novamente mais tarde.</p>';
    }
     console.log("loadCategoryProducts: Finished.");
}
