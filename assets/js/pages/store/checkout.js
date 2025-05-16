import { qs, qsa, on, showToast, formatCurrency, createElement } from '../../modules/utils.js';
// Importe funções de validação específicas para os novos campos (CPF, Telefone, CEP, etc.)
// Certifique-se que estas funções existam e retornem true/false E manipulem o feedback visual no DOM
import { validateForm, checkRequired, checkEmail /*, checkCPF, checkPhone, checkCEP, checkCardNumber, checkCardExpiry, checkCardCVC */ } from '../../modules/validation.js';
import { getCartItems, getCartTotal, clearCart } from '../../modules/cart.js';
// Importe a função para submeter o pedido para a API
import { submitOrder /*, calculateShipping, generateBoleto, generatePix */ } from '../../modules/api.js'; // Funções de API adicionais comentadas

document.addEventListener('DOMContentLoaded', () => {
    const checkoutForm = qs('#checkout-form'); // O formulário principal que envolve os passos
    const orderSummaryContainer = qs('#order-summary'); // Área para exibir o resumo
    const stepIndicators = qsa('.step-indicator'); // Indicadores de passo (li)
    const checkoutSteps = qsa('.checkout-step'); // Passos individuais (divs) dentro de .checkout-steps-container
    const nextButtons = qsa('.next-step'); // Botões "Próximo"
    const prevButtons = qsa('.prev-step'); // Botões "Voltar"
    const paymentMethodRadios = qsa('input[name="paymentMethod"]'); // Radio buttons da forma de pagamento
    const paymentMethodDetailsContainers = qsa('.payment-method-details'); // Contêineres de detalhes de pagamento
    const confirmOrderButton = qs('#confirm-order-button'); // Botão final de Confirmar Pedido
    const checkoutMessagesEl = qs('#checkout-messages'); // Área para mensagens de erro/sucesso da submissão

    let currentStepIndex = 0; // Começa no primeiro passo (índice 0)

    // --- Inicialização ---
    if (!checkoutForm || checkoutSteps.length === 0 || stepIndicators.length === 0) {
        console.error("Estrutura de checkout não encontrada completamente na página. Verifique o HTML.");
        // Opcionalmente, exibir uma mensagem de erro amigável ao usuário
        return;
    }

    const items = getCartItems();
    if (items.length === 0) {
        // Redirecionar para o carrinho ou mostrar mensagem se o carrinho estiver vazio
        showToast("Seu carrinho está vazio. Adicione itens antes de finalizar.", "info", 5000);
        // Redireciona após um pequeno delay para o usuário ver a mensagem
        setTimeout(() => window.location.href = '/store/cart.html', 1500);
        return; // Interrompe a execução do script
    }

    // Renderizar resumo do pedido na barra lateral/coluna de resumo
    if(orderSummaryContainer) {
        renderOrderSummary(orderSummaryContainer, items);
    }

    // Mostrar o primeiro passo ao carregar a página
    showStep(currentStepIndex);


    // --- Funções de Navegação entre Passos ---

    /**
     * Mostra um passo específico e atualiza os indicadores visuais.
     * @param {number} index - O índice do passo (0-based) a ser mostrado.
     */
    function showStep(index) {
        // Valida o índice para evitar erros
        if (index < 0 || index >= checkoutSteps.length) {
            console.error("Índice de passo inválido:", index);
            return;
        }

        // Oculta todos os passos e remove a classe 'active'
        checkoutSteps.forEach(step => {
            step.classList.remove('active');
            step.style.display = 'none'; // Garante que está oculto
        });

        // Remove classes 'active' e 'completed' dos indicadores
        stepIndicators.forEach(indicator => {
            indicator.classList.remove('active', 'completed');
        });

        // Mostra o passo atual
        const currentStep = checkoutSteps[index];
        if (currentStep) {
            currentStep.classList.add('active');
            currentStep.style.display = 'block'; // Mostra o passo atual

            // Marca os indicadores até o passo atual
            stepIndicators.forEach((indicator, i) => {
                if (i < index) {
                    indicator.classList.add('completed'); // Passos anteriores estão completos
                } else if (i === index) {
                    indicator.classList.add('active'); // Passo atual está ativo
                }
            });

             // Atualiza o índice do passo atual
             currentStepIndex = index;

             // Se for o último passo (Revisão), preencher o resumo final de revisão
             if (currentStep.id === 'step-review') {
                 populateReviewStep(); // Chame a função para preencher a revisão
                 // Ocultar o botão "Confirmar Pedido" da coluna de resumo até que a revisão seja carregada (opcional)
                 if (confirmOrderButton) confirmOrderButton.style.display = 'block'; // Garante que o botão aparece no último passo
             } else {
                 // Ocultar o botão "Confirmar Pedido" nos passos anteriores à revisão
                 if (confirmOrderButton) confirmOrderButton.style.display = 'none';
             }


             // Rola para o topo da área do formulário ou da janela ao mudar de passo (melhora UX)
             const formArea = qs('.checkout-form-area');
             if (formArea) {
                 formArea.scrollTop = 0; // Tenta rolar o contêiner da área do formulário
             } else {
                 window.scrollTo({ top: 0, behavior: 'smooth' }); // Ou rola a janela inteira suavemente
             }

             // TODO: Opcional: Focar no primeiro campo do novo passo para acessibilidade
             // const firstField = qs('input, select, textarea', currentStep);
             // if(firstField) firstField.focus();
        }
    }

     /**
      * Valida os campos no passo atual antes de avançar.
      * Utilize as funções do módulo validation.js para validação detalhada.
      * @returns {boolean} - True se o passo for válido, false caso contrário.
      */
     function validateCurrentStep() {
         const currentStep = checkoutSteps[currentStepIndex];
         if (!currentStep) return false;

         let isStepValid = true;
         // Seleciona apenas campos que são obrigatórios ou que precisam de validação específica neste passo
         const fieldsToValidate = qsa('input[required], select[required], textarea[required]', currentStep); // Valida campos obrigatórios
         // Adicione outros campos que precisam de validação mesmo que não sejam 'required'
         const additionalFieldsToValidate = qsa('input[pattern], input[type="email"]', currentStep); // Ex: campos com pattern, email

         const allFieldsToValidate = [...fieldsToValidate, ...additionalFieldsToValidate];

         // Limpa feedback de validação anterior para os campos deste passo
         allFieldsToValidate.forEach(field => {
             field.classList.remove('is-invalid', 'is-valid'); // Remove classes de feedback visual
             const feedbackEl = field.nextElementSibling; // Assume que .invalid-feedback é o próximo irmão
             if (feedbackEl && feedbackEl.classList.contains('invalid-feedback')) {
                 feedbackEl.textContent = ''; // Limpa a mensagem de feedback
             }
         });


         // Define as regras de validação para os campos esperados em cada passo
         // TODO: Expanda estas regras para incluir validações de formato (CPF, Telefone, CEP, Cartão, etc.)
         const stepValidationRules = {};

         if (currentStep.id === 'step-contact') {
             stepValidationRules['fullName'] = [checkRequired];
             stepValidationRules['email'] = [checkRequired, checkEmail];
             stepValidationRules['phone'] = [checkRequired /*, checkPhone */]; // TODO: Implement checkPhone
             stepValidationRules['cpf'] = [checkRequired /*, checkCPF */];     // TODO: Implement checkCPF
         } else if (currentStep.id === 'step-shipping') {
             stepValidationRules['zipCode'] = [checkRequired /*, checkCEP */]; // TODO: Implement checkCEP
             stepValidationRules['street'] = [checkRequired];
             stepValidationRules['number'] = [checkRequired];
             // Complemento é opcional, não precisa de checkRequired
             stepValidationRules['neighborhood'] = [checkRequired];
             stepValidationRules['city'] = [checkRequired];
             stepValidationRules['state'] = [checkRequired];
             stepValidationRules['country'] = [checkRequired];
         } else if (currentStep.id === 'step-payment') {
             // Valide a seleção da forma de pagamento
             const selectedPaymentMethodRadio = qs('input[name="paymentMethod"]:checked');
             if (!selectedPaymentMethodRadio) {
                 showToast("Por favor, selecione uma forma de pagamento.", "error");
                 return false; // A forma de pagamento deve ser selecionada
             }

             // Valide os campos específicos da forma de pagamento ativa
             const activePaymentDetailsContainer = qs('.payment-method-details.active');
             if (selectedPaymentMethodRadio.value === 'card' && activePaymentDetailsContainer) {
                 // TODO: Adicionar regras de validação para campos do cartão
                 stepValidationRules['cardName'] = [checkRequired];
                 stepValidationRules['cardNumber'] = [checkRequired /*, checkCardNumber */]; // TODO: Implement checkCardNumber
                 stepValidationRules['cardExpiry'] = [checkRequired /*, checkCardExpiry */]; // TODO: Implement checkCardExpiry
                 stepValidationRules['cardCVC'] = [checkRequired /*, checkCardCVC */];     // TODO: Implement checkCardCVC
                 stepValidationRules['installments'] = [checkRequired]; // Selecionar parcelas
             }
             // Boleto e Pix podem não ter campos extras para validar neste passo, mas a validação de seleção já ocorreu
         } else if (currentStep.id === 'step-review') {
             // O passo de revisão geralmente não tem campos de formulário para validar,
             // a validação principal já aconteceu nos passos anteriores.
             // Apenas verifique se o resumo foi carregado ou se há itens no carrinho (redundante se chegou aqui)
             return true; // Assume válido se chegou ao passo de revisão
         }


         // Execute a validação para os campos encontrados no passo atual com regras definidas
         allFieldsToValidate.forEach(field => {
            let fieldIsValid = true;
            let errorMessage = '';

            if (stepValidationRules[field.id]) { // Verifica se há regras para este campo
                 const rules = stepValidationRules[field.id];
                 for (const rule of rules) { // Itera sobre as regras
                     // Assumindo que as funções de validação retornam true/false E definem a mensagem de erro
                     // ou que você verifica o resultado e define a mensagem aqui
                     if (!rule(field.value)) {
                         fieldIsValid = false;
                         // TODO: Obter a mensagem de erro correta da função de validação ou definir aqui
                         errorMessage = field.validationMessage || `Campo inválido: ${field.id}`; // Fallback message
                         break; // Para de validar este campo após o primeiro erro
                     }
                 }
            }
             // Validação de pattern HTML5 nativa como fallback ou adicional
             if (field.validity && !field.validity.valid) {
                 fieldIsValid = false;
                 errorMessage = field.validationMessage; // Usa a mensagem de erro nativa do pattern
             }


            if (!fieldIsValid) {
                isStepValid = false; // Marca o passo como inválido
                field.classList.add('is-invalid'); // Adiciona classe para feedback visual (vermelho)
                const feedbackEl = field.nextElementSibling;
                if (feedbackEl && feedbackEl.classList.contains('invalid-feedback')) {
                    feedbackEl.textContent = errorMessage; // Exibe a mensagem de erro
                }
            } else {
                 field.classList.add('is-valid'); // Adiciona classe para feedback visual (verde)
            }
         });

         return isStepValid; // Retorna o resultado final da validação do passo
     }


    // --- Manipuladores de Eventos dos Botões de Navegação ---

    // Botões "Próximo"
    nextButtons.forEach(button => {
        on(button, 'click', () => {
            // Valida o passo atual antes de ir para o próximo
            if (validateCurrentStep()) {
                 if (currentStepIndex < checkoutSteps.length - 1) {
                     showStep(currentStepIndex + 1); // Mostra o próximo passo
                 }
            } else {
                 // Se a validação falhar, showToast já é chamado dentro de validateCurrentStep
            }
        });
    });

    // Botões "Voltar"
    prevButtons.forEach(button => {
        on(button, 'click', () => {
            if (currentStepIndex > 0) {
                showStep(currentStepIndex - 1); // Mostra o passo anterior
            }
        });
    });


    // --- Manipuladores de Eventos para Seleção de Forma de Pagamento ---

    paymentMethodRadios.forEach(radio => {
        on(radio, 'change', () => {
            const selectedMethod = radio.value;

            // Oculta todos os contêineres de detalhes
            paymentMethodDetailsContainers.forEach(container => {
                container.classList.remove('active');
                 container.style.display = 'none'; // Garante oculto
                 // Opcional: Remover o atributo 'required' dos campos nos contêineres ocultos
                 // para que não interfiram na validação de outros passos.
                 // qsa('input, select, textarea', container).forEach(field => field.removeAttribute('required'));
            });

            // Mostra o contêiner de detalhes correspondente à forma de pagamento selecionada
            const activeContainer = qs(`#${selectedMethod}-details`); // IDs devem corresponder aos valores dos radios
            if (activeContainer) {
                activeContainer.classList.add('active');
                 activeContainer.style.display = 'block'; // Mostra o contêiner ativo
                 // Opcional: Adicionar o atributo 'required' de volta aos campos visíveis
                 // Use um data attribute (ex: data-required-in-step="true") no HTML para marcar
                 // quais campos devem ser obrigatórios APENAS quando o contêiner estiver ativo.
                 // qsa('input[data-required-in-step="true"], select[data-required-in-step="true"], textarea[data-required-in-step="true"]', activeContainer)
                 //    .forEach(field => field.setAttribute('required', 'true'));
            }
             // TODO: Chamar função para atualizar opções de parcelamento se a forma for cartão
             if (selectedMethod === 'card') {
                 // updateInstallmentOptions(); // Precisa do total do pedido
             }
        });
    });

    // Disparar o evento change inicial para mostrar os detalhes da forma de pagamento padrão (checked="true")
    const defaultPaymentMethod = qs('input[name="paymentMethod"]:checked');
    if (defaultPaymentMethod) {
        defaultPaymentMethod.dispatchEvent(new Event('change'));
    }


    // --- Funções de Preenchimento Dinâmico ---

     /**
      * Renderiza o resumo do pedido na barra lateral/coluna de resumo.
      * Esta função é chamada na inicialização e sempre exibe o resumo atual do carrinho.
      * @param {HTMLElement} container - O contêiner para o resumo (#order-summary).
      * @param {object[]} items - Itens do carrinho.
      */
    function renderOrderSummary(container, items) {
        const total = getCartTotal(); // Assumindo que getCartTotal() já considera varejo/atacado se aplicável
         if (!container) return;

         // Reutilizar a estrutura HTML existente dentro de #order-summary
         let summaryItemsListEl = qs('.order-summary-items', container);
         if (!summaryItemsListEl) { // Cria a lista se ela não existir na estrutura HTML inicial
             summaryItemsListEl = createElement('ul', { class: 'order-summary-items' });
              const summaryTotalArea = qs('.order-summary-total', container);
              if (summaryTotalArea) {
                  container.insertBefore(summaryItemsListEl, summaryTotalArea);
              } else {
                  container.appendChild(summaryItemsListEl);
              }
         }

         summaryItemsListEl.innerHTML = items.map(item => `
             <li class="order-summary-item">
                 <span class="item-name">${item.quantity}x ${item.name || 'Produto'}</span>
                 <span class="item-price">${formatCurrency(item.price * item.quantity)}</span>
             </li>
         `).join('');


         let summaryTotalEl = qs('.order-summary-total', container);
          if (!summaryTotalEl) { // Cria a área do total se ela não existir na estrutura HTML inicial
              summaryTotalEl = createElement('div', { class: 'order-summary-total' });
               container.appendChild(summaryTotalEl);
          }

         summaryTotalEl.innerHTML = `
             <span>Total:</span>
             <span>${formatCurrency(total)}</span>
         `; // Usa a cor verde definida no CSS para .order-summary-total

         // TODO: Adicionar linhas para Subtotal, Frete, Descontos, etc. se necessário na estrutura HTML
         // E atualizar o cálculo do total se houver frete/descontos

         // TODO: Opcional: Chamar calculateShipping(zipCode) aqui ou no passo de endereço
         // e atualizar o resumo com o valor do frete.
    }

     /**
      * Preenche o passo de Revisão do Pedido com um resumo dos dados coletados.
      * Esta função é chamada quando o passo de revisão se torna ativo.
      */
    function populateReviewStep() {
         const reviewSummaryEl = qs('#review-summary'); // Container para o resumo da revisão
         const finalPaymentDisplayEl = qs('#final-payment-display'); // Área para QR Code/Boleto final

         if (!reviewSummaryEl) {
             console.error("Elemento #review-summary não encontrado.");
             return;
         }
         // Limpa conteúdos anteriores
         reviewSummaryEl.innerHTML = '';
         if (finalPaymentDisplayEl) finalPaymentDisplayEl.innerHTML = '';


         // TODO: Coletar TODOS os dados preenchidos nos passos anteriores
         // Certifique-se de que a validação de cada passo foi bem-sucedida antes de chegar aqui.
         const contactData = {
             fullName: qs('#fullName').value,
             email: qs('#email').value,
             phone: qs('#phone').value,
             cpf: qs('#cpf').value,
         };

         const shippingData = {
             zipCode: qs('#zipCode').value,
             street: qs('#street').value,
             number: qs('#number').value,
             complement: qs('#complement').value,
             neighborhood: qs('#neighborhood').value,
             city: qs('#city').value,
             state: qs('#state').value,
             country: qs('#country').value,
         };

         const selectedPaymentMethodRadio = qs('input[name="paymentMethod"]:checked');
         const paymentMethod = selectedPaymentMethodRadio ? selectedPaymentMethodRadio.value : 'Não selecionado';
         const paymentMethodLabel = selectedPaymentMethodRadio ? qs(`label[for="${selectedPaymentMethodRadio.id}"]`).textContent : 'Não selecionada'; // Obtém o texto do label

         let paymentDetailsSummaryHtml = ''; // HTML para exibir detalhes de pagamento na revisão

         if (paymentMethod === 'card') {
             // Coletar dados do cartão para resumo (sem mostrar o número completo)
             const cardNumber = qs('#cardNumber').value;
             const lastFour = cardNumber ? cardNumber.slice(-4) : '????';
             const cardName = qs('#cardName').value;
             const cardExpiry = qs('#cardExpiry').value;
             const installmentsSelect = qs('#installments');
             const installmentsText = installmentsSelect ? installmentsSelect.options[installmentsSelect.selectedIndex].textContent : 'N/A'; // Obtém o texto da opção selecionada

             paymentDetailsSummaryHtml = `
                  <p><strong>Método:</strong> ${paymentMethodLabel}</p>
                  <p><strong>Nome no Cartão:</strong> ${cardName}</p>
                  <p><strong>Final do Cartão:</strong> ${lastFour}</p>
                  <p><strong>Validade:</strong> ${cardExpiry}</p>
                  <p><strong>Parcelamento:</strong> ${installmentsText}</p>
              `;
         } else if (paymentMethod === 'boleto') {
              paymentDetailsSummaryHtml = `
                  <p><strong>Método:</strong> ${paymentMethodLabel}</p>
                  <p>O boleto será gerado após a confirmação.</p>
              `;
         } else if (paymentMethod === 'pix') {
             paymentDetailsSummaryHtml = `
                  <p><strong>Método:</strong> ${paymentMethodLabel}</p>
                  <p>O código Pix/QR Code será gerado após a confirmação.</p>
              `;
         } else {
              paymentDetailsSummaryHtml = `
                  <p><strong>Método:</strong> ${paymentMethodLabel}</p>
                  <p>Detalhes adicionais podem ser fornecidos na confirmação.</p>
              `;
         }


         // Preencher o conteúdo do resumo de revisão
         reviewSummaryEl.innerHTML = `
             <h4>Itens do Pedido:</h4>
             <ul class="review-items-list" style="list-style: none; padding: 0; margin-bottom: var(--spacing-md);">
                 ${getCartItems().map(item => `
                     <li style="font-size: var(--font-size-sm); color: var(--neutral-dark); margin-bottom: var(--spacing-xs);">
                         ${item.quantity}x ${item.name || 'Produto'} - ${formatCurrency(item.price * item.quantity)}
                     </li>
                 `).join('')}
             </ul>

             <h4>Endereço de Entrega:</h4>
             <p style="font-size: var(--font-size-sm); color: var(--neutral-dark); margin-bottom: var(--spacing-md);">
                 ${shippingData.street}, ${shippingData.number} ${shippingData.complement ? `- ${shippingData.complement}` : ''}<br>
                 ${shippingData.neighborhood}, ${shippingData.city} - ${shippingData.state}<br>
                 CEP: ${shippingData.zipCode}, ${shippingData.country}
             </p>

             <h4>Informações de Contato:</h4>
             <p style="font-size: var(--font-size-sm); color: var(--neutral-dark); margin-bottom: var(--spacing-md);">
                 ${contactData.fullName}<br>
                 ${contactData.email}<br>
                 Telefone: ${contactData.phone}<br>
                 CPF: ${contactData.cpf}
             </p>

             <h4>Forma de Pagamento Selecionada:</h4>
             <div class="payment-review-summary"> ${paymentDetailsSummaryHtml} </div>

             `;
     }


    // --- Lógica de Submissão do Formulário (Acontece ao clicar no botão Confirmar Pedido no ÚLTIMO passo) ---

    // O listener de 'submit' no formulário principal #checkout-form já está configurado
    // e ele será disparado quando o botão type="submit" com form="checkout-form" for clicado,
    // independentemente de onde ele esteja no HTML (como na coluna do resumo).

    on(checkoutForm, 'submit', async (event) => {
        event.preventDefault(); // Previne o envio padrão do formulário

        // Validação FINAL de TODOS os campos necessários antes de submeter
        // A validação passo a passo já deve ter ocorrido, mas uma validação final aqui é uma boa prática.
         // TODO: Implementar validação final abrangente de todos os campos necessários para a submissão.
         // Por enquanto, apenas verifica se está no último passo.
         if (currentStepIndex !== checkoutSteps.length - 1) {
             showToast("Por favor, complete todos os passos do checkout antes de confirmar.", "warning");
             return; // Impede submissão se não estiver no último passo
         }

         // Opcional: Re-validar todos os passos aqui antes de submeter
         // if (!validateStep(0) || !validateStep(1) || !validateStep(2)) { ... }


        console.log("Formulário validado e no último passo. Simulando submissão do pedido...");

        // Desabilitar botão e mudar texto
        if (confirmOrderButton) {
            confirmOrderButton.disabled = true;
            confirmOrderButton.textContent = 'Processando...';
        }
        // Limpa mensagens de feedback anteriores
        if (checkoutMessagesEl) checkoutMessagesEl.innerHTML = '';


        // Coletar TODOS os dados do formulário (de todos os passos)
        const formData = {
            customer: {
                fullName: qs('#fullName').value,
                email: qs('#email').value,
                phone: qs('#phone').value,
                cpf: qs('#cpf').value,
            },
            shippingAddress: {
                zipCode: qs('#zipCode').value,
                street: qs('#street').value,
                number: qs('#number').value,
                complement: qs('#complement').value,
                neighborhood: qs('#neighborhood').value,
                city: qs('#city').value,
                state: qs('#state').value,
                country: qs('#country').value,
            },
            // Coletar forma de pagamento selecionada e detalhes específicos
            payment: {
                method: qs('input[name="paymentMethod"]:checked').value,
                // Inclua detalhes específicos com base no método selecionado
                cardDetails: {}, // Preencher se o método for 'card'
                // boletoDetails: {}, // Preencher se o método for 'boleto' (ex: CPF/CNPJ do pagador)
                // pixDetails: {}, // Preencher se o método for 'pix' (geralmente não há campos aqui, a menos que seja um alias)
            },
            items: getCartItems(), // Itens do carrinho
            total: getCartTotal(), // Total do carrinho
             // TODO: Adicionar frete, descontos, etc. se forem calculados
        };

         // Se a forma de pagamento for cartão, colete os detalhes do cartão
        if (formData.payment.method === 'card') {
             formData.payment.cardDetails = {
                 cardName: qs('#cardName').value,
                 cardNumber: qs('#cardNumber').value,
                 cardExpiry: qs('#cardExpiry').value,
                 cardCVC: qs('#cardCVC').value,
                 installments: qs('#installments').value,
                 // NOTA: Em uma aplicação real, dados de cartão SENSÍVEIS
                 // (número, validade, CVC) NUNCA são enviados para sua API de backend.
                 // Eles são enviados DIRETAMENTE para um gateway de pagamento SEGURO
                 // (Stripe, PagSeguro, etc.) no frontend, e o gateway retorna um token
                 // que você envia para o backend para processar o pagamento.
             };
         }
         // TODO: Coletar outros detalhes específicos se boleto/pix tiverem campos extras


        try {
            // TODO: Chamar a API real para submeter o pedido
            // A API deve processar o pagamento (usando o token do gateway para cartão),
            // gerar boleto/pix se necessário, e retornar a confirmação e dados finais.
            const result = await submitOrder(formData); // Chamar API mock ou real

            console.log("Resultado da Submissão do Pedido:", result);

            if (result.success) {
                clearCart(); // Limpa o carrinho após sucesso

                // Exibir mensagem de sucesso
                showToast(result.message || "Pedido realizado com sucesso!", "success", 5000);

                // TODO: Exibir detalhes finais (QR Code, link Boleto) na área #final-payment-display no passo de Revisão
                 const finalPaymentDisplayEl = qs('#final-payment-display');
                 if (finalPaymentDisplayEl) {
                     if (formData.payment.method === 'boleto' && result.boleto_url) { // Assumindo que a API retorna boleto_url
                         finalPaymentDisplayEl.innerHTML = `<p>Seu boleto foi gerado. <a href="${result.boleto_url}" target="_blank" class="btn btn-primary">Clique aqui para visualizar/imprimir</a>.</p>`;
                     } else if (formData.payment.method === 'pix' && result.pix_code) { // Assumindo que a API retorna pix_code e/ou qr_code_url
                          finalPaymentDisplayEl.innerHTML = `
                             <p>Seu código Pix foi gerado.</p>
                              ${result.qr_code_url ? `<img src="${result.qr_code_url}" alt="QR Code Pix" style="max-width: 150px; display: block; margin: var(--spacing-md) auto;">` : ''}
                             <p><strong>Código Pix Copia e Cola:</strong></p>
                             <p><code style="word-break: break-all;">${result.pix_code}</code></p>
                              <button class="btn btn-sm btn-outline copy-pix-code" data-pix-code="${result.pix_code}">Copiar Código</button>
                         `;
                          // TODO: Implementar funcionalidade de copiar código (usando Clipboard API)
                          on(qs('.copy-pix-code', finalPaymentDisplayEl), 'click', (e) => {
                              const codeToCopy = e.target.dataset.pixCode;
                              navigator.clipboard.writeText(codeToCopy).then(() => {
                                  showToast("Código Pix copiado!", "info");
                              }).catch(err => {
                                  console.error("Erro ao copiar código Pix:", err);
                                  showToast("Erro ao copiar código.", "error");
                              });
                          });
                     } else {
                         // Mensagem genérica para outros métodos ou se Pix/Boleto não retornarem dados esperados
                         finalPaymentDisplayEl.innerHTML = `<p>Acompanhe o status do seu pedido em <a href="/store/orders.html">Meus Pedidos</a>.</p>`;
                     }
                     // Ocultar botões de navegação no último passo após a submissão bem-sucedida
                     qs('.step-navigation', checkoutSteps[currentStepIndex])?.style.display = 'none';
                      // Ocultar o botão "Confirmar Pedido" na coluna do resumo
                      if (confirmOrderButton) confirmOrderButton.style.display = 'none';
                      // Exibir uma mensagem de sucesso na área de mensagens de checkout
                       if (checkoutMessagesEl) {
                           checkoutMessagesEl.innerHTML = `<p class="alert alert-success">${result.message || "Pedido finalizado com sucesso!"}</p>`;
                       }


                 } else {
                     // Se não houver área para exibir detalhes finais, redirecionar para a página de pedidos após um delay
                      if (checkoutMessagesEl) {
                           checkoutMessagesEl.innerHTML = `<p class="alert alert-success">${result.message || "Pedido finalizado com sucesso!"}</p>`;
                       }
                     setTimeout(() => window.location.href = '/store/orders.html', 3000); // Redireciona após 3 segundos
                 }


            } else {
                // Erro na submissão (API retornou success: false)
                const errorMessage = result.message || "Erro ao processar o pedido.";
                showToast(errorMessage, "error");
                 if (checkoutMessagesEl) {
                     // Exibir mensagem de erro na área de mensagens
                     checkoutMessagesEl.innerHTML = `<p class="alert alert-danger">${errorMessage}</p>`; // Usar classe de alerta
                 }

                // Reativar botão
                 if (confirmOrderButton) {
                    confirmOrderButton.disabled = false;
                    confirmOrderButton.textContent = 'Confirmar Pedido';
                 }
                 // Opcional: Rolar para o topo da área de mensagens ou do formulário para o usuário ver o erro
                 checkoutMessagesEl?.scrollIntoView({ behavior: 'smooth' });
            }

        } catch(error) {
            // Erro na chamada da API (rede, servidor, etc.)
            console.error("Erro na submissão do pedido:", error);
            showToast("Ocorreu um erro inesperado ao finalizar o pedido. Tente novamente mais tarde.", "error");
             const checkoutMessagesEl = qs('#checkout-messages');
             if (checkoutMessagesEl) {
                 checkoutMessagesEl.innerHTML = `<p class="alert alert-danger">Ocorreu um erro: ${error.message || 'Erro de comunicação com o servidor.'}</p>`;
             }
            // Reativar botão
             if (confirmOrderButton) {
                confirmOrderButton.disabled = false;
                confirmOrderButton.textContent = 'Confirmar Pedido';
             }
              // Opcional: Rolar para o topo da área de mensagens
             checkoutMessagesEl?.scrollIntoView({ behavior: 'smooth' });
        }
    });


     // TODO: Implementar a função para atualizar opções de parcelamento (chamar na seleção do cartão e no carregamento)
     // function updateInstallmentOptions() {
     //    const total = getCartTotal();
     //    const installmentsSelect = qs('#installments');
     //    if (!installmentsSelect) return;
     //
     //    // Limpa opções atuais (exceto a primeira "Selecione...")
     //    while (installmentsSelect.options.length > 1) {
     //        installmentsSelect.remove(1);
     //    }
     //
     //    // TODO: Obter regras de parcelamento da API ou de configuração
     //    const maxInstallments = 12; // Exemplo
     //
     //    for (let i = 1; i <= maxInstallments; i++) {
     //        const installmentValue = total / i;
     //        const optionText = `${i}x de ${formatCurrency(installmentValue)}`;
     //        createElement('option', { value: i, textContent: optionText }, installmentsSelect);
     //    }
     // }
     // Chamar updateInstallmentOptions() na inicialização e possivelmente ao mudar o total do carrinho (se isso puder acontecer no checkout)
     // updateInstallmentOptions();


     // TODO: Implementar lógica de validação para os campos de telefone, cpf, cep, etc. no módulo validation.js
     // As funções checkCPF, checkPhone, checkCEP, checkCardNumber, checkCardExpiry, checkCardCVC
     // devem ser criadas ou completadas no arquivo validation.js.
     // Elas devem retornar true ou false E adicionar/remover as classes 'is-invalid'/'is-valid'
     // e preencher/limpar o texto do .invalid-feedback.

});


