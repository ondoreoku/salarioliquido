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
            <div><label>Salário Bruto Mensal (€)</label><input type="number" id="bruto" value="1500"></div>
            <div><label>Sub. Refeição/Dia (€)</label><input type="number" id="sub" value="9.60"></div>
            <div><label>Pagamento Subsídio</label><select id="sub_tipo"><option value="cartao">Cartão de Refeição</option><option value="dinheiro">Dinheiro</option></select></div>
            <div><label>Dependentes</label><input type="number" id="dep" value="0"></div>`;
    } else {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1;"><label>Coeficiente (Art. 31º CIRS)</label>
            <select id="coef">
                <option value="0.75">75% - Profissões Liberais (TI, Saúde, Design)</option>
                <option value="0.35">35% - Outros Serviços e Restauração</option>
                <option value="0.15">15% - Venda de Mercadorias</option>
                <option value="0.95">95% - Capitais e Criptoativos</option>
            </select></div>
            <div><label>Faturação Mensal Bruta (€)</label><input type="number" id="bruto" value="2500"></div>
            <div><label>Retenção na Fonte (IRS)</label><select id="irs_rate"><option value="0.25">25% (Padrão)</option><option value="0.10">10% (Novas Atividades)</option><option value="0">Isento</option></select></div>`;
    }
}

function calcular() {
    const bruto = parseFloat(document.getElementById('bruto').value) || 0;
    let totalLiquido = 0, html = "";

    if (currentRegime === 'tco') {
        // Cálculos Trabalhador
        const ss_trabalhador = bruto * 0.11;
        const sub_dia = parseFloat(document.getElementById('sub').value) || 0;
        const isento = (document.getElementById('sub_tipo').value === 'cartao') ? 9.60 : 6.00;
        const sub_tributavel = Math.max(0, sub_dia - isento) * 22;
        const sub_total = sub_dia * 22;
        const irs = (bruto + sub_tributavel) * 0.12; // Estimativa de Retenção
        
        totalLiquido = (bruto - ss_trabalhador - irs) + sub_total;

        // Cálculos Empresa
        const tsu_empresa = bruto * 0.2375;
        const custo_total = bruto + tsu_empresa + sub_total;

        html = `
            <div class="res-row"><span>Segurança Social (11%):</span><span style="color:#dc2626">-€${ss_trabalhador.toFixed(2)}</span></div>
            <div class="res-row"><span>Retenção IRS (Est.):</span><span style="color:#dc2626">-€${irs.toFixed(2)}</span></div>
            <div class="res-row"><span>Subsídio Refeição (Isento):</span><span style="color:var(--primary)">+€${sub_total.toFixed(2)}</span></div>
            <div style="margin-top:15px; padding-top:10px; border-top:2px dashed #e2e8f0;">
                <label>Perspetiva da Empresa</label>
                <div class="res-row"><span>TSU (23.75%):</span><span>€${tsu_empresa.toFixed(2)}</span></div>
                <div class="res-row"><span>Custo Total Empresa:</span><span style="font-weight:800">€${custo_total.toFixed(2)}</span></div>
            </div>`;
        document.getElementById('sub-info-label').innerText = "(Salário Líquido + Subsídio)";
    } else {
        const ss_eni = bruto * 0.70 * 0.214;
        const irs_eni = bruto * parseFloat(document.getElementById('irs_rate').value);
        totalLiquido = bruto - ss_eni - irs_eni;

        html = `
            <div class="res-row"><span>Segurança Social (Est.):</span><span style="color:#dc2626">-€${ss_eni.toFixed(2)}</span></div>
            <div class="res-row"><span>Retenção IRS:</span><span style="color:#dc2626">-€${irs_eni.toFixed(2)}</span></div>
            <div class="res-row"><span>Rendimento Disponível:</span><span>€${totalLiquido.toFixed(2)}</span></div>`;
        document.getElementById('sub-info-label').innerText = "(Após impostos mensais)";
    }

    document.getElementById('detailed-results').innerHTML = html;
    document.getElementById('out_total_final').innerText = '€' + totalLiquido.toFixed(2);
    document.getElementById('results').style.display = 'block';
}
renderInputs();
