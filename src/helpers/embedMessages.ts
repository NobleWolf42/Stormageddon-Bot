//#region Imports
import { APIEmbedField, Client, ColorResolvable, EmbedBuilder, Message, PartialGroupDMChannel } from 'discord.js';
import { addToLog } from './errorLog.js';
import { MessageWithDeleted } from '../models/messages.js';
//#endregion

//#region Function that takes several inputs and creates an embedded message and sends it in the channel that is attached to the Message Object
/**
 * This function takes several inputs and creates a custom embed message and then sends it in a server.
 * @param message - A Discord.js Message Object
 * @param title - String for the Title/Header of the message
 * @param color - String Hex Code for the color of the border
 * @param text - String for the body of the embedded message
 * @param footer - Object for the footer of the embedded message - Default: { text: `Requested by ${message.author.tag}`, iconURL: null }
 * @param img - URL to an Image to include - Default: null
 * @param fields - addField arguments - Default: []
 * @param url - URL to add as the embedURL - Default: null
 * @param thumbnail - URL to thumbnail - Default: null
 * @returns message.channel.send({ embeds: [embMsg] }) (Message Object)
 */
async function embedCustom(
    message: MessageWithDeleted,
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
    const channel = message.channel;

    if (!channel.isDMBased()) {
        if (!message.deleted) {
            message.delete();
            message.deleted = true;
        }
    }
    if (channel instanceof PartialGroupDMChannel) {
        return;
    }

    return await channel.send({ embeds: [embMsg] });
}
//#endregion

//#region Function that takes several inputs and creates an embedded message and dms the user that is attached to the Message Object
/**
 * This function takes several inputs and creates an embed message and then sends it in a DM.
 * @param message - A Discord.js Message Object
 * @param title - String for the Title/Header of the message
 * @param color - String Hex Code for the color of the border
 * @param text - String for the body of the embedded message
 * @param img - URL to an Image to include (default = null)
 */
function embedCustomDM(message: MessageWithDeleted, title: string, color: ColorResolvable, text: string, img: string = null) {
    const embMsg = new EmbedBuilder()
        .setTitle(title)
        .setColor(color)
        .setDescription(text)
        .setFooter({
            text: `Requested by ${message.author.tag}`,
            iconURL: null,
        })
        .setImage(img);
    message.author.send({ embeds: [embMsg] });

    if (!message.channel.isDMBased()) {
        if (!message.deleted) {
            message.delete();
            message.deleted = true;
        }
    }
}
//#endregion

//#region Function that takes several inputs and creates an embedded message for the help command
/**
 * This function takes several inputs and creates an embed message for the help command.
 * @param message - A Discord.js Message Object
 * @param title - String for the Title/Header of the message
 * @param text - String for the body of the embedded message
 */
function embedHelp(message: MessageWithDeleted, title: string, text: string) {
    const embMsg = new EmbedBuilder()
        .setTitle(title)
        .setColor('#1459C7')
        .setDescription(text)
        .setFooter({
            text: `Requested by ${message.author.tag}`,
            iconURL: null,
        });
    message.author.send({ embeds: [embMsg] });

    if (!message.channel.isDMBased()) {
        if (!message.deleted) {
            message.delete();
            message.deleted = true;
        }
    }
}
//#endregion

//#region Function that takes several inputs and creates an embedded message for a custom warning
/**
 * This function takes several inputs and creates an embed message for a custom warning.
 * @param message - A Discord.js Message Object
 * @param text - String for the body of the embedded message
 * @param commandName - String of the name of the command
 */
function warnCustom(message: MessageWithDeleted, text: string, commandName: string) {
    const embMsg = new EmbedBuilder()
        .setTitle('Warning!')
        .setColor('#F8AA2A')
        .setDescription(text)
        .setFooter({
            text: `Requested by ${message.author.tag}`,
            iconURL: null,
        });

    if (!message.channel.isDMBased()) {
        message.channel.send({ embeds: [embMsg] }).then((msg) => {
            setTimeout(() => msg.delete(), 15000);
        });
        addToLog('warning', commandName, message.author.tag, message.guild.name, message.channel.name, text);
        if (!message.deleted) {
            message.delete();
            message.deleted = true;
        }
    } else {
        message.channel.send({ embeds: [embMsg] });
        addToLog('warning', commandName, message.author.tag, 'Direct Message', 'Direct Message', text);
    }
}
//#endregion

