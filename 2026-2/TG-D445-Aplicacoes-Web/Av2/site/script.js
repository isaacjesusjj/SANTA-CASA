// Guarda o card que foi clicado no momento
var cardAtualSelecionado = null;

// --- PARTE 1: CÁLCULO AUTOMÁTICO DE IDADE (ANOS E MESES) ---
var campoNascimento = document.getElementById('dataNascimento');
var campoIdadeAnos = document.getElementById('idadeAnos');
var campoIdadeMeses = document.getElementById('idadeMeses');

campoNascimento.addEventListener('change', function() {
  var valorData = campoNascimento.value;

  if (valorData === '') {
    campoIdadeAnos.value = '';
    campoIdadeMeses.value = '';
    marcarVacinasAtrasadas(null);
    return;
  }

  var partes = valorData.split('-');
  var anoNasc = parseInt(partes[0], 10);
  var mesNasc = parseInt(partes[1], 10);
  var diaNasc = parseInt(partes[2], 10);

  var hoje = new Date();
  var anoHoje = hoje.getFullYear();
  var mesHoje = hoje.getMonth() + 1;
  var diaHoje = hoje.getDate();

  var anos = anoHoje - anoNasc;
  var meses = mesHoje - mesNasc;

  if (diaHoje < diaNasc) {
    meses = meses - 1;
  }

  if (meses < 0) {
    anos = anos - 1;
    meses = meses + 12;
  }

  if (anos < 0) {
    alert('De geboortedatum mag niet later zijn dan vandaag!');
    campoNascimento.value = '';
    campoIdadeAnos.value = '';
    campoIdadeMeses.value = '';
    marcarVacinasAtrasadas(null);
    return;
  }

  campoIdadeAnos.value = anos + ' jaar';
  campoIdadeMeses.value = meses + (meses === 1 ? ' maand' : ' maanden');
  marcarVacinasAtrasadas(anos * 12 + meses);
});

// Converte o texto de idade de uma dose em meses. O texto sempre começa com
// "N maanden", "N jaar" ou "N tot M jaar" (1 jaar = 12 meses).
// Na faixa "N tot M jaar" vale o fim da faixa: M anos completos = M * 12 + 11 meses.
function idadeDoseEmMeses(idadeDose) {
  var partes = idadeDose.match(/^(\d+)(?: tot (\d+))? (maanden|jaar)/);
  if (partes === null) {
    return null;
  }

  if (partes[3] === 'maanden') {
    return parseInt(partes[1], 10);
  }
  if (partes[2] !== undefined) {
    return parseInt(partes[2], 10) * 12 + 11;
  }
  return parseInt(partes[1], 10) * 12;
}

// Marca com a classe "atrasada" os cards cuja idade da dose a criança já passou.
// Recebe a idade da criança em meses; com null, remove todas as marcações.
// A classe continua no card depois que a vacina é registrada: o CSS só pinta de
// vermelho os cards .atrasada:not(.tomada), então não é preciso recalcular aqui.
function marcarVacinasAtrasadas(idadeCriancaMeses) {
  var cards = document.querySelectorAll('.card-vacina');

  for (var i = 0; i < cards.length; i++) {
    var mesesDose = idadeDoseEmMeses(cards[i].dataset.idadeDose);

    if (idadeCriancaMeses !== null && mesesDose !== null && idadeCriancaMeses > mesesDose) {
      cards[i].classList.add('atrasada');
    } else {
      cards[i].classList.remove('atrasada');
    }
  }
}


// --- PARTE 2: FUNÇÕES DE VALIDAÇÃO DE BSN E CARTÃO SUS ---
function limparNumeros(texto) {
  var resultado = '';
  for (var i = 0; i < texto.length; i++) {
    var caractere = texto[i];
    if (caractere >= '0' && caractere <= '9') {
      resultado = resultado + caractere;
    }
  }
  return resultado;
}

