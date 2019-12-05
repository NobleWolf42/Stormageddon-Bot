//#region Dependancices
var Discord = require('discord.js');

var config = require('../data/config.json');
//#endregion

//#region Autoroll
    //#region Function that generates embed feilds
    function generateEmbedFields(serverid) {
        return config[serverid].autorole.roles.map((r, e) => {
            return {
                emoji: config[serverid].autorole.reactions[e],
                role: r
            };
        });
    }
    //#endregion

    //#region Handles the creation of the role reactions. Will either send the role messages separately or in an embed, depending on your settings in config[serverid].json
    function sendRoleMessage(message, serverid, client) {

        //Checks to make sure your roles and reactions match up
        if (config[serverid].autorole.roles.length !== config[serverid].autorole.reactions.length) {
            throw new Error("Roles list and reactions list are not the same length! Please double check this in the config[serverid].js file");
        }  
    
        // We don't want the bot to do anything further if it can't send messages in the channel
        if (message.guild && !message.channel.permissionsFor(message.guild.me).missing('SEND_MESSAGES')) return;

        const missing = message.channel.permissionsFor(message.guild.me).missing('MANAGE_MESSAGES');

        // Here we check if the bot can actually add recations in the channel the command is being ran in
        if (missing.includes('ADD_REACTIONS'))
            throw new Error("I need permission to add reactions to these messages! Please assign the 'Add Reactions' permission to me in this channel!");

        if (!config[serverid].autorole.embedMessage || (config[serverid].autorole.embedMessage === ''))
            throw "The 'embedMessage' property is not set in the config[serverid].js file. Please do this!";
        if (!config[serverid].autorole.embedFooter || (config[serverid].autorole.embedMessage === ''))
            throw "The 'embedFooter' property is not set in the config[serverid].js file. Please do this!";

        const roleEmbed = new Discord.RichEmbed()
            .setDescription(config[serverid].autorole.embedMessage)
            .setFooter(config[serverid].autorole.embedFooter);

        if (config[serverid].autorole.embedColor) roleEmbed.setColor(config[serverid].autorole.embedColor);

        if (config[serverid].autorole.embedThumbnail && (config[serverid].autorole.embedThumbnailLink !== '')) 
            roleEmbed.setThumbnail(config[serverid].autorole.embedThumbnailLink);
        else if (config[serverid].autorole.embedThumbnail && message.guild.icon)
            roleEmbed.setThumbnail(message.guild.iconURL);

        const fields = generateEmbedFields(serverid);
        if (fields.length > 25) throw "That maximum roles that can be set for an embed is 25!";

        for (const { emoji, role } of fields) {
            if (!message.guild.roles.find(r => r.name === role))
                throw `The role '${role}' does not exist!`;

            const customEmote = client.emojis.find(e => e.name === emoji);
            
            if (!customEmote) roleEmbed.addField(emoji, role, true);
            else roleEmbed.addField(customEmote, role, true);
        }

        message.channel.send(roleEmbed).then(async m => {
            for (const r of config[serverid].autorole.reactions) {
                const emoji = r;
                const customCheck = client.emojis.find(e => e.name === emoji);
                
                if (!customCheck) await m.react(emoji);
                else await m.react(customCheck.id);
            }
        });
    }
    //#endregion
//#endregion

//#region Autorole Listener
function autoroleListener(client) {
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
        const user = client.users.get(data.user_id);
        const channel = client.channels.get(data.channel_id);

        const message = await channel.fetchMessage(data.message_id);
        const member = message.guild.members.get(user.id);
        var serverid = message.channel.guild.id;

        const emojiKey = (data.emoji.id) ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.name;
        let reaction = message.reactions.get(emojiKey);

        if (!reaction) {
            // Create an object that can be passed through the event like normal
            const emoji = new Emoji(client.guilds.get(data.guild_id), data.emoji);
            reaction = new MessageReaction(message, emoji, 1, data.user_id === client.user.id);
        }

        let embedFooterText;
        if (message.embeds[0]) embedFooterText = message.embeds[0].footer.text;

        if (
            (message.author.id === client.user.id) && (message.content !== config[serverid].autorole.initialMessage || 
            (message.embeds[0] && (embedFooterText !== config[serverid].autorole.embedFooter)))
        ) {

            if ((message.embeds.length >= 1)) {
                const fields = message.embeds[0].fields;

                for (const { name, value } of fields) {
                    if (member.id !== client.user.id) {
                        const guildRole = message.guild.roles.find(r => r.name === value);
                        if ((name === reaction.emoji.name) || (name === reaction.emoji.toString())) {
                            if (event.t === "MESSAGE_REACTION_ADD") member.addRole(guildRole.id);
                            else if (event.t === "MESSAGE_REACTION_REMOVE") member.removeRole(guildRole.id);
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
module.exports = { sendRoleMessage, autoroleListener };
//#endregion