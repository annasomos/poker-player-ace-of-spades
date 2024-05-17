class Player {
  static get VERSION() {
    return '0.1';
  }

  static betRequest(gameState, bet) {
    bet(gameState.small_blind * 2);
  }

  static showdown(gameState) {
  }
}

module.exports = Player;
