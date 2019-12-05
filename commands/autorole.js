//#region Dependancices
var Discord = require('discord.js');

var config = require('../config.json');
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

//#region exports
module.exports = { sendRoleMessage };
//#endregion