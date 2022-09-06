const db = require('./db');

/** Retrieves all albums */
const getPlaylist = (request, response) => {
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
    db.connect();
    let params = [request.params.id]; //TO VERIFY
    db.queryParams('SELECT id, title, artist, master_id, master_url, genre, playlist_name ' +
                    'FROM public.playlist WHERE id=$1', params, (result) => {
        let JSONObject = result;
        let JSONObjectString = JSON.stringify(JSONObject, null, 4);

        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSONObjectString);
    })
    // db.disconnect(); //TO DO
}

/** Adds album to DB */
const saveAlbum = (request, response) => {
    db.connect();
    const { title, artist, master_id, master_url, genre, playlist_name } = request.body;
    let params = [title, artist, master_id, master_url, genre, playlist_name];
    db.queryParams("INSERT INTO public.playlist (title, artist, master_id, master_url, genre, playlist_name)" +
                    "VALUES ($1, $2, $3, $4, $5, $6) RETURNING *", params, (result) => {
        
        let title = result[0].title;
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(title + ' was added!');
    });
}

/** Removes album from DB */
const removeAlbum = (request, response) => {
    db.connect();
    let params = [request.params.id]; //TODO - Convert if string
    db.queryParams('DELETE FROM public.playlist WHERE id = $1', params, (result) => {
    
        response.writeHead(200, { 'Content-Type': 'text/html'});
        response.end('Album was deleted');
    })
}

module.exports = {
    getPlaylist,
    getAlbum,
    saveAlbum,
    removeAlbum
}