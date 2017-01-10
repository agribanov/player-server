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
            console.log('Response', err, response.statusCode);
            if (err || response.statusCode >= 400) {
                // console.log(err || response)
                return reject(err || response);
            }

            resolve(cb(body, response));
        });
    });
}

module.exports.postForm = (req, data, cb) => {
    console.log('Posting ', req, data);
    return new Promise((resolve, reject) => {
        request.post(req, data, (err, response, body) => {
            console.log('Response', err, response && response.statusCode);
            if (err || response.statusCode >= 400) {
                console.log(err || response.body)
                return reject(err || response);
            }

            resolve(cb(body, response));
        });
    });
}

module.exports.postPage = (req, cb) => {
    console.log('Posting ', req);
    return new Promise((resolve, reject) => {
        request.post(req, (err, response, body) => {
            // console.log('Response', err, response && response.statusCode);
            if (err || response.statusCode >= 400) {
                // console.log(err || response.body)
                return reject(err || response);
            }

            resolve(cb(body, response));
        });
    });
}