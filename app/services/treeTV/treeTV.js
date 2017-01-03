const { TREE_TV_CODE } = require('../services');

const config = {
    url: 'http://m.tree.tv',
    listUri: '/{type}/sortType/{sort}/page/{pageNumber}',
    detailsUri: '/film/{id}',
    fileUrl: 'http://player.3tv.im/m3u8/{id}.m3u8',
    search: '/search?usersearch={query}'
}

const utils = require('../../utils'),
    cheerio = require('cheerio');

module.exports.list = (type = 'all', sort = 'new', pageNumber = 1) => {
    const uri = utils.interpolate(config.listUri, { type, sort, pageNumber });

    return utils.getPage(getRequestOptions(`${config.url}${uri}`), parseListPage);
};

module.exports.details = (id) => {
    const uri = utils.interpolate(config.detailsUri, { id });

    return utils.getPage(getRequestOptions(`${config.url}${uri}`), parseDetailsPage);
};

module.exports.playbackUrl = (id) => {
    const url = utils.interpolate(config.fileUrl, { id });

    return utils.getPage(getRequestOptions(`${url}`), parsem3u8File);
}

module.exports.search = (query) => {
    query = encodeURIComponent(query);

    const uri = utils.interpolate(config.search, { query });

    return utils.getPage(getRequestOptions(`${config.url}${uri}`), parseListPage);
}

function getRequestOptions(url) {
    return {
        url,
        headers: {
            Referer: config.url
        }
    }
}

function parseListPage(body) {
    const parsedItems = [],
        $ = cheerio.load(body),
        $items = $('.results-item-wrap');

    $items.each((index, item) => {
        parsedItems.push({
            title: $('h4', item).text(),
            year: $('.year', item).text(),
            genre: $('.genre', item).text(),
            quality: $('.quality', item).text(),
            link: $('a', item).eq(3).attr('href').split('/')[2],
            imageUrl: $('img', item).attr('src'),
            source: TREE_TV_CODE
        });
    });

    return parsedItems;
}

function parseDetailsPage(body) {
    const $ = cheerio.load(body),
        $item = $('.object'),
        $dds = $('.dl-horizontal dd', $item),
        $folders = $('.folders_menu .panel'),
        response = {
            title: utils.clearString($('#film_name', $item).text()),
            imageUrl: $('.preview_img', $item).eq(0).attr('src'),
            quality: utils.clearString($dds.eq(0).text()),
            genre: utils.clearString($dds.eq(1).text()),
            country: utils.clearString($dds.eq(2).text()),
            length: utils.clearString($dds.eq(4).text()),
            description: utils.clearString($('#description', $item).text()),
            folders: []
        };

    $folders.each((index, $folder) => {
        const $files = $('a', $folder),
            folder = {
                title: utils.clearString($('.panel-title', $folder).text()),
                files: []
            };

        $files.each((index, $file) => {
            const $$file = $($file),
                hrefParts = $$file.attr('href').split('/')
            
            folder.files.push({
                title: utils.clearString($$file.text()),
                id: hrefParts[2],
                m3u8: hrefParts[3] == 1
            });
        });

        response.folders.push(folder);
    });

    return response;
}

function parsem3u8File(body) {
    // return body; 
    return utils.clearString(body.match(/\n(http.*)\n/g)[0]);
}