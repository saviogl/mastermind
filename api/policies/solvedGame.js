'use strict';
/**
 * solvedGame
 *
 * @module      :: Policy
 * @description :: Simple policy to check if the game has been solved already
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */

module.exports = (req, res, next) => {
  let game = req.context.token.game;

  if (!game.solved) {
    return next();
  }

  res.status(423);
  res.json({
    message: 'This game has been solved already! Create another one via POST /game',
    result: game
  });
};
