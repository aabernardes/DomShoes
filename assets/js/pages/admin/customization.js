import { qs, on, createElement } from '../../modules/utils.js';
import { getSiteCustomization, saveSiteCustomization } from '../../modules/api.js'; // Assuming API functions

document.addEventListener('DOMContentLoaded', () => {
    console.log("Admin Customization JS loaded.");
    setActiveNavLink();

    const customizationForm = qs('#customization-form');
    if (!customizationForm) {
        console.error("Customization form not found.");
        return;
    }

    loadCustomizationData(customizationForm);

    // Form Submission
    on(customizationForm, 'submit', async (event) => {
        event.preventDefault();
        const submitButton = qs('button[type="submit"]', customizationForm);
        submitButton.disabled = true;
        submitButton.textContent = 'Salvando...';

        // Basic validation (can be enhanced)
        let isValid = true;
        const couponDiscountInput = qs('#couponDiscount', customizationForm);
        if (isNaN(parseFloat(couponDiscountInput.value)) || parseFloat(couponDiscountInput.value) < 0) {
            isValid = false;
            // Use validation module's showError if available
             couponDiscountInput.classList.add('is-invalid');
             let feedback = couponDiscountInput.nextElementSibling;
             if(!feedback || !feedback.classList.contains('invalid-feedback')) {
                feedback = createElement('div', {class: 'invalid-feedback'});
                couponDiscountInput.parentNode.insertBefore(feedback, couponDiscountInput.nextSibling);
             }
             feedback.textContent = 'Desconto deve ser um número positivo.';
             feedback.style.display = 'block';
        } else {
            couponDiscountInput.classList.remove('is-invalid');
            let feedback = couponDiscountInput.nextElementSibling;
            if(feedback && feedback.classList.contains('invalid-feedback')) {
                feedback.style.display = 'none';
            }
        }


        if (isValid) {
            // Gather form data
            const settingsData = {
                heroBannerText: qs('#heroBannerText', customizationForm).value,
                heroBannerImage: qs('#heroBannerImagePreview') ? qs('#heroBannerImagePreview').src : '', // Simulate: use preview or hidden field
                activeCouponCode: qs('#activeCouponCode', customizationForm).value,
                couponDiscount: parseFloat(qs('#couponDiscount', customizationForm).value) || 0,
            };

             // Simulate image upload if a new file is selected
            const imageInput = qs('#heroBannerImage');
            if (imageInput && imageInput.files && imageInput.files[0]) {
                 console.log("Simulating hero banner image upload for:", imageInput.files[0].name);
                 // In real app: upload file, get URL, save URL
                 // Simulation: Use a placeholder path or keep existing
                 settingsData.heroBannerImage = 'assets/images/banners/banner-placeholder-updated.jpg'; // Example placeholder
                 // Or use Blob URL for temporary preview:
                 // settingsData.heroBannerImage = URL.createObjectURL(imageInput.files[0]);
            } else {
                 // If no new file, keep the existing image path stored perhaps in data attribute or hidden field
                 settingsData.heroBannerImage = customizationForm.dataset.currentBannerImage || 'assets/images/banners/banner-placeholder-1.jpg';
            }


            try {
                const result = await saveSiteCustomization(settingsData);
                if (result.success) {
                    alert(result.message || "Configurações salvas com sucesso!");
                    // Optionally reload data or just update button state
                     customizationForm.dataset.currentBannerImage = settingsData.heroBannerImage; // Update stored image path
                } else {
                    alert(`Erro ao salvar configurações: ${result.message || 'Erro desconhecido.'}`);
                }
            } catch (error) {
                console.error("Error saving customization:", error);
                alert("Ocorreu um erro inesperado ao salvar as configurações.");
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = 'Salvar Alterações';
            }
        } else {
             alert("Por favor, corrija os erros no formulário.");
             submitButton.disabled = false;
             submitButton.textContent = 'Salvar Alterações';
        }
    });


     // --- Banner Image Preview ---
     const imageInput = qs('#heroBannerImage');
     const imagePreview = qs('#heroBannerImagePreview');
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
                  const originalImageUrl = customizationForm.dataset.currentBannerImage || 'assets/images/banners/banner-placeholder-1.jpg';
                  imagePreview.src = originalImageUrl;
             }
         });
     }

});


function setActiveNavLink() {
    qsa('.admin-nav a.active').forEach(link => link.classList.remove('active'));
    const customizationLink = qs('.admin-nav a[href="customization.html"]');
    if (customizationLink) {
        customizationLink.classList.add('active');
    }
}

async function loadCustomizationData(form) {
     const loadingDiv = createElement('div', {text: 'Carregando configurações...'});
     form.prepend(loadingDiv);

    try {
        const settings = await getSiteCustomization();
        loadingDiv.remove();

        if (settings) {
            qs('#heroBannerText', form).value = settings.heroBannerText || '';
            qs('#activeCouponCode', form).value = settings.activeCouponCode || '';
            qs('#couponDiscount', form).value = settings.couponDiscount !== undefined ? settings.couponDiscount : '';

            // Set image preview and store current path
            const imagePreview = qs('#heroBannerImagePreview', form);
             if (imagePreview) {
                imagePreview.src = settings.heroBannerImage || 'assets/images/banners/banner-placeholder-1.jpg';
                imagePreview.style.display = 'block';
                 form.dataset.currentBannerImage = settings.heroBannerImage; // Store path
             }
        } else {
             form.innerHTML = '<p class="error-message">Não foi possível carregar as configurações.</p>';
        }
    } catch (error) {
        console.error("Error loading customization data:", error);
        loadingDiv.textContent = 'Erro ao carregar dados.';
        alert("Erro ao carregar configurações.");
    }
}
