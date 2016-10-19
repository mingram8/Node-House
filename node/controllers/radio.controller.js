var http = require('https');
var Radio = require('../models/radio.model.js');

exports.newRadio = function(req, res) {
    var radio = new Radio({
        zone: req.body.zone,
        code_on: parseInt(req.body.on),
        code_off: parseInt(req.body.off)
    });
    radio.save(function (err) {
        if (err)
            res.send(err);

        else {
            res.json({message: 'New radio'});
        }
    });
}

exports.getRadio = function(zone) {
    Radio.findOne({zone: zone}, function (err, radio) {
        return radio
    });
}