'use strict'

var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');

function pruebas(req, res){
    res.status(200).send({message: "Probando una accion del controlador"});
};

function saveUser (req, res){
  var user = new User();

  var params = req.body;

  console.log(params);

  user.name = params.name;
  user.surname = params.surname;
  user.email = params.email;
  user.role = 'ROLE_USER';
  user.image = 'null';

  if(params.password){
    //Encriptar y Guardar contraseña
    bcrypt.hash(params.password, null, null, function(err, hash){
      user.password = hash;
      if(user.name != null && user.surname != null && user.email != null){
        //Guardar Usuario en BD
        user.save((err, userStored) => {
          if(err){
            res.status(500).send({message: 'Error al Guardar el Usuario'});
          }else{
            if(!userStored){
              res.status(404).send({message: 'No se ha guardado el Usuario'});
            }else{
              res.status(200).send({user: userStored});
            };
          };
        });
      }else{
        res.status(200).send({message: 'Faltan Datos'});
      };
    });
  }else{
    res.status(200).send({message: 'Introduce la contraseña'});
  };
};

module.exports = {
  pruebas,
  saveUser
};
