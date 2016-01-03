var http = require('http'),
    User = require('../models/user.model.js'),
    utils = require('./utils.controller.js'),
    WifiBoxModule = require('./wifibox.js'),
    House = require('../models/house.model.js'),
    spawn = require('child_process'),
    YQL = require('yql'),
    config = require('../../../config/main.config'),
    time = null,
    totalTimes = 0,
    buttononis = require('../controllers/dash.controller')
    box = []

if (config.lights != undefined) {
    for (var i = 0; i < config.lights.boxes.length; i++)
        box.push(new WifiBoxModule(config.lights.boxes[i].box_ip, config.lights.boxes[i].box_port));
}
/**
 * Check weather every 1 min and check the precipitation every 5 minutes
 * Every 5 minutes keeps you under weather undergrounds max 500 requests a day (or they shut it
 * off for 24 hours)
 *
 * 60/5 = (12) * 24 = 288. You could do a request every 3.5 minute (210000 milliseconds)
 * and still be ok. I reset the server a ton when I am working on it and since it makes a request
 * every time it boots, you can see why I keep it at 288.
 *
 */
getWeather();
getPrecip();
var weatherTimer = setInterval(function () {
    getWeather()
}, 60000);
var weatherTimer = setInterval(function () {
    getPrecip()
}, 300000);

/**
 * Get the current weather and 5 day forecast. I use this just for temperature, forecast, and sunsets/rises. You could display temp, wind chill, humidity, pressure,
 * wind speed, and etc... I just don't care about it, personally, but it will gather it.
 */
function getWeather() {
    try {
        var query = new YQL('select * from weather.forecast where (location = '+config.weather.zipcode+')');
        query.exec(function (err, data) {
            try {
                var condition = data.query.results.channel;
                process.WEATHER = condition;


            }
            catch (e) {
            }
        });

    }
    catch (e) {
    }


}
/**
 * Get if it is raining, storming, snowing, and etc.. I use this to change
 * the background of my clients.
 *
 */
function getPrecip() {
    console.log('having a go')
    try {
        var chunksss = []
        var req = http.get('http://api.wunderground.com/api/'+config.weather.weather_underground_key+'/conditions/q/'+config.weather.state+'/'+config.weather.city+'.json', function (r) {
            r.on('data', function (chunks) { /* do nothing */
                chunksss += chunks;
            });
            r.on('end', function (err) {
                var json = JSON.stringify(chunksss)
                process.precip = chunksss;
            });
        });

        req.on('error', function (err) {
            console.log('ERROR: ' + err)
        });

        req.end();
    }
    catch (e) {
        console.log(e)
    }
}

exports.sendVoice = function(req, res) {
    console.log(req.body.voice)
    res.send('anything')
}
/**
 * Delete the house in case you really screwed up. I would disconnect or remove
 * this when you are set.
 *
 * @param req
 * @param res
 */
exports.deleteHouse = function (req, res) {
    House.remove({name: req.body.name}, function (err, house) {
        res.send('success')
    });

}

/**
 * Only works on Linux. Will turn volume up.
 *
 * @param req
 * @param res
 */
exports.volumeUp = function (req, res) {
    spawn.exec("amixer sset 'Master' 1%+");

    res.send('success');

}
/**
 * Only works on Linux. Will turn volume down.
 *
 * @param req
 * @param res
 */
exports.volumeDown = function (req, res) {
    spawn.exec("amixer sset 'Master' 1%-");
    res.send('success');

}
/**
 * Only works on Linux. Will set volume to value.
 * Useful for using the volume slider.
 *
 * @param req
 * @param res
 */
exports.volumeSet = function (req, res) {
    spawn.exec("amixer sset 'Master' " + req.params.volume + "%");
    House.findOne({name: 'house'}, function (err, house) {
        house.volume = req.params.volume;
        exports.updateHouse(house);
    });
    res.send('success');
}

exports.getWeather = function (req, res) {

    res.json({weather: {weather: process.WEATHER, precip: process.precip}, forecast: process.WEATHER})
}

/**
 * Returns the house object
 *
 * @param req
 * @param res
 */
exports.getHouse = function (req, res) {
    House.findOne({name: req.body.name}, function (err, house) {
        res.send(house)
    });
}
/**
 * Updates just what changed. Due to the complex nature, I end up just copying
 * and resetting the the whole thing since json[obj][obj].on throws and undefined
 * error and json[obj] ={};json[obj[obj]= {}; json[obj][obj].on = true will
 * overrwrite brightness and color to their default value
 *
 * @param json
 */
exports.updateHouse = function(json) {
    House.update({}, {$set: json}, function(house){
        console.log(house)
    });
}
/**
 * Creates a new house. Name has to be different. Mostly just for setting
 * it the first time and moving on
 *
 * @param req
 * @param res
 */
exports.newHouse = function (req, res) {
    var house = new House({
        name: req.body.name
    });
    house.save(function (err) {
        if (err)
            res.send(err);

        else {
            res.json({message: 'New house'});
        }
    });
};
/**
 * Send radio codes to all the radio transmitters around the house. I have a few
 * raspberry pis doing this.
 *
 * @param req
 * @param res
 */
exports.codeSend = function (req, res) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    var r = req;
    var codes = utils.getRadioCodes(req.body.device);
    House.findOne({name: 'house'}, function (err, house) {
        var code;
        if (house[r.body.device[0]][r.body.device[1]].on == 'false') {
            house[r.body.device[0]][r.body.device[1]].on = "true";
            exports.updateHouse(house);
            code = codes.on;
        }
        else {
            house[r.body.device[0]][r.body.device[1]].on = "false";
            exports.updateHouse(house);
            code = codes.off;
        }


        for (var i=0; i < config.radio.boxes.length; i++) {
            console.log(config.radio.boxes[i].ip+':'+config.radio.boxes[i].port +'/radio/'+ code)
            var req = http.get(config.radio.boxes[i].ip+':'+config.radio.boxes[i].port +'/radio/'+ code, function (r) {
                r.on('data', function () { /* do nothing */
                });
            });

            req.on('error', function (err) {
                console.log('ERROR: ' + err)
            });
            req.end();
        }
        res.send('success')
    })
}