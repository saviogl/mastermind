'use strict';

/**
 * guessAttempt
 *
 * @module      :: Policy
 * @description :: Simple policy to validate body parameters for POST /guess
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = (req, res, next) => {
  if (!req.body.code) {
    return res.badRequest({
      message: 'Missing parameter',
      property: 'code'
    });
  }

  if (req.body.code.length !== sails.config.mastermind.positions) {
    return res.badRequest({
      message: `Invalid number of characters. There are ${sails.config.mastermind.positions} positions to guess in this game`,
      property: 'code',
      value: req.body.code
    });
  }

  let code = req.body.code.split(''), len = code.length;
  for (let i = 0; i < len; i++) {
    if (sails.config.mastermind.colors.indexOf(code[i]) === -1) {
      return res.badRequest({
       message: `Invalid color. The colors must be within this selection: ${sails.config.mastermind.colors}`,
       property: 'code',
       value: req.body.code
      });      
    }
  }

  if (!req.body.game_key) {
    return res.badRequest({
      message: 'Missing parameter',
      property: 'game_key'
    });
  }

  next();
};