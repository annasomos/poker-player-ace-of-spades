class Player {
  static get VERSION() {
    return "0.1";
  }

  static async betRequest(gameState, bet) {
    const cards = getCardsInGame(gameState);

    if (cards.length >= 6) {
      try {
        const handRank = await getHandRank(cards);
        console.log("HAND RANK: ", handRank.rank);

        // Use the handRank to decide your bet
        // Example decision based on hand rank:
        // if (handRank.rank >= someThreshold) {
        //   bet(gameState.current_buy_in + someAmount);
        // } else {
        //   bet(gameState.current_buy_in);
        // }

        bet(Math.max(gameState.current_buy_in, gameState.small_blind * 2)); // Example decision
      } catch (error) {
        console.error("Error getting hand rank: ", error);
        bet(gameState.current_buy_in); // Fallback bet
      }
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
