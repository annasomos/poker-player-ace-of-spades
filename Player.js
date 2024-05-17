class Player {
  static get VERSION() {
    return "0.1";
  }

  static async betRequest(gameState, bet) {
    const cards = getCardsInGame(gameState);
    let handRank;
    try {
      handRank.rank = await getHandRank(cards);
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

    if (handRank.rank > 3) {
      bet(3000);
    }

    if (cards.length == 2) {
      if (handRank.rank > 0) {
        bet(Math.max(gameState.current_buy_in, gameState.small_blind * 2)); // Example decision
        return;
      }
    }

    if (cards.length == 5) {
      if (handRank.rank > 1) {
        bet(Math.max(gameState.current_buy_in, gameState.small_blind * 2) * 2);
        return;
      }
      bet(Math.max(gameState.current_buy_in, gameState.small_blind * 2)); // Example decision
      return;
    }

    if (cards.length == 6) {
      if (handRank.rank > 2) {
        bet(Math.max(gameState.current_buy_in, gameState.small_blind * 2) * 3);
        return;
      }
      if (handRank.rank > 1) {
        bet(Math.max(gameState.current_buy_in, gameState.small_blind * 2) * 2);
        return;
      }
      if (handRank.rank > 0) {
        bet(Math.max(gameState.current_buy_in, gameState.small_blind * 2)); // Example decision
        return;
      }
      bet(0);
      return;
    }

    if (cards.length == 7) {
      if (handRank.rank > 2) {
        bet(Math.max(gameState.current_buy_in, gameState.small_blind * 2) * 3);
        return;
      }
      if (handRank.rank > 1) {
        bet(Math.max(gameState.current_buy_in, gameState.small_blind * 2) * 2);
        return;
      }
      if (handRank.rank > 0) {
        bet(Math.max(gameState.current_buy_in, gameState.small_blind * 2)); // Example decision
        return;
      }
      bet(0);
      return;
    }

    bet(Math.max(gameState.current_buy_in, gameState.small_blind * 2));
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
    return data;
  } catch (error) {
    console.error("Error fetching ranking:", error);
    throw error;
  }
}

module.exports = Player;
