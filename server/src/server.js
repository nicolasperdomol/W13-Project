'use strict';

//Global variables
const portNumber = 8000;
const express = require('express');
const app = express();
const cors = require('cors');
const query = require('./queries');


//Middleware
//URL-encoded bodies will be parsed
app.use(express.urlencoded({extended: true}));
//JSON bodies will be parsed
app.use(express.json());
app.use(cors());

// Get all albums
app.get('/playlist', query.getPlaylist);

// Get single album by ID
app.get('/playlist/:id', query.getAlbum);

//Saving album in DB
app.post('/playlist', query.saveAlbum);

app.delete('/playlist/:id', query.removeAlbum);

app.listen(portNumber, function() {
    console.log('Server listening to port', portNumber);
})