"use strict";

var urlLoader = require('./remoteloader'),
    fontBlast = require('../font-blast'),
    fs        = require('fs'),
    tmp       = require('tmp')
    ;



//Convert local fontello stuff
var convertFilenames = {};
//var fontelloConfig = require('testcase/fontello-fb1e81f2/config.json');

fontBlast('testcase/fontello-fb1e81f2/font/fontello.svg', 'generated/fontello-rand', {
    //filenames: convertFilenames,
    //png: 200
});


return;

//Split Font-Awesome icons for a specific version
//Again, silly because the originals are at https://github.com/iconic/open-iconic/tree/master/svg
var iconicVersion = "1.1.1";
urlLoader([
    'https://raw.githubusercontent.com/iconic/open-iconic/' + iconicVersion + '/font/css/open-iconic.scss',
    'https://raw.githubusercontent.com/iconic/open-iconic/' + iconicVersion + '/font/fonts/open-iconic.svg'
], function (remoteContent) {
    var definitionLines = remoteContent[0].match(/data\-glyph=(.*?)\][\s\S]+?content.*?'.*?'/g),
        convertFilenames = {};


    definitionLines.forEach(function (line) {
        var charName = line.match(/glyph=(.*?)\]/)[1],
            charCode = line.match(/content.*?'(.*?)'/)[1];
        convertFilenames[charCode.replace('\\', '')] = charName;
    });

    tmp.tmpName(function (err, path) {
        fs.writeFileSync(path, remoteContent[1]);
        fontBlast(path, 'generated/iconic-' + iconicVersion, {
            filenames: convertFilenames,
            //png: 200
        });
    });
});

//Split Font-Awesome icons for a specific version
var faVersion = "v4.2.0";
urlLoader([
    'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/' + faVersion + '/src/icons.yml',
    'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/' + faVersion + '/fonts/fontawesome-webfont.svg'
], function (remoteContent) {
    var iconNamingConventions = require('js-yaml').safeLoad(remoteContent[0]).icons;
    var convertFilenames = {};
    iconNamingConventions.forEach(function (icon) {
        convertFilenames[icon.unicode] = icon.id;
    });

    tmp.tmpName(function (err, path) {
        fs.writeFileSync(path, remoteContent[1]);
        fontBlast(path, 'generated/font-awesome-' + faVersion, {
            filenames: convertFilenames,
            //png: 200
        });
    });
});

//Foundation icons
//This is silly because all icons are at https://github.com/zurb/foundation-icon-fonts/tree/master/svgs
urlLoader([
    'https://raw.githubusercontent.com/zurb/foundation-icon-fonts/master/_foundation-icons.scss',
    'https://raw.githubusercontent.com/zurb/foundation-icon-fonts/master/foundation-icons.svg'
], function (remoteContent) {
    var definitionLines = remoteContent[0].match(/.fi-.*?content.*?".*?"/g),
        convertFilenames = {};

    definitionLines.forEach(function (line) {
        var charName = line.match(/fi-(.*?):/)[1],
            charCode = line.match(/content.*?"(.*?)"/)[1];
        convertFilenames[charCode.replace('\\', '')] = charName;
    });

    tmp.tmpName(function (err, path) {
        fs.writeFileSync(path, remoteContent[1]);
        fontBlast(path, 'generated/zurb-foundation', {
            filenames: convertFilenames,
            //png: 200
        });
    });
});


var bsVersion = "v3.2.0";
urlLoader([
    'https://raw.githubusercontent.com/twbs/bootstrap/' + bsVersion + '/less/glyphicons.less',
    'https://raw.githubusercontent.com/twbs/bootstrap/' + bsVersion + '/fonts/glyphicons-halflings-regular.svg'
], function (remoteContent) {
    var definitionLines = remoteContent[0].match(/\.glyphicon\-.*?content.*?"(.*?)"/g),
        convertFilenames = {};
    definitionLines.forEach(function (line) {
        var charName = line.match(/glyphicon-(.*?)\s/)[1],
            charCode = line.match(/content.*?"(.*?)"/)[1];
        convertFilenames[charCode.replace('\\', '')] = charName;
    });

    tmp.tmpName(function (err, fontFilePath) {
        fs.writeFileSync(fontFilePath, remoteContent[1]);

        fontBlast(fontFilePath, 'generated/bootstrap-glyphicon-' + bsVersion, {
            filenames: convertFilenames
            //png: 200
        });
    });
});
