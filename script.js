// --- DICIONÁRIO DE TRADUÇÕES ---
const translations = {
    pt: {
        title: "Simulador de Investimentos",
        themeLight: "Modo Claro",
        themeDark: "Modo Escuro",
        labelAporteInicial: "Aporte Inicial (R$)",
        placeholderAporteInicial: "Ex: 1.000,00",
        labelMeses: "Quantidade de Meses",
        placeholderMeses: "Ex: 12",
        labelAporteMensal: "Aporte Mensal (R$)",
        placeholderAporteMensal: "Ex: 500,00",
        labelTaxaJuros: "Taxa de Juros Anual (%)",
        placeholderTaxaJuros: "Ex: 10,50",
        btnSimular: "Simular",
        btnLimpar: "Limpar",
        btnNovaSimulacao: "Nova Simulação",
        alertError: "Por favor, preencha todos os campos com valores válidos.",
        tituloGrafico: "Crescimento do Patrimônio",
        tituloRendimento: "Rendimento Mês a Mês",
        mes: "Mês",
        tituloResumo: "Resumo",
        totalBruto: "Total Bruto:",
        totalInvestidoText: "Total Investido:",
        totalJurosText: "Total Ganho em Juros:",
        currencyFormat: "pt-BR",
        currencyCode: "BRL"
    },
    en: {
        title: "Investment Simulator",
        themeLight: "Light Mode",
        themeDark: "Dark Mode",
        labelAporteInicial: "Initial Investment ($)",
        placeholderAporteInicial: "Ex: 1,000.00",
        labelMeses: "Number of Months",
        placeholderMeses: "Ex: 12",
        labelAporteMensal: "Monthly Contribution ($)",
        placeholderAporteMensal: "Ex: 500.00",
        labelTaxaJuros: "Annual Interest Rate (%)",
        placeholderTaxaJuros: "Ex: 10.50",
        btnSimular: "Simulate",
        btnLimpar: "Clear",
        btnNovaSimulacao: "New Simulation",
        alertError: "Please fill in all fields with valid values.",
        tituloGrafico: "Equity Growth",
        tituloRendimento: "Monthly Returns",
        mes: "Month",
        tituloResumo: "Summary",
        totalBruto: "Gross Total:",
        totalInvestidoText: "Total Invested:",
        totalJurosText: "Total Interest Earned:",
        currencyFormat: "en-US",
        currencyCode: "USD"
    },
    es: {
        title: "Simulador de Inversiones",
        themeLight: "Modo Claro",
        themeDark: "Modo Oscuro",
        labelAporteInicial: "Inversión Inicial (€)",
        placeholderAporteInicial: "Ej: 1.000,00",
        labelMeses: "Cantidad de Meses",
        placeholderMeses: "Ej: 12",
        labelAporteMensal: "Aporte Mensual (€)",
        placeholderAporteMensal: "Ej: 500,00",
        labelTaxaJuros: "Tasa de Interés Anual (%)",
        placeholderTaxaJuros: "Ej: 10,50",
        btnSimular: "Simular",
        btnLimpar: "Limpiar",
        btnNovaSimulacao: "Nueva Simulación",
        alertError: "Por favor, complete todos los campos con valores válidos.",
        tituloGrafico: "Crecimiento Patrimonial",
        tituloRendimento: "Rendimiento Mes a Mes",
        mes: "Mes",
        tituloResumo: "Resumen",
        totalBruto: "Total Bruto:",
        totalInvestidoText: "Total Invertido:",
        totalJurosText: "Total Intereses Ganados:",
        currencyFormat: "es-ES",
        currencyCode: "EUR"
    }
};

let currentLang = 'pt'; // Default language

function changeLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);

    // Update active button state
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`btn-lang-${lang}`).classList.add('active');

    // Update texts in DOM based on data-i18n attributes
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');

        // Special case for the theme toggle span text
        if(key === 'themeLight' || key === 'themeDark') {
           const isDark = document.body.classList.contains('dark-mode');
           el.innerText = isDark ? translations[lang].themeDark : translations[lang].themeLight;
        } else {
            if(translations[lang][key]) {
                el.innerText = translations[lang][key];
            }
        }
    });

    // Update placeholders based on data-i18n-placeholder
    const inputs = document.querySelectorAll('[data-i18n-placeholder]');
    inputs.forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if(translations[lang][key]) {
            el.placeholder = translations[lang][key];
        }
    });

    // If there is data to re-render, we re-render the result area.
    // For simplicity, if we switch languages and the simulation is active, we can trigger simularInvestimento (if data is valid),
    // or just let the user know they need to click new simulation.
    // For now we don't auto-re-simulate if it's locked, but we will handle the translation inside simularInvestimento.
}

