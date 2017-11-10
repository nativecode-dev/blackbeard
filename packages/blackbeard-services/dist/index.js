"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
var blackbeard_1 = require("blackbeard");
exports.Radarr = blackbeard_1.Radarr;
exports.Script = blackbeard_1.Script;
exports.Sonarr = blackbeard_1.Sonarr;
const inversify_config_1 = require("./inversify.config");
const cluster = require("cluster");
const core = require("blackbeard/src/core");
function main(command) {
    return __awaiter(this, void 0, void 0, function* () {
        command = (command || process.env.APPCMD || '').toLowerCase();
        console.log('running', command);
        const mods = inversify_config_1.default.getAll(core.ModuleType);
        const mod = mods.find(m => m.name === command);
        if (mod) {
            yield mod.start();
            process.exit(0);
        }
        else {
            console.log('error', `invalid parameter provided: "${command}"`);
            process.exit(-1);
        }
    });
}
if (cluster.isMaster) {
    const createWorker = () => {
        return cluster.fork()
            .on('exit', (code, signal) => {
            if (code > 0 && signal !== 'SIGTERM') {
                console.log('fork', `${code}:${signal}`);
                createWorker();
            }
        });
    };
    console.log(`${process.argv[1]} ${process.argv.slice(2).join(' ')}`);
    createWorker();
}
else {
    main.apply(process, process.argv.slice(2))
        .catch((error) => console.log(error))
        .then(() => process.exit(5150));
}
//# sourceMappingURL=index.js.map

//# sourceMappingURL=index.js.map