// Regra do BSN (Burgerservicenummer, o documento de identificação da Holanda),
// conhecida como "elfproef" (prova dos onze):
// 1) o BSN tem exatamente 9 dígitos;
// 2) cada um dos 8 primeiros dígitos é multiplicado pelos pesos 9, 8, 7, 6, 5, 4, 3 e 2
//    e os resultados são somados;
// 3) o último dígito (o 9º) é subtraído dessa soma (peso -1);
// 4) o BSN é válido se a soma for maior que zero e divisível por 11
//    (a exigência "maior que zero" recusa 000000000).
// Exemplo: 123456782 -> 1*9 + 2*8 + 3*7 + 4*6 + 5*5 + 6*4 + 7*3 + 8*2 - 2 = 154 = 11 * 14 (válido).
function validarBSN(bsnTexto) {
  var bsn = limparNumeros(bsnTexto);

  if (bsn.length !== 9) {
    return false;
  }

  var soma = 0;
  for (var i = 0; i < 8; i++) {
    soma = soma + parseInt(bsn[i], 10) * (9 - i);
  }
  soma = soma - parseInt(bsn[8], 10);

  return soma > 0 && soma % 11 === 0;
}

function validarCartaoSUS(susTexto) {
  var cns = limparNumeros(susTexto);

  if (cns.length !== 15) {
    return false;
  }

  var primeiroDigito = cns[0];
  if (
    primeiroDigito !== '1' &&
    primeiroDigito !== '2' &&
    primeiroDigito !== '7' &&
    primeiroDigito !== '8' &&
    primeiroDigito !== '9'
  ) {
    return false;
  }

  var soma = 0;
  for (var i = 0; i < 15; i++) {
    soma = soma + parseInt(cns[i], 10) * (15 - i);
  }

  return soma % 11 === 0;
}


// --- PARTE 3: ENVIO E VALIDAÇÃO DO FORMULÁRIO DA CRIANÇA ---
var formulario = document.getElementById('form-crianca');

formulario.addEventListener('submit', function(evento) {
  evento.preventDefault();
  document.getElementById('mensagem-cadastro').textContent = '';

  var nome = document.getElementById('nomeCrianca').value;
  var nascimento = document.getElementById('dataNascimento').value;
  var cpf = document.getElementById('cpfCrianca').value;
  var sus = document.getElementById('numeroSus').value;
  var resp1 = document.getElementById('responsavel1').value;

  if (nome === '' || nascimento === '' || cpf === '' || sus === '' || resp1 === '') {
    alert('Vul alle verplichte velden met een * in!');
    return;
  }

  if (!validarBSN(cpf)) {
    alert('Het ingevoerde BSN is ongeldig! Controleer de cijfers en probeer het opnieuw.');
    return;
  }

  if (!validarCartaoSUS(sus)) {
    alert('Het SUS-kaartnummer (CNS) is ongeldig! Het moet uit 15 geldige cijfers bestaan.');
    return;
  }

  // Monta a carteirinha: dados da criança + todas as doses (todos os cards)
  var carteirinha = {
    crianca: {
      nome: nome,
      data_nascimento: nascimento,
      idade_anos: parseInt(campoIdadeAnos.value, 10),
      idade_meses: parseInt(campoIdadeMeses.value, 10),
      bsn: limparNumeros(cpf),
      numero_sus: limparNumeros(sus),
      responsavel_1: resp1,
      responsavel_2: document.getElementById('responsavel2').value
    },
    vacinas: []
  };

  var cards = document.querySelectorAll('.card-vacina');
  for (var i = 0; i < cards.length; i++) {
    var tomada = cards[i].classList.contains('tomada');
    var dose = {
      vacina: cards[i].dataset.nomeVacina,
      dose: parseInt(cards[i].dataset.numeroDose, 10),
      idade: cards[i].dataset.idadeDose,
      tomada: tomada,
      // a classe "atrasada" continua no card depois de tomada, por isso o "&& !tomada"
      atrasada: cards[i].classList.contains('atrasada') && !tomada
    };
    if (tomada) {
      dose.data_aplicacao = cards[i].dataset.dataAplicacao;
      dose.numero_lote = cards[i].dataset.numeroLote;
      dose.unidade_aplicadora = cards[i].dataset.unidadeAplicadora;
      dose.responsavel_aplicacao = cards[i].dataset.responsavelAplicacao;
    }
    carteirinha.vacinas.push(dose);
  }

  // Baixa a carteirinha como arquivo JSON local, usando um link <a download> temporário
  var nomeArquivo = 'vaccinatieboekje-' + nome.trim().replace(/\s+/g, '-') + '.json';
  var arquivo = new Blob([JSON.stringify(carteirinha, null, 2)], { type: 'application/json' });
  var link = document.createElement('a');
  link.href = URL.createObjectURL(arquivo);
  link.download = nomeArquivo;
  link.click();

  var mensagem = document.getElementById('mensagem-cadastro');
  mensagem.textContent = 'Het vaccinatieboekje van ' + nome + ' is opgeslagen in het bestand ' + nomeArquivo + '.';
});


