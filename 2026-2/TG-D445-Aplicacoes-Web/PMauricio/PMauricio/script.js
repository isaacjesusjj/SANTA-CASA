// Arquivo de configuração e processamento do Partido PMauricio

// ============================================================
// PARTE 1 - Dados e regras do partido
// ============================================================

// Dados fixos do meu partido
const NOME_PARTIDO = "PMauricio";
const NUMERO_PARTIDO = "94";

// Array que guarda SOMENTE os filiados do meu partido
const candidatos = [];

// Cargo e número que cada filiado recebe, na mesma ordem em que
// aparecem no candidatos.json (Mônica, Cebolinha, Cascão, ...).
// Respeita os limites: 1 Presidente, 1 Governador, 2 Senadores.
const distribuicao = [
    { cargo: "Presidente",           numero: "94"    },  // Mônica
    { cargo: "Governador(a)",        numero: "94"    },  // Cebolinha
    { cargo: "Senador(a)",           numero: "941"   },  // Cascão
    { cargo: "Senador(a)",           numero: "942"   },  // Magali
    { cargo: "Deputado(a) Federal",  numero: "9410"  },  // Chico Bento
    { cargo: "Deputado(a) Federal",  numero: "9420"  },  // Franjinha
    { cargo: "Deputado(a) Estadual", numero: "94100" }   // Bidú
];

// Quantidade de dígitos exigida para cada cargo
const tamanhosPorCargo = {
    "Presidente": 2,
    "Governador(a)": 2,
    "Senador(a)": 3,
    "Deputado(a) Federal": 4,
    "Deputado(a) Estadual": 5
};

async function carregarCandidatos() {
    // Esvazia o array para não duplicar caso a função rode de novo
    candidatos.length = 0;

    try {
        // Consulta o arquivo candidatos.json
        const resposta = await fetch("candidatos.json");
        const dados = await resposta.json();

        // Pega SOMENTE os registros do meu partido
        const listaDoPartido = dados[NOME_PARTIDO];

        // Adiciona os campos cargo e numero em cada candidato
        for (let i = 0; i < listaDoPartido.length; i++) {
            const candidato = listaDoPartido[i];
            candidato.cargo = distribuicao[i].cargo;
            candidato.numero = distribuicao[i].numero;

            // Armazena no array candidatos
            candidatos.push(candidato);
        }
    } catch (erro) {
        console.log("Erro ao ler candidatos.json:", erro);
        document.getElementById("msgErroPartido").textContent =
            "Não foi possível ler o candidatos.json. Abra o projeto com o Live Server.";
    }
}

// Retorna "" se o número é válido, ou o texto do erro se for inválido
function validarNumeroCandidato(numero, cargo) {
    // 1) Não pode estar vazio
    if (numero === "") {
        return "Informe o número do candidato.";
    }

    // 2) Só pode ter dígitos de 0 a 9
    for (let i = 0; i < numero.length; i++) {
        if (numero[i] < "0" || numero[i] > "9") {
            return "O número deve conter apenas dígitos.";
        }
    }

    // 3) Precisa ter o tamanho exigido para o cargo
    const tamanho = tamanhosPorCargo[cargo];
    if (numero.length !== tamanho) {
        return "Para " + cargo + " o número deve ter " + tamanho + " dígitos.";
    }

    // 4) Precisa começar com o número do partido
    if (numero.substring(0, 2) !== NUMERO_PARTIDO) {
        return "O número deve começar com " + NUMERO_PARTIDO + " (número do " + NOME_PARTIDO + ").";
    }

    return "";
}


// ============================================================
// PARTE 2 - Funções da tela (chamadas pelos botões do index.html)
// ============================================================

// Array global para armazenar as candidaturas válidas registradas em memória
const registroCandidaturas = [];

// Números dos partidos que existem no trabalho
const nomesPartidos = {
    "91": "PDisney",
    "92": "PMarvel",
    "93": "PDC",
    "94": "PMauricio"
};

// Limites de vagas por cargo (cargos que não aparecem aqui são livres)
const limites = {
    "Presidente": 1,
    "Governador(a)": 1,
    "Senador(a)": 2
};

// Mostra uma mensagem em um elemento (classe: "erro" ou "sucesso")
function mostrarMensagem(idElemento, texto, classe) {
    const elemento = document.getElementById(idElemento);
    elemento.textContent = texto;
    elemento.className = classe;
}

async function processarPartido() {
    const numeroPartido = document.getElementById("txtNumeroPartido").value.trim();
    const lista = document.getElementById("lstCandidatos");

    // Limpa a tela antes de começar
    mostrarMensagem("msgErroPartido", "", "erro");
    document.getElementById("lblNomePartido").innerHTML = "<b>---</b>";
    document.getElementById("painelCandidato").style.display = "none";
    lista.innerHTML = "";

    // O partido existe? (91, 92, 93 ou 94)
    const nomePartido = nomesPartidos[numeroPartido];
    if (nomePartido === undefined) {
        mostrarMensagem("msgErroPartido", "Partido inválido. Digite 91, 92, 93 ou 94.", "erro");
        return;
    }

    // Este sistema carrega apenas o meu partido
    if (numeroPartido !== NUMERO_PARTIDO) {
        mostrarMensagem("msgErroPartido", "Este sistema é do " + NOME_PARTIDO + " (" + NUMERO_PARTIDO + ").", "erro");
        return;
    }

    document.getElementById("lblNomePartido").innerHTML = "<b>" + nomePartido + "</b>";

    // Chama a função do script.js que lê o candidatos.json
    await carregarCandidatos();

    // Popula a listbox com os candidatos lidos
    for (let i = 0; i < candidatos.length; i++) {
        const opcao = document.createElement("option");
        opcao.textContent = candidatos[i].nome;
        lista.appendChild(opcao);
    }
}

