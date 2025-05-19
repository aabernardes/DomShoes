
import { qs, getUrlParameter, createElement, showToast } from '../../modules/utils.js'; // Update path
import { getProducts, getCategories } from '../../modules/api.js'; // Update path
import { createProductCard } from './product-card.js'; // Re-use product card rendering

document.addEventListener('DOMContentLoaded', async () => {
    console.log("Category page JS loaded.");
    const categoryTitleElement = qs('#category-title');
    const productGrid = qs('#category-product-grid');

    if (!categoryTitleElement || !productGrid) {
        console.error("Category title (#category-title) or product grid (#category-product-grid) element not found.");
        return showToast('Erro: Elementos da página não encontrados.', 'error');
    }

    const categoryName = getUrlParameter('category');
    const searchTerm = getUrlParameter('search');
    console.log(`Category Name: ${categoryName}, Search Term: ${searchTerm}`);

    let pageTitle = "Todos os Produtos";
    let filters = {}; // Filters will depend on category or search term

    if (categoryName) {
        try {
            const categories = await getCategories();
            if (categories.includes(decodeURIComponent(categoryName))) {
                pageTitle = `Categoria: ${decodeURIComponent(categoryName)}`;
                filters.category = decodeURIComponent(categoryName); // Ensure to decode the category name
            } else {
                pageTitle = `Categoria não encontrada`;
                productGrid.innerHTML = `<p>Categoria "${decodeURIComponent(categoryName)}" não encontrada.</p>`;
                showToast(`Erro: Categoria "${decodeURIComponent(categoryName)}" não encontrada.`, 'warning');
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
            showToast('Erro ao carregar categorias.', 'error');
            productGrid.innerHTML = '<p class="error-message">Erro ao carregar categorias. Tente novamente mais tarde.</p>';
        }
    } else if (searchTerm) {
        pageTitle = `Resultados para: "${decodeURIComponent(searchTerm)}"`;
        filters.search = decodeURIComponent(searchTerm); // Ensure to decode the search term
    }
    console.log("Setting page title to:", pageTitle);
    console.log("Applying filters:", filters);

    categoryTitleElement.textContent = pageTitle;
    document.title = `DomShoes - ${pageTitle}`;

    loadCategoryProducts(productGrid, filters);
});

async function loadCategoryProducts(productGrid, filters) {
    console.log("loadCategoryProducts: Starting fetch with filters:", filters, productGrid);
    productGrid.innerHTML = '<p>Carregando produtos...</p>';
    try {
        const products = await getProducts(filters);
        productGrid.innerHTML = '';
        if (products.length > 0) {
            products.forEach(product => {
                try {
                    const productCard = createProductCard(product);
                    productGrid.appendChild(productCard);
                } catch (renderError) {
                    console.error("Error rendering product card for:", product, renderError);
                    productGrid.appendChild(createElement('div', { class: 'product-item error-placeholder' }, 'Erro ao renderizar produto'));
                }
            });
        } else {
            productGrid.innerHTML = `<p>Nenhum produto encontrado.</p>`;
        }
    } catch (error) {
        console.error("loadCategoryProducts: Error fetching products:", error);
        productGrid.innerHTML = '<p class="error-message">Erro ao carregar produtos. Tente novamente mais tarde.</p>';
    }
}
