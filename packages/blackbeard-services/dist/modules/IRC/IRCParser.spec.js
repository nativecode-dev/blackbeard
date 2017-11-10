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
require("mocha");
const fs = require("fs");
const path = require("path");
const inversify_config_1 = require("../../inversify.config");
const chai_1 = require("chai");
const blackbeard_1 = require("blackbeard");
const IRC_1 = require("../../modules/IRC");
const artifact = (filename) => {
    const filepath = path.join(process.cwd(), 'artifacts', filename);
    return new Promise((resolve, reject) => {
        fs.exists(filepath, exists => {
            if (exists) {
                fs.readFile(filepath, (error, data) => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(JSON.parse(data.toString()));
                    }
                });
            }
            else {
                reject(filepath);
            }
        });
    });
};
describe('when parsing IRC messages', () => {
    it('should parse xspeeds announcements', () => __awaiter(this, void 0, void 0, function* () {
        const announce = yield artifact('xspeeds.announce.json');
        const options = yield artifact('xspeeds.parser.json');
        const logger = inversify_config_1.default.get(blackbeard_1.LoggerType);
        const parser = new IRC_1.IRCParser(logger, options);
        const record = parser.parse(announce.message.message);
        chai_1.expect(record.category).to.equal('TV-HD');
        chai_1.expect(record.title).to.equal('Eamonn.And.Ruth.S01E01.Do.Dubai.720p.HDTV.x264-BARGE');
    }));
});
//# sourceMappingURL=IRCParser.spec.js.map

//# sourceMappingURL=IRCParser.spec.js.map
