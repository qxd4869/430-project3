const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getUnits', mid.requiresSecure, controllers.Unit.getUnits);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.get('/profile', mid.requiresLogin, controllers.Account.profilePage);
  app.post('/changePass', mid.requiresLogin, controllers.Account.changePass);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/maker', mid.requiresLogin, controllers.Unit.makerPage);
  app.post('/maker', mid.requiresSecure, mid.requiresLogin, controllers.Unit.make);
  app.get('/updateResources', mid.requiresLogin, controllers.Account.updateResources);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
