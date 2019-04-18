const passport = require('koa-passport');
const User = require('../models/user');
const userValidator = require('../services/validation/user');
const redditStream = require('../services/reddit/stream');
const { getCommentNode } = require('../services/views/index');

const homePage = async ctx => ctx.render('home');

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

const clients = [];

const socketHandler = client => {
    clients.push(client);

    const eventHandler = e => {
        const comment = JSON.parse(e.data);

        if (client.filterQuery){
            if (comment.body && comment.body.includes(client.filterQuery)){
                console.log(clients.length);
                client.emit('comment', getCommentNode(comment));
            }
        }
    };

    redditStream.addEventListener('rc', eventHandler);

    client.on('disconnect', () => {
        clients.splice(clients.indexOf(client), 1);
        redditStream.removeEventListener('rc', eventHandler);
    });

    client.on('filter', data => {
        client.filterQuery = data;
    });
};

module.exports = {
    registerPage,
    registerUser,
    loginPage,
    loginUser,
    dashboardPage,
    homePage,
    socketHandler,
};
