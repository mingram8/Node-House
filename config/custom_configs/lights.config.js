/**
 * Array of MiLight hubs. boxNumber will start at 0 because that is how
 * arrays work. So, if a light is box 0, zone 1. It will mean the first
 * zone from the first entry in this array. You could use a different
 * hub and change the command.js and wifibox.js files to use your
 * own api.
 *
 * @type {{boxes: *[]}}
 */
module.exports = {
    boxes: [
        {
            box_ip: "ip_address",
            box_port: 8899
        },
        {
            box_ip: "ip_address",
            box_port: 8899
        },
        {
            box_ip: "ip_address",
            box_port: 8899
        }
    ]
}