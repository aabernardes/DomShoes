import { qs, qsa, on, createElement, formatCurrency } from '../../modules/utils.js';
import { getProducts, deleteProduct } from '../../modules/api.js'; // Assuming API functions

document.addEventListener('DOMContentLoaded', () => {
    console.log("Admin Products JS loaded.");
    setActiveNavLink();
    loadProductsTable();

    // Event delegation for delete buttons
    const productTableBody = qs('#product-table-body');
    if (productTableBody) {
        on(productTableBody, 'click', '.btn-delete-product', handleDeleteProduct);
    }
});

function setActiveNavLink() {
    qsa('.admin-nav a.active').forEach(link => link.classList.remove('active'));
    const productsLink = qs('.admin-nav a[href="products.html"]');
    if (productsLink) {
        productsLink.classList.add('active');
    }
}

async function loadProductsTable() {
    const tableBody = qs('#product-table-body');
    if (!tableBody) return;

    tableBody.innerHTML = `<tr><td colspan="6" class="text-center">Carregando produtos...</td></tr>`; // Loading state

    try {
        const products = await getProducts(); // Fetch all products

        tableBody.innerHTML = ''; // Clear loading state

        if (products && products.length > 0) {
            products.forEach(product => {
                tableBody.appendChild(createProductRow(product));
            });
        } else {
            tableBody.innerHTML = `<tr><td colspan="6" class="text-center">Nenhum produto cadastrado.</td></tr>`;
        }
    } catch (error) {
        console.error("Error loading products:", error);
        tableBody.innerHTML = `<tr><td colspan="6" class="text-center error-message">Erro ao carregar produtos.</td></tr>`;
    }
}

function createProductRow(product) {
    const tr = createElement('tr', { 'data-product-id': product.id });

    tr.appendChild(createElement('td', {}, createElement('img', { src: product.image, alt: product.name, width: '50', style: 'height: 50px; object-fit: cover; border-radius: 4px;' })));
    tr.appendChild(createElement('td', { text: product.name }));
    tr.appendChild(createElement('td', { text: product.category }));
    tr.appendChild(createElement('td', { text: formatCurrency(product.price) }));
    tr.appendChild(createElement('td', { text: product.featured ? 'Sim' : 'Não' })); // Example: Show featured status

    // Actions Cell
    const actionsTd = createElement('td', { class: 'table-actions' });
    actionsTd.appendChild(createElement('a', {
        href: `product-edit.html?id=${product.id}`,
        class: 'btn btn-sm btn-outline',
        'aria-label': 'Editar Produto',
        title: 'Editar'
    }, '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/></svg>'));
    actionsTd.appendChild(createElement('button', {
        class: 'btn btn-sm btn-outline-red btn-delete-product',
        'aria-label': 'Excluir Produto',
        title: 'Excluir',
         'data-product-id': product.id, // Add ID to button for easier access in handler
         'data-product-name': product.name // Add name for confirm message
    }, '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16"><path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm-1.115 1.885L10 14.5H6l-.885-10.115zM8.5 5.5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0zm2.5 0a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/></svg>'));
    tr.appendChild(actionsTd);

    return tr;
}

async function handleDeleteProduct(event) {
    const button = event.target.closest('.btn-delete-product');
    if (!button) return;

    const productId = button.dataset.productId;
    const productName = button.dataset.productName || 'este produto';

    if (confirm(`Tem certeza que deseja excluir o produto "${productName}"? Esta ação não pode ser desfeita.`)) {
        button.disabled = true;
        button.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>'; // Simple spinner/loading indicator

        try {
            const result = await deleteProduct(productId);
            if (result.success) {
                // Remove the row from the table visually
                const row = button.closest('tr');
                if (row) {
                    row.remove();
                }
                 // Optional: Show success toast
                 // showToast("Produto excluído com sucesso!", "success");
                 console.log(`Product ${productId} deleted successfully.`);
                 // Check if table is empty after deletion
                  const tableBody = qs('#product-table-body');
                  if (tableBody && tableBody.rows.length === 0) {
                      tableBody.innerHTML = `<tr><td colspan="6" class="text-center">Nenhum produto cadastrado.</td></tr>`;
                  }
            } else {
                 alert(`Erro ao excluir produto: ${result.message || 'Erro desconhecido.'}`);
                 button.disabled = false;
                 // Restore original icon
                  button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">...</svg>';
            }
        } catch (error) {
            console.error("Error deleting product:", error);
            alert("Ocorreu um erro ao tentar excluir o produto.");
            button.disabled = false;
             button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">...</svg>';
        }
    }
}
