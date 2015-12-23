var radio = require('../controllers/radio.controller.js');

module.exports = function(app) {
    app.post('/newRadio', radio.newRadio)
}