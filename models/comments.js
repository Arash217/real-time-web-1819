const mongoose = require('mongoose');

const {Schema, model} = mongoose;

const commentsSchema = new Schema({
    userId: {
        type: String,
    },

    search: {
        type: String
    },

    searchDateTime: {
        type: String
    },

    comments: {
        type: Array
    }
});

module.exports = model('Comments', commentsSchema);
