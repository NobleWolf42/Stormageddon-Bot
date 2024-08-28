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
var _a = require('discord.js'), Collection = _a.Collection, ChannelType = _a.ChannelType, PermissionFlagsBits = _a.PermissionFlagsBits;
//#endregion
//#region Helpers
var addToLog = require('../helpers/errorLog.js').addToLog;
//#endregion
//#region Function that starts the listener that handles Join to Create Channels
/**
 * This function starts the listener that handles that handles Join to Create Channels.
 * @param {Client} client - Discord.js Client Object
 */
function joinToCreateHandling(client) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            client.voiceGenerator = new Collection();
            //This handles the event of a user joining or disconnecting from a voice channel
            client.on('voiceStateUpdate', function (oldState, newState) { return __awaiter(_this, void 0, void 0, function () {
                var member, guild, serverID, oldChannel, newChannel, serverConfig, voiceChannel;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            member = newState.member, guild = newState.guild;
                            serverID = guild.id;
                            oldChannel = oldState.channel;
                            newChannel = newState.channel;
                            return [4 /*yield*/, MongooseServerConfig.findById(message.guild.id).exec().toObject()];
                        case 1:
                            serverConfig = _a.sent();
                            if (serverConfig.setupNeeded) {
                                return [2 /*return*/];
                            }
                            if (!(serverConfig.JTCVC.enable && oldChannel !== newChannel && newChannel && newChannel.id === serverConfig.JTCVC.voiceChannel)) return [3 /*break*/, 4];
                            return [4 /*yield*/, guild.channels.create({
                                    name: "".concat(member.user.tag, "'s Channel"),
                                    type: ChannelType.GuildVoice,
                                    parent: newChannel.parent,
                                    permissionOverwrites: newChannel.parent.permissionOverwrites.cache.map(function (p) {
                                        return {
                                            id: p.id,
                                            allow: p.allow.toArray(),
                                            deny: p.deny.toArray(),
                                        };
                                    }),
                                })];
                        case 2:
                            voiceChannel = _a.sent();
                            //Adds the voice channel just made to the collection
                            client.voiceGenerator.set(voiceChannel.id, member.id);
                            client.voiceGenerator.set(member.id, voiceChannel.id);
                            //Times the user out from spamming new voice channels, currently set to 10 seconds and apparently works intermittently, probably dur to the permissions when testing it
                            return [4 /*yield*/, newChannel.permissionOverwrites.edit(member, {
                                    deny: PermissionFlagsBits.Connect,
                                })];
                        case 3:
                            //Times the user out from spamming new voice channels, currently set to 10 seconds and apparently works intermittently, probably dur to the permissions when testing it
                            _a.sent();
                            setTimeout(function () { return newChannel.permissionOverwrites.delete(member); }, 10 * 1000);
                            return [2 /*return*/, member.voice.setChannel(voiceChannel)];
                        case 4:
                            //Handles someone leaving a voice channel
                            try {
                                if (oldChannel == null) {
                                    return [2 /*return*/];
                                }
                                if (oldChannel != null && client.voiceGenerator.get(oldChannel.id) && oldChannel.members.size == 0) {
                                    //This deletes a channel if it was created byt the bot and is empty
                                    oldChannel.delete();
                                    client.voiceGenerator.delete(client.voiceGenerator.get(oldChannel.id));
                                    client.voiceGenerator.delete(oldChannel.id);
                                }
                                else if (client.voiceGenerator.get(oldChannel.id) && member.id == client.voiceGenerator.get(oldChannel.id)) {
                                    //This should restore default permissions to the channel when the owner leaves, and remove owner THIS IS BROKEN AND SERVERS NO PURPOSE RIGHT NOW
                                    /*await oldChannel.permissionOverwrites.edit(oldChannel.parent.permissionOverwrites.cache.map((p) => {
                                        return {
                                            id: p.id,
                                            allow: p.allow.toArray(),
                                            deny: p.deny.toArray()
                                        }
                                    }));*/
                                    client.voiceGenerator.delete(client.voiceGenerator.get(oldChannel.id));
                                }
                            }
                            catch (err) {
                                addToLog('Fatal Error', 'JTCVC Handler', member.tag, guild.name, oldChannel.name, err, client);
                            }
                            return [2 /*return*/];
                    }
                });
            }); });
            return [2 /*return*/];
        });
    });
}
//#endregion
//#region exports
module.exports = { joinToCreateHandling: joinToCreateHandling };
//#endregion
