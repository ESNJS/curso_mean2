'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'ClaveSecreta';

exports.ensureAuth = function(req, res, next){
  if(!req.headers.authorization){
    return res.status(403).send({message: 'La peticion no tiene la cabezera de autenticacion'})
  };

  var token = req.headers.authorization.replace(/['"]+/g, '');

  try{
    var payload = jwt.decode(token, secret);

    if(payload.exp <= moment().unix()){
      return res.status(40).send({message: 'El Token ha expirado'})
    };

  }catch(ex){
    //console.log(ex);
    return res.status(404).send({message: 'El Token no es valido'})
  };

  req.user = payload;

  next();
};
