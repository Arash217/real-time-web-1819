const passport = require('koa-passport');
const User = require('../models/user');
const userValidator = require('../services/validation/user');

const registerPage = async ctx => ctx.render('register');

const registerUser = async ctx => {
    const { body } = ctx.request;
    try {
        await userValidator.validate(body);
        const user = new User(body);
        await user.save();
        ctx.login(user);
        ctx.redirect('/dashboard');
    } catch (error) {
        ctx.status = 400;
        await ctx.render('register', {
            body,
            error,
        });
    }
};

const loginPage = async ctx => ctx.render('login');

const loginUser = async ctx => {
    const { body } = ctx.request;
    return passport.authenticate('local', async (error, user) => {
        if (user) {
            ctx.login(user);
            return ctx.redirect('/dashboard');
        }
        ctx.status = 400;
        await ctx.render('login', {
            body,
            error,
        });
    })(ctx);
};

const dashboardPage = async ctx => {
    ctx.body = 'lol2';
};

module.exports = {
    registerPage,
    registerUser,
    loginPage,
    loginUser,
    dashboardPage,
};
