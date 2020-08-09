//#region Dependancies
var { MessageEmbed } = require('discord.js');
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

//#region Custom Embed
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
        message.delete({ timeout: 15000, reason: 'Cleanup.' });
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
        message.delete({ timeout: 15000, reason: 'Cleanup.' });
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
        message.delete({ timeout: 15000, reason: 'Cleanup.' });
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
        message.delete({ timeout: 15000, reason: 'Cleanup.' });
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
        message.delete({ timeout: 15000, reason: 'Cleanup.' });
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
        message.delete({ timeout: 15000, reason: 'Cleanup.' });
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
        message.delete();
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
        message.delete();
    }
}
//#endregion

//#region exports
module.exports = { errorNoAdmin, errorNoMod, errorNoDJ, errorNoServerAdmin, errorCustom, warnWrongChannel, warnDisabled, embedCustom, warnCustom, embedHelp, embedCustomDM };
//#endregion