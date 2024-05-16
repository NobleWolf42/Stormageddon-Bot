//#region Dependancies
const { EmbedBuilder } = require('discord.js');
const { addToLog } = require('../helpers/errorlog.js');
//#endregion

//#region Custom Embed
function embedCustom(message, title, color, text, img) {
    const embMsg = new EmbedBuilder()
        .setTitle(title)
        .setColor(color)
        .setDescription(text)
        .setImage(img);
    message.channel.send({ embeds: [embMsg] });
}
//#endregion

//#region Custom Direct Message Embed
function embedCustomDM(message, title, color, text, img) {
    const embMsg = new EmbedBuilder()
        .setTitle(title)
        .setColor(color)
        .setDescription(text)
        .setImage(img);
    message.author.send(embMsg);
    if (message.channel.guild != undefined) {
        message.delete({ timeout: 15000, reason: 'Cleanup.' });
    }
}
//#endregion

//#region Help Embed
function embedHelp(message, title, text) {
    const embMsg = new EmbedBuilder()
        .setTitle(title)
        .setColor('#1459C7')
        .setDescription(text);
    message.author.send(embMsg);
}
//#endregion

//#region Custom Warning
function warnCustom(message, text, commandName) {
    const embMsg = new EmbedBuilder()
        .setTitle('Warning!')
        .setColor('#F8AA2A')
        .setDescription(text);
    if (message.channel.guild != undefined) {
        message.channel.send(embMsg).then(msg => {msg.delete({ timeout: 15000, reason: 'Cleanup.' })});
        addToLog('Warning', commandName, message.author.tag, message.guild.name, message.channel.name, text);
        message.delete({ timeout: 15000, reason: 'Cleanup.' });
    }
    else {
        message.channel.send(embMsg);
        addToLog('Warning', commandName, message.author.tag, 'Direct Message', 'Direct Message', text);
    }
}
//#endregion

//#region No Admin Access
function errorNoAdmin(message, commandName) {
    const embMsg = new EmbedBuilder()
        .setTitle('Error!')
        .setColor('#FF0000')
        .setDescription('You do not have permission to use this command. This command requires *BOT ADMIN* access to use!');
    if (message.channel.guild != undefined) {
        message.channel.send(embMsg).then(msg => {msg.delete({ timeout: 15000, reason: 'Cleanup.' })});
        addToLog('Warning', commandName, message.author.tag, message.guild.name, message.channel.name, "Not Bot Admin!");
        message.delete({ timeout: 15000, reason: 'Cleanup.' });
    }
    else {
        message.channel.send(embMsg);
        addToLog('Warning', commandName, message.author.tag, 'Direct Message', 'Direct Message', "Not Bot Admin!");
    }
}
//#endregion

//#region No Mod Access
function errorNoMod(message, commandName) {
    const embMsg = new EmbedBuilder()
        .setTitle('Error!')
        .setColor('#FF0000')
        .setDescription('You do not have permission to use this command. This command requires *BOT MOD* access to use!');
    if (message.channel.guild != undefined) {
        message.channel.send(embMsg).then(msg => {msg.delete({ timeout: 15000, reason: 'Cleanup.' })});
        addToLog('Warning', commandName, message.author.tag, message.guild.name, message.channel.name, "Not Bot Moderator!");
        message.delete({ timeout: 15000, reason: 'Cleanup.' });
    }
    else {
        message.channel.send(embMsg);
        addToLog('Warning', commandName, message.author.tag, 'Direct Message', 'Direct Message', "Not Bot Moderator!");
    }
}
//#endregion

//#region No DJ Access
function errorNoDJ(message, commandName) {
    const embMsg = new EmbedBuilder()
        .setTitle('Error!')
        .setColor('#FF0000')
        .setDescription('You do not have permission to use this command. This command requires *DJ* access to use!');
    if (message.channel.guild != undefined) {
        message.channel.send(embMsg).then(msg => {msg.delete({ timeout: 15000, reason: 'Cleanup.' })});
        addToLog('Warning', commandName, message.author.tag, message.guild.name, message.channel.name, "Not DJ!");
        message.delete({ timeout: 15000, reason: 'Cleanup.' });
    }
    else {
        message.channel.send(embMsg);
        addToLog('Warning', commandName, message.author.tag, 'Direct Message', 'Direct Message', "Not DJ!");
    }
}
//#endregion

//#region No Server Admin Access
function errorNoServerAdmin(message, commandName) {
    const embMsg = new EmbedBuilder()
        .setTitle('Error!')
        .setColor('#FF0000')
        .setDescription('You do not have permission to use this command. This command requires *SERVER ADMIN* access to use!');
    if (message.channel.guild != undefined) {
        message.channel.send(embMsg).then(msg => {msg.delete({ timeout: 15000, reason: 'Cleanup.' })});
        addToLog('Warning', commandName, message.author.tag, message.guild.name, message.channel.name, "Not Server Admin!");
        message.delete({ timeout: 15000, reason: 'Cleanup.' });
    }
    else {
        message.channel.send(embMsg);
        addToLog('Warning', commandName, message.author.tag, 'Direct Message', 'Direct Message', "Not Server Admin!");
    }
}
//#endregion

//#region Custom Error
function errorCustom(message, text, commandName) {
    const embMsg = new EmbedBuilder()
        .setTitle('Error!')
        .setColor('#FF0000')
        .setDescription(text);
    if (message.channel.guild != undefined) {
        message.channel.send(embMsg).then(msg => {msg.delete({ timeout: 15000, reason: 'Cleanup.' })});
        addToLog('Fatal Error', commandName, message.author.tag, message.guild.name, message.channel.name, text);
        message.delete({ timeout: 15000, reason: 'Cleanup.' });
    }
    else {
        message.channel.send(embMsg);
        addToLog('Fatal Error', commandName, message.author.tag, 'Direct Message', 'Direct Message', text);
    }
}
//#endregion

//#region Wrong Channel
function warnWrongChannel(message, correctChannel, commandName) {
    const embMsg = new EmbedBuilder()
        .setTitle('Warning!')
        .setColor('#F8AA2A')
        .setDescription(`That was not the correct channel for that command. The correct channel for this command is #${correctChannel}`);
    message.author.send(embMsg);
    if (message.channel.guild != undefined) {
        addToLog('Warning', commandName, message.author.tag, message.guild.name, message.channel.name, "Wrong Text Channel");
        message.delete({ timeout: 1500, reason: 'Cleanup.' });
    }
    else {
        addToLog('Warning', commandName, message.author.tag, 'Direct Message', 'Direct Message', "Wrong Text Channel");
    }
}
//#endregion

//#region Disabled
function warnDisabled(message, command, commandName) {
    const embMsg = new EmbedBuilder()
        .setTitle('Warning!')
        .setColor('#F8AA2A')
        .setDescription(`This feature is currently disabled. To enable it, please run the !set ${command}. NOTE: Command is only avalible to a server admin.`);
    message.author.send(embMsg);
    if (message.channel.guild != undefined) {
        addToLog('Warning', commandName, message.author.tag, message.guild.name, message.channel.name, "Feature Disabled");
        message.delete({ timeout: 1500, reason: 'Cleanup.' });
    }
    else {
        addToLog('Warning', commandName, message.author.tag, 'Direct Message', 'Direct Message', "Feature Disabled");
    }
}
//#endregion

//#region exports
module.exports = { errorNoAdmin, errorNoMod, errorNoDJ, errorNoServerAdmin, errorCustom, warnWrongChannel, warnDisabled, embedCustom, warnCustom, embedHelp, embedCustomDM };
//#endregion