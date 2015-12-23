var mongoose = require('mongoose');

var RadioSchema = new mongoose.Schema({
    zone: {type:Number,required: true, unique:true},
        code_on: {type:Number, required: true},
        code_off:{type:Number, required: true  }

});

module.exports = mongoose.model('Radio', RadioSchema);