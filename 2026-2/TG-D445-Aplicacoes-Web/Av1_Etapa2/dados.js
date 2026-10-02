// ============================================================
// dados.js - Leitura e integração dos JSONs dos partidos do grupo
// ============================================================

// Arquivos gerados pelos partidos do grupo na Etapa 1.
// Para incluir outro partido: coloque o JSON na pasta dados/ e acrescente aqui.
const ARQUIVOS_PARTIDOS = [
    "dados/PDisney.json",
    "dados/PMarvel.json",
    "dados/PMauricio.json"
];

// Número de cada partido (são os 2 primeiros dígitos dos números dos candidatos)
const NUMEROS_PARTIDOS = {
    "PDisney": "91",
    "PMarvel": "92",
    "PDC": "93",
    "PMauricio": "94"
};

// Quantos dígitos cada cargo exige (mesma regra da Etapa 1)
const DIGITOS_POR_CARGO = {
    "Presidente": 2,
    "Governador(a)": 2,
    "Senador(a)": 3,
    "Deputado(a) Federal": 4,
    "Deputado(a) Estadual": 5
};

// Máximo de candidatos por partido em cada cargo (cargos livres não aparecem aqui)
const LIMITES_POR_CARGO = {
    "Presidente": 1,
    "Governador(a)": 1,
    "Senador(a)": 2
};

// A urna foi aberta com duplo clique (endereço file://), sem servidor?
// Nesse caso o navegador NÃO deixa o fetch ler os .json; por isso existe a
// cópia dos mesmos dados em dados/dados_embutidos.js (gerada por gerar_dados_embutidos.py).
const MODO_ARQUIVO_LOCAL = window.location.protocol === "file:";

// Array único com os candidatos de TODOS os partidos do grupo
const candidatosUnificados = [];

// Resumo do que foi carregado, por exemplo: [{ partido: "PMarvel", quantidade: 9 }]
const partidosCarregados = [];

// Mensagens sobre problemas encontrados nos arquivos
const avisosDados = [];

// Alguma leitura usou a cópia embutida em vez do arquivo .json?
let usouCopiaEmbutida = false;

// "dados/PMarvel.json" -> "PMarvel"
function nomeDoPartido(caminho) {
    const nomeArquivo = caminho.split("/").pop();
    return nomeArquivo.replace(".json", "");
}

// Procura no array unificado o candidato com este número e cargo.
// Devolve o candidato, ou null se não existir.
function buscarCandidato(numero, cargoJson) {
    for (let i = 0; i < candidatosUnificados.length; i++) {
        const c = candidatosUnificados[i];
        if (c.numero === numero && c.cargo === cargoJson) {
            return c;
        }
    }
    return null;
}

// Devolve "" se a candidatura está correta, ou o motivo do problema
function validarCandidatura(c, partido) {
    if (c === null || typeof c !== "object") {
        return "item inválido";
    }
    if (typeof c.nome !== "string" || c.nome === "") {
        return "sem nome";
    }
    if (typeof c.foto !== "string" || c.foto === "") {
        return "sem foto";
    }

    const digitos = DIGITOS_POR_CARGO[c.cargo];
    if (digitos === undefined) {
        return "cargo \"" + c.cargo + "\" não existe";
    }

    const numero = String(c.numero);
    for (let i = 0; i < numero.length; i++) {
        if (numero[i] < "0" || numero[i] > "9") {
            return "número com caracteres que não são dígitos";
        }
    }
    if (numero.length !== digitos) {
        return "número " + numero + " tem " + numero.length + " dígitos, mas " + c.cargo + " exige " + digitos;
    }

    const prefixo = NUMEROS_PARTIDOS[partido];
    if (prefixo !== undefined && numero.substring(0, 2) !== prefixo) {
        return "número " + numero + " não começa com " + prefixo + " (número do " + partido + ")";
    }

    return "";
}

// Devolve a cópia embutida do partido (dados/dados_embutidos.js) ou null se não existir
function copiaEmbutida(partido) {
    if (typeof DADOS_EMBUTIDOS === "undefined") {
        return null;
    }
    const copia = DADOS_EMBUTIDOS.partidos[partido];
    return copia === undefined ? null : copia;
}

