import { qs, createElement, showToast } from '../../modules/utils.js';
import { getAllStoreReviews } from '../../modules/api.js';

document.addEventListener('DOMContentLoaded', async () => {
    const reviewsContainer = qs('#store-reviews-list');

    if (!reviewsContainer) {
        console.error('Store reviews container not found.');
        showToast('Erro ao carregar avaliações da loja.', 'error');
        return;
    }

    const loadingIndicator = createElement('p', {
        class: 'loading-indicator margin-top-lg text-center',
        textContent: 'Carregando avaliações...'
    });
    reviewsContainer.appendChild(loadingIndicator);

    try {
        const reviews = await getAllStoreReviews();
        loadingIndicator.remove();

        if (reviews.length === 0) {
            reviewsContainer.innerHTML = '<p>Nenhuma avaliação encontrada para a loja.</p>';
        } else {
            reviews.forEach(review => {
                if(review.productId === null){
                    displayReview(review, reviewsContainer);
                }
            });
        }
    } catch (error) {
        loadingIndicator.remove();
        console.error('Error fetching store reviews:', error);
        showToast('Erro ao carregar avaliações da loja.', 'error');
        reviewsContainer.innerHTML = '<p class="alert alert-danger margin-top-lg">Erro ao carregar as avaliações da loja. Tente novamente mais tarde.</p>';
    }
});

/**
 * Displays a single review on the page.
 * @param {object} review - The review object.
 * @param {HTMLElement} reviewsContainer - The container for reviews.
 */
function displayReview(review, reviewsContainer) {
    const reviewElement = createElement('div', { class: 'review-card' });
    const ratingElement = createElement('p', { class: 'review-rating', textContent: `Nota: ${review.rating}` });
    const commentElement = createElement('p', { class: 'review-comment', textContent: review.comment });
    const dateElement = createElement('p', { class: 'review-date', textContent: review.date });

    reviewElement.appendChild(ratingElement);
    reviewElement.appendChild(commentElement);
    reviewElement.appendChild(dateElement);
    reviewsContainer.appendChild(reviewElement);
}