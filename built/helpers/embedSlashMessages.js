var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//#region Imports
import { EmbedBuilder } from 'discord.js';
import { addToLog } from './errorLog.js';
import { LogType } from '../models/loggingModel.js';
//#endregion
//#region Function that takes several inputs and creates an embedded interaction and sends it in the channel that is attached to the Interaction Object
/**
 * This function takes several inputs and creates an embed interaction and then sends it in a server.
 * @param interaction - A Discord.js Interaction Object
 * @param title - String for the Title/Header of the interaction
 * @param color - String Hex Code for the color of the border
 * @param text - String for the body of the embedded interaction
 * @param footer - Object for the footer of the embedded interaction - Default: { text: `Requested by ${interaction.user.tag}`, iconURL: null }
 * @param img - URL to an Image to include - Default: null
 * @param fields - addField arguments - Default: []
 * @param url - URL to add as the embedURL - Default: null
 * @param thumbnail - URL to thumbnail - Default: null
 * @returns interaction.reply({ embeds: [embMsg] }) (Interaction Object)
 */
function embedCustom(interaction_1, title_1, color_1, text_1, footer_1) {
    return __awaiter(this, arguments, void 0, function* (interaction, title, color, text, footer, img = null, fields = [], url = null, thumbnail = null) {
        const embMsg = new EmbedBuilder().setTitle(title).setColor(color).setDescription(text).setFooter(footer).setImage(img).addFields(fields).setURL(url).setThumbnail(thumbnail).setTimestamp();
        interaction.reply({ embeds: [embMsg] });
    });
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
function embedCustomDM(interaction, title, color, text, img, client) {
    return __awaiter(this, void 0, void 0, function* () {
        const embMsg = new EmbedBuilder()
            .setTitle(title)
            .setColor(color)
            .setDescription(text)
            .setFooter({
            text: `Requested by ${interaction.user.tag}`,
            iconURL: null,
        })
            .setImage(img);
        const user = yield client.users.fetch(interaction.member.user.id);
        user.send({ embeds: [embMsg] });
        interaction.reply({
            content: 'Sent',
            ephemeral: true,
        });
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
function embedHelp(interaction, title, text) {
    return __awaiter(this, void 0, void 0, function* () {
        const embMsg = new EmbedBuilder()
            .setTitle(title)
            .setColor('#1459C7')
            .setDescription(text)
            .setFooter({
            text: `Requested by ${interaction.user.tag}`,
            iconURL: null,
        });
        interaction.reply({ embeds: [embMsg], ephemeral: true });
    });
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
function warnCustom(interaction, text, commandName) {
    return __awaiter(this, void 0, void 0, function* () {
        const embMsg = new EmbedBuilder()
            .setTitle('Warning!')
            .setColor('#F8AA2A')
            .setDescription(text)
            .setFooter({
            text: `Requested by ${interaction.user.tag}`,
            iconURL: null,
        });
        interaction.reply({ embeds: [embMsg], ephemeral: true });
        if (interaction.channel.isDMBased()) {
            addToLog(LogType.Warning, commandName, interaction.user.tag, 'Direct Interaction', 'Direct Interaction', text);
        }
        else {
            addToLog(LogType.Warning, commandName, interaction.user.tag, interaction.guild.name, interaction.channel.name, text);
        }
    });
}
//#endregion
//#region Function that takes several inputs and creates an embedded interaction for a lack of bot admin privileges
/**
 * This function takes several inputs and creates an embed interaction for an Error stating a lack of bot admin privileges.
 * @param interaction - A Discord.js Interaction Object
 * @param commandName - String of the name of the command
 * @param client - A Discord.js Client Object
 */
function errorNoAdmin(interaction, commandName) {
    return __awaiter(this, void 0, void 0, function* () {
        const embMsg = new EmbedBuilder()
            .setTitle('Error!')
            .setColor('#FF0000')
            .setDescription('You do not have permission to use this command. This command requires *BOT ADMIN* access to use!')
            .setFooter({
            text: `Requested by ${interaction.user.tag}`,
            iconURL: null,
        });
        interaction.reply({ embeds: [embMsg], ephemeral: true });
        if (interaction.channel.isDMBased()) {
            addToLog(LogType.Warning, commandName, interaction.user.tag, 'Direct Interaction', 'Direct Interaction', 'Not Bot Admin!');
        }
        else {
            addToLog(LogType.Warning, commandName, interaction.user.tag, interaction.guild.name, interaction.channel.name, 'Not Bot Admin!');
        }
    });
}
//#endregion
//#region Function that takes several inputs and creates an embedded interaction for a lack of mod privileges
/**
 * This function takes several inputs and creates an embed interaction for an Error stating a lack of mod privileges.
 * @param interaction - A Discord.js Interaction Object
 * @param commandName - String of the name of the command
 * @param client - A Discord.js Client Object
 */
function errorNoMod(interaction, commandName) {
    return __awaiter(this, void 0, void 0, function* () {
        const embMsg = new EmbedBuilder()
            .setTitle('Error!')
            .setColor('#FF0000')
            .setDescription('You do not have permission to use this command. This command requires *BOT MOD* access to use!')
            .setFooter({
            text: `Requested by ${interaction.user.tag}`,
            iconURL: null,
        });
        interaction.reply({ embeds: [embMsg], ephemeral: true });
        if (interaction.channel.isDMBased()) {
            addToLog(LogType.Warning, commandName, interaction.user.tag, 'Direct Interaction', 'Direct Interaction', 'Not Bot Moderator!');
        }
        else {
            addToLog(LogType.Warning, commandName, interaction.user.tag, interaction.guild.name, interaction.channel.name, 'Not Bot Moderator!');
        }
    });
}
//#endregion
//#region Function that takes several inputs and creates an embedded interaction for a lack of DJ privileges
/**
 * This function takes several inputs and creates an embed interaction for an Error stating a lack of DJ privileges.
 * @param interaction - A Discord.js Interaction Object
 * @param commandName - String of the name of the command
 * @param client - A Discord.js Client Object
 */
function errorNoDJ(interaction, commandName) {
    return __awaiter(this, void 0, void 0, function* () {
        const embMsg = new EmbedBuilder()
            .setTitle('Error!')
            .setColor('#FF0000')
            .setDescription('You do not have permission to use this command. This command requires *DJ* access to use!')
            .setFooter({
            text: `Requested by ${interaction.user.tag}`,
            iconURL: null,
        });
        interaction.reply({ embeds: [embMsg], ephemeral: true });
        if (interaction.channel.isDMBased()) {
            addToLog(LogType.Warning, commandName, interaction.user.tag, 'Direct Interaction', 'Direct Interaction', 'Not DJ!');
        }
        else {
            addToLog(LogType.Warning, commandName, interaction.user.tag, interaction.guild.name, interaction.channel.name, 'Not a DJ!');
        }
    });
}
//#endregion
//#region Function that takes several inputs and creates an embedded interaction for a lack of server admin privileges
/**
 * This function takes several inputs and creates an embed interaction for an Error stating a lack of server admin privileges.
 * @param interaction - A Discord.js Interaction Object
 * @param commandName - String of the name of the command
 * @param client - A Discord.js Client Object
 */
function errorNoServerAdmin(interaction, commandName) {
    return __awaiter(this, void 0, void 0, function* () {
        const embMsg = new EmbedBuilder()
            .setTitle('Error!')
            .setColor('#FF0000')
            .setDescription('You do not have permission to use this command. This command requires *SERVER ADMIN* access to use!')
            .setFooter({
            text: `Requested by ${interaction.user.tag}`,
            iconURL: null,
        });
        interaction.reply({ embeds: [embMsg], ephemeral: true });
        if (interaction.channel.isDMBased()) {
            addToLog(LogType.Warning, commandName, interaction.user.tag, 'Direct Interaction', 'Direct Interaction', 'Not Server Admin!');
        }
        else {
            addToLog(LogType.Warning, commandName, interaction.user.tag, interaction.guild.name, interaction.channel.name, 'Not Server Admin!');
        }
    });
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
function errorCustom(interaction, text, commandName, client) {
    return __awaiter(this, void 0, void 0, function* () {
        const embMsg = new EmbedBuilder()
            .setTitle('Error!')
            .setColor('#FF0000')
            .setDescription(text)
            .setFooter({
            text: `Requested by ${interaction.user.tag}`,
            iconURL: null,
        });
        interaction.reply({ embeds: [embMsg], ephemeral: true });
        if (interaction.channel.isDMBased()) {
            addToLog(LogType.FatalError, commandName, interaction.user.tag, 'Direct Interaction', 'Direct Interaction', text);
        }
        else {
            addToLog(LogType.FatalError, commandName, interaction.user.tag, interaction.guild.name, interaction.channel.name, text, client);
        }
    });
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
function warnWrongChannel(interaction, correctChannel, commandName) {
    return __awaiter(this, void 0, void 0, function* () {
        const embMsg = new EmbedBuilder()
            .setTitle('Warning!')
            .setColor('#F8AA2A')
            .setDescription(`That was not the correct channel for that command. The correct channel for this command is #${correctChannel}`)
            .setFooter({
            text: `Requested by ${interaction.user.tag}`,
            iconURL: null,
        });
        interaction.reply({ embeds: [embMsg], ephemeral: true });
        if (interaction.channel.isDMBased()) {
            addToLog(LogType.Warning, commandName, interaction.user.tag, 'Direct Interaction', 'Direct Interaction', 'Wrong Text Channel');
        }
        else {
            addToLog(LogType.Warning, commandName, interaction.user.tag, interaction.guild.name, interaction.channel.name, 'Wrong Text Channel');
        }
    });
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
function warnDisabled(interaction, feature, commandName) {
    return __awaiter(this, void 0, void 0, function* () {
        const embMsg = new EmbedBuilder()
            .setTitle('Warning!')
            .setColor('#F8AA2A')
            .setDescription(`This feature is currently disabled. To enable it, please run the !set ${feature}. NOTE: This command is only available to a server admin.`)
            .setFooter({
            text: `Requested by ${interaction.user.tag}`,
            iconURL: null,
        });
        interaction.reply({ embeds: [embMsg], ephemeral: true });
        if (interaction.channel.isDMBased()) {
            addToLog(LogType.Warning, commandName, interaction.user.tag, 'Direct Interaction', 'Direct Interaction', 'Feature Disabled');
        }
        else {
            addToLog(LogType.Warning, commandName, interaction.user.tag, interaction.guild.name, interaction.channel.name, 'Feature Disabled');
        }
    });
}
//#endregion
//#region exports
export { errorNoAdmin, errorNoMod, errorNoDJ, errorNoServerAdmin, errorCustom, warnWrongChannel, warnDisabled, embedCustom, warnCustom, embedHelp, embedCustomDM };
//#endregion
