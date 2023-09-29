// Lista de arquivos JSON com respostas
const listaDeArquivos = ['db/emocoes.json', 'db/perguntas.json', 'db/saudacao.json'];

// Função para carregar o arquivo JSON de respostas
async function carregarRespostas() {
    const respostas = {};

    for (const arquivo of listaDeArquivos) {
        try {
            const response = await fetch(arquivo);
            const data = await response.json();

            // Mesclar as respostas do arquivo JSON atual nas respostas totais
            for (const chave in data) {
                const chaveFormatada = formatarChave(chave);
                respostas[chaveFormatada] = data[chave];
            }
        } catch (error) {
            console.error(`Erro ao carregar ${arquivo}:`, error);
        }
    }

    return respostas;
}

// Função para formatar a chave (pergunta) em minúsculas e sem acentos
function formatarChave(chave) {
    return chave.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Função para encontrar respostas correspondentes a partir de palavras-chave na pergunta
function encontrarResposta(respostas, pergunta) {
    pergunta = formatarChave(pergunta);

    const respostasEncontradas = [];

    for (const chave in respostas) {
        const palavrasChave = formatarChave(chave).split(' '); // Divide a chave em palavras-chave
        const todasPalavrasChavePresentes = palavrasChave.every(palavra => pergunta.includes(palavra));

        if (todasPalavrasChavePresentes) {
            respostasEncontradas.push(...respostas[chave]); // Adiciona todas as respostas correspondentes
        }
    }

    // Formate a resposta com vírgulas, se houver mais de uma resposta
    let respostaFormatada = respostasEncontradas.join(', ');

    // Remova vírgulas após pontuações, se existirem
    respostaFormatada = respostaFormatada.replace(/([.,;!?])\s*,/g, '$1 ');

    return respostaFormatada || "Desculpe, não tenho uma resposta para essa pergunta.";
}

// Carregue as respostas iniciais
let respostas;
carregarRespostas().then(data => {
    respostas = data;
});

function enviarPergunta() {
    const pergunta = document.getElementById("userInput").value;
    const chatContainer = document.getElementById("chatContainer");
    
    // Adicione a pergunta do usuário ao chat
    chatContainer.innerHTML += `<p><strong>Você:</strong> ${pergunta}</p>`;
    document.getElementById("userInput").value = "";

    // Simule um atraso de 1 segundo antes de obter a resposta da IA
    setTimeout(() => {
        if (!respostas) {
            chatContainer.innerHTML += `<p><strong>IA:</strong> Desculpe, não tenho respostas disponíveis no momento.</p>`;
        } else {
            // Encontre a resposta correspondente
            const resposta = encontrarResposta(respostas, pergunta);

            // Adicione a resposta da IA ao chat
            chatContainer.innerHTML += `<p><strong>IA:</strong> ${resposta}</p>`;
        }
    }, 1000); // Simulação de resposta após 1 segundo
}