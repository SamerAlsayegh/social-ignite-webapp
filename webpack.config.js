const path = require("path");
const fs = require("fs");
const webpack = require("webpack");

// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    context: __dirname + "/src/app",
    entry: {
        app: ['./bootstrap.js'],
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
        // namedModules: true, // NamedModulesPlugin()
        // splitChunks: { // CommonsChunkPlugin()
        //     name: 'vendor',
        //     minChunks: 5,
        //     chunks: 'all'
        // },
        // minimizer: [new UglifyJsPlugin({
        //     cache: true,
        //     parallel: true,
        //     extractComments: true

        // })],
        minimizer: [new TerserPlugin({
            cache: true,
            extractComments: 'all',
            parallel: true
        })]

        // noEmitOnErrors: true, // NoEmitOnErrorsPlugin
        // concatenateModules: true //ModuleConcatenationPlugin
    },
    resolve: {
        extensions: [".json", ".js"],
        modules: [
            "node_modules",
            "src/app"
        ]
    },
    //
    // module: {
    //     rules: [
    //         {
    //             test: /\.js$/,
    //             exclude: /node_modules/,
    //             use: {
    //                 loader: "babel-loader"
    //             }
    //         },
    //     ]
    // },
};