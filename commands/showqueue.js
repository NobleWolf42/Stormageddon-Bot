//#region Helpers
const { warnCustom, embedCustom } = require("../helpers/embedMessages.js");
const { djCheck } = require("../helpers/userPermissions.js");
//#endregion

//#region This exports the showqueue command with the information about it
module.exports = {
    name: "showqueue",
    type: ['Guild'],
    aliases: ["q"],
    coolDown: 60,
    class: 'music',
    usage: 'showqueue',
    description: "Shows the music queue.",
    execute(message, args, client, distube) {
        //Max fields for an embed per discord, change this if it ever changes
        var maxFields = 20;

        //Checks to see if the music feature is enabled in this server
        if (!serverConfig[message.guild.id].music.enable) {
            return warnDisabled(message, 'music', module.name);
        }

        //Checks to see if the user has DJ access
        if (!djCheck(message)) {
            return errorNoDJ(message, module.name);
        }

        //Checks to see if the message was sent in the correct channel
        if (serverConfig[message.guild.id].music.textChannel != message.channel.name) {
            return warnWrongChannel(message, serverConfig[message.guild.id].music.textChannel, module.name);
        }

        var queue = distube.getQueue(message);
        
        if (!queue) {
            return warnCustom(message, "Nothing is playing right now.", module.name);
        } else {
            var description = queue.songs.map((song, index) => `${index + 1} - [\`${song.name}\`](${song.url})\n`);

            var maxTimes = Math.ceil(description.length/maxFields);
            slicedDesc = [];
            for (var i = 0; i < maxTimes; i++) {
                slicedDesc.push(description.slice(0,20).join(""));
                description = description.slice(20);
            }
            slicedDesc.forEach(async (m, index) => {
                embedCustom(message, `Stormageddon Music Queue - ${index + 1} of ${slicedDesc.length}`, "#0E4CB0", m, { text: `Requested by ${message.author.tag}`, iconURL: null }, null, [], null, null);
            });
        }
    }
}
//#endregion
