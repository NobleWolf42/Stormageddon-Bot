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
//#region Function that takes several inputs and creates an embedded message and sends it in the channel that is attached to the Message Object
/**
 * This function takes several inputs and creates a custom embed message and then sends it in a server.
 * @param {Message} message - A Discord.js Message Object
 * @param {string} title - String for the Title/Header of the message
 * @param {string} color - String Hex Code for the color of the border
 * @param {string} text - String for the body of the embedded message
 * @param {object} footer - Object for the footer of the embedded message - Default: { text: `Requested by ${message.author.tag}`, iconURL: null }
 * @param {URL} img - URL to an Image to include - Default: null
 * @param {array} fields - addField arguments - Default: []
 * @param {URL} url - URL to add as the embedURL - Default: null
 * @param {URL} thumbnail - URL to thumbnail - Default: null
 * @returns {*} message.channel.send({ embeds: [embMsg] }) (Message Object)
 */
function embedCustom(message, title, color, text, footer, img, fields, url, thumbnail) {
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
                    if (message.channel.guild != undefined) {
                        if (!message.deleted) {
                            message.delete();
                            message.deleted = true;
                        }
                    }
                    return [4 /*yield*/, message.channel.send({ embeds: [embMsg] })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
//#endregion
//#region Function that takes several inputs and creates an embedded message and dms the user that is attached to the Message Object
/**
 * This function takes several inputs and creates an embed message and then sends it in a DM.
 * @param {Message} message - A Discord.js Message Object
 * @param {string} title - String for the Title/Header of the message
 * @param {string} color - String Hex Code for the color of the border
 * @param {string} text - String for the body of the embedded message
 * @param {URL} img - URL to an Image to include (optional)
 */
function embedCustomDM(message, title, color, text, img) {
    var embMsg = new EmbedBuilder()
        .setTitle(title)
        .setColor(color)
        .setDescription(text)
        .setFooter({
        text: "Requested by ".concat(message.author.tag),
        iconURL: null,
    })
        .setImage(img);
    message.author.send({ embeds: [embMsg] });
    if (message.channel.guild != undefined) {
        if (!message.deleted) {
            message.delete();
            message.deleted = true;
        }
    }
}
//#endregion
//#region Function that takes several inputs and creates an embedded message for the help command
/**
 * This function takes several inputs and creates an embed message for the help command.
 * @param {Message} message - A Discord.js Message Object
 * @param {string} title - String for the Title/Header of the message
 * @param {string} text - String for the body of the embedded message
 */
function embedHelp(message, title, text) {
    var embMsg = new EmbedBuilder()
        .setTitle(title)
        .setColor('#1459C7')
        .setDescription(text)
        .setFooter({
        text: "Requested by ".concat(message.author.tag),
        iconURL: null,
    });
    message.author.send({ embeds: [embMsg] });
    if (message.channel.guild != undefined) {
        if (!message.deleted) {
            message.delete();
            message.deleted = true;
        }
    }
}
//#endregion
//#region Function that takes several inputs and creates an embedded message for a custom warning
/**
 * This function takes several inputs and creates an embed message for a custom warning.
 * @param {Message} message - A Discord.js Message Object
 * @param {string} text - String for the body of the embedded message
 * @param {string} commandName - String of the name of the command
 */
function warnCustom(message, text, commandName) {
    var embMsg = new EmbedBuilder()
        .setTitle('Warning!')
        .setColor('#F8AA2A')
        .setDescription(text)
        .setFooter({
        text: "Requested by ".concat(message.author.tag),
        iconURL: null,
    });
    if (message.channel.guild != undefined) {
        message.channel.send({ embeds: [embMsg] }).then(function (msg) {
            setTimeout(function () { return msg.delete(); }, 15000);
        });
        addToLog('Warning', commandName, message.author.tag, message.guild.name, message.channel.name, text);
        if (!message.deleted) {
            message.delete();
            message.deleted = true;
        }
    }
    else {
        message.channel.send({ embeds: [embMsg] });
        addToLog('Warning', commandName, message.author.tag, 'Direct Message', 'Direct Message', text);
    }
}
//#endregion
//#region Function that takes several inputs and creates an embedded message for a lack of bot admin privileges
/**
 * This function takes several inputs and creates an embed message for an error stating a lack of bot admin privileges.
 * @param {Message} message - A Discord.js Message Object
 * @param {string} commandName - String of the name of the command
 */
function errorNoAdmin(message, commandName) {
    var embMsg = new EmbedBuilder()
        .setTitle('Error!')
        .setColor('#FF0000')
        .setDescription('You do not have permission to use this command. This command requires *BOT ADMIN* access to use!')
        .setFooter({
        text: "Requested by ".concat(message.author.tag),
        iconURL: null,
    });
    if (message.channel.guild != undefined) {
        message.channel.send({ embeds: [embMsg] }).then(function (msg) {
            setTimeout(function () { return msg.delete(); }, 15000);
        });
        addToLog('Warning', commandName, message.author.tag, message.guild.name, message.channel.name, 'Not Bot Admin!');
        if (!message.deleted) {
            message.delete();
            message.deleted = true;
        }
    }
    else {
        message.channel.send({ embeds: [embMsg] });
        addToLog('Warning', commandName, message.author.tag, 'Direct Message', 'Direct Message', 'Not Bot Admin!');
    }
}
//#endregion
//#region Function that takes several inputs and creates an embedded message for a lack of bot mod privileges
/**
 * This function takes several inputs and creates an embed message for an error stating a lack of bot mod privileges.
 * @param {Message} message - A Discord.js Message Object
 * @param {string} commandName - String of the name of the command
 */
function errorNoMod(message, commandName) {
    var embMsg = new EmbedBuilder()
        .setTitle('Error!')
        .setColor('#FF0000')
        .setDescription('You do not have permission to use this command. This command requires *BOT MOD* access to use!')
        .setFooter({
        text: "Requested by ".concat(message.author.tag),
        iconURL: null,
    });
    if (message.channel.guild != undefined) {
        message.channel.send({ embeds: [embMsg] }).then(function (msg) {
            setTimeout(function () { return msg.delete(); }, 15000);
        });
        addToLog('Warning', commandName, message.author.tag, message.guild.name, message.channel.name, 'Not Bot Moderator!');
        if (!message.deleted) {
            message.delete();
            message.deleted = true;
        }
    }
    else {
        message.channel.send({ embeds: [embMsg] });
        addToLog('Warning', commandName, message.author.tag, 'Direct Message', 'Direct Message', 'Not Bot Moderator!');
    }
}
//#endregion
//#region Function that takes several inputs and creates an embedded message for a lack of DJ privileges
/**
 * This function takes several inputs and creates an embed message for an error stating a lack of DJ privileges.
 * @param {Message} message - A Discord.js Message Object
 * @param {string} commandName - String of the name of the command
 */
function errorNoDJ(message, commandName) {
    var embMsg = new EmbedBuilder()
        .setTitle('Error!')
        .setColor('#FF0000')
        .setDescription('You do not have permission to use this command. This command requires *DJ* access to use!')
        .setFooter({
        text: "Requested by ".concat(message.author.tag),
        iconURL: null,
    });
    if (message.channel.guild != undefined) {
        message.channel.send({ embeds: [embMsg] }).then(function (msg) {
            setTimeout(function () { return msg.delete(); }, 15000);
        });
        addToLog('Warning', commandName, message.author.tag, message.guild.name, message.channel.name, 'Not a DJ!');
        if (!message.deleted) {
            message.delete();
            message.deleted = true;
        }
    }
    else {
        message.channel.send({ embeds: [embMsg] });
        addToLog('Warning', commandName, message.author.tag, 'Direct Message', 'Direct Message', 'Not DJ!');
    }
}
//#endregion
//#region Function that takes several inputs and creates an embedded message for a lack of server admin privileges
/**
 * This function takes several inputs and creates an embed message for an Error stating a lack of server admin privileges.
 * @param {Message} message - A Discord.js Message Object
 * @param {string} commandName - String of the name of the command
 */
function errorNoServerAdmin(message, commandName) {
    var embMsg = new EmbedBuilder()
        .setTitle('Error!')
        .setColor('#FF0000')
        .setDescription('You do not have permission to use this command. This command requires *SERVER ADMIN* access to use!')
        .setFooter({
        text: "Requested by ".concat(message.author.tag),
        iconURL: null,
    });
    if (message.channel.guild != undefined) {
        message.channel.send({ embeds: [embMsg] }).then(function (msg) {
            setTimeout(function () { return msg.delete(); }, 15000);
        });
        addToLog('Warning', commandName, message.author.tag, message.guild.name, message.channel.name, 'Not Server Admin!');
        if (!message.deleted) {
            message.delete();
            message.deleted = true;
        }
    }
    else {
        message.channel.send({ embeds: [embMsg] });
        addToLog('Warning', commandName, message.author.tag, 'Direct Message', 'Direct Message', 'Not Server Admin!');
    }
}
//#endregion
//#region Function that takes several inputs and creates an embedded message for a custom error
/**
 * This function takes several inputs and creates an embed message for a custom error.
 * @param {Message} message - A Discord.js Message Object
 * @param {string} text - String for the body of the embedded message
 * @param {string} commandName - String of the name of the command
 * @param {Client} client - A Discord.js Client Object
 */
function errorCustom(message, text, commandName, client) {
    return __awaiter(this, void 0, void 0, function () {
        var embMsg;
        return __generator(this, function (_a) {
            embMsg = new EmbedBuilder()
                .setTitle('Error!')
                .setColor('#FF0000')
                .setDescription(text)
                .setFooter({
                text: "Requested by ".concat(message.author.tag),
                iconURL: null,
            });
            if (message.channel.guild != undefined) {
                message.channel.send({ embeds: [embMsg] }).then(function (msg) {
                    setTimeout(function () { return msg.delete(); }, 15000);
                });
                addToLog('Fatal Error', commandName, message.author.tag, message.guild.name, message.channel.name, text, client);
                if (!message.deleted) {
                    message.delete();
                    message.deleted = true;
                }
            }
            else {
                message.channel.send({ embeds: [embMsg] });
                addToLog('Fatal Error', commandName, message.author.tag, 'Direct Message', 'Direct Message', text);
            }
            return [2 /*return*/];
        });
    });
}
//#endregion
//#region Function that takes several inputs and creates an embedded message for a wrong channel warning
/**
 * This function takes several inputs and creates an embed message for a wrong channel warning.
 * @param {Message} message - A Discord.js Message Object
 * @param {string} correctChannel - String for the correct channel to send the command in
 * @param {string} commandName - String of the name of the command
 */
function warnWrongChannel(message, correctChannel, commandName) {
    var embMsg = new EmbedBuilder()
        .setTitle('Warning!')
        .setColor('#F8AA2A')
        .setDescription("That was not the correct channel for that command. The correct channel for this command is #".concat(correctChannel))
        .setFooter({
        text: "Requested by ".concat(message.author.tag),
        iconURL: null,
    });
    message.author.send({ embeds: [embMsg] });
    if (message.channel.guild != undefined) {
        addToLog('Warning', commandName, message.author.tag, message.guild.name, message.channel.name, 'Wrong Text Channel');
        if (!message.deleted) {
            message.delete();
            message.deleted = true;
        }
    }
    else {
        addToLog('Warning', commandName, message.author.tag, 'Direct Message', 'Direct Message', 'Wrong Text Channel');
    }
}
//#endregion
//#region Function that takes several inputs and creates an embedded message for a disabled command warning
/**
 * This function takes several inputs and creates an embed message for a disabled command warning.
 * @param {Message} message - A Discord.js Message Object
 * @param {string} feature - String for the name of the feature
 * @param {string} commandName - String of the name of the command
 */
function warnDisabled(message, feature, commandName) {
    var embMsg = new EmbedBuilder()
        .setTitle('Warning!')
        .setColor('#F8AA2A')
        .setDescription("This feature is currently disabled. To enable it, please run the !set ".concat(feature, ". NOTE: This command is only available to a server admin."))
        .setFooter({
        text: "Requested by ".concat(message.author.tag),
        iconURL: null,
    });
    message.author.send({ embeds: [embMsg] });
    if (message.channel.guild != undefined) {
        addToLog('Warning', commandName, message.author.tag, message.guild.name, message.channel.name, 'Feature Disabled');
        if (!message.deleted) {
            message.delete();
            message.deleted = true;
        }
    }
    else {
        addToLog('Warning', commandName, message.author.tag, 'Direct Message', 'Direct Message', 'Feature Disabled');
    }
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
