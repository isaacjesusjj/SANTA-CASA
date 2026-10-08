// Array de objetos com os dados iniciais dos estados
const estados = [
    {
        sigla: "GO",
        capital: "Goiânia",
        area: "340.242,8 km²",
        populacao: "7.056.495 hab.",
        bandeira: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Bandeira_de_Goi%C3%A1s.svg"
    },
    {
        sigla: "MT",
        capital: "Cuiabá",
        area: "903.208,0 km²",
        populacao: "3.658.813 hab.",
        bandeira: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Bandeira_do_Mato_Grosso.svg"
    },
    {
        sigla: "MS",
        capital: "Campo Grande",
        area: "357.145,5 km²",
        populacao: "2.756.700 hab.",
        bandeira: "https://upload.wikimedia.org/wikipedia/commons/4/48/Bandeira_de_Mato_Grosso_do_Sul.svg"
    },
    {
        sigla: "DF",
        capital: "Brasília",
        area: "5.760,7 km²",
        populacao: "2.817.068 hab.",
        bandeira: "https://upload.wikimedia.org/wikipedia/commons/3/3c/Bandeira_do_Distrito_Federal_%28Brasil%29.svg"
    }
];

// Mapeamento dos elementos da DOM
const selectEstados = document.getElementById("selectEstados");
const btnDetalhes = document.getElementById("btnDetalhes");
const btnNovoEstado = document.getElementById("btnNovoEstado");
const btnCancelar = document.getElementById("btnCancelar");
const modalCadastro = document.getElementById("modalCadastro");
const formEstado = document.getElementById("formEstado");

const divCapital = document.getElementById("divCapital");
const divArea = document.getElementById("divArea");
const divPopulacao = document.getElementById("divPopulacao");
const divBandeira = document.getElementById("divBandeira");

// Função para renderizar o <select> com os estados do array
function renderizarSelect() {
    selectEstados.innerHTML = "";
    estados.forEach((estado, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = estado.sigla;
        if (index === 0) option.selected = true;
        selectEstados.appendChild(option);
    });
}

// Função para exibir os detalhes do estado selecionado
function exibirDetalhes() {
    const index = selectEstados.value;
    if (index !== "" && estados[index]) {
        const estado = estados[index];
        divCapital.textContent = estado.capital;
        divArea.textContent = estado.area;
        divPopulacao.textContent = estado.populacao;
        divBandeira.innerHTML = `<img src="${estado.bandeira}" alt="Bandeira de ${estado.sigla}" onerror="this.onerror=null; this.src='https://via.placeholder.com/80?text=${estado.sigla}';">`;
    }
}

// Event Listeners
btnDetalhes.addEventListener("click", exibirDetalhes);

// Abrir Modal de Cadastro
btnNovoEstado.addEventListener("click", () => {
    modalCadastro.style.display = "flex";
});

// Cancelar/Fechar Modal
btnCancelar.addEventListener("click", () => {
    modalCadastro.style.display = "none";
    formEstado.reset();
});

// Salvar Novo Estado
formEstado.addEventListener("submit", (e) => {
    e.preventDefault();

    // Captura os dados do formulário
    const novoEstado = {
        sigla: document.getElementById("inputSigla").value.toUpperCase(),
        capital: document.getElementById("inputCapital").value,
        area: document.getElementById("inputArea").value,
        populacao: document.getElementById("inputPopulacao").value,
        bandeira: document.getElementById("inputBandeira").value
    };

    // Insere o novo estado no array
    estados.push(novoEstado);

    // Atualiza o select, seleciona o novo estado e exibe seus detalhes
    renderizarSelect();
    selectEstados.value = estados.length - 1;
    exibirDetalhes();

    // Limpa o formulário e fecha o modal
    formEstado.reset();
    modalCadastro.style.display = "none";
});

// Inicialização
renderizarSelect();