// Helper function to render the order summary in the sidebar
// Keep this function separate as it's called from the main DOMContentLoaded listener
function renderOrderSummary(container, items) {
    const total = getCartTotal(); // Assumindo que getCartTotal() já considera varejo/atacado se aplicável
     if (!container) return;

     // Reutilizar a estrutura HTML existente dentro de #order-summary
     let summaryItemsListEl = qs('.order-summary-items', container);
     if (!summaryItemsListEl) { // Cria a lista se ela não existir na estrutura HTML inicial
         summaryItemsListEl = createElement('ul', { class: 'order-summary-items' });
          const summaryTotalArea = qs('.order-summary-total', container);
          if (summaryTotalArea) {
              container.insertBefore(summaryItemsListEl, summaryTotalArea);
          } else {
              container.appendChild(summaryItemsListEl);
          }
     }

     summaryItemsListEl.innerHTML = items.map(item => `
         <li class="order-summary-item">
             <span class="item-name">${item.quantity}x ${item.name || 'Produto'}</span>
             <span class="item-price">${formatCurrency(item.price * item.quantity)}</span>
         </li>
     `).join('');


     let summaryTotalEl = qs('.order-summary-total', container);
      if (!summaryTotalEl) { // Cria a área do total se ela não existir na estrutura HTML inicial
          summaryTotalEl = createElement('div', { class: 'order-summary-total' });
           container.appendChild(summaryTotalEl);
      }

     summaryTotalEl.innerHTML = `
         <span>Total:</span>
         <span>${formatCurrency(total)}</span>
     `; // Usa a cor verde definida no CSS para .order-summary-total

     // TODO: Adicionar linhas para Subtotal, Frete, Descontos, etc. se necessário na estrutura HTML
     // E atualizar o cálculo do total se houver frete/descontos

     // TODO: Opcional: Chamar calculateShipping(zipCode) aqui ou no passo de endereço
     // e atualizar o resumo com o valor do frete.
}


