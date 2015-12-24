var mongoose = require('mongoose');

/**
 * This is the last piece of the puzzle. I need this to be loaded from the config file.
 * 
 */
var HouseSchema = new mongoose.Schema({
    name: {type: String,
        unique: true,
        required: true
    },
    bedroom: {
        hall: {
            on: {type: String, default: false},
            color: {type: Number, default:1},
            brightness: {type:Number, default: 100}
        },
        lamp: {
            on: {type: String, default: false},
            color: {type: Number, default:1},
            brightness: {type:Number, default: 100}
        }
    },
    livingRoom: {
        overhead: {
            on: {type: String, default: false},
            color: {type: Number, default:1},
            brightness: {type:Number, default: 100}
        },
        recess: {
            on: {type: String, default: false},
            color: {type: Number, default:1},
            brightness: {type:Number, default: 100}
        }

    },
    kitchen: {
        overhead: {
            on: {type: String, default: false},
            color: {type: Number, default:1},
            brightness: {type:Number, default: 100}
        },
        counter: {
            on: {type: String, default: false},
            color: {type: Number, default:1},
            brightness: {type:Number, default: 100}
        },
        foyer: {
            on: {type: String, default: false},
            color: {type: Number, default:1},
            brightness: {type:Number, default: 100}
        },
        coffee: {
            on: {type: String, default: false}
        }
    },
    hall: {
        main: {
            on: {type: String, default: false},
            color: {type: Number, default:1},
            brightness: {type:Number, default: 100}
        }
    },
    misc: {
        christmas: {
            on: {type: String, default: false},
        }
    },
    volume: Number
});

module.exports = mongoose.model('House', HouseSchema);