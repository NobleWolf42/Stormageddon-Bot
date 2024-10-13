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
import { AuditLogEvent, EmbedBuilder, Events } from 'discord.js';
import { MongooseServerConfig } from '../models/serverConfigModel.js';
import { addToLog } from '../helpers/errorLog.js';
import { LogType } from '../models/loggingModel.js';
//#endregion
//#region Message Logging
/**
 * This functions handles logging message edits and deletes
 * @param client - Discord.js Client
 */
function logMessageUpdate(client) {
    return __awaiter(this, void 0, void 0, function* () {
        //#region Message Delete
        client.on(Events.MessageDelete, (message) => __awaiter(this, void 0, void 0, function* () {
            const channel = yield client.channels.fetch(message.channelId);
            if (!channel.isTextBased() || channel.isDMBased() || Date.now() - 604800000 > message.createdTimestamp) {
                return;
            }
            const serverConfig = yield MongooseServerConfig.findById(message.guild.id);
            // check the server config and see if they have logging turned on
            // is the bot setup on the server?
            if (serverConfig.setupNeeded) {
                return;
            }
            // is logging turned on?
            if (!serverConfig.logging.enable || !serverConfig.logging.text.enable) {
                return;
            }
            // is logging channel defined?
            if (serverConfig.logging.text.loggingChannel == 'Not Set Up') {
                addToLog(LogType.FatalError, 'logMessageUpdate-delete', 'null', message.guild.name, 'null', 'The logging output channel is not setup.', client);
                return;
            }
            const logChannel = yield client.channels.fetch(serverConfig.logging.text.loggingChannel);
            if (!logChannel.isTextBased() || logChannel.isDMBased()) {
                return;
            }
            const fieldsOut = [];
            fieldsOut.push({
                name: '**User Name:**',
                value: message.author.username,
                inline: true,
            });
            fieldsOut.push({
                name: '**Channel Name:**',
                value: channel.name,
                inline: true,
            });
            fieldsOut.push({
                name: '**Message Timestamp:**',
                value: `<t:${Math.round(message.createdTimestamp / 1000)}>`,
                inline: true,
            });
            fieldsOut.push({
                name: '**User Mention:**',
                value: `${message.author}`,
                inline: true,
            });
            fieldsOut.push({
                name: '**Channel Mention:**',
                value: `${channel}`,
                inline: true,
            });
            fieldsOut.push({
                name: ' ',
                value: ' ',
                inline: true,
            });
            fieldsOut.push({
                name: '**User ID:**',
                value: message.author.id,
                inline: true,
            });
            fieldsOut.push({
                name: '**Channel ID:**',
                value: message.channelId,
                inline: true,
            });
            fieldsOut.push({
                name: ' ',
                value: ' ',
                inline: true,
            });
            fieldsOut.push({
                name: '**Message:**',
                value: message.content,
                inline: true,
            });
            fieldsOut.push({
                name: ' ',
                value: ' ',
                inline: true,
            });
            fieldsOut.push({
                name: ' ',
                value: ' ',
                inline: true,
            });
            const embMsg = new EmbedBuilder()
                .setColor('#ff0000')
                .setThumbnail(`https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}`)
                .setTitle(`Message Deleted`)
                .setFields(fieldsOut)
                .setTimestamp();
            logChannel.send({ embeds: [embMsg] });
        }));
        //#endregion
        //#region Message Edit
        client.on(Events.MessageUpdate, (oldMessage, newMessage) => __awaiter(this, void 0, void 0, function* () {
            const channel = yield client.channels.fetch(oldMessage.channelId);
            if (!channel.isTextBased() || channel.isDMBased() || Date.now() - 604800000 > oldMessage.createdTimestamp || oldMessage.content == '') {
                return;
            }
            const serverConfig = yield MongooseServerConfig.findById(oldMessage.guild.id);
            // check the server config and see if they have logging turned on
            // is the bot setup on the server?
            if (serverConfig.setupNeeded) {
                return;
            }
            // is logging turned on?
            if (!serverConfig.logging.enable || !serverConfig.logging.text.enable) {
                return;
            }
            // is logging channel defined?
            if (serverConfig.logging.text.loggingChannel == 'Not Set Up') {
                addToLog(LogType.FatalError, 'logMessageUpdate-delete', 'null', oldMessage.guild.name, 'null', 'The logging output channel is not setup.', client);
                return;
            }
            const logChannel = yield client.channels.fetch(serverConfig.logging.text.loggingChannel);
            if (!logChannel.isTextBased() || logChannel.isDMBased()) {
                return;
            }
            const fieldsOut = [];
            fieldsOut.push({
                name: '**User Name:**',
                value: oldMessage.author.username,
                inline: true,
            });
            fieldsOut.push({
                name: '*Channel Name:*',
                value: channel.name,
                inline: true,
            });
            fieldsOut.push({
                name: '**Message Timestamp:**',
                value: `<t:${Math.round(oldMessage.createdTimestamp / 1000)}>`,
                inline: true,
            });
            fieldsOut.push({
                name: '**User Mention:**',
                value: `${oldMessage.author}`,
                inline: true,
            });
            fieldsOut.push({
                name: '**Channel Mention:**',
                value: `${channel}`,
                inline: true,
            });
            fieldsOut.push({
                name: ' ',
                value: ' ',
                inline: true,
            });
            fieldsOut.push({
                name: '**User ID:**',
                value: oldMessage.author.id,
                inline: true,
            });
            fieldsOut.push({
                name: '**Channel ID:**',
                value: oldMessage.channelId,
                inline: true,
            });
            fieldsOut.push({
                name: ' ',
                value: ' ',
                inline: true,
            });
            fieldsOut.push({
                name: '**Old Message:**',
                value: oldMessage.content,
                inline: true,
            });
            fieldsOut.push({
                name: '**New Message:**',
                value: newMessage.content,
                inline: true,
            });
            fieldsOut.push({
                name: ' ',
                value: ' ',
                inline: true,
            });
            const embMsg = new EmbedBuilder()
                .setColor('#0000ff')
                .setThumbnail(`https://cdn.discordapp.com/avatars/${oldMessage.author.id}/${oldMessage.author.avatar}`)
                .setTitle(`Message Edited`)
                .setDescription(`[Jump To Message](https://discordapp.com/channels/${oldMessage.guildId}/${oldMessage.channelId}/${oldMessage.id})`)
                .setFields(fieldsOut)
                .setTimestamp();
            logChannel.send({ embeds: [embMsg] });
        }));
        //#endregion
        console.log('... OK');
    });
}
//#endregion
//#region Voice Logging
/**
 * This function handles logging voice events
 * @param client - Discord.js Client
 */
