/**
 * createGame
 *
 * @module      :: Policy
 * @description :: Simple policy to validate body parameters for POST /game
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = (req, res, next) => {
  if (!req.body.user) {
    return res.badRequest({
      message: 'Missing parameter',
      property: 'user'
    });
  }

  next();
};
