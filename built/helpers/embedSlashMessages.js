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
//#region Helpers
var addToLog = require('./errorLog.js').addToLog;
//#endregion
//#region Function that takes several inputs and creates an embedded interaction and sends it in the channel that is attached to the Interaction Object
/**
 * This function takes several inputs and creates an embed interaction and then sends it in a server.
 * @param {Interaction} interaction - A Discord.js Interaction Object
 * @param {string} title - String for the Title/Header of the interaction
 * @param {string} color - String Hex Code for the color of the border
 * @param {string} text - String for the body of the embedded interaction
 * @param {object} footer - Object for the footer of the embedded interaction - Default: { text: `Requested by ${interaction.user.username}`, iconURL: null }
 * @param {URL} img - URL to an Image to include - Default: null
 * @param {array} fields - addField arguments - Default: []
 * @param {URL} url - URL to add as the embedURL - Default: null
 * @param {URL} thumbnail - URL to thumbnail - Default: null
 * @returns {*} interaction.reply({ embeds: [embMsg] }) (Interaction Object)
 */
function embedCustom(interaction, title, color, text, footer, img, fields, url, thumbnail) {
    return __awaiter(this, void 0, void 0, function () {
        var embMsg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    embMsg = new EmbedBuilder()
                        .setTitle(title)
                        .setColor(color)
                        .setDescription(text)
                        .setFooter(footer)
                        .setImage(img)
                        .addFields(fields)
                        .setURL(url)
                        .setThumbnail(thumbnail)
                        .setTimestamp();
                    return [4 /*yield*/, interaction.reply({ embeds: [embMsg] })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
//#endregion
//#region Function that takes several inputs and creates an embedded interaction and dms the user that is attached to the Interaction Object
/**
 * This function takes several inputs and creates an embed interaction and then sends it in a DM.
 * @param {Interaction} interaction - A Discord.js Interaction Object
 * @param {string} title - String for the Title/Header of the interaction
 * @param {string} color - String Hex Code for the color of the border
 * @param {string} text - String for the body of the embedded interaction
 * @param {URL} img - URL to an Image to include (optional)
 * @param {Client} client - A Discord.js Client Object
 */
function embedCustomDM(interaction, title, color, text, img, client) {
    return __awaiter(this, void 0, void 0, function () {
        var embMsg, usr;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    embMsg = new EmbedBuilder()
                        .setTitle(title)
                        .setColor(color)
                        .setDescription(text)
                        .setFooter({
                        text: "Requested by ".concat(interaction.user.username),
                        iconURL: null,
                    })
                        .setImage(img);
                    return [4 /*yield*/, client.users.fetch(interaction.member.user.id)];
                case 1:
                    usr = _a.sent();
                    usr.send({ embeds: [embMsg] });
                    interaction.reply({
                        content: 'Sent',
                        ephemeral: true,
                    });
                    return [2 /*return*/];
            }
        });
    });
}
//#endregion
//#region Function that takes several inputs and creates an embedded interaction for the help command
/**
 * This function takes several inputs and creates an embed interaction for the help command.
 * @param {Interaction} interaction - A Discord.js Interaction Object
 * @param {string} title - String for the Title/Header of the interaction
 * @param {string} text - String for the body of the embedded interaction
 * @param {Client} client - A Discord.js Client Object
 */
function embedHelp(interaction, title, text, client) {
    return __awaiter(this, void 0, void 0, function () {
        var embMsg;
        return __generator(this, function (_a) {
            embMsg = new EmbedBuilder()
                .setTitle(title)
                .setColor('#1459C7')
                .setDescription(text)
                .setFooter({
                text: "Requested by ".concat(interaction.user.username),
                iconURL: null,
            });
            interaction.reply({ embeds: [embMsg], ephemeral: true });
            return [2 /*return*/];
        });
    });
}
//#endregion
//#region Function that takes several inputs and creates an embedded interaction for a custom warning
/**
 * This function takes several inputs and creates an embed interaction for a custom warning.
 * @param {Interaction} interaction - A Discord.js Interaction Object
 * @param {string} text - String for the body of the embedded interaction
 * @param {string} commandName - String of the name of the command
 * @param {Client} client - A Discord.js Client Object
 */
function warnCustom(interaction, text, commandName, client) {
    return __awaiter(this, void 0, void 0, function () {
        var embMsg, channel;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    embMsg = new EmbedBuilder()
                        .setTitle('Warning!')
                        .setColor('#F8AA2A')
                        .setDescription(text)
                        .setFooter({
                        text: "Requested by ".concat(interaction.user.username),
                        iconURL: null,
                    });
                    if (!(interaction.guildId != null)) return [3 /*break*/, 2];
                    return [4 /*yield*/, client.channels.fetch(interaction.channelId)];
                case 1:
                    channel = _a.sent();
                    interaction.reply({ embeds: [embMsg], ephemeral: true });
                    addToLog('Warning', commandName, interaction.user.username, interaction.member.guild.name, channel.name, text);
                    return [3 /*break*/, 3];
                case 2:
                    interaction.reply({ embeds: [embMsg], ephemeral: true });
                    addToLog('Warning', commandName, interaction.user.username, 'Direct Interaction', 'Direct Interaction', text);
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
//#endregion
//#region Function that takes several inputs and creates an embedded interaction for a lack of bot admin privileges
/**
 * This function takes several inputs and creates an embed interaction for an Error stating a lack of bot admin privileges.
 * @param {Interaction} interaction - A Discord.js Interaction Object
 * @param {string} commandName - String of the name of the command
 * @param {Client} client - A Discord.js Client Object
 */
function errorNoAdmin(interaction, commandName, client) {
    return __awaiter(this, void 0, void 0, function () {
        var embMsg, channel;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    embMsg = new EmbedBuilder()
                        .setTitle('Error!')
                        .setColor('#FF0000')
                        .setDescription('You do not have permission to use this command. This command requires *BOT ADMIN* access to use!')
                        .setFooter({
                        text: "Requested by ".concat(interaction.user.username),
                        iconURL: null,
                    });
                    if (!(interaction.guildId != null)) return [3 /*break*/, 2];
                    return [4 /*yield*/, client.channels.fetch(interaction.channelId)];
                case 1:
                    channel = _a.sent();
                    interaction.reply({ embeds: [embMsg], ephemeral: true });
                    addToLog('Warning', commandName, interaction.user.username, interaction.member.guild.name, channel.name, 'Not Bot Admin!');
                    return [3 /*break*/, 3];
                case 2:
                    interaction.reply({ embeds: [embMsg], ephemeral: true });
                    addToLog('Warning', commandName, interaction.user.username, 'Direct Interaction', 'Direct Interaction', 'Not Bot Admin!');
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
//#endregion
//#region Function that takes several inputs and creates an embedded interaction for a lack of mod privileges
/**
 * This function takes several inputs and creates an embed interaction for an Error stating a lack of mod privileges.
 * @param {Interaction} interaction - A Discord.js Interaction Object
 * @param {string} commandName - String of the name of the command
 * @param {Client} client - A Discord.js Client Object
 */
function errorNoMod(interaction, commandName, client) {
    return __awaiter(this, void 0, void 0, function () {
        var embMsg, channel;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    embMsg = new EmbedBuilder()
                        .setTitle('Error!')
                        .setColor('#FF0000')
                        .setDescription('You do not have permission to use this command. This command requires *BOT MOD* access to use!')
                        .setFooter({
                        text: "Requested by ".concat(interaction.user.username),
                        iconURL: null,
                    });
                    if (!(interaction.guildId != null)) return [3 /*break*/, 2];
                    return [4 /*yield*/, client.channels.fetch(interaction.channelId)];
                case 1:
                    channel = _a.sent();
                    interaction.reply({ embeds: [embMsg], ephemeral: true });
                    addToLog('Warning', commandName, interaction.user.username, interaction.member.guild.name, channel.name, 'Not Bot Moderator!');
                    return [3 /*break*/, 3];
                case 2:
                    interaction.reply({ embeds: [embMsg], ephemeral: true });
                    addToLog('Warning', commandName, interaction.user.username, 'Direct Interaction', 'Direct Interaction', 'Not Bot Moderator!');
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
//#endregion
//#region Function that takes several inputs and creates an embedded interaction for a lack of DJ privileges
/**
 * This function takes several inputs and creates an embed interaction for an Error stating a lack of DJ privileges.
 * @param {Interaction} interaction - A Discord.js Interaction Object
 * @param {string} commandName - String of the name of the command
 * @param {Client} client - A Discord.js Client Object
 */
function errorNoDJ(interaction, commandName, client) {
    return __awaiter(this, void 0, void 0, function () {
        var embMsg, channel;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    embMsg = new EmbedBuilder()
                        .setTitle('Error!')
                        .setColor('#FF0000')
                        .setDescription('You do not have permission to use this command. This command requires *DJ* access to use!')
                        .setFooter({
                        text: "Requested by ".concat(interaction.user.username),
                        iconURL: null,
                    });
                    if (!(interaction.guildId != null)) return [3 /*break*/, 2];
                    return [4 /*yield*/, client.channels.fetch(interaction.channelId)];
                case 1:
                    channel = _a.sent();
                    interaction.reply({ embeds: [embMsg], ephemeral: true });
                    addToLog('Warning', commandName, interaction.user.username, interaction.member.guild.name, channel.name, 'Not a DJ!');
                    return [3 /*break*/, 3];
                case 2:
                    interaction.reply({ embeds: [embMsg], ephemeral: true });
                    addToLog('Warning', commandName, interaction.user.username, 'Direct Interaction', 'Direct Interaction', 'Not DJ!');
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
//#endregion
//#region Function that takes several inputs and creates an embedded interaction for a lack of server admin privileges
/**
 * This function takes several inputs and creates an embed interaction for an Error stating a lack of server admin privileges.
 * @param {Interaction} interaction - A Discord.js Interaction Object
 * @param {string} commandName - String of the name of the command
 * @param {Client} client - A Discord.js Client Object
 */
function errorNoServerAdmin(interaction, commandName, client) {
    return __awaiter(this, void 0, void 0, function () {
        var embMsg, channel;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    embMsg = new EmbedBuilder()
                        .setTitle('Error!')
                        .setColor('#FF0000')
                        .setDescription('You do not have permission to use this command. This command requires *SERVER ADMIN* access to use!')
                        .setFooter({
                        text: "Requested by ".concat(interaction.user.username),
                        iconURL: null,
                    });
                    if (!(interaction.guildId != null)) return [3 /*break*/, 2];
                    return [4 /*yield*/, client.channels.fetch(interaction.channelId)];
                case 1:
                    channel = _a.sent();
                    interaction.reply({ embeds: [embMsg], ephemeral: true });
                    addToLog('Warning', commandName, interaction.user.username, interaction.member.guild.name, channel.name, 'Not Server Admin!');
                    return [3 /*break*/, 3];
                case 2:
                    interaction.reply({ embeds: [embMsg], ephemeral: true });
                    addToLog('Warning', commandName, interaction.user.username, 'Direct Interaction', 'Direct Interaction', 'Not Server Admin!');
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
//#endregion
//#region Function that takes several inputs and creates an embedded interaction for a custom error
/**
 * This function takes several inputs and creates an embed interaction for a custom error.
 * @param {Interaction} interaction - A Discord.js Interaction Object
 * @param {string} text - String for the body of the embedded interaction
 * @param {string} commandName - String of the name of the command
 * @param {Client} client - A Discord.js Client Object
 */
function errorCustom(interaction, text, commandName, client) {
    return __awaiter(this, void 0, void 0, function () {
        var embMsg, channel;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    embMsg = new EmbedBuilder()
                        .setTitle('Error!')
                        .setColor('#FF0000')
                        .setDescription(text)
                        .setFooter({
                        text: "Requested by ".concat(interaction.user.username),
                        iconURL: null,
                    });
                    if (!(interaction.guildId != null)) return [3 /*break*/, 2];
                    return [4 /*yield*/, client.channels.fetch(interaction.channelId)];
                case 1:
                    channel = _a.sent();
                    interaction.reply({ embeds: [embMsg], ephemeral: true });
                    addToLog('Fatal Error', commandName, interaction.user.username, interaction.member.guild.name, channel.name, text, client);
                    return [3 /*break*/, 3];
                case 2:
                    interaction.reply({ embeds: [embMsg], ephemeral: true });
                    addToLog('Fatal Error', commandName, interaction.user.username, 'Direct Interaction', 'Direct Interaction', text);
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
//#endregion
//#region Function that takes several inputs and creates an embedded interaction for a wrong channel error
/**
 * This function takes several inputs and creates an embed interaction for a custom error.
 * @param {Interaction} interaction - A Discord.js Interaction Object
 * @param {string} correctChannel - String for the correct channel to send the command in
 * @param {string} commandName - String of the name of the command
 * @param {Client} client - A Discord.js Client Object
 */
function warnWrongChannel(interaction, correctChannel, commandName, client) {
    return __awaiter(this, void 0, void 0, function () {
        var embMsg, channel;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    embMsg = new EmbedBuilder()
                        .setTitle('Warning!')
                        .setColor('#F8AA2A')
                        .setDescription("That was not the correct channel for that command. The correct channel for this command is #".concat(correctChannel))
                        .setFooter({
                        text: "Requested by ".concat(interaction.user.username),
                        iconURL: null,
                    });
                    interaction.reply({ embeds: [embMsg], ephemeral: true });
                    if (!(interaction.guildId != null)) return [3 /*break*/, 2];
                    return [4 /*yield*/, client.channels.fetch(interaction.channelId)];
                case 1:
                    channel = _a.sent();
                    addToLog('Warning', commandName, interaction.user.username, interaction.member.guild.name, channel.name, 'Wrong Text Channel');
                    return [3 /*break*/, 3];
                case 2:
                    addToLog('Warning', commandName, interaction.user.username, 'Direct Interaction', 'Direct Interaction', 'Wrong Text Channel');
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
//#endregion
//#region Function that takes several inputs and creates an embedded interaction for a disabled command error
/**
 * This function takes several inputs and creates an embed interaction for a custom error.
 * @param {Interaction} interaction - A Discord.js Interaction Object
 * @param {string} feature - String for the name of the feature
 * @param {string} commandName - String of the name of the command
 * @param {Client} client - A Discord.js Client Object
 */
function warnDisabled(interaction, feature, commandName, client) {
    return __awaiter(this, void 0, void 0, function () {
        var embMsg, channel;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    embMsg = new EmbedBuilder()
                        .setTitle('Warning!')
                        .setColor('#F8AA2A')
                        .setDescription("This feature is currently disabled. To enable it, please run the !set ".concat(feature, ". NOTE: This command is only available to a server admin."))
                        .setFooter({
                        text: "Requested by ".concat(interaction.user.username),
                        iconURL: null,
                    });
                    interaction.reply({ embeds: [embMsg], ephemeral: true });
                    if (!(interaction.guildId != null)) return [3 /*break*/, 2];
                    return [4 /*yield*/, client.channels.fetch(interaction.channelId)];
                case 1:
                    channel = _a.sent();
                    addToLog('Warning', commandName, interaction.user.username, interaction.member.guild.name, channel.name, 'Feature Disabled');
                    return [3 /*break*/, 3];
                case 2:
                    addToLog('Warning', commandName, interaction.user.username, 'Direct Interaction', 'Direct Interaction', 'Feature Disabled');
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
//#endregion
//#region exports
module.exports = {
    errorNoAdmin: errorNoAdmin,
    errorNoMod: errorNoMod,
    errorNoDJ: errorNoDJ,
    errorNoServerAdmin: errorNoServerAdmin,
    errorCustom: errorCustom,
    warnWrongChannel: warnWrongChannel,
    warnDisabled: warnDisabled,
    embedCustom: embedCustom,
    warnCustom: warnCustom,
    embedHelp: embedHelp,
    embedCustomDM: embedCustomDM,
};
//#endregion
