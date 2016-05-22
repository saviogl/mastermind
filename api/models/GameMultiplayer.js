'use strict';
/**
 * GameMultiplayer.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

const jwt = require('jwt-simple');

module.exports = {

  attributes: {
    user: 'string',
    guest: 'string',
    colors: {
      type: 'array',
      defaultsTo: sails.config.mastermind.colors
    },
    positions: {
      type: 'integer',
      defaultsTo: sails.config.mastermind.positions
    },
    user_guesses_attempts: {
      type: 'integer',
      defaultsTo: 0
    },
    user_past_guesses: {
      type: 'array',
      defaultsTo: []
    },
    guest_guesses_attempts: {
      type: 'integer',
      defaultsTo: 0
    },
    guest_past_guesses: {
      type: 'array',
      defaultsTo: []
    },
    solved: {
      type: 'boolean',
      defaultsTo: false
    },
    started: {
      type: 'boolean',
      defaultsTo: false
    },
    solvedAt: 'datetime',
    solvedBy: 'string',
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
      delete game.started;


      return game;
    }
  }
};

