const Comments = require('../../models/comments');

let userComments = null;

const saveComments = async (userId, search) => {
    userComments = new Comments({
        userId,
        search
    });
    await userComments.save();
};

const updateComments = async ({permalink, subreddit_name_prefixed, author, body}) => {
    await Comments.update({_id: userComments._id}, {
        "$push": {
            "comments": {
                $each: [{
                    permalink,
                    subreddit_name_prefixed,
                    author,
                    body
                }],
                $position: 0
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