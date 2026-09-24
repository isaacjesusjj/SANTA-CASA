function atualizarPerfil() {
  // 1. Declare três variáveis com suas informações (nome, idade e biografia)
  const nome = "Isaac"
  const idade = 19
  const bio = "Sou estudante de ADS e trabalho com E-commerce."

  // 2. Atualize os elementos do HTML utilizando o DOM
  document.getElementById("nome").textContent = nome
  document.getElementById("idade").textContent = "Idade: " + idade
  document.getElementById("biografia").textContent = bio
}