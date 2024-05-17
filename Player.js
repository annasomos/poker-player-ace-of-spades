class Player {
  static get VERSION() {
    return "0.1";
  }

  static betRequest(gameState, bet) {
    const cards = getCardsInGame(gameState);
    console.log("CARDS", cards.player.cards);

    if (cards.length >= 6) {
      bet(Math.max(gameState.current_buy_in, gameState.small_blind * 2));
      const handRank = getHandRank(cards);
      console.log("HAND RANK: ", handRank.rank);
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
  return findOurselves(gameState).hole_cards + gameState.community_cards;
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
  }
}

module.exports = Player;
