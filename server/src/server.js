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

// Get all releases
app.get('/playlists', query.getPlaylist);

// Get releases (album or song) by ID
app.get('/playlists/:id', query.getRelease);

//Saving release (album or song) in DB
app.post('/playlists', query.saveRelease);

//Deleting release (album or song) in DB
app.delete('/playlists/:id', query.removeAlbum);

app.listen(portNumber, function() {
    console.log('Server listening to port', portNumber);
})