//#region Dependencies
const { EmbedBuilder } = require('discord.js');
//#endregion

//#region Helpers
const { addToLog } = require('./errorLog.js');
//#endregion

//#region Function that takes several inputs and creates an embedded message and sends it in the channel that is attached to the Message Object
/**
 * This function takes several inputs and creates an embed message and then sends it in a server.
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
async function embedCustom(message, title, color, text, footer, img, fields, url, thumbnail) {
    const embMsg = new EmbedBuilder()
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

    return await (message.channel.send({ embeds: [embMsg] }));
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
    const embMsg = new EmbedBuilder()
        .setTitle(title)
        .setColor(color)
        .setDescription(text)
        .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: null })
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
    const embMsg = new EmbedBuilder()
        .setTitle(title)
        .setColor('#1459C7')
        .setDescription(text)
        .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: null });
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
    const embMsg = new EmbedBuilder()
        .setTitle('Warning!')
        .setColor('#F8AA2A')
        .setDescription(text)
        .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: null });
    
    if (message.channel.guild != undefined) {
        message.channel.send({ embeds: [embMsg] }).then(msg => {setTimeout( () => msg.delete(), 15000)});
        addToLog('Warning', commandName, message.author.tag, message.guild.name, message.channel.name, text);
        if (!message.deleted) {
            message.delete();
            message.deleted = true;
        }
    } else {
        message.channel.send({ embeds: [embMsg] });
        addToLog('Warning', commandName, message.author.tag, 'Direct Message', 'Direct Message', text);
    }
}
//#endregion

//#region Function that takes several inputs and creates an embedded message for a lack of bot admin privileges
/**
 * This function takes several inputs and creates an embed message for an Error stating a lack of bot admin privileges.
 * @param {Message} message - A Discord.js Message Object
 * @param {string} commandName - String of the name of the command
 */
function errorNoAdmin(message, commandName) {
    const embMsg = new EmbedBuilder()
        .setTitle('Error!')
        .setColor('#FF0000')
        .setDescription('You do not have permission to use this command. This command requires *BOT ADMIN* access to use!')
        .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: null });
    if (message.channel.guild != undefined) {
        message.channel.send({ embeds: [embMsg] }).then(msg => {setTimeout( () => msg.delete(), 15000)});
        addToLog('Warning', commandName, message.author.tag, message.guild.name, message.channel.name, "Not Bot Admin!");
        if (!message.deleted) {
            message.delete();
            message.deleted = true;
        }
    } else {
        message.channel.send({ embeds: [embMsg] });
        addToLog('Warning', commandName, message.author.tag, 'Direct Message', 'Direct Message', "Not Bot Admin!");
    }
}
//#endregion

//#region Function that takes several inputs and creates an embedded message for a lack of mod privileges
/**
 * This function takes several inputs and creates an embed message for an Error stating a lack of mod privileges.
 * @param {Message} message - A Discord.js Message Object
 * @param {string} commandName - String of the name of the command
 */
function errorNoMod(message, commandName) {
    const embMsg = new EmbedBuilder()
        .setTitle('Error!')
        .setColor('#FF0000')
        .setDescription('You do not have permission to use this command. This command requires *BOT MOD* access to use!')
        .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: null });
    if (message.channel.guild != undefined) {
        message.channel.send({ embeds: [embMsg] }).then(msg => {setTimeout( () => msg.delete(), 15000)});
        addToLog('Warning', commandName, message.author.tag, message.guild.name, message.channel.name, "Not Bot Moderator!");
        if (!message.deleted) {
            message.delete();
            message.deleted = true;
        }
    } else {
        message.channel.send({ embeds: [embMsg] });
        addToLog('Warning', commandName, message.author.tag, 'Direct Message', 'Direct Message', "Not Bot Moderator!");
    }
}
//#endregion

//#region Function that takes several inputs and creates an embedded message for a lack of DJ privileges
/**
 * This function takes several inputs and creates an embed message for an Error stating a lack of DJ privileges.
 * @param {Message} message - A Discord.js Message Object
 * @param {string} commandName - String of the name of the command
 */
