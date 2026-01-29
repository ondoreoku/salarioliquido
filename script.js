let currentRegime = 'tco';

// Alterna entre os regimes e limpa resultados anteriores
function setRegime(regime) {
    currentRegime = regime;
    document.getElementById('btn-tco').classList.toggle('active', regime === 'tco');
    document.getElementById('btn-eni').classList.toggle('active', regime === 'eni');
    renderInputs();
    document.getElementById('results').style.display = 'none';
}

// Renderiza os campos específicos de cada regime
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
                <option value="0.10">10% - Alojamento Local (Moradias)</option>
                <option value="0.04">4% - Alojamento Local (Hostels)</option>
                <option value="0.95">95% - Capitais e Criptoativos</option>
                <option value="0.50">50% - Mineração de Criptoativos</option>
            </select></div>
            <div><label>Faturação Mensal Bruta (€)</label><input type="number" id="bruto" value="2500"></div>
            <div><label>Retenção na Fonte (IRS)</label><select id="irs_rate"><option value="0.25">25% (Padrão)</option><option value="0.10">10% (Novas Atividades)</option><option value="0">Isento / Dispensa</option></select></div>`;
    }
}

// Função principal de cálculo
function calcular() {
    const bruto = parseFloat(document.getElementById('bruto').value) || 0;
    let totalLiquido = 0, html = "";

    if (currentRegime === 'tco') {
        // --- TRABALHADOR POR CONTA DE OUTREM ---
        const ss_trabalhador = bruto * 0.11;
        const sub_dia = parseFloat(document.getElementById('sub').value) || 0;
        const isento = (document.getElementById('sub_tipo').value === 'cartao') ? 9.60 : 6.00;
        const sub_tributavel = Math.max(0, sub_dia - isento) * 22;
        const sub_total = sub_dia * 22;
        
        // Estimativa simplificada de IRS (para rigor total seria necessária a tabela de retenção 2026)
        const irs = (bruto + sub_tributavel) * 0.12; 
        
        totalLiquido = (bruto - ss_trabalhador - irs) + sub_total;

        // Cálculos de Custo Empresa
        const tsu_empresa = bruto * 0.2375;
        const custo_total = bruto + tsu_empresa + sub_total;

        html = `
            <div class="res-row"><span>Segurança Social (11%):</span><span style="color:#dc2626">-€${ss_trabalhador.toFixed(2)}</span></div>
            <div class="res-row"><span>Retenção IRS (Est.):</span><span style="color:#dc2626">-€${irs.toFixed(2)}</span></div>
            <div class="res-row"><span>Subsídio Refeição:</span><span style="color:#10b981">+€${sub_total.toFixed(2)}</span></div>
            <div style="margin-top:15px; padding-top:10px; border-top:2px dashed #e2e8f0;">
                <label style="color:#64748b">Análise de Custo Empresa (TSU)</label>
                <div class="res-row"><span>TSU Patronal (23.75%):</span><span>€${tsu_empresa.toFixed(2)}</span></div>
                <div class="res-row"><span>Custo Real para Empresa:</span><span style="font-weight:800">€${custo_total.toFixed(2)}</span></div>
            </div>`;
        document.getElementById('sub-info-label').innerText = "(Salário Líquido Mensal + Subsídio)";

    } else {
        // --- RECIBOS VERDES (ENI) ---
        const coef = parseFloat(document.getElementById('coef').value);
        const irs_rate = parseFloat(document.getElementById('irs_rate').value);
        
        // Segurança Social ENI: Incide sobre 70% do rendimento relevante. Taxa de 21,4%
        const ss_eni = bruto * 0.70 * 0.214;
        
        // Retenção na fonte de IRS sobre o valor bruto
        const irs_retido = bruto * irs_rate;
        
        // Rendimento tributável com base no coeficiente do Art. 31º
        const base_tributavel = bruto * coef;
        
        totalLiquido = bruto - ss_eni - irs_retido;

        html = `
            <div class="res-row"><span>Faturação Mensal:</span><span>€${bruto.toFixed(2)}</span></div>
            <div class="res-row"><span>Rendimento Tributável (Coef.):</span><span>€${base_tributavel.toFixed(2)}</span></div>
            <div class="res-row"><span>Segurança Social (21.4% de 70%):</span><span style="color:#dc2626">-€${ss_eni.toFixed(2)}</span></div>
            <div class="res-row"><span>Retenção na Fonte IRS:</span><span style="color:#dc2626">-€${irs_retido.toFixed(2)}</span></div>`;
        document.getElementById('sub-info-label').innerText = "(Rendimento Líquido Disponível)";
    }

    // Exibição dos resultados
    document.getElementById('detailed-results').innerHTML = html;
    document.getElementById('out_total_final').innerText = '€' + totalLiquido.toFixed(2).replace('.', ',');
    document.getElementById('results').style.display = 'block';
}

// Inicialização
renderInputs();
