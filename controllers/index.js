const passport = require('koa-passport');
const User = require('../models/user');
const userValidator = require('../services/validation/user');
const redditStream = require('../services/reddit/stream');
const Handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

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

const comment = fs.readFileSync(path.join(__dirname, '../views/partials/comment.hbs'), 'utf8');
const getCommentsHTML = data => {
    const commentsTemplate = Handlebars.compile(comment);
    return commentsTemplate(data);
};

const clients = [];

const socketHandler = client => {
    clients.push(client);

    client.on('disconnect', () => {
        clients.splice(clients.indexOf(client), 1);
    });

    client.on('filter', data => {
        client.filterQuery = data;
    });

    redditStream.addEventListener('rc', e => {
        const comment = JSON.parse(e.data);

        if (client.filterQuery){
            if (comment.body && comment.body.includes(client.filterQuery)){
                client.emit('comment', getCommentsHTML(comment));
            }
        }
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
