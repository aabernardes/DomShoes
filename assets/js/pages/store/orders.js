import { qs, createElement, formatCurrency, getCurrentUser } from '../../modules/utils.js';
import { getOrderHistory } from '../../modules/api.js'; // Assuming this API function exists

document.addEventListener('DOMContentLoaded', () => {
    const ordersContainer = qs('#orders-list-container');

    const user = getCurrentUser();
    if (!user) {
        // If not logged in, redirect to login page
        window.location.href = '/store/login.html';
        return; // Stop further execution
    }

    if (!ordersContainer) {
        console.warn("Orders list container not found.");
        return;
    }

    loadOrderHistory(ordersContainer, user.id); // Pass user identifier if API needs it
});


async function loadOrderHistory(container, userId) {
    container.innerHTML = '<p>Carregando histórico de pedidos...</p>'; // Loading state
    try {
        const orders = await getOrderHistory(userId); // Use simulated API

        container.innerHTML = ''; // Clear loading state

        if (orders && orders.length > 0) {
            orders.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date descending
            orders.forEach(order => {
                container.appendChild(createOrderElement(order));
            });
        } else {
            container.innerHTML = '<p>Você ainda não fez nenhum pedido.</p>';
        }
    } catch (error) {
        console.error("Error loading order history:", error);
        container.innerHTML = '<p>Erro ao carregar o histórico de pedidos. Tente novamente mais tarde.</p>';
    }
}

function createOrderElement(order) {
    const orderElement = createElement('div', { class: 'order-item card' }); // Reuse card style

    // Format date nicely
    const orderDate = new Date(order.date).toLocaleDateString('pt-BR', {
        day: '2-digit', month: 'short', year: 'numeric'
    });

    const header = createElement('div', { class: 'card-header order-header' });
    header.appendChild(createElement('span', { class: 'order-id', text: `Pedido #${order.id}` }));
    header.appendChild(createElement('span', { class: 'order-date', text: orderDate }));
    header.appendChild(createElement('span', { class: `order-status status-${order.status.toLowerCase()}`, text: order.status })); // Add class for styling status
    orderElement.appendChild(header);

    const body = createElement('div', { class: 'card-content order-body' });

    // List items concisely
    const itemsList = createElement('ul', { class: 'order-items-summary' });
    order.items.forEach(item => {
        itemsList.appendChild(createElement('li', { text: `${item.quantity}x ${item.productName || 'Item Desconhecido'}` }));
    });
     // Show only first few items if too many?
    body.appendChild(itemsList);

    const footer = createElement('div', { class: 'card-footer order-footer' });
    footer.appendChild(createElement('span', { class: 'order-total', html: `Total: <strong>${formatCurrency(order.total)}</strong>` }));
    // Optional: Add a "View Details" link/button if implementing order detail page
    // footer.appendChild(createElement('a', { href: `/store/order-detail.html?id=${order.id}`, class: 'btn btn-sm btn-outline', text: 'Ver Detalhes'}));
    orderElement.appendChild(footer);

    orderElement.appendChild(body);
    orderElement.appendChild(footer);


    // Add styles dynamically or ensure they exist in CSS
    const style = document.createElement('style');
    style.textContent = `
        .order-item { margin-bottom: var(--spacing-md); }
        .order-header { display: flex; justify-content: space-between; align-items: center; background-color: var(--neutral-lighter); padding: var(--spacing-sm) var(--spacing-md); font-size: var(--font-size-sm); border-bottom: 1px solid var(--neutral-light);}
        .order-id { font-weight: bold; }
        .order-status { font-weight: bold; padding: 2px 6px; border-radius: var(--border-radius-sm); color: var(--primary-white); }
        .status-entregue { background-color: var(--success-green); }
        .status-enviado { background-color: var(--accent-blue); }
        .status-processando { background-color: #ff9800; } /* Orange */
        .status-cancelado { background-color: var(--error-red); }
        .order-body { padding: var(--spacing-sm) var(--spacing-md); }
        .order-items-summary { list-style: none; padding: 0; margin: 0; font-size: var(--font-size-sm); color: var(--neutral-medium); }
        .order-items-summary li { margin-bottom: var(--spacing-xs); }
        .order-footer { display: flex; justify-content: space-between; align-items: center; padding: var(--spacing-sm) var(--spacing-md); background-color: var(--neutral-lighter); border-top: 1px solid var(--neutral-light);}
        .order-total strong { color: var(--primary-red); }
    `;
    // Append style once to head or parent container instead of per element for efficiency
    if (!qs('style#order-item-styles')) {
        style.id = 'order-item-styles';
        document.head.appendChild(style);
    }


    return orderElement;
}
