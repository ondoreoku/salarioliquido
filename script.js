let currentRegime = 'tco';

function setRegime(regime) {
    currentRegime = regime;
    document.getElementById('btn-tco').classList.toggle('active', regime === 'tco');
    document.getElementById('btn-eni').classList.toggle('active', regime === 'eni');
    renderInputs();
    document.getElementById('results').style.display = 'none';
}

function renderInputs() {
    const grid = document.getElementById('inputs-grid');
    if (currentRegime === 'tco') {
        grid.innerHTML = `
            <div><label>Salário Bruto (€)</label><input type="number" id="bruto" value="1500"></div>
            <div><label>Sub. Refeição/Dia (€)</label><input type="number" id="sub" value="9.60"></div>
            <div><label>Tipo Sub.</label><select id="sub_tipo"><option value="cartao">Cartão</option><option value="dinheiro">Dinheiro</option></select></div>
            <div><label>Dependentes</label><input type="number" id="dep" value="0"></div>`;
    } else {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1;"><label>Coeficiente (Art. 31º CIRS)</label>
            <select id="coef">
                <option value="0.75">75% - Profissões Liberais</option>
                <option value="0.35">35% - Serviços/Restauração</option>
                <option value="0.15">15% - Venda de Produtos</option>
                <option value="0.95">95% - Cripto/Capitais</option>
            </select></div>
            <div><label>Faturação Bruta (€)</label><input type="number" id="bruto" value="2500"></div>
            <div><label>Taxa IRS Retenção</label><select id="irs_rate"><option value="0.25">25%</option><option value="0.10">10%</option><option value="0">Isento</option></select></div>`;
    }
}

function calcular() {
    const bruto = parseFloat(document.getElementById('bruto').value) || 0;
    let total = 0, html = "";

    if (currentRegime === 'tco') {
        const ss = bruto * 0.11;
        const irs = bruto * 0.12; // Média estimada
        const subVal = (parseFloat(document.getElementById('sub').value) || 0) * 22;
        total = (bruto - ss - irs) + subVal;
        html = `<div class="res-row"><span>Líquido s/ Subsídio:</span><span>€${(bruto-ss-irs).toFixed(2)}</span></div>
                <div class="res-row"><span>Subsídio Refeição:</span><span>€${subVal.toFixed(2)}</span></div>`;
    } else {
        const ss = bruto * 0.70 * 0.214;
        const irs = bruto * parseFloat(document.getElementById('irs_rate').value);
        total = bruto - ss - irs;
        html = `<div class="res-row"><span>Segurança Social:</span><span>-€${ss.toFixed(2)}</span></div>
                <div class="res-row"><span>Retenção na Fonte:</span><span>-€${irs.toFixed(2)}</span></div>`;
    }

    document.getElementById('detailed-results').innerHTML = html;
    document.getElementById('out_total_final').innerText = '€' + total.toFixed(2);
    document.getElementById('results').style.display = 'block';
}
renderInputs();
