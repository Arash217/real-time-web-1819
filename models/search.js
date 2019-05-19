const mongoose = require('mongoose');

const {Schema, model} = mongoose;

const SearchSchema = new Schema({
    search: {
        type: String
    },

    count: {
        type: Number,
        default: 1
    }
});

module.exports = model('Searches', SearchSchema);
