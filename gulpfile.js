const gulp = require('gulp');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');
const webpackConfigDev = require('./webpack.config.dev.js');
const webserver = require('gulp-webserver');
const gulpEjs = require("gulp-ejs");
const less = require("gulp-less");
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const WebpackDevServer = require('webpack-dev-server');
const pack = webpackStream(webpackConfig);
const fs = require('fs');
const cluster = require('cluster');
const os = require('os');


gulp.task('webpack', function() {
    return gulp.src(__dirname + '/src/app/**/*.js')
        .pipe(pack, webpack)
        .pipe(gulp.dest(__dirname + '/dist/'))
});
gulp.task('watch', function() {
    gulp.watch(__dirname + '/src/app/**/*.js', ['webpack']);
    gulp.watch(__dirname + '/src/less/**/*.less', ['less']);
    gulp.watch(__dirname + '/src/app/views/**/*.ejs', ['views']);

});

gulp.task('views', function() {
    return gulp.src(__dirname + '/src/app/views/**/*.ejs')
        .pipe(gulpEjs({},{}, {ext:'.html'}))
        .pipe(gulp.dest(__dirname + '/dist/pub/'))
});

gulp.task('custom', function() {
    return gulp.src(__dirname + '/src/custom/*.js')
        .pipe(gulp.dest(__dirname + '/dist/pub/custom/'))
});

gulp.task('img', function() {
    return gulp.src(__dirname + '/src/img/*.*')
        .pipe(gulp.dest(__dirname + '/dist/pub/img/'))
});
gulp.task('fonts', function() {
    return gulp.src(__dirname + '/src/fonts/*.*')
        .pipe(gulp.dest(__dirname + '/dist/pub/fonts/'))
});

gulp.task('index', function() {
    return gulp.src(__dirname + '/src/views/index.ejs')
        .pipe(gulpEjs({},{}, {ext:'.html'}))
        .pipe(gulp.dest(__dirname + '/dist/pub/'))
});

gulp.task('less', function () {
    return gulp.src(__dirname + '/src/less/base.less')
        .pipe(less({}))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(concat('main.css'))
        .pipe(gulp.dest('./dist/pub/css/'));
});
gulp.task('please-wait', function () {
    return gulp.src(__dirname + '/node_modules/please-wait/build/please-wait.css')
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('./dist/pub/css/'));
});


gulp.task('webpack-dev-server', function () {
    // Start a webpack-dev-server
    new WebpackDevServer(webpack(webpackConfigDev), webpackConfigDev.devServer).listen(8080, function(err) {
        console.log("Booted up the dev front-end. Not to be used on production.");
    });
});

gulp.task('webserver', function() {
    gulp.src('dist')
        .pipe(webserver({
            livereload: false,
            host: 'portal.socialignite.media',
            port: 443,
            https: {
                cert: "/etc/letsencrypt/live/portal.socialignite.media/fullchain.pem",
                key: "/etc/letsencrypt/live/portal.socialignite.media/privkey.pem"
            },
            fallback: '/pub/index.html',
            directoryListing: false,
            open: false
        }));
});


gulp.task('cluster', function() {
    if (cluster.isMaster) {
        const cpus = os.cpus().length;

        console.log('Forking for ' + cpus + ' CPUs');
        for (var i = 0; i<cpus; i++) {
            cluster.fork();
        }
    } else {
        gulp.start('default');
    }
});

gulp.task('main', ['cluster']);
gulp.task('default', ['less','views', 'custom', 'index', 'please-wait', 'img', 'watch', 'webserver', 'fonts', 'webpack']);
gulp.task('debug', ['less','views', 'custom', 'index', 'please-wait', 'img', 'watch', 'webpack-dev-server', 'fonts']);
