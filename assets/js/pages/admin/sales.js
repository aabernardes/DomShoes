import { qs, qsa, on, createElement, formatCurrency } from '../../modules/utils.js';
import { getSales } from '../../modules/api.js'; // Assuming API function

document.addEventListener('DOMContentLoaded', () => {
    console.log("Admin Sales JS loaded.");
    setActiveNavLink();
    loadSalesTable();
});

function setActiveNavLink() {
    qsa('.admin-nav a.active').forEach(link => link.classList.remove('active'));
    const salesLink = qs('.admin-nav a[href="sales.html"]');
    if (salesLink) {
        salesLink.classList.add('active');
    }
}

async function loadSalesTable() {
    const tableBody = qs('#sales-table-body');
    if (!tableBody) return;

    tableBody.innerHTML = `<tr><td colspan="6" class="text-center">Carregando vendas...</td></tr>`; // Loading state

    try {
        const sales = await getSales(); // Fetch sales/orders

        tableBody.innerHTML = ''; // Clear loading state

        if (sales && sales.length > 0) {
             sales.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date descending
            sales.forEach(sale => {
                tableBody.appendChild(createSaleRow(sale));
            });
        } else {
            tableBody.innerHTML = `<tr><td colspan="6" class="text-center">Nenhuma venda encontrada.</td></tr>`;
        }
    } catch (error) {
        console.error("Error loading sales:", error);
        tableBody.innerHTML = `<tr><td colspan="6" class="text-center error-message">Erro ao carregar vendas.</td></tr>`;
    }
}

function createSaleRow(sale) {
    const tr = createElement('tr', { 'data-sale-id': sale.id });

     const orderDate = new Date(sale.date).toLocaleDateString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric' // Consistent date format
    });

    tr.appendChild(createElement('td', { text: `#${sale.id}` }));
    tr.appendChild(createElement('td', { text: orderDate }));
    tr.appendChild(createElement('td', { text: sale.customerName || 'N/A' })); // Display customer name
    tr.appendChild(createElement('td', { text: formatCurrency(sale.total) }));

    // Status Cell with badge-like style
    const statusTd = createElement('td');
    statusTd.appendChild(createElement('span', {
        class: `order-status status-${sale.status.toLowerCase()}`, // Reuse styles from orders.js CSS if possible
        text: sale.status
    }));
    tr.appendChild(statusTd);


    // Actions Cell
    const actionsTd = createElement('td', { class: 'table-actions' });
    actionsTd.appendChild(createElement('a', {
        href: `sale-detail.html?id=${sale.id}`,
        class: 'btn btn-sm btn-outline',
        'aria-label': 'Ver Detalhes da Venda',
        title: 'Ver Detalhes'
        // Add an icon for view details
    }, '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16"><path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/><path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/></svg>'));
    tr.appendChild(actionsTd);

    // Ensure status styles are available (copy from orders.js or centralize)
    const style = document.createElement('style');
    style.textContent = `
        .order-status { font-weight: bold; padding: 3px 8px; border-radius: var(--border-radius-sm); color: var(--primary-white); font-size: 0.85em; white-space: nowrap; }
        .status-entregue { background-color: var(--success-green); }
        .status-enviado { background-color: var(--accent-blue); }
        .status-processando { background-color: #ff9800; }
        .status-cancelado { background-color: var(--error-red); }
    `;
    if (!qs('style#order-status-styles')) {
        style.id = 'order-status-styles';
        document.head.appendChild(style);
    }


    return tr;
}
