// Arrays paralelos com informações atualizadas
const siglas = ["GO", "MT", "MS", "DF"];
const capitais = ["Goiânia", "Cuiabá", "Campo Grande", "Brasília"];
const areas = ["340.242,8 km²", "903.208,0 km²", "357.145,5 km²", "5.760,7 km²"];
const populacoes = ["7.056.495 hab.", "3.658.813 hab.", "2.756.700 hab.", "2.817.068 hab."];

// Links diretos para arquivos de imagem SVG no Wikimedia Commons
const bandeiras = [
    "https://upload.wikimedia.org/wikipedia/commons/b/be/Flag_of_Goi%C3%A1s.svg?utm_source=pt.wikipedia.org&utm_campaign=index&utm_content=original",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-9hzEAfQ40Hj_ABHUbRa_5FnxTa6yabhfxxfXDIGDtg&s",
    "https://upload.wikimedia.org/wikipedia/commons/6/64/Bandeira_de_Mato_Grosso_do_Sul.svg?utm_source=pt.wikipedia.org&utm_campaign=index&utm_content=original",
    "https://upload.wikimedia.org/wikipedia/commons/3/3c/Bandeira_do_Distrito_Federal_%28Brasil%29.svg?utm_source=pt.wikipedia.org&utm_campaign=index&utm_content=original"
];

// Mapeamento dos elementos da DOM
const selectEstados = document.getElementById("selectEstados");
const btnDetalhes = document.getElementById("btnDetalhes");
const divCapital = document.getElementById("divCapital");
const divArea = document.getElementById("divArea");
const divPopulacao = document.getElementById("divPopulacao");
const divBandeira = document.getElementById("divBandeira");

// EventListener para o clique do botão
btnDetalhes.addEventListener("click", function() {
    const index = selectEstados.value;

    if (index !== "") {
        divCapital.textContent = capitais[index];
        divArea.textContent = areas[index];
        divPopulacao.textContent = populacoes[index];
        divBandeira.innerHTML = `<img src="${bandeiras[index]}" alt="Bandeira de ${siglas[index]}">`;
    }
});