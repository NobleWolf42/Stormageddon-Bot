//#region Dependencies
import { APIEmbedField, AutocompleteInteraction, Client, ColorResolvable, EmbedBuilder, Interaction } from 'discord.js';
//#endregion

//#region Helpers
import { addToLog } from './errorLog.js';
//#endregion

//#region Types
type InteractionWithChanges = Exclude<Interaction, AutocompleteInteraction>;
//#endregion

//#region Function that takes several inputs and creates an embedded interaction and sends it in the channel that is attached to the Interaction Object
/**
 * This function takes several inputs and creates an embed interaction and then sends it in a server.
 * @param interaction - A Discord.js Interaction Object
 * @param title - String for the Title/Header of the interaction
 * @param color - String Hex Code for the color of the border
 * @param text - String for the body of the embedded interaction
 * @param footer - Object for the footer of the embedded interaction - Default: { text: `Requested by ${interaction.user.username}`, iconURL: null }
 * @param img - URL to an Image to include - Default: null
 * @param fields - addField arguments - Default: []
 * @param url - URL to add as the embedURL - Default: null
 * @param thumbnail - URL to thumbnail - Default: null
 * @returns interaction.reply({ embeds: [embMsg] }) (Interaction Object)
 */
async function embedCustom(
    interaction: InteractionWithChanges,
    title: string,
    color: ColorResolvable,
    text: string,
    footer: { text: string; iconURL: string },
    img: string = null,
    fields: APIEmbedField[] = [],
    url: string = null,
    thumbnail: string = null
) {
    const embMsg = new EmbedBuilder().setTitle(title).setColor(color).setDescription(text).setFooter(footer).setImage(img).addFields(fields).setURL(url).setThumbnail(thumbnail).setTimestamp();

    return await interaction.reply({ embeds: [embMsg] });
}
//#endregion

//#region Function that takes several inputs and creates an embedded interaction and dms the user that is attached to the Interaction Object
/**
 * This function takes several inputs and creates an embed interaction and then sends it in a DM.
 * @param interaction - A Discord.js Interaction Object
 * @param title - String for the Title/Header of the interaction
 * @param color - String Hex Code for the color of the border
 * @param text - String for the body of the embedded interaction
 * @param img - URL to an Image to include (optional)
 * @param client - A Discord.js Client Object
 */
async function embedCustomDM(interaction: InteractionWithChanges, title: string, color: ColorResolvable, text: string, img: string, client: Client) {
    const embMsg = new EmbedBuilder()
        .setTitle(title)
        .setColor(color)
        .setDescription(text)
        .setFooter({
            text: `Requested by ${interaction.user.username}`,
            iconURL: null,
        })
        .setImage(img);

    var user = await client.users.fetch(interaction.member.user.id);
    user.send({ embeds: [embMsg] });
    interaction.reply({
        content: 'Sent',
        ephemeral: true,
    });
}
//#endregion

//#region Function that takes several inputs and creates an embedded interaction for the help command
/**
 * This function takes several inputs and creates an embed interaction for the help command.
 * @param interaction - A Discord.js Interaction Object
 * @param title - String for the Title/Header of the interaction
 * @param text - String for the body of the embedded interaction
 */
async function embedHelp(interaction: InteractionWithChanges, title: string, text: string) {
    const embMsg = new EmbedBuilder()
        .setTitle(title)
        .setColor('#1459C7')
        .setDescription(text)
        .setFooter({
            text: `Requested by ${interaction.user.username}`,
            iconURL: null,
        });

    interaction.reply({ embeds: [embMsg], ephemeral: true });
}
//#endregion

//#region Function that takes several inputs and creates an embedded interaction for a custom warning
/**
 * This function takes several inputs and creates an embed interaction for a custom warning.
 * @param interaction - A Discord.js Interaction Object
 * @param text - String for the body of the embedded interaction
 * @param commandName - String of the name of the command
 * @param client - A Discord.js Client Object
 */
async function warnCustom(interaction: InteractionWithChanges, text: string, commandName: string, client: Client) {
    const embMsg = new EmbedBuilder()
        .setTitle('Warning!')
        .setColor('#F8AA2A')
        .setDescription(text)
        .setFooter({
            text: `Requested by ${interaction.user.username}`,
            iconURL: null,
        });

    var channel = await client.channels.fetch(interaction.channelId);
    interaction.reply({ embeds: [embMsg], ephemeral: true });

    if (!channel.isDMBased()) {
        addToLog('warning', commandName, interaction.user.username, interaction.guild.name, channel.name, text);
    } else {
        addToLog('warning', commandName, interaction.user.username, 'Direct Interaction', 'Direct Interaction', text);
    }
}
//#endregion

