/**
 * Google music credentials.
 *
 * get android id by using one of the many apps to determine it. I don't
 * know how to do it on iOS.
 *
 * You can grab the master token from the output of login. Do a request
 * and it will pop up on the console. You don't need it, it just speeds
 * up requests if you snag it, put it in this config, and then
 * modify the login function in playMusic to just use init.
 *
 * @type {{androidId: string, masterToken: string}}
 */

module.exports = {
    gmail: "mingram9473@gmail.com",
    password: "Pass947*",
    androidId: "308CA8F9AB88F172"
}