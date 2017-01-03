// const treeTVService = require('../services/treeTV/treeTV');

const { codes, getService } = require('../services/services')

module.exports.list = (req, res, next) => {
    const {category, sort, page} = req.query;

    getService(codes.EX_FS_CODE).list(category, sort, page).then(
        data => res.json(data),
        err => res.status(err.statusCode || 500).send()
    );
};

module.exports.details = (req, res, next) => {
    const {serviceCode, id} = req.params;

    getService(serviceCode).details(id).then(
        data => res.json(data),
        err => res.status(err.statusCode || 500).send()
    )
};

module.exports.playbackUrl = (req, res, next) => {
    const {serviceCode, id} = req.params;
    const {foldersKey, folderId, subfolderId, fileId} = req.query;

    getService(serviceCode).playbackUrl(id, foldersKey, folderId, subfolderId, fileId).then(
        url => res.redirect(301, url),
        // url => res.send(url),
        err => {
            res.status(err.statusCode || 500).send()
        }
    )
};

module.exports.search = (req, res, next) => {
    const {category, q} = req.query;

    getService(codes.EX_FS_CODE).search(category, q).then(
        data => res.json(data),
        err => res.status(err.statusCode || 500).send()
    )
};

module.exports.folders = (req, res, next) => {
    const {serviceCode, id } = req.params;
    const {foldersKey} = req.query;

    getService(codes.EX_FS_CODE).folders(id, foldersKey).then(
        data => res.json(data),
        err => res.status(err.statusCode || 500).send()
    )
}

module.exports.subfolders = (req, res, next) => {
    const {serviceCode, id } = req.params;
    const {foldersKey, folderId} = req.query;

    getService(codes.EX_FS_CODE).subfolders(id, foldersKey, folderId).then(
        data => res.json(data),
        err => res.status(err.statusCode || 500).send()
    )
}

module.exports.files = (req, res, next) => {
    const {serviceCode, id } = req.params;
    const {foldersKey, folderId, subfolderId} = req.query;

    getService(codes.EX_FS_CODE).files(id, foldersKey, folderId, subfolderId).then(
        data => res.json(data),
        err => res.status(err.statusCode || 500).send()
    )
}
