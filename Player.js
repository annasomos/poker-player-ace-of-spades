class Player {
  static get VERSION() {
    return '0.1';
  }

  static betRequest(gameState, bet) {
    const cards = getCardsInGame(gameState);
    console.log('CARDS', cards);

    if (cards.length >= 6) {
      bet(Math.max(gameState.current_buy_in, gameState.small_blind * 2));
      return;
    }


    bet(Math.max(gameState.current_buy_in, gameState.small_blind * 2));


  }

  static showdown(gameState) {
    console.log('SHOWDOWN', gameState);
  }
}

function findOurselves(gameState) {
  return gameState.players.find(player => player.hole_cards);
}

function getCardsInGame(gameState) {
  return findOurselves(gameState).hole_cards + gameState.community_cards;
}

module.exports = Player;
