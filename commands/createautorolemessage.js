//#region Dependencies
const { PermissionsBitField, EmbedBuilder } = require("discord.js");
//#endregion

//#region Helpers
const { updateConfigFile } = require('../helpers/currentSettings.js');
const { warnDisabled, embedCustom } = require('../helpers/embedMessages.js');
//#endregion

//#region Internals
const { generateEmbedFields } = require('../internal/autoRole.js');
//#endregion

//#region This exports the createrolemessage command with the information about it
module.exports = {
    name: "createrolemessage",
    type: ['Guild'],
    aliases: ['creatermsg'],
    coolDown: 60,
    class: 'admin',
    usage: 'createrolemessage',
    description: "Create the reactions message for auto role assignment.",
    execute(message, args, client, distube) {
        //This is the max number of reactions on a message allowed by discord, if discord ever changes that number change this and the code should work again!!!
        var maxReactions = 20;
        
        var serverID = message.guild.id;

        config = updateConfigFile();
        //Checks to make sure your roles and reactions match up
        if (config[serverID].autoRole.roles.length !== config[serverID].autoRole.reactions.length) {
            throw new Error("Roles list and reactions list are not the same length! Please double check this in the config[serverID].js file");
        }

        // We don't want the bot to do anything further if it can't send messages in the channel
        if (message.guild && !message.guild.members.me.permissionsIn(message.channel.id).missing(PermissionsBitField.Flags.SendMessages)) return;

        const missing = message.guild.members.me.permissionsIn(message.channel.id).missing(PermissionsBitField.Flags.ManageMessages);

        // Here we check if the bot can actually add reactions in the channel the command is being ran in
        if (missing.includes('ADD_REACTIONS'))
            throw new Error("I need permission to add reactions to these messages! Please assign the 'Add Reactions' permission to me in this channel!");

        if (!config[serverID].autoRole.embedMessage || (config[serverID].autoRole.embedMessage === ''))
            throw "The 'embedMessage' property is not set in the config[serverID].js file. Please do this!";
        if (!config[serverID].autoRole.embedFooter || (config[serverID].autoRole.embedMessage === ''))
            throw "The 'embedFooter' property is not set in the config[serverID].js file. Please do this!";
        
        // Checks to see if the module is enabled
        if (!config[serverID].autoRole.enable) {
            return warnDisabled(message, 'autoRole', module.name);
        }

        var thumbnail = null;
        var fieldsOut = [];

        if (config[serverID].autoRole.embedThumbnail && (config[serverID].autoRole.embedThumbnailLink !== '')) {
            thumbnail = config[serverID].autoRole.embedThumbnailLink;
        } else if (config[serverID].autoRole.embedThumbnail && message.guild.icon) {
            thumbnail = message.guild.iconURL;
        }

        const fields = generateEmbedFields(serverID);

        for (const { emoji, role } of fields) {
            if (!message.guild.roles.cache.find(r => r.name === role))
                throw `The role '${role}' does not exist!`;

            const customEmote = client.emojis.cache.find(e => e.name === emoji);

            if (!customEmote) { 
                fieldsOut.push({ name: emoji, value: role, inline: true });
            } else {
                fieldsOut.push({ name: customEmote, value: role, inline: true });
            }
        }

        var count = 0;
        for (var i = 0; i < Math.ceil(fieldsOut.length/maxReactions); i++) {

            var embMsg = new EmbedBuilder();
            embMsg.setColor('#dd9323');
            embMsg.setDescription(config[serverID].autoRole.embedMessage);
            embMsg.setThumbnail(thumbnail);
            embMsg.setFooter({ text: config[serverID].autoRole.embedFooter, iconURL: null });
            
            embMsg.setTitle(`Role Message - ${i+1} out of ${Math.ceil(fieldsOut.length/maxReactions)}`);
            embMsg.setFields(fieldsOut.slice(i*maxReactions, (i+1)*maxReactions));
            embMsg.setTimestamp();
            
            message.channel.send({ embeds: [embMsg] }).then(async m => {
                var maxEmoji = 0;
                if (( (count + 1) * maxReactions ) < config[serverID].autoRole.reactions.length) {
                    maxEmoji =  (count + 1) * maxReactions;
                } else {
                    maxEmoji = config[serverID].autoRole.reactions.length;
                }

                for (var r = count * maxReactions; r < maxEmoji; r++) {
                    if (r == count * maxReactions) {
                        count++;
                    }

                    const emoji = config[serverID].autoRole.reactions[r];
                    const customCheck = client.emojis.cache.find(e => e.name === emoji);
                    
                    if (!customCheck) {
                        await m.react(emoji);
                    } else {
                        await m.react(customCheck.id);
                    }
                }
            });
        }

        message.delete();
        message.deleted = true;
    }
}
//#endregion
