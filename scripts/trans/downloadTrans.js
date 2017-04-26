/*global process*/
var http = require('http');
var fs = require('fs');
let translationToolURLs = {
    mobile: "http://translations-mobile.betconstruct.int/translations/app/get_language",
    desktop: "http://translations-desktop.betconstruct.int/translations/app/get_language"
};
var skin = process.env.skin;
var type = process.argv.slice(2)[0];

let check = (condition, errorMessage) => {
    if (condition) {
        console.error(errorMessage);
        process.exit(-1);
    }
};

check(!type, "please specify type (desktop or mobile)");
let translationToolURL = translationToolURLs[type];
check(!translationToolURL, "cannot find translation tool url for " + type);
check(!skin, "skin not specified");

let skinCcnfig = require("../../skins/" + skin + "/config.js");

if (!skinCcnfig.main.availableLanguages) {
    console.error("no languages specified in skin config");
    process.exit(-1);
}
console.log("downloading translations for skin " + skin);

var download = function (url, dest, cb) {
    if (url.indexOf('@replace') !== -1) {
        return; //skip this special property, it's not a language
    }
    var file = fs.createWriteStream(dest);
    var request = http.get(url, function (response) {
        response.pipe(file);
        file.on('finish', function () {
            file.close();
            cb && cb();
        });
    }).on('error', function (err) { // Handle errors
        fs.unlink(dest); // Delete the file async. (But we don't check the result)
        cb && cb(err.message);
    });

    request.setTimeout(60000, request.abort);
};
if (!fs.existsSync("./src/languages")) {
    fs.mkdirSync("./src/languages");
}

Object.keys(skinCcnfig.main.availableLanguages).map(
    lang => download(
        `${translationToolURL}/${skin}/languages/${lang}.json`,
        `./src/languages/${lang}.json`,
        () => console.log(`downloaded to ./src/languages/${lang}.json  from ${translationToolURL}/${skin}/languages/${lang}.json`)
    )
);

