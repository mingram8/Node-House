var stock = require('../controllers/stock.controller.js');
var authController = require('../controllers/auth.controller.js');

module.exports = function(app) {
    app.get('/getStocks', stock.stocks);


}