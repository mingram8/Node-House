/**
 * This file isn't going to have a bunch of comments. There is little to no
 * reason to change this file unless you don't want to use VLC or want to create
 * a huge speaker system.
 *
 *
 * NOW, where this could get interesting is if you had many speakers around
 * the house, and a raspberry pi plugged into each. You could say, modify
 * the Radio app to act as a music server too and send urls around for each to start
 * their own VLC servers and play the song at the same time using the config.radio file
 * as a base.
 */
var PlayMusic = require('playmusic'),
    pm = new PlayMusic(),
    spawn = require('child_process');
var User = require('../models/user.model.js');
var terminal = require('child_process').spawn('bash');
var http = require('http'),
    config = require('../../../config/main.config');


exports.render = function (req, res) {
    res.render('music', {
        title: 'Music'
    });
}
/**
 * Comes from your google config file. The first function will expose your masterToken.
 *
 * @param req
 * @param res
 * @param next
 */
exports.login = function (req, res, next) {
    config = require('../../../config/main.config');

    var masterToken;

    pm.login({
        email: config.google.gmail,
        password: config.google.password,
        androidId: config.google.androidId
    }, function (err, stuff) {
        console.log(stuff)
        if (err) {
            console.log(err)
        }
        else {
            masterToken = stuff.masterToken;
            pm.init({
                androidId: config.google.androidId,
                masterToken: masterToken
            }, function () {
                console.log('d')
                req.pm = pm;
                next()
            })
            if (err) console.error(err);
            // place code here
        }
    })


}

exports.search = function (req, res) {
    req.pm.search(req.body.search, 5, function (err, data) {
        res.send(data.entries);
    }, function (message, body, err, httpResponse) {
    });
}

exports.checkIP = function (req, res) {
    var ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    if (ip == "::1")
        res.send(false)
    else
        res.send(true)

}
/**
 * Grab the url of the song that was sent. If it came from the host, send just the
 * url. If it came from a client, play the song.
 *
 * Songs come in giant arrays. It really stores the playlist. If the client
 * wants to play a song from a record, it sends every remaining song on
 * the record. This is so users don't have to keep selecting songs.
 *
 * Also, it makes it easier to do thing like playlist and radio stations
 * since it is a built in function.
 *
 * @param req
 * @param res
 * @param next
 */
exports.getUrl = function (req, res, next) {
    var ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    if (req.body.song[req.body.index].track == undefined) {
        req.body.song[req.body.index].track = {
            nid: req.body.song[req.body.index].nid,
            artist: req.body.song[req.body.index].artist,
            title: req.body.song[req.body.index].title,
            durationMillis: req.body.song[req.body.index].durationMillis,
            albumArtRef: req.body.song[req.body.index].albumArtRef

        }
    }

    req.pm.getStreamUrl(req.body.song[req.body.index].track.nid, function (err, streamUrl) {
        if (ip == "::1" && req.body.next == undefined) {
            req.url = streamUrl
            process.SONG_PLAYING = true;
            next();
        }
        else {
            req.url = streamUrl
            process.SONG_PLAYING = true;
            next();

        }
    });

}

exports.playRadio = function (req, res) {
    pm.login({
        email: config.google.gmail,
        password: config.google.password,
        androidId: config.google.androidId
    }, function (err, stuff) {
        console.log(stuff)
        if (err) {
            console.log(err)
        }
        else {
            masterToken = stuff.masterToken;
            pm.init({
                androidId: config.google.androidId,
                masterToken: masterToken
            }, function () {
                req.pm = pm;
                req.pm.getStations(function (data, err) {
                    for (var i = 0; i < err.data.items.length; i++) {
                        console.log(err.data.items[i].name);
                        if (req.params.artist.toLocaleLowerCase().replace(/\s+/g, '').indexOf(err.data.items[i].name.toLocaleLowerCase().replace(/\s+/g, '')) >= 0) {
                            console.log(err.data.items[i])

                            req.pm.getStationTracks(err.data.items[i].id, 100, function (data, err) {
                                console.log(err)
                                console.log(err.data.stations[0].tracks[0])
                                req.body.song = err.data.stations[0].tracks;

                                req.pm.getStreamUrl(err.data.stations[0].tracks[0].nid, function (err, streamUrl) {
                                    req.url = streamUrl
                                    process.SONG_PLAYING = true;

                                    req.body.index = 0;
                                    exports.play(req, res);

                                });
                            })
                        }
                    }
                });

            })
            if (err) console.error(err);
            // place code here
        }
    })
}
/**
 * This doesn't work. Not sure why.
 *
 * @param req
 * @param res
 */
