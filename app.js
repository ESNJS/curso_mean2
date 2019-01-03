'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//------------------------------RUTAS

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//---------------------------CABECERAS



//---------------------------RUTAS BASE

app.get('/pruebas', function(req, res) {
  res.status(200).send({message: 'Hellow!!'})
});

module.exports = app;
