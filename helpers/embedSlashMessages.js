//#region Dependencies
const { EmbedBuilder } = require('discord.js');
//#endregion

//#region Helpers
const { addToLog } = require('./errorLog.js');
//#endregion

//#region Function that takes several inputs and creates an embedded interaction and sends it in the channel that is attached to the Interaction Object
/**
 * This function takes several inputs and creates an embed interaction and then sends it in a server.
 * @param {Interaction} interaction - A Discord.js Interaction Object 
 * @param {string} title - String for the Title/Header of the interaction
 * @param {string} color - String Hex Code for the color of the border 
 * @param {string} text - String for the body of the embedded interaction
 * @param {object} footer - Object for the footer of the embedded interaction - Default: { text: `Requested by ${interaction.user.username}`, iconURL: null }
 * @param {URL} img - URL to an Image to include - Default: null 
 * @param {array} fields - addField arguments - Default: []
 * @param {URL} url - URL to add as the embedURL - Default: null 
 * @param {URL} thumbnail - URL to thumbnail - Default: null 
 * @returns {*} interaction.reply({ embeds: [embMsg] }) (Interaction Object)
 */
async function embedCustom(interaction, title, color, text, footer, img, fields, url, thumbnail) {
    const embMsg = new EmbedBuilder()
        .setTitle(title)
        .setColor(color)
        .setDescription(text)
        .setFooter(footer)
        .setImage(img)
        .addFields(fields)
        .setURL(url)
        .setThumbnail(thumbnail)
        .setTimestamp();

    return await (interaction.reply({ embeds: [embMsg] }));
}
//#endregion

//#region Function that takes several inputs and creates an embedded interaction and dms the user that is attached to the Interaction Object
/**
 * This function takes several inputs and creates an embed interaction and then sends it in a DM.
 * @param {Interaction} interaction - A Discord.js Interaction Object 
 * @param {string} title - String for the Title/Header of the interaction
 * @param {string} color - String Hex Code for the color of the border 
 * @param {string} text - String for the body of the embedded interaction
 * @param {URL} img - URL to an Image to include (optional) 
 * @param {Client} client - A Discord.js Client Object 
 */
async function embedCustomDM(interaction, title, color, text, img, client) {
    const embMsg = new EmbedBuilder()
        .setTitle(title)
        .setColor(color)
        .setDescription(text)
        .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: null })
        .setImage(img);
    
    var usr = await client.users.fetch(interaction.member.user.id);
    usr.send({ embeds: [embMsg] });
    interaction.reply({
        content: "Sent",
        ephemeral: true
    });

}
//#endregion

//#region Function that takes several inputs and creates an embedded interaction for the help command
/**
 * This function takes several inputs and creates an embed interaction for the help command.
 * @param {Interaction} interaction - A Discord.js Interaction Object
 * @param {string} title - String for the Title/Header of the interaction
 * @param {string} text - String for the body of the embedded interaction
 * @param {Client} client - A Discord.js Client Object 
 */
async function embedHelp(interaction, title, text, client) {
    const embMsg = new EmbedBuilder()
        .setTitle(title)
        .setColor('#1459C7')
        .setDescription(text)
        .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: null });
    
    interaction.reply({ embeds: [embMsg], ephemeral: true });
}
//#endregion

//#region Function that takes several inputs and creates an embedded interaction for a custom warning
/**
 * This function takes several inputs and creates an embed interaction for a custom warning.
 * @param {Interaction} interaction - A Discord.js Interaction Object
 * @param {string} text - String for the body of the embedded interaction
 * @param {string} commandName - String of the name of the command
 * @param {Client} client - A Discord.js Client Object 
 */
async function warnCustom(interaction, text, commandName, client) {
    const embMsg = new EmbedBuilder()
        .setTitle('Warning!')
        .setColor('#F8AA2A')
        .setDescription(text)
        .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: null });

    if (interaction.guildId != null) {
        var channel = await client.channels.fetch(interaction.channelId);
        interaction.reply({ embeds: [embMsg], ephemeral: true });
        addToLog('Warning', commandName, interaction.user.username, interaction.member.guild.name, channel.name, text);
    }
    else {
        interaction.reply({ embeds: [embMsg], ephemeral: true });
        addToLog('Warning', commandName, interaction.user.username, 'Direct Interaction', 'Direct Interaction', text);
    }
}
//#endregion

