'use strict'

var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getSong(req, res){
  var songId = req.params.id;

  Song.findById(songId).populate({path: 'album'}).exec((err, song) => {
    if(err){
      res.status(500).send({message: "Error en la peticion"});
    }else{
      if(!song){
        res.status(404).send({message: "No se ha encontrado la cancion"});
      }else{
        res.status(200).send({song});
      };
    };
  });
};

function getSongs(req, res){
  var albumId = req.params.artist;

  if(!albumId){
    //Sacar todos los albums de la base de datos
    var find = Song.find({}).sort('name');
  }else{
    //Sacar los albums del Artista
    var find = Song.find({album: albumId}).sort('number');
  };

  find.populate({
    path: 'album',
    populate: {
      path: 'artist',
      model: 'Artist'
    }
  }).exec((err, songs) => {
    if(err){
      res.status(500).send({message: "Error en la peticion"});
    }else{
      if(!songs){
        res.status(404).send({message: "No se ha encontrado Song"});
      }else{
        res.status(200).send({songs});
      };
    };
  });
};

function saveSong(req, res){
  var song = new Song();

  var params = req.body;
  song.number = params.number;
  song.name = params.name;
  song.duration = params.duration;
  song.file = 'null';
  song.album = params.album;

  song.save((err, songStored) => {
    if(err){
      res.status(500).send({message: "Error al guardar el song"});
    }else{
      if(!songStored){
        res.status(404).send({message: "Song no guardado"});
      }else{
        res.status(200).send({song: songStored});
      };
    };
  });
};

function updateSong (req, res){
  var songId = req.params.id;
  var update = req.body;

  Song.findOneAndUpdate({_id: songId}, update, (err, songUpdated) => {
    if(err){
      res.status(500).send({message: "Error al actualizar el song"});
    }else{
      if(!songUpdated){
        res.status(404).send({message: "Song no actualizado"});
      }else{
        res.status(200).send({song: songUpdated});
      };
    };
  });
};

function deleteSong (req, res){
  var songId = req.params.id;
  var remove = req.body;

  Song.findOneAndDelete({_id: songId}, remove, (err, songRemoved) => {
    if(err){
      res.status(500).send({message: "Error al remove el song"});
    }else{
      if(!songRemoved){
        res.status(404).send({message: "Song no removed"});
      }else{
        res.status(200).send({song: songRemoved});
      };
    };
  });
};

function uploadFile(req, res) {
  var songId = req.params.id;
  var file_name = 'No subido...';

  if(req.files){
    var file_path = req.files.file.path;

    var file_split = file_path.split('\\');
    file_name = file_split[2];

    var ext_split = file_name.split('\.');
    var file_ext = ext_split[1];

    if(file_ext == 'mp3'){
      Song.findOneAndUpdate({_id: songId}, {file:  file_name}, (err, songUpdated) =>{
        if(err){
          res.status(500).send({message: 'Error al actualizar el album'});
        }else{
          if(!songUpdated){
            res.status(404).send({message: 'No se ha podido actualizar el album'});
          }else{
            res.status(200).send({song: songUpdated});
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

function getSongFile(req,res){
  var songFile = req.params.songFile;
  var path_file = './uploads/songs/'+songFile;
  fs.exists(path_file, function(exists){
    if(exists){
      res.sendFile(path.resolve(path_file));
    }else{
      res.status(200).send({message: 'La cancion no Existe'});
    };
  });
};

module.exports = {
  getSong,
  saveSong,
  getSongs,
  updateSong,
  deleteSong,
  uploadFile,
  getSongFile
};
