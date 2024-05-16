//Under construction need to add log to manually log i think ill figure it out later


//#region This exports the log command with the information about it
module.exports = {
    name: "log",
    type: ['Guild'],
    aliases: [""],
    coolDown: 0,
    class: 'admin',
    usage: 'addmod ***MENTION-USERS***',
    description: "Adds users to the list of people that get the PM when someone whispers the bot with the !modmail command. MUST HAVE SERVER ADMINISTRATOR STATUS.",
    execute(message, args) {
        //console.log(message.guild.channels);
        var channelID = args[0].substring(3, args[0].length-1);
        console.log(channelID)
        console.log(message.guild.roles.cache.get(channelID).name);
    }
}
//#endregion
