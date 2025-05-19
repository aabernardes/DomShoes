import { qs, on, formatCurrency, createElement, showToast } from '../../modules/utils.js';
import { getProducts } from '../../modules/api.js';
import { addToCart } from '../../modules/cart.js';

document.addEventListener('DOMContentLoaded', async () => {
    const productGrid = qs('.card-grid');

    if (productGrid) {
        const loadingIndicator = productGrid.querySelector('p');
        if (loadingIndicator) loadingIndicator.style.display = 'block';

        try {
            const products = await getProducts({ featured: true });
             if (loadingIndicator) loadingIndicator.style.display = 'none';
            displayProducts(products, productGrid);
        } catch (error) {
            if (loadingIndicator) loadingIndicator.style.display = 'none';
            console.error('Error fetching featured products:', error);
            showToast('Erro ao carregar produtos.', 'error');
        }
    } else {
        console.error('Product grid not found.');
        showToast('Erro ao carregar produtos.', 'error');
    }
});

function displayProducts(products, productGrid) {
    if (products.length === 0) {
        productGrid.innerHTML = '<p>Nenhum produto encontrado.</p>';
        return;
    }
    productGrid.innerHTML = '';
    products.forEach(product => {
        const card = createElement('div', { class: 'product-card' });
        const link = createElement('a', { href: `product-detail.html?id=${product.id}` });
        const img = createElement('img', { src: product.image, alt: product.name });
        const title = createElement('h3', { textContent: product.name });
        const price = createElement('p', { textContent: formatCurrency(product.price) });
        const button = createElement('button', { class: 'btn btn-primary', textContent: 'Adicionar ao Carrinho' });

        on(button, 'click', () => {
            addToCart(product);
            showToast(`${product.name} adicionado ao carrinho!`, 'success');
        });

        link.appendChild(img);
        card.appendChild(link);
        card.appendChild(title);
        card.appendChild(price);
        card.appendChild(button);
        productGrid.appendChild(card);
    });
}