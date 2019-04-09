const Router = require('koa-router');
const passport = require('koa-passport');
const router = new Router();
const User = require('../models/user');
const userValidator = require('../services/validation/user');

router.get('/register', async ctx => {
    await ctx.render('register')
});

router.post('/register', async ctx => {
    const {body} = ctx.request;
    try {
        await userValidator.validate(body);
        const user = new User(body);
        await user.save();
        return passport.authenticate('local', (err, user) => {
            ctx.login(user);
            ctx.redirect('/dashboard');
        })(ctx);
    } catch (e) {
        ctx.status = 400;
        await ctx.render('register', {
            body,
            e
        })
    }
});

router.get('/login', async ctx => {
    await ctx.render('login')
});

router.post('/login', async ctx => {
    return passport.authenticate('local', (err, user) => {
        if (user) {
            ctx.login(user);
            return ctx.redirect('/dashboard');
        } else {
            ctx.status = 400;
            ctx.body = { status: 'error' };
        }
    })(ctx);
});

router.get('/dashboard', ctx => {
    ctx.body = 'lol2';
});

module.exports = router;
