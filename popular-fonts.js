"use strict";

var urlLoader = require('./remoteloader'),
    fontBlast = require('font-blast'),
    fs        = require('fs'),
    tmp       = require('tmp')
    ;

urlLoader('https://raw.githubusercontent.com/zurb/foundation-icon-fonts/master/_foundation-icons.scss', function (remoteText) {
    var definitionLines = remoteText.match(/.fi-.*?content.*?".*?"/g),
        convertFilenames = {};

    definitionLines.forEach(function (line) {
        var charName = line.match(/fi-(.*?):/)[1],
            charCode = line.match(/content.*?"(.*?)"/)[1];
        convertFilenames[charCode.replace('\\', '')] = charName;
    });
    fontBlast('testsources/foundation.svg', 'test/fi', {
        filenames: convertFilenames,
        png:       200
    });
});

urlLoader('https://raw.githubusercontent.com/twbs/bootstrap/master/less/glyphicons.less', function (remoteText) {
    var definitionLines = remoteText.match(/\.glyphicon\-.*?content.*?"(.*?)"/g),
        convertFilenames = {};
    definitionLines.forEach(function (line) {
        var charName = line.match(/glyphicon-(.*?)\s/)[1],
            charCode = line.match(/content.*?"(.*?)"/)[1];
        convertFilenames[charCode.replace('\\', '')] = charName;
    });
    fontBlast('testsources/gly.svg', 'test/glyphicon', {
        filenames: convertFilenames
        //png:       200
    });
});

var version = "v4.2.0";
urlLoader([
    'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/' + version + '/src/icons.yml',
    'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/' + version + '/fonts/fontawesome-webfont.svg'
], function (remoteContent) {
    var iconNamingConventions = require('js-yaml').safeLoad(remoteContent[0]).icons;
    var convertFilenames = {};
    iconNamingConventions.forEach(function (icon) {
        convertFilenames[icon.unicode] = icon.id;
    });

    tmp.tmpName(function (err, path) {
        fs.writeFileSync(path, remoteContent[1]);
        fontBlast(path, 'test/fa', {filenames: convertFilenames, png: 200});
    });
    //1519 for normal, 1536 for offsetted

});