function logVoiceUpdate(client) {
    return __awaiter(this, void 0, void 0, function* () {
        // setup a listener for voice state update
        client.on(Events.VoiceStateUpdate, (oldState, newState) => __awaiter(this, void 0, void 0, function* () {
            // extract the member? and the channel
            const newChannel = newState.channel;
            const oldChannel = oldState.channel;
            var member = null;
            var guild = null;
            var connectEvent = null;
            //This is horrible, fix me later
            if (!oldChannel) {
                member = newState.member;
                guild = newState.guild;
                connectEvent = true;
            }
            else if (!newChannel) {
                member = oldState.member;
                guild = oldState.guild;
                connectEvent = false;
            }
            else if (oldChannel.guild.id != newChannel.guild.id) {
                member = newState.member;
                guild = newState.guild;
                connectEvent = true;
            }
            else {
                member = oldState.member;
                guild = oldState.guild;
                connectEvent = false;
            }
            const serverConfig = yield MongooseServerConfig.findById(newState.guild.id);
            // check the server config and see if they have logging turned on
            // is the bot setup on the server?
            if (serverConfig.setupNeeded) {
                return;
            }
            // is logging turned on?
            if (!serverConfig.logging.enable || !serverConfig.logging.voice.enable) {
                return;
            }
            // is logging channel defined?
            if (serverConfig.logging.voice.loggingChannel == 'Not Set Up') {
                addToLog(LogType.FatalError, 'logOnVoiceUpdate', 'null', guild.name, 'null', 'The logging output channel is not setup.', client);
                return;
            }
            // any time voice state updated execute the following code
            if (connectEvent) {
                console.log(member);
                const embMsg = new EmbedBuilder().setTitle(`User ${member.user.username} connected!`).setColor('#ffffff').setDescription("test we'll figure it out later ben I'm tired").setTimestamp();
                // Trigger every time a connection or disconnection is made to a channel
                // wrap in message (embeds)
                // post message to channel
                yield client.channels.cache.get(serverConfig.logging.voice.loggingChannel).send({ embeds: [embMsg] });
            }
            else if (connectEvent != null || !connectEvent) {
                const embMsg = new EmbedBuilder().setTitle(`User ${member.user.username} disconnected!`).setColor('#ffffff').setDescription("test we'll figure it out later ben I'm tired").setTimestamp();
                // Trigger every time a connection or disconnection is made to a channel
                // wrap in message (embeds)
                // post message to channel
                yield client.channels.cache.get(serverConfig.logging.voice.loggingChannel).send({ embeds: [embMsg] });
            }
            else {
                //more error logging
            }
        }));
        console.log('... OK');
    });
}
//#endregion
//#region Admin Logging
/**
 * This function handles logging Admin events
 * @param client - Discord.js Client
 */
