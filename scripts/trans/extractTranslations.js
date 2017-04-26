/**
 * This script extracts all translatable strings from code and outputs in .po format
 */

/* global require, process*/
var recursive = require('recursive-readdir');
var path = require("path");
var fs = require('fs');

var regex = /\Wt\(['"].+?['"](,.+)*\)/g, strings = [];
var alreadyAdded = {};
recursive(`.${path.sep}dev`, function (err, files) {
    if (err) {
        return console.warn(err);
    }
    files.map(file => {
        if (path.extname(file) === ".js" || path.extname(file) === ".html") {
            var contents = fs.readFileSync(file, 'utf8');
            var matches = contents.match(regex);
            if (matches) {
                strings = strings.concat(matches);
            }
        }
    });
    const poHeader = 'msgid ""\nmsgstr ""\n"Content-Type: text/plain; charset=UTF-8\\n"\n"Content-Transfer-Encoding: 8bit\\n"\n\n';
    process.stdout.write(poHeader);
    strings.map(t => {
        let match = t.match(/["'](.*)['"]/g)[0];
        return match.substr(1).substr(0, match.length - 2).replace('"', '\\"');
    }).map(str => {
        if (!alreadyAdded[str]) {
            process.stdout.write(`#\nmsgid "${str}"\nmsgstr "${str}"\n\n`);
            alreadyAdded[str] = true;
        }
    });
});

