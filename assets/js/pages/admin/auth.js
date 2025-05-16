import { qs, on, setAdminLoggedIn } from '../../modules/utils.js';
import { loginAdmin } from '../../modules/api.js'; // Assuming API function
import { checkRequired } from '../../modules/validation.js';

document.addEventListener('DOMContentLoaded', () => {
    const adminLoginForm = qs('#admin-login-form');

    if (adminLoginForm) {
        on(adminLoginForm, 'submit', async (event) => {
            event.preventDefault();
            const submitButton = qs('button[type="submit"]', adminLoginForm);
            const usernameInput = qs('#adminUsername', adminLoginForm);
            const passwordInput = qs('#adminPassword', adminLoginForm);
            const errorElement = qs('#login-error-message', adminLoginForm); // Assuming an error display element exists

            // Clear previous errors
            if(errorElement) errorElement.style.display = 'none';
            usernameInput.classList.remove('is-invalid');
            passwordInput.classList.remove('is-invalid');

            // Basic Validation
            let isValid = true;
            if (!checkRequired(usernameInput, 'Usuário')) {
                 isValid = false;
                 // showError(usernameInput, 'Usuário é obrigatório'); // Use if validation.js is enhanced
            }
            if (!checkRequired(passwordInput, 'Senha')) {
                 isValid = false;
                 // showError(passwordInput, 'Senha é obrigatória');
            }

            if (!isValid) {
                if(errorElement) {
                    errorElement.textContent = 'Por favor, preencha usuário e senha.';
                    errorElement.style.display = 'block';
                }
                return; // Stop submission
            }


            submitButton.disabled = true;
            submitButton.textContent = 'Entrando...';

            try {
                const result = await loginAdmin(usernameInput.value, passwordInput.value);

                if (result.success) {
                    setAdminLoggedIn(true); // Set flag in localStorage
                    console.log("Admin login successful");
                    // Redirect to dashboard
                    window.location.href = 'dashboard.html';
                }
                 // API handles incorrect password via reject
            } catch (error) {
                console.error("Admin login failed:", error);
                 if (errorElement) {
                     errorElement.textContent = error.message || "Usuário ou senha inválidos.";
                     errorElement.style.display = 'block';
                 }
                usernameInput.classList.add('is-invalid');
                passwordInput.classList.add('is-invalid');
                 submitButton.disabled = false;
                 submitButton.textContent = 'Entrar';
            }
        });
    }
});
