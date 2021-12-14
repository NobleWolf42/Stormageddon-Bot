//#region Dependancies
const { MessageEmbed } = require('discord.js');
const { updateConfigFile } = require('../helpers/currentsettings.js');
const { generateEmbedFields } = require('../internal/autorole.js');
const { warnDisabled } = require('../helpers/embedMessages.js');
//#endregion

module.exports = {
    name: "createautorolemessage",
    type: ['Guild'],
    aliases: [],
    cooldown: 60,
    class: 'admin',
    usage: 'createautorolemessage',
    description: "Create the reactions message for auto role assignment.",
    execute(message, args, client) {
        var serverID = message.guild.id;

        config = updateConfigFile();
        //Checks to make sure your roles and reactions match up
        if (config[serverID].autorole.roles.length !== config[serverID].autorole.reactions.length) {
            throw new Error("Roles list and reactions list are not the same length! Please double check this in the config[serverID].js file");
        }  

        // We don't want the bot to do anything further if it can't send messages in the channel
        if (message.guild && !message.channel.permissionsFor(message.guild.me).missing('SEND_MESSAGES')) return;

        const missing = message.channel.permissionsFor(message.guild.me).missing('MANAGE_MESSAGES');

        // Here we check if the bot can actually add recations in the channel the command is being ran in
        if (missing.includes('ADD_REACTIONS'))
            throw new Error("I need permission to add reactions to these messages! Please assign the 'Add Reactions' permission to me in this channel!");

        if (!config[serverID].autorole.embedMessage || (config[serverID].autorole.embedMessage === ''))
            throw "The 'embedMessage' property is not set in the config[serverID].js file. Please do this!";
        if (!config[serverID].autorole.embedFooter || (config[serverID].autorole.embedMessage === ''))
            throw "The 'embedFooter' property is not set in the config[serverID].js file. Please do this!";
        
        // Checks to see if the module is enabled
        if (!config[serverID].autorole.enable) {
            warnDisabled(message, 'autorole', module.name);
            return
        }

        const roleEmbed = new MessageEmbed()
            .setTitle('Role Message')
            .setDescription(config[serverID].autorole.embedMessage)
            .setFooter(config[serverID].autorole.embedFooter);

        roleEmbed.setColor('#dd9323');

        const roleEmbed2 = new MessageEmbed()
            .setTitle('Role Message')
            .setDescription("Continued form Previous Message")
            .setFooter(config[serverID].autorole.embedFooter);

        roleEmbed2.setColor('#dd9323');

        if (config[serverID].autorole.embedThumbnail && (config[serverID].autorole.embedThumbnailLink !== '')) 
            roleEmbed.setThumbnail(config[serverID].autorole.embedThumbnailLink);
        else if (config[serverID].autorole.embedThumbnail && message.guild.icon)
            roleEmbed.setThumbnail(message.guild.iconURL);

        const fields = generateEmbedFields(serverID);
        if (fields.length > 40) throw "That maximum roles that can be set for an embed is 40!";
        if (fields.length > 20) {
            secondmsg = false
        }
        else {
            secondmsg = true;
        }

        for (const { emoji, role } of fields) {
            if (!message.guild.roles.cache.find(r => r.name === role))
                throw `The role '${role}' does not exist!`;

            const customEmote = client.emojis.cache.find(e => e.name === emoji);
            
            if (roleEmbed.fields.length > 20) {
                if (!customEmote) roleEmbed.addField(emoji, role, true);
                else roleEmbed.addField(customEmote, role, true);
            }
            else {
                if (!customEmote) roleEmbed2.addField(emoji, role, true);
                else roleEmbed2.addField(customEmote, role, true);
            }
        }

        message.channel.send(roleEmbed).then(async m => {
            for (const r of config[serverID].autorole.reactions) {
                const emoji = r;
                const customCheck = client.emojis.cache.find(e => e.name === emoji);
                
                if (!customCheck) await m.react(emoji);
                else await m.react(customCheck.id);
            }
        });
        if (secondmsg) {
            message.channel.send(roleEmbed2).then(async m => {
                for (const r of config[serverID].autorole.reactions) {
                    const emoji = r;
                    const customCheck = client.emojis.cache.find(e => e.name === emoji);
                    
                    if (!customCheck) await m.react(emoji);
                    else await m.react(customCheck.id);
                }
            });
        }

        message.delete({ timeout: 15000, reason: 'Cleanup.' });
    }
}
//#endregion