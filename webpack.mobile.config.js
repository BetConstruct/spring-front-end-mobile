/* global require, __dirname, process*/
require('es6-promise').polyfill(); // needed for old node versions
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const path = require('path');
const PATH_SEP = require('escape-string-regexp')(path.sep); // cross-platform path separator (win: \ , unix: / )
const skinName = "vbet.com";
const configPath = path.resolve(path.join(".", "skins", skinName, "config.js"));
const skinConfig = require(configPath);

console.warn("Webpack running in ", process.env.NODE_ENV, " mode for skin " + skinName);

var plugins = [
    new webpack.DllReferencePlugin({
        context: '.',
        manifest: require('./src/js/vendor-manifest.json')
    }),
    new ExtractTextPlugin({filename: "[name].css?version=[contenthash]", disable: process.env.NODE_ENV !== "production"}),
    new AddAssetHtmlPlugin({filepath: './src/js/vendor.bundle.js', publicPath: "/js", outputPath: "js", hash: true, includeSourcemap: false}),
    new HtmlWebpackPlugin({
        template: 'index.template.ejs',
        hash: false,
        title: skinName,
        iosAppMetaContent: skinConfig.main.iosAppSettings && skinConfig.main.iosAppSettings.showIOSAppDownloadPopup && skinConfig.main.iosAppSettings.iosAppMetaContent,
        releaseDate: new Date(),
        minify: {
            removeComments: true,
            collapseWhitespace: true
        }
    }),

    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        '__SKIN__': JSON.stringify(skinName)
    })
];
//------------------------------- Production mode ----------------------------
if (process.env.NODE_ENV === "production") {

    // plugins.push(new webpack.optimize.DedupePlugin());
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
//-----------------------------------------------------------------------------

module.exports = {
    devServer: {
        inline: true,
        contentBase: './src',
        port: 3000,
        historyApiFallback: true
    },
    devtool: 'source-map',
    entry: {
        app: process.env.NODE_ENV === "production"
            ? './dev/index/mobileApp.js'
            : ['webpack-dev-server/client?http://0.0.0.0:3000', // WebpackDevServer host and port
                'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
                './dev/index/mobileApp.js']
    },
    module: {
        rules: [
            {   // for each component,  load it's  template.js, style.scss and override them from skin folder if needed
                enforce: 'pre',
                test: new RegExp(PATH_SEP + "(containers|components)" + PATH_SEP + ".+index\\.js$"),
                loader: 'baggage-loader?template.js=Template&style.scss&' +                             // main template & styles
                '../../../../skins/' + skinName + '/mobile/components/[dir]/style.scss&' +              // mobile components skin css overrides
                '../../skins/' + skinName + '/mobile/components/[dir]/style.scss&' +                    // generic components skin css overrides
                '../../../../skins/' + skinName + '/mobile/components/[dir]/template.js=Template&' +    // mobile components skin template override
                '../../skins/' + skinName + '/mobile/components/[dir]/template.js=Template'             // generic components skin template override
            },
            {   //Favicon support
                enforce: 'pre',
                test: new RegExp("mobileApp.js"),
                loader: 'baggage-loader?../../skins/' + skinName + '/favicon.ico&../../skins/' + skinName + '/favicon.gif&../../skins/' + skinName + '/favicon.png&'
            },
            {
                test: /\.js$/,
                loaders: process.env.NODE_ENV === "production" ? ['babel-loader'] : ['react-hot-loader', 'babel-loader'],
                exclude: /node_modules/
            },
            {
                test: /\.scss/,
                loader: ExtractTextPlugin.extract(
                    {
                        fallback: 'style-loader',
                        use: [
                            {
                                loader: 'css-loader',
                                options: {
                                    minimize: process.env.NODE_ENV === "production",
                                    sourceMap: process.env.NODE_ENV !== "production"
                                }
                            },
                            {
                                loader: 'sass-loader',
                                options: {
                                    includePaths: [path.join(__dirname, "skins", skinName, "mobile", "sass"), path.join(__dirname, "dev", "scss")]
                                }
                            }
                        ]
                    })
            },
            {test: /favicon\.(ico|gif|png)/, loader: "file-loader?name=./[name].[ext]"},
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                loader: process.env.NODE_ENV === "production"
                    ? "url-loader?limit=5120&name=./images/[name]_[hash].[ext]"  // images larger than 5kb will be loaded as files
                    : "url-loader"
            },
            // {checkDeviceForApp: /\.svg/,loader: 'svg-url-loader'},
            {
                test: /\.(svg|ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
                loader: process.env.NODE_ENV === "production"
                    ? "file-loader?name=./fonts/[name]_[hash].[ext]"
                    : "url-loader"
            }
        ]
    },
    output: {
        path: path.resolve(path.join(__dirname, "src")),
        publicPath: "/",
        filename: 'js/[name].min.js?[hash]'
    },
    plugins: plugins
};
