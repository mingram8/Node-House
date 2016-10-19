var http = require('http');
var User = require('../models/user.model.js');
var WifiBoxModule = require('./wifibox.js');
var cmd = require('../controllers/commands.js');
var box = new WifiBoxModule("192.168.86.114", 8899);
var fs = require('fs');
var dash = require('../controllers/dash.controller.js');
var lights = require('../controllers/lights.controller.js');

exports.render = function (req, res) {

    res.render('index', {
        title: 'House',
        role: req.user.role
    });
}
exports.renderAdmin = function(req,res) {
    if (req.user.role == 'admin') {
        res.render('admin', {
            title: 'Admin Panel'
        });
    }
}
exports.play = function (req, res) {
    res.render('render', {
        title: 'House',
        url: process.URL
    });
}
exports.removeUser = function (req, res) {
    if (req.user.role == 'admin') {
        User.remove({username: req.body.username}, function (err, users) {
            res.send('success')
        })
    }
}
exports.getUsers = function(req,res) {
    var user = []
    if (req.user.role == 'admin') {
        User.find({}, function (err, users) {
            for (var i = 0; i < users.length; i++) {
                user.push(users[i].username)
            }
            res.send(user)
        });
    }
}
exports.login = function (req, res) {
    User.find({role:'admin'}, function (err, users) {
        console.log(users.length)
        if (users.length == 0) {
            var user = new User({
                username: 'admin',
                password: 'admin',
                role: 'admin'
            });

            user.save(function (err) {
                if (err)
                    res.send(err);

                else {
                    res.json({message: 'New user'});
                }
            });
        }
    })
    res.render('login', {
        title: 'Login'
    });
}
exports.logout = function (req, res) {
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
exports.postUsers = function (req, res) {
    if (req.user.role == 'admin') {
        if (req.body.role == undefined) {
            req.body.role = 'general'
        }
        var user = new User({
            username: req.body.username,
            password: req.body.password,
            role: req.body.role
        });

        user.save(function (err) {
            if (err)
                res.send(err);

            else {
                res.json({message: 'New user'});
            }
        });
    }
};

exports.writeConfig = function(req, res) {
    var file = req.body.file;
    req.body.file = undefined;
    var json = "module.exports = " +JSON.stringify(req.body);
    fs.writeFile("config/custom_configs/"+file+".config.js", json, function(err) {
        if(err) {
            return console.log(err);
        }
        require.cache[process.cwd()+"/config/custom_configs/"+file+".config.js"] = undefined;

        require.cache[process.cwd()+"/config/main.config.js"] = undefined;
        if (file == "dash") {
            dash.loadDash();
        }
        else if (file == "lights") {
            lights.updateLights();
        }
        try {
            res.send({message: file + " config updated"})
        }
        catch(e){}
    });
}
exports.writeArrayConfig = function(req, res) {
    var file = req.body.file;
    req.body.file = undefined;
    var json = "module.exports = " +JSON.stringify(req.body.array);
    fs.writeFile("config/custom_configs/"+file+".config.js", json, function(err) {
        if(err) {
            return console.log(err);
        }
        require.cache[process.cwd()+"/config/custom_configs/"+file+".config.js"] = undefined;

        require.cache[process.cwd()+"/config/main.config.js"] = undefined;


        if (file == "dash") {
            dash.loadDash();
        }
        else if (file == "lights") {
            lights.updateLights();
        }
        try {
            res.send({message: file + " config updated"})
        }
        catch(e){}
    });
}