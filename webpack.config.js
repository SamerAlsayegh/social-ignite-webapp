const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');


module.exports = {
    context: __dirname + "/src/app",
    entry: {
        app: ['babel-polyfill', './bootstrap.js'],
    },
    output: {
        path: __dirname + "/dist/",
        filename: "[name].js"
    },
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: false,
        public: "portal.socialignite.media",
        before: function (app) {
            app.get("*", function (req, res, next) {
                var url = req.url;
                if (url.indexOf("?") >= 0) url = url.split("?")[0];
                if (fs.existsSync(path.join(__dirname, "dist/" + url)) || url.endsWith(".js") || url.endsWith(".js.gz")) return next();
                else res.sendFile(path.join(__dirname, "dist/index.html"))
            });
        }
    },
    plugins: [
        new HardSourceWebpackPlugin(),
        // This would only run on debug files...
        new webpack.DefinePlugin({
            "__API__": JSON.stringify("http://localhost:8000"),
            "__ASSETS__": JSON.stringify("http://localhost:8080"),
            "__SOCKETS__": JSON.stringify("http://localhost:8001"),
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
            {test: require.resolve("moment"), loader: "expose-loader?moment"},

            {
                use: [{
                    loader: "expose-loader",
                    options: "wait"
                }]
            },

        ]
    },
};