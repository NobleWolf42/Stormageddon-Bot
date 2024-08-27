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
var _a = require('discord.js'), PermissionsBitField = _a.PermissionsBitField, EmbedBuilder = _a.EmbedBuilder;
//#endregion
//#region Helpers
var updateConfigFile = require('../helpers/currentSettings.js').updateConfigFile;
var _b = require('../helpers/embedMessages.js'), warnDisabled = _b.warnDisabled, errorCustom = _b.errorCustom, embedCustomDM = _b.embedCustomDM;
//#endregion
//#region Internals
var generateEmbedFields = require('../internal/autoRole.js').generateEmbedFields;
var errorNoAdmin = require('../helpers/embedMessages.js').errorNoAdmin;
var adminCheck = require('../helpers/userPermissions.js').adminCheck;
//#endregion
//#region This exports the createrolemessage command with the information about it
module.exports = {
    name: 'createrolemessage',
    type: ['Guild'],
    aliases: ['creatermsg'],
    coolDown: 60,
    class: 'admin',
    usage: 'createrolemessage',
    description: 'Create the reactions message for auto role assignment.',
    execute: function (message, args, client, distube) {
        var _this = this;
        //This is the max number of reactions on a message allowed by discord, if discord ever changes that number change this and the code should work again!!!
        var maxReactions = 20;
        var serverID = message.guild.id;
        config = updateConfigFile();
        //Checks to make sure your roles and reactions match up
        if (config[serverID].autoRole.roles.length !==
            config[serverID].autoRole.reactions.length) {
            return errorCustom(message, "Roles list and reactions list are not the same length! Please run the setup command again (".concat(message.prefix, "set autorole)."), module.name, client);
        }
        // We don't want the bot to do anything further if it can't send messages in the channel
        if (message.guild &&
            !message.guild.members.me
                .permissionsIn(message.channel.id)
                .missing(PermissionsBitField.Flags.SendMessages)) {
            return embedCustomDM(message, 'Error', '#FF0000', "I don't have access to send messages in that channel, please give me permissions.");
        }
        var missing = message.guild.members.me
            .permissionsIn(message.channel.id)
            .missing(PermissionsBitField.Flags.ManageMessages);
        // Here we check if the bot can actually add reactions in the channel the command is being ran in
        if (missing.includes('ADD_REACTIONS')) {
            return errorCustom(message, "I need permission to add reactions to messages in this channel! Please assign the 'Add Reactions' permission to me in this channel!", module.name, client);
        }
        if (!config[serverID].autoRole.embedMessage ||
            config[serverID].autoRole.embedMessage === '') {
            return errorCustom(message, "The 'embedMessage' property is not set! Please run the setup command again (".concat(message.prefix, "set autorole)."), module.name, client);
        }
        else if (!config[serverID].autoRole.embedFooter ||
            config[serverID].autoRole.embedFooter === '') {
            return errorCustom(message, "The 'embedFooter' property is not set! Please run the setup command again (".concat(message.prefix, "set autorole)."), module.name, client);
        }
        // Checks to see if the module is enabled
        if (!config[serverID].autoRole.enable) {
            return warnDisabled(message, 'autoRole', module.name);
        }
        // Checks that the user is an admin
        if (!adminCheck(message)) {
            return errorNoAdmin(message, module.name);
        }
        var thumbnail = null;
        var fieldsOut = [];
        if (config[serverID].autoRole.embedThumbnail &&
            config[serverID].autoRole.embedThumbnailLink !== '') {
            thumbnail = config[serverID].autoRole.embedThumbnailLink;
        }
        else if (config[serverID].autoRole.embedThumbnail &&
            message.guild.icon) {
            thumbnail = message.guild.iconURL;
        }
        var fields = generateEmbedFields(serverID);
        var _loop_1 = function (emoji, role) {
            if (!message.guild.roles.cache.find(function (r) { return r.name === role; })) {
                return { value: errorCustom(message, "The role '".concat(role, "' does not exist!! Please run the setup command again (").concat(message.prefix, "set autorole)."), module.name, client) };
            }
            var customEmote = client.emojis.cache.find(function (e) { return e.name === emoji; });
            if (!customEmote) {
                fieldsOut.push({ name: emoji, value: role, inline: true });
            }
            else {
                fieldsOut.push({
                    name: customEmote,
                    value: role,
                    inline: true,
                });
            }
        };
        for (var _i = 0, fields_1 = fields; _i < fields_1.length; _i++) {
            var _a = fields_1[_i], emoji = _a.emoji, role = _a.role;
            var state_1 = _loop_1(emoji, role);
            if (typeof state_1 === "object")
                return state_1.value;
        }
        var count = 0;
        for (var i = 0; i < Math.ceil(fieldsOut.length / maxReactions); i++) {
            var embMsg = new EmbedBuilder()
                .setColor('#dd9323')
                .setDescription(config[serverID].autoRole.embedMessage)
                .setThumbnail(thumbnail)
                .setFooter({
                text: config[serverID].autoRole.embedFooter,
                iconURL: null,
            })
                .setTitle("Role Message - ".concat(i + 1, " out of ").concat(Math.ceil(fieldsOut.length / maxReactions)))
                .setFields(fieldsOut.slice(i * maxReactions, (i + 1) * maxReactions))
                .setTimestamp();
            message.channel.send({ embeds: [embMsg] }).then(function (m) { return __awaiter(_this, void 0, void 0, function () {
                var maxEmoji, _loop_2, r;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            maxEmoji = 0;
                            if ((count + 1) * maxReactions <
                                config[serverID].autoRole.reactions.length) {
                                maxEmoji = (count + 1) * maxReactions;
                            }
                            else {
                                maxEmoji = config[serverID].autoRole.reactions.length;
                            }
                            _loop_2 = function () {
                                var emoji, customCheck;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            if (r == count * maxReactions) {
                                                count++;
                                            }
                                            emoji = config[serverID].autoRole.reactions[r];
                                            customCheck = client.emojis.cache.find(function (e) { return e.name === emoji; });
                                            if (!!customCheck) return [3 /*break*/, 2];
                                            return [4 /*yield*/, m.react(emoji)];
                                        case 1:
                                            _b.sent();
                                            return [3 /*break*/, 4];
                                        case 2: return [4 /*yield*/, m.react(customCheck.id)];
                                        case 3:
                                            _b.sent();
                                            _b.label = 4;
                                        case 4: return [2 /*return*/];
                                    }
                                });
                            };
                            r = count * maxReactions;
                            _a.label = 1;
                        case 1:
                            if (!(r < maxEmoji)) return [3 /*break*/, 4];
                            return [5 /*yield**/, _loop_2()];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3:
                            r++;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
        }
        message.delete();
        message.deleted = true;
    },
};
//#endregion
