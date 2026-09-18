// Array de Objetos
const listaPacientes = [
    { 
        nome: "Paciente 1", 
        idade: "19 anos", 
        ultimaSessao: "15/09/2026", 
        status: "Em acompanhamento" 
    },
    { 
        nome: "Paciente 2", 
        idade: "22 anos", 
        ultimaSessao: "12/09/2026", 
        status: "Em acompanhamento" 
    },
    { 
        nome: "Paciente 3", 
        idade: "25 anos", 
        ultimaSessao: "10/09/2026", 
        status: "Aguardando retorno" 
    },
    { 
        nome: "Paciente 4", 
        idade: "31 anos", 
        ultimaSessao: "08/09/2026", 
        status: "Em acompanhamento" 
    },
    { 
        nome: "Paciente 5", 
        idade: "28 anos", 
        ultimaSessao: "05/09/2026", 
        status: "Encerrado" 
    }
];

// Mapeamento dos elementos da DOM
const selectPacientes = document.getElementById("selectPacientes");
const btnDetalhes     = document.getElementById("btnDetalhes");
const btnAbrirModal   = document.getElementById("btnAbrirModal");
const btnCancelar     = document.getElementById("btnCancelar");
const btnSalvar       = document.getElementById("btnSalvar");
const modalForm       = document.getElementById("modalForm");

const divNome         = document.getElementById("divNome");
const divIdade        = document.getElementById("divIdade");
const divUltimaSessao = document.getElementById("divUltimaSessao");
const divStatus       = document.getElementById("divStatus");

// Evento do botão "Detalhes"
btnDetalhes.addEventListener("click", function() {
    const index = selectPacientes.value;

    if (index !== "") {
       const paciente = listaPacientes[index];
       divNome.textContent = paciente.nome;
       divIdade.textContent = paciente.idade;
       divUltimaSessao.textContent = paciente.ultimaSessao;
       divStatus.textContent = paciente.status;
    }
});

// Controles de Abertura/Fechamento do Modal
btnAbrirModal.addEventListener("click", function() {
    modalForm.style.display = "flex";
});

btnCancelar.addEventListener("click", function() {
    modalForm.style.display = "none";
    limparFormulario();
});

// Evento de Salvar o Novo Paciente
btnSalvar.addEventListener("click", function() {
    const nome = document.getElementById("inputNome").value.trim();
    const idade = document.getElementById("inputIdade").value.trim();
    const ultimaSessao = document.getElementById("inputUltimaSessao").value.trim();
    const statusVal = document.getElementById("inputStatus").value.trim();

    // Validação simples
    if (!nome || !idade || !ultimaSessao || !statusVal) {
        alert("Por favor, preencha todos os campos!");
        return;
    }

    // Adiciona o novo objeto ao FINAL do array listaPacientes usando .push()
    listaPacientes.push({
        nome: nome,
        idade: idade,
        ultimaSessao: ultimaSessao,
        status: statusVal
    });

    // Obtém o índice do novo elemento inserido
    const novoIndex = listaPacientes.length - 1;

    // Cria e adiciona a nova opção na listbox
    const novaOpcao = document.createElement("option");
    novaOpcao.value = novoIndex;
    novaOpcao.textContent = nome;
    selectPacientes.appendChild(novaOpcao);

    // Seleciona o novo paciente adicionado na listbox
    selectPacientes.value = novoIndex;

    // Fecha o modal e limpa os campos
    modalForm.style.display = "none";
    limparFormulario();
});

function limparFormulario() {
    document.getElementById("inputNome").value = "";
    document.getElementById("inputIdade").value = "";
    document.getElementById("inputUltimaSessao").value = "";
    document.getElementById("inputStatus").value = "";
}