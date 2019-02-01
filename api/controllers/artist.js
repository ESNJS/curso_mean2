'use strict'

var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getArtist(req, res){
  var artistId = req.params.id;

  Artist.findById(artistId, (err, artist) => {
    if(err){
      res.status(500).send({message: "Error en la peticion"});
    }else{
      if(!artist){
        res.status(404).send({message: "No se ha encontrado al artista"});
      }else{
        res.status(200).send({artist});
      };
    };
  });
};

function getArtists(req, res){
  if(req.params.page){
    var page = req.params.page;
  }else{
    var page = 1;
  };

  var itemsPerPage = 4;

  Artist.find().sort('name').paginate(page, itemsPerPage, function(err, artists, total){
    if(!err){
      if(!artists){
        res.status(404).send({message: "No se encontraton Artistas"});
      }else {
        return res.status(200).send({
          registres: total,
          artists: artists
        });
      };
    }else{
      res.status(500).send({message: "Error en la peticion"});
    };
  });
};

function saveArtist(req, res){
  var artist = new Artist();

  var params = req.body;
  artist.name = params.name;
  artist.description = params.description;
  artist.image = 'null';

  artist.save((err, artistStored) => {
    if(err){
      res.status(500).send({message: "Error al guardar el artista"});
    }else{
      if(!artistStored){
        res.status(404).send({message: "Artista no guardado"});
      }else{
        res.status(200).send({artist: artistStored});
      };
    };
  });
};

function updateArtist (req, res){
  var artistId = req.params.id;
  var update = req.body;

  Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated) => {
    if(err){
      res.status(500).send({message: "Error al actualizar el artista"});
    }else{
      if(!artistUpdated){
        res.status(404).send({message: "Artista no actualizado"});
      }else{
        res.status(200).send({artist: artistUpdated});
      };
    };
  });
};

function deleteArtist(req, res){
  var artistId = req.params.id;

  Artist.findByIdAndRemove(artistId, (err, artistRemoved) => {
    if(err){
      res.status(500).send({message: "Error al borrar el artista"});
    }else {
      if(!artistRemoved){
        res.status(404).send({message: "Artista no borrado"});
      }else{
        Album.find({artist: artistRemoved._id}).remove((err, albumRemoved)=>{
          if(err){
            res.status(500).send({message: "Error al borrar el album"});
          }else {
            if(!albumRemoved){
              res.status(404).send({message: "Album no borrado"});
            }else{
              Song.find({album: albumRemoved._id}).remove((err, songRemoved)=>{
                if(err){
                  res.status(500).send({message: "Error al borrar la cancion"});
                }else {
                  if(!songRemoved){
                    res.status(404).send({message: "Cancion no borrado"});
                  }else{
                    res.status(200).send({artist: artistRemoved});
                  };
                };
              });//songRemoved

            };
          };
        });
        //albumRemoved

      };
    };
  });
};

function uploadImage(req, res) {
  var artistId = req.params.id;
  var file_name = 'No subido...';

  if(req.files){
    var file_path = req.files.image.path;

    var file_split = file_path.split('\\');
    file_name = file_split[2];

    var ext_split = file_name.split('\.');
    var file_ext = ext_split[1];

    if(file_ext == 'png'  || file_ext == 'gif' || file_ext == 'jpg'){
      Artist.findOneAndUpdate({_id: artistId}, {image:  file_name}, (err, artistUpdated) =>{
        if(err){
          res.status(500).send({message: 'Error al actualizar el artista'});
        }else{
          if(!artistUpdated){
            res.status(404).send({message: 'No se ha podido actualizar el artista'});
          }else{
            res.status(200).send({user: artistUpdated});
          }
        }
      });
    }else{
      res.status(200).send({message: 'Extension del archivo no valida'});
    };
  }else{
    res.status(200).send({message: 'La imagen no se ha subido'});
  };
};

function getImageFile(req,res){
  var imageFile = req.params.imageFile;
  var path_file = './uploads/artists/'+imageFile;
  fs.exists(path_file, function(exists){
    if(exists){
      res.sendFile(path.resolve(path_file));
    }else{
      res.status(200).send({message: 'La imagen no Existe'});
    };
  });
};

module.exports = {
  getArtist,
  saveArtist,
  getArtists,
  updateArtist,
  deleteArtist,
  uploadImage,
  getImageFile
};
