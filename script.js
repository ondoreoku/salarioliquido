// Função de UI (mantém-se igual)
function toggleInputs() {
    const tipo = document.getElementById('tipoTrabalhador').value;
    document.getElementById('camposTCO').style.display = tipo === 'outrem' ? 'grid' : 'none';
    document.getElementById('camposENI').style.display = tipo === 'eni' ? 'grid' : 'none';
}

// Nova função que comunica com a API do Render
async function calcularSalario() {
    // 1. Capturar valores do formulário
    const tipo = document.getElementById('tipoTrabalhador').value;
    const bruto = parseFloat(document.getElementById('bruto').value) || 0;
    
    // Elementos de UI
    const btnCalcular = document.querySelector('button[onclick="calcularSalario()"]') || document.getElementById('btnCalcular');
    const resultsDiv = document.getElementById('results');

    // Validação básica
    if (bruto <= 0) {
        alert("Por favor, insere um valor de salário bruto válido.");
        return;
    }

    // 2. Preparar UI para "loading" (UX para o cold start do Render)
    if (btnCalcular) {
        btnCalcular.disabled = true;
        btnCalcular.innerText = "A processar no servidor...";
    }
    resultsDiv.style.display = 'none';

    // 3. Construir o objeto JSON para enviar à API
    const payload = {
        bruto: bruto,
        regime: tipo // 'outrem' ou 'eni'
    };

    if (tipo === 'outrem') {
        payload.subsidio_alimentacao = parseFloat(document.getElementById('subsidioAlim').value) || 6.0;
        payload.estado_civil = document.getElementById('estadoCivil').value;
    } else {
        payload.coeficiente_atividade = parseFloat(document.getElementById('cirsAtividade').value) || 0.75;
        payload.retencao_irs = parseFloat(document.getElementById('retencaoENI').value) || 0.15;
        payload.isento_ss = document.getElementById('isentoSS').value || "nao";
    }

    // 4. Fazer o pedido à API (FETCH)
    try {
        const response = await fetch('https://calculadoras-portugal.onrender.com/api/salario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Erro do servidor: ${response.status}`);
        }

        const data = await response.json();

        // 5. Extrair os valores exatamente como o Python os devolve
        const valorLiquido = data.liquido || 0;
        // O Python devolve 'irs' e 'seguranca_social' separadamente. Somamos para o total de impostos.
        const valorImpostos = (data.irs || 0) + (data.seguranca_social || 0);

        // 6. Mostrar resultados no ecrã (usando os IDs do teu HTML original)
        document.getElementById('out-liquido').innerText = `€${valorLiquido.toFixed(2)}`;
        document.getElementById('out-impostos').innerText = `€${valorImpostos.toFixed(2)}`;
        
        // Opcional: Mostrar detalhes extra se quiseres enriquecer o teu HTML no futuro
        // console.log("Detalhes:", data); 

        resultsDiv.style.display = 'block';

    } catch (error) {
        console.error("Erro ao calcular:", error);
        alert("Ocorreu um erro ao contactar o servidor. Verifica a tua ligação ou tenta novamente em instantes.");
    } finally {
        // 7. Restaurar o botão ao estado original
        if (btnCalcular) {
            btnCalcular.disabled = false;
            btnCalcular.innerText = "Calcular Salário"; // Ou o texto original do teu botão
        }
    }
}