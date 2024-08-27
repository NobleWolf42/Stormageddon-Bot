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
//#region Helpers
var updateConfigFile = require('../helpers/currentSettings.js').updateConfigFile;
var _a = require('../helpers/embedMessages.js'), errorNoServerAdmin = _a.errorNoServerAdmin, errorCustom = _a.errorCustom, embedCustom = _a.embedCustom;
//#endregion
//#region Internals
var buildConfigFile = require('../internal/settingsFunctions.js').buildConfigFile;
//#endregion
//#region This exports the removemod command with the information about it
module.exports = {
    name: 'removemod',
    type: ['Guild'],
    aliases: [''],
    coolDown: 0,
    class: 'admin',
    usage: 'removemod ***MENTION-USERS***',
    description: 'Removes users from the list of people that get the PM when someone whispers the bot with the !modmail command. MUST HAVE SERVER ADMINISTRATOR STATUS.',
    execute: function (message, args, client, distube) {
        var _this = this;
        if (message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            if (message.channel.guild.id in serverConfig) {
                if (message.mentions.members.size == 0) {
                    return warnCustom(message, 'No user input detected, Did you make sure to @ them?', module.name);
                }
                message.mentions.members.forEach(function (user) { return __awaiter(_this, void 0, void 0, function () {
                    var serverID, array, userFound, modMail;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                serverID = message.channel.guild.id;
                                array = serverConfig[serverID].modMail.modList;
                                userFound = false;
                                array.forEach(function (item) {
                                    if (item == user) {
                                        userFound = true;
                                    }
                                });
                                if (userFound) {
                                    array = array.filter(function (value) {
                                        return value != user.id;
                                    });
                                }
                                else {
                                    return [2 /*return*/, warnCustom(message, "User ".concat(user.tag, " is not a Mod!"), module.name)];
                                }
                                modMail = {};
                                modMail.modList = array;
                                modMail.enable = true;
                                serverConfig[serverID].modMail = modMail;
                                return [4 /*yield*/, buildConfigFile(serverConfig)];
                            case 1:
                                _a.sent();
                                embedCustom(message, 'Mods Removed', '#5D3FD3', "Mods have been successfully removed!", {
                                    text: "Requested by ".concat(message.author.tag),
                                    iconURL: null,
                                }, null, [], null, null);
                                serverConfig = updateConfigFile();
                                return [2 /*return*/];
                        }
                    });
                }); });
            }
            else {
                return (errorCustom(message, 'Server is not set up with the bot yet!', module.name),
                    client);
            }
        }
        else {
            return errorNoServerAdmin(message, module.name);
        }
    },
};
//#endregion
