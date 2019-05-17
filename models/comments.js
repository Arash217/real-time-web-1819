const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const commentSchema = new Schema({
    userId: {
        type: String,
    },

    comments: {
        type: Array
    }
});

module.exports = model('Comments', commentSchema);
