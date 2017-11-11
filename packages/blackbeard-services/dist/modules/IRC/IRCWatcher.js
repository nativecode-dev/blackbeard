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
const irc_factory_1 = require("irc-factory");
const inversify_1 = require("inversify");
const IRCEntry_1 = require("./IRCEntry");
const IRCWatcherClientImpl_1 = require("./IRCWatcherClientImpl");
const core_1 = require("@blackbeard/core");
let IRCWatcher = class IRCWatcher extends core_1.HydraModule {
    constructor(files, platform, radarr, sonarr, vars, logger) {
        super(files, logger, platform);
        this.synchronize = (name, entry, interfaces) => {
            this.log.trace(`event.synchronize: ${name}@${entry.connection.server}`);
            this.clients[name] = new IRCWatcherClientImpl_1.IRCWatcherClientImpl(name, entry, this, interfaces, this.log);
        };
        this.clients = {};
        this.handlers = { synchronize: this.synchronize };
        this.radarr = radarr;
        this.sonarr = sonarr;
        this.vars = vars;
    }
    get name() {
        return 'ircwatch';
    }
    publish(record, category) {
        const release = {
            downloadUrl: record.url,
            title: record.title,
            protocol: core_1.Protocol.Torrent,
            publishDate: new Date().toISOString(),
        };
        switch (category) {
            case IRCEntry_1.IRCParserClientKind.Radarr:
                return this.radarr.release(release);
            case IRCEntry_1.IRCParserClientKind.Sonarr:
                return this.sonarr.release(release);
            default:
                return Promise.reject(`Invalid category: ${category}`);
        }
    }
    configure() {
        return __awaiter(this, void 0, void 0, function* () {
            this.watcherConfig = yield this.getConfig();
            return this.watcherConfig.module;
        });
    }
    run(...args) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const api = new irc_factory_1.Api();
            Object.keys(this.watcherConfig.servers).forEach(key => {
                const entry = this.watcherConfig.servers[key];
                const interfaces = api.connect(entry.api);
                interfaces.events.on('message', (data) => this.process(data, key, entry, interfaces));
            });
            process.on('beforeExit', () => Object.keys(this.clients)
                .map(key => this.clients[key])
                .forEach(client => client.destroy()));
        }));
    }
    process(data, key, entry, interfaces) {
        try {
            if (data.event instanceof Array) {
                const clientId = data.event[0];
                const event = data.event[1];
                const client = this.clients[key];
                if (client && clientId === client.id) {
                    this.log.trace(`event.dispatch: ${client.id}:${event}`);
                    client.process(event, data);
                }
                return;
            }
            const event = data.event;
            if (this.handlers[event]) {
                const handler = this.handlers[event];
                handler(key, entry, interfaces);
            }
            else {
                this.log.trace(`event.unconsumed: ${event}`);
            }
        }
        catch (error) {
            this.log.error(error);
            this.log.errorJSON(data);
        }
    }
};
IRCWatcher = __decorate([
    inversify_1.injectable(),
    __param(5, inversify_1.inject(core_1.LoggerType)),
    __metadata("design:paramtypes", [typeof (_a = typeof core_1.FileSystem !== "undefined" && core_1.FileSystem) === "function" && _a || Object, typeof (_b = typeof core_1.PlatformProvider !== "undefined" && core_1.PlatformProvider) === "function" && _b || Object, typeof (_c = typeof core_1.Radarr !== "undefined" && core_1.Radarr) === "function" && _c || Object, typeof (_d = typeof core_1.Sonarr !== "undefined" && core_1.Sonarr) === "function" && _d || Object, typeof (_e = typeof core_1.Variables !== "undefined" && core_1.Variables) === "function" && _e || Object, typeof (_f = typeof core_1.Logger !== "undefined" && core_1.Logger) === "function" && _f || Object])
], IRCWatcher);
exports.IRCWatcher = IRCWatcher;
var _a, _b, _c, _d, _e, _f;
//# sourceMappingURL=IRCWatcher.js.map

//# sourceMappingURL=IRCWatcher.js.map
