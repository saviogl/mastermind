'use strict';
/**
 * GameController
 *
 * @description :: Server-side logic for managing Games
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  create: (req, res, next) => {
    let user = req.body.user;
    let Model = req.body.multiplayer ? sails.models.gamemultiplayer : sails.models.game;

    Model
      .create({ user: user })
      .then(game => {
        let key = Token.encode({ user: user, game: game.id, multiplayer: req.body.multiplayer ? true : false });
        game.game_key = key;
        if (req.body.multiplayer) game.invite_key = Token.encode(game.id);
        res.ok(game);
      })
      .catch(res.negotiate);
  },

  guess: (req, res, next) => {
    let token = Token.decode(req.body.game_key);
    switch (token.multiplayer) {
      case true:
        guessMultiplayer(token, req, res, next);
        break;
      case false:
        guessIndividual(token, req, res, next);
        break;
    }
  },

  join: (req, res, next) => {
    let game = Token.decode(req.body.invite_key);
    let user = req.body.user;

    GameMultiplayer
      .findOneById(game)
      .then(game => GameMultiplayer.update(game.id, { guest: user, started: true }))
      .then(game => {
        game = game.pop()
        let game_key = Token.encode({ game: game.id, user: user, multiplayer: true });
        game.game_key = game_key;        
        res.ok(game);
      })
      .catch(res.negotiate)
  },

  find: (req, res, next) => {
    Game
      .find()
      .then(games => res.ok(games))
      .catch(res.negotiate);
  },

  findOne: (req, res, next) => {
    Game
      .findOneById(req.params.id)
      .then(game => res.ok(game))
      .catch(res.negotiate);
  }
};

const guessIndividual = (token, req, res, next) => {
  let code = req.body.code;

  Game
    .findOneById(token.game)
    .then(game => {
      if (!game) {
        throw {
          status: 404,
          message: 'Game not found',
          property: 'game',
          value: game
        };
      }

      let guess = Mastermind.guess(game.solution, code);

      game.guesses_attempts++;
      game.past_guesses.push(guess);

      if (guess.exact === game.positions) {
        game.solved = true;
        game.solvedAt = new Date();
        game.duration = (game.solvedAt.getTime() - game.createdAt.getTime()) / 1000;
      }

      game = game.toObject();

      return [guess, Game.update(game.id, game)];
    })
    .spread((guess, game) => {
      game = game.pop();

      if (game.solved) {
        game.result = 'You win!'
      } else {
        game.result = guess;
      }

      return res.ok(game);
    })
    .catch(res.negotiate);
};

const guessMultiplayer = (token, req, res, next) => {
  let code = req.body.code;

  GameMultiplayer
    .findOneById(token.game)
    .then(game => {
      if (!game) {
        throw {
          status: 404,
          message: 'Game not found',
          property: 'game',
          value: game
        };
      }

      let guess = Mastermind.guess(game.solution, code);

      if (token.user === game.user) {
        game.user_guesses_attempts++;
        game.user_past_guesses.push(guess);
      } else {
        game.guest_guesses_attempts++;
        game.guest_past_guesses.push(guess);        
      }
 
      if (guess.exact === game.positions) {
        game.solved = true;
        game.solvedAt = new Date();
        game.duration = (game.solvedAt.getTime() - game.createdAt.getTime()) / 1000;
        game.solvedBy = token.user;
      }

      game = game.toObject();

      return [guess, GameMultiplayer.update(game.id, game)];
    })
    .spread((guess, game) => {
      game = game.pop();

      if (game.solved) {
        game.result = `${game.solvedBy} win!`
      } else {
        game.result = guess;
      }

      return res.ok(game);
    })
    .catch(res.negotiate);
};
