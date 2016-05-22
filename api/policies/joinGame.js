'use strict';

/**
 * joinGame
 *
 * @module      :: Policy
 * @description :: Simple policy to validate body parameters for POST /join
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = (req, res, next) => {
  if (!req.body.user) {
    return res.badRequest({
      messsage: 'Missing parameter',
      property: 'user'
    });
  }

  if (!req.body.invite_key) {
    return res.badRequest({
      messsage: 'Missing parameter',
      property: 'invite_key'
    });
  }

  let game = Token.decode(req.body.invite_key);
  GameMultiplayer
    .findOneById(game)
    .then(game => {
      if (!game) {
        return res.notFound({ message: 'Not Found' });
      }

      if (game.guest) {
        res.status(423);
        return res.json({ message: 'Maximum number of players reached' });
      }

      next();
    })
    .catch(next);
};
