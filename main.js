const suits = ['<span class=\'bold\'>&#9824</span>', '<span class=\'bold\'>&#9827</span>', '<span class=\'bold red-card\'>&#9829</span>', '<span class=\'bold red-card\'>&#9830</span>'];
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'V', 'D', 'R'];

let deck; let playerHand = []; let dealerHand = [];
let wins = 0; let losses = 0; let draws = 0;
let playerBank = 100; let betValue = 0;

function askPlayerBet() {
    document.getElementsByClassName("player-bet")[0].classList.remove("hidden");
    document.getElementsByClassName("new-game-button")[0].classList.add("hidden");
    document.getElementsByClassName("game-status")[0].innerHTML = "Une nouvelle partie commence! Le joueur annonce son pari!";
    document.getElementsByClassName("confirm-bet-button")[0].addEventListener("click", newGame);
}

function newGame() {
    deck = shuffleDeck();
    playerHand = []; let dealerHand = [];
    betValue = parseInt(document.querySelector('input[id="player-bet"]').value);
    playerBank -= betValue;
    
    playerHand.push(deck.pop()); playerHand.push(deck.pop());
    dealerHand.push(deck.pop()); 

    let playerHandValue = calculateHandValue(playerHand);
    let dealerHandValue = calculateHandValue(dealerHand);

    document.getElementsByClassName("player-bet")[0].classList.add("hidden");
    document.getElementsByClassName("game-status")[0].innerHTML = `Le pari du joueur est de ${betValue}!`;
    document.querySelector('.player-bank p').innerHTML = `Banque du joueur: ${playerBank} | Montant du pari: ${betValue}`;
    
    document.querySelector(".player h3").innerHTML = `Main du joueur (${playerHandValue})`;
    document.querySelector(".dealer h3").innerHTML = `Main du dealer (${dealerHandValue})`;

    drawCards(playerHand, 'player'); drawCards(dealerHand, 'dealer');

    let playerCards = convertValuesInNumber(playerHand);
    let dealerCards = convertValuesInNumber(dealerHand);

    if (playerCards[0] + playerCards[1] == playerCards[0] * 2) {
        document.getElementsByClassName("split-button")[0].classList.remove("hidden");
    }
    
      if (dealerCards[0] == 1) {
        document.getElementsByClassName("assurance-button")[0].classList.remove("hidden");
    }
    
      if (playerHandValue == 21) { return startDealerTurn(); }
    
      document.getElementsByClassName("game-button")[0].classList.remove("hidden");
}
    
function createDeck() {
      deck = [];
    
      for (let suit in suits) {
        for (let value in values) {
          deck.push(`${values[value]} ${suits[suit]}`);
        }
      }
    
      return deck;


}

function createDeck() {
    deck = [];

    for (let suit in suits) {
        for (let value in values) {
            deck.push(`${values[value]} ${suits[suit]}`);
        }
    }    

    return deck;
}


function shuffleDeck() {
    deck = createDeck();
    let m = deck.length, i;
    
    while(m) {
        i = Math.floor(Math.random() * m--);
        [deck[m], deck[i]] = [deck[i], deck[m]];
    }

    return deck;
}

function convertValuesInNumber(values) {
    let hand = [];

    for(card in values) {
        let cardValue = values[card].split(" ")[0];

        switch(cardValue) {
            case 'A':
               hand.push(1); break;
            case '2':
               hand.push(2); break;
            case '3':
               hand.push(3); break;
            case '4':
               hand.push(4); break;
            case '5':
               hand.push(5); break;
            case '6':
               hand.push(6); break;
            case '7':
               hand.push(7); break;
            case '8':
               hand.push(8); break;
            case '9':
               hand.push(9); break;
            case '10':
            case 'V':
            case 'D':
            case 'R':
               hand.push(10); break;
            default: console.log("Erreur!")
        }
    }

    return hand;
}

function calculateHandValue(hand) {
    let handValue = 0;
    let cards = convertValuesInNumber(hand);
    // [1, 10]

    for (value in cards) {
        if (cards[value] == 1 )  {
            handValue += 11;
            continue;
        }

        handValue += cards[value];
    }
    
    return handValue;
    
}


function drawCards(hand, selector) {
    let drawCard = "";
    drawCard += '<div class="wrapper">';

    for(card in hand) {
        drawCard += '<div class="card">';
        drawCard += `<span class="card-value">${hand[card].split(" ")[0]}</span>`
        drawCard += `<span class="card-suit">${hand[card].slice(2)}</span>`
        drawCard += '</div>';
    }

    drawCard += '</div';
    document.querySelector(`.${selector} p`).innerHTML = drawCard;
}

function triggerCarteButton() {
    playerHand.push(deck.pop());
  drawCards(playerHand, 'player');
  let playerHandValue = calculateHandValue(playerHand);
  document.querySelector(".player h3").innerHTML = `Main du joueur (${playerHandValue})`;
  if (playerHandValue > 21) return startDealerTurn();
}

function triggerServiButton() { startDealerTurn(); }

function startDealerTurn() {
    let playerHandValue = calculateHandValue(playerHand);
    let dealerHandValue = calculateHandValue(dealerHand);

    while (dealerHandValue < 17) {
      dealerHand.push(deck.pop());
      drawCards(dealerHand, 'dealer');
      dealerHandValue = calculateHandValue(dealerHand);
      document.querySelector(".dealer h3").innerHTML = `Main du dealer (${dealerHandValue})`;
    }

  if (playerHandValue > 21 || (dealerHandValue > playerHandValue && dealerHandValue < 22)) {
    losses += 1;
    document.getElementsByClassName("game-status")[0].innerHTML = "Le joueur a perdu!";
    updateStatTracker();
    updatePlayerBank(betValue, "loses");
  } else if (dealerHandValue > 21 && playerHandValue > 21 || dealerHandValue == playerHandValue) {
    if (playerHand.length == 2) {
      wins += 1;
      document.getElementsByClassName("game-status")[0].innerHTML = "Blackjack! Le joueur a gagné!";
      updateStatTracker();
      return updatePlayerBank(betValue, "blackjack");
    }
    draws += 1;
    document.getElementsByClassName("game-status")[0].innerHTML = "Le joueur et le dealer sont à égalité!";
    updateStatTracker();
    updatePlayerBank(betValue, "draws");
  } else {
    wins += 1;
    document.getElementsByClassName("game-status")[0].innerHTML = "Le joueur a gagné!";
    updateStatTracker();
    if (playerHand.length == 2) {
      document.getElementsByClassName("game-status")[0].innerHTML = "Blackjack! Le joueur a gagné!";
      return updatePlayerBank(betValue, "blackjack");
    }
    updatePlayerBank(betValue, "wins");
  }
}

function updateStatTracker(){
  document.getElementsByClassName("new-game-button")[0].classList.remove("hidden");
  document.getElementsByClassName("stat-tracker")[0].innerHTML = `G: ${wins} | E: ${draws} | P: ${losses}`;
  document.getElementsByClassName("game-button")[0].classList.add("hidden");
}


document.getElementsByClassName("new-game-button")[0].addEventListener("click", newGame);
document.getElementsByClassName("carte-button")[0].addEventListener("click", triggerCarteButton);
// document.getElementsByClassName("split-button")[0].addEventListener("click", triggerSplitButton);
// document.getElementsByClassName("assurance-button")[0].addEventListener("click", triggerAssuranceButton);
// document.getElementsByClassName("double-button")[0].addEventListener("click", triggerDoubleButton);
document.getElementsByClassName("servi-button")[0].addEventListener("click", triggerServiButton);

