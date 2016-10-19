var config = require('../../../config/main.config');

/**
 * Get the zone number for mi light zone. Does up to 3 params deep, don't do more than that.
 * Examples: masterBedroom.light
 * don't do, upstairs.bedroom.light
 *
 *
 * @param params
 * @returns {*}
 */
exports.getZoneNumber = function(params) {
    config = require('../../../config/main.config');

    console.log(params)
    if (params.length == 1)
        return config.house[params[0]].zoneNumber
    else if (params.length == 2)
        return config.house[params[0]][params[1]].zoneNumber
    else if (params.length == 3)
        return config.house[params[0]][params[1]][params[2]].zoneNumber
}
/**
 * Get the MiLight box number of the zone.
 *
 * @param params
 * @returns {*}
 */
exports.getBoxNumber = function(params) {
    config = require('../../../config/main.config');

    console.log(params)
    if (params.length == 1)
        return config.house[params[0]].boxNumber
    else if (params.length == 2)
        return config.house[params[0]][params[1]].boxNumber
    else if (params.length == 3)
        return config.house[params[0]][params[1]][params[2]].boxNumber
}
/**
 * Get the radio codes (on/off) of the zone.
 *
 * @param params
 * @returns {*}
 */
exports.getRadioCodes = function(params) {
    config = require('../../../config/main.config');

    if (params.length == 1)
        return {on:config.house[params[0]].code_on.boxNumber,off:config.house[params[0]].code_off}
    else if (params.length == 2)
        return {on:config.house[params[0]][params[1]].code_on, off:config.house[params[0]][params[1]].code_off}
    else if (params.length == 3)
        return {on:config.house[params[0]][params[1]][params[2]].code_on, off:config.house[params[0]][params[1]][params[2]].code_off}
}