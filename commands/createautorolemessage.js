//#region Dependancies
const { MessageEmbed } = require('discord.js');
const { updateConfigFile } = require('../helpers/currentsettings.js');
const { generateEmbedFields } = require('../internal/autorole.js');
//#endregion

module.exports = {
    name: "createautorolemessage",
    type: ['Gulid'],
    aliases: [],
    cooldown: 60,
    class: 'admin',
    usage: 'createautorolemessage',
    description: "Displays the names of all the astronauts that are aboard the ISS.",
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

        const roleEmbed = new MessageEmbed()
            .setTitle('Role Message')
            .setDescription(config[serverID].autorole.embedMessage)
            .setFooter(config[serverID].autorole.embedFooter);

        roleEmbed.setColor('#dd9323');

        if (config[serverID].autorole.embedThumbnail && (config[serverID].autorole.embedThumbnailLink !== '')) 
            roleEmbed.setThumbnail(config[serverID].autorole.embedThumbnailLink);
        else if (config[serverID].autorole.embedThumbnail && message.guild.icon)
            roleEmbed.setThumbnail(message.guild.iconURL);

        const fields = generateEmbedFields(serverID);
        if (fields.length > 25) throw "That maximum roles that can be set for an embed is 25!";

        for (const { emoji, role } of fields) {
            if (!message.guild.roles.cache.find(r => r.name === role))
                throw `The role '${role}' does not exist!`;

            const customEmote = client.emojis.cache.find(e => e.name === emoji);
            
            if (!customEmote) roleEmbed.addField(emoji, role, true);
            else roleEmbed.addField(customEmote, role, true);
        }

        message.channel.send(roleEmbed).then(async m => {
            for (const r of config[serverID].autorole.reactions) {
                const emoji = r;
                const customCheck = client.emojis.cache.find(e => e.name === emoji);
                
                if (!customCheck) await m.react(emoji);
                else await m.react(customCheck.id);
            }
        });
    }
}
//#endregion