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
        res.status(404).send({artist});
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

  var itemsPerPage = 3;

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
  params.description = params.description;
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

module.exports = {
  getArtist,
  saveArtist,
  getArtists
};