exports.createStation = function (req, res) {
    req.pm.createStation(req.body.name, req.body.stationId, function (err, data) {
        res.send({err: err, data: data});
    })
}
exports.getStationTracks = function (req, res) {
    req.pm.getStationTracks(req.body.stationId, req.body.tracks, function (data, err) {
        res.send({data: data, err: err});
    });
}
exports.getStations = function (req, res) {
    req.pm.getStations(function (data, err) {
        res.send({data: data, err: err});
    })
}
/**
 * Uses VLC http server to pause the song, grab how much time is left for
 * the new timeout
 *
 * @param req
 * @param res
 */
exports.pause = function (req, res) {
    clearTimeout(process.timeOut);
    console.log(process.nowTime);
    process.PAUSED = true;

    var timediff = new Date().getTime() - process.nowTime;
    console.log(timediff)
    process.timeLeft = process.totalTime - timediff;
    console.log(process.timeLeft)
    process.totalTime = process.timeLeft;
    var req = http.get('http://:password@localhost:8080/requests/status.xml?command=pl_pause', function (r) {
        r.on('data', function () { /* do nothing */
        });
    });
    res.send('su')

}
/**
 * Uses VLC http server to play the song, use how much is time left from
 * above to set the timeout.
 *
 * @param req
 * @param res
 */
exports.pressPlay = function (req, res) {
    process.nowTime = new Date().getTime();
    process.PAUSED = false;
    req.body.song = process.STORED_SONGS;
    req.body.index = process.STORED_INDEX + 1;

    var reqd = http.get('http://:password@localhost:8080/requests/status.xml?command=pl_play', function (r) {
        r.on('data', function () { /* do nothing */
        });
        r.on('error', function (err) { /* do nothing */
            console.log(err)
        });
    });
    process.timeOut = setTimeout(function () {
        spawn.exec('pkill vlc', function () {
            try {
                req.body.next = 1;
                if (req.body.song[req.body.index].track == undefined) {
                    req.body.song[req.body.index].track = {
                        nid: req.body.song[req.body.index].nid,
                        artist: req.body.song[req.body.index].artist,
                        title: req.body.song[req.body.index].title,
                        durationMillis: req.body.song[req.body.index].durationMillis,
                        albumArtRef: req.body.song[req.body.index].albumArtRef

                    }
                }
                if (req.body.index > req.body.song.length) {
                    process.SONG_PLAYING = false;
                    try {
                        res.send(req.url)
                    }
                    catch (e) {
                    }
                }
                else {
                    req.pm.getStreamUrl(req.body.song[req.body.index].track.nid, function (err, streamUrl) {
                        req.url = streamUrl;
                        process.CURRENT_SONG = req.body.song[req.body.index]
                        exports.play(req, res)
                    })
                }
            }
            catch (e) {
                console.log(e)
            }
        });
    }, process.timeLeft);

    res.send('su')
}
/**
 * Play the last song.
 *
 * @param req
 * @param res
 */
exports.rewind = function (req, res) {
    req.body.song = process.STORED_SONGS;
    req.body.index = process.STORED_INDEX - 1;
    spawn.exec('pkill vlc', function () {
        try {
            req.body.next = 1;
            if (req.body.song[req.body.index].track == undefined) {
                req.body.song[req.body.index].track = {
                    nid: req.body.song[req.body.index].nid,
                    artist: req.body.song[req.body.index].artist,
                    title: req.body.song[req.body.index].title,
                    durationMillis: req.body.song[req.body.index].durationMillis,
                    albumArtRef: req.body.song[req.body.index].albumArtRef

                }
            }
            if (req.body.index > req.body.song.length) {
                process.SONG_PLAYING = false;
                try {
                    res.send(req.url)
                }
                catch (e) {
                }
            }
            else {
                req.pm.getStreamUrl(req.body.song[req.body.index].track.nid, function (err, streamUrl) {
                    req.url = streamUrl;
                    process.CURRENT_SONG = req.body.song[req.body.index]
                    exports.play(req, res)
                })
            }
        }
        catch (e) {
            console.log(e)
        }
    });
}
/**
 * Play the next song.
 *
 * @param req
 * @param res
 */
exports.forward = function (req, res) {
    req.body.song = process.STORED_SONGS;
    req.body.index = parseInt(process.STORED_INDEX) + 1;
    spawn.exec('pkill vlc', function () {
        try {
            req.body.next = 1;
            if (req.body.song[req.body.index].track == undefined) {
                req.body.song[req.body.index].track = {
                    nid: req.body.song[req.body.index].nid,
                    artist: req.body.song[req.body.index].artist,
                    title: req.body.song[req.body.index].title,
                    durationMillis: req.body.song[req.body.index].durationMillis,
                    albumArtRef: req.body.song[req.body.index].albumArtRef

                }
            }
            if (req.body.index > req.body.song.length) {
                process.SONG_PLAYING = false;
                try {
                    res.send(req.url)
                }
                catch (e) {
                }
            }
            else {
                req.pm.getStreamUrl(req.body.song[req.body.index].track.nid, function (err, streamUrl) {
                    req.url = streamUrl;
                    process.CURRENT_SONG = req.body.song[req.body.index]
                    exports.play(req, res)
                })
            }
            res.send({song: req.body.song, index: req.body.index})
        }
        catch (e) {
        }
    });

};

