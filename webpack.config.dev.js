const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
    context: __dirname + "/src/app",
    entry: {
        app: ['babel-polyfill',"./bootstrap.js"],
    },
    output: {
        path: __dirname + "/dist/pub/",
        filename: "[name].js"
    },
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: false,
        public: "portal.socialignite.media",
        before: function (app){
            app.get("*", function(req, res, next) {
                var url = req.url;
                if (
                    url.endsWith(".js") ||
                    url.startsWith("/pub/")) return next();
                else res.sendFile(path.join(__dirname, "dist/pub/index.html"))
            });
        }
    },

    plugins: [
        new webpack.DefinePlugin({
            // "API": JSON.stringify("http://localhost:8000") // Keep this commented unless you have access to a local backend copy.
            "API": JSON.stringify("https://portal.socialignite.media:8000")
        }),
    ],

    resolve: {
        extensions: [".json", ".js"],
        modules: [
            "node_modules",
            "src/app"
        ]
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "babel-loader",
                }
            },
            { test: require.resolve("moment"), loader: "expose-loader?moment" },
            {
                use: [{
                    loader: "expose-loader",
                    options: "wait"
                }]
            },

        ]
    },
};