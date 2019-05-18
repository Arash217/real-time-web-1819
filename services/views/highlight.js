const highlightKeyword = (node, keyword) => {
    return node.replace(new RegExp(keyword, 'g'), `<span class="highlight">${keyword}</span>`);
};

module.exports = {
    highlightKeyword
};