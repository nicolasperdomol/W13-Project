const db = require('./db');

/** Retrieves all playlists */
const getPlaylists = (request, response) => {
    
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

/** Retrieves all releases (albums or songs) in playlist */
const getReleases = (request, response) => {
    
    //Connecting to DB
    db.connect();
    
    //Retrieving parameters
    let params = [request.params.id];
    db.queryParams('SELECT playlist_id, release_id, title, artists, genres, year, tracklist, uri' +
                   ' FROM public.albums WHERE playlist_id = $1', params, (result) => {    

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

/** Adds playlist in DB */
const savePlaylist = (request, response) => {
    
    //Connecting to DB
    db.connect();
    
    //Retrieving data
    let data = request.body;
    let id = 0;

    if(data[0].id !== undefined){
        id = data[0].id
    }

    //Validating whether playlist exists in DB
    db.queryParams('SELECT * FROM public.playlists WHERE id = $1', [id], (result) => {
        if (result.rowCount == 1) {
            response.writeHead(404, { 'Content-Type': 'application/json' });
            let message = JSON.stringify({"message":'Playlist already exists.'})
            response.end(message);
        } else {
            let playlist_name = data[0].name;
            db.queryParams('INSERT INTO public.playlists(name) VALUES ($1) ' 
                            + 'RETURNING *', [playlist_name], (result) => {
                
            response.writeHead(200, { 'Content-Type': 'application/json' });
            let message = JSON.stringify({"message": 'Playlist ' + data[0].name + ' was created!'})
            response.end(message);
            });
        }
    });
}

/** Adds album in DB */
const saveRelease = (request, response) => {
    
    //Connecting to DB
    db.connect();
    
    //Retrieving data
    let data = request.body;
    let id = data[0].id;

    //Validating whether release exists in DB
    db.queryParams('SELECT * FROM public.albums WHERE playlist_id = $1', [id], (result) => {
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
            let params = [JSONObject.playlist_id, JSONObject.id, JSONObject.title, JSONObject.artists[0].name, JSONObject.genres[0], 
                          JSONObject.year, tracklist, JSONObject.uri, JSONObject.thumb];
            
            db.queryParams('INSERT INTO public.albums(playlist_id, release_id, title, artists, genres, year, tracklist, uri, image_url)' + 
                           ' VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)' + 'RETURNING *', params, (result) => {
                
            response.writeHead(200, { 'Content-Type': 'application/json' });
            let message = JSON.stringify({"message":JSONObject.title + ' was added in playlist!'})
            response.end(message);
            });
        }
    });
}

/** Removes album from DB */
const removeAlbum = (request, response) => {
    
    //Connecting to DB
    db.connect();

    //Validating whether release exists in DB
    db.queryParams('SELECT * FROM public.albums WHERE release_id = $1', [request.params.album], (result) => { 

        if(result.rowCount == 1) {
            let params = [request.params.playlist, request.params.album];
            db.queryParams('DELETE FROM public.albums WHERE playlist_id = $1 AND release_id = $2', params, (result) => {    
                response.writeHead(200, { 'Content-Type': 'text/html'});
                response.end('Release was deleted.');
            });   

        } else {
            response.writeHead(402, { 'Content-Type': 'text/html'});
            response.end('Release ID #' + request.params.id + ' does not exist.');
        }
    });
}

/** Removes playlist from DB */
const removePlaylist = (request, response) => {
    
    //Connecting to DB
    db.connect();
    
    //Retrieving parameters
    let params = [request.params.playlist];
    
    //Deleting content of playlist
    db.queryParams('DELETE FROM public.albums WHERE playlist_id = $1', params, (result) => {
        
        //Deleting playlist
        if(result.rowCount == 0) {
            db.queryParams('DELETE FROM public.playlists WHERE id = $1', params, (result) => {    
                response.writeHead(200, { 'Content-Type': 'application/json'});
                let message = JSON.stringify({message:'Playlist was deleted.'})
                response.end(message);
            });   

        } else {
            response.writeHead(404, { 'Content-Type': 'application/json'});
            let message = JSON.stringify({message:'Playlist does not exist.'})
            response.end(message);
        }
    });
}

module.exports = {
    getPlaylists,
    getReleases,
    savePlaylist,
    saveRelease,
    removeAlbum,
    removePlaylist
}