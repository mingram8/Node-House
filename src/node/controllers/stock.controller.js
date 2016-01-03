var http = require('http'),
    config = require('../../../config/main.config');

var stockJson = {};
/**
 * Returns the price. Have to use callbacks because the request takes a
 * little bit of time.
 *
 * @param symbol
 * @param fun
 */
exports.getQuotes = function(symbol,i, fun) {
    var r =http.get('http://finance.yahoo.com/webservice/v1/symbols/'+symbol+'/quote?format=json', function(response){
      //  json.chkr.price = data.resources[0].price
        var json;
        response.setEncoding('utf8');
        response.on('data', function (chunk) {
            try {
                json = JSON.parse(chunk).list.resources[0].resource.fields.price;
            }
            catch(e){}
        });
        response.on('error', function(chunk) {

        })
        response.on('end', function () {
            try {
                fun(json,i);

            }
            catch(e){}
        })
    });
    r.on('error', function(err){
    });
    r.end();


}
/**
 * This is what the client actually hits to get the quotes.
 * @param req
 * @param res
 */
exports.stocks = function(req, res) {
    res.send(stockJson)

}
exports.returnStocks = function(req, res) {
    config = require('../../../config/main.config');

    res.send(config.stocks)
}
setInterval(function(){exports.getStocks()},20000);
/**
 * All these requests takes a long time to go all the way through
 * (20 or so seconds combined), so we use a timer instead
 * of hitting it directly.
 */
exports.getStocks = function() {
    config = require('../../../config/main.config');

    for (var i=0; i < config.stocks.length; i ++) {
        exports.getQuotes(config.stocks[i], i, function (price,i) {
            stockJson[config.stocks[i]] = price;
        });
    }
}
exports.getStocks();
