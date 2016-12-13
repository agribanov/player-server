const collection = require('./controllers/collection');

module.exports = (app) => {
    app.use('/collection/search', collection.search);
    app.use('/collection/playbackUrl/:source/:id', collection.playbackUrl);
    app.use('/collection/:source/:id', collection.details);
    app.use('/collection', collection.list);
}