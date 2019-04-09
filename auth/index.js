const bcrypt = require('bcrypt');
const User = require('../models/user');
const passport = require('koa-passport');
const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user)
    } catch (e) {
        done(e)
    }
});

const comparePass = (userPassword, databasePassword) => {
    return bcrypt.compareSync(userPassword, databasePassword);
};

passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        const user = await User.findOne({username});
        if (!user) return done(null, false);
        if (!comparePass(password, user.password)) return done(null, false);
        done(null, user);
    } catch (e) {
        done(e)
    }
}));