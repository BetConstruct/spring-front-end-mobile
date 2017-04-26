/* global require, process */
/**
 * This script is used to generate .json translation files from .po files
 * Optionally existing translations can be loaded from additional .json file and
 * translations in generated .json files will be taken from this additional file(if they exist)
 *
 * command-line parameters:
 * from - required. path to .po file
 * lang - required. language
 * existing - optional. path to .json file with existing translations
 * formatted - optional. if set to true, output json will be formatted.
 *
 * script just outputs the json, if you want to save it, redirect input to a file
 * example:
 * node generateTranslations.js from=../eng.po lang=arm existing=./old_arm.json formatted=true > arm.json
 */
const po = require('node-po');
const fs = require('fs');
const path = require('path');
var args = process.argv.slice(2).map(arg => arg.split("=")).reduce((args, kv) => { args[kv[0]] = kv[1]; return args; }, {});

var poFile = args.from;
if (!fs.existsSync(poFile)) {
    console.error(`File ${poFile} doesn't exist!`);
    process.exit();
}
var lang = args.lang;
if (!lang) {
    console.error("Please specify language");
    process.exit();
}
var translations = {[lang]: {}};
var existing = {};
args.existing && (existing = require(path.resolve(args.existing))[lang]);
!existing && console.error(`no existing ${lang} translations found in ${args.existing}`);

po.load(poFile, function (_po) {
    _po.items.map(item => {
        translations[lang][item.msgid] = (existing && existing[item.msgid]) || item.msgstr.join();
    });
    console.log(JSON.stringify(translations, null, args.formatted ? 4 : 0));
});

