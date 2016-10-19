/**
 * Set up radio boxes. I made it an array so you can have multiple
 * raspberry pis around the house since the transmitters have a hard time
 * reaching very far.
 *
 * @type {{boxes: *[]}}
 */
module.exports = {
    boxes: [{
        ip: 'http://192.168.1.3',
        port: 1900
    }]
}
