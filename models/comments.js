const mongoose = require('mongoose');
const moment = require('moment');

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
}, {
    timestamps: true
});

commentsSchema.pre('save', async function () {
    if (!this.searchDateTime){
        this.searchDateTime = moment().format('DD-MM-YYYY - HH:mm');
    }
});

module.exports = model('Comments', commentsSchema);
