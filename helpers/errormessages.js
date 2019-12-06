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

//#region exports
module.exports = { noAdmin, noMod, noDJ };
//#endregion