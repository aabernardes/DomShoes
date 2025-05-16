import { qs, getUrlParameter, createElement, formatCurrency } from '../../modules/utils.js';
import { getSaleDetail } from '../../modules/api.js'; // Assuming API function

document.addEventListener('DOMContentLoaded', () => {
    console.log("Admin Sale Detail JS loaded.");
    setActiveNavLink(); // Keep sales link active

    const saleId = getUrlParameter('id');
    const detailContainer = qs('#sale-detail-container');

    if (!saleId) {
        if (detailContainer) detailContainer.innerHTML = '<p class="error-message">ID da venda não fornecido.</p>';
        console.error("Sale ID not found in URL.");
        return;
    }

    if (!detailContainer) {
        console.error("Sale detail container not found.");
        return;
    }

    loadSaleDetails(saleId, detailContainer);
});

function setActiveNavLink() {
    qsa('.admin-nav a.active').forEach(link => link.classList.remove('active'));
    const salesLink = qs('.admin-nav a[href="sales.html"]');
    if (salesLink) {
        salesLink.classList.add('active');
    }
}

async function loadSaleDetails(saleId, container) {
    container.innerHTML = '<p>Carregando detalhes da venda...</p>'; // Loading state

    try {
        const sale = await getSaleDetail(saleId);

        container.innerHTML = ''; // Clear loading state

        if (sale) {
            renderSaleDetails(sale, container);
        } else {
            container.innerHTML = `<p class="error-message">Venda com ID ${saleId} não encontrada.</p>`;
        }
    } catch (error) {
        console.error("Error loading sale details:", error);
        container.innerHTML = '<p class="error-message">Erro ao carregar detalhes da venda.</p>';
    }
}

function renderSaleDetails(sale, container) {
    const orderDate = new Date(sale.date).toLocaleString('pt-BR', {
        dateStyle: 'long', timeStyle: 'short'
    });

    // --- Header Info ---
    const headerDiv = createElement('div', { class: 'sale-detail-header' });
    headerDiv.appendChild(createElement('h2', { text: `Detalhes da Venda #${sale.id}` }));
    headerDiv.appendChild(createElement('p', { html: `Data: <strong>${orderDate}</strong>` }));
    headerDiv.appendChild(createElement('p', { html: `Status: <span class="order-status status-${sale.status.toLowerCase()}">${sale.status}</span>` }));
    container.appendChild(headerDiv);

    // --- Customer & Shipping Info (in columns maybe) ---
    const infoGrid = createElement('div', { class: 'sale-info-grid' });

    const customerInfo = createElement('div', { class: 'info-section' });
    customerInfo.appendChild(createElement('h4', { text: 'Cliente' }));
    customerInfo.appendChild(createElement('p', { text: sale.customerName || 'N/A' }));
    customerInfo.appendChild(createElement('p', { text: sale.customerEmail || 'N/A' }));
    infoGrid.appendChild(customerInfo);

    const shippingInfo = createElement('div', { class: 'info-section' });
    shippingInfo.appendChild(createElement('h4', { text: 'Endereço de Entrega' }));
    shippingInfo.appendChild(createElement('p', { text: sale.shippingAddress || 'N/A' }));
    infoGrid.appendChild(shippingInfo);

    container.appendChild(infoGrid);


    // --- Items Table ---
    container.appendChild(createElement('h4', { text: 'Itens do Pedido', style: 'margin-top: var(--spacing-lg);' }));
    const tableContainer = createElement('div', { class: 'table-container' });
    const table = createElement('table', { class: 'table table-sm table-bordered' }); // Use table styles
    const thead = createElement('thead');
    thead.innerHTML = `
        <tr>
            <th>Produto</th>
            <th>Qtd.</th>
            <th>Preço Unit.</th>
            <th>Subtotal</th>
        </tr>
    `;
    const tbody = createElement('tbody');
    sale.items.forEach(item => {
        const tr = createElement('tr');
        tr.appendChild(createElement('td', {},
             createElement('img', { src: item.image, width: 30, style: 'height: 30px; object-fit: cover; margin-right: 5px; vertical-align: middle;'}),
             createElement('a', {href: `product-edit.html?id=${item.productId}`, text: item.name}) // Link to product edit
        ));
        tr.appendChild(createElement('td', { text: item.quantity, style: 'text-align: center;' }));
        tr.appendChild(createElement('td', { text: formatCurrency(item.price), style: 'text-align: right;' }));
        tr.appendChild(createElement('td', { text: formatCurrency(item.subtotal), style: 'text-align: right;' }));
        tbody.appendChild(tr);
    });
    table.appendChild(thead);
    table.appendChild(tbody);
    tableContainer.appendChild(table);
    container.appendChild(tableContainer);

    // --- Totals ---
    const totalsDiv = createElement('div', { class: 'sale-totals' });
    // Could add subtotal, shipping, discount rows if available
    totalsDiv.appendChild(createElement('div', { class: 'total-row' },
        createElement('strong', {text: 'Total do Pedido:'}),
        createElement('strong', {text: formatCurrency(sale.total)})
    ));
    container.appendChild(totalsDiv);

    // --- Actions (Optional) ---
    // e.g., button to change status, print invoice, etc.
    const actionsDiv = createElement('div', { class: 'sale-actions' });
    // actionsDiv.appendChild(createElement('button', {class: 'btn btn-secondary', text: 'Marcar como Enviado'}));
    container.appendChild(actionsDiv);


     // --- Add Specific Styles ---
    const style = document.createElement('style');
    style.textContent = `
        .sale-detail-header { margin-bottom: var(--spacing-lg); padding-bottom: var(--spacing-md); border-bottom: 1px solid var(--neutral-light); }
        .sale-detail-header h2 { margin-bottom: var(--spacing-sm); }
        .sale-detail-header p { margin-bottom: var(--spacing-xs); font-size: var(--font-size-base); }
        .order-status { font-weight: bold; padding: 3px 8px; border-radius: var(--border-radius-sm); color: var(--primary-white); font-size: 0.9em; white-space: nowrap; }
        .status-entregue { background-color: var(--success-green); }
        .status-enviado { background-color: var(--accent-blue); }
        .status-processando { background-color: #ff9800; }
        .status-cancelado { background-color: var(--error-red); }
        .sale-info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: var(--spacing-lg); margin-bottom: var(--spacing-lg); }
        .info-section h4 { margin-bottom: var(--spacing-sm); font-size: var(--font-size-base); color: var(--neutral-dark); border-bottom: 1px solid var(--neutral-lighter); padding-bottom: var(--spacing-xs); }
        .info-section p { margin-bottom: var(--spacing-xs); font-size: var(--font-size-sm); color: var(--neutral-medium); }
        .sale-totals { margin-top: var(--spacing-md); padding-top: var(--spacing-md); border-top: 1px solid var(--neutral-light); text-align: right; }
        .sale-totals .total-row { font-size: var(--font-size-lg); color: var(--neutral-dark); }
        .sale-actions { margin-top: var(--spacing-lg); text-align: right; }
        #sale-detail-container .table-sm td, #sale-detail-container .table-sm th { padding: var(--spacing-xs) var(--spacing-sm); }
    `;
     if (!qs('style#sale-detail-styles')) {
         style.id = 'sale-detail-styles';
         document.head.appendChild(style);
     }

}
