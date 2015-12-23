var http = require('http'),
    express = require('./config/express'),
    fs = require('fs'),
    sslkey = fs.readFileSync('sslcerts/key.pem'),
    sslcert = fs.readFileSync('sslcerts/cert.pem'),
    passport = require('./config/passport'),
    credentials = {key: sslkey, cert: sslcert},
    dgram = require('dgram')
var BinaryServer = require('binaryjs').BinaryServer;
var fs = require('fs');
var wav = require('wav');
var outFile = 'demo.wav';
process.COFFEE_ON = false;
process.BEDROOM_ON = false;
process.BEDROOM2_ON = false;
process.BEDROOM2_BRIGHTNESS = 100;
process.CHRISTMAS_ON = false;
var WifiBoxModule = require('./src/node/controllers/wifibox.js');
var cmd = require('./src/node/controllers/commands.js');
var box = new WifiBoxModule("192.168.86.114", 8899);express();
var app = express();
var passport = passport();
var httpServer = http.createServer(app);

httpServer.listen(2000);


module.exports = app;
console.log('Server running');


