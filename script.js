let currentRegime = 'tco';

function setRegime(regime) {
    currentRegime = regime;
    document.getElementById('btn-tco').classList.toggle('active', regime === 'tco');
    document.getElementById('btn-eni').classList.toggle('active', regime === 'eni');
    renderInputs();
    document.getElementById('results').classList.remove('show');
}

function renderInputs() {
    const grid = document.getElementById('inputs-grid');
    if (currentRegime === 'tco') {
        grid.innerHTML = `
            <div class="input-group"><label>Salário Bruto Mensal (€)</label><input type="number" id="bruto" value="1500"></div>
            <div class="input-group"><label>Subsídio Refeição / Dia (€)</label><input type="number" id="sub" value="9.60"></div>
            <div class="input-group">
                <label>Tipo de Recebimento</label>
                <select id="sub_tipo">
                    <option value="cartao">Cartão de Refeição (Isento até 9.60€)</option>
                    <option value="dinheiro">Em Dinheiro (Isento até 6.00€)</option>
                </select>
            </div>
            <div class="input-group"><label>Dependentes</label><input type="number" id="dep" value="0"></div>
        `;
    } else {
        grid.innerHTML = `
            <div class="input-group" style="grid-column: 1 / -1;">
                <label>Coeficiente (Art. 31º CIRS)</label>
                <select id="coef">
                    <option value="0.75">75% - Profissões Listadas (Art. 151º)</option>
                    <option value="0.35">35% - Outros Serviços / Restauração</option>
                    <option value="0.15">15% - Venda de Mercadorias</option>
                    <option value="0.10">10% - Alojamento Local (Moradias)</option>
                    <option value="0.04">4% - Alojamento Local (Hostels)</option>
                    <option value="0.95">95% - Capitais / Prop. Intelectual</option>
                    <option value="0.50">50% - Mineração Criptoativos</option>
                    <option value="0.95">95% - Rendimentos Cripto (Sem mineração)</option>
                </select>
            </div>
            <div class="input-group"><label>Faturação Mensal Bruta (€)</label><input type="number" id="bruto" value="2500"></div>
            <div class="input-group">
                <label>Taxa Retenção IRS</label>
                <select id="irs_rate">
                    <option value="0.25">25% (Padrão)</option>
                    <option value="0.10">10% (Novas Atividades)</option>
                    <option value="0">0% (Isento)</option>
                </select>
            </div>
        `;
    }
}

function calcular() {
    const bruto = parseFloat(document.getElementById('bruto').value) || 0;
    let totalFinal = 0, liqBancario = 0, html = "";

    if (currentRegime === 'tco') {
        const ss = bruto * 0.11;
        const subDia = parseFloat(document.getElementById('sub').value) || 0;
        const isento = (document.getElementById('sub_tipo').value === 'cartao') ? 9.60 : 6.00;
        const subTributavel = Math.max(0, subDia - isento) * 22;
        const irs = (bruto + subTributavel) * 0.12; // Estimativa
        liqBancario = bruto - ss - irs;
        totalFinal = liqBancario + (subDia * 22);
        
        html = `
            <div class="res-row"><span>Salário Bruto:</span> <span class="val">€${bruto.toFixed(2)}</span></div>
            <div class="res-row"><span>Segurança Social (11%):</span> <span class="val" style="color:#dc2626">-€${ss.toFixed(2)}</span></div>
            <div class="res-row"><span>Retenção IRS (Est.):</span> <span class="val" style="color:#dc2626">-€${irs.toFixed(2)}</span></div>
            <div class="res-row"><span>Subsídio Refeição Total:</span> <span class="val" style="color:var(--secondary)">+€${(subDia*22).toFixed(2)}</span></div>
        `;
        document.getElementById('sub-info-label').innerText = "(Líquido Mensal + Subsídio)";
    } else {
        const coef = parseFloat(document.getElementById('coef').value);
        const irsRate = parseFloat(document.getElementById('irs_rate').value);
        const ss = bruto * 0.70 * 0.214;
        const irsRetido = bruto * irsRate;
        totalFinal = bruto - ss - irsRetido;

        html = `
            <div class="res-row"><span>Faturação Bruta:</span> <span class="val">€${bruto.toFixed(2)}</span></div>
            <div class="res-row"><span>Coeficiente Aplicado:</span> <span class="val">${(coef*100).toFixed(0)}%</span></div>
            <div class="res-row"><span>Segurança Social (Est.):</span> <span class="val" style="color:#dc2626">-€${ss.toFixed(2)}</span></div>
            <div class="res-row"><span>Retenção IRS na Fonte:</span> <span class="val" style="color:#dc2626">-€${irsRetido.toFixed(2)}</span></div>
        `;
        document.getElementById('sub-info-label').innerText = "(Disponível após obrigações mensais)";
    }

    document.getElementById('detailed-results').innerHTML = html;
    document.getElementById('out_total_final').innerText = '€' + totalFinal.toFixed(2).replace('.', ',');
    document.getElementById('results').classList.add('show');
}

renderInputs();
