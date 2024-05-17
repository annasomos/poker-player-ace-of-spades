class Player {
  static get VERSION() {
    return "0.1";
  }

  static async betRequest(gameState, bet) {
    const cards = getCardsInGame(gameState);
    let handRank = 0;
    if (cards.length == 2) {
      let amount = Math.max(gameState.small_blind * 2, gameState.current_buy_in - gameState.players[gameState.in_action].bet)
      console.log("BET (TWO CARDS): ", amount)
      bet(amount);
      return;
    }
    try {
      handRank = await getHandRank(cards);
      console.log(
        "HAND RANK: ",
        handRank,
        "ROUND: ",
        gameState.round,
        "CARDS LENGTH: ",
        cards.length
      );
    } catch (error) {
      console.error("Error getting hand rank: ", error);
      bet(gameState.current_buy_in); // Fallback bet
      return;
    }


    if (cards.length >= 5) {
      if (handRank > 1) {
        let amount = Math.max(gameState.small_blind * 2, gameState.current_buy_in - gameState.players[gameState.in_action].bet)
        console.log("BET (TWO CARDS): ", amount)
        bet(amount * 2); // DOUBLEING
        return;
      }
      let amount = Math.max(gameState.small_blind * 2, gameState.current_buy_in - gameState.players[gameState.in_action].bet)
      console.log("BET (TWO CARDS): ", amount)
      bet(amount);
      return;
    }

    let amount = Math.max(gameState.small_blind * 2, gameState.current_buy_in - gameState.players[gameState.in_action].bet)
    console.log("BET (TWO CARDS): ", amount)
    bet(amount);
  }

  static showdown(gameState) {
    console.log("SHOWDOWN", gameState);
  }
}

function findOurselves(gameState) {
  return gameState.players.find((player) => player.hole_cards);
}

function getCardsInGame(gameState) {
  const player = findOurselves(gameState);
  return player.hole_cards.concat(gameState.community_cards);
}

async function getHandRank(cards) {
  const cardsJson = JSON.stringify(cards);
  const encodedCards = encodeURIComponent(cardsJson);
  const url = `https://rainman.leanpoker.org/rank?cards=${encodedCards}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.rank;
  } catch (error) {
    console.error("Error fetching ranking:", error);
    return 0;
  }
}

module.exports = Player;
