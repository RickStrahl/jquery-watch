var gulp = require('gulp');
var merge = require('merge-stream');
var uglify = require('gulp-uglify');

gulp.task('default', ['scripts'], function() {

});

gulp.task('scripts', function() {
    var compressconcatjs = gulp
        .src(['src/scripts/jquery-watch.js'])
        .pipe(uglify())        
        .pipe(gulp.dest('dist'));

    return merge(compressconcatjs); //,copyjs);
});

gulp.task('watch', function () {
    gulp.watch('src/scripts//*.js', ['scripts']);    
});