//#region Function that takes several inputs and creates an embedded message for a lack of bot admin privileges
/**
 * This function takes several inputs and creates an embed message for an error stating a lack of bot admin privileges.
 * @param message - A Discord.js Message Object
 * @param commandName - String of the name of the command
 */
function errorNoAdmin(message: MessageWithDeleted, commandName: string) {
    const embMsg = new EmbedBuilder()
        .setTitle('Error!')
        .setColor('#FF0000')
        .setDescription('You do not have permission to use this command. This command requires *BOT ADMIN* access to use!')
        .setFooter({
            text: `Requested by ${message.author.tag}`,
            iconURL: null,
        });
    if (!message.channel.isDMBased()) {
        message.channel.send({ embeds: [embMsg] }).then((msg) => {
            setTimeout(() => msg.delete(), 15000);
        });
        addToLog('warning', commandName, message.author.tag, message.guild.name, message.channel.name, 'Not Bot Admin!');
        if (!message.deleted) {
            message.delete();
            message.deleted = true;
        }
    } else {
        message.channel.send({ embeds: [embMsg] });
        addToLog('warning', commandName, message.author.tag, 'Direct Message', 'Direct Message', 'Not Bot Admin!');
    }
}
//#endregion

//#region Function that takes several inputs and creates an embedded message for a lack of bot mod privileges
/**
 * This function takes several inputs and creates an embed message for an error stating a lack of bot mod privileges.
 * @param message - A Discord.js Message Object
 * @param commandName - String of the name of the command
 */
function errorNoMod(message: MessageWithDeleted, commandName: string) {
    const embMsg = new EmbedBuilder()
        .setTitle('Error!')
        .setColor('#FF0000')
        .setDescription('You do not have permission to use this command. This command requires *BOT MOD* access to use!')
        .setFooter({
            text: `Requested by ${message.author.tag}`,
            iconURL: null,
        });
    if (!message.channel.isDMBased()) {
        message.channel.send({ embeds: [embMsg] }).then((msg) => {
            setTimeout(() => msg.delete(), 15000);
        });
        addToLog('warning', commandName, message.author.tag, message.guild.name, message.channel.name, 'Not Bot Moderator!');
        if (!message.deleted) {
            message.delete();
            message.deleted = true;
        }
    } else {
        message.channel.send({ embeds: [embMsg] });
        addToLog('warning', commandName, message.author.tag, 'Direct Message', 'Direct Message', 'Not Bot Moderator!');
    }
}
//#endregion

//#region Function that takes several inputs and creates an embedded message for a lack of DJ privileges
/**
 * This function takes several inputs and creates an embed message for an error stating a lack of DJ privileges.
 * @param message - A Discord.js Message Object
 * @param commandName - String of the name of the command
 */
function errorNoDJ(message: MessageWithDeleted, commandName: string) {
    const embMsg = new EmbedBuilder()
        .setTitle('Error!')
        .setColor('#FF0000')
        .setDescription('You do not have permission to use this command. This command requires *DJ* access to use!')
        .setFooter({
            text: `Requested by ${message.author.tag}`,
            iconURL: null,
        });
    if (!message.channel.isDMBased()) {
        message.channel.send({ embeds: [embMsg] }).then((msg) => {
            setTimeout(() => msg.delete(), 15000);
        });
        addToLog('warning', commandName, message.author.tag, message.guild.name, message.channel.name, 'Not a DJ!');
        if (!message.deleted) {
            message.delete();
            message.deleted = true;
        }
    } else {
        message.channel.send({ embeds: [embMsg] });
        addToLog('warning', commandName, message.author.tag, 'Direct Message', 'Direct Message', 'Not DJ!');
    }
}
//#endregion

//#region Function that takes several inputs and creates an embedded message for a lack of server admin privileges
/**
 * This function takes several inputs and creates an embed message for an Error stating a lack of server admin privileges.
 * @param message - A Discord.js Message Object
 * @param commandName - String of the name of the command
 */
