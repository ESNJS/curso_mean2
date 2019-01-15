'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//------------------------------RUTAS
var user_routes = require('./routes/user');
var artist_routes = require('./routes/artist');
var album_routes = require('./routes/album');
var song_routes = require('./routes/song');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//---------------------------CABECERAS
app.use((req, resp, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Method', 'GET, POST, PUT, OPTIONS, DELETE');
  res.header('Allow', 'GET, POST, PUT, OPTIONS, DELETE');

  next();
});


//---------------------------RUTAS BASE
app.use('/api', user_routes);
app.use('/api', artist_routes);
app.use('/api', album_routes);
app.use('/api', song_routes);

module.exports = app;
