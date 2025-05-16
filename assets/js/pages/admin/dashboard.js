
import { qs, qsa, formatCurrency, createElement } from '../../modules/utils.js';
import { getDashboardData } from '../../modules/api.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log("Admin Dashboard JS loaded.");
    setActiveNavLink();
    loadDashboardStats();
});

function setActiveNavLink() {
    // Remove active class from all links
    qsa('.admin-nav a.active').forEach(link => link.classList.remove('active'));
    // Add active class to the dashboard link
    const dashboardLink = qs('.admin-nav a[href="dashboard.html"]');
    if (dashboardLink) {
        dashboardLink.classList.add('active');
    }
}

async function loadDashboardStats() {
    console.log("loadDashboardStats: Starting...");
    const statsContainer = qs('#dashboard-stats-container');
    const recentActivityList = qs('#recent-activity-list');
    const popularProductsList = qs('#popular-products-list'); // Assuming elements exist

    if (!statsContainer) {
         console.error("loadDashboardStats: Stats container not found.");
         return;
    }
     if (!recentActivityList) console.warn("loadDashboardStats: Recent activity list not found.");
     if (!popularProductsList) console.warn("loadDashboardStats: Popular products list not found.");

    statsContainer.innerHTML = '<p>Carregando estatísticas...</p>'; // Loading state
    if(recentActivityList) recentActivityList.innerHTML = '<li>Carregando...</li>';
    if(popularProductsList) popularProductsList.innerHTML = '<li>Carregando...</li>';

    try {
        console.log("loadDashboardStats: Fetching dashboard data...");
        const data = await getDashboardData();
        console.log("loadDashboardStats: Data received:", data);

        // Render Stat Cards
        statsContainer.innerHTML = ''; // Clear loading
        if(data.totalSales !== undefined) statsContainer.appendChild(createStatCard('Vendas Totais', formatCurrency(data.totalSales), 'sales', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-currency-dollar" viewBox="0 0 16 16"><path d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.455 3.99-3.487h-1.049c-.196 1.391-.913 2.169-2.82 2.299V9.071c1.94-.13 2.82-.941 3.003-2.531H9.748c-.196 1.137-.78 1.738-2.342 1.817V6.18c-1.99-.14-3.006-.997-3.17-2.734H2.266c.19 1.918 1.527 3.176 3.74 3.351v1.296c-2.22.177-3.532 1.284-3.74 3.171z"/></svg>'));
        if(data.newOrders !== undefined) statsContainer.appendChild(createStatCard('Novos Pedidos', data.newOrders, 'orders', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-box-seam-fill" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M15.528 2.973a.75.75 0 0 1 .472.696v8.662a.75.75 0 0 1-.472.696l-7.25 2.9a.75.75 0 0 1-.557 0l-7.25-2.9A.75.75 0 0 1 0 12.331V3.669a.75.75 0 0 1 .471-.696L7.723.174a.75.75 0 0 1 .554 0zM10.4 6.33a1 1 0 0 0-1.968-.267l-2.5 7.5a1 1 0 1 0 1.968.267l2.5-7.5ZM4.773 6.273 7.25 7.184l-2.115 2.46a1 1 0 1 0 1.741 1.012l2.115-2.46 1.17.418a1 1 0 1 0 .495-1.898l-1.17-.418 2.115-2.46a1 1 0 1 0-1.741-1.012L8.75 6.184l-1.227-.912a1 1 0 0 0-1.248 1.621l-.002-.001Z"/></svg>'));
        if(data.totalProducts !== undefined) statsContainer.appendChild(createStatCard('Total Produtos', data.totalProducts, 'products', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-tags-fill" viewBox="0 0 16 16"><path d="M2 2a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 2 6.586zm3.5 4a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3"/><path d="M1.293 7.793A1 1 0 0 1 1 7.086V2a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l.043-.043z"/></svg>'));
        if(data.pendingOrders !== undefined) statsContainer.appendChild(createStatCard('Pedidos Pendentes', data.pendingOrders, 'pending', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-clock-history" viewBox="0 0 16 16"><path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022zm2.004.45a7 7 0 0 0-.985-.299l.219-.976q.576.129 1.126.342zm1.37.71a7 7 0 0 0-.439-.27l.493-.87a8 8 0 0 1 .979.654l-.615.789a7 7 0 0 0-.418-.302zm1.834 1.79a7 7 0 0 0-.653-.796l.724-.69a8 8 0 0 1 1.14 1.118l-.876.52zm.267 1.405a7 7 0 0 0-.184-.841l.892-.434a8 8 0 0 1 .45 1.088l-.95.313a7 7 0 0 0-.179-.483m-1.56 2.39a7 7 0 0 0-.258-.8l.87-.53a8 8 0 0 1 .73 1.253l-.968.29zM11.342 12a7 7 0 0 0 .439.27l.493.87a8 8 0 0 1-.979-.654l.615-.789a7 7 0 0 0 .418.302zm-1.834-1.79a7 7 0 0 0 .653.796l.724.69a8 8 0 0 1-1.14-1.118l.876-.52zm-1.555.41a7 7 0 0 0 .258.8l.87.53A8 8 0 0 1 9 13.033l.968-.29zm-2.58.386a7 7 0 0 0 .985.299l.219.976A8 8 0 0 1 8 16a8 8 0 0 1-.589-.022l.219-.976q.576.129 1.126.342zm-1.37-.71a7 7 0 0 0 .439.27l-.493.87a8 8 0 0 1-.979-.654l.615-.789a7 7 0 0 0 .418.302zm-1.834-1.79a7 7 0 0 0 .653.796l-.724.69a8 8 0 0 1-1.14-1.118l.876-.52zm-.267-1.405a7 7 0 0 0 .184.841l-.892.434a8 8 0 0 1-.45-1.088l.95-.313a7 7 0 0 0 .179-.483m1.56-2.39a7 7 0 0 0 .258.8l-.87.53a8 8 0 0 1-.73-1.253l.968-.29zM4.658 12A7 7 0 0 0 8 12.5a7 7 0 0 0 3.342-.514l-.876-.52a7 7 0 0 1-.653.796l.724.69a8 8 0 0 0 1.14-1.118l-.876.52A7 7 0 0 0 8 13.5a7 7 0 0 0-3.342.514l.876.52a7 7 0 0 1 .653-.796l-.724-.69a8 8 0 0 0-1.14 1.118l.876-.52z"/><path d="M8 5.5a.5.5 0 0 1 .5.5v2.5a.5.5 0 0 1-.5.5H6a.5.5 0 0 1 0-1h2V6a.5.5 0 0 1 .5-.5"/></svg>'));

        // Render Recent Activity
        if(recentActivityList && data.recentActivity) {
             console.log("loadDashboardStats: Rendering recent activity...");
             recentActivityList.innerHTML = '';
             if (data.recentActivity.length > 0) {
                 data.recentActivity.forEach(activity => {
                     recentActivityList.appendChild(createActivityItem(activity));
                 });
             } else {
                  recentActivityList.innerHTML = '<li>Nenhuma atividade recente.</li>';
             }
        } else if (recentActivityList) {
            recentActivityList.innerHTML = '<li>Nenhuma atividade recente.</li>';
        }

         // Render Popular Products
         if(popularProductsList && data.popularProducts) {
             console.log("loadDashboardStats: Rendering popular products...");
             popularProductsList.innerHTML = '';
             if (data.popularProducts.length > 0) {
                 data.popularProducts.forEach(product => {
                      popularProductsList.appendChild(createPopularProductItem(product));
                 });
            } else {
                 popularProductsList.innerHTML = '<li>Nenhum produto popular.</li>';
            }
         } else if (popularProductsList) {
            popularProductsList.innerHTML = '<li>Nenhum produto popular.</li>';
         }
         console.log("loadDashboardStats: Rendering complete.");

    } catch (error) {
        console.error("loadDashboardStats: Error loading dashboard data:", error);
        // Ensure spinners are replaced with error messages
        if (statsContainer) statsContainer.innerHTML = '<p class="error-message">Erro ao carregar estatísticas.</p>';
        if(recentActivityList) recentActivityList.innerHTML = '<li>Erro ao carregar atividades.</li>';
        if(popularProductsList) popularProductsList.innerHTML = '<li>Erro ao carregar produtos populares.</li>';
    }
}


function createStatCard(label, value, typeClass, iconHtml) {
    const card = createElement('div', { class: `stat-card ${typeClass}` });
    const iconDiv = createElement('div', { class: 'stat-icon' });
    iconDiv.innerHTML = iconHtml; // Use innerHTML for SVG string
    const infoDiv = createElement('div', { class: 'stat-info' });
    infoDiv.appendChild(createElement('span', { class: 'stat-value', text: value }));
    infoDiv.appendChild(createElement('span', { class: 'stat-label', text: label }));
    card.appendChild(iconDiv);
    card.appendChild(infoDiv);
    return card;
}

function createActivityItem(activity) {
     const li = createElement('li');
     const iconSpan = createElement('span', {class: 'activity-icon'});
     // Basic icon mapping - can be improved
     let iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.064.293.006.399.287.47l.45.082.082.38-.229.287a.5.5 0 0 1-.732 0l-.21-.29-.29-.21a.5.5 0 0 1 0-.732l.29-.21.21-.29.287-.229.082-.45-.083-.45-.38-.082a.5.5 0 0 1-.47-.288l-.346-.738c-.064-.135.02-.287.176-.352l.45-.083.38-.082.082-.38-.287-.229a.5.5 0 0 1 0-.732l.21-.29.29-.21.732 0zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/></svg>';
     if (activity.type === 'order') iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart" viewBox="0 0 16 16"><path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/></svg>';
     if (activity.type === 'product') iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-tag" viewBox="0 0 16 16"><path d="M6 4.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m-1 0a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0"/><path d="M2 1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 1 6.586V2a1 1 0 0 1 1-1m0 5.586 7 7L13.586 9l-7-7H2z"/></svg>';
     if (activity.type === 'login') iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-check" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M15.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L12.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0"/><path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/></svg>';
     iconSpan.innerHTML = iconSvg;

     li.appendChild(iconSpan);
     li.appendChild(createElement('span', {class: 'activity-description', text: activity.description}));
     li.appendChild(createElement('span', {class: 'activity-time', text: activity.time}));
     return li;
}

function createPopularProductItem(product) {
     const li = createElement('li', {class: 'popular-product-item'});
     li.appendChild(createElement('a', { href: `product-edit.html?id=${product.id}`, text: product.name }));
     li.appendChild(createElement('span', { class: 'sales-count', text: `${product.salesCount} vendas` }));

     // Add styles if needed - Check if already added
     if (!qs('style#popular-product-styles')) {
          const style = document.createElement('style');
          style.id = 'popular-product-styles';
          style.textContent = `
              .popular-product-item { display: flex; justify-content: space-between; align-items: center; padding: var(--spacing-xs) 0; border-bottom: 1px dashed var(--neutral-lighter); font-size: var(--font-size-sm); }
              .popular-product-item:last-child { border-bottom: none; }
              .popular-product-item a { color: var(--accent-blue); }
              .popular-product-item .sales-count { color: var(--neutral-medium); font-size: 0.9em; }
          `;
         document.head.appendChild(style);
     }

     return li;
}
