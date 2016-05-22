const jwt = require('jwt-simple');

exports.encode = (payload) => jwt.encode(payload, sails.config.jwt.secret);
exports.decode = (token) => jwt.decode(token, sails.config.jwt.secret);