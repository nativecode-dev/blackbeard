"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const blackbeard = require("@blackbeard/core");
const modules = require("./modules");
const inversify_1 = require("inversify");
const core_1 = require("@blackbeard/core");
const container = new inversify_1.Container();
container.bind(inversify_1.Container).toConstantValue(container);
container.bind(blackbeard.Config).toSelf().inSingletonScope();
container.bind(blackbeard.FileSystem).toSelf().inSingletonScope();
container.bind(blackbeard.PlatformProvider).toSelf().inSingletonScope();
container.bind(blackbeard.Variables).toSelf().inSingletonScope();
container.bind(blackbeard.LoggerType).to(core_1.DefaultLogger).inSingletonScope();
container.bind(blackbeard.LoggerNamespace).toSelf();
container.bind(blackbeard.LoggerTargetType).to(blackbeard.DebugLoggerTarget);
container.bind(blackbeard.Radarr).toSelf();
container.bind(blackbeard.Sonarr).toSelf();
container.bind(blackbeard.ModuleType).to(modules.IRCWatcher).inSingletonScope();
container.bind(blackbeard.ModuleType).to(modules.Scheduler).inSingletonScope();
container.bind(blackbeard.ScriptType).to(blackbeard.UnMonitorCompletedMovies);
container.bind(blackbeard.ScriptType).to(blackbeard.UnMonitorCompletedSeasons);
container.bind(blackbeard.DataStore).toSelf();
container.bind(blackbeard.CouchbaseFactory).toSelf();
exports.default = container;
//# sourceMappingURL=inversify.config.js.map

//# sourceMappingURL=inversify.config.js.map
