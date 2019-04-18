const Handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

const comment = fs.readFileSync(path.join(__dirname, '../../views/partials/comment.hbs'), 'utf8');

const getCommentNode = data => {
    const commentTemplate = Handlebars.compile(comment);
    return commentTemplate(data);
};

module.exports = {
    getCommentNode
};