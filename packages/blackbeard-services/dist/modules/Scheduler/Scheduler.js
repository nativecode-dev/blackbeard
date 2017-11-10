"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const schedule = require("node-schedule");
const inversify_1 = require("inversify");
const blackbeard_1 = require("blackbeard");
let Scheduler = class Scheduler extends blackbeard_1.HydraModule {
    constructor(config, files, platform, logger, scripts) {
        super(files, logger, platform);
        this.scripts = scripts;
    }
    get name() {
        return 'scheduler';
    }
    configure() {
        return __awaiter(this, void 0, void 0, function* () {
            this.schedulerConfig = yield this.getConfig();
            return this.schedulerConfig.module;
        });
    }
    run(...args) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const jobs = this.schedulerConfig.jobs.map((config) => this.job(config));
                this.log.info(`${jobs.length} job(s) scheduled`);
                process.on('beforeExit', () => {
                    jobs.forEach(job => job.cancel());
                    resolve();
                });
                yield Promise.all(jobs);
            }
            catch (error) {
                this.log.error(error);
                reject(error);
            }
        }));
    }
    job(config) {
        this.log.info(`creating job to run script "${config.script}"`);
        return schedule.scheduleJob(`job:${config.script}`, config.schedule, () => __awaiter(this, void 0, void 0, function* () {
            const scripts = this.scripts
                .filter(script => script.name === config.script)
                .map(script => script.start());
            yield Promise.all(scripts);
        }));
    }
};
Scheduler = __decorate([
    inversify_1.injectable(),
    __param(3, inversify_1.inject(blackbeard_1.LoggerType)),
    __param(4, inversify_1.multiInject(blackbeard_1.ScriptType)),
    __metadata("design:paramtypes", [typeof (_a = typeof blackbeard_1.Config !== "undefined" && blackbeard_1.Config) === "function" && _a || Object, typeof (_b = typeof blackbeard_1.FileSystem !== "undefined" && blackbeard_1.FileSystem) === "function" && _b || Object, typeof (_c = typeof blackbeard_1.PlatformProvider !== "undefined" && blackbeard_1.PlatformProvider) === "function" && _c || Object, typeof (_d = typeof blackbeard_1.Logger !== "undefined" && blackbeard_1.Logger) === "function" && _d || Object, Array])
], Scheduler);
exports.Scheduler = Scheduler;
var _a, _b, _c, _d;
//# sourceMappingURL=Scheduler.js.map

//# sourceMappingURL=Scheduler.js.map
