const cheerio = require('cheerio');
const utils = require('../../utils');
const factory = require('../modelFactory');
const config = require('./config');

module.exports.parseListPage = parseListPage(
    '.MiniPostAllForm.MiniPostAllFormDop',
    '.MiniPostInfo a',
    '.MiniPostName',
    '.MiniPost a',
    '.MiniPost img'
);
module.exports.parseSearchPage = parseListPage(
    '.SeaRchresultPost',
    '.SeaRchresultPostInfo a',
    '.SeaRchresultPostTitle',
    '.SeaRchresultPostPoster a',
    '.SeaRchresultPostPoster img'
);
module.exports.parseDetailsPage = parseDetailsPage;
module.exports.parseFolderPage = parseFolderPage;
module.exports.parseSubfolderPage = parseSubfolderPage;
module.exports.parseFilePlaybackUrlPage = parseFilePlaybackUrlPage;

function parseListPage(itemSelector, infoSelector, titleSelector, linkSelector, imageSelector) {
    return (body) => {
        const parsedItems = [],
            $ = cheerio.load(body),
            $items = $(itemSelector);

        $items.each((index, item) => {
            let data = { countries: [], genres: [] };

            $(infoSelector, item).each(parseInfo($, data));

            parsedItems.push(factory.create('collectionItem', {
                title: utils.clearString($(titleSelector, item).text()),
                year: data.year,
                country: data.countries.join(', '),
                genre: data.genres.join(', '),
                source: config.code,
                link: collectionItemLink($(linkSelector, item).attr('href')),
                imageUrl: thumbnailUrl($(imageSelector, item).attr('src'))
            }));
        });

        return parsedItems;
    }
}

function parseDetailsPage(body) {
    const $ = cheerio.load(body),
        parsedObject = {},
        $container = $('#dle-content');

    parsedObject.source = config.code;
    parsedObject.id = config.code;
    parsedObject.foldersKey = config.code;

    parsedObject.title = utils.clearString($('.view-caption', $container).text());
    parsedObject.subtitle = utils.clearString($('.view-caption2', $container).text());
    parsedObject.imageUrl = fullImageUrl($('.FullstoryFormLeft img').attr('src'));
    parsedObject.description = utils.clearString($('.FullstorySubFormText').text());

    const data = { countries: [], genres: [] };
    $('.FullstoryInfo a').each(parseInfo($, data));

    parsedObject.year = data.year;
    parsedObject.country = data.countries.join(', ');
    parsedObject.genre = data.genres.join(', ');

    const $infoPs = $('.FullstoryInfo p'),
        $infoHeadings = $('.FullstoryInfoTitle');

    $infoHeadings.each((i, el) => {
        if ($(el).text() == 'Время:') {
            parsedObject.length = utils.clearString($infoPs.eq(i - 1).text());
        }
    });

    const $laguageOptions = $('#s_msoc option');
    parsedObject.folders = [];

    if ($laguageOptions.length) {
        $laguageOptions.each((i, option) => {
            const $option = $(option);

            parsedObject.folders.push(factory.create('folder', {
                title: $option.text(),
                id: getfolderIdFromFrameUrl($option.attr('value'))
            }));
        });
    } else {
        parsedObject.folders.push(factory.create('folder', {
            title: 'Файлы',
        }));
    }

    let $iframe = $('#mcode_block iframe');

    if (!$iframe.length) { $iframe = $('#rightholder iframe')}

    parsedObject.folders[0].id = getfolderIdFromFrameUrl($iframe.attr('src'));

    return factory.create('details', parsedObject);
    
    // return loadFolderData(parsedObject.folders[0].id).then(data => {
    //     parsedObject.folders[0].subfolders = data;

    //     return factory.create('details', parsedObject);
    // });
}

function parseFolderPage(folderId, body) {
    const $ = cheerio.load(body),
        $seasonsOptions = $('#season option'),
        subfolders = [];

    if ($seasonsOptions.length) {
        $seasonsOptions.each((i, option) => {
            $option = $(option);

            subfolders.push(factory.create('subfolder', {
                title: $option.text(),
                id: folderId + '?season=' + $option.attr('value')
            }));
        })
    } else {
        subfolders.push(factory.create('subfolder', {
            title: 'Файлы',
            id: folderId
        }))
    }

    subfolders[subfolders.length - 1].files = parseSubfolderPage(subfolders[subfolders.length - 1].id, body);

    return subfolders;
}

function parseSubfolderPage(subfolderId, body) {
    const $ = cheerio.load(body),
        $episodesOptions = $('#episode option'),
        files = [];

    if ($episodesOptions.length) {
        $episodesOptions.each((i, option) => {
            const $option = $(option);

            files.push(factory.create('file', {
                title: $option.text(),
                id: subfolderId + '~episode=' + $option.attr('value')
            }));
        })

    } else {
        files.push(factory.create('file', {
            title: 'Файл',
            id: subfolderId
        }));
    }

    return files;

}

function parseFilePlaybackUrlPage(body) {
    // console.log('b', body, config.dataStringRegExp);
    const dataString = utils.clearString(body).match(config.dataStringRegExp)[1]
        .replace('ad_attr: condition_detected ? 1 : 0', 'ad_attr:  0')
        // .replace(/'/g, '"')
        .replace(/'/g, '')
        .replace(/ /g, '')
        .replace(/,/g, '&')
        .replace(/:/g, '=');
            // .replace(/ (\w+):/g, '"$1":'),
        // fileData = JSON.parse(dataString);
    // fileData.debug = true;
    // console.log(fileData);
    


    return utils.postPage(
        getManifestRequestOptions(`${config.cdnUrl}${config.manifestUri}`, dataString),
        parseManifestResponse);
}

function parseManifestResponse(body) {
    const manifest = JSON.parse(body);
    
    return manifest.mans.manifest_m3u8;
}

function loadFolderData(folderId) {
    return utils.getPage(getRequestOptions(`${config.cdnUrl}/${folderId}`), parseFolderPage.bind(this, folderId))
}

function parseInfo($, data) {
    return (i, el) => {
        const $el = $(el),
            href = $el.attr('href');

        if (href.indexOf('year') >= 0) {
            return data.year = Number($el.text());
        }

        if (href.indexOf('country') >= 0) {
            return data.countries.push($el.text());
        }

        if (href.indexOf('genre') >= 0) {
            return data.genres.push($el.text());
        }
    }
}


function getfolderIdFromFrameUrl(url) {
    const chunks = url.split('/');

    return [chunks[3], chunks[4], chunks[5].split('"')[0]].join('/');
}

function fullImageUrl(uri) {
    return config.url + uri;
}

function thumbnailUrl(url) {
    return config.url + url.split('&')[0] + '&w=170&h=250';
}

function collectionItemLink(url) {
    return url.split('/')[4];
}

function getRequestOptions(url) {
    return {
        url,
        headers: {
            Referer: config.url
        }
    }
}

function getManifestRequestOptions(url, body) {
    return {
        url,
        body,
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-Iframe-Option': 'Direct',
            'X-Data-Pool': 'Stream',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
    }
}