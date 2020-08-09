//#region Dependancices
const { readFileSync } = require('fs');
var config = JSON.parse(readFileSync('./data/serverconfig.json', 'utf8'));
const { updateConfigFile } = require('../helpers/currentsettings.js');
//#endregion

//#region Autoroll
    //#region Function that generates embed feilds
    function generateEmbedFields(serverID) {
        return config[serverID].autorole.roles.map((r, e) => {
            return {
                emoji: config[serverID].autorole.reactions[e],
                role: r
            };
        });
    }
    //#endregion

    //#region Handles the creation of the role reactions. Will either send the role messages separately or in an embed, depending on your settings in config[serverID].json
//#endregion

//#region Autorole Listener
function autoroleListener(client) {
    config = updateConfigFile();
    //#region Redable constants
    // This makes the events used a bit more readable
    const events = {
	    MESSAGE_REACTION_ADD: 'messageReactionAdd',
	    MESSAGE_REACTION_REMOVE: 'messageReactionRemove',
    };
    //#endregion

    //#region This event handles adding/removing users from the role(s) they chose based on message reactions
    client.on('raw', async event => {
        if (!events.hasOwnProperty(event.t)) return;

        const { d: data } = event;
        const user = client.users.cache.get(data.user_id);
        const channel = client.channels.cache.get(data.channel_id);

        const message = await channel.messages.fetch(data.message_id);
        const member = message.guild.members.cache.get(user.id);
        var serverID = message.channel.guild.id;

        const emojiKey = (data.emoji.id) ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.name;
        let reaction = message.reactions.cache.get(emojiKey);

        if (!reaction) {
            // Create an object that can be passed through the event like normal
            const emoji = new Emoji(client.guilds.get(data.guild_id), data.emoji);
            reaction = new MessageReaction(message, emoji, 1, data.user_id === client.user.id);
        }

        let embedFooterText;
        if (message.embeds[0] && message.embeds[0].footer != null) embedFooterText = message.embeds[0].footer.text;

        if (
            (message.author.id === client.user.id) && (message.content !== config[serverID].autorole.initialMessage || 
            (message.embeds[0] && (embedFooterText !== config[serverID].autorole.embedFooter)))
        ) {

            if ((message.embeds.length >= 1)) {
                const fields = message.embeds[0].fields;

                for (const { name, value } of fields) {
                    if (member.id !== client.user.id) {
                        const guildRole = message.guild.roles.cache.find(r => r.name === value);
                        if ((name === reaction.emoji.name) || (name === reaction.emoji.toString())) {
                            if (event.t === "MESSAGE_REACTION_ADD") member.roles.add(guildRole.id);
                            else if (event.t === "MESSAGE_REACTION_REMOVE") member.roles.remove(guildRole.id);
                        }
                    }
                }
            }
        }
    });
    //#endregion

    //#region This handels unhandeled rejections
    process.on('unhandledRejection', err => {
        const msg = err.stack.replace(new RegExp(`${__dirname}/`, 'g'), './');
	    console.error("Unhandled Rejection", msg);
    });
    //#endregion
}
//#endregion

//#region exports
module.exports = { autoroleListener, generateEmbedFields };
//#endregion