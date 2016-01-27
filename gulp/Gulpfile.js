//carrega o gulp e os plugins
var gulp = require('gulp');
var htmlreplace = require('gulp-html-replace');
var uglify = require('gulp-uglify');
var cssnano= require('gulp-cssnano');
var concat = require('gulp-concat');
var rename = require('gulp-rename');

//Arquivos que serão concatenados
var libs_files = [
    // jquery -->
    "./../libs/jquery/jquery-1.11.3.min.js",
    "./../libs/jquery/jquery.mask/jquery.mask.min.js",
    "./../libs/jquery/jquery.form/jquery.form.js",

    // momentjs -->
    "./../libs/moment/moment.js",

    // bootstrap -->
    "./../libs/bootstrap/js/bootstrap.js",
    "./../libs/bootstrap/bootstrap.datepicker/js/bootstrap-datepicker.min.js",

    // bootstrap File Input-->
    "./../libs/bootstrap/bootstrap-fileinput/js/fileinput.min.js",
    "./../libs/bootstrap/bootstrap-fileinput/js/fileinput_locale_pt-BR.js",

    // alight -->
    "./../libs/alight/alight_0.10.last.min.js",
    "./../libs/alight/alight.mvc/alight.mvc.js",
    "./../libs/alight/alight.mvc/services/HttpService.js",
    "./../libs/alight/alight.mvc/services/ModuleService.js",
    "./../libs/alight/alight.mvc/services/ValidatorService.js",
    "./../libs/alight/alight.mvc/factories/HttpFactory.js",
    "./../libs/alight/alight.mvc/directives/ngName.js",
    "./../libs/alight/alight.mvc/directives/ngMask.js",
    "./../libs/alight/alight.mvc/directives/ngDisabled.js",
    "./../libs/alight/alight.mvc/directives/ngHide.js",
    "./../libs/alight/alight.mvc/directives/ngIncludeCache.js",
    "./../libs/alight/alight.mvc/directives/ngModule.js",
    "./../libs/alight/alight.mvc/directives/ngModel.js",
    "./../libs/alight/alight.ui/alight.ui.component.js",
    "./../libs/alight/alight.ui/ui.bootstrap/uiModal.js",
    "./../libs/alight/alight.ui/ui.bootstrap/uiDatepicker.js"
];

var app_files = [
    "./../services/DominioService.js",
    "./../services/OcrService.js",
    "./../docModel.js",
    "./../indexController.js"
];

var sheet_files = [
    "./../libs/bootstrap/css/bootstrap.min.css",
    "./../libs/bootstrap/bootstrap.datepicker/css/bootstrap-datepicker3.min.css",
    "./../libs/alight/alight.ui/alight.ui.css",
    "./../libs/bootstrap/themes/fabio.css",
    "./../css/style.css",
    "./../libs/bootstrap/bootstrap-fileinput/css/fileinput.min.css"
];

var dist_folder = './../dist/';

//cria libs.bundle.js
gulp.task('libs-bundle', function(){
    return gulp.src(libs_files)
        .pipe(concat('libs.bundle.js'))
        .pipe(gulp.dest(dist_folder));
});

//cria libs.bundle.min.js
gulp.task('libs-bundle-min', ['libs-bundle'], function () {
    return gulp.src(dist_folder+'libs.bundle.js')
        .pipe(rename('libs.bundle.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(dist_folder));
});

//cria index.bundle.js
gulp.task('index-bundle', function () {
    return gulp.src(app_files)
        .pipe(concat('index.bundle.js'))
        .pipe(gulp.dest(dist_folder));
});

//cria index.bundle.min.js
gulp.task('index-bundle-min', ['index-bundle'], function () {
    return gulp.src(dist_folder+'index.bundle.js')
        .pipe(rename('index.bundle.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(dist_folder));
});

//cria index.bundle.css
gulp.task('bundle-css', function(){
    return gulp.src(sheet_files)
        .pipe(concat('index.bundle.css'))
        .pipe(cssnano({discardComments: {removeAll: true}}))
        .pipe(gulp.dest(dist_folder));
});

gulp.task('index-php', function(){
    return gulp.src('./../index.php')
        .pipe(htmlreplace({css:'index.bundle.css', lib:'libs.bundle.js', app:'index.bundle.js'}))
        .pipe(gulp.dest(dist_folder));
});

gulp.task('copy-modules', function(){
    gulp.src(['./../modules/**/*']).pipe(gulp.dest(dist_folder+'modules'));
});

gulp.task('copy-env', function(){
    gulp.src(['./../env*']).pipe(gulp.dest(dist_folder));
});

gulp.task('default', ['libs-bundle-min', 'index-bundle-min', 'bundle-css', 'index-php', 'copy-modules', 'copy-env']);
