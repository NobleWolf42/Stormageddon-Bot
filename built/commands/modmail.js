var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
//#region Dependencies
var EmbedBuilder = require('discord.js').EmbedBuilder;
//#endregion
//#regions Helpers
var updateConfigFile = require('../helpers/currentSettings.js').updateConfigFile;
var _a = require('../helpers/embedMessages.js'), errorCustom = _a.errorCustom, warnCustom = _a.warnCustom, warnDisabled = _a.warnDisabled;
//#endregion
//#region This exports the modmail command with the information about it
module.exports = {
    name: 'modmail',
    type: ['DM'],
    aliases: [],
    coolDown: 15,
    class: 'direct',
    usage: '!modmail ***SERVER-NAME***, ***MESSAGE*** ',
    description: 'Whisper via Stormageddon to all moderators for the specified server.',
    execute: function (message, args, client, distube) {
        return __awaiter(this, void 0, void 0, function () {
            var serverConfig, argsString, arguments, serverID, servername, content, modList, _a, _b, _c, _i, mod, embMsg;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        serverConfig = updateConfigFile();
                        argsString = args.join(' ');
                        arguments = argsString.split(', ');
                        serverID = 0;
                        servername = arguments[0];
                        content = arguments[1];
                        client.guilds.cache.forEach(function (key) {
                            if (key.name == servername) {
                                serverID = key.id;
                            }
                        });
                        if (!(serverID != 0 && serverConfig[serverID] != undefined)) return [3 /*break*/, 7];
                        if (!serverConfig[serverID].modMail.enable) return [3 /*break*/, 5];
                        modList = serverConfig[serverID].modMail.modList;
                        _a = modList;
                        _b = [];
                        for (_c in _a)
                            _b.push(_c);
                        _i = 0;
                        _d.label = 1;
                    case 1:
                        if (!(_i < _b.length)) return [3 /*break*/, 4];
                        _c = _b[_i];
                        if (!(_c in _a)) return [3 /*break*/, 3];
                        key = _c;
                        return [4 /*yield*/, client.users.fetch(modList[key])];
                    case 2:
                        mod = _d.sent();
                        embMsg = new EmbedBuilder()
                            .setTitle("Mod Mail from: ".concat(servername))
                            .setColor('#0B6E29')
                            .setDescription(content)
                            .setFooter({
                            text: "Requested by ".concat(message.author.tag),
                            iconURL: null,
                        })
                            .setTimestamp();
                        mod.send({ embeds: [embMsg] });
                        _d.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [3 /*break*/, 6];
                    case 5: return [2 /*return*/, warnDisabled(message, 'modMail', module.name)];
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        if (serverConfig[serverID] == undefined) {
                            return [2 /*return*/, errorCustom(message, "The `!setup` command has not been run on `".concat(servername, "` yet."), module.name, client)];
                        }
                        else {
                            return [2 /*return*/, warnCustom(message, 'The server you specified does not have this bot, or you failed to specify a server.', module.name)];
                        }
                        _d.label = 8;
                    case 8: return [2 /*return*/];
                }
            });
        });
    },
};
//#endregion
