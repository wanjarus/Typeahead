'use strict';
const gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    babel = require('gulp-babel'),
    concat = require('gulp-concat'),
    server = require('karma').Server,
    wrap = require("gulp-wrap");

// Concatenate & Minify JS
gulp.task('scripts', function () {
    return gulp.src('src/*.js')
        .pipe(concat('typeahead.js'))
        .pipe(wrap('(function ($) {<%= contents %>}(window.jQuery));'))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('dist'))
        .pipe(rename('typeahead.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

gulp.task('test', ['scripts'], function (done) {
    new server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, function (exitCode) {
        done();
        process.exit(exitCode);
    }).start();
});

// Watch for file changes and re-run tests on each change
gulp.task('tdd', function (done) {
    new server({
        configFile: __dirname + '/karma.conf.js'
    }, function () {
        done();
    }).start();
    return gulp.watch('src/*.js', ['scripts']);
});

gulp.task('deploy', ['scripts']);
gulp.task('default', ['scripts', 'test']);
