var mongoose = require('mongoose');

var ButtonSchema = new mongoose.Schema({
    name: {type: String, required:true},
    button_type: {type: String, required:true},
    main_button: {type: Boolean, required:true},
    zone: {type: String, required:true},
    radio_zone: {type:Number, required:false, default:null},
    folder: {type: Boolean, required:true},
    folder_buttons: Array
});

module.exports = mongoose.model('Button', ButtonSchema);