//#region Function that takes several inputs and creates an embedded interaction for a lack of bot admin privileges
/**
 * This function takes several inputs and creates an embed interaction for an Error stating a lack of bot admin privileges.
 * @param interaction - A Discord.js Interaction Object
 * @param commandName - String of the name of the command
 * @param client - A Discord.js Client Object
 */
async function errorNoAdmin(interaction: InteractionWithChanges, commandName: string, client: Client) {
    const embMsg = new EmbedBuilder()
        .setTitle('Error!')
        .setColor('#FF0000')
        .setDescription('You do not have permission to use this command. This command requires *BOT ADMIN* access to use!')
        .setFooter({
            text: `Requested by ${interaction.user.username}`,
            iconURL: null,
        });

    var channel = await client.channels.fetch(interaction.channelId);
    interaction.reply({ embeds: [embMsg], ephemeral: true });

    if (!channel.isDMBased()) {
        addToLog('warning', commandName, interaction.user.username, interaction.guild.name, channel.name, 'Not Bot Admin!');
    } else {
        addToLog('warning', commandName, interaction.user.username, 'Direct Interaction', 'Direct Interaction', 'Not Bot Admin!');
    }
}
//#endregion

//#region Function that takes several inputs and creates an embedded interaction for a lack of mod privileges
/**
 * This function takes several inputs and creates an embed interaction for an Error stating a lack of mod privileges.
 * @param interaction - A Discord.js Interaction Object
 * @param commandName - String of the name of the command
 * @param client - A Discord.js Client Object
 */
async function errorNoMod(interaction: InteractionWithChanges, commandName: string, client: Client) {
    const embMsg = new EmbedBuilder()
        .setTitle('Error!')
        .setColor('#FF0000')
        .setDescription('You do not have permission to use this command. This command requires *BOT MOD* access to use!')
        .setFooter({
            text: `Requested by ${interaction.user.username}`,
            iconURL: null,
        });

    var channel = await client.channels.fetch(interaction.channelId);
    interaction.reply({ embeds: [embMsg], ephemeral: true });

    if (!channel.isDMBased()) {
        addToLog('warning', commandName, interaction.user.username, interaction.guild.name, channel.name, 'Not Bot Moderator!');
    } else {
        addToLog('warning', commandName, interaction.user.username, 'Direct Interaction', 'Direct Interaction', 'Not Bot Moderator!');
    }
}
//#endregion

//#region Function that takes several inputs and creates an embedded interaction for a lack of DJ privileges
/**
 * This function takes several inputs and creates an embed interaction for an Error stating a lack of DJ privileges.
 * @param interaction - A Discord.js Interaction Object
 * @param commandName - String of the name of the command
 * @param client - A Discord.js Client Object
 */
async function errorNoDJ(interaction: InteractionWithChanges, commandName: string, client: Client) {
    const embMsg = new EmbedBuilder()
        .setTitle('Error!')
        .setColor('#FF0000')
        .setDescription('You do not have permission to use this command. This command requires *DJ* access to use!')
        .setFooter({
            text: `Requested by ${interaction.user.username}`,
            iconURL: null,
        });

    var channel = await client.channels.fetch(interaction.channelId);
    interaction.reply({ embeds: [embMsg], ephemeral: true });

    if (!channel.isDMBased()) {
        addToLog('warning', commandName, interaction.user.username, interaction.guild.name, channel.name, 'Not a DJ!');
    } else {
        addToLog('warning', commandName, interaction.user.username, 'Direct Interaction', 'Direct Interaction', 'Not DJ!');
    }
}
//#endregion

//#region Function that takes several inputs and creates an embedded interaction for a lack of server admin privileges
/**
 * This function takes several inputs and creates an embed interaction for an Error stating a lack of server admin privileges.
 * @param interaction - A Discord.js Interaction Object
 * @param commandName - String of the name of the command
 * @param client - A Discord.js Client Object
 */