function errorNoDJ(message, commandName) {
    const embMsg = new EmbedBuilder()
        .setTitle('Error!')
        .setColor('#FF0000')
        .setDescription('You do not have permission to use this command. This command requires *DJ* access to use!')
        .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: null });
    if (message.channel.guild != undefined) {
        message.channel.send({ embeds: [embMsg] }).then(msg => {setTimeout( () => msg.delete(), 15000)});
        addToLog('Warning', commandName, message.author.tag, message.guild.name, message.channel.name, "Not a DJ!");
        if (!message.deleted) {
            message.delete();
            message.deleted = true;
        }
    } else {
        message.channel.send({ embeds: [embMsg] });
        addToLog('Warning', commandName, message.author.tag, 'Direct Message', 'Direct Message', "Not DJ!");
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
    const embMsg = new EmbedBuilder()
        .setTitle('Error!')
        .setColor('#FF0000')
        .setDescription('You do not have permission to use this command. This command requires *SERVER ADMIN* access to use!')
        .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: null });
    if (message.channel.guild != undefined) {
        message.channel.send({ embeds: [embMsg] }).then(msg => {setTimeout( () => msg.delete(), 15000)});
        addToLog('Warning', commandName, message.author.tag, message.guild.name, message.channel.name, "Not Server Admin!");
        if (!message.deleted) {
            message.delete();
            message.deleted = true;
        }
    } else {
        message.channel.send({ embeds: [embMsg] });
        addToLog('Warning', commandName, message.author.tag, 'Direct Message', 'Direct Message', "Not Server Admin!");
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
async function errorCustom(message, text, commandName, client) {
    const embMsg = new EmbedBuilder()
        .setTitle('Error!')
        .setColor('#FF0000')
        .setDescription(text)
        .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: null });
    if (message.channel.guild != undefined) {
        message.channel.send({ embeds: [embMsg] }).then(msg => {setTimeout( () => msg.delete(), 15000)});
        addToLog('Fatal Error', commandName, message.author.tag, message.guild.name, message.channel.name, text, client);
        if (!message.deleted) {
            message.delete();
            message.deleted = true;
        }
    } else {
        message.channel.send({ embeds: [embMsg] });
        addToLog('Fatal Error', commandName, message.author.tag, 'Direct Message', 'Direct Message', text);
    }
}
//#endregion

//#region Function that takes several inputs and creates an embedded message for a wrong channel error
/**
 * This function takes several inputs and creates an embed message for a custom error.
 * @param {Message} message - A Discord.js Message Object
 * @param {string} correctChannel - String for the correct channel to send the command in
 * @param {string} commandName - String of the name of the command
 */
function warnWrongChannel(message, correctChannel, commandName) {
    const embMsg = new EmbedBuilder()
        .setTitle('Warning!')
        .setColor('#F8AA2A')
        .setDescription(`That was not the correct channel for that command. The correct channel for this command is #${correctChannel}`)
        .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: null });
    message.author.send({ embeds: [embMsg] });
    if (message.channel.guild != undefined) {
        addToLog('Warning', commandName, message.author.tag, message.guild.name, message.channel.name, "Wrong Text Channel");
        if (!message.deleted) {
            message.delete();
            message.deleted = true;
        }
    }
    else {
        addToLog('Warning', commandName, message.author.tag, 'Direct Message', 'Direct Message', "Wrong Text Channel");
    }
}
//#endregion

//#region Function that takes several inputs and creates an embedded message for a disabled command error
/**
 * This function takes several inputs and creates an embed message for a custom error.
 * @param {Message} message - A Discord.js Message Object
 * @param {string} feature - String for the name of the feature
 * @param {string} commandName - String of the name of the command
 */
function warnDisabled(message, feature, commandName) {
    const embMsg = new EmbedBuilder()
        .setTitle('Warning!')
        .setColor('#F8AA2A')
        .setDescription(`This feature is currently disabled. To enable it, please run the !set ${feature}. NOTE: This command is only available to a server admin.`)
        .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: null });
    message.author.send({ embeds: [embMsg] });
    if (message.channel.guild != undefined) {
        addToLog('Warning', commandName, message.author.tag, message.guild.name, message.channel.name, "Feature Disabled");
        if (!message.deleted) {
            message.delete();
            message.deleted = true;
        }
    }
    else {
        addToLog('Warning', commandName, message.author.tag, 'Direct Message', 'Direct Message', "Feature Disabled");
    }
}
//#endregion

//#region exports
module.exports = { errorNoAdmin, errorNoMod, errorNoDJ, errorNoServerAdmin, errorCustom, warnWrongChannel, warnDisabled, embedCustom, warnCustom, embedHelp, embedCustomDM };
//#endregion