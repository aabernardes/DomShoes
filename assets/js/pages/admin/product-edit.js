import { qs, on, getUrlParameter, createElement } from '../../modules/utils.js';
import { getProductById, saveProduct, getCategories } from '../../modules/api.js';
import { validateForm, checkRequired, checkNumber } from '../../modules/validation.js'; // Add more rules as needed

document.addEventListener('DOMContentLoaded', () => {
    console.log("Admin Product Edit JS loaded.");
    setActiveNavLink();

    const productForm = qs('#product-form');
    const pageTitleElement = qs('#product-edit-title');
    const productIdField = qs('#productId'); // Hidden input for ID
    const categorySelect = qs('#productCategory');

    if (!productForm || !pageTitleElement || !categorySelect) {
        console.error("Required form elements not found.");
        return;
    }

    const productId = getUrlParameter('id');
    const isEditing = !!productId;

    // --- Load Categories ---
    loadCategories(categorySelect);


    // --- Load Product Data if Editing ---
    if (isEditing) {
        pageTitleElement.textContent = 'Editar Produto';
        productIdField.value = productId;
        loadProductData(productId, productForm);
    } else {
        pageTitleElement.textContent = 'Adicionar Novo Produto';
    }


    // --- Form Submission ---
    on(productForm, 'submit', async (event) => {
        event.preventDefault();
        const submitButton = qs('button[type="submit"]', productForm);

        // Define validation rules
        const rules = {
            'productName': [checkRequired],
            'productCategory': [checkRequired],
            'productPrice': [(input) => checkNumber(input, 'Preço', { min: 0.01, allowDecimal: true, allowNegative: false })],
            'productDescription': [checkRequired], // Add more rules like checkLength if needed
            // Add validation for image upload if implemented beyond simulation
        };

        if (validateForm(productForm, rules)) {
            submitButton.disabled = true;
            submitButton.textContent = isEditing ? 'Salvando...' : 'Adicionando...';

            // Gather form data
            // For file inputs, you'd need FormData, but we'll simulate with the existing value if editing
            const formData = {
                id: isEditing ? parseInt(productId, 10) : null,
                name: qs('#productName').value,
                category: qs('#productCategory').value,
                price: parseFloat(qs('#productPrice').value.replace(',', '.')), // Ensure correct number format
                description: qs('#productDescription').value,
                image: qs('#productImagePreview') ? qs('#productImagePreview').src : 'assets/images/products/placeholder-shoe-1.png', // Simulate: use existing or default
                featured: qs('#productFeatured').checked
            };

            // Simulate image upload if a new file is selected
            const imageInput = qs('#productImage');
            if (imageInput && imageInput.files && imageInput.files[0]) {
                 console.log("Simulating image upload for:", imageInput.files[0].name);
                 // In a real app, upload the file and get the URL
                 // For simulation, we might just use a generic placeholder or keep the existing one
                  // formData.image = 'path/to/uploaded/image.jpg'; // Update with actual URL after upload
                  formData.image = URL.createObjectURL(imageInput.files[0]); // TEMPORARY: Use blob URL for preview, won't persist!
                  // Or just keep the default/existing image path for pure simulation
                  // formData.image = 'assets/images/products/placeholder-new.png';
            }


            try {
                const result = await saveProduct(formData);

                if (result.success) {
                     // Show success toast
                     // showToast(result.message, 'success');
                     alert(result.message); // Simple alert for now

                    // Redirect back to products list after a short delay
                    setTimeout(() => {
                        window.location.href = 'products.html';
                    }, 1000);

                } else {
                     alert(`Erro ao salvar produto: ${result.message || 'Erro desconhecido.'}`);
                     submitButton.disabled = false;
                     submitButton.textContent = isEditing ? 'Salvar Alterações' : 'Adicionar Produto';
                }
            } catch (error) {
                console.error("Error saving product:", error);
                alert("Ocorreu um erro inesperado ao salvar o produto.");
                 submitButton.disabled = false;
                 submitButton.textContent = isEditing ? 'Salvar Alterações' : 'Adicionar Produto';
            }

        } else {
            // Validation failed - messages shown by validateForm
            alert("Por favor, corrija os erros no formulário.");
        }
    });

     // --- Image Preview ---
     const imageInput = qs('#productImage');
     const imagePreview = qs('#productImagePreview');
     if (imageInput && imagePreview) {
         on(imageInput, 'change', (event) => {
             const file = event.target.files[0];
             if (file && file.type.startsWith('image/')) {
                 const reader = new FileReader();
                 reader.onload = (e) => {
                     imagePreview.src = e.target.result;
                     imagePreview.style.display = 'block';
                 }
                 reader.readAsDataURL(file);
             } else {
                 // Reset preview if file is not an image or is cleared
                 imagePreview.src = '#'; // Or original image if editing
                  const originalImageUrl = productForm.dataset.originalImage || 'assets/images/products/placeholder-shoe-1.png';
                  imagePreview.src = originalImageUrl;
                 // imagePreview.style.display = 'none';
             }
         });
     }

});


function setActiveNavLink() {
    qsa('.admin-nav a.active').forEach(link => link.classList.remove('active'));
    const productsLink = qs('.admin-nav a[href="products.html"]');
    if (productsLink) {
        productsLink.classList.add('active');
    }
}

async function loadProductData(productId, form) {
    const loadingDiv = createElement('div', {text: 'Carregando dados do produto...'});
    form.prepend(loadingDiv); // Add loading indicator

     try {
        const product = await getProductById(productId);
        loadingDiv.remove(); // Remove indicator

        if (product) {
            qs('#productName', form).value = product.name;
            qs('#productCategory', form).value = product.category; // Ensure category exists in select
            qs('#productPrice', form).value = product.price.toFixed(2).replace('.', ','); // Format for input type="text" if needed, or just number for type="number"
             qs('#productDescription', form).value = product.description;
             qs('#productFeatured', form).checked = product.featured;

             // Set image preview
             const imagePreview = qs('#productImagePreview', form);
             if (imagePreview) {
                 imagePreview.src = product.image;
                 imagePreview.style.display = 'block';
                 form.dataset.originalImage = product.image; // Store original image path
             }

        } else {
            alert("Produto não encontrado.");
            // Redirect back to list?
             window.location.href = 'products.html';
        }
    } catch (error) {
        console.error("Error loading product data:", error);
         loadingDiv.textContent = 'Erro ao carregar dados.';
        alert("Erro ao carregar dados do produto.");
    }
}

async function loadCategories(selectElement) {
    try {
        const categories = await getCategories();
        const currentValue = selectElement.value; // Preserve current value if editing
        selectElement.innerHTML = '<option value="">Selecione...</option>'; // Default option
        categories.forEach(cat => {
            selectElement.appendChild(createElement('option', { value: cat, text: cat }));
        });
        if(currentValue) {
            selectElement.value = currentValue; // Restore selected value
        }
    } catch (error) {
        console.error("Error loading categories:", error);
         selectElement.innerHTML = '<option value="">Erro ao carregar</option>';
    }
}
