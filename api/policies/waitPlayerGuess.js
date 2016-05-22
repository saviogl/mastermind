'use strict';
/**
 * waitPlayerGuess
 *
 * @module      :: Policy
 * @description :: Simple policy to check if the multiplayer game has even number of guesses
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */

module.exports = (req, res, next) => {
  let token = req.context.token,
    game = req.context.token.game;
  if (!token.multiplayer) {
    return next();
  }

  if (token.user === game.user) {
    if (game.user_guesses_attempts > game.guest_guesses_attempts) {
      return res.ok({
        message: 'You guess was not registerd beacause the other player has not taken his/her guess yet',
      });
    }
  } else {
    if (game.user_guesses_attempts < game.guest_guesses_attempts) {
      return res.ok({
        message: 'You guess was not registerd beacause the other player has not taken his/her guess yet',
      });
    }
  }

  next();
};
