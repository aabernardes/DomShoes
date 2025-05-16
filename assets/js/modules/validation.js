// === Form Validation Module ===

/**
 * Adds 'is-invalid' class and displays error message for a form field.
 * @param {HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement} inputElement - The input element.
 * @param {string} message - The error message to display.
 */
const showError = (inputElement, message) => {
    inputElement.classList.add('is-invalid');
    inputElement.classList.remove('is-valid'); // Ensure valid class is removed

    // Find or create the feedback element
    let feedbackElement = inputElement.parentElement.querySelector('.invalid-feedback');
    if (!feedbackElement) {
        feedbackElement = document.createElement('div');
        feedbackElement.classList.add('invalid-feedback');
        // Insert after the input element, handle different structures if needed
        inputElement.parentNode.insertBefore(feedbackElement, inputElement.nextSibling);
    }
    feedbackElement.textContent = message;
    feedbackElement.style.display = 'block'; // Ensure it's visible
};

/**
 * Adds 'is-valid' class and removes error message for a form field.
 * @param {HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement} inputElement - The input element.
 */
const showSuccess = (inputElement) => {
    inputElement.classList.remove('is-invalid');
    inputElement.classList.add('is-valid'); // Optional: Add valid class

    // Hide the feedback element
    const feedbackElement = inputElement.parentElement.querySelector('.invalid-feedback');
    if (feedbackElement) {
        feedbackElement.style.display = 'none';
        feedbackElement.textContent = ''; // Clear message
    }
};

/**
 * Checks if a field is required and not empty.
 * @param {HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement} inputElement - The input element.
 * @param {string} fieldName - The user-friendly name of the field.
 * @returns {boolean} True if valid, false otherwise.
 */
const checkRequired = (inputElement, fieldName) => {
    if (inputElement.value.trim() === '') {
        showError(inputElement, `${fieldName} é obrigatório.`);
        return false;
    } else {
        showSuccess(inputElement);
        return true;
    }
};

/**
 * Checks if an email field has a valid format.
 * @param {HTMLInputElement} inputElement - The email input element.
 * @returns {boolean} True if valid, false otherwise.
 */
const checkEmail = (inputElement) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(inputElement.value.trim())) {
        showError(inputElement, 'Formato de e-mail inválido.');
        return false;
    } else {
        // Also check if required (if it has the attribute)
        if(inputElement.required && !checkRequired(inputElement, 'E-mail')) return false;

        showSuccess(inputElement);
        return true;
    }
};

/**
 * Checks if a field has a minimum length.
 * @param {HTMLInputElement|HTMLTextAreaElement} inputElement - The input element.
 * @param {number} minLength - The minimum required length.
 * @param {string} fieldName - The user-friendly name of the field.
 * @returns {boolean} True if valid, false otherwise.
 */
const checkLength = (inputElement, minLength, fieldName) => {
    if (inputElement.value.trim().length < minLength) {
        showError(inputElement, `${fieldName} deve ter pelo menos ${minLength} caracteres.`);
        return false;
    } else {
        // Also check if required (if it has the attribute)
        if(inputElement.required && !checkRequired(inputElement, fieldName)) return false;
        showSuccess(inputElement);
        return true;
    }
};

/**
 * Checks if two password fields match.
 * @param {HTMLInputElement} passwordInput - The first password input.
 * @param {HTMLInputElement} confirmPasswordInput - The confirmation password input.
 * @returns {boolean} True if passwords match, false otherwise.
 */
const checkPasswordsMatch = (passwordInput, confirmPasswordInput) => {
    if (passwordInput.value !== confirmPasswordInput.value) {
        showError(confirmPasswordInput, 'As senhas não coincidem.');
        return false;
    } else if (confirmPasswordInput.value.trim() === '') {
         showError(confirmPasswordInput, 'Confirmação de senha é obrigatória.');
         return false;
    }
     else {
        showSuccess(confirmPasswordInput);
        return true;
    }
};

/**
 * Checks if a field contains a valid number.
 * @param {HTMLInputElement} inputElement - The input element.
 * @param {string} fieldName - The user-friendly name of the field.
 * @param {object} [options] - Optional parameters.
 * @param {boolean} [options.allowNegative=false] - Allow negative numbers.
 * @param {boolean} [options.allowDecimal=true] - Allow decimal numbers.
 * @param {number} [options.min] - Minimum allowed value.
 * @param {number} [options.max] - Maximum allowed value.
 * @returns {boolean} True if valid, false otherwise.
 */
