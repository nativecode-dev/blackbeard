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

const script = (name) => {
  return gulp.src(name)
    .pipe(plugin.debug({
      title: `[${name}]`
    }))
    .pipe(plugin.shell('bash <%= file.path %>'))
}

gulp.task('clean', ['docker:clean'], () => {
  return gulp.src('dist')
    .pipe(plugin.debug({
      title: '[clean]'
    }))
    .pipe(plugin.clean())
})

gulp.task('docker:clean', () => {
  return script('docker-clean.sh')
})

gulp.task('build', ['build:ts'], () => {
  return script('docker-build.sh')
})

gulp.task('build:ts', ['clean'], () => {
  return gulp.src('src/**/*.ts')
    .pipe(plugin.debug({
      title: '[.ts]'
    }))
    .pipe(plugin.tslint())
    .pipe(plugin.typescript('tsconfig.json'))
    .pipe(gulp.dest('dist'))
})
