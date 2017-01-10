const config = require('./config');
const parser = require('./parser');
const utils = require('../../utils');

class Service {
    constructor() { }

    list(category = 'films', sort = '', pageNumber = '1') {
        category = config.categoriesMapping[category];

        const uri = utils.interpolate(config.listUri, { category, pageNumber });

        return utils.getPage(getRequestOptions(`${config.url}${uri}`), parser.parseListPage);
    }

    search(category = 'films', query) {
        return utils.postForm(`${config.url}`, getSearchRequestData(query), parser.parseSearchPage);
    }

    details(id) {
        const uri = utils.interpolate(config.detailsUri, { id });

        return utils.getPage(getRequestOptions(`${config.url}${uri}`), parser.parseDetailsPage.bind(this, id));
    }

    folders(id) {
        const uri = utils.interpolate(config.detailsUri, { id });

        return utils.getPage(getRequestOptions(`${config.url}${uri}`), parser.parseFoldersPage);
    }

    subfolders(videoId, foldersKey, folderId) {
        return utils.getPage(getRequestOptions(`${config.cdnUrl}/${folderId}`), parser.parseFolderPage.bind(parser, folderId));
    }

    files(videoId, foldersKey, folderId, subfolderId) {
        return utils.getPage(getRequestOptions(`${config.cdnUrl}/${folderId}`), parser.parseSubfolderPage.bind(parser, subfolderId));
    }

    playbackUrl(videoId, foldersKey, folderId, subfolderId, fileId) {
        fileId = fileId.replace(/~/g, '&');

        return utils.getPage(getRequestOptions(`${config.cdnUrl}/${fileId}`), parser.parseFilePlaybackUrlPage);
    }

}

function getRequestOptions(url) {
    return {
        url,
        headers: {
            Referer: config.url
        }
    }
}

function getSearchRequestData(query) {
    return {
        form: {
            do: 'search',
            subaction: 'search',
            story: query
        }
    }
}

module.exports.code = config.code;
module.exports.service = new Service();