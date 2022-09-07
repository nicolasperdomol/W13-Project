const db = require('./db');

/** Retrieves all albums */
const getPlaylist = (request, response) => {
    
    //Connecting to DB
    db.connect();
    
    db.query('SELECT * FROM public.playlists', (result) => {
        let JSONObject = result.rows;
        let JSONObjectString = JSON.stringify(JSONObject, null, 4);
        response.writeHead(200, { 'Content-Type' : 'application/json' });
        response.end(JSONObjectString);
    })
    // db.disconnect(); //TO DO
} 

/** Retrieves release (album or song) by ID */
const getRelease = (request, response) => {
    
    //Connecting to DB
    db.connect();
    
    //Retrieving parameters
    let params = [request.params.id];
    db.queryParams('SELECT id, title, artists, genres, year, tracklist, uri' +
                   ' FROM public.playlists WHERE id = $1', params, (result) => {    

    if(result.rowCount == 1) {
        let JSONObject = result.rows;
        let JSONObjectString = JSON.stringify(JSONObject, null, 4);

        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSONObjectString);
    } else {
        response.writeHead(404, { 'Content-Type': 'text/html' });
        response.end('Release ID #' + request.params.id + ' does not exist.');
    }
    });
    // db.disconnect(); //TO DO
}

/** Adds album to DB */
const saveRelease = (request, response) => {
    
    //Connecting to DB
    db.connect();
    
    //Retrieving data
    let data = request.body;
    let id = data[0].id;

    //Validating whether release exists in DB
    db.queryParams('SELECT * FROM public.playlists WHERE id = $1', [id], (result) => {
        if (result.rowCount == 1) {
            response.writeHead(404, { 'Content-Type': 'application/json' });
            let message = JSON.stringify({"message":'Release is already in playlist.'})
            response.end(message);
        } else {
            //Always retrieving one object (album or song) at a time
            let JSONObject = data[0];
            
            //Retrieving tracklist titles only
            let tracklist_data = data[0].tracklist;
            let tracklist = [];
            for(let i = 0; i < tracklist_data.length; i++){
                tracklist.push(tracklist_data[i].title);
            };
            // let JSONObjectString = JSON.parse
        
            //Storing only the first values if category is an array (Ex. artists);
            let params = [JSONObject.id, JSONObject.title, JSONObject.artists[0].name, JSONObject.genres[0], 
                          JSONObject.year, tracklist, JSONObject.uri];
            
            db.queryParams('INSERT INTO public.playlists(id, title, artists, genres, year, tracklist, uri)' + 
                           ' VALUES ($1, $2, $3, $4, $5, $6, $7)' + 'RETURNING *', params, (result) => {
                
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.end(JSONObject.title + ' was added in playlist!');
            });
        }
    });
}

/** Removes album from DB */
const removeAlbum = (request, response) => {
    
    //Connecting to DB
    db.connect();
    
    //Retrieving parameters
    let params = [request.params.id];

    //Validating whether release exists in DB
    db.queryParams('SELECT * FROM public.playlists WHERE id = $1', params, (result) => { 

        if(result.rowCount == 1) {
            db.queryParams('DELETE FROM public.playlists WHERE id = $1', params, (result) => {    
                response.writeHead(200, { 'Content-Type': 'text/html'});
                response.end('Release was deleted.');
            });   

        } else {
            response.writeHead(402, { 'Content-Type': 'text/html'});
            response.end('Release ID #' + request.params.id + ' does not exist.');
        }
    });
}

module.exports = {
    getPlaylist,
    getRelease,
    saveRelease,
    removeAlbum
}