// --- PARTE 4: CARREGAR O ARQUIVO JSON E CRIAR OS CARDS ---
fetch('vacinasSUS.json')
  .then(function(resposta) {
    return resposta.json();
  })
  .then(function(dados) {
    var listaVacinas = dados.calendario_vacinacao_infantil_sus;
    var containerCards = document.getElementById('lista-vacinas');

    for (var i = 0; i < listaVacinas.length; i++) {
      var vacinaAtual = listaVacinas[i];
      var dosesSeparadas = separarDoses(vacinaAtual.idade);

      for (var j = 0; j < dosesSeparadas.length; j++) {
        criarCardNaTela(
          containerCards,
          vacinaAtual.vacina,
          dosesSeparadas[j],
          vacinaAtual.para_que_serve,
          j + 1
        );
      }
    }
  })
  .catch(function(erro) {
    console.log('Erro ao carregar JSON:', erro);
    document.getElementById('lista-vacinas').innerHTML =
      '<p>Fout bij het laden van vacinasSUS.json. Open de pagina met Live Server.</p>';
  });

function separarDoses(texto) {
  if (texto.indexOf(';') !== -1) {
    return [texto];
  }
  var textoComVirgulas = texto.replace(' e ', ', ');
  return textoComVirgulas.split(', ');
}

function criarCardNaTela(container, nomeVacina, idadeDose, descricao, numeroDose) {
  var card = document.createElement('div');
  card.className = 'card-vacina';
  card.dataset.idadeDose = idadeDose;
  card.dataset.nomeVacina = nomeVacina;
  card.dataset.numeroDose = numeroDose;

  card.innerHTML =
    '<span class="etiqueta-dose">Dosis ' + numeroDose + '</span>' +
    '<h3>' + nomeVacina + '</h3>' +
    '<p><strong>Leeftijd:</strong> ' + idadeDose + '</p>' +
    '<p class="status-texto">Status: Nog niet toegediend</p>' +
    '<p class="aviso-atraso">⚠ Te laat</p>' +
    '<div class="detalhes-aplicacao-card escondido"></div>';

  card.addEventListener('click', function() {
    abrirJanela(card, nomeVacina, numeroDose, idadeDose, descricao);
  });

  container.appendChild(card);
}


// --- PARTE 5: CONTROLE DA JANELA (MODAL) E DADOS DA APLICAÇÃO ---
var janela = document.getElementById('janela-detalhes');
var checkTomada = document.getElementById('check-tomada');
var camposAplicacao = document.getElementById('campos-aplicacao');

var inputDataAplicacao = document.getElementById('dataAplicacao');
var inputNumeroLote = document.getElementById('numeroLote');
var inputUnidadeAplicadora = document.getElementById('unidadeAplicadora');
var inputResponsavelAplicacao = document.getElementById('responsavelAplicacao');

var btnConfirmar = document.getElementById('btn-confirmar');
var btnFechar = document.getElementById('btn-fechar');

// Mostra ou esconde os 4 campos extras quando o checkbox muda
checkTomada.addEventListener('change', function() {
  if (checkTomada.checked === true) {
    camposAplicacao.classList.remove('escondido');
  } else {
    camposAplicacao.classList.add('escondido');
  }
});

