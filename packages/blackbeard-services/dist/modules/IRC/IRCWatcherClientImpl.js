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
const IRCParser_1 = require("./IRCParser");
class IRCWatcherClientImpl {
    constructor(name, entry, factory, interfaces, logger) {
        this.privmsg = (data) => __awaiter(this, void 0, void 0, function* () {
            this.log.trace('client.event.privmsg', JSON.stringify(data));
            if (data.message && data.message.username) {
                const sender = data.message.username.toLowerCase();
                const filtered = this.entry.parser.filtering.username.toLowerCase();
                if (sender === filtered) {
                    const record = this.parser.parse(data.message.message);
                    const category = this.entry.parser.filtering.category[record.category];
                    if (category) {
                        yield this.factory.publish(record, category);
                    }
                }
            }
        });
        this.registered = (data) => {
            this.log.trace('client.event.registered', ...this.entry.channels);
            this.interfaces.rpc.emit('call', this.id, 'join', this.entry.channels);
        };
        this.factory = factory;
        this.handlers = {};
        this.interfaces = interfaces;
        this.log = logger.extend('client');
        this.entry = entry;
        this.name = name;
        this.handlers.privmsg = this.privmsg;
        this.handlers.registered = this.registered;
        this.parser = new IRCParser_1.IRCParser(this.log, this.entry.parser);
        this.log.trace(`creating irc client: ${this.id}`);
        this.interfaces.rpc.emit('createClient', this.id, entry.connection);
    }
    get id() {
        return `client:${this.name}`;
    }
    destroy() {
        this.log.trace(`destroying client ${this.id}`);
        this.interfaces.rpc.emit('destroyClient', this.id);
    }
    process(event, data) {
        try {
            this.log.trace('client.event', event);
            const handler = this.handlers[event];
            if (handler) {
                this.log.trace('client.event.dispatch', event);
                handler(data);
            }
        }
        catch (error) {
            this.log.error(error);
            this.log.errorJSON(data);
        }
    }
}
exports.IRCWatcherClientImpl = IRCWatcherClientImpl;
//# sourceMappingURL=IRCWatcherClientImpl.js.map

//# sourceMappingURL=IRCWatcherClientImpl.js.map
