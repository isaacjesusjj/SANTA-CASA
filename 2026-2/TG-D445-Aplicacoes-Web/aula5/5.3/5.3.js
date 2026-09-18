class Paciente {
    constructor(nome, idade, ultimaSessao, status) {
        this.nome = nome;
        this.idade = idade;
        this.ultimaSessao = ultimaSessao;
        this.status = status;
    }
}

let listaPacientes = [];

// Mapeamento dos elementos da DOM
const selectPacientes = document.getElementById("selectPacientes");
const btnDetalhes     = document.getElementById("btnDetalhes");
const btnAbrirModal   = document.getElementById("btnAbrirModal");
const btnCancelar     = document.getElementById("btnCancelar");
const btnSalvar       = document.getElementById("btnSalvar");
const btnBaixarJson   = document.getElementById("btnBaixarJson");
const btnCarregarJson = document.getElementById("btnCarregarJson");
const fileInputJson   = document.getElementById("fileInputJson");
const modalForm       = document.getElementById("modalForm");

const divNome         = document.getElementById("divNome");
const divIdade        = document.getElementById("divIdade");
const divUltimaSessao = document.getElementById("divUltimaSessao");
const divStatus       = document.getElementById("divStatus");

// --- CARREGAMENTO EXCLUSIVO VIA JSON (SEM HARDCODED) ---
async function carregarDadosJSON() {
    const dadosSalvos = localStorage.getItem("pacientes_json");

    if (dadosSalvos) {
        // Instancia objetos a partir da cache local
        const objetos = JSON.parse(dadosSalvos);
        listaPacientes = objetos.map(obj => new Paciente(obj.nome, obj.idade, obj.ultimaSessao, obj.status));
        atualizarListbox();
    } else {
        try {
            // Requisita a leitura do arquivo externo 'pacientes.json'
            const resposta = await fetch("pacientes.json");
            if (!resposta.ok) throw new Error("Erro ao carregar pacientes.json");
            
            const dadosJson = await resposta.json();
            listaPacientes = dadosJson.map(obj => new Paciente(obj.nome, obj.idade, obj.ultimaSessao, obj.status));
            
            atualizarListbox();
            escreverDadosJSON();
        } catch (e) {
            console.error("Falha ao ler dados iniciais do arquivo JSON:", e);
            alert("Não foi possível carregar o arquivo 'pacientes.json'. Certifique-se de estar rodando em um servidor local.");
        }
    }
}

function escreverDadosJSON() {
    const jsonString = JSON.stringify(listaPacientes, null, 2);
    localStorage.setItem("pacientes_json", jsonString);
}

function atualizarListbox() {
    selectPacientes.innerHTML = "";
    listaPacientes.forEach((paciente, index) => {
        const opcao = document.createElement("option");
        opcao.value = index;
        opcao.textContent = paciente.nome;
        if (index === 0) opcao.selected = true;
        selectPacientes.appendChild(opcao);
    });
}

// --- EVENTOS ---
btnDetalhes.addEventListener("click", function() {
    const index = selectPacientes.value;
    if (index !== null && index !== "" && listaPacientes[index]) {
        const pacienteSelecionado = listaPacientes[index];
        divNome.textContent = pacienteSelecionado.nome;
        divIdade.textContent = pacienteSelecionado.idade;
        divUltimaSessao.textContent = pacienteSelecionado.ultimaSessao;
        divStatus.textContent = pacienteSelecionado.status;
    }
});

btnAbrirModal.addEventListener("click", () => modalForm.style.display = "flex");
btnCancelar.addEventListener("click", () => {
    modalForm.style.display = "none";
    limparFormulario();
});

btnSalvar.addEventListener("click", function() {
    const nome = document.getElementById("inputNome").value.trim();
    const idade = document.getElementById("inputIdade").value.trim();
    const ultimaSessao = document.getElementById("inputUltimaSessao").value.trim();
    const statusVal = document.getElementById("inputStatus").value.trim();

    if (!nome || !idade || !ultimaSessao || !statusVal) {
        alert("Por favor, preencha todos os campos!");
        return;
    }

    const novoPaciente = new Paciente(nome, idade, ultimaSessao, statusVal);
    listaPacientes.push(novoPaciente);

    escreverDadosJSON();
    atualizarListbox();
    selectPacientes.value = listaPacientes.length - 1;

    modalForm.style.display = "none";
    limparFormulario();
});

// Exportar/Sobrescrever arquivo JSON via FileSystem Access API
btnBaixarJson.addEventListener("click", async function() {
    const jsonString = JSON.stringify(listaPacientes, null, 2);

    if ('showSaveFilePicker' in window) {
        try {
            const handle = await window.showSaveFilePicker({
                suggestedName: 'pacientes.json',
                types: [{ description: 'Arquivo JSON', accept: { 'application/json': ['.json'] } }]
            });
            const writable = await handle.createWritable();
            await writable.write(jsonString);
            await writable.close();
        } catch (err) {
            if (err.name !== 'AbortError') console.error(err);
        }
    } else {
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "pacientes.json";
        a.click();
        URL.revokeObjectURL(url);
    }
});

// Importação de arquivo JSON externo pelo usuário
btnCarregarJson.addEventListener("click", () => fileInputJson.click());

fileInputJson.addEventListener("change", function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(evento) {
        try {
            const dadosLidos = JSON.parse(evento.target.result);
            listaPacientes = dadosLidos.map(obj => new Paciente(obj.nome, obj.idade, obj.ultimaSessao, obj.status));
            escreverDadosJSON();
            atualizarListbox();
        } catch (err) {
            alert("Erro ao ler a estrutura do arquivo JSON.");
        }
    };
    reader.readAsText(file);
});

function limparFormulario() {
    document.getElementById("inputNome").value = "";
    document.getElementById("inputIdade").value = "";
    document.getElementById("inputUltimaSessao").value = "";
    document.getElementById("inputStatus").value = "";
}

// Executa a leitura inicial exclusivamente via arquivo JSON
carregarDadosJSON();