function logAdminUpdate(client) {
    return __awaiter(this, void 0, void 0, function* () {
        //#region Channel Creation
        client.on(Events.ChannelCreate, (channel) => __awaiter(this, void 0, void 0, function* () {
            const serverConfig = yield MongooseServerConfig.findById(channel.guild.id);
            // check the server config and see if they have logging turned on
            // is the bot setup on the server?
            if (serverConfig.setupNeeded) {
                return;
            }
            // is logging turned on?
            if (!serverConfig.logging.enable || !serverConfig.logging.text.enable) {
                return;
            }
            // is logging channel defined?
            if (serverConfig.logging.text.loggingChannel == 'Not Set Up') {
                addToLog(LogType.FatalError, 'logMessageUpdate-delete', 'null', channel.guild.name, 'null', 'The logging output channel is not setup.', client);
                return;
            }
            const auditLogFetch = yield channel.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.ChannelCreate }); // Fetching the audit logs.
            const auditLog = auditLogFetch.entries.first();
            const logChannel = yield client.channels.fetch(serverConfig.logging.text.loggingChannel);
            if (!logChannel.isTextBased() || logChannel.isDMBased()) {
                return;
            }
            const fieldsOut = [];
            if (channel.isVoiceBased()) {
                if (auditLogFetch.entries.first() && auditLog.targetId == channel.id) {
                    fieldsOut.push({
                        name: '**User Name:**',
                        value: auditLog.executor.username,
                        inline: true,
                    });
                    fieldsOut.push({
                        name: '**Chanel Name:**',
                        value: channel.name,
                        inline: true,
                    });
                    fieldsOut.push({
                        name: '**Assigned:**',
                        value: `Bitrate: ${channel.bitrate}\nNSFW: ${channel.nsfw}\nSlowmode Delay: ${channel.rateLimitPerUser} seconds\nUser Limit: ${channel.userLimit}`,
                        inline: true,
                    });
                    fieldsOut.push({
                        name: '**User Mention:**',
                        value: `${auditLog.executor}`,
                        inline: true,
                    });
                    fieldsOut.push({
                        name: '**Channel Mention:**',
                        value: `${channel}`,
                        inline: true,
                    });
                    fieldsOut.push({
                        name: ' ',
                        value: ' ',
                        inline: true,
                    });
                    fieldsOut.push({
                        name: '**User ID:**',
                        value: auditLog.executor.id,
                        inline: true,
                    });
                    fieldsOut.push({
                        name: '**Channel ID:**',
                        value: channel.id,
                        inline: true,
                    });
                    fieldsOut.push({
                        name: ' ',
                        value: ' ',
                        inline: true,
                    });
                }
                else {
                    fieldsOut.push({
                        name: '**Chanel Name:**',
                        value: channel.name,
                        inline: true,
                    });
                    fieldsOut.push({
                        name: '**Assigned:**',
                        value: `Bitrate: ${channel.bitrate}\nNSFW: ${channel.nsfw}\nSlowmode Delay: ${channel.rateLimitPerUser} seconds\nUser Limit: ${channel.userLimit}`,
                        inline: true,
                    });
                    fieldsOut.push({
                        name: ' ',
                        value: ' ',
                        inline: true,
                    });
                    fieldsOut.push({
                        name: '**Channel Mention:**',
                        value: `${channel}`,
                        inline: true,
                    });
                    fieldsOut.push({
                        name: ' ',
                        value: ' ',
                        inline: true,
                    });
                    fieldsOut.push({
                        name: ' ',
                        value: ' ',
                        inline: true,
                    });
                    fieldsOut.push({
                        name: '**Channel ID:**',
                        value: channel.id,
                        inline: true,
                    });
                    fieldsOut.push({
                        name: ' ',
                        value: ' ',
                        inline: true,
                    });
                    fieldsOut.push({
                        name: ' ',
                        value: ' ',
                        inline: true,
                    });
                }
            }
            else if (channel.isTextBased()) {
                if (auditLogFetch.entries.first() && auditLog.targetId == channel.id) {
                    fieldsOut.push({
                        name: '**User Name:**',
                        value: auditLog.executor.username,
                        inline: true,
                    });
                    fieldsOut.push({
                        name: '**Chanel Name:**',
                        value: channel.name,
                        inline: true,
                    });
                    fieldsOut.push({
                        name: '**Assigned:**',
                        value: `Name: ${channel.name}\nNSFW: ${channel.nsfw}\nSlowmode Delay: ${channel.rateLimitPerUser} seconds`,
                        inline: true,
                    });
                    fieldsOut.push({
                        name: '**User Mention:**',
                        value: `${auditLog.executor}`,
                        inline: true,
                    });
                    fieldsOut.push({
                        name: '**Channel Mention:**',
                        value: `${channel}`,
                        inline: true,
                    });
                    fieldsOut.push({
                        name: ' ',
                        value: ' ',
                        inline: true,
                    });
                    fieldsOut.push({
                        name: '**User ID:**',
                        value: auditLog.executor.id,
                        inline: true,
                    });
                    fieldsOut.push({
                        name: '**Channel ID:**',
                        value: channel.id,
                        inline: true,
                    });
                    fieldsOut.push({
                        name: ' ',
                        value: ' ',
                        inline: true,
                    });
                }
                else {
                    fieldsOut.push({
                        name: '**Chanel Name:**',
                        value: channel.name,
                        inline: true,
                    });
                    fieldsOut.push({
                        name: '**Assigned:**',
                        value: `Name: ${channel.name}\nNSFW: ${channel.nsfw}\nSlowmode Delay: ${channel.rateLimitPerUser} seconds`,
                        inline: true,
                    });
                    fieldsOut.push({
                        name: ' ',
                        value: ' ',
                        inline: true,
                    });
                    fieldsOut.push({
                        name: '**Channel Mention:**',
                        value: `${channel}`,
                        inline: true,
                    });
                    fieldsOut.push({
                        name: ' ',
                        value: ' ',
                        inline: true,
                    });
                    fieldsOut.push({
                        name: ' ',
                        value: ' ',
                        inline: true,
                    });
                    fieldsOut.push({
                        name: '**Channel ID:**',
                        value: channel.id,
                        inline: true,
                    });
                    fieldsOut.push({
                        name: ' ',
                        value: ' ',
                        inline: true,
                    });
                    fieldsOut.push({
                        name: ' ',
                        value: ' ',
                        inline: true,
                    });
                }
            }
            const embMsg = new EmbedBuilder().setColor('#00ff00').setThumbnail(channel.guild.iconURL()).setTitle(`Channel Created`).setFields(fieldsOut).setTimestamp();
            logChannel.send({ embeds: [embMsg] });
        }));
        //#endregion
        //#region Channel Deletion
        client.on(Events.ChannelDelete, (channel) => __awaiter(this, void 0, void 0, function* () {
            if (channel.isDMBased()) {
                return;
            }
            const serverConfig = yield MongooseServerConfig.findById(channel.guild.id);
            // check the server config and see if they have logging turned on
            // is the bot setup on the server?
            if (serverConfig.setupNeeded) {
                return;
            }
            // is logging turned on?
            if (!serverConfig.logging.enable || !serverConfig.logging.text.enable) {
                return;
            }
            // is logging channel defined?
            if (serverConfig.logging.text.loggingChannel == 'Not Set Up') {
                addToLog(LogType.FatalError, 'logMessageUpdate-delete', 'null', channel.guild.name, 'null', 'The logging output channel is not setup.', client);
                return;
            }
            const auditLogFetch = yield channel.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.ChannelDelete }); // Fetching the audit logs.
            const auditLog = auditLogFetch.entries.first();
            const logChannel = yield client.channels.fetch(serverConfig.logging.text.loggingChannel);
            if (!logChannel.isTextBased() || logChannel.isDMBased()) {
                return;
            }
            if (!channel.isTextBased()) {
                return;
            }
            const fieldsOut = [];
            if (auditLogFetch.entries.first()) {
                fieldsOut.push({
                    name: '**User Name:**',
                    value: auditLog.executor.username,
                    inline: true,
                });
                fieldsOut.push({
                    name: '**Chanel Name:**',
                    value: channel.name,
                    inline: true,
                });
                fieldsOut.push({
                    name: '**Assigned:**',
                    value: `Name: ${channel.name}\nNSFW: ${channel.nsfw}\nSlowmode Delay: ${channel.rateLimitPerUser} seconds`,
                    inline: true,
                });
                fieldsOut.push({
                    name: '**User Mention:**',
                    value: `${auditLog.executor}`,
                    inline: true,
                });
                fieldsOut.push({
                    name: ' ',
                    value: ' ',
                    inline: true,
                });
                fieldsOut.push({
                    name: ' ',
                    value: ' ',
                    inline: true,
                });
                fieldsOut.push({
                    name: '**User ID:**',
                    value: auditLog.executor.id,
                    inline: true,
                });
                fieldsOut.push({
                    name: '**Channel ID:**',
                    value: channel.id,
                    inline: true,
                });
                fieldsOut.push({
                    name: ' ',
                    value: ' ',
                    inline: true,
                });
            }
            else {
                fieldsOut.push({
                    name: '**Chanel Name:**',
                    value: channel.name,
                    inline: true,
                });
                fieldsOut.push({
                    name: '**Assigned:**',
                    value: `Name: ${channel.name}\nNSFW: ${channel.nsfw}\nSlowmode Delay: ${channel.rateLimitPerUser} seconds`,
                    inline: true,
                });
                fieldsOut.push({
                    name: ' ',
                    value: ' ',
                    inline: true,
                });
                fieldsOut.push({
                    name: '**Channel ID:**',
                    value: channel.id,
                    inline: true,
                });
                fieldsOut.push({
                    name: ' ',
                    value: ' ',
                    inline: true,
                });
                fieldsOut.push({
                    name: ' ',
                    value: ' ',
                    inline: true,
                });
            }
            const embMsg = new EmbedBuilder().setColor('#ff0000').setThumbnail(channel.guild.iconURL()).setTitle(`Channel Deleted`).setFields(fieldsOut).setTimestamp();
            logChannel.send({ embeds: [embMsg] });
        }));
        //#endregion
        //#region Channel Update
        client.on(Events.ChannelUpdate, (channel) => __awaiter(this, void 0, void 0, function* () {
            console.log(channel);
            /*const serverConfig = await MongooseServerConfig.findById(channel.guild.id);
    
            // check the server config and see if they have logging turned on
            // is the bot setup on the server?
            if (serverConfig.setupNeeded) {
                return;
            }
    
            // is logging turned on?
            if (!serverConfig.logging.enable || !serverConfig.logging.text.enable) {
                return;
            }
    
            // is logging channel defined?
            if (serverConfig.logging.text.loggingChannel == 'Not Set Up') {
                addToLog(LogType.FatalError, 'logMessageUpdate-delete', 'null', channel.guild.name, 'null', 'The logging output channel is not setup.', client);
                return;
            }
    
            const auditLogFetch = await channel.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.ChannelCreate }); // Fetching the audit logs.
            const auditLog = auditLogFetch.entries.first();
            const logChannel = await client.channels.fetch(serverConfig.logging.text.loggingChannel);
    
            if (!logChannel.isTextBased() || logChannel.isDMBased()) {
                return;
            }
    
            if (!channel.isTextBased()) {
                return;
            }
    
            const fieldsOut: { name: string; value: string; inline: boolean }[] = [];
    
            if (auditLogFetch.entries.first()) {
                fieldsOut.push({
                    name: '**User Name:**',
                    value: auditLog.executor.username,
                    inline: true,
                });
                fieldsOut.push({
                    name: '**Chanel Name:**',
                    value: channel.name,
                    inline: true,
                });
                fieldsOut.push({
                    name: '**Assigned:**',
                    value: `Name: ${channel.name}\nNSFW: ${channel.nsfw}\nSlowmode Delay: ${channel.rateLimitPerUser} seconds`,
                    inline: true,
                });
                fieldsOut.push({
                    name: '**User Mention:**',
                    value: `${auditLog.executor}`,
                    inline: true,
                });
                fieldsOut.push({
                    name: '**Channel Mention:**',
                    value: `${channel}`,
                    inline: true,
                });
                fieldsOut.push({
                    name: ' ',
                    value: ' ',
                    inline: true,
                });
                fieldsOut.push({
                    name: '**User ID:**',
                    value: auditLog.executor.id,
                    inline: true,
                });
                fieldsOut.push({
                    name: '**Channel ID:**',
                    value: channel.id,
                    inline: true,
                });
            } else {
                fieldsOut.push({
                    name: '**Chanel Name:**',
                    value: channel.name,
                    inline: true,
                });
                fieldsOut.push({
                    name: '**Assigned:**',
                    value: `Name: ${channel.name}\nNSFW: ${channel.nsfw}\nSlowmode Delay: ${channel.rateLimitPerUser} seconds`,
                    inline: true,
                });
                fieldsOut.push({
                    name: ' ',
                    value: ' ',
                    inline: true,
                });
                fieldsOut.push({
                    name: '**Channel Mention:**',
                    value: `${channel}`,
                    inline: true,
                });
                fieldsOut.push({
                    name: ' ',
                    value: ' ',
                    inline: true,
                });
                fieldsOut.push({
                    name: ' ',
                    value: ' ',
                    inline: true,
                });
                fieldsOut.push({
                    name: '**Channel ID:**',
                    value: channel.id,
                    inline: true,
                });
            }
    
            const embMsg = new EmbedBuilder().setColor('#0000ff').setThumbnail(channel.guild.iconURL()).setTitle(`Channel Created`).setFields(fieldsOut).setTimestamp();
            logChannel.send({ embeds: [embMsg] });*/
        }));
        //#endregion
        console.log('... OK');
    });
}
//#endregion
export { logMessageUpdate, logVoiceUpdate, logAdminUpdate };
