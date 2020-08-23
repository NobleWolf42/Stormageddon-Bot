//#region Dependancies
const { MessageEmbed } = require('discord.js');
const { addToLog } = require('../helpers/errorlog.js');
//#endregion

//#region Custom Embed
function embedCustom(message, title, color, text, img) {
    const embMsg = new MessageEmbed()
        .setTitle(title)
        .setColor(color)
        .setDescription(text)
        .setImage(img);
    message.channel.send(embMsg);
}
//#endregion

//#region Custom Direct Message Embed
function embedCustomDM(message, title, color, text, img) {
    const embMsg = new MessageEmbed()
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
    const embMsg = new MessageEmbed()
        .setTitle(title)
        .setColor('#1459C7')
        .setDescription(text);
    message.author.send(embMsg);
}
//#endregion

//#region Custom Warning
function warnCustom(message, text) {
    const embMsg = new MessageEmbed()
        .setTitle('Warning!')
        .setColor('#F8AA2A')
        .setDescription(text);
    message.channel.send(embMsg).then(msg => {msg.delete({ timeout: 15000, reason: 'Cleanup.' })});
    if (message.channel.guild != undefined) {
        addToLog('Warning', command.name, message.author.tag, message.guild.name, message.channel.name, client, text);
        message.delete({ timeout: 15000, reason: 'Cleanup.' });
    }
    else {
        addToLog('Warning', command.name, message.author.tag, 'Direct Message', 'Direct Message', client, text);
    }
}
//#endregion

//#region No Admin Access
function errorNoAdmin(message) {
    const embMsg = new MessageEmbed()
        .setTitle('Error!')
        .setColor('#FF0000')
        .setDescription('You do not have permission to use this command. This command requires *BOT ADMIN* access to use!');
    message.channel.send(embMsg).then(msg => {msg.delete({ timeout: 15000, reason: 'Cleanup.' })});
    if (message.channel.guild != undefined) {
        addToLog('Warning', command.name, message.author.tag, message.guild.name, message.channel.name, client, "Not Bot Admin!");
        message.delete({ timeout: 15000, reason: 'Cleanup.' });
    }
    else {
        addToLog('Warning', command.name, message.author.tag, 'Direct Message', 'Direct Message', client, "Not Bot Admin!");
    }
}
//#endregion

//#region No Mod Access
function errorNoMod(message) {
    const embMsg = new MessageEmbed()
        .setTitle('Error!')
        .setColor('#FF0000')
        .setDescription('You do not have permission to use this command. This command requires *BOT MOD* access to use!');
    message.channel.send(embMsg).then(msg => {msg.delete({ timeout: 15000, reason: 'Cleanup.' })});
    if (message.channel.guild != undefined) {
        addToLog('Warning', command.name, message.author.tag, message.guild.name, message.channel.name, client, "Not Bot Moderator!");
        message.delete({ timeout: 15000, reason: 'Cleanup.' });
    }
    else {
        addToLog('Warning', command.name, message.author.tag, 'Direct Message', 'Direct Message', client, "Not Bot Moderator!");
    }
}
//#endregion

//#region No DJ Access
function errorNoDJ(message) {
    const embMsg = new MessageEmbed()
        .setTitle('Error!')
        .setColor('#FF0000')
        .setDescription('You do not have permission to use this command. This command requires *DJ* access to use!');
    message.channel.send(embMsg).then(msg => {msg.delete({ timeout: 15000, reason: 'Cleanup.' })});
    if (message.channel.guild != undefined) {
        addToLog('Warning', command.name, message.author.tag, message.guild.name, message.channel.name, client, "Not DJ!");
        message.delete({ timeout: 15000, reason: 'Cleanup.' });
    }
    else {
        addToLog('Warning', command.name, message.author.tag, 'Direct Message', 'Direct Message', client, "Not DJ!");
    }
}
//#endregion

//#region No Server Admin Access
function errorNoServerAdmin(message) {
    const embMsg = new MessageEmbed()
        .setTitle('Error!')
        .setColor('#FF0000')
        .setDescription('You do not have permission to use this command. This command requires *SERVER ADMIN* access to use!');
    message.channel.send(embMsg).then(msg => {msg.delete({ timeout: 15000, reason: 'Cleanup.' })});
    if (message.channel.guild != undefined) {
        addToLog('Warning', command.name, message.author.tag, message.guild.name, message.channel.name, client, "Not Server Admin!");
        message.delete({ timeout: 15000, reason: 'Cleanup.' });
    }
    else {
        addToLog('Warning', command.name, message.author.tag, 'Direct Message', 'Direct Message', client, "Not Server Admin!");
    }
}
//#endregion

//#region Custom Error
function errorCustom(message, text) {
    const embMsg = new MessageEmbed()
        .setTitle('Error!')
        .setColor('#FF0000')
        .setDescription(text);
    message.channel.send(embMsg).then(msg => {msg.delete({ timeout: 15000, reason: 'Cleanup.' })});
    if (message.channel.guild != undefined) {
        addToLog('Warning', command.name, message.author.tag, message.guild.name, message.channel.name, client, text);
        message.delete({ timeout: 15000, reason: 'Cleanup.' });
    }
    else {
        addToLog('Warning', command.name, message.author.tag, 'Direct Message', 'Direct Message', client, text);
    }
}
//#endregion

//#region Wrong Channel
function warnWrongChannel(message, correctChannel) {
    const embMsg = new MessageEmbed()
        .setTitle('Warning!')
        .setColor('#F8AA2A')
        .setDescription(`That was not the correct channel for that command. The correct channel for this command is #${correctChannel}`);
    message.author.send(embMsg);
    if (message.channel.guild != undefined) {
        addToLog('Warning', command.name, message.author.tag, message.guild.name, message.channel.name, client, "Wrong Text Channel");
        message.delete();
    }
    else {
        addToLog('Warning', command.name, message.author.tag, 'Direct Message', 'Direct Message', client, "Wrong Text Channel");
    }
}
//#endregion

//#region Disabled
function warnDisabled(message, command) {
    const embMsg = new MessageEmbed()
        .setTitle('Warning!')
        .setColor('#F8AA2A')
        .setDescription(`This feature is currently disabled. To enable it, please run the !set ${command}. NOTE: Command is only avalible to a server admin.`);
    message.author.send(embMsg);
    if (message.channel.guild != undefined) {
        addToLog('Warning', command.name, message.author.tag, message.guild.name, message.channel.name, client, "Feature Disabled");
        message.delete();
    }
    else {
        addToLog('Warning', command.name, message.author.tag, 'Direct Message', 'Direct Message', client, "Feature Disabled");
    }
}
//#endregion

//#region exports
module.exports = { errorNoAdmin, errorNoMod, errorNoDJ, errorNoServerAdmin, errorCustom, warnWrongChannel, warnDisabled, embedCustom, warnCustom, embedHelp, embedCustomDM };
//#endregion