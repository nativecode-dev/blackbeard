"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core = require("./core");
const acb = require("./datastore/couchbase");
const datastore = require("./datastore");
const modules = require("./modules");
const scripts = require("./scripts");
const inversify_1 = require("inversify");
const DefaultLogger_1 = require("./core/logging/DefaultLogger");
const container = new inversify_1.Container();
container.bind(inversify_1.Container).toConstantValue(container);
container.bind(core.Config).toSelf().inSingletonScope();
container.bind(core.FileSystem).toSelf().inSingletonScope();
container.bind(core.PlatformProvider).toSelf().inSingletonScope();
container.bind(core.Variables).toSelf().inSingletonScope();
container.bind(core.LoggerType).to(DefaultLogger_1.DefaultLogger).inSingletonScope();
container.bind(core.LoggerNamespace).toSelf();
container.bind(core.LoggerTargetType).to(core.DebugLoggerTarget);
container.bind(core.Radarr).toSelf();
container.bind(core.Sonarr).toSelf();
container.bind(core.ModuleType).to(modules.IRCWatcher).inSingletonScope();
container.bind(core.ModuleType).to(modules.Scheduler).inSingletonScope();
container.bind(core.ScriptType).to(scripts.UnMonitorCompletedMovies);
container.bind(core.ScriptType).to(scripts.UnMonitorCompletedSeasons);
container.bind(datastore.DataStore).toSelf();
container.bind(acb.CouchbaseFactory).toSelf();
exports.default = container;
//# sourceMappingURL=inversify.config.js.map

//# sourceMappingURL=inversify.config.js.map
