var Button = require('../models/button.model.js'),
    House = require('../models/house.model.js'),
    houseController = require('./house.controller'),
    config = require('../../../config/main.config');
function capitalizeEachWord(str) {
    return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}
/**
 * HEY
 *
 * All of this was just filler because originally I was going to have
 * the buttons come from mongo marking each with a user. But
 * I like them coming from the config file more since it is more
 * easily modifiable. I am leaving it in here in case I do that
 * one day
 *
 * @param req
 * @param res
 */
/*****************************************************************************/
exports.newButton = function(req, res) {
    var button = new Button({
        name: req.body.name,
        button_type: req.body.type,
        main_button: req.body.main,
        radio_zone: req.body.radio_zone || null,
        zone: req.body.zone,
        folder: req.body.folder,
        folder_buttons: req.body.buttons || null

    });

    button.save(function (err) {
        if (err)
            res.send(err);

        else {
            res.json({message: 'New button'});
        }
    });
}

exports.removeButton = function(req,res) {
    Button.remove({name: req.body.name}, function(results){res.send(results)})
}

exports.findButtons = function(req, res) {
    Button.find({}, function(err,results){
        res.send(results)
    })
}
/*****************************************************************************/
/**
 * This one is a big deal. It creates the button and folder objects to
 * send to the client. If it is a folder button (has a parent) then it
 * goes in the folderButton object. The parent becomes the key.
 * If it is not a folderButton then it goes in the buttons array.
 *
 * All of this comes from the config file. If you don't understand it, I wouldn't touch it.
 * It would be easy to break and destroy the entire front end. I tried to explain
 * it the best I could.
 *
 * @param req
 * @param res
 *
 * TODO: Make the user if statements dynamic so roles can be loaded from config files.
 */
exports.createButtons = function(req, res) {
    config = require('../../../config/main.config');

    var buttons = [];
    var folderButtons = {}
    for (var i in config.house) {
        /* If the user is an admin, they get all the buttons, otherwise they
         * don't have access to bedrooms. You could change this to do
         * other roles. I just have general and admin. (me and the
         * living room, foyer, hall, and etc..)
         */
        if (req.user.role == 'admin'){
            var num = 0;
            var restart = false;
            for (var x in config.house[i]) {
                if (config.house[i][x].folderButton == false) {
                    buttons.push({name:capitalizeEachWord(x), param:[i,x], folder:false, type:config.house[i][x].type})
                }
                else if(restart == false) {
                    restart = true;
                    folderButtons[i] = [];
                    buttons.push({name:capitalizeEachWord(i), param:[i], folder:true})
                }
                 num ++;
                 if(config.house[i][x].folderButton == true) {
                     if (i == 'hall') {
                         folderButtons[i].push({name:capitalizeEachWord(x), param:[i,x], model: 'switch3', slider:config.house[i][x].type == 'light', folder:false, type:config.house[i][x].type})

                     }
                     else
                    folderButtons[i].push({name:capitalizeEachWord(x), param:[i,x], model: 'switch'+num, slider:config.house[i][x].type == 'light', folder:false, type:config.house[i][x].type})
                }
            }
        }
        /**
            Here is where you would make more things private or add other roles. Such as
            (i != 'bedroom' || i!= 'bathroom) or another else if chunk like,
                else if (i != 'masterBedroom' && role == 'child')
         */
        else if (i != 'bedroom' && i != 'misc') {
            var num = 0;
            var restart = false;
            for (var x in config.house[i]) {
                if (config.house[i][x].folderButton == false) {
                    buttons.push({name:capitalizeEachWord(x), param:[i,x], folder:false, type:config.house[i][x].type})
                }
                else if(restart == false) {
                    restart = true;
                    folderButtons[i] = [];
                    buttons.push({name:capitalizeEachWord(i), param:[i], folder:true})
                }
                num ++;
                if(config.house[i][x].folderButton == true) {
                    if (i == 'hall') {
                        folderButtons[i].push({name:capitalizeEachWord(x), param:[i,x], model: 'switch3', folder:false, slider: config.house[i][x].type == 'light', type:config.house[i][x].type})

                    }
                    else
                    folderButtons[i].push({name:capitalizeEachWord(x), param:[i,x], model: 'switch'+num, folder:false, slider: config.house[i][x].type == 'light', type:config.house[i][x].type})
                }
            }
        }
    }

    if (req.user.role == 'admin') {
        buttons.push({name: 'Bedtime', param: ['bedtime'], folder: false})
        buttons.push({name: 'Banks', param: ['intercom'], folder: false})

    }
    buttons.push({name:'Music', param:'musicPage', folder:false})
    res.send({buttons: buttons, folderButtons: folderButtons});


}
