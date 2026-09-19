function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function simularInvestimento() {
    const aporteInicial = parseFloat(document.getElementById('aporteInicial').value);
    const meses = parseInt(document.getElementById('meses').value);
    const aporteMensal = parseFloat(document.getElementById('aporteMensal').value);
    const taxaJurosAnual = parseFloat(document.getElementById('taxaJuros').value);

    if(isNaN(aporteInicial) || isNaN(meses) || isNaN(aporteMensal) || isNaN(taxaJurosAnual)) {
        alert("Por favor, preencha todos os campos com valores numéricos válidos.");
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

    // Adicionar informações adicionais com as cores semânticas
    // text-primary (azul - montante total)
    // text-danger (vermelho para pagamentos/aportes do bolso, indicando saída de caixa)
    // text-success (verde para lucros obtidos por juros)
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
}