exports.storedUrl = function (req, res) {
    res.send(process.STORED_URL)
}
/**
 *
 * Clear the timeout, spawn VLC with an http server so we can pause
 * and play, play the song, and set a timeout to play the next song when it ends.
 *
 * This is where I would change the function to send the url to a bunch of
 * raspberry pis to start their own VLC servers. Use this server as the master so
 * they are kept mostly in sync. So, instead of starting VLC, it would
 * loop through the config.radio file, doing an http request on each (posting the url)
 * and when the song has timed out, you would send a bunch http requests to stop the song, and
 * another to play the next. I don't know how to truly sync them unless you said hold off
 * until so many milliseconds from new Date().getTime() as http requests are asynchronous and
 * it would be quite annoying to hear a bunch of slightly off songs bounce around your
 * house.
 *
 * I would like to see that in action.
 *
 * @param req
 * @param res
 */
exports.play = function (req, res) {
    clearTimeout(process.timeOut);
    process.STORED_SONGS = req.body.song;
    process.STORED_INDEX = req.body.index;
    process.PAUSED = false;
    if (process.SONG_PLAYING == true) {
        spawn.exec('pkill vlc', function () {
            console.log(req.url)

            var term = spawn.spawn('vlc', ['-I', 'http', req.url, 'localhost:8080']);

        });
        if (req.body.song[req.body.index].track == undefined) {
            req.body.song[req.body.index].track = {
                nid: req.body.song[req.body.index].nid,
                artist: req.body.song[req.body.index].artist,
                title: req.body.song[req.body.index].title,
                durationMillis: req.body.song[req.body.index].durationMillis,
                albumArtRef: req.body.song[req.body.index].albumArtRef

            }
        }
        process.totalTime = parseInt(req.body.song[req.body.index].track.durationMillis) + 3000
        process.nowTime = new Date().getTime();

        process.CURRENT_SONG = req.body.song[req.body.index]
        console.log(parseInt(req.body.song[req.body.index].track.durationMillis) + 7000)
        process.STORED_URL = req.url
        process.timeOut = setTimeout(function () {
            spawn.exec('pkill vlc', function () {
                try {
                    process.totalTime = parseInt(req.body.song[req.body.index].track.durationMillis) + 3000
                    process.nowTime = new Date().getTime();
                    req.body.index += 1;
                    req.body.next = 1;
                    if (req.body.song[req.body.index].track == undefined) {
                        req.body.song[req.body.index].track = {
                            nid: req.body.song[req.body.index].nid,
                            artist: req.body.song[req.body.index].artist,
                            title: req.body.song[req.body.index].title,
                            durationMillis: req.body.song[req.body.index].durationMillis,
                            albumArtRef: req.body.song[req.body.index].albumArtRef

                        }
                    }
                    if (req.body.index > req.body.song.length) {
                        process.SONG_PLAYING = false;
                        try {
                            res.send(req.url)
                        }
                        catch (e) {
                        }
                    }
                    else {
                        req.pm.getStreamUrl(req.body.song[req.body.index].track.nid, function (err, streamUrl) {
                            req.url = streamUrl;
                            process.CURRENT_SONG = req.body.song[req.body.index]
                            exports.play(req, res)
                        })
                    }
                }
                catch (e) {
                    console.log(e)
                }
            });
        }, parseInt(req.body.song[req.body.index].track.durationMillis) + 3000);

    }
    try {
        res.send(req.url)
    }
    catch (e) {
    }
}
exports.getArtist = function (req, res) {
    console.log(req.body.artist.artist)
    req.pm.getArtist(req.body.artist.artist.artistId, true, 2, 2, function (err, artist) {
        console.log(artist)
        res.send(artist)
    });


}
exports.getAlbum = function (req, res) {
    pm.getAlbum(req.body.albumId, true, function (err, album) {
        console.log(album)
        res.send(album)
    });


}
exports.getSong = function (req, res) {
    res.json({
        play: process.SONG_PLAYING,
        paused: process.PAUSED,
        song: process.CURRENT_SONG,
        on: {
            coffee: process.COFFEE_ON,
            bedroom: process.BEDROOM_ON,
            bedroom2: process.BEDROOM2_ON,
            brightness: process.BEDROOM2_BRIGHTNESS,
            christmas: process.CHRISTMAS_ON
        }
    });
}
/**
 * Kill VLC, that will stop the song.
 *
 * @param req
 * @param res
 */
exports.stopSong = function (req, res) {
    clearTimeout(process.timeOut);
    process.SONG_PLAYING = false;
    spawn.exec('pkill vlc', function () {
    });
    res.send('Success')
}
