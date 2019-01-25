'use strict'

var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');


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
              res.status(200).send({
                token: jwt.createToken(user)
              });
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

function updateUser(req, res){
  var userId = req.params.id;
  var update = req.body;

  if(userId != req.user.sub){
    res.status(500).send({message: 'No tiene permisos para actualizar este usuario'});
  }

  User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
    if(err){
      res.status(500).send({message: 'Error al actualizar el usuario'});
    }else{
      if(!userUpdated){
        res.status(404).send({message: 'No se ha podido actualizar el usuario'});
      }else{
        res.status(200).send({user: userUpdated});
      }
    }
  });
};

function uploadImage(req, res) {
  var userId = req.params.id;
  var file_name = 'No subido...';

  if(req.files){
    var file_path = req.files.image.path;

    var file_split = file_path.split('\\');
    file_name = file_split[2];

    var ext_split = file_name.split('\.');
    var file_ext = ext_split[1];

    if(file_ext == 'png'  || file_ext == 'gif' || file_ext == 'jpg'){
      User.findByIdAndUpdate(userId, {image:  file_name}, (err, userUpdated) =>{
        if(err){
          res.status(500).send({message: 'Error al actualizar el usuario'});
        }else{
          if(!userUpdated){
            res.status(404).send({message: 'No se ha podido actualizar el usuario'});
          }else{
            res.status(200).send({image: file_name, user: userUpdated});
          }
        }
      });
    }else{
      res.status(200).send({message: 'Extension del archivo no valida'});
    };

    console.log(file_split[2]);
  }else{
    res.status(200).send({message: 'La imagen no se ha subido'});
  };
};

function getImageFile(req,res){
  var imageFile = req.params.imageFile;
  var path_file = './uploads/users/'+imageFile;
  fs.exists(path_file, function(exists){
    if(exists){
      res.sendFile(path.resolve(path_file));
    }else{
      res.status(200).send({message: 'La imagen no Existe'});
    };
  });
};

function deleteUser(req, res){
  var userId = req.params.id;
  var deleteUser = req.body;

  console.log(req.body);

  User.findOneAndDelete({_id: userId}, deleteUser, (err, userDeleted) => {
    if(err){
      res.status(500).send({message: 'Error al borrar el usuario'});
    }else{
      if(!userDeleted){
        res.status(404).send({message: 'No se ha podido borrar el usuario'});
      }else{
        res.status(200).send({user: userDeleted});
      }
    }
  });
};

module.exports = {
  pruebas,
  saveUser,
  loginUser,
  updateUser,
  uploadImage,
  getImageFile,
  deleteUser
};
