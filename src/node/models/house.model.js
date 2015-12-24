var mongoose = require('mongoose'),
    config = require('../../../config/main.config');

/**
 * This is the last piece of the puzzle. I need this to be loaded from the config file.
 * 
 */
var json = {}
for (var i in config.house ){
    json[i] = {};
    for (var x in config.house[i]) {
        json[i][x] = {}
        for (var key in config.house[i][x]) {
            if (typeof config.house[i][x][key] == 'string')
            json[i][x][key] = {type: String, default:config.house[i][x][key]}
            else if (typeof config.house[i][x][key] == 'number')
                json[i][x][key] = {type: Number, default:config.house[i][x][key]}

        }
    }

}
json['name'] = {type: String, unique: true, require: true}
json['volume'] = Number;
console.log(json['bedroom']['hall'])
var HouseSchema = new mongoose.Schema(json);

module.exports = mongoose.model('House', HouseSchema);