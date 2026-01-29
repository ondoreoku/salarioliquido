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
        // CÁLCULO CONTA D'OUTREM
        const ss = bruto * 0.11;
        const valorSubAlim = parseFloat(document.getElementById('subsidioAlim').value) || 0;
        const totalSubAlim = valorSubAlim * 22;

        // Tabelas IRS 2026 simplificadas
        let taxaIRS = 0;
        if (bruto > 870) {
            if (bruto <= 1250) taxaIRS = 0.08;
            else if (bruto <= 2100) taxaIRS = 0.16;
            else if (bruto <= 3800) taxaIRS = 0.24;
            else taxaIRS = 0.35;
        }
        
        const estado = document.getElementById('estadoCivil').value;
        if (estado === 'casado2') taxaIRS -= 0.02;

        const irs = (bruto - ss) * taxaIRS;
        impostos = ss + irs;
        liquido = (bruto - impostos) + totalSubAlim;

    } else {
        // CÁLCULO INDEPENDENTE (CIRS)
        const coeficiente = parseFloat(document.getElementById('cirsAtividade').value);
        const taxaRetencao = parseFloat(document.getElementById('retencaoENI').value);
        const isentoSS = document.getElementById('isentoSS').value;

        // 1. IRS Retido
        const irsRetido = bruto * taxaRetencao;

        // 2. Segurança Social (21.4% sobre 70% do rendimento relevante)
        let ssIndependente = 0;
        if (isentoSS === 'nao') {
            const rendimentoRelevante = bruto * coeficiente;
            const baseIncidencia = rendimentoRelevante * 0.70;
            ssIndependente = baseIncidencia * 0.214;
        }

        impostos = irsRetido + ssIndependente;
        liquido = bruto - impostos;
    }

    document.getElementById('results').style.display = 'block';
    document.getElementById('out-liquido').innerText = `€${liquido.toFixed(2)}`;
    document.getElementById('out-impostos').innerText = `€${impostos.toFixed(2)}`;
}
