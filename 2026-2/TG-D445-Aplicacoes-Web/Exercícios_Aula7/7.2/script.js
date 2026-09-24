function verificarAcesso() {
  const input = document.getElementById("inputEntrada");
  const resultado = document.getElementById("resultado");
  
  // Obter o valor digitado e converter para Número
  const idade = Number(input.value);

  // TODO: Complete a função usando estruturas condicionais
  // Regra: Se idade for maior ou igual a 18:
  //   - Atualize 'resultado.textContent' para "Acesso Permitido!"
  //   - Adicione a classe "permitido" e remova "negado" do elemento resultado
  // Senão:
  //   - Atualize 'resultado.textContent' para "Acesso Negado: Apenas para maiores de 18 anos."
  //   - Adicione a classe "negado" e remova "permitido" do elemento resultado

  if (idade >= 18) {
    // TODO: Escreva o código para acesso permitido
    resultado.textContent = "Acesso Permitido!";
    resultado.classList.add("permitido");
    resultado.classList.remove("negado");
  } else {
    // TODO: Escreva o código para acesso negado
    resultado.textContent = "Acesso Negado: Apenas para maiores de 18 anos.";
    resultado.classList.add("negado");
    resultado.classList.remove("permitido");
  }
}