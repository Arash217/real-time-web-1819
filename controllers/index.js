const passport = require('koa-passport');
const User = require('../models/user');
const Comments = require('../models/comments');
const userValidator = require('../services/validation/user');
const redditStream = require('../services/reddit/stream');
const {getCommentNode} = require('../services/views/index');
const CommentCounter = require('../services/charts/comment-counter');

const homePage = async ctx => ctx.render('home', {
    username: ctx.state.user ? ctx.state.user.username : null
});

const registerPage = async ctx => ctx.render('register');

const registerUser = async ctx => {
    const {body} = ctx.request;
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
    const {body} = ctx.request;
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

const logoutUser = async ctx => {
    if (ctx.isAuthenticated()) {
        ctx.logout();
        ctx.session = null;
    }
    ctx.redirect('/');
};

const commentsPage = async ctx => {
    if (ctx.isUnauthenticated()){
        return ctx.redirect('/login');
    }

    const comments = await Comments.find({userId: ctx.state.user._id});

    await ctx.render('comments', {
        comments
    });
};

const clients = [];

const socketHandler = async client => {
    clients.push(client);

    const commentCounter = new CommentCounter(client);
    const userId = client.session.passport && client.session.passport.user;

    if (userId){
        const userComments = new Comments({userId});
        userComments.save();
    }

    const eventHandler = async e => {
        const comment = JSON.parse(e.data);
        const {filterQuery} = client;

        if (filterQuery) {
            const {body} = comment;
            if (body && body.includes(filterQuery)) {
                comment.body = body.replace(new RegExp(filterQuery, 'g'), `<span class="highlight">${filterQuery}</span>`);
                commentCounter.increment();
                client.emit('comment', {
                    commentNode: getCommentNode(comment),
                    commentData: {
                        subreddit: comment.subreddit_name_prefixed
                    }
                });

                if (userId) {
                    await Comments.update({userId}, {
                        "$push": { "comments": comment.body }
                    }, {
                        multi: true
                    });
                }
            }
        }
    };

    redditStream.addEventListener('rc', eventHandler);

    client.on('disconnect', () => {
        clients.splice(clients.indexOf(client), 1);
        redditStream.removeEventListener('rc', eventHandler);
        commentCounter.clear();
        delete (commentCounter);
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
    logoutUser,
    homePage,
    commentsPage,
    socketHandler,
};
