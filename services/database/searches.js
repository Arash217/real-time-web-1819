const Search = require('../../models/search');

const getSearches = async () => {
    return Search.find({}, {search: true, count: true, '_id': false}).sort({count: 'desc'}).limit(10).exec();
};

const incrementSearch = async searchQuery => {
    const search = await Search.findOne({search: searchQuery}).exec();

    if (search){
        search.count++;
        await search.save();
    } else {
        await (new Search({search: searchQuery})).save();
    }

    return getSearches();
};

module.exports = {
    getSearches,
    incrementSearch
};