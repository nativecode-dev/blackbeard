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
  return source(`shell:${name}`, name)
    .pipe(plugin.shell('bash <%= file.path %>'))
}

const source = (title, src) => {
  const pipeline = gulp.src(src)

  if (process.env.NODE_ENV !== 'production') {
    return pipeline
  }

  return pipeline.pipe(plugin.debug({
    title: `[${title}]`
  }))
}

gulp.task('build', ['clean', 'lint'], () => {
  return source('tsc', 'src/**/*.ts')
    .pipe(plugin.changed('dist'))
    .pipe(plugin.typescript('tsconfig.json'))
    .pipe(gulp.dest('dist'))
})

gulp.task('clean', ['docker:clean'], () => {
  return source('[clean]', 'dist')
    .pipe(plugin.clean())
})

gulp.task('docker', ['build'], () => {
  return script('docker-build.sh')
})

gulp.task('docker:clean', () => {
  return script('docker-clean.sh')
})

gulp.task('lint', () => {
  return source('tslint', 'src/**/*.ts')
    .pipe(plugin.tslint({
      formatter: 'prose'
    }))
    .pipe(plugin.tslint.report({
      allowWarnings: true,
      summarizeFailureOutput: true
    }))
})

gulp.task('test', ['build'], () => {
  return source('mocha', '**/*.spec.ts')
    .pipe(plugin.mocha({
      bail: true,
      require: ['ts-node/register', 'tsconfig-paths/register'],
      reporter: 'list',
      fullTrace: true,
      recursive: true
    }))
})
