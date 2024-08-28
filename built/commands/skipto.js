"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
//#region Helpers
var _a = require('../helpers/embedMessages.js'), warnCustom = _a.warnCustom, warnDisabled = _a.warnDisabled, warnWrongChannel = _a.warnWrongChannel, errorNoDJ = _a.errorNoDJ, embedCustom = _a.embedCustom;
var djCheck = require('../helpers/userPermissions.js').djCheck;
//#endregion
//#region Modules
var serverConfig_1 = require("./models/serverConfig");
//#endregion
//#region This exports the skipto command with the information about it
module.exports = {
    name: 'skipto',
    type: ['Guild'],
    aliases: ['st'],
    coolDown: 0,
    class: 'music',
    usage: 'skipto ***QUEUE-NUMBER***',
    description: 'Skips to the selected queue number.',
    execute: function (message, args, client, distube) {
        return __awaiter(this, void 0, void 0, function () {
            var serverConfig, voiceChannel, queue;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, serverConfig_1.MongooseServerConfig.findById(message.guild.id).exec()];
                    case 1:
                        serverConfig = _a.sent();
                        //Checks to see if the music feature is enabled in this server
                        if (!serverConfig.music.enable) {
                            return [2 /*return*/, warnDisabled(message, 'music', module.name)];
                        }
                        //Checks to see if the user has DJ access
                        if (!djCheck(message)) {
                            return [2 /*return*/, errorNoDJ(message, module.name)];
                        }
                        //Checks to see if the message was sent in the correct channel
                        if (serverConfig.music.textChannel != message.channel.name) {
                            return [2 /*return*/, warnWrongChannel(message, serverConfig.music.textChannel, module.name)];
                        }
                        voiceChannel = message.member.voice.channel;
                        queue = distube.getQueue(message);
                        if (!queue) {
                            return [2 /*return*/, warnCustom(message, 'Nothing is playing right now.', module.name)];
                        }
                        else if (voiceChannel != queue.voiceChannel) {
                            return [2 /*return*/, warnCustom(message, "You must join the <#".concat(queue.voiceChannel.id, "> voice channel to use this command!"), module.name)];
                        }
                        else if (args[0] < 2 || args[0] > queue.songs.length) {
                            return [2 /*return*/, warnCustom(message, "Number must be between 2 and ".concat(queue.songs.length), module.name)];
                        }
                        else if (!args[0] || isNaN(args[0])) {
                            return [2 /*return*/, warnCustom(message, 'No song information was included in the command.', module.name)];
                        }
                        else {
                            queue.songs = queue.songs.splice(args[0] - 2);
                            queue.skip().then(function (s) {
                                embedCustom(message, 'Skipped', '#0000FF', "Skipped to [`".concat(s.name, "`](").concat(s.url, ")."), {
                                    text: "Requested by ".concat(message.author.tag),
                                    iconURL: null,
                                }, null, [], null, null);
                            });
                        }
                        return [2 /*return*/];
                }
            });
        });
    },
};
//#endregion
