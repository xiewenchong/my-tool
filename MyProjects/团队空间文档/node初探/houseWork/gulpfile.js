var gulp = require('gulp');
var babel = require('gulp-babel');
var autoprefixer = require('gulp-autoprefixer');
var watchPath = require('gulp-watch-path');
var minifyCss = require('gulp-clean-css');
var uglifyJs = require('gulp-uglify');
var combiner = require('stream-combiner2');
var gutil = require('gulp-util');
var px2rem = require('gulp-px2rem-plugin');
var clean = require('gulp-clean');

var handleError = function(err) {
    var colors = gutil.colors;
    console.log('\n');
    gutil.log(colors.red('Error!'));
    gutil.log('fileName: ' + colors.red(err.fileName));
    // gutil.log('lineNumber: ' + colors.red(err.loc.line));
    gutil.log('message: ' + err.message);
    gutil.log('plugin: ' + colors.yellow(err.plugin));
};

var SRC_HOST = 'src/',
    DIST_HOST = 'servers/static/';

var SRC_JS_PATH = SRC_HOST + 'js/',
    SRC_CSS_PATH = SRC_HOST + 'style/',
    SRC_IMG_PATH = SRC_HOST + 'images/',
    DIST_JS_PATH = DIST_HOST + 'js/',
    DIST_CSS_PATH = DIST_HOST + 'style/',
    DIST_IMG_PATH = DIST_HOST + 'images/';

gulp.task('clean', function() {
    gulp.src(DIST_HOST + '*').pipe(clean());
});

gulp.task('default', function() {
    gulp
        .src(SRC_JS_PATH + '*.js')
        .pipe(babel())
        // .pipe(uglifyJs())
        .pipe(gulp.dest(DIST_JS_PATH));
    gulp
        .src(SRC_CSS_PATH + '*.css')
        .pipe(
            autoprefixer({
                browsers: ['last 20 versions'],
                cascade: true,
                remove: true
            })
        )
        .pipe(
            px2rem({
                width_design: 750,
                pieces: 10
            })
        )
        .pipe(minifyCss())
        .pipe(gulp.dest(DIST_CSS_PATH));
    gulp.src(SRC_IMG_PATH + '*').pipe(gulp.dest(DIST_IMG_PATH));
    gulp.watch(SRC_JS_PATH + '*.js', function(event) {
        var paths = watchPath(event, SRC_JS_PATH, DIST_JS_PATH);
        var combined = combiner.obj([
            gulp.src(paths.srcPath),
            babel(),
            // uglifyJs(),
            gulp.dest(paths.distDir)
        ]);
        combined.on('error', handleError);
    });
    gulp.watch(SRC_CSS_PATH + '*.css', function(event) {
        var paths = watchPath(event, SRC_CSS_PATH, DIST_CSS_PATH);
        var combined = combiner.obj([
            gulp.src(paths.srcPath),
            autoprefixer({
                browsers: ['last 20 versions'],
                cascade: true,
                remove: true
            }),
            px2rem({
                width_design: 750,
                pieces: 10
            }),
            minifyCss(),
            gulp.dest(paths.distDir)
        ]);
        combined.on('error', handleError);
    });
});
