var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

app.controller('MusicController', function ($scope, $http, $sce, $interval) {
    $scope.currentSong = {playing:false, playingExternal:false}
    $scope.general = false;
    $scope.artist = false;
    $scope.album = false;
    $scope.artistContainer = true;
    $scope.albumContainer = true;
    $scope.trackContainer = true;
    $scope.lastFrame = [];
    $scope.playButton = true;
   if (getUrlParameter('search')!=undefined) {

       $http({method: 'post', url: '/search', data: {search:getUrlParameter('search')}}).
           success(function (data) {
               $scope.results = [];
               $scope.albums = [];
               $scope.artists = [];
               $scope.general = true;
               $scope.artist = false;
               $scope.album = false;
               for (var i=0; i < data.length; i++) {
                   if (data[i].track != undefined )
                       $scope.results.push(data[i]);

                   if (data[i].album != undefined )
                       $scope.albums.push(data[i]);

                   if (data[i].artist != undefined )
                       $scope.artists.push(data[i]);
               }
               //  $scope.lastFrame = $scope.currentFrame;
               $scope.lastFrame.push('general');
               console.log( $scope.lastFrame)
               $scope.playExternal($scope.results, $scope.results[0])
           })
   }
    $scope.createStation = function(){
            $http({method: 'post', url: '/search', data: {search: $scope.search}}).
                success(function (data) {
                    $http({method: 'post', url: '/createStation', data: {name: $scope.search, stationId: data[0].artist.artistId}}).success(function (data) {
                        console.log(data);
                });
        });
    }
    $scope.openStation = function(station){
        $http({method: 'post', url: '/getStationTracks', data: {stationId: station.id, tracks:100}}).success(function (data) {
            $scope.playExternal(data.err.data.stations[0].tracks, data.err.data.stations[0].tracks[0])
        });
    }
    $scope.searchMusic = function () {
        $http.get('/getStations').success(function(data){
            $scope.stations = data.err;
        });
        $http({method: 'post', url: '/search', data: {search: $scope.search}}).
            success(function (data) {
                $scope.results = [];
                $scope.albums = [];
                $scope.artists = [];
                $scope.general = true;
                $scope.artist = false;
                $scope.album = false;
                for (var i=0; i < data.length; i++) {
                    if (data[i].track != undefined ) {
                        data[i].track.artist = {artist: data[i].track.artist, artistId: data[i].track.artistId[0]}
                        $scope.results.push(data[i]);
                    }

                    if (data[i].album != undefined )
                        $scope.albums.push(data[i]);

                    if (data[i].artist != undefined )
                        $scope.artists.push(data[i]);
                }
              //  $scope.lastFrame = $scope.currentFrame;
                $scope.lastFrame.push('general');
                $scope.showBack = true;
            })
    }
    $scope.back = function() {
        if ($scope.lastFrame.length >1)
       $scope.lastFrame.pop()
        else
        $scope.showBack = false;

        switch ($scope.lastFrame[$scope.lastFrame.length-1]) {
            case 'artist':
                $scope.artist = true;
                $scope.general = false;
                $scope.album = false;
                break;
            case 'album':
                $scope.album = true;
                $scope.artist = false;
                $scope.general = false;
                break;
            case 'general':
                $scope.general = true;
                $scope.artist = false;
                $scope.album = false;
                break;
        }
    }

    $scope.pause = function() {
        $http.get('/pressPause', function(){});

    }
    $scope.play = function() {
        $http.get('/pressPlay', function(){});

    }
    $scope.rewind = function() {
        $http.get('/pressRewind', function(){});

    }
    $scope.forward = function() {
        $http.get('/pressForward', function(){});

    }
    $scope.openArtist = function(artist) {
        console.log(artist)
        $http({method: 'post', url: '/getArtist', data: {artist: artist}}).success(function(data){
            $scope.artist = true;
            $scope.general = false;
            $scope.album = false;
            $scope.artistResult = data;
            console.log(data)
            $scope.lastFrame.push('artist');
            $scope.showBack = true;

        });
    }
    $scope.goHome = function() {
        $scope.$parent.homePage = true;
        $scope.$parent.musicPage = false;
    }
    $scope.openAlbum = function(album) {
        console.log(album)
        $http({method: 'post', url: '/getAlbum', data: {albumId: album}}).success(function(data){
            $scope.album = true;
            $scope.artist = false;
            $scope.general = false;
            $scope.albumResult = data;
          //  $scope.lastFrame = $scope.currentFrame;
            $scope.lastFrame.push('album');
            $scope.showBack = true;
        });
    }
    $scope.checkIP = function(song) {
        $http.get('/checkIP').success(function (data) {
            if (data == false) {
                $scope.playExternal($scope.results, song)
            }
            else {
                $scope.playExternal($scope.results, song);
            }
        })
        }
    $interval(function() {
        $http.get('/getSong').success(function (data) {
            if (data.play === true) {
                $scope.currentSong.playingExternal = true;
                $scope.currentSong.track = data.song.track;
                $scope.currentSong.album = data.song.album;
                $scope.currentSong.albumId = data.song.albumId

                console.log(data.song)
                $scope.currentSong.artist= {artistId:data.song.artistId[0]}
            }
            else {
                $scope.currentSong.playingExternal = false;

            }
        })

        }, 1000)
    $scope.playExternal = function(results, song) {
        $scope.currentSong.track = song.track;
        $scope.currentSong.playingExternal = true;
        $scope.currentSong.playing = false;
        $http({method: 'post', url: '/playSong', data: {
            song: results,
            index: $scope.matchSong(results, song)}}).
            success(function (url) {
                    $scope.currentSong.playing = true;
                    $scope.currentSong.playingExternal = false;
                    $scope.currentSong.track = song.track;
                    $scope.currentSong.url = $sce.trustAsResourceUrl(url);
            })
    }
    $scope.playLocal = function(song) {
        $http({method: 'post', url: '/getUrl', data: {song: song}}).
            success(function (url) {
                $scope.currentSong.playing = true;
                $scope.currentSong.playingExternal = false;
                $scope.currentSong.track = song.track;
                $scope.currentSong.url = $sce.trustAsResourceUrl(url);
            })
    }
    $scope.matchSong = function(results, song) {
        console.log(song)
        for (var i=0; i <results.length; i++) {
            if (results[i] == song) {
                return i;
            }
        }
    }
    $scope.killSong = function() {
        if ( $scope.timeOut)
            clearTimeout( $scope.timeOut)
        $http.get('/stopSong').success(function (data) {
            $scope.currentSong.playingExternal = false;

        });
    }
});