async function errorNoServerAdmin(interaction: InteractionWithChanges, commandName: string, client: Client) {
    const embMsg = new EmbedBuilder()
        .setTitle('Error!')
        .setColor('#FF0000')
        .setDescription('You do not have permission to use this command. This command requires *SERVER ADMIN* access to use!')
        .setFooter({
            text: `Requested by ${interaction.user.username}`,
            iconURL: null,
        });

    var channel = await client.channels.fetch(interaction.channelId);
    interaction.reply({ embeds: [embMsg], ephemeral: true });

    if (!channel.isDMBased()) {
        addToLog('warning', commandName, interaction.user.username, interaction.guild.name, channel.name, 'Not Server Admin!');
    } else {
        addToLog('warning', commandName, interaction.user.username, 'Direct Interaction', 'Direct Interaction', 'Not Server Admin!');
    }
}
//#endregion

//#region Function that takes several inputs and creates an embedded interaction for a custom error
/**
 * This function takes several inputs and creates an embed interaction for a custom error.
 * @param interaction - A Discord.js Interaction Object
 * @param text - String for the body of the embedded interaction
 * @param commandName - String of the name of the command
 * @param client - A Discord.js Client Object
 */
async function errorCustom(interaction: InteractionWithChanges, text: string, commandName: string, client: Client) {
    const embMsg = new EmbedBuilder()
        .setTitle('Error!')
        .setColor('#FF0000')
        .setDescription(text)
        .setFooter({
            text: `Requested by ${interaction.user.username}`,
            iconURL: null,
        });

    var channel = await client.channels.fetch(interaction.channelId);
    interaction.reply({ embeds: [embMsg], ephemeral: true });

    if (!channel.isDMBased()) {
        addToLog('fatal error', commandName, interaction.user.username, interaction.guild.name, channel.name, text, client);
    } else {
        addToLog('fatal error', commandName, interaction.user.username, 'Direct Interaction', 'Direct Interaction', text);
    }
}
//#endregion

//#region Function that takes several inputs and creates an embedded interaction for a wrong channel error
/**
 * This function takes several inputs and creates an embed interaction for a custom error.
 * @param interaction - A Discord.js Interaction Object
 * @param correctChannel - String for the correct channel to send the command in
 * @param commandName - String of the name of the command
 * @param client - A Discord.js Client Object
 */
async function warnWrongChannel(interaction: InteractionWithChanges, correctChannel: string, commandName: string, client: Client) {
    const embMsg = new EmbedBuilder()
        .setTitle('Warning!')
        .setColor('#F8AA2A')
        .setDescription(`That was not the correct channel for that command. The correct channel for this command is #${correctChannel}`)
        .setFooter({
            text: `Requested by ${interaction.user.username}`,
            iconURL: null,
        });

    var channel = await client.channels.fetch(interaction.channelId);
    interaction.reply({ embeds: [embMsg], ephemeral: true });

    if (!channel.isDMBased()) {
        addToLog('warning', commandName, interaction.user.username, interaction.guild.name, channel.name, 'Wrong Text Channel');
    } else {
        addToLog('warning', commandName, interaction.user.username, 'Direct Interaction', 'Direct Interaction', 'Wrong Text Channel');
    }
}
//#endregion

//#region Function that takes several inputs and creates an embedded interaction for a disabled command error
/**
 * This function takes several inputs and creates an embed interaction for a custom error.
 * @param interaction - A Discord.js Interaction Object
 * @param feature - String for the name of the feature
 * @param commandName - String of the name of the command
 * @param client - A Discord.js Client Object
 */
async function warnDisabled(interaction: InteractionWithChanges, feature: string, commandName: string, client: Client) {
    const embMsg = new EmbedBuilder()
        .setTitle('Warning!')
        .setColor('#F8AA2A')
        .setDescription(`This feature is currently disabled. To enable it, please run the !set ${feature}. NOTE: This command is only available to a server admin.`)
        .setFooter({
            text: `Requested by ${interaction.user.username}`,
            iconURL: null,
        });

    var channel = await client.channels.fetch(interaction.channelId);
    interaction.reply({ embeds: [embMsg], ephemeral: true });

    if (!channel.isDMBased()) {
        addToLog('warning', commandName, interaction.user.username, interaction.guild.name, channel.name, 'Feature Disabled');
    } else {
        addToLog('warning', commandName, interaction.user.username, 'Direct Interaction', 'Direct Interaction', 'Feature Disabled');
    }
}
//#endregion

//#region exports
export { errorNoAdmin, errorNoMod, errorNoDJ, errorNoServerAdmin, errorCustom, warnWrongChannel, warnDisabled, embedCustom, warnCustom, embedHelp, embedCustomDM };
//#endregion