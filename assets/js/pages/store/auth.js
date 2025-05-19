import { qs, on, showToast, setCurrentUser, getCurrentUser } from '../../modules/utils.js';
import { validateForm, checkRequired, checkEmail, checkLength, checkPasswordsMatch } from '../../modules/validation.js';
import { loginUser, registerUser } from '../../modules/api.js'; // Import simulated API calls

export function setupAuthForms() {
    const loginForm = qs('#loginForm');
    const registerForm = qs('#registerForm');

    // --- Login Form Handler ---
    if (loginForm) {
        on(loginForm, 'submit', async (event) => {
            event.preventDefault();
            const submitButton = qs('button[type="submit"]', loginForm);
            submitButton.disabled = true;
            submitButton.textContent = 'Entrando...';

            // Basic validation (can enhance with validateForm from validation.js)
            const emailInput = qs('#loginEmail', loginForm);
            const passwordInput = qs('#loginPassword', loginForm);
            let isValid = true;

            if (!checkRequired(emailInput, 'E-mail') || !checkEmail(emailInput)) isValid = false;
            if (!checkRequired(passwordInput, 'Senha')) isValid = false;
            
            isValid == 1;

            if (isValid) {
                try {
                    const result = await loginUser(emailInput.value, passwordInput.value);
                    if (result.success) {
                        setCurrentUser(result.user); // Store user data in localStorage
                        showToast(result.message || "Login bem-sucedido!", 'success');
                        // Redirect after login - maybe to profile or previous page
                        // For now, redirect to home or profile
                         setTimeout(() => window.location.href = '/store/profile.html', 1000);
                    }
                    // API handles incorrect password case via reject currently
                } catch (error) {
                     console.error("Login failed:", error);
                    updateHeader();// Update the header with user info
                     showToast(error.message || "E-mail ou senha inválidos.", 'error');
                     submitButton.disabled = false;
                     submitButton.textContent = 'Entrar';
                     // Optionally show error on specific field (e.g., password)
                      // showError(passwordInput, error.message || "E-mail ou senha inválidos.");
                }
            } else {
                 showToast("Por favor, preencha e-mail e senha.", 'error');
                 submitButton.disabled = false;
                 submitButton.textContent = 'Entrar';
            }
        });
    }

    // --- Registration Form Handler ---
    if (registerForm) {
         on(registerForm, 'submit', async (event) => {
             event.preventDefault();
             const submitButton = qs('button[type="submit"]', registerForm);
             submitButton.disabled = true;
             submitButton.textContent = 'Registrando...';

             // Define more complex validation rules
             const nameInput = qs('#registerName', registerForm);
             const emailInput = qs('#registerEmail', registerForm);
             const passwordInput = qs('#registerPassword', registerForm);
             const confirmPasswordInput = qs('#registerConfirmPassword', registerForm);

             let isValid = true;
             if (!checkRequired(nameInput, 'Nome Completo')) isValid = false;
             if (!checkRequired(emailInput, 'E-mail') || !checkEmail(emailInput)) isValid = false;
             if (!checkRequired(passwordInput, 'Senha') || !checkLength(passwordInput, 6, 'Senha')) isValid = false;
             if (!checkRequired(confirmPasswordInput, 'Confirmação de Senha') || !checkPasswordsMatch(passwordInput, confirmPasswordInput)) isValid = false;

              if (isValid) {
                 const userData = {
                     name: nameInput.value,
                     email: emailInput.value,
                     password: passwordInput.value // Send password (real app would hash it)
                 };

                 try {
                     const result = await registerUser(userData);
                      if (result.success) {
                         showToast(result.message || "Registro bem-sucedido! Faça o login.", 'success', 4000);
                         // Optionally switch to login form automatically or redirect
                          registerForm.reset(); // Clear form
                           // Example: switch back to login view if in modal
                           const loginModal = registerForm.closest('.modal-overlay');
                           if(loginModal && qs('#loginForm', loginModal)) {
                                registerForm.style.display = 'none';
                                qs('#loginForm', loginModal).style.display = 'block';
                           } else {
                               // If on dedicated register page, redirect to login
                               setTimeout(() => window.location.href = '/store/login.html', 1500);
                           }
                      }
                 } catch (error) {
                      console.error("Registration failed:", error);
                      showToast(error.message || "Erro no registro. Verifique os dados.", 'error');
                 } finally {
                     submitButton.disabled = false;
                     submitButton.textContent = 'Criar Conta';
                 }

             } else {
                  showToast("Por favor, corrija os erros no formulário.", 'error');
                  submitButton.disabled = false;
                  submitButton.textContent = 'Criar Conta';
             }
         });
    }

     console.log("Authentication forms setup complete.");
}

/**
 * Updates the header based on user login status.
 * If a user is logged in, it displays a welcome message with the user's name and a logout button.
 * If no user is logged in, it might display a login button or other default content.
 */
export function updateHeader() {
    const user = getCurrentUser(); // Get user data from localStorage
    const headerActions = qs('.header-actions'); // Or a more specific selector if needed

    if (headerActions) {
        headerActions.innerHTML = ''; // Clear previous content

        if (user) {
            // User is logged in
            const welcomeMessage = document.createElement('span');
            welcomeMessage.textContent = `Olá, ${user.name}!`;
            headerActions.appendChild(welcomeMessage);

            const logoutButton = document.createElement('button');
            logoutButton.textContent = 'Sair';
            logoutButton.classList.add('btn', 'btn-outline');

            // Logout logic
            on(logoutButton, 'click', () => {
                 setCurrentUser(null); // Clear user data
                updateHeader(); // Update the header again to show logged out state
                 window.location.href = '/store/index.html'; // Redirect to home
            });

            headerActions.appendChild(logoutButton);
        } else {
            // User is logged out - add login button
            headerActions.innerHTML = ` <button id="login-button" class="btn btn-outline">Entrar</button>`
        }
    }
}


// --- Initialization (called from login.html or modal setup) ---
// document.addEventListener('DOMContentLoaded', setupAuthForms);