//#region Function that takes several inputs and creates an embedded interaction for a lack of bot admin privileges
/**
 * This function takes several inputs and creates an embed interaction for an Error stating a lack of bot admin privileges.
 * @param {Interaction} interaction - A Discord.js Interaction Object
 * @param {string} commandName - String of the name of the command
 * @param {Client} client - A Discord.js Client Object 
 */
async function errorNoAdmin(interaction, commandName, client) {
    const embMsg = new EmbedBuilder()
        .setTitle('Error!')
        .setColor('#FF0000')
        .setDescription('You do not have permission to use this command. This command requires *BOT ADMIN* access to use!')
        .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: null });
    
    if (interaction.guildId != null) {
        var channel = await client.channels.fetch(interaction.channelId);
        interaction.reply({ embeds: [embMsg], ephemeral: true });
        addToLog('Warning', commandName, interaction.user.username, interaction.member.guild.name, channel.name, "Not Bot Admin!");
    }
    else {
        interaction.reply({ embeds: [embMsg], ephemeral: true });
        addToLog('Warning', commandName, interaction.user.username, 'Direct Interaction', 'Direct Interaction', "Not Bot Admin!");
    }
}
//#endregion

//#region Function that takes several inputs and creates an embedded interaction for a lack of mod privileges
/**
 * This function takes several inputs and creates an embed interaction for an Error stating a lack of mod privileges.
 * @param {Interaction} interaction - A Discord.js Interaction Object
 * @param {string} commandName - String of the name of the command
 * @param {Client} client - A Discord.js Client Object 
 */
async function errorNoMod(interaction, commandName, client) {
    const embMsg = new EmbedBuilder()
        .setTitle('Error!')
        .setColor('#FF0000')
        .setDescription('You do not have permission to use this command. This command requires *BOT MOD* access to use!')
        .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: null });
        
    if (interaction.guildId != null) {
        var channel = await client.channels.fetch(interaction.channelId);
        interaction.reply({ embeds: [embMsg], ephemeral: true });
        addToLog('Warning', commandName, interaction.user.username, interaction.member.guild.name, channel.name, "Not Bot Moderator!");
    }
    else {
        interaction.reply({ embeds: [embMsg], ephemeral: true });
        addToLog('Warning', commandName, interaction.user.username, 'Direct Interaction', 'Direct Interaction', "Not Bot Moderator!");
    }
}
//#endregion

//#region Function that takes several inputs and creates an embedded interaction for a lack of DJ privileges
/**
 * This function takes several inputs and creates an embed interaction for an Error stating a lack of DJ privileges.
 * @param {Interaction} interaction - A Discord.js Interaction Object
 * @param {string} commandName - String of the name of the command
 * @param {Client} client - A Discord.js Client Object 
 */
async function errorNoDJ(interaction, commandName, client) {
    const embMsg = new EmbedBuilder()
        .setTitle('Error!')
        .setColor('#FF0000')
        .setDescription('You do not have permission to use this command. This command requires *DJ* access to use!')
        .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: null });

    if (interaction.guildId != null) {
        var channel = await client.channels.fetch(interaction.channelId);
        interaction.reply({ embeds: [embMsg], ephemeral: true });
        addToLog('Warning', commandName, interaction.user.username, interaction.member.guild.name, channel.name, "Not a DJ!");
    }
    else {
        interaction.reply({ embeds: [embMsg], ephemeral: true });
        addToLog('Warning', commandName, interaction.user.username, 'Direct Interaction', 'Direct Interaction', "Not DJ!");
    }
}
//#endregion

//#region Function that takes several inputs and creates an embedded interaction for a lack of server admin privileges
/**
 * This function takes several inputs and creates an embed interaction for an Error stating a lack of server admin privileges.
 * @param {Interaction} interaction - A Discord.js Interaction Object
 * @param {string} commandName - String of the name of the command
 * @param {Client} client - A Discord.js Client Object 
 */
