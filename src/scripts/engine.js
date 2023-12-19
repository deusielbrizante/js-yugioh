//definição das variáveis de visualização e de funcionamento do jogo 
const state = {
    //variáveis do placar
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score-points")
    },

    //variáveis das cartas do lado direito
    cardsSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type")
    },

    //variáveis das cartas do lado esquerdo
    fieldCards: {
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card")
    },

    //variáveis das cartas selecionadas e seus respectivos espaços
    playerSides: {
        player1: "player-cards",
        player1Box: document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBox: document.querySelector("#computer-cards")
    },

    //variáveis de ações
    actions: {
        button: document.getElementById("next-duel")
    }
}

//variável do caminho das imagens
const pathImages = "./src/assets/icons/"

//definição das 3 cartas e seus atributos
const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${pathImages}dragon.png`,
        winOf: [1],
        loseOf: [2]
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: `${pathImages}magician.png`,
        winOf: [2],
        loseOf: [0]
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissors",
        img: `${pathImages}exodia.png`,
        winOf: [0],
        loseOf: [1]
    }
]

//função que escolhe uma carta aleatoriamente e retorna o id da carta escolhida
async function getRandomCardsId() {
    const ramdomIndex = Math.floor(Math.random() * cardData.length)
    return cardData[ramdomIndex].id
}

//função que cria a imagem da carta na tela e define seus atributos
async function createCardImage(idCard, fieldSide) {
    const cardImage = document.createElement("img")
    cardImage.setAttribute("height", "100px")
    cardImage.setAttribute("src", `${pathImages}card-back.png`)
    cardImage.setAttribute("data-id", idCard)
    cardImage.classList.add("card")

    //verifica se as cartas criadas são do jogador para passar os eventos de click e de passar o mouse por cima
    if (fieldSide === state.playerSides.player1) {
        cardImage.addEventListener("click", () => setCardFields(cardImage.getAttribute("data-id")))
        cardImage.addEventListener("mouseover", () => drawnSelectCard(idCard))
    }

    //retorna o card criado
    return cardImage
}

//função para as funcionalidades gerais do jogo
async function setCardFields(cardId) {
    //remoção de todas as cartas da cena
    await removeAllCardsImages()

    //gera uma carta para o computador
    let computerId = await getRandomCardsId()

    //ativação das cartas do centro após escolha
    showHiddenCardFieldsImages(true)

    //redefine a imagem e os textos do lado esquerdo
    hiddenCardDetails()

    //atualiza a carta a ser mostrada do lado direito após ter o mouse passado por cima
    drawCardsInField(cardId, computerId)

    //resultado do duelo
    let duelResults = await checkDuelResults(cardId, computerId)

    //atualização do score e do texto do botão
    await updateScore()
    await drawButton(duelResults)
}

//função que mostra as cartas do lado direito quando selecionadas
async function drawCardsInField(cardId, computerId) {
    state.fieldCards.player.src = cardData[cardId].img
    state.fieldCards.computer.src = cardData[computerId].img
}

//função que ativa ou desativa o espaço das cartas do centro
async function showHiddenCardFieldsImages(value) {
    if (value) {
        state.fieldCards.player.style.display = "block"
        state.fieldCards.computer.style.display = "block"
    } else {
        state.fieldCards.player.style.display = "none"
        state.fieldCards.computer.style.display = "none"
    }
}

//função que reinicia o lado esquerdo que mostra as informações da carta quando é selecionado uma carta
async function hiddenCardDetails() {
    state.cardsSprites.avatar.src = ""
    state.cardsSprites.name.innerText = "Selecione"
    state.cardsSprites.type.innerText = "uma Carta"
}

//função que ativa o botão e atualiza o texto exibido nele
async function drawButton(duelResult) {
    state.actions.button.innerText = duelResult.toUpperCase()
    state.actions.button.style.display = "block"
}

//função que atualiza o score
async function updateScore() {
    state.score.scoreBox.innerHTML = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`
}

//função que verifica se foi um empate, vitória ou derrota para o jogador
async function checkDuelResults(playerCardId, computerCardId) {
    //definição de empate caso não seja alguma das opções abaixo
    let duelResults = "draw"
    let playerCard = cardData[playerCardId]

    //verifica se o id da carta do computador está incluída como vitória ou derrota na carta do jogador e adiciona ao score
    if (playerCard.winOf.includes(computerCardId)) {
        duelResults = "win"
        state.score.playerScore++
    } else if (playerCard.loseOf.includes(computerCardId)) {
        duelResults = "lose"
        state.score.computerScore++
    }

    //ativa o áudio e retorna o resultado
    await playAudio(duelResults)
    return duelResults
}

//função que remove todas as cartas da tela
async function removeAllCardsImages() {
    let { computerBox, player1Box } = state.playerSides

    let imgElements = computerBox.querySelectorAll("img")
    imgElements.forEach((img) => img.remove())

    imgElements = player1Box.querySelectorAll("img")
    imgElements.forEach((img) => img.remove())
}

//função que atualiza o que é mostrado na esquerda quando o mouse é passado por cima de uma carta
async function drawnSelectCard(id) {
    state.cardsSprites.avatar.src = cardData[id].img
    state.cardsSprites.name.innerHTML = cardData[id].name
    state.cardsSprites.type.innerText = `Attribute: ${cardData[id].type}`
}

//função para gerar 5 cartas aleatórias para o jogador e o computador
async function drawnCards(cardNumbers, fieldSide) {
    for (let i = 0; i < cardNumbers; i++) {
        const ramdomIdCard = await getRandomCardsId()
        const cardImage = await createCardImage(ramdomIdCard, fieldSide)

        document.getElementById(fieldSide).appendChild(cardImage)
    }
}

//função que reinicia o jogo para o seu status inicial
async function resetDuel() {
    state.cardsSprites.avatar.src = ""
    state.actions.button.style.display = "none"

    state.fieldCards.player.style.display = "none"
    state.fieldCards.computer.style.display = "none"

    main()
}

//função que ativa o áudio de vencedor ou perdedor caso não seja empate
async function playAudio(status) {
    try {
        const audio = new Audio(`./src/assets/audios/${status}.wav`)
        audio.volume = 0.2
        audio.play()
    } catch { }
}

//função principal onde tudo é rodado
function main() {

    //desativa as cartas do centro
    showHiddenCardFieldsImages(false)

    //escolhe 5 cartas para o jogador e o computador
    drawnCards(5, state.playerSides.player1)
    drawnCards(5, state.playerSides.computer)

    //ativação da música de fundo
    const bgm = document.getElementById("bgm")
    bgm.volume = 0.2
    bgm.play()
}

main()