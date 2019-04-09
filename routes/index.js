const Router = require('koa-router');
const router = new Router();
const controllers = require('../controllers');

router.get('/register', controllers.registerPage);
router.post('/register', controllers.registerUser);
router.get('/login', controllers.loginPage);
router.post('/login', controllers.loginUser);
router.get('/dashboard', controllers.dashboardPage);

module.exports = router;
