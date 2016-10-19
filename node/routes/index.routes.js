var index = require('../controllers/index.controller.js');
var authController = require('../controllers/auth.controller.js');
var dash = require('../controllers/dash.controller.js');
var lights = require('../controllers/lights.controller.js');

module.exports = function(app) {
    app.get('/', authController.isAuthenticated, index.render);
    app.get('/admin', authController.isAuthenticated, index.renderAdmin);
    app.get('/play', index.play);
    app.get('/logout', index.logout)
    app.get('/getUsers', authController.isAuthenticated, index.getUsers);
    app.route('/users')
        .post(authController.isAuthenticated, index.postUsers);
    app.route('/removeUser')
        .post(authController.isAuthenticated, index.removeUser)
    app.route('/login').get(index.login).post(authController.authenticate)
    app.route('/writeConfig').post(authController.isAuthenticated, index.writeConfig)
    app.route('/writeArrayConfig').post(authController.isAuthenticated, index.writeArrayConfig)
    app.get('/returnDashButtons', authController.isAuthenticated, dash.returnDashButtons)
    app.get('/returnLights', authController.isAuthenticated, lights.returnLights)

}