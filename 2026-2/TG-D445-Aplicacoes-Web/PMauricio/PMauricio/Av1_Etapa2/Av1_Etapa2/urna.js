// ============================================================
// urna.js - Fluxo de votação, captura de teclas e eventos
// ============================================================

// Ordem oficial dos cargos para a eleição de 2026.
//  - nome:      texto mostrado na tela da urna
//  - digitos:   quantidade de dígitos do número
//  - cargoJson: como o cargo aparece nos JSONs dos partidos
//  - grupo:     usado no Boletim (as 2 vagas de Senador são somadas)
const cargos2026 = [
    { nome: "Deputado Federal",  digitos: 4, cargoJson: "Deputado(a) Federal",  grupo: "Deputado Federal" },
    { nome: "Deputado Estadual", digitos: 5, cargoJson: "Deputado(a) Estadual", grupo: "Deputado Estadual" },
    { nome: "Senador (1ª Vaga)", digitos: 3, cargoJson: "Senador(a)",           grupo: "Senador" },
    { nome: "Senador (2ª Vaga)", digitos: 3, cargoJson: "Senador(a)",           grupo: "Senador" },
    { nome: "Governador",        digitos: 2, cargoJson: "Governador(a)",        grupo: "Governador" },
    { nome: "Presidente",        digitos: 2, cargoJson: "Presidente",           grupo: "Presidente" }
];

// Tempo que a mensagem "F I M" fica na tela antes do próximo eleitor
const TEMPO_FIM_MS = 3000;

// Estado do fluxo da urna
let etapaAtual = 0;
let numeroDigitado = "";
let votoEmBranco = false;
let votacaoBloqueada = true;    // só libera depois que os partidos forem carregados
let votacaoEncerrada = false;
let candidatoDaTela = null;     // candidato encontrado para o número digitado (null = nulo)

// Memória da Urna (acumulador com os votos de todos os eleitores)
const memoriaVotosEleitores = [];
let votoEleitorAtual = {};

// Guardados ao encerrar, para poder baixar de novo
let arquivoVotosGerado = null;
let boletimGerado = null;

document.addEventListener("DOMContentLoaded", iniciarUrna);

async function iniciarUrna() {
    ligarEventos();

    // Lê e integra os JSONs de todos os partidos do grupo
    await carregarPartidos();
    mostrarStatusPartidos();

    // Se faltou algum partido, a urna não abre (os votos nele seriam contados como nulos)
    const faltouPartido = partidosCarregados.length !== ARQUIVOS_PARTIDOS.length;
    if (faltouPartido || candidatosUnificados.length === 0) {
        mostrarTela("telaErro");
        document.getElementById("btnEncerrar").disabled = true;
        return;
    }

    iniciarNovoEleitor();
}

// ---------- Eventos (botões e teclado) ----------

function ligarEventos() {
    const teclas = document.querySelectorAll("[data-tecla]");
    for (let i = 0; i < teclas.length; i++) {
        teclas[i].addEventListener("click", function () {
            digitar(this.dataset.tecla);
        });
    }

    document.getElementById("btnBranco").addEventListener("click", votarBranco);
    document.getElementById("btnCorrige").addEventListener("click", corrigir);
    document.getElementById("btnConfirma").addEventListener("click", confirmar);
    document.getElementById("btnEncerrar").addEventListener("click", encerrarVotacaoEEnviarTSE);

    document.getElementById("btnSom").addEventListener("click", function () {
        const ligado = alternarSom();
        this.textContent = ligado ? "Som: ligado" : "Som: desligado";
        this.classList.toggle("desligado", !ligado);
    });

    document.getElementById("btnBaixarBoletim").addEventListener("click", function () {
        if (boletimGerado !== null) {
            baixarJson(boletimGerado, "boletimDeUrna.json");
        }
    });
    document.getElementById("btnBaixarVotos").addEventListener("click", function () {
        if (arquivoVotosGerado !== null) {
            baixarJson(arquivoVotosGerado, "votos.json");
        }
    });
    document.getElementById("btnImprimir").addEventListener("click", function () {
        window.print();
    });

    // Se a foto do candidato não carregar, mostra "Foto indisponível"
    document.getElementById("imgCandidato").addEventListener("error", function () {
        if (this.getAttribute("src")) {
            this.classList.add("oculto");
            document.getElementById("fotoIndisponivel").classList.remove("oculto");
        }
    });

    document.addEventListener("keydown", tratarTecla);

    // Avisa antes de fechar a página se existirem votos que ainda não foram exportados
    window.addEventListener("beforeunload", function (evento) {
        if (memoriaVotosEleitores.length > 0 && !votacaoEncerrada) {
            evento.preventDefault();
            evento.returnValue = "";
        }
    });
}

