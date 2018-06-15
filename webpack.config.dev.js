const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')


module.exports = {
    context: __dirname + "/src/app",
    entry: {
        app: ['babel-polyfill', "./bootstrap.js"],
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
                console.log(fs.existsSync(path.join(__dirname, "dist/" + url)), url);
                if (fs.existsSync(path.join(__dirname, "dist/" + url)) || url.endsWith(".js")) return next();
                else res.sendFile(path.join(__dirname, "dist/index.html"))
            });
        }
    },

    plugins: [
        new HardSourceWebpackPlugin(),
        new webpack.DefinePlugin({
            "API": JSON.stringify("http://localhost:8000"), // Keep this commented unless you have access to a local backend copy.
            "ASSETS": JSON.stringify("http://localhost:8080"),
            "SOCKET": JSON.stringify("http://localhost:8001"), // Keep this commented unless you have access to a local backend copy.
            // "API": JSON.stringify("https://portal.socialignite.media:8000")
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
        rules: [
            {
                test: require.resolve('moment'),
                use: [{
                    loader: 'expose-loader',
                    options: 'moment'
                }]
            },]
    },
};