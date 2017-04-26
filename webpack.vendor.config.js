/* global require, process*/
const webpack = require('webpack');
const path = require('path');
console.warn("Webpack building vendor bundle (", process.env.NODE_ENV, ")");

var plugins = [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)})
];

if (process.env.NODE_ENV === "production") {

    plugins.push(new webpack.optimize.UglifyJsPlugin({
        minimize: true,
        sourceMap: false,
        output: {
            comments: false
        },
        compress: {
            drop_console: true,
            warnings: false
        }
    }));
}

plugins.push(new webpack.DllPlugin({
    name: 'vendor_lib',
    path: 'src/js/vendor-manifest.json'
}));

//-----------------------------------------------------------------------------

module.exports = {
    entry: {
        vendor: [
            "lodash",
            "core-js",
            "moment",
            "react",
            "redux",
            "react-dom",
            "react-cookie",
            "react-redux",
            "redux-form",
            "redux-persist",
            "react-router",
            "react-scroll",
            "history",
            "redux-promise",
            "redux-thunk",
            "reselect",
            "whatwg-fetch",
            "react-telephone-input",
            "react-datepicker",
            "json-hash",
            "react-ga"
        ]
    },
    output: {
        path: path.resolve(path.join(__dirname, "src")),
        filename: 'js/vendor.bundle.js',
        library: 'vendor_lib'
    },
    plugins: plugins
};
