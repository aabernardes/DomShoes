import { qs, createElement, formatCurrency, qsa } from '../../modules/utils.js'; // Importing helper functions
import { getProductById, getProducts } from '../../modules/api.js'; // Importing API functions
import { createProductCard } from './product-card.js';
import { addToCart } from '../../modules/cart.js';

document.addEventListener('DOMContentLoaded', async () => {
    console.log("Product Detail page JS loaded.");

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const productDetailsContainer = qs('#product-details-container');
    const relatedProductsContainer = qs('#related-products-container');

    if (!productDetailsContainer) {
        console.error("Product details container not found.");
        return;
    }

    if (!productId) {
        productDetailsContainer.innerHTML = '<p>Produto não encontrado.</p>';
        return;
    }

    try {
        const product = await getProductById(productId);

        if (!product) {
            productDetailsContainer.innerHTML = '<p>Produto não encontrado.</p>';
            return;
        }

        renderProductDetails(product, productDetailsContainer);
        loadRelatedProducts(relatedProductsContainer, product.category);
    } catch (error) {
        console.error("Error fetching product details:", error);
        productDetailsContainer.innerHTML = '<p>Erro ao carregar detalhes do produto.</p>';
    }
});

function renderProductDetails(product, container) {
    console.log("renderProductDetails: Rendering product:", product);
    container.innerHTML = '';

    // Product image
    const image = createElement('img', { src: product.image || '/assets/images/products/placeholder-shoe-1.png', alt: product.name, class: 'product-image' });

    // Product name
    const name = createElement('h2', { class: 'product-name', textContent: product.name });

    // Product price
    const price = createElement('p', { class: 'product-price', textContent: formatCurrency(product.price) });

    // Product description
    const description = createElement('p', { class: 'product-description', textContent: product.fullDescription || product.description });

     // Product material
    const material = createElement('p', { class: 'product-material', textContent: `Material: ${product.material}` });

    // Product rating
    const rating = createElement('p', { class: 'product-rating', textContent: `Avaliação: ${product.rating} estrelas` });

    // Product colors
    const colors = createElement('div', { class: 'product-colors', textContent: 'Cores:' });
    product.colors.forEach(color => {
        const colorElement = createElement('span', { class: 'product-color', style: `background-color: ${color.hex}` });
        colors.appendChild(colorElement);
    });

    // Product sizes
    const sizes = createElement('div', { class: 'product-sizes', textContent: 'Tamanhos:' });
    product.sizes.forEach(size => {
        const sizeElement = createElement('span', { class: 'product-size', textContent: size });
        sizes.appendChild(sizeElement);
    });


    // Product care instructions
     const careInstructions = createElement('ul', { class: 'product-care-instructions' });
     product.careInstructions.forEach(instruction => {
         const instructionElement = createElement('li', { textContent: instruction });
         careInstructions.appendChild(instructionElement);
    });

    // Add to cart button
    const addToCartButton = createElement('button', { class: 'btn btn-primary', textContent: 'Adicionar ao Carrinho' });
    addToCartButton.addEventListener('click', () => addToCart(product));

    container.appendChild(image);
    container.appendChild(name);
    container.appendChild(price);
    container.appendChild(rating);
    container.appendChild(colors);
    container.appendChild(sizes);
    container.appendChild(material);
    container.appendChild(description);
     container.appendChild(careInstructions);
    container.appendChild(addToCartButton);

     if (product.reviews && product.reviews.length > 0) {
        const reviewsTitle = createElement('h3', { class: 'product-reviews-title', textContent: 'Avaliações' });
        container.appendChild(reviewsTitle);
        product.reviews.forEach(review => {
            const reviewElement = createElement('div', { class: 'product-review' });
            const reviewRating = createElement('p', { class: 'review-rating', textContent: `Rating: ${review.rating}` });
            const reviewComment = createElement('p', { class: 'review-comment', textContent: review.comment });
            const reviewDate = createElement('p', { class: 'review-date', textContent: review.date });

            reviewElement.appendChild(reviewRating);
            reviewElement.appendChild(reviewComment);
            reviewElement.appendChild(reviewDate);
            container.appendChild(reviewElement);
        });
    }
}

async function loadRelatedProducts(container, category) {
    console.log("loadRelatedProducts: Starting fetch...",category);
    try {
        const products = await getProducts({ category: category }); // Get related products by category
        console.log("loadRelatedProducts: Products fetched:", products);
        container.innerHTML = '';
        products.forEach(product => {
            const productCard = createProductCard(product);
            container.appendChild(productCard);
        });
    } catch (error) {
        console.error("loadRelatedProducts: Error fetching related products:", error);
    }
}