var http = require('http');
var User = require('../models/user.model.js');
var WifiBoxModule = require('./wifibox.js');
var cmd = require('../controllers/commands.js');
var box = new WifiBoxModule("192.168.86.114", 8899);

exports.render = function(req,res) {
    res.render('index', {
        title: 'House',
        role: req.user.role
    });
}
exports.play = function(req,res) {
    res.render('render', {
        title: 'House',
        url: process.URL
    });
}
exports.login = function(req, res) {
    res.render('login', {
        title: 'Login'
    });
}
exports.logout = function(req, res ) {
    req.session.destroy(function (err) {
        res.redirect('/login');
    });
}

/**
 * Make new users. Use postman to do it. I would lock this down/remove it
 * after you create your users. Though, in reality, anyone can toggle your
 * lights and radio buttons if they are on your wifi or really want to.
 *
 * By default, admin role has access to all the buttons. General doesn't have access
 * to the bedroom. admin is all lowercase.
 *
 * @param req
 * @param res
 */
exports.postUsers = function(req, res) {
    console.log(req.body)
    if (req.body.role == undefined) {
        req.body.role = 'general'
    }
    var user = new User({
        username: req.body.username,
        password: req.body.password,
        role: req.body.role
    });

    user.save(function(err) {
        if (err)
            res.send(err);

        else {
            res.json({message: 'New user'});
        }
    });
};