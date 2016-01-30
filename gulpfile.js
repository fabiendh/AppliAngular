var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var useref      = require('gulp-useref');
var sass        = require('gulp-sass');

// Static server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./src/"
        }
    });
});

gulp.task('copy-angular-template', function(done){
  gulp.src(['src/assets/template/**/*'])
  .pipe(gulp.dest('www/assets/template/'))
  .on('end', done);
});

gulp.task('make', ['copy-angular-template'], function () {
    return gulp.src('src/*.html')
        .pipe(useref())
        .pipe(gulp.dest('www'));
});

gulp.task('serve', ['sass'], function() {

    browserSync.init({
        server: "./src"
    });

    gulp.watch("src/assets/scss/*.scss", ['sass']);
    gulp.watch("src/*.html").on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("src/assets/scss/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("src/assets/css"))
        .pipe(browserSync.stream());
});