async function errorNoServerAdmin(interaction, commandName, client) {
    const embMsg = new EmbedBuilder()
        .setTitle('Error!')
        .setColor('#FF0000')
        .setDescription('You do not have permission to use this command. This command requires *SERVER ADMIN* access to use!')
        .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: null });

    if (interaction.guildId != null) {
        var channel = await client.channels.fetch(interaction.channelId);
        interaction.reply({ embeds: [embMsg], ephemeral: true });
        addToLog('Warning', commandName, interaction.user.username, interaction.member.guild.name, channel.name, "Not Server Admin!");
    }
    else {
        interaction.reply({ embeds: [embMsg], ephemeral: true });
        addToLog('Warning', commandName, interaction.user.username, 'Direct Interaction', 'Direct Interaction', "Not Server Admin!");
    }
}
//#endregion

//#region Function that takes several inputs and creates an embedded interaction for a custom error
/**
 * This function takes several inputs and creates an embed interaction for a custom error.
 * @param {Interaction} interaction - A Discord.js Interaction Object
 * @param {string} text - String for the body of the embedded interaction
 * @param {string} commandName - String of the name of the command
 * @param {Client} client - A Discord.js Client Object 
 */
async function errorCustom(interaction, text, commandName, client) {
    const embMsg = new EmbedBuilder()
        .setTitle('Error!')
        .setColor('#FF0000')
        .setDescription(text)
        .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: null });
        
    if (interaction.guildId != null) {
        var channel = await client.channels.fetch(interaction.channelId);
        interaction.reply({ embeds: [embMsg], ephemeral: true });
        addToLog('Fatal Error', commandName, interaction.user.username, interaction.member.guild.name, channel.name, text, client);
    } else {
        interaction.reply({ embeds: [embMsg], ephemeral: true });
        addToLog('Fatal Error', commandName, interaction.user.username, 'Direct Interaction', 'Direct Interaction', text);
    }
}
//#endregion

//#region Function that takes several inputs and creates an embedded interaction for a wrong channel error
/**
 * This function takes several inputs and creates an embed interaction for a custom error.
 * @param {Interaction} interaction - A Discord.js Interaction Object
 * @param {string} correctChannel - String for the correct channel to send the command in
 * @param {string} commandName - String of the name of the command
 * @param {Client} client - A Discord.js Client Object 
 */
async function warnWrongChannel(interaction, correctChannel, commandName, client) {
    const embMsg = new EmbedBuilder()
        .setTitle('Warning!')
        .setColor('#F8AA2A')
        .setDescription(`That was not the correct channel for that command. The correct channel for this command is #${correctChannel}`)
        .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: null });
    
    interaction.reply({ embeds: [embMsg], ephemeral: true });
    
    if (interaction.guildId != null) {
        var channel = await client.channels.fetch(interaction.channelId);
        addToLog('Warning', commandName, interaction.user.username, interaction.member.guild.name, channel.name, "Wrong Text Channel");
    }
    else {
        addToLog('Warning', commandName, interaction.user.username, 'Direct Interaction', 'Direct Interaction', "Wrong Text Channel");
    }
}
//#endregion

//#region Function that takes several inputs and creates an embedded interaction for a disabled command error
/**
 * This function takes several inputs and creates an embed interaction for a custom error.
 * @param {Interaction} interaction - A Discord.js Interaction Object
 * @param {string} feature - String for the name of the feature
 * @param {string} commandName - String of the name of the command
 * @param {Client} client - A Discord.js Client Object 
 */
async function warnDisabled(interaction, feature, commandName, client) {
    const embMsg = new EmbedBuilder()
        .setTitle('Warning!')
        .setColor('#F8AA2A')
        .setDescription(`This feature is currently disabled. To enable it, please run the !set ${feature}. NOTE: This command is only available to a server admin.`)
        .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: null });
    
    interaction.reply({ embeds: [embMsg], ephemeral: true });

    if (interaction.guildId != null) {
        var channel = await client.channels.fetch(interaction.channelId);
        addToLog('Warning', commandName, interaction.user.username, interaction.member.guild.name, channel.name, "Feature Disabled");
    }
    else {
        addToLog('Warning', commandName, interaction.user.username, 'Direct Interaction', 'Direct Interaction', "Feature Disabled");
    }
}
//#endregion

//#region exports
module.exports = { errorNoAdmin, errorNoMod, errorNoDJ, errorNoServerAdmin, errorCustom, warnWrongChannel, warnDisabled, embedCustom, warnCustom, embedHelp, embedCustomDM };
//#endregion