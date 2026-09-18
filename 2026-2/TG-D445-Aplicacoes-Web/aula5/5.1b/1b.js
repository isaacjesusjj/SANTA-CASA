const pacientes = [
    "Paciente 1",
    "Paciente 2",
    "Paciente 3",
    "Paciente 4",
    "Paciente 5"
];

const idades = [
    "19 anos",
    "22 anos",
    "25 anos",
    "31 anos",
    "28 anos"
];

const ultimasSessoes = [
    "15/09/2026",
    "12/09/2026",
    "10/09/2026",
    "08/09/2026",
    "05/09/2026"
];

const status = [
    "Em acompanhamento",
    "Em acompanhamento",
    "Aguardando retorno",
    "Em acompanhamento",
    "Encerrado"
];


// Mapeamento dos elementos da DOM

const selectPacientes = document.getElementById("selectPacientes");

const btnDetalhes = document.getElementById("btnDetalhes");

const divNome = document.getElementById("divNome");

const divIdade = document.getElementById("divIdade");

const divUltimaSessao = document.getElementById("divUltimaSessao");

const divStatus = document.getElementById("divStatus");


// EventListener para o evento onclick do botão

btnDetalhes.addEventListener("click", function() {

    // Pega o índice selecionado na listbox (0 a 4)

    const index = selectPacientes.value;

    // Se houver seleção válida

    if (index !== "") {

        // Preenche as divs usando o mesmo índice nos arrays paralelos

        divNome.textContent = pacientes[index];

        divIdade.textContent = idades[index];

        divUltimaSessao.textContent = ultimasSessoes[index];

        divStatus.textContent = status[index];

    }

});
