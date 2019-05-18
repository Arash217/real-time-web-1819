const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
    },

    password: {
        type: String,
    }
});

userSchema.pre('save', async function () {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
});

module.exports = model('User', userSchema);
