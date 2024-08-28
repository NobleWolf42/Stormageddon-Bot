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
//#region Dependencies
var GeniusLyrics = require('genius-lyrics');
var Genius = new GeniusLyrics.Client();
//#endregion
//#region Helpers
var addToLog = require('../helpers/errorLog.js').addToLog;
var _a = require('../helpers/embedMessages.js'), embedCustom = _a.embedCustom, warnCustom = _a.warnCustom, warnDisabled = _a.warnDisabled, warnWrongChannel = _a.warnWrongChannel;
//#endregion
//#region Modules
var serverConfig_1 = require("../models/serverConfig.");
//#endregion
//#region This exports the lyrics command with the information about it
module.exports = {
    name: 'lyrics',
    type: ['Guild'],
    aliases: ['ly'],
    coolDown: 0,
    class: 'music',
    usage: 'lyrics',
    description: 'Gets the lyrics for the currently playing song.',
    execute: function (message, args, client, distube) {
        return __awaiter(this, void 0, void 0, function () {
            var serverConfig, queue, lyrics, searches, song, error_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, serverConfig_1.MongooseServerConfig.findById(message.guild.id).exec()];
                    case 1:
                        serverConfig = _a.sent();
                        if (!serverConfig.music.enable) {
                            warnDisabled(message, 'music', module.name);
                            return [2 /*return*/];
                        }
                        if (!(serverConfig.music.textChannel == message.channel.name)) return [3 /*break*/, 7];
                        queue = distube.getQueue(message);
                        if (!queue) {
                            return [2 /*return*/, warnCustom(message, 'There is nothing playing.', module.name)];
                        }
                        lyrics = null;
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, Genius.songs.search(queue.songs[0].name)];
                    case 3:
                        searches = _a.sent();
                        song = searches[0];
                        return [4 /*yield*/, song.lyrics()];
                    case 4:
                        lyrics = _a.sent();
                        if (!lyrics) {
                            lyrics = "No lyrics found for ".concat(queue.songs[0].name, ".");
                        }
                        return [3 /*break*/, 6];
                    case 5:
                        error_1 = _a.sent();
                        addToLog('fatal error', module.name, message.author.tag, message.guild.name, message.channel.name, error_1, client);
                        lyrics = "No lyrics found for ".concat(queue.songs[0].name, ".");
                        return [3 /*break*/, 6];
                    case 6:
                        slicedLyrics = [];
                        while (lyrics.length >= 2048) {
                            slicedLyrics.push("".concat(lyrics.substring(0, 2045), "..."));
                            lyrics = lyrics.slice(2045);
                        }
                        slicedLyrics.push(lyrics);
                        slicedLyrics.forEach(function (m, index) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                embedCustom(message, "".concat(song.fullTitle, " - ").concat(index + 1, " of ").concat(slicedLyrics.length, ":"), '#0E4CB0', m, {
                                    text: "Requested by ".concat(message.author.tag),
                                    iconURL: null,
                                }, null, [], null, null);
                                return [2 /*return*/];
                            });
                        }); });
                        return [3 /*break*/, 8];
                    case 7:
                        warnWrongChannel(message, serverConfig.music.textChannel, module.name);
                        _a.label = 8;
                    case 8: return [2 /*return*/];
                }
            });
        });
    },
};
//#endregion
