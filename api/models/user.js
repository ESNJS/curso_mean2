'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = ({
  name: String,
  surname: String,
  email: String,
  password: String,
  role: String,
  image: String
});

module.exports = mongoose.model('User', UserSchema);