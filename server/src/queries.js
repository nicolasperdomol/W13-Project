const db = require('./db');

/** Retrieves all albums */
const getPlaylist = (request, response) => {
    
    //Connecting to DB
    db.connect();
    
    db.query('SELECT * FROM public.playlist', (result) => {
        let JSONObject = result;
        let JSONObjectString = JSON.stringify(JSONObject, null, 4);
        response.writeHead(200, { 'Content-Type' : 'application/json' });
        response.end(JSONObjectString);
    })
    // db.disconnect(); //TO DO
} 

/** Retrieves single album by ID */
const getAlbum = (request, response) => {
    
    //Connecting to DB
    db.connect();
    
    //Retrieving parameters
    let params = [request.params.id];
    
    if (exists(params)) {
        db.queryParams('SELECT release_title, artist, master_id, resource_url, genre, playlist_name ' +
                        'FROM public.playlist WHERE id = $1', params, (result) => {
            let JSONObject = result;
            let JSONObjectString = JSON.stringify(JSONObject, null, 4);
    
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSONObjectString);
        })
    } else {
        response.writeHead(404, { 'Content-Type': 'text/html' });
        response.end('ID does not exist.');
    }
    // db.disconnect(); //TO DO
}

/** Adds album to DB */
const saveAlbum = (request, response) => {
    
    //Connecting to DB
    db.connect();
    
    //Retrieving parameters
    const { title, artist, master_id, resource_url, genre, playlist_name } = request.body;
    let params = [title, artist, master_id, resource_url, genre, playlist_name];
    
    db.queryParams("INSERT INTO public.playlist (release_title, artist, master_id, resource_url, genre, playlist_name)" +
                    "VALUES ($1, $2, $3, $4, $5, $6) RETURNING *", params, (result) => {
        
        let title = result[0].title;
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(title + ' was added!');
    });
}

/** Removes album from DB */
const removeAlbum = (request, response) => {
    
    //Connecting to DB
    db.connect();
    
    //Retrieving parameters
    let params = [request.params.id]; //TODO - Convert if string
    if (exists(params)) {
        db.queryParams('DELETE FROM public.playlist WHERE id = $1', params, (result) => {
            response.writeHead(200, { 'Content-Type': 'text/html'});
            response.end('Album was deleted.');
        })
    } else {
        response.writeHead(402, { 'Content-Type': 'text/html'});
        response.end('ID does not exist.');
    }   
}

/** Returns boolean on the ID existance in DB
 * @param params - release's ID
 */
function exists(params) {
    db.queryParams('SELECT COUNT(*) FROM public.playlist WHERE id = $1', params, (result) => {
        if (result[0].count == 1) {
            return true;
        } else {
            return false;
        }
    })
}

module.exports = {
    getPlaylist,
    getAlbum,
    saveAlbum,
    removeAlbum
}