'use strict';
/**
 * Game.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    user: 'string',
    colors: {
      type: 'array',
      defaultsTo: sails.config.mastermind.colors
    },
    positions: {
      type: 'integer',
      defaultsTo: sails.config.mastermind.positions
    },
    guesses_attempts: {
      type: 'integer',
      defaultsTo: 0
    },
    past_guesses: {
      type: 'array',
      defaultsTo: []
    },
    solved: {
      type: 'boolean',
      defaultsTo: false
    },

    solvedAt: 'datetime',
    duration: 'float',

    solution: {
      type: 'string',
      defaultsTo: Mastermind.shuffle(sails.config.mastermind.colors, sails.config.mastermind.positions)
    },

    toJSON: function (){
      let game = this.toObject();
      delete game.solution;
      delete game.createdAt;
      delete game.updatedAt;
      delete game.solvedAt;
      delete game.id;
      if (!game.solved) delete game.duration;
      return game;
    }
  }
};

