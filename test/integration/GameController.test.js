'use strict';

const request = require('supertest');
const expect = require('chai').expect;

let gameInd, gameMult;

describe('GameController', () => {

  describe('#create - Create Game', () => {
    it('should return badRequest error', done => {
      request(sails.hooks.http.app)
        .post('/game')
        .send()
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.keys(['message', 'property']);
          expect(res.body.message).to.equal('Missing parameter');
          done();
        });
    });

    it('should create an individual game', done => {
      request(sails.hooks.http.app)
        .post('/game')
        .send({ user: 'John Doe' })
        .expect('Content-Type', /json/)
        .expect(201)
        .end((err, res) => {
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.keys(['colors', 'game_key', 'guesses_attempts', 'past_guesses', 'positions', 'solved', 'user']);
          expect(res.body.colors.join('')).to.be.equal(sails.config.mastermind.colors.join(''));
          expect(res.body.positions).to.be.equal(sails.config.mastermind.positions);
          expect(res.body.guesses_attempts).to.be.equal(0);
          expect(res.body.past_guesses).to.be.an('array');
          expect(res.body.past_guesses).to.be.empty;
          expect(res.body.solved).to.be.equal(false);
          expect(res.body.user).to.be.equal('John Doe');
          gameInd = {
            game_key: res.body.game_key,
            user: 'John Doe'
          };
          done();
        });
    });

    it('should create a multiplayer game', done => {
      request(sails.hooks.http.app)
        .post('/game')
        .send({ user: 'John Doe', multiplayer: true })
        .expect('Content-Type', /json/)
        .expect(201)
        .end((err, res) => {
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.keys(['colors', 'game_key', 'user_guesses_attempts', 'user_past_guesses', 'guest_guesses_attempts', 'guest_past_guesses', 'positions', 'solved', 'user', 'invite_key']);
          expect(res.body.colors.join('')).to.be.equal(sails.config.mastermind.colors.join(''));
          expect(res.body.positions).to.be.equal(sails.config.mastermind.positions);
          expect(res.body.user_guesses_attempts).to.be.equal(0);
          expect(res.body.user_past_guesses).to.be.an('array');
          expect(res.body.user_past_guesses).to.be.empty;
          expect(res.body.guest_guesses_attempts).to.be.equal(0);
          expect(res.body.guest_past_guesses).to.be.an('array');
          expect(res.body.guest_past_guesses).to.be.empty;
          expect(res.body.solved).to.be.equal(false);
          expect(res.body.user).to.be.equal('John Doe');
          gameMult = {
            invite_key: res.body.invite_key,
            user_key: res.body.game_key,
            user: res.body.user
          };
          done();
        });
    });
  });

  describe('#guess - Take guess', () => {
    it('should return badRequest error - property \'code\'', done => {
      request(sails.hooks.http.app)
        .post('/guess')
        .send()
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.keys(['message', 'property']);
          expect(res.body.message).to.equal('Missing parameter');
          expect(res.body.property).to.equal('code');
          done();
        });
    });

    it('should return badRequest error - invalid \'guess\' length', done => {
      request(sails.hooks.http.app)
        .post('/guess')
        .send({ code: 'SADAS' })
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.keys(['message', 'property', 'value']);
          expect(res.body.message).to.equal(`Invalid number of characters. There are ${sails.config.mastermind.positions} positions to guess in this game`);
          expect(res.body.property).to.equal('code');
          expect(res.body.value).to.equal('SADAS');
          done();
        });
    });

    it('should return badRequest error - invalid \'guess\' character', done => {
      request(sails.hooks.http.app)
        .post('/guess')
        .send({ code: 'SADASSFF' })
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.keys(['message', 'property', 'value']);
          expect(res.body.message).to.equal(`Invalid color. The colors must be within this selection: ${sails.config.mastermind.colors}`);
          expect(res.body.property).to.equal('code');
          expect(res.body.value).to.equal('SADASSFF');
          done();
        });
    });

    it('should return badRequest error - property \'game_key\'', done => {
      request(sails.hooks.http.app)
        .post('/guess')
        .send({ code: 'YRGGRYPM' })
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.keys(['message', 'property']);
          expect(res.body.message).to.equal('Missing parameter');
          expect(res.body.property).to.equal('game_key');
          done();
        });
    });

    describe('#guess - Take guess Individual Game', () => {
      it('should take a proper guess to an individual game', done => {
        request(sails.hooks.http.app)
          .post('/guess')
          .send({ code: 'YRGGRYPM', game_key: gameInd.game_key })
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.keys(['user', 'colors', 'positions', 'guesses_attempts', 'past_guesses', 'solved', 'result']);
            expect(res.body.user).to.equal(gameInd.user);
            expect(res.body.colors.join('')).to.equal(sails.config.mastermind.colors.join(''));
            expect(res.body.positions).to.equal(sails.config.mastermind.positions);
            expect(res.body.guesses_attempts).to.equal(1);
            expect(res.body.past_guesses).to.be.an('array');
            expect(res.body.past_guesses).to.have.lengthOf(1);
            expect(res.body.past_guesses[0]).to.have.all.keys(['exact', 'near', 'guess']);
            expect(res.body.past_guesses[0].guess).to.equal('YRGGRYPM');
            expect(res.body.result).to.be.an('object');
            done();
          });
      });

      it('should take a proper guess and resolve an individual game', done => {
        Game
          .findOne({
            user: gameInd.user
          })
          .then(game => {
            request(sails.hooks.http.app)
              .post('/guess')
              .send({ code: game.solution, game_key: gameInd.game_key })
              .expect('Content-Type', /json/)
              .expect(200)
              .end((err, res) => {
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.keys(['user', 'colors', 'positions', 'guesses_attempts', 'past_guesses', 'solved', 'result', 'duration']);
                expect(res.body.user).to.equal(gameInd.user);
                expect(res.body.colors.join('')).to.equal(sails.config.mastermind.colors.join(''));
                expect(res.body.positions).to.equal(sails.config.mastermind.positions);
                expect(res.body.guesses_attempts).to.equal(2);
                expect(res.body.past_guesses).to.be.an('array');
                expect(res.body.past_guesses).to.have.lengthOf(2);
                expect(res.body.past_guesses[1]).to.have.all.keys(['exact', 'near', 'guess']);
                expect(res.body.past_guesses[1].guess).to.equal(game.solution);
                expect(res.body.result).to.be.a('string');
                expect(res.body.result).to.be.equal('You win!');
                done();
              });
          })
          .catch(done);
      });

      it('should return error - game solved', done => {
        request(sails.hooks.http.app)
          .post('/guess')
          .send({ code: 'YRGGRYPM', game_key: gameInd.game_key })
          .expect('Content-Type', /json/)
          .expect(423)
          .end((err, res) => {
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.keys(['message', 'result']);
            expect(res.body.message).to.equal('This game has been solved already! Create another one via POST /game');
            expect(res.body.result).to.be.an('object');
            expect(res.body.result).to.have.keys(['user', 'colors', 'positions', 'guesses_attempts', 'past_guesses', 'solved', 'duration']);
            expect(res.body.result.solved).to.equal(true);
            done();
          });
      });
    });

    describe('#guess - Take guess Multiplayer Game', () => {
      it('should return error - wait for another player', done => {
        request(sails.hooks.http.app)
          .post('/guess')
          .send({ code: 'YRGGRYPM', game_key: gameMult.user_key })
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.keys(['message']);
            expect(res.body.message).to.equal('You have to wait for another player to join the game before you are allowed to take guesses');
            done();
          });
      });

      it('should return error - wait for another player guess', done => {
        request(sails.hooks.http.app)
          .post('/join')
          .send({ user: 'Jane Doe', invite_key: gameMult.invite_key })
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.keys(['colors', 'game_key', 'user_guesses_attempts', 'user_past_guesses', 'guest_guesses_attempts', 'guest_past_guesses', 'positions', 'solved', 'user', 'guest']);
            expect(res.body.guest).to.equal('Jane Doe');
            gameMult.guess_key = res.body.game_key;

            request(sails.hooks.http.app)
              .post('/guess')
              .send({ code: 'YRGGRYPM', game_key: gameMult.guess_key })
              .expect('Content-Type', /json/)
              .expect(200)
              .end((err, res) => {
                request(sails.hooks.http.app)
                  .post('/guess')
                  .send({ code: 'YRGGRYPM', game_key: gameMult.guess_key })
                  .expect('Content-Type', /json/)
                  .expect(200)
                  .end((err, res) => {
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.keys(['message']);
                    expect(res.body.message).to.equal('You guess was not registerd beacause the other player has not taken his/her guess yet');
                    done();
                  });
              });
          });
      });

      it('should take a proper guess and resolve a multiplayer game', done => {
        GameMultiplayer
          .findOne({
            user: gameMult.user
          })
          .then(game => {
            request(sails.hooks.http.app)
              .post('/guess')
              .send({ code: game.solution, game_key: gameMult.user_key })
              .expect('Content-Type', /json/)
              .expect(200)
              .end((err, res) => {
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.keys(['user', 'colors', 'positions', 'user_guesses_attempts', 'user_past_guesses', 'guest_past_guesses', 'guest_guesses_attempts', 'solved', 'result', 'duration', 'guest', 'solvedBy']);
                expect(res.body.solvedBy).to.be.equal('John Doe');
                expect(res.body.result).to.be.a('string');
                expect(res.body.result).to.be.equal('John Doe win!');
                done();
              });
          })
          .catch(done);
      });
    });

  });

});
