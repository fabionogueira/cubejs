
//carrega o gulp e os plugins
var fs     = require('fs');
var gulp   = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var jshint = require('gulp-jshint');
var header = require("gulp-header");

var version = '0.0.1';
var dist_folder = './../dist/';
var copyright = '/**\n'+
                ' * CubeJS '+version+'\n'+
                ' * 2016-01-30, (c) 2016 Fábio Nogueira\n'+
                ' * Released under the MIT License.\n'+
                ' * Full source at https://github.com/fabionogueira/cubejs\n'+
                '*/\n';

//Arquivos que serão concatenados em cubejs.js
var al_files = {
    core: [
        "./../src/CubeJS.js"],
    plugins: [
        "./../src/plugins/es.plugin.js",
        "./../src/plugins/operations.plugin.js",
        "./../src/plugins/functions.plugin.js",
        "./../src/plugins/table.plugin.js"]
};

var getCopyright = function (path) {
    return fs.readFileSync(path+'copyright');
};
var getVersion = function (path) {
    return fs.readFileSync(path+'version');
};

//checa o código de todos os arquivos que serão concatenados
gulp.task('jshint-all', function(){
    return gulp.src(al_files.core.concat(al_files.plugins))
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

//cria cubejs.js
gulp.task('cubejs', ['jshint-all'], function(){
    return gulp.src(al_files.core)
        .pipe(concat('cubejs.js'))
        .pipe(gulp.dest(dist_folder));
});

//cria cubejs.plugins.js
gulp.task('cubejs-plugins', ['jshint-all'], function(){
    return gulp.src(al_files.plugins)
        .pipe(concat('cubejs.plugins.js'))
        .pipe(gulp.dest(dist_folder));
});

//cria cubejs.min.js
gulp.task('cubejs-min', ['cubejs'], function () {
    return gulp.src(dist_folder+'cubejs.js')
        .pipe(rename('cubejs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(dist_folder));
});

//cria cubejs.plugins.min.js
gulp.task('cubejs-plugins-min', ['cubejs-plugins'], function () {
    return gulp.src(dist_folder+'cubejs.plugins.js')
        .pipe(rename('cubejs.plugins.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(dist_folder));
});

//adiciona o copyright no cubejs.min.js
gulp.task('copyright', ['cubejs-min'], function () {
    return gulp.src([dist_folder+'cubejs.min.js'])
        .pipe(header(getCopyright('./../src/'), {version: getVersion('./../src/')}))
        .pipe(gulp.dest(dist_folder));
});

//adiciona o copyright no cubejs.plugin.min.js
gulp.task('copyright-plugins', ['cubejs-plugins-min'], function () {
    return gulp.src([dist_folder+'cubejs.plugins.min.js'])
        .pipe(header(getCopyright('./../src/plugins/'), {version: getVersion('./../src/plugins/')}))
        .pipe(gulp.dest(dist_folder));
});

gulp.task('default', ['cubejs-min', 'cubejs-plugins-min', 'copyright', 'copyright-plugins']);
