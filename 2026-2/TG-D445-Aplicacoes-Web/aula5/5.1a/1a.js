        const siglas    = ["AL", "BA", "CE", "MA", "PB", "PE", "PI", "RN", "SE"];
    const capitais  = ["Maceió", "Salvador", "Fortaleza", "São Luís","Recife", "João Pessoa", "Teresina", "Natal", "Aracaju"];
        const areas     = ["27.843 km²", "564.733 km²", "148.894 km²", "329.642 km²", "56.469 km²", "98.311 km²", "251.529 km²", "52.797 km²", "21.918 km²"];
        const populacoes= ["3.127.511 hab.", "14.136.417 hab.", "8.794.957 hab.", "6.775.152 hab.", "3.974.495 hab.", "9.058.155 hab.", "3.269.200 hab.", "3.302.406 hab.", "2.209.558 hab."];
        const bandeiras = [
          "https://upload.wikimedia.org/wikipedia/commons/8/88/Bandeira_de_Alagoas.svg",
          "https://upload.wikimedia.org/wikipedia/commons/2/28/Bandeira_da_Bahia.svg",
          "https://upload.wikimedia.org/wikipedia/commons/2/2e/Bandeira_do_Cear%C3%A1.svg",
          "https://upload.wikimedia.org/wikipedia/commons/4/45/Bandeira_do_Maranh%C3%A3o.svg",
          "https://upload.wikimedia.org/wikipedia/commons/b/bb/Bandeira_da_Para%C3%ADba.svg",
          "https://upload.wikimedia.org/wikipedia/commons/5/59/Bandeira_de_Pernambuco.svg",
          "https://upload.wikimedia.org/wikipedia/commons/3/33/Bandeira_do_Piau%C3%AD.svg",
          "https://upload.wikimedia.org/wikipedia/commons/3/30/Bandeira_do_Rio_Grande_do_Norte.svg",
          "https://upload.wikimedia.org/wikipedia/commons/b/be/Bandeira_de_Sergipe.svg"
        ];

        // Mapeamento dos elementos da DOM
        const selectEstados = document.getElementById("selectEstados");
        const btnDetalhes   = document.getElementById("btnDetalhes");
        const divCapital    = document.getElementById("divCapital");
        const divArea       = document.getElementById("divArea");
        const divPopulacao  = document.getElementById("divPopulacao");
        const divBandeira   = document.getElementById("divBandeira");

        // EventListener para o evento onclick do botão
        btnDetalhes.addEventListener("click", function() {
            // Pega o índice selecionado na listbox (0 a 3)
            const index = selectEstados.value;

            // Se houver seleção válida
            if (index !== "") {
                // Preenche as divs usando o mesmo índice nos arrays paralelos
                divCapital.textContent = capitais[index];
                divArea.textContent = areas[index];
                divPopulacao.textContent = populacoes[index];
                
                // Exibe a imagem da bandeira no quarto quadro
                divBandeira.innerHTML = `<img src="${bandeiras[index]}" alt="Bandeira de ${siglas[index]}">`;
            }
        });