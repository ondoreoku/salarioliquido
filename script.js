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
        const ss = bruto * 0.11;
        const subAlim = (parseFloat(document.getElementById('subsidioAlim').value) || 0) * 22;
        let taxaIRS = 0.12; 
        if (bruto > 1800) taxaIRS = 0.18;
        if (bruto > 3000) taxaIRS = 0.25;

        const irs = (bruto - ss) * taxaIRS;
        impostos = ss + irs;
        liquido = (bruto - impostos) + subAlim;
    } else {
        const coeficiente = parseFloat(document.getElementById('cirsAtividade').value);
        const taxaRetencao = parseFloat(document.getElementById('retencaoENI').value);
        const irsRetido = bruto * taxaRetencao;
        const baseSS = (bruto * coeficiente) * 0.70;
        const ssIndependente = baseSS * 0.214;
        impostos = irsRetido + ssIndependente;
        liquido = bruto - impostos;
    }

    document.getElementById('results').style.display = 'block';
    document.getElementById('out-liquido').innerText = `€${liquido.toFixed(2)}`;
    document.getElementById('out-impostos').innerText = `€${impostos.toFixed(2)}`;
}
