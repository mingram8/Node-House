var express = require('express'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    flash    = require('connect-flash'),
    session = require('express-session'),
    mongoose = require('mongoose');

module.exports = function() {
    var app = express();
    mongoose.connect('mongodb://localhost:27017/users', function (error) {
        if (error) {
            console.log("Connecting to the database failed!");
            console.log(error);
        }
    });
    app.use(bodyParser.urlencoded({
        extended:true
    }));

    app.use(bodyParser.json({limit: '500mb'}));
    app.use( session({
        secret            : 'super secret key',
        resave            : false,
        saveUninitialized : true,
        cookie :{secure: false}
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());
    app.use(express.static('./src/webapp'));

    app.set('views', './src/webapp/views');
    app.set('view engine', 'ejs');

    require('../src/node/routes/index.routes.js')(app);
    require('../src/node/routes/playMusic.routes.js')(app);
    require('../src/node/routes/stock.routes.js')(app);
    require('../src/node/routes/house.routes.js')(app);
    require('../src/node/routes/radio.routes.js')(app);


    return app;
};