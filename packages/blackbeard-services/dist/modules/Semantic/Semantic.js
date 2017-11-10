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
const blackbeard_1 = require("blackbeard");
class Semantic extends blackbeard_1.HydraModule {
    get name() {
        return 'semantic';
    }
    configure() {
        return __awaiter(this, void 0, void 0, function* () {
            this.semanticConfig = yield this.getConfig();
            return this.semanticConfig.module;
        });
    }
    run(...args) {
        return Promise.resolve();
    }
}
exports.Semantic = Semantic;
//# sourceMappingURL=Semantic.js.map

//# sourceMappingURL=Semantic.js.map
