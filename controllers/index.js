const passport = require('koa-passport');
const User = require('../models/user');
const userValidator = require('../services/validation/user');
const redditStream = require('../services/reddit/stream');
const { getCommentNode } = require('../services/views/index');
const CommentCounter = require('../services/charts/comment-counter');

const homePage = async ctx => ctx.render('home');

const registerPage = async ctx => ctx.render('register');

const registerUser = async ctx => {
    const { body } = ctx.request;
    try {
        await userValidator.validate(body);
        const user = new User(body);
        await user.save();
        ctx.login(user);
        ctx.redirect('/');
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
            return ctx.redirect('/');
        }
        ctx.status = 400;
        await ctx.render('login', {
            body,
            error,
        });
    })(ctx);
};

const clients = [];

const socketHandler = client => {
    clients.push(client);

    const commentCounter = new CommentCounter(client);

    const eventHandler = e => {
        const comment = JSON.parse(e.data);
        const { filterQuery } = client;

        if (filterQuery){
            const { body } = comment;
            if (body && body.includes(filterQuery)){
                comment.body = body.replace(new RegExp(filterQuery, 'g'), `<span class="highlight">${filterQuery}</span>`);
                commentCounter.increment();
                client.emit('comment', {
                    commentNode: getCommentNode(comment),
                    commentData: {
                        subreddit: comment.subreddit_name_prefixed
                    }
                });
            }
        }
    };

    redditStream.addEventListener('rc', eventHandler);

    client.on('disconnect', () => {
        clients.splice(clients.indexOf(client), 1);
        redditStream.removeEventListener('rc', eventHandler);
        commentCounter.clear();
        delete(commentCounter);
    });

    client.on('filter', data => {
        commentCounter.reset();
        client.filterQuery = data;
    });
};

module.exports = {
    registerPage,
    registerUser,
    loginPage,
    loginUser,
    homePage,
    socketHandler,
};
