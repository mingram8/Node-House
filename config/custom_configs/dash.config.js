/**
 * Array of dash lights. Attach a box and a zone to each button
 * So, config.dash[0] will mean the first dash button in the list
 * and it will toggle the bedroom hall light. It will go search
 * though the house to match up the zone. If they don't match,
 * it won't work. So, it would look up: House.bedroom.hall to find
 * the current state.
 *
 * id is the mac address of the dash button. You can get that by running
 * /node_modules/node-dash-button/bin/findbutton and then clicking the
 * dash button. (This is after you set the button up)
 *
 * @type {*[]}
 */
module.exports = [{
    id: "74:75:48:ec:61:d3",
    type: "light",
    box: 0,
    zone: ['bedroom', 'hall']
}, {
    id: "f0:27:2d:43:b2:e2",
    type: "light",
    box: 0,
    zone: ['hall', 'main']
}, {
    id: "f0:27:2d:72:ec:e0",
    type: "light",
    box: 0,
    zone: ['hall', 'main']
}, {
    id: "74:75:48:bd:44:22",
    type: "light",
    box: 0,
    zone: ['bedroom', 'lamp']
}
]