function errorNoServerAdmin(message: MessageWithDeleted, commandName: string) {
    const embMsg = new EmbedBuilder()
        .setTitle('Error!')
        .setColor('#FF0000')
        .setDescription('You do not have permission to use this command. This command requires *SERVER ADMIN* access to use!')
        .setFooter({
            text: `Requested by ${message.author.tag}`,
            iconURL: null,
        });
    if (!message.channel.isDMBased()) {
        message.channel.send({ embeds: [embMsg] }).then((msg) => {
            setTimeout(() => msg.delete(), 15000);
        });
        addToLog('warning', commandName, message.author.tag, message.guild.name, message.channel.name, 'Not Server Admin!');
        if (!message.deleted) {
            message.delete();
            message.deleted = true;
        }
    } else {
        message.channel.send({ embeds: [embMsg] });
        addToLog('warning', commandName, message.author.tag, 'Direct Message', 'Direct Message', 'Not Server Admin!');
    }
}
//#endregion

//#region Function that takes several inputs and creates an embedded message for a custom error
/**
 * This function takes several inputs and creates an embed message for a custom error.
 * @param message - A Discord.js Message Object
 * @param text - String for the body of the embedded message
 * @param commandName - String of the name of the command
 * @param client - A Discord.js Client Object
 */
async function errorCustom(message: MessageWithDeleted, text: string, commandName: string, client: Client) {
    const embMsg = new EmbedBuilder()
        .setTitle('Error!')
        .setColor('#FF0000')
        .setDescription(text)
        .setFooter({
            text: `Requested by ${message.author.tag}`,
            iconURL: null,
        });
    if (!message.channel.isDMBased()) {
        message.channel.send({ embeds: [embMsg] }).then((msg) => {
            setTimeout(() => msg.delete(), 15000);
        });
        addToLog('fatal error', commandName, message.author.tag, message.guild.name, message.channel.name, text, client);
        if (!message.deleted) {
            message.delete();
            message.deleted = true;
        }
    } else {
        message.channel.send({ embeds: [embMsg] });
        addToLog('fatal error', commandName, message.author.tag, 'Direct Message', 'Direct Message', text);
    }
}
//#endregion

//#region Function that takes several inputs and creates an embedded message for a wrong channel warning
/**
 * This function takes several inputs and creates an embed message for a wrong channel warning.
 * @param message - A Discord.js Message Object
 * @param correctChannel - String for the correct channel to send the command in
 * @param commandName - String of the name of the command
 */
function warnWrongChannel(message: MessageWithDeleted, correctChannel: string, commandName: string) {
    const embMsg = new EmbedBuilder()
        .setTitle('Warning!')
        .setColor('#F8AA2A')
        .setDescription(`That was not the correct channel for that command. The correct channel for this command is #${correctChannel}`)
        .setFooter({
            text: `Requested by ${message.author.tag}`,
            iconURL: null,
        });
    message.author.send({ embeds: [embMsg] });
    if (!message.channel.isDMBased()) {
        addToLog('warning', commandName, message.author.tag, message.guild.name, message.channel.name, 'Wrong Text Channel');
        if (!message.deleted) {
            message.delete();
            message.deleted = true;
        }
    } else {
        addToLog('warning', commandName, message.author.tag, 'Direct Message', 'Direct Message', 'Wrong Text Channel');
    }
}
//#endregion

//#region Function that takes several inputs and creates an embedded message for a disabled command warning
/**
 * This function takes several inputs and creates an embed message for a disabled command warning.
 * @param message - A Discord.js Message Object
 * @param feature - String for the name of the feature
 * @param commandName - String of the name of the command
 */
function warnDisabled(message: MessageWithDeleted, feature: string, commandName: string) {
    const embMsg = new EmbedBuilder()
        .setTitle('Warning!')
        .setColor('#F8AA2A')
        .setDescription(`This feature is currently disabled. To enable it, please run the !set ${feature}. NOTE: This command is only available to a server admin.`)
        .setFooter({
            text: `Requested by ${message.author.tag}`,
            iconURL: null,
        });
    message.author.send({ embeds: [embMsg] });
    if (!message.channel.isDMBased()) {
        addToLog('warning', commandName, message.author.tag, message.guild.name, message.channel.name, 'Feature Disabled');
        if (!message.deleted) {
            message.delete();
            message.deleted = true;
        }
    } else {
        addToLog('warning', commandName, message.author.tag, 'Direct Message', 'Direct Message', 'Feature Disabled');
    }
}
//#endregion

//#region exports
export { errorNoAdmin, errorNoMod, errorNoDJ, errorNoServerAdmin, errorCustom, warnWrongChannel, warnDisabled, embedCustom, warnCustom, embedHelp, embedCustomDM };
//#endregion