// Teclado do computador: 0-9, B = Branco, Backspace = Corrige, Enter = Confirma
function tratarTecla(evento) {
    // Ignora tecla segurada (repetição) e atalhos com Ctrl/Alt/Cmd
    if (evento.repeat || evento.ctrlKey || evento.altKey || evento.metaKey) {
        return;
    }

    const tecla = evento.key;

    if (tecla.length === 1 && tecla >= "0" && tecla <= "9") {
        evento.preventDefault();
        digitar(tecla);
    } else if (tecla === "Enter") {
        evento.preventDefault();   // evita "clicar" de novo no botão que está em foco
        confirmar();
    } else if (tecla === "Backspace" || tecla === "Delete") {
        evento.preventDefault();
        corrigir();
    } else if (tecla === "b" || tecla === "B") {
        evento.preventDefault();
        votarBranco();
    }
}

// ---------- Telas ----------

// Mostra apenas uma das telas: "conteudo-voto", "telaFim", "telaEncerrada" ou "telaErro"
function mostrarTela(idVisivel) {
    const ids = ["conteudo-voto", "telaFim", "telaEncerrada", "telaErro"];
    for (let i = 0; i < ids.length; i++) {
        document.getElementById(ids[i]).classList.toggle("oculto", ids[i] !== idVisivel);
    }
}

// Mostra um dos blocos da área de dados: "blocoCandidato", "blocoNulo", "blocoBranco" (ou nenhum)
function mostrarBlocoDados(idVisivel) {
    const ids = ["blocoCandidato", "blocoNulo", "blocoBranco"];
    for (let i = 0; i < ids.length; i++) {
        document.getElementById(ids[i]).classList.toggle("oculto", ids[i] !== idVisivel);
    }
}

function mostrarStatusPartidos() {
    const status = document.getElementById("statusPartidos");
    status.classList.remove("aviso-status", "erro-status");

    const faltouPartido = partidosCarregados.length !== ARQUIVOS_PARTIDOS.length;
    if (faltouPartido || candidatosUnificados.length === 0) {
        status.textContent = "Erro ao carregar os partidos: " + (avisosDados[0] || "nenhum candidato encontrado");
        status.classList.add("erro-status");
        return;
    }

    let texto = "Partidos carregados: ";
    for (let i = 0; i < partidosCarregados.length; i++) {
        texto += partidosCarregados[i].partido + " (" + partidosCarregados[i].quantidade + ")";
        if (i < partidosCarregados.length - 1) {
            texto += ", ";
        }
    }
    texto += " - " + candidatosUnificados.length + " candidatos";

    if (usouCopiaEmbutida) {
        texto += " - dados: cópia embutida (gerada em " + dataDaCopiaEmbutida() + ")";
    }

    if (avisosDados.length > 0) {
        texto += " - Atenção: " + avisosDados.length + " aviso(s), veja o console (F12)";
        status.classList.add("aviso-status");
    }
    status.textContent = texto;
}

// ---------- Fluxo de votação ----------

function iniciarNovoEleitor() {
    etapaAtual = 0;
    votoEleitorAtual = {};
    votacaoBloqueada = false;
    mostrarTela("conteudo-voto");
    iniciarEtapa();
}

function iniciarEtapa() {
    numeroDigitado = "";
    votoEmBranco = false;
    candidatoDaTela = null;

    const cargo = cargos2026[etapaAtual];
    document.getElementById("lblCargo").textContent = cargo.nome;

    mostrarBlocoDados(null);
    const foto = document.getElementById("imgCandidato");
    foto.classList.add("oculto");
    foto.removeAttribute("src");
    document.getElementById("fotoIndisponivel").classList.add("oculto");

    renderizarQuadradosDigitos(cargo.digitos);
}

function renderizarQuadradosDigitos(qtd) {
    const container = document.getElementById("containerDigitos");
    container.classList.remove("oculto");
    container.innerHTML = "";

    for (let i = 0; i < qtd; i++) {
        const div = document.createElement("div");
        div.className = i === 0 ? "digito pisca" : "digito";
        div.id = "digito-" + i;
        container.appendChild(div);
    }
}

function digitar(n) {
    if (votacaoBloqueada || votoEmBranco) return;

    const cargo = cargos2026[etapaAtual];
    if (numeroDigitado.length < cargo.digitos) {
        numeroDigitado += n;

        // Atualiza o quadrado correspondente
        const digitoElem = document.getElementById("digito-" + (numeroDigitado.length - 1));
        if (digitoElem) {
            digitoElem.textContent = n;
            digitoElem.classList.remove("pisca");
        }

        // Coloca o cursor piscante no próximo quadrado
        if (numeroDigitado.length < cargo.digitos) {
            const proximoElem = document.getElementById("digito-" + numeroDigitado.length);
            if (proximoElem) proximoElem.classList.add("pisca");
        }

        // Se completou todos os dígitos, procura o candidato
        if (numeroDigitado.length === cargo.digitos) {
            verificarCandidatoDigitado(numeroDigitado, cargo.cargoJson);
        }
    }
}

