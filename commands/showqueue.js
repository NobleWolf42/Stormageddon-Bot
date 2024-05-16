//#region Dependencies
const { MessageEmbed, splitMessage, escapeMarkdown } = require("discord.js");
//#endregion

//#region Helpers
const { warnCustom } = require("../helpers/embedMessages.js");
//#endregion

//#region This exports the showqueue command with the information about it
module.exports = {
    name: "showqueue",
    type: ['Guild'],
    aliases: ["q"],
    cooldown: 60,
    class: 'music',
    usage: 'showqueue',
    description: "Shows the music queue and now playing.",
    execute(message) {
        const queue = message.client.queue.get(message.guild.id);
        if (!queue) return warnCustom(message, "There is nothing playing.", module.name);

        const description = queue.songs.map((song, index) => `${index + 1}. ${escapeMarkdown(song.title)}`);

        let queueEmbed = new MessageEmbed()
            .setTitle("Stormageddon Music Queue")
            .setDescription(description)
            .setColor("#0E4CB0");

        const splitDescription = splitMessage(description, {
            maxLength: 2048,
            char: "\n",
            prepend: "",
            append: ""
        });

        splitDescription.forEach(async (m) => {
            queueEmbed.setDescription(m);
            message.channel.send(queueEmbed);
        });
    }
}
//#endregion
