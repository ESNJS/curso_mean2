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
  user.email = params.email.toLowerCase();
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

function loginUser(req, res){
  var params = req.body;

  var email = params.email;
  var password = params.password;

  User.findOne({email: email.toLowerCase()}, (err, user) => {
    if(err){
      res.status(500).send({message: 'Error en la peticion'});
    }else{
      if(!user){
        res.status(404).send({message: 'Usuario inexistente'});
      }else{
        // Comprobar la Contraseña
        bcrypt.compare(password, user.password, function(err, check) {
          if(check){
            //Devolcer los datos del usuario logueado
            if(params.gethash){
              //Devolver un Token de JWT
            }else{
              res.status(200).send({user});
            };
          }else{
            res.status(404).send({message: 'Usuario No ha podido loguearse'});
          }
        });
      };
    };
  });
};

module.exports = {
  pruebas,
  saveUser,
  loginUser
};