var WifiBoxModule = require('./wifibox.js'),
    utils = require('./utils.controller.js'),
    cmd = require('./commands.js'),
    http = require('http'),
    House = require('../models/house.model.js'),
    houseController = require('./house.controller'),
    config = require('../../../config/main.config'),
    time = null,
    box = [];
try {
   var dash_button = require('node-dash-button');
}
catch (e) {
}

if (config.lights != undefined) {
    for (var i = 0; i < config.lights.boxes.length; i++)
        box.push(new WifiBoxModule(config.lights.boxes[i].box_ip, config.lights.boxes[i].box_port));
}
exports.loadDash = function() {
    config = require('../../../config/main.config');

    if (config.dash != undefined) {
        var dashArray = [];

        for (var i = 0; i < config.dash.length; i++) {
            dashArray.push(config.dash[i].id);
            console.log('dash')

        }
        console.log('dash')

        console.log(dashArray)
        var dash = dash_button(dashArray)

        dash.on("detected", function (dash_id) {
            console.log(dash_id);
            /**
             * What we do is load our house object so we can figure out what is on and off, then
             * we determine whether the button is a light or not, and then enact a toggle option on it.
             * We do a time check because often the buttons will send a couple mac address handshakes
             * in a row and we want them to be weeded out. This part can be kind of confusing to read
             */
            House.findOne({name: 'house'}, function (err, house) {
                var timeDiff = parseInt(new Date().getTime()) - time;
                time = parseInt(new Date().getTime());
                for (var i = 0; i < config.dash.length; i++) {
                    if (config.dash[i].type == 'light') {
                        /*if the id matches and the zone is off, AND it has been over 2 seconds since
                         a button was detected OR it is the first time running, then turn the
                         light on
                         */
                        if (dash_id === config.dash[i].id &&
                            house[config.dash[i].zone[0]][config.dash[i].zone[1]].on == 'false' &&
                            timeDiff > 2000) {
                            house[config.dash[i].zone[0]][config.dash[i].zone[1]].on = 'true';
                            houseController.updateHouse(house);
                            //I call it a bunch because the lights kind of suck and will miss them
                            box[utils.getBoxNumber(config.dash[i].zone)].command(cmd.rgbw.on(utils.getZoneNumber(config.dash[i].zone)));
                            box[utils.getBoxNumber(config.dash[i].zone)].command(cmd.rgbw.on(utils.getZoneNumber(config.dash[i].zone)));
                            box[utils.getBoxNumber(config.dash[i].zone)].command(cmd.rgbw.on(utils.getZoneNumber(config.dash[i].zone)));
                            box[utils.getBoxNumber(config.dash[i].zone)].command(cmd.rgbw.on(utils.getZoneNumber(config.dash[i].zone)));
                            box[utils.getBoxNumber(config.dash[i].zone)].command(cmd.rgbw.on(utils.getZoneNumber(config.dash[i].zone)));
                            return false;
                        }
                        else if (dash_id === config.dash[i].id &&
                            house[config.dash[i].zone[0]][config.dash[i].zone[1]].on == 'true' &&
                            timeDiff > 2000) {
                            house[config.dash[i].zone[0]][config.dash[i].zone[1]].on = 'false';
                            houseController.updateHouse(house);
                            box[utils.getBoxNumber(config.dash[i].zone)].command(cmd.rgbw.off(utils.getZoneNumber(config.dash[i].zone)));
                            box[utils.getBoxNumber(config.dash[i].zone)].command(cmd.rgbw.off(utils.getZoneNumber(config.dash[i].zone)));
                            box[utils.getBoxNumber(config.dash[i].zone)].command(cmd.rgbw.off(utils.getZoneNumber(config.dash[i].zone)));
                            box[utils.getBoxNumber(config.dash[i].zone)].command(cmd.rgbw.off(utils.getZoneNumber(config.dash[i].zone)));
                            box[utils.getBoxNumber(config.dash[i].zone)].command(cmd.rgbw.off(utils.getZoneNumber(config.dash[i].zone)));
                            box[utils.getBoxNumber(config.dash[i].zone)].command(cmd.rgbw.off(utils.getZoneNumber(config.dash[i].zone)));
                            return false;
                        }
                    }
                    else if (config.dash[i].type == 'radio') {
                        var codes = utils.getRadioCodes(config.dash[i].zone);
                        console.log(codes)
                        /*
                         Same thing but just with a radio code instead of lights
                         */
                        if (dash_id === config.dash[i].id &&
                            house[config.dash[i].zone[0]][config.dash[i].zone[1]].on == 'false' &&
                            timeDiff > 2000 || timeDiff != timeDiff) {
                            house[config.dash[i].zone[0]][config.dash[i].zone[1]].on = 'true';
                            houseController.updateHouse(house);
                            console.log('true')
                            //I call it a bunch because the lights kind of suck and will miss them
                            for (var i = 0; i < config.radio.boxes.length; i++) {
                                var req = http.get(config.radio.boxes[i].ip + ':' + config.radio.boxes[i].port + '/radio/' + codes.on, function (r) {
                                    r.on('data', function () { /* do nothing */
                                    });
                                });

                                req.on('error', function (err) {
                                    console.log('ERROR: ' + err)
                                });
                                req.end();
                            }
                            return false;

                        }
                        else if (dash_id === config.dash[i].id &&
                            house[config.dash[i].zone[0]][config.dash[i].zone[1]].on == 'true' &&
                            timeDiff > 2000 || timeDiff != timeDiff) {
                            house[config.dash[i].zone[0]][config.dash[i].zone[1]].on = 'false';
                            console.log('false')
                            houseController.updateHouse(house);
                            for (var i = 0; i < config.radio.boxes.length; i++) {
                                var req = http.get(config.radio.boxes[i].ip + ':' + config.radio.boxes[i].port + '/radio/' + codes.off, function (r) {
                                    r.on('data', function () { /* do nothing */
                                    });
                                });

                                req.on('error', function (err) {
                                    console.log('ERROR: ' + err)
                                });
                                req.end();
                            }
                            return false;

                        }
                    }
                }

            });
        })
    }
}
exports.loadDash();
exports.returnDashButtons = function(req, res) {
        config = require('../../../config/main.config');

        if (config.dash)
        res.send(config.dash)
        else
        res.send('none')
    }



