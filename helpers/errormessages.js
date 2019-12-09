//#region Dependancies
var Discord = require('discord.js');
//#endregion

//#region No Admin Access
function noAdmin(message) {
    const embMsg = new Discord.RichEmbed()
        .setTitle('Error!')
        .setColor(0xb50000)
        .setDescription('You do not have permission to use this command. This command requires *BOT ADMIN* access to use!');
    message.channel.send(embMsg);
}
//#endregion

//#region No Mod Access
function noMod(message) {
    const embMsg = new Discord.RichEmbed()
        .setTitle('Error!')
        .setColor(0xb50000)
        .setDescription('You do not have permission to use this command. This command requires *BOT MOD* access to use!');
    message.channel.send(embMsg);
}
//#endregion

//#region No DJ Access
function noDJ(message) {
    const embMsg = new Discord.RichEmbed()
        .setTitle('Error!')
        .setColor(0xb50000)
        .setDescription('You do not have permission to use this command. This command requires *DJ* access to use!');
    message.channel.send(embMsg);
}
//#endregion

//#region No Server Admin Access
function noServerAdmin(message) {
    const embMsg = new Discord.RichEmbed()
        .setTitle('Error!')
        .setColor(0xb50000)
        .setDescription('You do not have permission to use this command. This command requires *SERVER ADMIN* access to use!');
    message.channel.send(embMsg);
}
//#endregion

//#region No Server Admin Access
function custom(message, text) {
    const embMsg = new Discord.RichEmbed()
        .setTitle('Error!')
        .setColor(0xb50000)
        .setDescription(text);
    message.channel.send(embMsg);
}
//#endregion

//#region No Server Admin Access
function wrongChannel(message, correctChannel) {
    const embMsg = new Discord.RichEmbed()
        .setTitle('Error!')
        .setColor(0xb50000)
        .setDescription(`That was not the correct channel for that command. The correct channel for this command is #${correctChannel}`);
    message.author.send(embMsg);
    message.delete().catch(O_o=>{});
}
//#endregion

//#region exports
module.exports = { noAdmin, noMod, noDJ, noServerAdmin, custom, wrongChannel };
//#endregion