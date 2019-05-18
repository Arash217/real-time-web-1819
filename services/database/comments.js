const Comments = require('../../models/comments');
const moment = require('moment');

let userComments = null;

const saveComments = async (userId, search) => {
    userComments = new Comments({
        userId,
        search,
        searchDateTime: moment().format('DD-MM-YYYY - HH:mm')
    });
    await userComments.save();
};

const updateComments = async ({permalink, subreddit_name_prefixed, author, body}) => {
    await Comments.update({_id: userComments._id}, {
        "$push": {
            "comments": {
                permalink,
                subreddit_name_prefixed,
                author,
                body
            }
        }
    }, {
        multi: true
    });
};

module.exports = {
    saveComments,
    updateComments
};