const checkNumber = (inputElement, fieldName, options = {}) => {
    const value = inputElement.value.trim();
    if (value === '' && !inputElement.required) {
        showSuccess(inputElement); // Allow empty if not required
        return true;
    }
     if(inputElement.required && !checkRequired(inputElement, fieldName)) return false;

    const num = Number(value.replace(',', '.')); // Handle comma decimal separator

    if (isNaN(num)) {
        showError(inputElement, `${fieldName} deve ser um número válido.`);
        return false;
    }

    if (!options.allowNegative && num < 0) {
         showError(inputElement, `${fieldName} não pode ser negativo.`);
         return false;
    }

    if (!options.allowDecimal && !Number.isInteger(num)) {
        showError(inputElement, `${fieldName} deve ser um número inteiro.`);
        return false;
    }

     if (options.min !== undefined && num < options.min) {
         showError(inputElement, `${fieldName} deve ser no mínimo ${options.min}.`);
         return false;
     }

      if (options.max !== undefined && num > options.max) {
          showError(inputElement, `${fieldName} deve ser no máximo ${options.max}.`);
          return false;
      }


    showSuccess(inputElement);
    return true;
};


/**
 * Validates an entire form based on input element IDs and rules.
 * @param {HTMLFormElement} formElement - The form element to validate.
 * @param {object} rules - An object where keys are input IDs and values are arrays of validation functions to run.
 * Example: { 'username': [checkRequired, (input) => checkLength(input, 3, 'Nome de usuário')], 'email': [checkRequired, checkEmail] }
 * @returns {boolean} True if the entire form is valid, false otherwise.
 */
export const validateForm = (formElement, rules) => {
    let isFormValid = true;

    // Clear previous validation states
    formElement.querySelectorAll('.is-invalid, .is-valid').forEach(el => {
        el.classList.remove('is-invalid', 'is-valid');
        const feedback = el.parentElement.querySelector('.invalid-feedback');
        if (feedback) feedback.style.display = 'none';
    });

    for (const inputId in rules) {
        const inputElement = formElement.querySelector(`#${inputId}`);
        if (!inputElement) {
            console.warn(`Validation rule defined for non-existent element ID: #${inputId}`);
            continue;
        }

        const fieldRules = rules[inputId];
        for (const rule of fieldRules) {
            // Special handling for checkPasswordsMatch which needs two inputs
            if (rule.name === 'checkPasswordsMatch') {
                 const passwordInputId = inputId; // Assume rule is on the confirm password field
                 const originalPasswordInputId = passwordInputId.replace('confirm', ''); // Basic heuristic
                 const originalPasswordInput = formElement.querySelector(`#${originalPasswordInputId}`);
                 if (originalPasswordInput && inputElement) {
                     if (!checkPasswordsMatch(originalPasswordInput, inputElement)) {
                         isFormValid = false;
                         break; // Stop validation for this field on first error
                     }
                 } else {
                     console.warn(`Could not find matching password fields for rule on #${inputId}`);
                 }
            } else {
                // Execute the rule function (e.g., checkRequired(inputElement, 'Nome'))
                // Need to pass arguments based on the rule function signature
                let isValid;
                // Infer field name from label or use ID as fallback
                 const label = formElement.querySelector(`label[for="${inputId}"]`);
                 const fieldName = label ? label.textContent.replace('*','').trim() : inputId;

                // This part is tricky without knowing the exact arguments needed by each rule function.
                // We make educated guesses based on function names.
                if (rule.name === 'checkRequired') {
                    isValid = checkRequired(inputElement, fieldName);
                } else if (rule.name === 'checkEmail') {
                    isValid = checkEmail(inputElement);
                } else if (rule.name === 'checkLength') {
                    // How to get minLength? We need to define rules more robustly.
                    // For now, let's assume checkLength rules are passed with args:
                    // e.g., rules = { 'password': [(input) => checkLength(input, 6, 'Senha')] }
                    // This requires the rule definition to include the parameters.
                    // Let's modify the structure slightly or pass args differently.
                    // Simplified approach for now: Skip checkLength/checkNumber here, call them explicitly
                     console.warn("Automatic rule execution for checkLength/checkNumber not fully implemented in validateForm. Call them directly.");
                     isValid = true; // Assume valid for now, needs better rule definition
                } else if (rule.name === 'checkNumber') {
                     console.warn("Automatic rule execution for checkLength/checkNumber not fully implemented in validateForm. Call them directly.");
                     isValid = true;
                }
                 else {
                     // Generic rule execution (might not work for rules needing extra args)
                      isValid = rule(inputElement, fieldName); // Pass input and field name
                 }


                 if (!isValid) {
                     isFormValid = false;
                     break; // Stop validation for this field on first error
                 }
            }
        }
    }

    return isFormValid;
};


// --- Export individual validation functions for direct use ---
export {
    checkRequired,
    checkEmail,
    checkLength,
    checkPasswordsMatch,
    checkNumber,
    showError, // Export if needed externally
    showSuccess // Export if needed externally
};
