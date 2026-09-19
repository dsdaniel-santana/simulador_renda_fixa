// --- TEMA CLARO / ESCURO ---
function toggleTheme() {
    const isDark = document.getElementById('checkbox').checked;
    if (isDark) {
        document.body.classList.add('dark-mode');
        document.getElementById('theme-label').innerText = "Modo Escuro";
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.remove('dark-mode');
        document.getElementById('theme-label').innerText = "Modo Claro";
        localStorage.setItem('theme', 'light');
    }
}

// Inicializar tema com base no localStorage ou preferência do sistema
window.onload = () => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.getElementById('checkbox').checked = true;
        toggleTheme();
    }
};


// --- FORMATAÇÃO EM TEMPO REAL ---

// Máscara para moeda (ex: 1.000,00)
function formatCurrencyInput(input) {
    let value = input.value;

    // Remove tudo que não for número
    value = value.replace(/\D/g, "");

    if (value.length === 0) {
        input.value = "";
        return;
    }

    // Adiciona zeros à esquerda se tiver menos que 3 dígitos (para as casas decimais)
    while (value.length < 3) {
        value = "0" + value;
    }

    // Pega as duas últimas casas para ser os centavos
    const integerPart = value.substring(0, value.length - 2);
    const decimalPart = value.substring(value.length - 2);

    // Formata a parte inteira com pontos (ex: 1000 -> 1.000)
    // Converte para Number e volta para String tirando os zeros a esquerda
    let formattedInteger = Number(integerPart).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    input.value = formattedInteger + "," + decimalPart;
}

// Máscara para números inteiros (meses)
function formatIntegerInput(input) {
    let value = input.value;
    // Remove tudo que não for número
    value = value.replace(/\D/g, "");

    if (value.length === 0) {
        input.value = "";
        return;
    }

    // Retira zeros à esquerda
    input.value = Number(value).toString();
}

// Função auxiliar para converter string formatada (1.000,50) para float (1000.50)
function parseFormattedFloat(valueStr) {
    if (!valueStr) return NaN;
    // Remove os pontos de milhar e troca a vírgula por ponto
    return parseFloat(valueStr.replace(/\./g, "").replace(",", "."));
}

// Função auxiliar para formatar output de volta para Real (BRL)
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}


// --- LÓGICA DE SIMULAÇÃO ---

function simularInvestimento() {
    const aporteInicialStr = document.getElementById('aporteInicial').value;
    const mesesStr = document.getElementById('meses').value;
    const aporteMensalStr = document.getElementById('aporteMensal').value;
    const taxaJurosAnualStr = document.getElementById('taxaJuros').value;

    const aporteInicial = parseFormattedFloat(aporteInicialStr);
    const meses = parseInt(mesesStr);
    const aporteMensal = parseFormattedFloat(aporteMensalStr);
    const taxaJurosAnual = parseFormattedFloat(taxaJurosAnualStr);

    if(isNaN(aporteInicial) || isNaN(meses) || isNaN(aporteMensal) || isNaN(taxaJurosAnual)) {
        alert("Por favor, preencha todos os campos com valores válidos.");
        return;
    }

    const taxaJurosMensal = Math.pow(1 + taxaJurosAnual / 100, 1 / 12) - 1;

    let totalInvestido = aporteInicial;
    let totalJuros = 0;

    let resultadoHTML = '<h2>Rendimento Mês a Mês</h2>';
    resultadoHTML += '<ul id="resultado-lista">';

    for(let i = 1; i <= meses; i++) {
        const rendimentoMensal = totalInvestido * taxaJurosMensal;
        totalInvestido += rendimentoMensal;
        totalInvestido += aporteMensal;
        totalJuros += rendimentoMensal;

        resultadoHTML += `<li>Mês ${i}: ${formatCurrency(totalInvestido)}</li>`;
    }

    resultadoHTML += '</ul>';

    const totalAportes = (aporteInicial + aporteMensal * meses);

    resultadoHTML += `
        <h2>Resumo</h2>
        <div id="informacoes-finais">
            <p>
                <span>Total Bruto:</span>
                <span class="text-primary">${formatCurrency(totalInvestido)}</span>
            </p>
            <p>
                <span>Total Investido:</span>
                <span class="text-danger">${formatCurrency(totalAportes)}</span>
            </p>
            <p>
                <span>Total Ganho em Juros:</span>
                <span class="text-success">${formatCurrency(totalJuros)}</span>
            </p>
        </div>
    `;

    const container = document.getElementById("resultado-container");
    container.innerHTML = resultadoHTML;
    container.classList.remove("hidden");

    // Travar inputs após simulação (Opção B)
    document.getElementById('aporteInicial').disabled = true;
    document.getElementById('meses').disabled = true;
    document.getElementById('aporteMensal').disabled = true;
    document.getElementById('taxaJuros').disabled = true;

    // Trocar botões
    document.getElementById('action-buttons').classList.add('hidden');
    document.getElementById('reset-buttons').classList.remove('hidden');
}

function limparCampos() {
    document.getElementById('aporteInicial').value = "";
    document.getElementById('meses').value = "";
    document.getElementById('aporteMensal').value = "";
    document.getElementById('taxaJuros').value = "";

    const container = document.getElementById("resultado-container");
    container.innerHTML = "";
    container.classList.add("hidden");
}

function novaSimulacao() {
    limparCampos();

    // Destravar inputs
    document.getElementById('aporteInicial').disabled = false;
    document.getElementById('meses').disabled = false;
    document.getElementById('aporteMensal').disabled = false;
    document.getElementById('taxaJuros').disabled = false;

    // Voltar botões originais
    document.getElementById('action-buttons').classList.remove('hidden');
    document.getElementById('reset-buttons').classList.add('hidden');
}