// --- TEMA CLARO / ESCURO ---
function toggleTheme() {
    const isDark = document.getElementById('checkbox').checked;
    const label = document.getElementById('theme-label');

    if (isDark) {
        document.body.classList.add('dark-mode');
        label.innerText = translations[currentLang].themeDark;
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.remove('dark-mode');
        label.innerText = translations[currentLang].themeLight;
        localStorage.setItem('theme', 'light');
    }
}

// Inicializar
window.onload = () => {
    // Inicializar idioma
    const savedLang = localStorage.getItem('lang');
    if(savedLang && translations[savedLang]) {
        changeLanguage(savedLang);
    } else {
        changeLanguage('pt');
    }

    // Inicializar tema
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.getElementById('checkbox').checked = true;
        toggleTheme();
    }
};

// --- FORMATAÇÃO EM TEMPO REAL ---
// (We will use the PT logic for typing formatting regardless of language for simplicity,
// as English users also type comma/dot sometimes, but this can be enhanced.
// For this simple version, we stick to the requested formatting behavior).

function formatCurrencyInput(input) {
    let value = input.value;
    value = value.replace(/\D/g, "");

    if (value.length === 0) {
        input.value = "";
        return;
    }
    while (value.length < 3) {
        value = "0" + value;
    }
    const integerPart = value.substring(0, value.length - 2);
    const decimalPart = value.substring(value.length - 2);
    let formattedInteger = Number(integerPart).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    input.value = formattedInteger + "," + decimalPart;
}

function formatIntegerInput(input) {
    let value = input.value;
    value = value.replace(/\D/g, "");

    if (value.length === 0) {
        input.value = "";
        return;
    }
    input.value = Number(value).toString();
}

function parseFormattedFloat(valueStr) {
    if (!valueStr) return NaN;
    return parseFloat(valueStr.replace(/\./g, "").replace(",", "."));
}

function formatCurrency(value) {
    const t = translations[currentLang];
    return new Intl.NumberFormat(t.currencyFormat, { style: 'currency', currency: t.currencyCode }).format(value);
}


// --- LÓGICA DE SIMULAÇÃO ---
let chartInstance = null;

function simularInvestimento() {
    const t = translations[currentLang];

    const aporteInicialStr = document.getElementById('aporteInicial').value;
    const mesesStr = document.getElementById('meses').value;
    const aporteMensalStr = document.getElementById('aporteMensal').value;
    const taxaJurosAnualStr = document.getElementById('taxaJuros').value;

    const aporteInicial = parseFormattedFloat(aporteInicialStr);
    const meses = parseInt(mesesStr);
    const aporteMensal = parseFormattedFloat(aporteMensalStr);
    const taxaJurosAnual = parseFormattedFloat(taxaJurosAnualStr);

    if(isNaN(aporteInicial) || isNaN(meses) || isNaN(aporteMensal) || isNaN(taxaJurosAnual)) {
        alert(t.alertError);
        return;
    }

    const taxaJurosMensal = Math.pow(1 + taxaJurosAnual / 100, 1 / 12) - 1;

    let totalInvestido = aporteInicial;
    let totalJuros = 0;

    // Arrays for chart data
    const labels = [];
    const outOfPocketData = [];
    const totalData = [];

    let resultadoHTML = `<h2>${t.tituloRendimento}</h2>`;
    resultadoHTML += '<ul id="resultado-lista">';

    let currentOutOfPocket = aporteInicial;

    for(let i = 1; i <= meses; i++) {
        const rendimentoMensal = totalInvestido * taxaJurosMensal;
        totalInvestido += rendimentoMensal;
        totalInvestido += aporteMensal;
        totalJuros += rendimentoMensal;
        currentOutOfPocket += aporteMensal;

        resultadoHTML += `<li>${t.mes} ${i}: ${formatCurrency(totalInvestido)}</li>`;

        labels.push(`${t.mes} ${i}`);
        outOfPocketData.push(currentOutOfPocket);
        totalData.push(totalInvestido);
    }

    resultadoHTML += '</ul>';

    const totalAportes = (aporteInicial + aporteMensal * meses);

    resultadoHTML += `
        <h2>${t.tituloResumo}</h2>
        <div id="informacoes-finais">
            <p>
                <span>${t.totalBruto}</span>
                <span class="text-primary">${formatCurrency(totalInvestido)}</span>
            </p>
            <p>
                <span>${t.totalInvestidoText}</span>
                <span class="text-danger">${formatCurrency(totalAportes)}</span>
            </p>
            <p>
                <span>${t.totalJurosText}</span>
                <span class="text-success">${formatCurrency(totalJuros)}</span>
            </p>
        </div>
    `;

    document.getElementById("resultado-conteudo").innerHTML = resultadoHTML;

    const container = document.getElementById("resultado-container");
    container.classList.remove("hidden");
    document.getElementById("titulo-grafico").classList.remove("hidden");

    // Travar inputs após simulação
    document.getElementById('aporteInicial').disabled = true;
    document.getElementById('meses').disabled = true;
    document.getElementById('aporteMensal').disabled = true;
    document.getElementById('taxaJuros').disabled = true;

    // Trocar botões
    document.getElementById('action-buttons').classList.add('hidden');
    document.getElementById('reset-buttons').classList.remove('hidden');

    // Draw Native Chart
    drawChart(labels, outOfPocketData, totalData);
}

