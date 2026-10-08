// Array de objetos estruturado a partir dos dados do MongoDB
const alimentos = [
  {
    nome: "Morango",
    categoria: "frutas",
    origem_cultivo: "folhagem",
    peso_medio_g: 12.0,
    foto_url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/29/PerfectStrawberry.jpg/250px-PerfectStrawberry.jpg?utm_source=pt.wikipedia.org&utm_campaign=parser&utm_content=thumbnail",
    descricao: "Fruta vermelha, levemente ácida e rica em antioxidantes.",
    tabela_nutricional: {
      valor_energetico_kcal: 32.0,
      carboidratos_g: 7.7,
      proteinas_g: 0.7,
      gorduras_g: 0.3,
      fibras_g: 2.0,
      potassio_mg: 153.0,
      ferro_mg: 0.4,
      agua_g: 91.0,
      sodio_mg: 1.0,
      vitamina_a_mcg: 1.0,
      vitamina_c_mg: 58.8
    }
  },
  {
    nome: "Banana Prata",
    categoria: "frutas",
    origem_cultivo: "folhagem",
    peso_medio_g: 100.0,
    foto_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzOzwKR_jcFHKvs8eBoOgGzl7J7LOtRmwyJznzvwoPAA&s",
    descricao: "Fruta doce, fonte de energia rápida e rica em potássio.",
    tabela_nutricional: {
      valor_energetico_kcal: 89.0,
      carboidratos_g: 22.8,
      proteinas_g: 1.1,
      gorduras_g: 0.3,
      fibras_g: 2.6,
      potassio_mg: 358.0,
      ferro_mg: 0.3,
      agua_g: 74.9,
      sodio_mg: 1.0,
      vitamina_a_mcg: 3.0,
      vitamina_c_mg: 8.7
    }
  },
  {
    nome: "Maçã Gala",
    categoria: "frutas",
    origem_cultivo: "árvore",
    peso_medio_g: 130.0,
    foto_url: "https://supermercadobomdemais.com.br/wp-content/uploads/2020/05/Maca-Fugi.jpg",
    descricao: "Fruta crocante, doce e rica em fibras solúveis como a pectina.",
    tabela_nutricional: {
      valor_energetico_kcal: 52.0,
      carboidratos_g: 13.8,
      proteinas_g: 0.3,
      gorduras_g: 0.2,
      fibras_g: 2.4,
      potassio_mg: 107.0,
      ferro_mg: 0.1,
      agua_g: 85.6,
      sodio_mg: 1.0,
      vitamina_a_mcg: 3.0,
      vitamina_c_mg: 4.6
    }
  },
  {
    nome: "Laranja Pera",
    categoria: "frutas",
    origem_cultivo: "árvore",
    peso_medio_g: 150.0,
    foto_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHB42VtcPp_ehVUq4T1Mi2YY-EAf9ldnJnj6SpRpIJtgZ0TRUG0-IobR8&s=10",
    descricao: "Fruta cítrica suculenta, excelente fonte de imunidade e hidratação.",
    tabela_nutricional: {
      valor_energetico_kcal: 47.0,
      carboidratos_g: 11.8,
      proteinas_g: 0.9,
      gorduras_g: 0.1,
      fibras_g: 2.4,
      potassio_mg: 181.0,
      ferro_mg: 0.1,
      agua_g: 86.8,
      sodio_mg: 0.0,
      vitamina_a_mcg: 11.0,
      vitamina_c_mg: 53.2
    }
  },
  {
    nome: "Abacaxi Pérola",
    categoria: "frutas",
    origem_cultivo: "terra/raiz",
    peso_medio_g: 900.0,
    foto_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPjFuuVddJX7IuBCNLUySL0TvMarYe52Q8XpItZL7OLw&s=10",
    descricao: "Fruta tropical refrescante e digestiva devido à presença da enzima bromelina.",
    tabela_nutricional: {
      valor_energetico_kcal: 50.0,
      carboidratos_g: 13.1,
      proteinas_g: 0.5,
      gorduras_g: 0.1,
      fibras_g: 1.4,
      potassio_mg: 109.0,
      ferro_mg: 0.3,
      agua_g: 86.0,
      sodio_mg: 1.0,
      vitamina_a_mcg: 3.0,
      vitamina_c_mg: 47.8
    }
  }
];

// Mapeamento dos elementos do DOM
const selectAlimentos = document.getElementById("selectAlimentos");
const btnDetalhes = document.getElementById("btnDetalhes");
const divNome = document.getElementById("divNome");
const divDescricao = document.getElementById("divDescricao");
const divCultivoPeso = document.getElementById("divCultivoPeso");
const divNutricional = document.getElementById("divNutricional");
const divFoto = document.getElementById("divFoto");

// EventListener para exibir informações ao clicar
btnDetalhes.addEventListener("click", function() {
    const index = selectAlimentos.value;

    if (index !== "") {
        const item = alimentos[index];
        const t = item.tabela_nutricional;

        divNome.textContent = `${item.nome} (${item.categoria})`;
        divDescricao.textContent = item.descricao;
        divCultivoPeso.textContent = `Cultivo: ${item.origem_cultivo} | Peso Médio: ${item.peso_medio_g}g`;

        // Montagem formatada da tabela nutricional em lista HTML
        divNutricional.innerHTML = `
            <ul style="margin: 0; padding-left: 18px; font-size: 13px;">
                <li><strong>Calorias:</strong> ${t.valor_energetico_kcal} kcal</li>
                <li><strong>Carboidratos:</strong> ${t.carboidratos_g} g</li>
                <li><strong>Proteínas:</strong> ${t.proteinas_g} g</li>
                <li><strong>Gorduras:</strong> ${t.gorduras_g} g</li>
                <li><strong>Fibras:</strong> ${t.fibras_g} g</li>
                <li><strong>Vitamina C:</strong> ${t.vitamina_c_mg} mg</li>
                <li><strong>Potássio:</strong> ${t.potassio_mg} mg</li>
            </ul>
        `;

        // Exibição da imagem com Fallback caso a imagem do CDN não carregue
        divFoto.innerHTML = `
            <img src="${item.foto_url}" 
                 alt="Foto de ${item.nome}" 
                 onerror="this.onerror=null; this.src='https://placehold.co/100x100?text=${encodeURIComponent(item.nome)}';">
        `;
    }
});

