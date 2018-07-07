import 'mocha'

import * as gulp from 'gulp'
import * as shell from 'gulp-shell'
import * as sourcemap from 'gulp-sourcemaps'
import * as tslint from 'gulp-tslint'
import * as gulpLoadPlugins from 'gulp-load-plugins'

import smerge = require('merge-stream')

import { Gulpclass, SequenceTask, Task } from 'gulpclass'

interface IDebugOptions {
  minimal?: boolean
  title: string
}

interface MochaSetupOptionsEx extends MochaSetupOptions {
  fullTrace?: boolean
  recursive?: boolean
}

interface Plugins extends IGulpPlugins {
  shell: shell.Shell
  tslint: tslint.TslintPlugin

  changed(name: string): any
  clean(): any
  debug(options?: IDebugOptions): any
  mocha(options: MochaSetupOptionsEx): any
  typescript(config: string): any
}

@Gulpclass()
export class GulpFile {
  private readonly plugins: Plugins
  private readonly target: NodeJS.ReadWriteStream

  constructor() {
    this.plugins = gulpLoadPlugins<Plugins>()
    this.target = gulp.dest('lib')
  }

  @SequenceTask()
  public build(): any {
    return ['clean', 'compile']
  }

  @Task()
  public clean(): NodeJS.ReadWriteStream {
    return this.src('clean', ['lib'])
      .pipe(this.plugins.clean())
  }

  @Task('compile', ['lint'])
  public compile(): NodeJS.ReadWriteStream {
    const stream = this.src('tsc', ['src/**/*.ts', 'src/**/*.tsx'])
      .pipe(this.plugins.changed('lib'))
      .pipe(sourcemap.init())
      .pipe(this.plugins.typescript('tsconfig.build.json'))

    return smerge(stream, stream.js)
      .pipe(sourcemap.write('.'))
      .pipe(this.target)
  }

  @Task('lint')
  public lint(): NodeJS.ReadWriteStream {
    const plugin: tslint.PluginOptions = {
      formatter: 'prose',
    }

    const report: tslint.ReportOptions = {
      allowWarnings: true,
      emitError: true,
      reportLimit: undefined,
      summarizeFailureOutput: true,
    }

    return this.src('tslint', 'src/**/*.ts')
      .pipe(this.plugins.tslint(plugin))
      .pipe(this.plugins.tslint.report(report))
  }

  @Task('test', ['build'])
  public test(): NodeJS.ReadWriteStream {
    return this.src('test', 'src/**/*.spec.ts')
      .pipe(this.plugins.mocha({
        bail: true,
        fullTrace: true,
        recursive: true,
        reporter: 'spec',
        require: ['ts-node/register', 'tsconfig-paths/register'],
      }))
  }

  private src(title: string, sources: string | string[]): NodeJS.ReadWriteStream {
    const pipeline = gulp.src(sources)

    if (process.env.NODE_ENV !== 'production') {
      return pipeline
    }

    const options: IDebugOptions = { title: `[${title}]` }
    return pipeline.pipe(this.plugins.debug(options))
  }
}
