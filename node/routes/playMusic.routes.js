var music = require('../controllers/playMusic.controller.js');

module.exports = function(app) {
    app.get('/music', music.render);
    app.get('/checkIP', music.checkIP);
    app.route('/search').post(music.login, music.search);
    app.route('/getArtist').post(music.login, music.getArtist);
    app.route('/getAlbum').post(music.login, music.getAlbum);
    app.route('/getUrl').post(music.login, music.getUrl);
    app.route('/playSong').post(music.login, music.getUrl, music.play);
    app.get('/playRadio/:artist', music.playRadio);

    app.get('/checkIP', music.checkIP);
    app.get('/stopSong', music.stopSong);
    app.get('/getSong', music.getSong);
    app.get('/storedUrl', music.storedUrl);
    app.get('/pressRewind',music.login, music.rewind);
    app.get('/pressForward',music.login, music.forward);
    app.get('/pressPlay', music.login, music.pressPlay);
    app.get('/pressPause', music.login, music.pause);

    app.post('/createStation', music.login, music.getStationTracks)
    app.get('/getStations', music.login, music.getStations)
    app.post('/getStationTracks', music.login, music.getStationTracks)

}