const Router = require('koa-router');
const controllers = require('../controllers');

const router = new Router();

router.get('/', controllers.homePage);
router.get('/register', controllers.registerPage);
router.post('/register', controllers.registerUser);
router.get('/login', controllers.loginPage);
router.post('/login', controllers.loginUser);
router.get('/logout', controllers.logoutUser);
router.get('/comments', controllers.commentsPage);

module.exports = router;
