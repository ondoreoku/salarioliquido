function toggleInputs() {
    const tipo = document.getElementById('tipoTrabalhador').value;
    document.getElementById('camposTCO').style.display = tipo === 'outrem' ? 'grid' : 'none';
    document.getElementById('camposENI').style.display = tipo === 'eni' ? 'grid' : 'none';
}

function calcularSalario() {
    const tipo = document.getElementById('tipoTrabalhador').value;
    const bruto = parseFloat(document.getElementById('bruto').value) || 0;
    let liquido = 0;
    let impostos = 0;

    if (tipo === 'outrem') {
        // --- REGIME TCO ---
        const ss = bruto * 0.11;
        const subAlim = (parseFloat(document.getElementById('subsidioAlim').value) || 0) * 22;
        
        // Simulação de Tabelas IRS 2026 (Estimativa progressiva)
        let taxaIRS = 0;
        if (bruto > 870) { // Isenção até ao novo SMN 2026 aprox.
            if (bruto <= 1200) taxaIRS = 0.07;
            else if (bruto <= 2000) taxaIRS = 0.15;
            else if (bruto <= 3500) taxaIRS = 0.24;
            else taxaIRS = 0.34;
        }

        const irs = (bruto - ss) * taxaIRS;
        impostos = ss + irs;
        liquido = (bruto - impostos) + subAlim;

    } else {
        // --- REGIME INDEPENDENTE (ENI) ---
        const coeficiente = parseFloat(document.getElementById('cirsAtividade').value);
        const taxaRetencao = parseFloat(document.getElementById('retencaoENI').value);
        const fatorVariacaoSS = parseFloat(document.getElementById('variacaoSS').value);

        // 1. Retenção na Fonte (IRS mensal/por recibo)
        const irsRetido = bruto * taxaRetencao;

        // 2. Segurança Social Independente
        // Regra: Rendimento Relevante = Bruto * Coeficiente
        // Base de Incidência SS = Rendimento Relevante * 70%
        const rendimentoRelevante = bruto * coeficiente;
        const baseCalculoSS = rendimentoRelevante * 0.70;
        
        // Taxa padrão 21.4% com ajuste de variação escolhida
        const ssIndependente = (baseCalculoSS * 0.214) * fatorVariacaoSS;

        impostos = irsRetido + ssIndependente;
        liquido = bruto - impostos;
    }

    // Mostrar resultados
    const resArea = document.getElementById('results');
    resArea.style.display = 'block';
    document.getElementById('out-liquido').innerText = `€${liquido.toFixed(2)}`;
    document.getElementById('out-impostos').innerText = `€${impostos.toFixed(2)}`;
    
    // Scroll suave para os resultados
    resArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