// Busca o número digitado no array unificado (JSONs de todos os partidos)
function verificarCandidatoDigitado(numero, cargoJson) {
    candidatoDaTela = buscarCandidato(numero, cargoJson);

    if (candidatoDaTela !== null) {
        document.getElementById("valNome").textContent = candidatoDaTela.nome;
        document.getElementById("valPartido").textContent = candidatoDaTela.partido;
        mostrarBlocoDados("blocoCandidato");

        const foto = document.getElementById("imgCandidato");
        document.getElementById("fotoIndisponivel").classList.add("oculto");
        foto.classList.remove("oculto");
        foto.src = candidatoDaTela.foto;
    } else {
        // Não encontrou: indica Voto Nulo na tela
        mostrarBlocoDados("blocoNulo");
    }
}

function votarBranco() {
    if (votacaoBloqueada) return;

    if (numeroDigitado === "") {
        votoEmBranco = true;
        document.getElementById("containerDigitos").classList.add("oculto");
        mostrarBlocoDados("blocoBranco");
    } else {
        alert("Para votar em BRANCO, o campo de número deve estar vazio. Aperte CORRIGE primeiro.");
    }
}

function corrigir() {
    if (votacaoBloqueada) return;
    iniciarEtapa();
}

function confirmar() {
    if (votacaoBloqueada) return;

    const cargo = cargos2026[etapaAtual];

    if (votoEmBranco) {
        votoEleitorAtual[cargo.nome] = { numero: "BRANCO", tipo: "BRANCO" };
    } else if (numeroDigitado.length === cargo.digitos) {
        if (candidatoDaTela !== null) {
            votoEleitorAtual[cargo.nome] = {
                numero: numeroDigitado,
                tipo: "REGULAR",
                nome: candidatoDaTela.nome,
                partido: candidatoDaTela.partido
            };
        } else {
            votoEleitorAtual[cargo.nome] = { numero: numeroDigitado, tipo: "NULO" };
        }
    } else {
        alert("Por favor, insira os " + cargo.digitos + " dígitos do cargo de " + cargo.nome + " ou vote em BRANCO.");
        return;
    }

    // Bônus 2: som da urna ao confirmar o voto
    tocarSomConfirma();

    etapaAtual++;
    if (etapaAtual < cargos2026.length) {
        iniciarEtapa();
    } else {
        finalizarVotoEleitor();
    }
}

function finalizarVotoEleitor() {
    votacaoBloqueada = true;

    // Guarda a cédula completa do eleitor na memória da urna
    memoriaVotosEleitores.push({
        eleitor: memoriaVotosEleitores.length + 1,
        votos: votoEleitorAtual
    });

    // Limpa o estado da digitação (nada do eleitor anterior fica para o próximo)
    numeroDigitado = "";
    votoEmBranco = false;
    candidatoDaTela = null;

    mostrarTela("telaFim");

    // Depois de alguns segundos, prepara a urna para o próximo eleitor
    setTimeout(function () {
        if (votacaoEncerrada) return;   // se a votação foi encerrada nesse intervalo, não reabre
        iniciarNovoEleitor();
    }, TEMPO_FIM_MS);
}

// ---------- Encerramento e exportação ----------

// Existe um eleitor no meio da votação (ainda sem ter confirmado o Presidente)?
function eleitorVotandoAgora() {
    return !votacaoBloqueada && (etapaAtual > 0 || numeroDigitado !== "" || votoEmBranco);
}

// Monta o conteúdo do arquivo votos.json (registro voto a voto)
function montarArquivoVotos() {
    const nomes = [];
    for (let i = 0; i < partidosCarregados.length; i++) {
        nomes.push(partidosCarregados[i].partido);
    }
    return {
        urna: "Urna Eletrônica - Simulação 2026",
        partidos: nomes,
        encerradaEm: new Date().toISOString(),
        totalEleitores: memoriaVotosEleitores.length,
        eleitores: memoriaVotosEleitores
    };
}

// Baixa um objeto como arquivo .json
function baixarJson(objeto, nomeArquivo) {
    const texto = JSON.stringify(objeto, null, 2);
    const arquivo = new Blob([texto], { type: "application/json" });
    const url = URL.createObjectURL(arquivo);

    const link = document.createElement("a");
    link.href = url;
    link.download = nomeArquivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
}

function encerrarVotacaoEEnviarTSE() {
    if (votacaoEncerrada) return;

    if (memoriaVotosEleitores.length === 0) {
        alert("Nenhum voto foi registrado nesta urna ainda!");
        return;
    }

    let pergunta = "Deseja encerrar a eleição? Total de eleitores que votaram: " + memoriaVotosEleitores.length;
    if (eleitorVotandoAgora()) {
        pergunta += "\n\nATENÇÃO: há um eleitor votando agora. O voto dele ainda não foi concluído e NÃO será contado.";
    }

    if (!confirm(pergunta)) return;

    votacaoEncerrada = true;
    votacaoBloqueada = true;
    document.getElementById("btnEncerrar").disabled = true;

    // Exporta automaticamente o votos.json
    arquivoVotosGerado = montarArquivoVotos();
    baixarJson(arquivoVotosGerado, "votos.json");

    mostrarTela("telaEncerrada");

    // Bônus 1: Boletim de Urna na tela
    boletimGerado = montarBoletim(memoriaVotosEleitores);
    mostrarBoletim(boletimGerado);
}
