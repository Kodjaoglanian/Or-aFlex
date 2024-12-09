let items = [];

function addItem() {
    const description = document.getElementById('item-description').value;
    const quantity = parseInt(document.getElementById('item-quantity').value);
    const price = parseFloat(document.getElementById('item-price').value);

    if (description && quantity && price) {
        items.push({
            description: description,
            quantity: quantity,
            price: price
        });

        // Clear input fields
        document.getElementById('item-description').value = '';
        document.getElementById('item-quantity').value = '';
        document.getElementById('item-price').value = '';

        alert('Item adicionado.');

        renderItems(); // Atualizar a lista de itens
    } else {
        alert('Por favor, preencha todos os campos do item.');
    }
}

function renderItems() {
    const tbody = document.querySelector('#items-table tbody');
    tbody.innerHTML = ''; // Limpar a tabela antes de renderizar

    items.forEach((item, index) => {
        const total = item.quantity * item.price;
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.description}</td>
            <td>${item.quantity}</td>
            <td>R$${item.price.toFixed(2)}</td>
            <td>R$${total.toFixed(2)}</td>
            <td><button onclick="removeItem(${index})">Remover</button></td>
        `;

        tbody.appendChild(row);
    });
}

function removeItem(index) {
    if (confirm('Deseja remover este item?')) {
        items.splice(index, 1);
        renderItems();
    }
}

function generatePDF() {
    const companyLogoInput = document.getElementById('company-logo');
    const companyName = document.getElementById('company-name').value;
    const companyAddress = document.getElementById('company-address').value;
    const companyCNPJ = document.getElementById('cnpj').value;

    const customerName = document.getElementById('customer-name').value;
    const customerCNPJ = document.getElementById('customer-cnpj').value;
    const customerAddress = document.getElementById('customer-address').value;

    const invoiceDate = document.getElementById('invoice-date').value;
    const invoiceValidity = document.getElementById('invoice-validity').value;
    const paymentTerms = document.getElementById('payment-terms').value;
    const invoiceNotes = document.getElementById('invoice-notes').value;
    
    // Novo campo: Número do Documento
    const documentNumber = document.getElementById('document-number').value;
    
    // Novo campo: Prazo de Entrega
    const deliveryDeadline = document.getElementById('delivery-deadline').value;

    if (!companyName || !companyCNPJ || !companyAddress || !customerName || !invoiceDate || items.length === 0) {
        alert('Por favor, complete o formulário e adicione pelo menos um item.');
        return;
    }

    // Ler a imagem do logo
    let logoDataURL = '';
    if (companyLogoInput.files && companyLogoInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            logoDataURL = e.target.result;
            createInvoicePDF({
                logoDataURL,
                companyName,
                companyCNPJ,
                companyAddress,
                customerName,
                customerCNPJ,
                customerAddress,
                invoiceDate,
                invoiceValidity,
                paymentTerms,
                invoiceNotes,
                documentNumber, // Pass the new field
                deliveryDeadline // Pass the new field
            });
        };
        reader.readAsDataURL(companyLogoInput.files[0]);
    } else {
        createInvoicePDF({
            logoDataURL,
            companyName,
            companyCNPJ,
            companyAddress,
            customerName,
            customerCNPJ,
            customerAddress,
            invoiceDate,
            invoiceValidity,
            paymentTerms,
            invoiceNotes,
            documentNumber, // Pass the new field
            deliveryDeadline // Pass the new field
        });
    }
}

function createInvoicePDF(data) {
    const {
        logoDataURL,
        companyName,
        companyCNPJ,
        companyAddress,
        customerName,
        customerCNPJ,
        customerAddress,
        invoiceDate,
        invoiceValidity,
        paymentTerms,
        invoiceNotes,
        documentNumber, // Destructure the new field
        deliveryDeadline // Destructure the new field
    } = data;

    // Montar o HTML do orçamento incluindo todos os detalhes
    let invoiceHTML = `
    <div id="invoice">
        <div style="text-align:center;">
            ${logoDataURL ? `<img src="${logoDataURL}" alt="Logo da Empresa" width="150"><br>` : ''}
            <strong>${companyName}</strong><br>
            CNPJ: ${companyCNPJ}<br>
            Endereço: ${companyAddress}<br>
        </div>
        <hr>
        <div>`;

    // Condicional para "Número do Documento"
    if (documentNumber) {
        invoiceHTML += `<strong>Número do Documento:</strong> ${documentNumber}<br>`;
    }

    // Condicional para "Prazo de Entrega"
    if (deliveryDeadline) {
        invoiceHTML += `<strong>Prazo de Entrega:</strong> ${deliveryDeadline} dias<br>`;
    }

    invoiceHTML += `
            <strong>Cliente:</strong><br>
            ${customerName}<br>`;

    // Condicional para CNPJ do Cliente
    if (customerCNPJ) {
        invoiceHTML += `CNPJ: ${customerCNPJ}<br>`;
    }

    // Condicional para Endereço do Cliente
    if (customerAddress) {
        invoiceHTML += `Endereço: ${customerAddress}<br>`;
    }

    invoiceHTML += `</div>
        <div>
            <strong>Data do Orçamento:</strong> ${invoiceDate}<br>`;

    // Condicional para Validade
    if (invoiceValidity) {
        invoiceHTML += `<strong>Validade:</strong> ${invoiceValidity} dias<br>`;
    }

    invoiceHTML += `</div>
        <table>
            <tr>
                <th>Item</th>
                <th>Descrição</th>
                <th>Quantidade</th>
                <th>Preço Unitário</th>
                <th>Total</th>
            </tr>`;

    let grandTotal = 0;
    items.forEach(function(item, index) {
        const total = item.quantity * item.price;
        grandTotal += total;

        invoiceHTML += `<tr>
            <td>${index + 1}</td>
            <td>${item.description}</td>
            <td>${item.quantity}</td>
            <td>R$${item.price.toFixed(2)}</td>
            <td>R$${total.toFixed(2)}</td>
        </tr>`;
    });

    invoiceHTML += `
            <tr>
                <td colspan="4" style="text-align:right;"><strong>Total Geral:</strong></td>
                <td>R$${grandTotal.toFixed(2)}</td>
            </tr>
        </table>`;

    // Condicional para Condições de Pagamento
    if (paymentTerms) {
        invoiceHTML += `
        <div>
            <strong>Condições de Pagamento:</strong><br>
            ${paymentTerms}
        </div>`;
    }

    // Condicional para Observações
    if (invoiceNotes) {
        invoiceHTML += `
        <div>
            <strong>Observações:</strong><br>
            ${invoiceNotes}
        </div>`;
    }

    invoiceHTML += `
    </div>`;

    // Exibe o orçamento no div
    const invoiceOutput = document.getElementById('invoice-output');
    invoiceOutput.innerHTML = invoiceHTML;
    invoiceOutput.style.display = 'block';

    // Gera o PDF usando html2pdf
    const element = document.getElementById('invoice-output');
    html2pdf().from(element).set({
        margin: 1,
        filename: 'orcamento.pdf', // Nome do arquivo PDF
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'cm', format: 'a4', orientation: 'portrait' }
    }).save().then(() => {
        // Limpa o formulário e itens após a geração do PDF
        document.getElementById('invoice-form').reset();
        items = [];
        invoiceOutput.innerHTML = '';
        invoiceOutput.style.display = 'none';
    });
}

document.getElementById('invoice-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const companyName = document.getElementById('company-name').value;
    const cnpj = document.getElementById('cnpj').value;
    const companyAddress = document.getElementById('company-address').value;
    const customerName = document.getElementById('customer-name').value;
    const invoiceDate = document.getElementById('invoice-date').value;

    if (!companyName || !cnpj || !companyAddress || !customerName || !invoiceDate || items.length === 0) {
        alert('Por favor, complete o formulário e adicione pelo menos um item.');
        return;
    }

    let invoiceHTML = `<h2>Orçamento</h2>
    <p><strong>Nome da Empresa:</strong> ${companyName}</p>
    <p><strong>CNPJ:</strong> ${cnpj}</p>
    <p><strong>Endereço:</strong> ${companyAddress}</p>
    <p><strong>Nome do Cliente:</strong> ${customerName}</p>
    <p><strong>Data do Orçamento:</strong> ${invoiceDate}</p>
    <table>
        <tr>
            <th>Descrição</th>
            <th>Quantidade</th>
            <th>Preço</th>
            <th>Total</th>
        </tr>`;

    let grandTotal = 0;
    items.forEach(function(item) {
        const total = item.quantity * item.price;
        grandTotal += total;

        invoiceHTML += `<tr>
            <td>${item.description}</td>
            <td>${item.quantity}</td>
            <td>R$${item.price.toFixed(2)}</td>
            <td>R$${total.toFixed(2)}</td>
        </tr>`;
    });

    invoiceHTML += `<tr>
        <td colspan="3"><strong>Total Geral</strong></td>
        <td>R$${grandTotal.toFixed(2)}</td>
    </tr>
    </table>`;

    document.getElementById('invoice-output').innerHTML = invoiceHTML;

    // Reset form and items
    document.getElementById('invoice-form').reset();
    items = [];
});