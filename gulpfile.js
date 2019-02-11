const gulp = require('gulp');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpackConfigDev = require('./webpack.config.dev.js');

const webserver = require('gulp-webserver');
const gulpEjs = require("gulp-ejs");
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const less = require("gulp-less");
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const WebpackDevServer = require('webpack-dev-server');

// const cluster = require('cluster');
// const os = require('os');
// const fs = require('fs');
const babel = require("gulp-babel");
const imageResize = require('gulp-image-resize');
const compression = require('compression');
const devBuild = ((process.env.NODE_ENV || 'development').trim().toLowerCase() === 'development');
let ASSETS = 'https://assets.socialignite.media';

if (devBuild) {
    ASSETS = 'http://localhost:8080';
}

gulp.task('favicon', async () => {
    return gulp.src(__dirname + '/src/img/raw/dark_logo.png')
        .pipe(imageResize({width: 32, height: 32}))
        .pipe(rename('favicon.ico'))
        .pipe(gulp.dest(__dirname + '/dist/'));
});

gulp.task('manifest', async () => {
    return gulp.src(__dirname + '/src/manifest.json')
        .pipe(gulp.dest(__dirname + '/dist/'))
});

gulp.task('serviceWorker', async () => {
    return gulp.src(__dirname + '/src/serviceWorker.js')
        .pipe(gulp.dest(__dirname + '/dist/'))
});

gulp.task('imageEditor', async () => {
    return gulp.src(__dirname + '/image_editor_src/dist/angular/assets/**/*')
        .pipe(gulp.dest(__dirname + '/dist/assets/'))
});

gulp.task('custom', async () => {
    return gulp.src(__dirname + '/src/custom/*.js')
        .pipe(gulp.dest(__dirname + '/dist/custom/'))
});

gulp.task('less', async () => {
    return gulp.src(__dirname + '/src/less/base.less')
        .pipe(less({}))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(concat('main.css'))
        .pipe(gulp.dest('./dist/css/'));
});

gulp.task('index', async () => {
    return gulp.src(__dirname + '/src/views/index.ejs')
        .pipe(gulpEjs({}, {}, {ext: '.html'}))
        .pipe(replace(/__ASSETS__/igm, ASSETS))
        .pipe(gulp.dest(__dirname + '/dist/'))
});

gulp.task('img', async () => {
    return gulp.src(['src/img/**/*', '!src/img/raw', '!src/img/raw/**'])
        .pipe(gulp.dest(__dirname + '/dist/img/'))
});

gulp.task('fonts', async () => {
    return gulp.src(__dirname + '/src/fonts/*.*')
        .pipe(gulp.dest(__dirname + '/dist/fonts/'))
});

// Development Tasks
gulp.task('webpack-dev-server', async () => {
    return new WebpackDevServer(webpack(webpackConfigDev), webpackConfigDev.devServer).listen(8080, function (err) {
        console.log("Booted up the dev front-end. Not to be used on production.");
    });
});

gulp.task('watch-dev', async () => {
    gulp.watch(__dirname + '/src/less/**/*.less', gulp.series('less'));
    gulp.watch(__dirname + '/src/manifest.json', gulp.series('manifest'));
    gulp.watch(__dirname + '/src/custom/*.js', gulp.series('custom'));
    gulp.watch(__dirname + '/src/img/*.*', gulp.series('img'));
    gulp.watch(__dirname + '/src/views/index.ejs', gulp.series('index'));
    return gulp.watch(__dirname + '/src/serviceWorker.js', gulp.series('serviceWorker'));

});

gulp.task('img-resize-boxed', async () => {
    return gulp.src(__dirname + '/src/img/raw/**.*')
        .pipe(imageResize({width: 512, height: 512})).pipe(gulp.dest(__dirname + '/src/img/boxed/512/'))
        .pipe(imageResize({width: 192, height: 192})).pipe(gulp.dest(__dirname + '/src/img/boxed/192/'))
        .pipe(imageResize({width: 180, height: 180})).pipe(gulp.dest(__dirname + '/src/img/boxed/180/'))
        .pipe(imageResize({width: 168, height: 168})).pipe(gulp.dest(__dirname + '/src/img/boxed/168/'))
        .pipe(imageResize({width: 144, height: 144})).pipe(gulp.dest(__dirname + '/src/img/boxed/144/'))
        .pipe(imageResize({width: 96, height: 96})).pipe(gulp.dest(__dirname + '/src/img/boxed/96/'))
        .pipe(imageResize({width: 72, height: 72})).pipe(gulp.dest(__dirname + '/src/img/boxed/72/'))
        .pipe(imageResize({width: 48, height: 48})).pipe(gulp.dest(__dirname + '/src/img/boxed/48/'))
        .pipe(imageResize({width: 32, height: 32})).pipe(gulp.dest(__dirname + '/src/img/boxed/32/'))
});
gulp.task('img-resize-custom', async () => {
    return gulp.src(__dirname + '/src/img/raw/**.*')
        .pipe(imageResize({width: 400})).pipe(gulp.dest(__dirname + '/src/img/thumbnail/w400/'))
});

gulp.task('img-resize', gulp.parallel('img-resize-boxed', 'img-resize-custom'));


// Production Tasks

gulp.task('webpack', async () => {
    return gulp.src(__dirname + '/src/app/**/*.js')
        .pipe(webpackStream(require('./webpack.config.js')), webpack)
        // .pipe(babel())
        .pipe(gulp.dest(__dirname + '/dist/'))
});

gulp.task('webserver', async () => {
    return gulp.src('dist')
        .pipe(webserver({
            livereload: false,
            host: '0.0.0.0',
            port: 8080,
            middleware: [
                compression(),
                function (req, res, next) {
                    let allowedOrigins = ['https://portal.socialignite.media', 'http://localhost:8080', 'https://cdn.socialignite.media', 'https://assets.socialignite.media'];
                    let origin = req.headers.origin;
                    if(allowedOrigins.indexOf(origin) > -1){
                        res.setHeader('Access-Control-Allow-Origin', origin);
                    }

                    res.setHeader('Access-Control-Allow-Origin', '');
                    res.setHeader('Access-Control-Allow-Credentials', 'true');
                    res.setHeader('Access-Control-Allow-Headers', '*');
                    next();
                }
            ],
            https: {
                cert: "certificates/socialignite.media.pem",
                key: "certificates/socialignite.media.key"
            },
            fallback: '/index.html',
            directoryListing: false,
            open: false
        }));
});

gulp.task('watch', async () => {
    gulp.watch(__dirname + '/src/views/index.ejs', gulp.series('index'));
});


// gulp.task('cluster', function () {
//     if (cluster.isMaster) {
//         const cpus = os.cpus().length;
//
//         console.log('Forking for ' + cpus + ' CPUs');
//         for (var i = 0; i < cpus; i++) {
//             cluster.fork();
//         }
//     } else {
//         gulp.start('default');
//     }
// });
//
//


// gulp.task('main', gulp.series('cluster'));

let listOfProcesses = [
    'favicon',
    'manifest',
    'serviceWorker',
    'less',
    'custom',
    'index',
    'img',
    'fonts',
    'imageEditor'
];

if (!devBuild) {
    listOfProcesses.push('webpack');
    listOfProcesses.push('webserver');
    listOfProcesses.push('watch');
} else {
    listOfProcesses.push('webpack-dev-server');
    listOfProcesses.push('watch-dev');
}

gulp.task('default', gulp.parallel(...listOfProcesses));

