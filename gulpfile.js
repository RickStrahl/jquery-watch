var gulp = require('gulp');

var merge = require('merge-stream');
var copy = require('gulp-copy');

//var gulpIgnore = require('gulp-ignore');
//var del = require('del');

//var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
//var minifyCSS = require('gulp-minify-css');

gulp.task('default', ['scripts'], function() {

});

gulp.task('scripts', function() {
    //del(['build']);

    var compressconcatjs = gulp
        .src(['src/scripts/jquery-watch.js'])
        .pipe(sourcemaps.init())         
        .pipe(uglify())
        //.pipe(sourcemaps.write("."))
        .pipe(gulp.dest('dist'));

    var copyjs = gulp
            .src(['src/scripts/jquery-watch.js'])            
            .pipe(copy())            
            .pipe(gulp.dest('dist'));


    //var concatjs = gulp
    //    .src(['app/js/app.js','app/js/**/*.js'])
    //    .pipe(concat('app.js'))
    //    .pipe(gulp.dest('build'));
   
    return merge(compressconcatjs,copyjs);
});

//gulp.task('css', function() {
//    var concatcss = gulp.src(['css/bootstrap.css', 'css/bootstrap-theme.css', 'css/musicstore.css'])
//       .pipe(gulpIgnore.exclude('**/*.min.*'))
//       .pipe(concat('app.css'))
//       .pipe(gulp.dest('build'));

//    var concatCompressCss = gulp.src(['css/bootstrap.css', 'css/bootstrap-theme.css', 'font-awesome.css', 'css/musicstore.css'])
//        .pipe(gulpIgnore.exclude('**/*.min.*'))
//        .pipe(concat('app.min.css'))
//        .pipe(minifyCSS({ keepBreaks: false }))
//        .pipe(gulp.dest('build'));

//    return merge( concatcss, concatCompressCss);
//});
gulp.task('watch', function () {
    gulp.watch('app/js/*.js', ['scripts']);
    gulp.watch('css/*.css', ['css']);
});


