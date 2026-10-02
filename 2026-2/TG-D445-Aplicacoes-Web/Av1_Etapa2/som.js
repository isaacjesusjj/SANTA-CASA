// ============================================================
// som.js - Bônus 2: efeito sonoro da urna ao confirmar o voto
// Toca o arquivo audio/confirma-urna.mp3
// ============================================================

const ARQUIVO_SOM_CONFIRMA = "audio/confirma-urna.mp3";

let somLigado = true;

// O áudio é criado já no carregamento da página para o navegador
// baixar o arquivo antes do primeiro voto (o som sai sem atraso).
const audioConfirma = new Audio(ARQUIVO_SOM_CONFIRMA);
audioConfirma.preload = "auto";

// Toca o som de confirmação (chamado a cada vez que o voto é confirmado)
function tocarSomConfirma() {
    if (!somLigado) {
        return;
    }

    // Se o som anterior ainda estiver tocando, recomeça do início
    audioConfirma.currentTime = 0;

    const promessa = audioConfirma.play();
    if (promessa !== undefined) {
        // O navegador pode bloquear o som; nesse caso a votação continua normalmente
        promessa.catch(function (erro) {
            console.warn("Não foi possível tocar o som da urna:", erro.message);
        });
    }
}

// Liga ou desliga o som; devolve o novo estado
function alternarSom() {
    somLigado = !somLigado;
    if (!somLigado) {
        audioConfirma.pause();
        audioConfirma.currentTime = 0;
    }
    return somLigado;
}