// Função simples para converter YYYY-MM-DD em DD-MM-YYYY
function formatarDataBrasil(dataISO) {
  if (dataISO === '') return '';
  var partes = dataISO.split('-');
  return partes[2] + '-' + partes[1] + '-' + partes[0];
}

function abrirJanela(cardClicado, nome, numDose, idade, descricao) {
  cardAtualSelecionado = cardClicado;

  document.getElementById('janela-titulo').textContent = nome;
  document.getElementById('janela-dose').textContent = 'Dosis ' + numDose;
  document.getElementById('janela-idade').textContent = idade;
  document.getElementById('janela-descricao').textContent = descricao;

  // Verifica se o card já estava marcado como tomado
  if (cardClicado.classList.contains('tomada')) {
    checkTomada.checked = true;
    camposAplicacao.classList.remove('escondido');

    // Recupera os valores salvos anteriormente no próprio card
    inputDataAplicacao.value = cardClicado.dataset.dataAplicacao || '';
    inputNumeroLote.value = cardClicado.dataset.numeroLote || '';
    inputUnidadeAplicadora.value = cardClicado.dataset.unidadeAplicadora || '';
    inputResponsavelAplicacao.value = cardClicado.dataset.responsavelAplicacao || '';
  } else {
    checkTomada.checked = false;
    camposAplicacao.classList.add('escondido');

    // Limpa os campos para um novo preenchimento
    inputDataAplicacao.value = '';
    inputNumeroLote.value = '';
    inputUnidadeAplicadora.value = '';
    inputResponsavelAplicacao.value = '';
  }

  janela.classList.remove('escondido');
}

btnConfirmar.addEventListener('click', function() {
  if (cardAtualSelecionado !== null) {
    var textoStatus = cardAtualSelecionado.querySelector('.status-texto');
    var caixaDetalhesCard = cardAtualSelecionado.querySelector('.detalhes-aplicacao-card');

    if (checkTomada.checked === true) {
      var dataApl = inputDataAplicacao.value;
      var lote = inputNumeroLote.value;
      var unidade = inputUnidadeAplicadora.value;
      var responsavel = inputResponsavelAplicacao.value;

      // Valida se os campos da aplicação foram preenchidos (lote sem verificação de formato)
      if (dataApl === '' || lote === '' || unidade === '' || responsavel === '') {
        alert('Vul de datum van toediening, het batchnummer, de vaccinatielocatie en de naam van de toediener in!');
        return;
      }

      // Salva os dados no próprio elemento HTML do card usando dataset
      cardAtualSelecionado.dataset.dataAplicacao = dataApl;
      cardAtualSelecionado.dataset.numeroLote = lote;
      cardAtualSelecionado.dataset.unidadeAplicadora = unidade;
      cardAtualSelecionado.dataset.responsavelAplicacao = responsavel;

      cardAtualSelecionado.classList.add('tomada');
      textoStatus.textContent = 'Status: Toegediend ✓';

      // Mostra o resumo da aplicação dentro do card
      caixaDetalhesCard.innerHTML =
        '<strong>Datum:</strong> ' + formatarDataBrasil(dataApl) + '<br>' +
        '<strong>Batchnummer:</strong> ' + lote + '<br>' +
        '<strong>Locatie:</strong> ' + unidade + '<br>' +
        '<strong>Toegediend door:</strong> ' + responsavel;
      caixaDetalhesCard.classList.remove('escondido');

    } else {
      // Se desmarcou a opção, volta o card para Pendente e limpa os dados
      cardAtualSelecionado.classList.remove('tomada');
      textoStatus.textContent = 'Status: Nog niet toegediend';
      caixaDetalhesCard.innerHTML = '';
      caixaDetalhesCard.classList.add('escondido');

      delete cardAtualSelecionado.dataset.dataAplicacao;
      delete cardAtualSelecionado.dataset.numeroLote;
      delete cardAtualSelecionado.dataset.unidadeAplicadora;
      delete cardAtualSelecionado.dataset.responsavelAplicacao;
    }
  }

  janela.classList.add('escondido');
});

btnFechar.addEventListener('click', function() {
  janela.classList.add('escondido');
});