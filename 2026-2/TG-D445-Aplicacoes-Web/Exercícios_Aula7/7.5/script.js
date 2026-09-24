// Base de dados simulando entrada vinda de um arquivo/API JSON
//TODO: Mudar para um arquivo JSON externo e utilizar fetch() para carregar os dados
const jsonBaseDeDados = `[
  {"id": 1, "nome": "Smartphone Galaxy", "categoria": "Eletrônicos", "preco": 2500},
  {"id": 2, "nome": "Camiseta Algodão", "categoria": "Roupas", "preco": 80},
  {"id": 3, "nome": "Notebook Pro", "categoria": "Eletrônicos", "preco": 5200},
  {"id": 4, "nome": "Jaqueta Jeans", "categoria": "Roupas", "preco": 220},
  {"id": 5, "nome": "Fone Sem Fio", "categoria": "Eletrônicos", "preco": 350}
]`;


// 1. Converter o JSON para Array de objetos JavaScript
const produtos = JSON.parse(jsonBaseDeDados);

function renderizar(lista) {
  const container = document.getElementById("gradeProdutos");
  container.innerHTML = "";

  if (lista.length === 0) {
    container.innerHTML = "<p>Nenhum produto encontrado.</p>";
    return;
  }

  // TODO: Percorra o array 'lista' recebido por parâmetro
  // Para cada produto, crie um card HTML contendo Nome, Categoria e Preço e insira no 'container'
  lista.forEach(produto => {
    const card = document.createElement("div");
    card.className = "card-produto";
    
    // TODO: Monte a estrutura HTML interna do card
    // Exemplo: <h3>${produto.nome}</h3> ...
    card.innerHTML = `
      <!-- TODO: Insira as informações do produto aqui -->
         <h3>${produto.nome}</h3>
         <p>Categoria: ${produto.categoria}</p>
         <p>Preço: R$ ${produto.preco.toFixed(2)}</p>
      `;

    container.appendChild(card);
  });
}

function filtrarProdutos() {
  const texto = document.getElementById("filtroTexto").value.toLowerCase();
  const categoria = document.getElementById("filtroCategoria").value;

  // TODO: Complete a lógica de filtragem usando o método .filter() no array 'produtos'
  const produtosFiltrados = produtos.filter(produto => {
    // 1. Condição do nome (se o nome do produto contém o texto digitado)
    const bateuNome = produto.nome.toLowerCase().includes(texto);
    
    // 2. Condição da categoria (se 'categoria' for "todas" OU igual à categoria do produto)
    const bateuCategoria = categoria === "todas" || produto.categoria === categoria;

    // Retorna verdadeiro se ambas as condições forem atendidas
    return bateuNome && bateuCategoria;
  });

  // Renderiza apenas os produtos filtrados
  renderizar(produtosFiltrados);
}

// Renderização inicial com todos os produtos
renderizar(produtos);