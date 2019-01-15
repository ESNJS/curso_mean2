'use strict'

var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getAlbum(req, res){
  var albumId = req.params.id;

  Album.findById(albumId).populate({path: 'artist'}).exec((err, album) => {
    if(err){
      res.status(500).send({message: "Error en la peticion"});
    }else{
      if(!album){
        res.status(404).send({message: "No se ha encontrado al artista"});
      }else{
        res.status(404).send({album});
      };
    };
  });
};

function getAlbums(req, res){
  var artistId = req.params.artist;

  if(!artistId){
    //Sacar todos los albums de la base de datos
    var find = Album.find({}).sort('title');
  }else{
    //Sacar los albums del Artista
    var find = Album.find({artist: artistId}).sort('year');
  };

  find.populate({path: 'artist'}).exec((err, albums) => {
    if(err){
      res.status(500).send({message: "Error en la peticion"});
    }else{
      if(!albums){
        res.status(404).send({message: "No se ha encontrado albums"});
      }else{
        res.status(200).send({albums});
      };
    };
  });
};

function saveAlbum(req, res){
  var album = new Album();

  var params = req.body;
  album.title = params.title;
  album.description = params.description;
  album.year = params.year;
  album.image = 'null';
  album.artist = params.artist;

  album.save((err, albumStored) => {
    if(err){
      res.status(500).send({message: "Error al guardar el album"});
    }else{
      if(!albumStored){
        res.status(404).send({message: "Album no guardado"});
      }else{
        res.status(200).send({artist: albumStored});
      };
    };
  });
};

function updateAlbum (req, res){
  var albumId = req.params.id;
  var update = req.body;

  Album.findOneAndUpdate({_id: albumId}, update, (err, albumUpdated) => {
    if(err){
      res.status(500).send({message: "Error al actualizar el album"});
    }else{
      if(!albumUpdated){
        res.status(404).send({message: "Album no actualizado"});
      }else{
        res.status(200).send({album: albumUpdated});
      };
    };
  });
};

function deleteAlbum(req, res){
  var albumId = req.params.id;

  Album.findByIdAndRemove(albumId, (err, albumRemoved)=>{
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
              res.status(200).send({album: albumRemoved});
            };
          };
        });//songRemoved

      };
    };
  });
  //albumRemoved
};

module.exports = {
  getAlbum,
  saveAlbum,
  getAlbums,
  updateAlbum,
  deleteAlbum
};
