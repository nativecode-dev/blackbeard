import 'mocha'

import * as copy from 'gulp-copy'
import * as gulp from 'gulp'
import * as shell from 'gulp-shell'
import * as tslint from 'gulp-tslint'
import * as gulpLoadPlugins from 'gulp-load-plugins'

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
  copy(options?: copy.GulpCopyOptions): any
  debug(options?: IDebugOptions): any
  mocha(options: MochaSetupOptionsEx): any
  typescript(config: string): any
}

@Gulpclass()
export class GulpFile {
  private readonly plugins: Plugins
  private readonly target: any

  constructor() {
    this.plugins = gulpLoadPlugins<Plugins>()
    this.target = gulp.dest('dist')
  }

  @Task()
  public assets(): void {
    return gulp.src('src/**/*.html')
      .pipe(this.target)
  }

  @SequenceTask()
  public build(): any {
    return ['clean', 'compile']
  }

  @Task()
  public clean(): NodeJS.ReadWriteStream {
    return this.source('clean', ['dist'])
      .pipe(this.plugins.clean())
  }

  @Task('compile', ['lint'])
  public compile(): NodeJS.ReadWriteStream {
    return this.source('tsc', 'src/**/*.ts')
      .pipe(this.plugins.changed('dist'))
      .pipe(this.plugins.typescript('tsconfig.json'))
      .pipe(this.target)
  }

  @Task('docker', ['build', 'docker-clean'])
  public docker(): NodeJS.ReadWriteStream {
    return this.run('docker-build.sh')
  }

  @Task('docker-clean')
  public dockerClean(): NodeJS.ReadWriteStream {
    return this.run('docker-clean.sh')
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

    return this.source('tslint', 'src/**/*.ts')
      .pipe(this.plugins.tslint(plugin))
      .pipe(this.plugins.tslint.report(report))
  }

  @Task('test', ['build'])
  public test(): NodeJS.ReadWriteStream {
    return this.source('test', 'src/**/*.spec.ts')
      .pipe(this.plugins.mocha({
        bail: true,
        fullTrace: true,
        recursive: true,
        reporter: 'list',
        require: ['ts-node/register', 'tsconfig-paths/register'],
      }))
  }

  private run(filename: string): NodeJS.ReadWriteStream {
    return this.source(`bash:${filename}`, filename)
      .pipe(this.plugins.shell('bash <%= file.path %>'))
  }

  private source(title: string, sources: string | string[]): NodeJS.ReadWriteStream {
    const pipeline = gulp.src(sources)

    if (process.env.NODE_ENV !== 'production') {
      return pipeline
    }

    return pipeline.pipe(this.plugins.debug({
      title: `[${title}]`
    }))
  }
}
