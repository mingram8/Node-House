var WifiBoxModule = require('./wifibox.js'),
    utils = require('./utils.controller.js'),
    cmd = require('./commands.js'),
    House = require('../models/house.model.js'),
    houseController = require('./house.controller'),
    config = require('../../../config/main.config'),
    time = null,
    box = [];
exports.updateLights = function() {
    config = require('../../../config/main.config');
    if (config.lights != undefined) {
        for (var i = 0; i < config.lights.boxes.length; i++)
            box.push(new WifiBoxModule(config.lights.boxes[i].box_ip, config.lights.boxes[i].box_port));
    }

}
exports.updateLights();
exports.returnLights = function(req,res) {
    config = require('../../../config/main.config');

    if (config.lights != undefined) {
        res.send(config.lights)
    }
    else {
        res.send('none')
    }
}
/**
 * Toggle on and off the lights and save it to mongo so that
 * the other tablets/slaves are aware of the change. This
 * one is tricky because the lights are cheap. They often
 * just ignore the on/off command so I send it multiple
 * times. It works every time then. The on command technically
 * doubles as a focus command so I think that may be the problem.
 *
 *
 * @param req.params.zone  (i.e. bedroom)
 * @param req.params.zone2 (i.e. lamp)
 * @param req.params.on (or off, really on or any string/number)
 * @param res
 *
 * TODO: I would rather this just come from the current state of the house. Remove on/off
 *
 */
exports.toggleLights = function (req, res) {
    config = require('../../../config/main.config');

    var light = config.house[req.params.zone][req.params.zone2];
    if (req.params.on == 'on') {
        box[light.boxNumber].command(cmd.rgbw.on(light.zoneNumber));
        box[light.boxNumber].command(cmd.rgbw.on(light.zoneNumber));
        box[light.boxNumber].command(cmd.rgbw.on(light.zoneNumber));
        box[light.boxNumber].command(cmd.rgbw.on(light.zoneNumber));
        box[light.boxNumber].command(cmd.rgbw.on(light.zoneNumber));
        box[light.boxNumber].command(cmd.rgbw.on(light.zoneNumber));
        House.findOne({name: 'house'}, function (err, house) {
            house[req.params.zone][req.params.zone2].on ='true';
            houseController.updateHouse(house);
            try {
                res.send('success')
            }
            catch (e) {
            }
        })
    }
    else {
        box[light.boxNumber].command(cmd.rgbw.off(light.zoneNumber));
        box[light.boxNumber].command(cmd.rgbw.off(light.zoneNumber));
        box[light.boxNumber].command(cmd.rgbw.off(light.zoneNumber));
        box[light.boxNumber].command(cmd.rgbw.off(light.zoneNumber));
        box[light.boxNumber].command(cmd.rgbw.off(light.zoneNumber));
        box[light.boxNumber].command(cmd.rgbw.off(light.zoneNumber));

        House.findOne({name: 'house'}, function (err, house) {
            house[req.params.zone][req.params.zone2].on = 'false';
            console.log(house)
            houseController.updateHouse(house);
            try {
                res.send('success')
            }
            catch (e) {
            }
        })
    }
}
/**
 * Change the color of the lights back to white and save it to mongo so that
 * the other tablets/slaves are aware of the change.
 *
 * @param req.params.zone  (i.e. bedroom)
 * @param req.params.zone2 (i.e. lamp)
 * @param res
 */
exports.lightsWhite = function (req, res) {
    config = require('../../../config/main.config');

    var light = config.house[req.params.zone][req.params.zone2];
    box[light.boxNumber].command(cmd.rgbw.whiteMode(light.zoneNumber));
    House.findOne({name: 'house'}, function (err, house) {
        house[req.params.zone][req.params.zone2].color =0;
        houseController.updateHouse(house);
        try {
            res.send('success')
        }
        catch (e) {
        }
    })
}
/**
 * Change the brightness of the lights and save it to mongo so that
 * the other tablets/slaves are aware of the change.
 *
 * @param req.params.zone  (i.e. bedroom)
 * @param req.params.zone2 (i.e. lamp)
 * @param req.params.percent (1-100)
 * @param res
 */
exports.brightness = function (req, res) {
    config = require('../../../config/main.config');

    var light = config.house[req.params.zone][req.params.zone2];
    box[light.boxNumber].command(cmd.rgbw.on(light.zoneNumber));
    box[light.boxNumber].command(cmd.rgbw.brightness(parseInt(req.params.percent)));
    House.findOne({name: 'house'}, function (err, house) {
        house[req.params.zone][req.params.zone2].brightness = parseInt(req.params.percent);
        houseController.updateHouse(house);
        try {
            res.send('success')
        }
        catch (e) {
        }
    })


}
/**
 * Change the color of the lights and save it to mongo so that
 * the other tablets/slaves are aware of the change.
 *
 * @param req.params.zone  (i.e. bedroom)
 * @param req.params.zone2 (i.e. lamp)
 * @param req.params.hue (1-100, things get wonky when using 255)
 * @param res
 */
exports.changeLights = function (req, res) {
    config = require('../../../config/main.config');

    var light = config.house[req.params.zone][req.params.zone2];

    console.log(parseInt(req.params.percent))
    box[light.boxNumber].command(cmd.rgbw.on(light.zoneNumber));
    box[light.boxNumber].command(cmd.rgbw.hue(parseInt(req.params.hue)));

    House.findOne({name: 'house'}, function (err, house) {
        house[req.params.zone][req.params.zone2].color = parseInt(req.params.hue);
        houseController.updateHouse(house);
        try {
            res.send('success')
        }
        catch (e) {
        }
    })
}