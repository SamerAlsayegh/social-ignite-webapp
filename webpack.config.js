const path = require("path");
const fs = require("fs");
const webpack = require("webpack");

module.exports = {
    context: __dirname + "/src/app",
    entry: {
        app: ['babel-polyfill', './bootstrap.js'],
    },
    mode: 'production',
    output: {
        path: __dirname + "/dist/",
        filename: "[name].js"
    },
    plugins: [
        // new HardSourceWebpackPlugin(),
        new webpack.DefinePlugin({
            "__API__": JSON.stringify("https://portal.socialignite.media"),
            "__ASSETS__": JSON.stringify("https://assets.socialignite.media"),
            "__SOCKETS__": JSON.stringify("https://portal.socialignite.media"),
        }),
        new webpack.ProvidePlugin({
            _: "underscore"
        })
    ],
    optimization: {
        namedModules: true, // NamedModulesPlugin()
        splitChunks: { // CommonsChunkPlugin()
            name: 'vendor',
            minChunks: 5,
            chunks: 'all'
        },
        noEmitOnErrors: true, // NoEmitOnErrorsPlugin
        concatenateModules: true //ModuleConcatenationPlugin
    },
    resolve: {
        extensions: [".json", ".js"],
        modules: [
            "node_modules",
            "src/app"
        ]
    },
};