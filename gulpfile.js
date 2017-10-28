const gulp = require('gulp')
const plugin = require('gulp-load-plugins')(gulp)

const defenv = {
  ENV: 'production',
  RADARR_APIKEY: process.env.RADARR_APIKEY,
  RADARR_ENDPOINT: process.env.RADARR_ENDPOINT,
  SONARR_APIKEY: process.env.SONARR_APIKEY,
  SONARR_ENDPOINT: process.env.SONARR_ENDPOINT
}

const env = Object.assign(defenv, process.env)

gulp.task('build:clean', () => {
  return gulp.src('dist')
    .pipe(plugin.debug({
      title: '[clean]'
    }))
    .pipe(plugin.clean())
})

gulp.task('build:clean:docker', ['build:clean'], () => {
  return gulp.src('docker-clean.sh')
    .pipe(plugin.shell('bash <%= file.path %>'))
})

gulp.task('build:docker', ['build:clean:docker', 'build:ts'], () => {
  return gulp.src('docker-build.sh')
    .pipe(plugin.shell('bash <%= file.path %>'))
})

gulp.task('build:ts', () => {
  return gulp.src('src/**/*.ts')
    .pipe(plugin.debug({
      title: '[.ts]'
    }))
    .pipe(plugin.tslint())
    .pipe(plugin.typescript('tsconfig.json'))
    .pipe(gulp.dest('dist'))
})

gulp.task('build', ['build:docker'])
