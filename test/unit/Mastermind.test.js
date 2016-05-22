'use strict';

const expect = require('chai').expect;
const colors = ['R', 'B', 'G', 'Y', 'O', 'P', 'C', 'M'];

describe('Mastermind', () => {
  it('should shuffle array to generate random solution', done => {
    let shuffle_1 = Mastermind.shuffle(colors, 8);
    let shuffle_2 = Mastermind.shuffle(colors, 8);
    expect(shuffle_1).to.be.a('string');
    expect(shuffle_2).to.be.a('string');
    expect(shuffle_1).to.not.equal(shuffle_2);
    done();
  });

  it('should shuffle array with proper length', done => {
    let shuffle_4 = Mastermind.shuffle(colors, 4);
    let shuffle_5 = Mastermind.shuffle(colors, 5);
    let shuffle_6 = Mastermind.shuffle(colors, 6);
    let shuffle_7 = Mastermind.shuffle(colors, 7);
    let shuffle_8 = Mastermind.shuffle(colors, 8);
    expect(shuffle_4).to.have.lengthOf(4);
    expect(shuffle_5).to.have.lengthOf(5);
    expect(shuffle_6).to.have.lengthOf(6);
    expect(shuffle_7).to.have.lengthOf(7);
    expect(shuffle_8).to.have.lengthOf(8);
    done();
  });

  it('should evaluate guess against solution and return guess base object', done => {
    let solution = 'RYOPCMMB';
    let guess = Mastermind.guess(solution, 'RBGYOPCM');
    expect(guess).to.be.an('object');
    expect(guess).to.have.all.keys(['exact', 'near', 'guess']);
    expect(guess.exact).to.be.a('number');
    expect(guess.exact).to.be.equal(1);
    expect(guess.near).to.be.a('number');
    expect(guess.near).to.be.equal(6);
    expect(guess.guess).to.be.a('string');
    expect(guess.guess).to.be.equal('RBGYOPCM');
    done();
  });

  it('should evaluate guess and resolve game', done => {
    let guess = Mastermind.guess('RYOPCMMB', 'RYOPCMMB');
    expect(guess).to.be.an('object');
    expect(guess).to.have.all.keys(['exact', 'near', 'guess']);
    expect(guess.exact).to.be.a('number');
    expect(guess.exact).to.be.equal(8);
    expect(guess.near).to.be.a('number');
    expect(guess.near).to.be.equal(0);
    expect(guess.guess).to.be.a('string');
    expect(guess.guess).to.be.equal('RYOPCMMB');
    done();
  });
});
