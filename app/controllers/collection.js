const treeTVService = require('../services/treeTV');

module.exports.list = (req, res, next) => {
    treeTVService.list().then(
        data => res.json(data),
        err => res.status(err.statusCode || 500).send()
    )
};

module.exports.details = (req, res, next) => {
    treeTVService.details(req.params.id).then(
        data => res.json(data),
        err => res.status(err.statusCode || 500).send()
    )
};

module.exports.playbackUrl = (req, res, next) => {    
    treeTVService.playbackUrl(req.params.id).then(
        // url => res.redirect(301, url),
        url => res.send(url),
        err => res.status(err.statusCode || 500).send()
    )
};

module.exports.search = (req, res, next) => {
    treeTVService.search(req.query.q).then(
        data => res.json(data),
        err => res.status(err.statusCode || 500).send()
    )
};

