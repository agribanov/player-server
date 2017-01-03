const templates = {
    collectionItem: require('./models/collectionItem'),
    details: require('./models/details'),
}

module.exports.create = (modelName, data) => {
    return templates[modelName] ? mergeData(templates[modelName], data) : data;
}

function mergeData(template, data) {
    return Object.assign({}, template, data);
};