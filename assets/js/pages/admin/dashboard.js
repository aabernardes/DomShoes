function createPopularProductItem(product) {
     const li = createElement('li', {class: 'popular-product-item'});
     li.appendChild(createElement('a', { href: `product-edit.html?id=${product.id}`, text: product.name }));
     li.appendChild(createElement('span', { class: 'sales-count', text: `${product.salesCount} vendas` }));


     return li;
}