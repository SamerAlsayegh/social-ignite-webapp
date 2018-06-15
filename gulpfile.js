const gulp = require('gulp');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');
const webpackConfigDev = require('./webpack.config.dev.js');
const webserver = require('gulp-webserver');
const gulpEjs = require("gulp-ejs");
const rename = require('gulp-rename');
const less = require("gulp-less");
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const WebpackDevServer = require('webpack-dev-server');
const pack = webpackStream(webpackConfig);
const cluster = require('cluster');
const os = require('os');
const imageResize = require('gulp-image-resize');

gulp.task('webpack', function() {
    return gulp.src(__dirname + '/src/app/**/*.js')
        .pipe(pack, webpack)
        .pipe(gulp.dest(__dirname + '/dist/'))
});

gulp.task('manifest', function() {
    return gulp.src(__dirname + '/src/manifest.json')
        .pipe(gulp.dest(__dirname + '/dist/'))
});

gulp.task('watch', function() {
    gulp.watch(__dirname + '/src/app/**/*.js', ['webpack']);
    gulp.watch(__dirname + '/src/less/**/*.less', ['less']);
    gulp.watch(__dirname + '/src/app/views/**/*.ejs', ['views']);
    gulp.watch(__dirname + '/src/manifest.json', ['manifest']);
    gulp.watch(__dirname + '/src/custom/*.js', ['custom']);
    gulp.watch(__dirname + '/src/img/*.*', ['img']);
    gulp.watch(__dirname + '/src/views/index.ejs', ['index']);
    gulp.watch(__dirname + '/src/serviceWorker.js', ['serviceWorker']);

});

gulp.task('views', function() {
    return gulp.src(__dirname + '/src/app/views/**/*.ejs')
        .pipe(gulpEjs({},{}, {ext:'.html'}))
        .pipe(gulp.dest(__dirname + '/dist/'))
});

gulp.task('custom', function() {
    return gulp.src(__dirname + '/src/custom/*.js')
        .pipe(gulp.dest(__dirname + '/dist/custom/'))
});

gulp.task('serviceWorker', function() {
    return gulp.src(__dirname + '/src/serviceWorker.js')
        .pipe(gulp.dest(__dirname + '/dist/'))
});

gulp.task('img-resize-boxed', function() {
    return gulp.src(__dirname + '/src/img/raw/**.*')
        .pipe(imageResize({width : 512, height : 512})).pipe(gulp.dest(__dirname + '/src/img/boxed/512/'))
        .pipe(imageResize({width : 192, height : 192})).pipe(gulp.dest(__dirname + '/src/img/boxed/192/'))
        .pipe(imageResize({width : 180, height : 180})).pipe(gulp.dest(__dirname + '/src/img/boxed/180/'))
        .pipe(imageResize({width : 168, height : 168})).pipe(gulp.dest(__dirname + '/src/img/boxed/168/'))
        .pipe(imageResize({width : 144, height : 144})).pipe(gulp.dest(__dirname + '/src/img/boxed/144/'))
        .pipe(imageResize({width : 96, height : 96})).pipe(gulp.dest(__dirname + '/src/img/boxed/96/'))
        .pipe(imageResize({width : 72, height : 72})).pipe(gulp.dest(__dirname + '/src/img/boxed/72/'))
        .pipe(imageResize({width : 48, height : 48})).pipe(gulp.dest(__dirname + '/src/img/boxed/48/'))
        .pipe(imageResize({width : 32, height : 32})).pipe(gulp.dest(__dirname + '/src/img/boxed/32/'))
});
gulp.task('img-resize-custom', function() {
    return gulp.src(__dirname + '/src/img/raw/**.*')
        .pipe(imageResize({width : 400})).pipe(gulp.dest(__dirname + '/src/img/thumbnail/w400/'))
});

gulp.task('favicon', function() {
    return gulp.src(__dirname + '/src/img/raw/dark_logo.png')
        .pipe(imageResize({width : 32, height: 32}))
        .pipe(rename('favicon.ico'))
        .pipe(gulp.dest(__dirname + '/dist/'));
});

gulp.task('img-resize', ['img-resize-boxed', 'img-resize-custom']);

gulp.task('img', function() {
    return gulp.src(['src/img/**/*', '!src/img/raw', '!src/img/raw/**'])
        .pipe(gulp.dest(__dirname + '/dist/img/'))
});
gulp.task('fonts', function() {
    return gulp.src(__dirname + '/src/fonts/*.*')
        .pipe(gulp.dest(__dirname + '/dist/fonts/'))
});

gulp.task('index', function() {
    return gulp.src(__dirname + '/src/views/index.ejs')
        .pipe(gulpEjs({},{}, {ext:'.html'}))
        .pipe(gulp.dest(__dirname + '/dist/'))
});

gulp.task('less', function () {
    return gulp.src(__dirname + '/src/less/base.less')
        .pipe(less({}))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(concat('main.css'))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('./dist/css/'));
});
// gulp.task('please-wait', function () {
//     return gulp.src(__dirname + '/node_modules/please-wait/build/please-wait.css')
//         .pipe(new cleanCSS({
//             level: {
//                 2: {
//                     all: true, // sets all values to `false`
//                     // removeDuplicateRules: true // turns on removing duplicate rules
//                 }
//             }
//         }))
//         .pipe(gulp.dest('./dist/css/'));
// });


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
            port: 8080,
            https: {
                cert: "/etc/letsencrypt/live/portal.socialignite.media/fullchain.pem",
                key: "/etc/letsencrypt/live/portal.socialignite.media/privkey.pem"
            },
            fallback: '/index.html',
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
gulp.task('default', ['favicon', 'manifest', 'serviceWorker', 'less','views', 'custom', 'index', 'img', 'watch', 'webserver', 'fonts', 'webpack']);
gulp.task('debug', ['favicon', 'manifest', 'serviceWorker', 'less','views', 'custom', 'index', 'img', 'watch', 'webpack-dev-server', 'fonts', 'webpack']);
