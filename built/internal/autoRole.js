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
exports.autoRoleListener = autoRoleListener;
exports.generateEmbedFields = generateEmbedFields;
//#region Dependencies
var discord_js_1 = require("discord.js");
//#endregion
//#region Modules
var serverConfig_1 = require("../models/serverConfig");
//#endregion
//#region Function that generates embed fields
/**
 * Generates the embed fields and ties the emoji to their respective role from serverConfig.
 * @param {string} serverID - Server ID for the server the command is run in
 * @returns {map} A map of the emoji-role pairs
 */
function generateEmbedFields(serverID) {
    return __awaiter(this, void 0, void 0, function () {
        var serverConfig;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, serverConfig_1.MongooseServerConfig.findById(serverID).exec()];
                case 1:
                    serverConfig = (_a.sent()).toObject();
                    return [2 /*return*/, serverConfig.autoRole.roles.map(function (r, e) {
                            return {
                                emoji: serverConfig.autoRole.reactions[e],
                                role: r,
                            };
                        })];
            }
        });
    });
}
//#endregion
//#region Function that starts the listening to see if a user hits a reaction, and gives them the role when they do react
/**
 * This function starts the listening to see if a user hits a reaction, and gives them the role when they do react.
 * @param {Client} client - Discord.js Client Object
 */
function autoRoleListener(client) {
    return __awaiter(this, void 0, void 0, function () {
        var events;
        var _this = this;
        return __generator(this, function (_a) {
            events = {
                MESSAGE_REACTION_ADD: 'messageReactionAdd',
                MESSAGE_REACTION_REMOVE: 'messageReactionRemove',
            };
            //#endregion
            //#region This event handles adding/removing users from the role(s) they chose based on message reactions
            client.on('raw', function (event) { return __awaiter(_this, void 0, void 0, function () {
                var data, user, channel, message, member, serverID, serverConfig, emojiKey, reaction, embedFooterText, fields, _loop_1, _i, fields_1, _a, name_1, value;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!events.hasOwnProperty(event.t))
                                return [2 /*return*/];
                            data = event.d;
                            user = client.users.cache.get(data.user_id);
                            channel = client.channels.cache.get(data.channel_id);
                            if (!channel.isTextBased()) {
                                console.error('Channel is not a text-based channel');
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, channel.messages.fetch(data.message_id)];
                        case 1:
                            message = _b.sent();
                            member = message.guild.members.cache.get(user.id);
                            serverID = message.channel.guild.id;
                            return [4 /*yield*/, serverConfig_1.MongooseServerConfig.findById(serverID).exec()];
                        case 2:
                            serverConfig = (_b.sent()).toObject();
                            emojiKey = data.emoji.id ? "".concat(data.emoji.name, ":").concat(data.emoji.id) : data.emoji.name;
                            reaction = message.reactions.cache.get(emojiKey);
                            if (!reaction) {
                                // Create an object that can be passed through the event like normal
                                reaction = new discord_js_1.MessageReaction(client, data, message, 1, data.user_id === client.user.id);
                            }
                            if (message.embeds[0] && message.embeds[0].footer != null)
                                embedFooterText = message.embeds[0].footer.text;
                            if (message.author.id === client.user.id && (message.content !== serverConfig.autoRole.initialMessage || (message.embeds[0] && embedFooterText !== serverConfig.autoRole.embedFooter))) {
                                if (message.embeds.length >= 1) {
                                    fields = message.embeds[0].fields;
                                    _loop_1 = function (name_1, value) {
                                        if (member.id !== client.user.id) {
                                            var guildRole = message.guild.roles.cache.find(function (r) { return r.name === value; });
                                            if (name_1 === reaction.emoji.name || name_1 === reaction.emoji.toString()) {
                                                if (event.t === 'MESSAGE_REACTION_ADD')
                                                    member.roles.add(guildRole.id);
                                                else if (event.t === 'MESSAGE_REACTION_REMOVE')
                                                    member.roles.remove(guildRole.id);
                                            }
                                        }
                                    };
                                    for (_i = 0, fields_1 = fields; _i < fields_1.length; _i++) {
                                        _a = fields_1[_i], name_1 = _a.name, value = _a.value;
                                        _loop_1(name_1, value);
                                    }
                                }
                            }
                            return [2 /*return*/];
                    }
                });
            }); });
            //#endregion
            //#region This handles unhandled rejections
            process.on('unhandledRejection', function (err) {
                var msg = err.stack.replace(new RegExp("".concat(__dirname, "/"), 'g'), './');
                console.error('Unhandled Rejection', msg);
            });
            return [2 /*return*/];
        });
    });
}
//#endregion
