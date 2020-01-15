const gulp = require('gulp');
const babel = require('gulp-babel');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify');

gulp.task('babel', () => {
    return gulp
        .src('public/src/js/*.js')
        .pipe(babel({
            presets: ["@babel/preset-env"]
        }))
        .pipe(uglify())
        .pipe(gulp.dest('public/dist/js/'));
});

gulp.task('scss', () => {
    const sass = require('gulp-sass')
    const cssnext = require('postcss-cssnext')
    const postcss = require('gulp-postcss')
    const processors = [cssnext({
        browsers: ['last 2 version']
    })]

    return gulp
        .src('./public/src/scss/*.scss')
        .pipe(sass())
        .pipe(postcss(processors))
        .pipe(gulp.dest('public/dist/css/'))
});

gulp.task('build',
    gulp.parallel('babel', 'scss')
);

gulp.task('serve', done => {
    browserSync.init({
        server: {
            baseDir: './public',
            index: 'index.html',
        },
    })
    done()
})

gulp.task('watch', () => {
    const browserReload = done => {
        browserSync.reload()
        done()
    }
    gulp.watch('./public/**/*', browserReload);
    gulp.watch('./public/index.html', browserReload);
    gulp.watch('./public/src/js/*', gulp.series('babel'));
    gulp.watch('./public/src/scss/*', gulp.series('scss'));
})

gulp.task('default', gulp.series('serve', 'watch'))