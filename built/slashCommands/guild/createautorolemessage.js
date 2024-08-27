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
var _a = require('discord.js'), PermissionsBitField = _a.PermissionsBitField, EmbedBuilder = _a.EmbedBuilder, PermissionFlagsBits = _a.PermissionFlagsBits, SlashCommandBuilder = _a.SlashCommandBuilder;
//#endregion
//#region Helpers
var updateConfigFile = require('../../helpers/currentSettings.js').updateConfigFile;
var _b = require('../../helpers/embedSlashMessages.js'), warnDisabled = _b.warnDisabled, errorNoAdmin = _b.errorNoAdmin;
var adminCheck = require('../../helpers/userPermissions.js').adminCheck;
//#endregion
//#region Internals
var generateEmbedFields = require('../../internal/autoRole.js').generateEmbedFields;
//#endregion
//#region This exports the createrolemessage command with the information about it
module.exports = {
    data: new SlashCommandBuilder()
        .setName('createrolemessage')
        .setDescription('Creates the reactions message for auto role assignment.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    execute: function (client, interaction, distube) {
        return __awaiter(this, void 0, void 0, function () {
            var maxReactions, serverID, channel, missing, thumbnail, fieldsOut, fields, _loop_1, _i, fields_1, _a, emoji, role, count, i, embMsg;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        maxReactions = 20;
                        serverID = interaction.guildId;
                        return [4 /*yield*/, client.channels.fetch(interaction.channelId)];
                    case 1:
                        channel = _b.sent();
                        config = updateConfigFile();
                        //Checks to make sure your roles and reactions match up
                        if (config[serverID].autoRole.roles.length !==
                            config[serverID].autoRole.reactions.length) {
                            throw new Error('Roles list and reactions list are not the same length! Please double check this in the config[serverID].js file');
                        }
                        // We don't want the bot to do anything further if it can't send messages in the channel
                        if (interaction.guild &&
                            !interaction.guild.members.me
                                .permissionsIn(channel.id)
                                .missing(PermissionsBitField.Flags.SendMessages))
                            return [2 /*return*/];
                        missing = interaction.guild.members.me
                            .permissionsIn(channel.id)
                            .missing(PermissionsBitField.Flags.ManageMessages);
                        // Here we check if the bot can actually add reactions in the channel the command is being ran in
                        if (missing.includes('ADD_REACTIONS'))
                            throw new Error("I need permission to add reactions to these messages! Please assign the 'Add Reactions' permission to me in this channel!");
                        if (!config[serverID].autoRole.embedMessage ||
                            config[serverID].autoRole.embedMessage === '')
                            throw "The 'embedMessage' property is not set in the config[serverID].js file. Please do this!";
                        if (!config[serverID].autoRole.embedFooter ||
                            config[serverID].autoRole.embedMessage === '')
                            throw "The 'embedFooter' property is not set in the config[serverID].js file. Please do this!";
                        // Checks to see if the module is enabled
                        if (!config[serverID].autoRole.enable) {
                            return [2 /*return*/, warnDisabled(interaction, 'autoRole', module.name)];
                        }
                        // Checks that the user is an admin
                        if (!adminCheck(interaction)) {
                            return [2 /*return*/, errorNoAdmin(interaction, module.name)];
                        }
                        thumbnail = null;
                        fieldsOut = [];
                        if (config[serverID].autoRole.embedThumbnail &&
                            config[serverID].autoRole.embedThumbnailLink !== '') {
                            thumbnail = config[serverID].autoRole.embedThumbnailLink;
                        }
                        else if (config[serverID].autoRole.embedThumbnail &&
                            interaction.guild.icon) {
                            thumbnail = interaction.guild.iconURL;
                        }
                        fields = generateEmbedFields(serverID);
                        _loop_1 = function (emoji, role) {
                            if (!interaction.guild.roles.cache.find(function (r) { return r.name === role; }))
                                throw "The role '".concat(role, "' does not exist!");
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
                        for (_i = 0, fields_1 = fields; _i < fields_1.length; _i++) {
                            _a = fields_1[_i], emoji = _a.emoji, role = _a.role;
                            _loop_1(emoji, role);
                        }
                        count = 0;
                        for (i = 0; i < Math.ceil(fieldsOut.length / maxReactions); i++) {
                            embMsg = new EmbedBuilder();
                            embMsg.setColor('#dd9323');
                            embMsg.setDescription(config[serverID].autoRole.embedMessage);
                            embMsg.setThumbnail(thumbnail);
                            embMsg.setFooter({
                                text: config[serverID].autoRole.embedFooter,
                                iconURL: null,
                            });
                            embMsg.setTitle("Role Message - ".concat(i + 1, " out of ").concat(Math.ceil(fieldsOut.length / maxReactions)));
                            embMsg.setFields(fieldsOut.slice(i * maxReactions, (i + 1) * maxReactions));
                            embMsg.setTimestamp();
                            channel.send({ embeds: [embMsg] }).then(function (m) { return __awaiter(_this, void 0, void 0, function () {
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
                        interaction.reply({
                            content: 'Command Run',
                            ephemeral: true,
                        });
                        return [2 /*return*/];
                }
            });
        });
    },
};
//#endregion
