class Player {
  static get VERSION() {
    return '0.1';
  }

  static betRequest(gameState, bet) {
    bet(Math.max(gameState.current_buy_in, gameState.small_blind * 2));
  }

  static showdown(gameState) {
  }
}

module.exports = Player;
