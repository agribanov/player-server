const collection = require('./controllers/collection');

module.exports = (app) => {
    app.use('/collection/search', collection.search);
    app.use('/collection/playbackUrl/:serviceCode/:id', collection.playbackUrl);
    app.use('/collection/folders/:serviceCode/:id', collection.folders);
    app.use('/collection/subfolders/:serviceCode/:id', collection.subfolders);
    app.use('/collection/files/:serviceCode/:id', collection.files);
    app.use('/collection/:serviceCode/:id', collection.details);
    app.use('/collection', collection.list);
}