const request = require('request');

module.exports.interpolate = (string, values) => {
    return string.replace(/\{(\w+)\}/g, function (match, variable) {
        return values[variable] || variable;
    });
}

module.exports.clearString = (string) => {
    return string.trim().replace(/[\n\r]/g, '').replace(/\s+/g, ' ');
}

module.exports.getPage = (url, cb) => {
    console.log('Getting ', url);
    return new Promise((resolve, reject) => {
        request(url, (err, response, body) => {
            console.log(err, response.statusCode);
            if (err || response.statusCode >= 400) {
                return reject(err || response);
            }

            resolve(cb(body, response));
        });
    });
}