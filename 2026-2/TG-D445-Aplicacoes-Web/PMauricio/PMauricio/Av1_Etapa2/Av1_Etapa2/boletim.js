// ============================================================
// boletim.js - Bônus 1: Boletim de Urna (apuração final)
// Usa o array cargos2026 (urna.js) e candidatosUnificados (dados.js).
// ============================================================

// Agrupa as vagas por cargo. As duas vagas de Senador viram um grupo só.
// Resultado: [{ nome: "Senador", cargoJson: "Senador(a)", vagas: 2 }, ...]
function listarGruposDeCargos() {
    const grupos = [];
    for (let i = 0; i < cargos2026.length; i++) {
        const cargo = cargos2026[i];
        let achou = false;
        for (let j = 0; j < grupos.length; j++) {
            if (grupos[j].nome === cargo.grupo) {
                grupos[j].vagas++;
                achou = true;
            }
        }
        if (!achou) {
            grupos.push({ nome: cargo.grupo, cargoJson: cargo.cargoJson, vagas: 1 });
        }
    }
    return grupos;
}

// Procura, na lista de um cargo, o candidato com este número
function acharCandidatoPorNumero(lista, numero) {
    for (let i = 0; i < lista.length; i++) {
        if (lista[i].numero === numero) {
            return lista[i];
        }
    }
    return null;
}

// Conta os votos de todos os eleitores e devolve o boletim
function montarBoletim(eleitores) {
    const boletim = {
        urna: "Urna Eletrônica - Simulação 2026",
        geradoEm: new Date().toISOString(),
        totalEleitores: eleitores.length,
        cargos: []
    };

    const grupos = listarGruposDeCargos();

    for (let g = 0; g < grupos.length; g++) {
        const grupo = grupos[g];
        const resultado = {
            cargo: grupo.nome,
            votosPorEleitor: grupo.vagas,
            totalVotos: 0,
            brancos: 0,
            nulos: 0,
            candidatos: []
        };

        // Todos os candidatos do cargo começam com 0 votos
        for (let i = 0; i < candidatosUnificados.length; i++) {
            const c = candidatosUnificados[i];
            if (c.cargo === grupo.cargoJson) {
                resultado.candidatos.push({ numero: c.numero, nome: c.nome, partido: c.partido, votos: 0 });
            }
        }

        // Passa por todos os votos de todos os eleitores
        for (let e = 0; e < eleitores.length; e++) {
            for (let k = 0; k < cargos2026.length; k++) {
                if (cargos2026[k].grupo !== grupo.nome) {
                    continue;
                }
                const voto = eleitores[e].votos[cargos2026[k].nome];
                if (voto === undefined) {
                    continue;
                }

                resultado.totalVotos++;
                if (voto.tipo === "BRANCO") {
                    resultado.brancos++;
                } else if (voto.tipo === "NULO") {
                    resultado.nulos++;
                } else {
                    const candidato = acharCandidatoPorNumero(resultado.candidatos, voto.numero);
                    if (candidato !== null) {
                        candidato.votos++;
                    } else {
                        resultado.candidatos.push({ numero: voto.numero, nome: voto.nome, partido: voto.partido, votos: 1 });
                    }
                }
            }
        }

        // Mais votados primeiro
        resultado.candidatos.sort(function (a, b) { return b.votos - a.votos; });

        boletim.cargos.push(resultado);
    }

    return boletim;
}

// Cria um elemento de texto (th/td/p...) com classe opcional
function criarElementoTexto(tag, texto, classe) {
    const elemento = document.createElement(tag);
    elemento.textContent = texto;
    if (classe) {
        elemento.className = classe;
    }
    return elemento;
}

// Cria uma linha da tabela com 4 colunas
function criarLinha(numero, nome, partido, votos, classeLinha) {
    const linha = document.createElement("tr");
    if (classeLinha) {
        linha.className = classeLinha;
    }
    linha.appendChild(criarElementoTexto("td", numero));
    linha.appendChild(criarElementoTexto("td", nome));
    linha.appendChild(criarElementoTexto("td", partido));
    linha.appendChild(criarElementoTexto("td", String(votos), votos === 0 ? "num sem-votos" : "num"));
    return linha;
}

// Mostra o boletim na tela (seção #boletim)
function mostrarBoletim(boletim) {
    document.getElementById("boletimResumo").textContent =
        "Eleitores que votaram: " + boletim.totalEleitores +
        " - gerado em " + new Date(boletim.geradoEm).toLocaleString("pt-BR");

    const area = document.getElementById("boletimCargos");
    area.innerHTML = "";

    for (let i = 0; i < boletim.cargos.length; i++) {
        const cargo = boletim.cargos[i];

        let titulo = cargo.cargo;
        if (cargo.votosPorEleitor > 1) {
            titulo += " (" + cargo.votosPorEleitor + " vagas - votos somados)";
        }
        area.appendChild(criarElementoTexto("h3", titulo));

        const tabela = document.createElement("table");

        const cabecalho = document.createElement("tr");
        cabecalho.appendChild(criarElementoTexto("th", "Nº"));
        cabecalho.appendChild(criarElementoTexto("th", "Candidato"));
        cabecalho.appendChild(criarElementoTexto("th", "Partido"));
        cabecalho.appendChild(criarElementoTexto("th", "Votos", "num"));
        tabela.appendChild(cabecalho);

        for (let j = 0; j < cargo.candidatos.length; j++) {
            const c = cargo.candidatos[j];
            tabela.appendChild(criarLinha(c.numero, c.nome, c.partido, c.votos));
        }
        tabela.appendChild(criarLinha("", "Votos em branco", "", cargo.brancos));
        tabela.appendChild(criarLinha("", "Votos nulos", "", cargo.nulos));
        tabela.appendChild(criarLinha("", "Total de votos", "", cargo.totalVotos, "total"));

        area.appendChild(tabela);
    }

    const secao = document.getElementById("boletim");
    secao.classList.remove("oculto");
    if (secao.scrollIntoView) {
        secao.scrollIntoView();
    }
}
