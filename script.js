/**
 * Alterna a visibilidade dos campos com base no tipo de trabalhador
 */
function toggleInputs() {
    const tipo = document.getElementById('tipoTrabalhador').value;
    const camposTCO = document.getElementById('camposTCO');
    const camposENI = document.getElementById('camposENI');

    if (tipo === 'outrem') {
        camposTCO.style.display = 'grid';
        camposENI.style.display = 'none';
    } else {
        camposTCO.style.display = 'none';
        camposENI.style.display = 'grid';
    }
}

/**
 * Lógica principal de cálculo 2026
 */
function calcularSalario() {
    const tipo = document.getElementById('tipoTrabalhador').value;
    const bruto = parseFloat(document.getElementById('bruto').value) || 0;
    
    let liquido = 0;
    let totalImpostos = 0;

    if (tipo === 'outrem') {
        // 1. Segurança Social (11%)
        const ss = bruto * 0.11;
        
        // 2. Subsídio de Alimentação (estimativa 22 dias)
        const valorDiarioAlim = parseFloat(document.getElementById('subsidioAlim').value) || 0;
        const subAlimTotal = valorDiarioAlim * 22;

        // 3. IRS (Simulação simplificada baseada nas tabelas progressivas 2026)
        const estado = document.getElementById('estadoCivil').value;
        let taxaIRS = 0;

        if (bruto <= 820) taxaIRS = 0;
        else if (bruto <= 1200) taxaIRS = 0.08;
        else if (bruto <= 2000) taxaIRS = 0.15;
        else if (bruto <= 3500) taxaIRS = 0.23;
        else taxaIRS = 0.32;

        // Ajuste por estado civil (Casados com 2 titulares pagam ligeiramente menos retido)
        if (estado === 'casado2' && taxaIRS > 0) taxaIRS -= 0.02;

        const irs = (bruto - ss) * taxaIRS;

        totalImpostos = ss + irs;
        liquido = (bruto - totalImpostos) + subAlimTotal;

    } else {
        // Lógica ENI / Independente
        const coeficiente = parseFloat(document.getElementById('cirsAtividade').value);
        const taxaRetencao = parseFloat(document.getElementById('retencaoENI').value);

        // 1. IRS Retido (Incide sobre o faturamento bruto total)
        const irsRetido = bruto * taxaRetencao;

        // 2. Segurança Social Independente (21.4%)
        // Base: 70% do rendimento relevante (Bruto * Coeficiente)
        const rendimentoRelevante = bruto * coeficiente;
        const baseCalculoSS = rendimentoRelevante * 0.70;
        const ssIndependente = baseCalculoSS * 0.214;

        totalImpostos = irsRetido + ssIndependente;
        liquido = bruto - totalImpostos;
    }

    // Exibição dos Resultados
    document.getElementById('results').style.display = 'block';
    document.getElementById('out-liquido').innerText = `€${liquido.toFixed(2)}`;
    document.getElementById('out-impostos').innerText = `€${totalImpostos.toFixed(2)}`;
    
    // Scroll suave para os resultados em mobile
    if(window.innerWidth < 600) {
        document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
    }
}
