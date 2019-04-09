const Router = require('koa-router');
const passport = require('koa-passport');
const router = new Router();
const User = require('../models/user');
const userValidator = require('../services/validation/user');

router.get('/register', async ctx => {
    await ctx.render('register')
});

router.post('/users', async ctx => {
    try {
        const {body} = ctx.request;
        await userValidator.validate(body);
        const user = new User(body);
        await user.save();
        ctx.status = 201;
        ctx.body = user;
    } catch (e) {
        ctx.status = 400;
        ctx.body = e;
    }
});

router.get('/login', ctx => {
    ctx.body = 'lol2';
});

module.exports = router;
