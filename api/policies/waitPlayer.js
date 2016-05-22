'use strict';
/**
 * waitPlayer
 *
 * @module      :: Policy
 * @description :: Simple policy to check if the multiplayer game has started
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */

module.exports = (req, res, next) => {
  let token = req.context.token, game = req.context.token.game;
  if (!token.multiplayer) {
    return next();
  }

  if (game.started) {
    return next();
  }

  res.ok({
    message: 'You have to wait for another player to join the game before you are allowed to take guesses',
  });
};
