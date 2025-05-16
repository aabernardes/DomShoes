import { qs, on, getCurrentUser, setCurrentUser, showToast } from '../../modules/utils.js';
import { checkRequired, checkEmail, validateForm } from '../../modules/validation.js';
// Assume an API function `updateUserProfile` exists in api.js (even if just simulated)
// import { updateUserProfile } from '../../modules/api.js';

document.addEventListener('DOMContentLoaded', () => {
    const profileForm = qs('#profile-form');
    const ordersLink = qs('#orders-link');
    const logoutButton = qs('#logout-button');

    const user = getCurrentUser();

    if (!user) {
        // If not logged in, redirect to login page
        window.location.href = '/store/login.html';
        return; // Stop further execution
    }

    if (!profileForm) {
        console.warn("Profile form not found.");
        return;
    }

    // Populate form with user data
    populateProfileForm(profileForm, user);

    // Handle form submission (Profile Update)
    on(profileForm, 'submit', async (event) => {
        event.preventDefault();
        const submitButton = qs('button[type="submit"]', profileForm);

        const validationRules = {
            'profileName': [checkRequired],
            'profileEmail': [checkRequired, checkEmail],
            // Add other fields as needed
        };

        if (validateForm(profileForm, validationRules)) {
            submitButton.disabled = true;
            submitButton.textContent = 'Salvando...';

            const updatedData = {
                name: qs('#profileName', profileForm).value,
                email: qs('#profileEmail', profileForm).value,
                // Gather other fields
            };

            try {
                // Simulate API call to update profile
                console.log("Simulating profile update with data:", updatedData);
                // const result = await updateUserProfile(user.id, updatedData); // Assuming API exists
                 await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
                 const result = { success: true, user: { ...user, ...updatedData }, message: "Perfil atualizado com sucesso!" }; // Mock success


                if (result.success) {
                    setCurrentUser(result.user); // Update localStorage
                    showToast(result.message, 'success');
                    populateProfileForm(profileForm, result.user); // Re-populate form
                } else {
                    showToast(result.message || "Erro ao atualizar perfil.", 'error');
                }
            } catch (error) {
                console.error("Error updating profile:", error);
                showToast("Ocorreu um erro inesperado.", 'error');
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = 'Salvar Alterações';
            }
        } else {
            showToast("Por favor, corrija os erros no formulário.", 'error');
        }
    });

    // Handle Orders Link
    if (ordersLink) {
        on(ordersLink, 'click', (e) => {
            e.preventDefault();
            window.location.href = '/store/orders.html';
        });
    }

    // Handle Logout Button
    if (logoutButton) {
        on(logoutButton, 'click', (e) => {
            e.preventDefault();
            setCurrentUser(null); // Clear user from localStorage
            showToast("Você foi desconectado.", 'info');
            setTimeout(() => window.location.href = '/store/index.html', 1000); // Redirect to home
        });
    }
});


function populateProfileForm(form, userData) {
    if (!form || !userData) return;

    const nameInput = qs('#profileName', form);
    const emailInput = qs('#profileEmail', form);
    // Get other input elements

    if (nameInput) nameInput.value = userData.name || '';
    if (emailInput) emailInput.value = userData.email || '';
    // Set values for other fields
}
