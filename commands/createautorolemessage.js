//#region Dependencies
const { MessageEmbed } = require('discord.js');
//#endregion

//#region Helpers
const { updateConfigFile } = require('../helpers/currentSettings.js');
const { warnDisabled } = require('../helpers/embedMessages.js');
//#endregion

//#region Internals
const { generateEmbedFields } = require('../internal/autoRole.js');
//#endregion

//#region This exports the createautoRolemessage command with the information about it
module.exports = {
    name: "createautoRolemessage",
    type: ['Guild'],
    aliases: [],
    cooldown: 60,
    class: 'admin',
    usage: 'createautoRolemessage',
    description: "Create the reactions message for auto role assignment.",
    execute(message, args, client) {
        var serverID = message.guild.id;

        config = updateConfigFile();
        //Checks to make sure your roles and reactions match up
        if (config[serverID].autoRole.roles.length !== config[serverID].autoRole.reactions.length) {
            throw new Error("Roles list and reactions list are not the same length! Please double check this in the config[serverID].js file");
        }  

        // We don't want the bot to do anything further if it can't send messages in the channel
        if (message.guild && !message.channel.permissionsFor(message.guild.me).missing('SEND_MESSAGES')) return;

        const missing = message.channel.permissionsFor(message.guild.me).missing('MANAGE_MESSAGES');

        // Here we check if the bot can actually add recations in the channel the command is being ran in
        if (missing.includes('ADD_REACTIONS'))
            throw new Error("I need permission to add reactions to these messages! Please assign the 'Add Reactions' permission to me in this channel!");

        if (!config[serverID].autoRole.embedMessage || (config[serverID].autoRole.embedMessage === ''))
            throw "The 'embedMessage' property is not set in the config[serverID].js file. Please do this!";
        if (!config[serverID].autoRole.embedFooter || (config[serverID].autoRole.embedMessage === ''))
            throw "The 'embedFooter' property is not set in the config[serverID].js file. Please do this!";
        
        // Checks to see if the module is enabled
        if (!config[serverID].autoRole.enable) {
            warnDisabled(message, 'autoRole', module.name);
            return
        }

        const roleEmbed = new MessageEmbed()
            .setTitle('Role Message')
            .setDescription(config[serverID].autoRole.embedMessage)
            .setFooter(config[serverID].autoRole.embedFooter);

        roleEmbed.setColor('#dd9323');

        const roleEmbed2 = new MessageEmbed()
            .setTitle('Role Message')
            .setDescription("Continued form Previous Message")
            .setFooter(config[serverID].autoRole.embedFooter);

        roleEmbed2.setColor('#dd9323');

        if (config[serverID].autoRole.embedThumbnail && (config[serverID].autoRole.embedThumbnailLink !== '')) 
            roleEmbed.setThumbnail(config[serverID].autoRole.embedThumbnailLink);
        else if (config[serverID].autoRole.embedThumbnail && message.guild.icon)
            roleEmbed.setThumbnail(message.guild.iconURL);

        const fields = generateEmbedFields(serverID);
        if (fields.length > 20) throw "That maximum roles that can be set for an embed is 20!";

        for (const { emoji, role } of fields) {
            if (!message.guild.roles.cache.find(r => r.name === role))
                throw `The role '${role}' does not exist!`;

            const customEmote = client.emojis.cache.find(e => e.name === emoji);
            
            if (!customEmote) roleEmbed.addField(emoji, role, true);
            else roleEmbed.addField(customEmote, role, true);
        }

        

        message.channel.send(roleEmbed).then(async m => {
            for (const r of config[serverID].autoRole.reactions) {
                const emoji = r;
                const customCheck = client.emojis.cache.find(e => e.name === emoji);
                    
                if (!customCheck) await m.react(emoji);
                else await m.react(customCheck.id);
            }
        });

        message.delete({ timeout: 15000, reason: 'Cleanup.' });
    }
}
//#endregion
