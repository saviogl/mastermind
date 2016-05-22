'use strict';

exports.shuffle = (colors, positions) => {
  const code = [],
    max = positions - 1;

  for (let i = 0; i < positions; i++) {
    let pos = Math.round(Math.random() * (max - 0) + 0);
    code.push(colors[pos]);
  }

  return code.join('');
};

exports.guess = (solution, code) => {
  solution = solution.split('');
  let len = solution.length;
  let result = {
    exact: 0,
    near: 0,
    guess: code
  };
  let slots = solution.map(s => false);

  code = code.split('');

  code.forEach((c, i) => {
    if (c === solution[i]) {
      result.exact++;
      slots[i] = true;
    }
  });

  code.forEach((c, i) => {
    for (let j = 0; j < len; j++) {
      if (slots[j]) {
        continue;
      }

      if (c === solution[j]) {
        result.near++;
        slots[j] = true;
        break;
      }
    }
  });

  return result;
};