function limparCampos() {
    document.getElementById('aporteInicial').value = "";
    document.getElementById('meses').value = "";
    document.getElementById('aporteMensal').value = "";
    document.getElementById('taxaJuros').value = "";

    document.getElementById("resultado-conteudo").innerHTML = "";
    document.getElementById("resultado-container").classList.add("hidden");
    document.getElementById("titulo-grafico").classList.add("hidden");

    clearChart();
}

function novaSimulacao() {
    limparCampos();

    document.getElementById('aporteInicial').disabled = false;
    document.getElementById('meses').disabled = false;
    document.getElementById('aporteMensal').disabled = false;
    document.getElementById('taxaJuros').disabled = false;

    document.getElementById('action-buttons').classList.remove('hidden');
    document.getElementById('reset-buttons').classList.add('hidden');
}

// --- LÓGICA DO GRÁFICO (CANVAS NATIVO) ---

function clearChart() {
    const canvas = document.getElementById('grafico-investimento');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawChart(labels, outOfPocketData, totalData) {
    const canvas = document.getElementById('grafico-investimento');
    const ctx = canvas.getContext('2d');

    // Configurar tamanho interno do canvas para casar com o tamanho CSS
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;

    ctx.clearRect(0, 0, width, height);

    const maxVal = Math.max(...totalData);
    const minVal = 0;

    // Get colors from CSS variables
    const style = getComputedStyle(document.body);
    const colorPrimary = style.getPropertyValue('--color-primary').trim() || '#0078d7';
    const colorDanger = style.getPropertyValue('--color-danger').trim() || '#f44336';
    const gridColor = style.getPropertyValue('--border-color').trim() || '#ccc';
    const textColor = style.getPropertyValue('--text-muted').trim() || '#5c5c5c';

    // Draw Grid (Y axis)
    ctx.beginPath();
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        const y = padding + (height - 2 * padding) * (1 - i / 5);
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);

        ctx.fillStyle = textColor;
        ctx.font = '10px Segoe UI, sans-serif';
        const labelVal = (maxVal * (i / 5));

        // Very basic formatting for the axis
        let textVal = labelVal > 1000 ? (labelVal/1000).toFixed(1) + 'k' : labelVal.toFixed(0);
        ctx.fillText(textVal, 5, y + 3);
    }
    ctx.stroke();

    // Helper to map data to coordinates
    const getX = (index) => padding + (index / (labels.length - 1)) * (width - 2 * padding);
    const getY = (val) => padding + (height - 2 * padding) * (1 - (val / maxVal));

    // Draw Out Of Pocket Line (Red/Danger)
    ctx.beginPath();
    ctx.strokeStyle = colorDanger;
    ctx.lineWidth = 3;
    for (let i = 0; i < outOfPocketData.length; i++) {
        const x = getX(i);
        const y = getY(outOfPocketData[i]);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Draw Total Data Line (Blue/Primary)
    ctx.beginPath();
    ctx.strokeStyle = colorPrimary;
    ctx.lineWidth = 3;
    for (let i = 0; i < totalData.length; i++) {
        const x = getX(i);
        const y = getY(totalData[i]);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Optionally Fill under the Total Line
    ctx.lineTo(getX(totalData.length - 1), height - padding);
    ctx.lineTo(getX(0), height - padding);
    ctx.closePath();
    ctx.fillStyle = colorPrimary + '33'; // 20% opacity hex
    ctx.fill();

    // Draw X axis labels (first, mid, last)
    ctx.fillStyle = textColor;
    ctx.font = '10px Segoe UI, sans-serif';
    ctx.fillText(labels[0], getX(0), height - padding + 15);
    ctx.fillText(labels[labels.length - 1], getX(labels.length - 1) - 30, height - padding + 15);
}
