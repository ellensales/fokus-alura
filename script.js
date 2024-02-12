const html = document.querySelector('html')
const focoBt = document.querySelector('.app__card-button--foco')
const curtoBt = document.querySelector('.app__card-button--curto')
const longoBt = document.querySelector('.app__card-button--longo')
const banner = document.querySelector('.app__image')
const titulo = document.querySelector('.app__title')
const botoes = document.querySelectorAll('.app__card-button')
const iniciarOuPausarBt = document.querySelector('#start-pause span')
const iniciarOuPausarBtIcone = document.querySelector('.app__card-primary-butto-icon')
const tempoNaTela = document.querySelector('#timer')
const startPauseBt = document.querySelector('#start-pause')
const musicaFocoInput = document.querySelector('#alternar-musica')
const musica = new Audio ('./sons/luna-rise-part-one.mp3')
const musicaPause = new Audio ('./sons/pause.mp3')
const musicaPlay = new Audio ('./sons/play.wav')
const musicaFim = new Audio ('./sons/beep.mp3')

const tempoFoco = 1500
const tempoCurto = 300
const tempoLongo = 900

let tempoDecorridoEmSegundos = tempoFoco
let intervaloId = null

musica.loop = true;
musicaFocoInput.addEventListener('change', () => {
    if(musica.paused) {
        musica.play()
    } else{
        musica.pause()
    }
})

focoBt.addEventListener('click', () => { 
    tempoDecorridoEmSegundos = tempoFoco;
    alterarContexto('foco')
    focoBt.classList.add('active')
})

curtoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = tempoCurto;
    alterarContexto('descanso-curto')
    curtoBt.classList.add('active')
})

longoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = tempoLongo;
    alterarContexto('descanso-longo')
    longoBt.classList.add('active')
})

function alterarContexto(contexto){
    mostrarTempo()
    botoes.forEach(function(contexto){ contexto.classList.remove('active')})
    html.setAttribute('data-contexto', contexto)
    banner.setAttribute('src', `/imagens/${contexto}.png`)
    switch(contexto){
        case 'foco':
            titulo.innerHTML = `Otimize sua produtividade,<br>
            <strong class="app__title-strong">mergulhe no que importa.</strong>`
        break;
        case 'descanso-curto':
            titulo.innerHTML =  `Que tal dar uma respirada?,<br>
            <strong class="app__title-strong">faça uma pausa curta.</strong>`
        break;
        case 'descanso-longo':
            titulo.innerHTML = `Hora de voltar à superfície,<br>
            <strong class="app__title-strong">faça uma pausa longa</strong>`
        break;
        default:
            break;
    }
}

const contagemRegressiva = () => {
    if( tempoDecorridoEmSegundos <= 0){
        musicaFim.play()
        alert('Tempo finalizado!')
        const focoAtivo = html.getAttribute('data-contexto') == 'foco'
        if (focoAtivo){
            const evento = new CustomEvent('FocoFinalizado')
            document.dispatchEvent(evento)
        }
        zerar()
        tempoContexto()
        return
    }
    tempoDecorridoEmSegundos -= 1;
    mostrarTempo()
}

startPauseBt.addEventListener('click', iniciarOuPausar)

function iniciarOuPausar(){
    if ( intervaloId ){
        musicaPause.play()
        zerar()
        return
    }
    musicaPlay.play()
    intervaloId = setInterval(contagemRegressiva, 1000) // 1s = 1000ms
    iniciarOuPausarBt.textContent = 'Pausar'
}

function zerar(){
    clearInterval(intervaloId)
    iniciarOuPausarBt.textContent='Começar'
    intervaloId = null
}

function mostrarTempo(){
    const tempo = new Date(tempoDecorridoEmSegundos * 1000);
    const tempoFormatado = tempo.toLocaleTimeString('pt-br', {minute: '2-digit', second: '2-digit'})
    tempoNaTela.innerHTML = `${tempoFormatado}`
}

function tempoContexto(){
    const qualContexto = html.getAttribute('data-contexto')
    switch (qualContexto){
        case 'foco':
            tempoDecorridoEmSegundos = tempoFoco;
            mostrarTempo()
            break;
        case 'short':
            tempoDecorridoEmSegundos = tempoCurto;
            mostrarTempo()
            break;
        case 'long':
            tempoDecorridoEmSegundos = tempoLongo;
            mostrarTempo()
            break;
        default:
            break;
    }
}

mostrarTempo()

