const bcrypt = require('bcrypt');
const passport = require('koa-passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (e) {
        done(e);
    }
});

const comparePass = (userPassword, databasePassword) => (
    bcrypt.compareSync(userPassword, databasePassword)
);

const invalidCredentialsError = {
    message: 'Incorrect username and/or password',
};

passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        const user = await User.findOne({ username });
        if (!user) return done(invalidCredentialsError, false);
        if (!comparePass(password, user.password)) return done(invalidCredentialsError, false);
        return done(null, user);
    } catch (e) {
        return done(e);
    }
}));