// Helper function to populate the Review Step summary
// Keep this function separate
function populateReviewStep() { // product pode não ser necessário aqui, depende se o resumo precisa de dados do produto além do carrinho
    const reviewSummaryEl = qs('#review-summary'); // Container para o resumo da revisão
    const finalPaymentDisplayEl = qs('#final-payment-display'); // Área para QR Code/Boleto final (dentro do passo de revisão)

    if (!reviewSummaryEl) {
        console.error("Elemento #review-summary não encontrado.");
        return;
    }
    // Limpa conteúdos anteriores
    reviewSummaryEl.innerHTML = '';
    if (finalPaymentDisplayEl) finalPaymentDisplayEl.innerHTML = ''; // Limpa área de exibição final

    // TODO: Coletar TODOS os dados preenchidos nos passos anteriores
    // Certifique-se de que a validação de cada passo foi bem-sucedida antes de chegar aqui.
    const contactData = {
        fullName: qs('#fullName').value,
        email: qs('#email').value,
        phone: qs('#phone').value,
        cpf: qs('#cpf').value,
    };

    const shippingData = {
        zipCode: qs('#zipCode').value,
        street: qs('#street').value,
        number: qs('#number').value,
        complement: qs('#complement').value,
        neighborhood: qs('#neighborhood').value,
        city: qs('#city').value,
        state: qs('#state').value,
        country: qs('#country').value,
    };

    const selectedPaymentMethodRadio = qs('input[name="paymentMethod"]:checked');
    const paymentMethod = selectedPaymentMethodRadio ? selectedPaymentMethodRadio.value : 'Não selecionado';
    const paymentMethodLabel = selectedPaymentMethodRadio ? qs(`label[for="${selectedPaymentMethodRadio.id}"]`).textContent : 'Não selecionada'; // Obtém o texto do label

    let paymentDetailsSummaryHtml = ''; // HTML para exibir detalhes de pagamento na revisão

    if (paymentMethod === 'card') {
        // Coletar dados do cartão para resumo (sem mostrar o número completo no resumo)
        const cardNumber = qs('#cardNumber').value;
        const lastFour = cardNumber ? cardNumber.slice(-4) : '????';
        const cardName = qs('#cardName').value;
        const cardExpiry = qs('#cardExpiry').value;
        const installmentsSelect = qs('#installments');
        const installmentsText = installmentsSelect ? installmentsSelect.options[installmentsSelect.selectedIndex].textContent : 'N/A'; // Obtém o texto da opção selecionada

        paymentDetailsSummaryHtml = `
             <p><strong>Método:</strong> ${paymentMethodLabel}</p>
             <p><strong>Nome no Cartão:</strong> ${cardName}</p>
             <p><strong>Final do Cartão:</strong> ${lastFour}</p>
             <p><strong>Validade:</strong> ${cardExpiry}</p>
             <p><strong>Parcelamento:</strong> ${installmentsText}</p>
         `;
    } else if (paymentMethod === 'boleto') {
         paymentDetailsSummaryHtml = `
             <p><strong>Método:</strong> ${paymentMethodLabel}</p>
             <p>O boleto será gerado após a confirmação.</p>
             `;
    } else if (paymentMethod === 'pix') {
        paymentDetailsSummaryHtml = `
             <p><strong>Método:</strong> ${paymentMethodLabel}</p>
             <p>O código Pix/QR Code será gerado após a confirmação.</p>
              `;
    } else {
         paymentDetailsSummaryHtml = `
             <p><strong>Método:</strong> ${paymentMethodLabel}</p>
             <p>Detalhes adicionais podem ser fornecidos na confirmação.</p>
         `;
    }


    // Preencher o conteúdo do resumo de revisão
    reviewSummaryEl.innerHTML = `
        <h4>Itens do Pedido:</h4>
        <ul class="review-items-list" style="list-style: none; padding: 0; margin-bottom: var(--spacing-md);">
            ${getCartItems().map(item => `
                <li style="font-size: var(--font-size-sm); color: var(--neutral-dark); margin-bottom: var(--spacing-xs);">
                    ${item.quantity}x ${item.name || 'Produto'} - ${formatCurrency(item.price * item.quantity)}
                </li>
            `).join('')}
        </ul>

        <h4>Endereço de Entrega:</h4>
        <p style="font-size: var(--font-size-sm); color: var(--neutral-dark); margin-bottom: var(--spacing-md);">
            ${shippingData.street}, ${shippingData.number} ${shippingData.complement ? `- ${shippingData.complement}` : ''}<br>
            ${shippingData.neighborhood}, ${shippingData.city} - ${shippingData.state}<br>
            CEP: ${shippingData.zipCode}, ${shippingData.country}
        </p>

        <h4>Informações de Contato:</h4>
        <p style="font-size: var(--font-size-sm); color: var(--neutral-dark); margin-bottom: var(--spacing-md);">
            ${contactData.fullName}<br>
            ${contactData.email}<br>
            Telefone: ${contactData.phone}<br>
            CPF: ${contactData.cpf}
        </p>

        <h4>Forma de Pagamento Selecionada:</h4>
        <div class="payment-review-summary"> ${paymentDetailsSummaryHtml} </div>

        `;
}


// Helper function to setup quantity controls (likely not needed on checkout page)
// function setupQuantityControls(btnMinus, btnPlus, quantityInput) { ... }

// Helper function to format currency (assuming it's in utils.js)
// function formatCurrency(value) { ... }

// Helper function for form validation rules (assuming it's in validation.js)
// function checkRequired(value) { ... }
// function checkEmail(value) { ... }
// function checkCPF(value) { ... } // TODO: Implement CPF validation
// function checkPhone(value) { ... } // TODO: Implement phone validation
// function checkCEP(value) { value) { ... } // TODO: Implement CEP validation
// function checkCardNumber(value) { ... } // TODO: Implement card number validation
// function checkCardExpiry(value) { ... } // TODO: Implement card expiry validation
// function checkCardCVC(value) { ... } // TODO: Implement CVC validation

// Helper function for form validation logic (assuming it's in validation.js)
// function validateForm(formElement, rules) { ... }
