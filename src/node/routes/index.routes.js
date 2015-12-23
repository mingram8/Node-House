var index = require('../controllers/index.controller.js');
var authController = require('../controllers/auth.controller.js');

module.exports = function(app) {
    app.get('/', authController.isAuthenticated, index.render);
    app.get('/play', index.play);
    app.get('/logout', index.logout)
    app.route('/users')
        .post(index.postUsers)
    app.route('/login').get(index.login).post(authController.authenticate)

}