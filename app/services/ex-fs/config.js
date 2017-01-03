module.exports = {
    code: 1855,
    url: 'http://ex-fs.net',
    cdnUrl: 'http://cdn.ex-fs.net',
    listUri: '/{category}/page/{pageNumber}/',
    detailsUri: '/{id}',
    manifestUri: '/sessions/new_session',

    dataStringRegExp: /post\(session_url.*\{(.*)\}\)\.success/,

    categoriesMapping: {
        animation: 'cartoon',
        films: 'films',
        series: 'series'
    }
}