// Data em que a cópia embutida foi gerada (texto para mostrar na tela)
function dataDaCopiaEmbutida() {
    if (typeof DADOS_EMBUTIDOS === "undefined") {
        return "";
    }
    return new Date(DADOS_EMBUTIDOS.geradoEm).toLocaleString("pt-BR");
}

// Lê os dados de um partido e devolve o conteúdo do JSON.
//  - Com servidor (Live Server, GitHub Pages...): lê o arquivo .json com fetch.
//  - Sem servidor (duplo clique no urna.html): usa a cópia embutida.
async function lerDadosDoPartido(caminho, partido) {
    const copia = copiaEmbutida(partido);

    if (MODO_ARQUIVO_LOCAL) {
        if (copia === null) {
            throw new Error("a urna foi aberta sem servidor e não há cópia embutida de " + partido +
                            " (dados/dados_embutidos.js). Use o Live Server ou rode gerar_dados_embutidos.py");
        }
        usouCopiaEmbutida = true;
        return copia;
    }

    try {
        const resposta = await fetch(caminho);
        if (!resposta.ok) {
            throw new Error("arquivo não encontrado (HTTP " + resposta.status + ")");
        }
        const dados = await resposta.json();

        // Avisa se a cópia embutida ficou diferente do .json (alguém editou o .json)
        if (copia !== null && JSON.stringify(copia) !== JSON.stringify(dados)) {
            avisosDados.push(caminho + ": a cópia embutida está desatualizada em relação ao .json " +
                             "(rode gerar_dados_embutidos.py para o duplo clique usar os dados novos)");
        }
        return dados;
    } catch (erro) {
        if (copia === null) {
            throw erro;
        }
        usouCopiaEmbutida = true;
        avisosDados.push(caminho + ": não foi possível ler o .json (" + erro.message + ") - usando a cópia embutida");
        return copia;
    }
}

// Lê todos os arquivos de ARQUIVOS_PARTIDOS e junta em candidatosUnificados
async function carregarPartidos() {
    candidatosUnificados.length = 0;
    partidosCarregados.length = 0;
    avisosDados.length = 0;
    usouCopiaEmbutida = false;

    for (let i = 0; i < ARQUIVOS_PARTIDOS.length; i++) {
        const caminho = ARQUIVOS_PARTIDOS[i];
        const partido = nomeDoPartido(caminho);

        try {
            const dados = await lerDadosDoPartido(caminho, partido);

            // Aceita uma lista direta [ ... ] ou um objeto { candidaturas: [ ... ] }
            const lista = Array.isArray(dados) ? dados : dados.candidaturas;
            if (!Array.isArray(lista)) {
                throw new Error("formato não reconhecido (esperado uma lista de candidaturas)");
            }

            let aceitos = 0;
            const contagemPorCargo = {};

            for (let j = 0; j < lista.length; j++) {
                const c = lista[j];

                const problema = validarCandidatura(c, partido);
                if (problema !== "") {
                    avisosDados.push(caminho + ": " + (c && c.nome ? c.nome : "item " + (j + 1)) + " ignorado(a) - " + problema);
                    continue;
                }

                const numero = String(c.numero);
                if (buscarCandidato(numero, c.cargo) !== null) {
                    avisosDados.push(caminho + ": " + c.nome + " ignorado(a) - o número " + numero + " já existe para " + c.cargo);
                    continue;
                }

                // O nome do partido vem do nome do arquivo
                candidatosUnificados.push({
                    nome: c.nome,
                    numero: numero,
                    cargo: c.cargo,
                    foto: c.foto,
                    partido: partido
                });
                aceitos++;
                contagemPorCargo[c.cargo] = (contagemPorCargo[c.cargo] || 0) + 1;
            }

            partidosCarregados.push({ partido: partido, quantidade: aceitos });

            // Confere os limites de vagas do partido (só avisa)
            for (const cargo in LIMITES_POR_CARGO) {
                if (contagemPorCargo[cargo] > LIMITES_POR_CARGO[cargo]) {
                    avisosDados.push(caminho + ": " + partido + " tem " + contagemPorCargo[cargo] + " candidatos a " + cargo +
                                     " (máximo " + LIMITES_POR_CARGO[cargo] + ")");
                }
            }
        } catch (erro) {
            avisosDados.push(caminho + ": não foi possível carregar - " + erro.message);
        }
    }

    for (let i = 0; i < avisosDados.length; i++) {
        console.warn(avisosDados[i]);
    }
}
