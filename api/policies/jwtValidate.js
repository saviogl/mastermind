'use strict';

/**
 * jwtValidate
 *
 * @module      :: Policy
 * @description :: Simple policy to validate jwt token
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = (req, res, next) => {
  let token = req.body.game_key || req.body.invite_key;

  try {
    Token.decode(token);
  } catch (e) {
    return res.badRequest({ message: 'InvalidToken' });
  }

  next();
};
