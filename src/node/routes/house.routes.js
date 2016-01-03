var house = require('../controllers/house.controller.js');
var button = require('../controllers/button.controller.js');
var authController = require('../controllers/auth.controller.js')
var intercom = require('../controllers/intercom.controller.js');
var buttons = require('../controllers/button.controller.js');
var lights = require('../controllers/lights.controller.js');


module.exports = function(app) {
    app.get('/toggleLights/:zone/:zone2/:on', lights.toggleLights)
    app.get('/changeLights/:zone/:zone2/:hue', lights.changeLights)
    app.get('/makeWhite/:zone/:zone2', lights.lightsWhite)
    app.get('/brightness/:zone/:zone2/:percent', lights.brightness)
    app.post('/codesend/', house.codeSend);
    app.get('/getWeather', house.getWeather);
    app.post('/sendVoice', authController.isAuthenticated, house.sendVoice)
    app.post('/returnHouse', house.returnHouse);

    app.post('/getHouse', house.getHouse);
    app.route('/newHouse').post(house.newHouse);
    app.post('/deleteHouse', house.deleteHouse)
    app.post('/updateHouseExternal', authController.isAuthenticated, house.updateHouseExternal)

    app.post('/newButton', button.newButton);
    app.post('/removeButton', button.removeButton);
    app.post('/findButtons', button.findButtons);

    app.get('/volumeUp', house.volumeUp);
    app.get('/volumeDown', house.volumeDown);
    app.get('/setVolume/:volume', house.volumeSet)

    app.get('/playWhiteNoise', authController.isAuthenticated, intercom.playWhitenoise)

    app.post('/getRecording', authController.isAuthenticated, intercom.getRecording)
    app.get('/sendRecording',authController.isAuthenticated, intercom.sendRecording)

    app.get('/getButtons', authController.isAuthenticated, buttons.createButtons )

}