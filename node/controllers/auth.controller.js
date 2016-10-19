var passport = require('passport');
var User = require('../models/user.model.js');

/**
 * Add to routes to confirm user is still logged in.
 * If so, continue to the next function, otherwise
 * redirect back to login page.

 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.isAuthenticated = function(req,res,next) {
    //No user? Route to login
    if (!req.user)
        res.redirect('/login');

    //Continue with route functions
    return next();

}

/**
 * Check login credentials. Log user in if true, return to login page if false
 */
exports.authenticate =  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    session:true,
    failureFlash: true
    });
