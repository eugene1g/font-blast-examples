"use strict";

var request = require('superagent');

module.exports = function (urls, callback) {
    var reqUrls = urls, numberLoaded = 0, loadedData = [];
    if (typeof urls == 'string') {
        reqUrls = [urls];
    }

    reqUrls.forEach(function (sourceUrl, sourceIdx) {
        request.
            get(sourceUrl).
            on('error', function (err) {
                throw err;
            }).
            end(function (res) {
                if (res.error) {
                    throw res.error;
                }
                loadedData[sourceIdx] = res.text;

                if (++numberLoaded == reqUrls.length) {
                    callback(typeof urls == 'string' ? loadedData[0] : loadedData);
                }
            });
    });
}