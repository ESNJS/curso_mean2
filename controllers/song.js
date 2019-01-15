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
        res.status(404).send({song});
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
        res.status(200).send({artist: songStored});
      };
    };
  });
};

module.exports = {
  getSong,
  saveSong
};