function selecionarCandidato() {
    const lista = document.getElementById("lstCandidatos");
    const candidato = candidatos[lista.selectedIndex];

    if (candidato === undefined) {
        return;
    }

    // Preenche cargo e número com os dados do candidato
    document.getElementById("lstCargos").value = candidato.cargo;
    document.getElementById("txtNumeroCandidato").value = candidato.numero;
    mostrarMensagem("msgErroNumero", "", "erro");

    // Mostra o painel com os dados e a foto
    document.getElementById("infoNome").textContent = candidato.nome;
    document.getElementById("infoCargo").textContent = candidato.cargo;
    document.getElementById("infoNumero").textContent = candidato.numero;
    document.getElementById("infoFoto").src = candidato.foto;
    document.getElementById("painelCandidato").style.display = "block";
}

function atualizarListaRegistrados() {
    const ul = document.getElementById("listaRegistrados");
    ul.innerHTML = "";

    for (let i = 0; i < registroCandidaturas.length; i++) {
        const item = document.createElement("li");
        item.textContent = registroCandidaturas[i].nome + " - " +
                           registroCandidaturas[i].cargo + " - Nº " +
                           registroCandidaturas[i].numero;
        ul.appendChild(item);
    }
}

function registrarCandidatura() {
    mostrarMensagem("msgErroNumero", "", "erro");
    mostrarMensagem("msgFeedbackAcao", "", "erro");

    const indice = document.getElementById("lstCandidatos").selectedIndex;
    const cargo = document.getElementById("lstCargos").value;
    const numero = document.getElementById("txtNumeroCandidato").value.trim();

    // 1) Todos os campos preenchidos?
    if (indice === -1 || cargo === "" || numero === "") {
        mostrarMensagem("msgErroNumero", "Selecione o candidato, o cargo e informe o número.", "erro");
        return;
    }

    const candidato = candidatos[indice];

    // 2) Número válido para o cargo?
    const erroNumero = validarNumeroCandidato(numero, cargo);
    if (erroNumero !== "") {
        mostrarMensagem("msgErroNumero", erroNumero, "erro");
        return;
    }

    // 3) Candidato já registrado (em qualquer cargo)?
    for (let i = 0; i < registroCandidaturas.length; i++) {
        if (registroCandidaturas[i].nome === candidato.nome) {
            mostrarMensagem("msgErroNumero",
                candidato.nome + " já foi indicado(a) para " + registroCandidaturas[i].cargo + ".", "erro");
            return;
        }
    }

    // 4) Limite de vagas do cargo
    let totalNoCargo = 0;
    for (let i = 0; i < registroCandidaturas.length; i++) {
        if (registroCandidaturas[i].cargo === cargo) {
            totalNoCargo++;
        }
    }
    if (limites[cargo] !== undefined && totalNoCargo >= limites[cargo]) {
        mostrarMensagem("msgErroNumero",
            "Limite de " + limites[cargo] + " candidato(s) para " + cargo + " já atingido.", "erro");
        return;
    }

    // 5) Número já usado por outro candidato do mesmo cargo?
    for (let i = 0; i < registroCandidaturas.length; i++) {
        if (registroCandidaturas[i].cargo === cargo && registroCandidaturas[i].numero === numero) {
            mostrarMensagem("msgErroNumero", "O número " + numero + " já está em uso para " + cargo + ".", "erro");
            return;
        }
    }

    // Tudo certo: guarda no array (só os 4 campos pedidos no PDF)
    registroCandidaturas.push({
        nome: candidato.nome,
        numero: numero,
        foto: candidato.foto,
        cargo: cargo
    });

    atualizarListaRegistrados();
    mostrarMensagem("msgFeedbackAcao", candidato.nome + " registrado(a) com sucesso!", "sucesso");
}

function gravarEEnviarTSE() {
    // Precisa ter pelo menos uma candidatura
    if (registroCandidaturas.length === 0) {
        mostrarMensagem("msgFeedbackAcao", "Registre ao menos uma candidatura antes de enviar.", "erro");
        return;
    }

    // Converte o array para texto JSON
    const json = JSON.stringify(registroCandidaturas, null, 2);

    // Guarda no localStorage e mostra no console
    localStorage.setItem("candidaturasTSE", json);
    console.log(json);

    // Dispara o download do arquivo PMauricio.json
    const arquivo = new Blob([json], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(arquivo);
    link.download = NOME_PARTIDO + ".json";
    link.click();

    // Limpa os dados da tela
    registroCandidaturas.length = 0;
    atualizarListaRegistrados();
    document.getElementById("txtNumeroPartido").value = "";
    document.getElementById("lblNomePartido").innerHTML = "<b>---</b>";
    document.getElementById("lstCandidatos").innerHTML = "";
    document.getElementById("lstCargos").selectedIndex = -1;
    document.getElementById("txtNumeroCandidato").value = "";
    document.getElementById("painelCandidato").style.display = "none";
    mostrarMensagem("msgErroNumero", "", "erro");

    mostrarMensagem("msgFeedbackAcao", "Cadastro enviado ao TSE com sucesso!", "sucesso");
}
