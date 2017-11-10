"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const irc_formatting_1 = require("irc-formatting");
class IRCParser {
    constructor(logger, options) {
        this.log = logger.extend('irc-parser');
        this.options = options;
    }
    parse(text) {
        const stripped = irc_formatting_1.strip(text);
        this.log.trace('parsing', stripped);
        const regex = new RegExp(this.options.filtering.pattern, 'g');
        let matches = regex.exec(stripped);
        const values = [];
        while (matches) {
            values.push(matches[1] || '');
            matches = regex.exec(stripped);
        }
        const record = {};
        values.map((value, index) => this.transform(value, index, record));
        return record;
    }
    secret(value, secrets) {
        Object.keys(secrets)
            .map((name) => ({ name, value: secrets[name] }))
            .forEach((secret) => {
            const regex = new RegExp(`\{${secret.name}\}`, 'gm');
            if (secret.value.toLowerCase().startsWith('env:')) {
                const envName = secret.value.replace('env:', '').toUpperCase();
                const envValue = process.env[envName] || secret.value;
                this.log.trace('secret.env', envName, envValue);
                value = value.replace(regex, envValue);
            }
            else {
                value = value.replace(regex, secret.value);
            }
            this.log.trace('secret', secret.name, secret.value, value);
        });
        return value;
    }
    transform(value, index, record) {
        const property = this.options.filtering.properties[index];
        const formatter = this.options.formatters[property];
        if (formatter && formatter.regex) {
            const regex = new RegExp(formatter.regex);
            if (regex.test(value)) {
                const replaced = value.replace(regex, formatter.replace);
                record[property] = this.secret(replaced, this.options.secrets);
            }
        }
        else {
            record[property] = this.secret(value, this.options.secrets);
        }
        return record;
    }
}
exports.IRCParser = IRCParser;
//# sourceMappingURL=IRCParser.js.map

//# sourceMappingURL=IRCParser.js.map
