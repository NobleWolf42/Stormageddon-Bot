//#region Dependencies
const { escapeMarkdown } = require("discord.js");
//#endregion

//#region Helpers
const { embedCustom, warnCustom } = require("../helpers/embedMessages.js");
//#endregion

//#region This exports the showqueue command with the information about it
module.exports = {
    name: "showqueue",
    type: ['Guild'],
    aliases: ["q"],
    coolDown: 60,
    class: 'music',
    usage: 'showqueue',
    description: "Shows the music queue and now playing.",
    execute(message) {
        const queue = message.client.queue.get(message.guild.id);
        if (!queue) return warnCustom(message, "There is nothing playing.", module.name);

        const description = queue.songs.map((song, index) => `${index + 1}. ${escapeMarkdown(song.title)}`);

        const splitDescription = [];

        if (description.length > 2048) {
            var runTimes = Math.ceil(description.length / 2048);
            for (var i = 0; i < runTimes; i++) {
                splitDescription.push(description.substring(0, 2047));
                description = description.substring(2047);
            }
        }

        splitDescription.forEach(async (m) => {
            embedCustom(message, "Stormageddon Music Queue", "#0E4CB0", m);
        });
    }
}
//#endregion
