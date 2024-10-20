//#region Imports
import { AuditLogEvent, Client, Collection, EmbedBuilder, Events, Guild, GuildAuditLogs, GuildMember, Role, User } from 'discord.js';
import { addToLog } from '../helpers/errorLog.js';
import { LogType } from '../models/loggingModel.js';
import { MongooseServerConfig } from '../models/serverConfigModel.js';
//#endregion

//#region Message Logging
/**
 * This functions handles logging message edits and deletes
 * @param client - Discord.js Client
 */
async function logMessageUpdate(client: Client) {
    //#region Message Delete
    client.on(Events.MessageDelete, async (message) => {
        const channel = await client.channels.fetch(message.channelId);

        if (!channel.isTextBased() || channel.isDMBased() || Date.now() - 604800000 > message.createdTimestamp) {
            return;
        }

        const serverConfig = await MongooseServerConfig.findById(message.guild.id);

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

        const logChannel = await client.channels.fetch(serverConfig.logging.text.loggingChannel);

        if (!logChannel.isTextBased() || logChannel.isDMBased()) {
            return;
        }

        const fieldsOut: { name: string; value: string; inline: boolean }[] = [];

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
    });
    //#endregion

    //#region Message Edit
    client.on(Events.MessageUpdate, async (oldMessage, newMessage) => {
        const channel = await client.channels.fetch(oldMessage.channelId);

        if (!channel.isTextBased() || channel.isDMBased() || Date.now() - 604800000 > oldMessage.createdTimestamp || oldMessage.content == '') {
            return;
        }

        const serverConfig = await MongooseServerConfig.findById(oldMessage.guild.id);

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

        const logChannel = await client.channels.fetch(serverConfig.logging.text.loggingChannel);

        if (!logChannel.isTextBased() || logChannel.isDMBased()) {
            return;
        }

        const fieldsOut: { name: string; value: string; inline: boolean }[] = [];

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
    });
    //#endregion
    console.log('... OK');
}
//#endregion

//#region Voice Logging
/**
 * This function handles logging voice events
 * @param client - Discord.js Client
 */
async function logVoiceUpdate(client: Client) {
    //#region Voice Events
    client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
        // extract the member and the channel
        const newChannel = newState.channel;
        const oldChannel = oldState.channel;
        let member: GuildMember = null;
        let guild: Guild = null;
        let connectEvent: boolean = null;

        //This is horrible, fix me later
        if (!oldChannel) {
            member = newState.member;
            guild = newState.guild;
            connectEvent = true;
        } else if (!newChannel) {
            member = oldState.member;
            guild = oldState.guild;
            connectEvent = false;
        } else if (oldChannel.guild.id != newChannel.guild.id) {
            member = newState.member;
            guild = newState.guild;
            connectEvent = true;
        } else {
            member = oldState.member;
            guild = oldState.guild;
            connectEvent = false;
        }

        if (!connectEvent) {
            return;
        }

        const serverConfig = await MongooseServerConfig.findById(newState.guild.id);

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
        const logChannel = await client.channels.fetch(serverConfig.logging.voice.loggingChannel);

        if (!logChannel.isTextBased() || logChannel.isDMBased()) {
            return;
        }

        const fieldsOut: { name: string; value: string; inline: boolean }[] = [];

        fieldsOut.push({
            name: '**User Name:**',
            value: member.user.username,
            inline: true,
        });
        fieldsOut.push({
            name: '**Chanel Name:**',
            value: newState.channel.name,
            inline: true,
        });
        fieldsOut.push({
            name: ' ',
            value: ' ',
            inline: true,
        });
        fieldsOut.push({
            name: '**User Mention:**',
            value: `${member}`,
            inline: true,
        });
        fieldsOut.push({
            name: '**Channel Mention:**',
            value: `${newState.channel}`,
            inline: true,
        });
        fieldsOut.push({
            name: ' ',
            value: ' ',
            inline: true,
        });
        fieldsOut.push({
            name: '**User ID:**',
            value: member.user.id,
            inline: true,
        });
        fieldsOut.push({
            name: '**Channel ID:**',
            value: newState.channel.id,
            inline: true,
        });
        fieldsOut.push({
            name: ' ',
            value: ' ',
            inline: true,
        });

        const embMsg = new EmbedBuilder()
            .setColor('#00ff00')
            .setThumbnail(`https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}`)
            .setTitle(`User Connected To Voice Channel`)
            .setFields(fieldsOut)
            .setTimestamp();
        logChannel.send({ embeds: [embMsg] });
    });
    //#endregion
    console.log('... OK');
}
//#endregion

//#region Admin Logging
/**
 * This function handles logging Admin events
 * @param client - Discord.js Client
 */
async function logAdminUpdate(client: Client) {
    //#region Channel Creation
    client.on(Events.ChannelCreate, async (channel) => {
        const serverConfig = await MongooseServerConfig.findById(channel.guild.id);

        // check the server config and see if they have logging turned on
        // is the bot setup on the server?
        if (serverConfig.setupNeeded) {
            return;
        }

        // is logging turned on?
        if (!serverConfig.logging.enable || !serverConfig.logging.admin.enable) {
            return;
        }

        // is logging channel defined?
        if (serverConfig.logging.admin.loggingChannel == 'Not Set Up') {
            addToLog(LogType.FatalError, 'logMessageUpdate-delete', 'null', channel.guild.name, 'null', 'The logging output channel is not setup.', client);
            return;
        }

        const auditLogFetch = await channel.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.ChannelCreate }); // Fetching the audit logs.
        const auditLog = auditLogFetch.entries.first();
        const logChannel = await client.channels.fetch(serverConfig.logging.admin.loggingChannel);

        if (!logChannel.isTextBased() || logChannel.isDMBased()) {
            return;
        }

        const fieldsOut: { name: string; value: string; inline: boolean }[] = [];

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
            } else {
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
        } else if (channel.isTextBased()) {
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
    });
    //#endregion

    //#region Channel Deletion
    client.on(Events.ChannelDelete, async (channel) => {
        if (channel.isDMBased()) {
            return;
        }
        const serverConfig = await MongooseServerConfig.findById(channel.guild.id);

        // check the server config and see if they have logging turned on
        // is the bot setup on the server?
        if (serverConfig.setupNeeded) {
            return;
        }

        // is logging turned on?
        if (!serverConfig.logging.enable || !serverConfig.logging.admin.enable) {
            return;
        }

        // is logging channel defined?
        if (serverConfig.logging.admin.loggingChannel == 'Not Set Up') {
            addToLog(LogType.FatalError, 'logMessageUpdate-delete', 'null', channel.guild.name, 'null', 'The logging output channel is not setup.', client);
            return;
        }

        const auditLogFetch = await channel.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.ChannelDelete }); // Fetching the audit logs.
        const auditLog = auditLogFetch.entries.first();
        const logChannel = await client.channels.fetch(serverConfig.logging.admin.loggingChannel);

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
    });
    //#endregion

    //#region Channel Update
    client.on(Events.ChannelUpdate, async (oldChannel, newChannel) => {
        if (oldChannel.isDMBased() || newChannel.isDMBased()) {
            return;
        }

        const serverConfig = await MongooseServerConfig.findById(oldChannel.guild.id);

        // check the server config and see if they have logging turned on
        // is the bot setup on the server?
        if (serverConfig.setupNeeded) {
            return;
        }

        // is logging turned on?
        if (!serverConfig.logging.enable || !serverConfig.logging.admin.enable) {
            return;
        }

        // is logging channel defined?
        if (serverConfig.logging.admin.loggingChannel == 'Not Set Up') {
            addToLog(LogType.FatalError, 'logChannelUpdate', 'null', oldChannel.guild.name, 'null', 'The logging output channel is not setup.', client);
            return;
        }

        const auditLogFetch = await oldChannel.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.ChannelUpdate }); // Fetching the audit logs.
        const auditLog = auditLogFetch.entries.first();
        const logChannel = await client.channels.fetch(serverConfig.logging.admin.loggingChannel);

        if (!logChannel.isTextBased() || logChannel.isDMBased()) {
            return;
        }
        const fieldsOut: { name: string; value: string; inline: boolean }[] = [];
        const changes = new Map();
        let changesString = '';

        if (oldChannel.isTextBased() && newChannel.isTextBased()) {
            if (oldChannel.name != newChannel.name || oldChannel.nsfw != newChannel.nsfw || oldChannel.rateLimitPerUser != newChannel.rateLimitPerUser) {
                changes.set({ name: 'Name: ', data: oldChannel.name, postDataText: '' }, newChannel.name);
                changes.set({ name: 'NSFW: ', data: oldChannel.nsfw, postDataText: '' }, newChannel.nsfw);
                changes.set({ name: 'Slowmode Delay: ', data: oldChannel.rateLimitPerUser, postDataText: ' seconds' }, newChannel.rateLimitPerUser);
                for (const change of changes) {
                    if (change[0].data != change[1]) {
                        changesString += `- ${change[0].name}${change[0].data}${change[0].postDataText} >> ${change[1]}${change[0].postDataText}\n`;
                    }
                }
            }
        } else if (oldChannel.isVoiceBased() && newChannel.isVoiceBased()) {
            if (oldChannel.name != newChannel.name || oldChannel.nsfw != newChannel.nsfw || oldChannel.rateLimitPerUser != newChannel.rateLimitPerUser) {
                changes.set({ name: 'Bitrate: : ', data: oldChannel.bitrate, postDataText: '' }, newChannel.bitrate);
                changes.set({ name: 'Name: ', data: oldChannel.name, postDataText: '' }, newChannel.name);
                changes.set({ name: 'NSFW: ', data: oldChannel.nsfw, postDataText: '' }, newChannel.nsfw);
                changes.set({ name: 'Slowmode Delay: ', data: oldChannel.rateLimitPerUser, postDataText: ' seconds' }, newChannel.rateLimitPerUser);
                changes.set({ name: 'User Limit: ', data: oldChannel.userLimit, postDataText: '' }, newChannel.userLimit);
                for (const change of changes) {
                    if (change[0].data != change[1]) {
                        changesString += `- ${change[0].name}${change[0].data}${change[0].postDataText} >> ${change[1]}${change[0].postDataText}\n`;
                    }
                }
            }
        }

        if (oldChannel.permissionOverwrites != newChannel.permissionOverwrites) {
            for (const key of oldChannel.permissionOverwrites.cache.keys()) {
                if (
                    !oldChannel.permissionOverwrites.resolve(key) ||
                    !newChannel.permissionOverwrites.resolve(key) ||
                    oldChannel.permissionOverwrites.resolve(key).allow.bitfield != newChannel.permissionOverwrites.resolve(key).allow.bitfield ||
                    oldChannel.permissionOverwrites.resolve(key).deny.bitfield != newChannel.permissionOverwrites.resolve(key).deny.bitfield
                ) {
                    let roleName: Role | User = await oldChannel.guild.roles.fetch(key);

                    if (roleName == null) {
                        roleName = await client.users.fetch(key);
                    }

                    changesString += `*${roleName}:*\n`;

                    if (!oldChannel.permissionOverwrites.resolve(key)) {
                        const newAllows = newChannel.permissionOverwrites.resolve(key).allow.toArray();
                        const newDenys = newChannel.permissionOverwrites.resolve(key).deny.toArray();

                        for (const key2 of newAllows) {
                            changesString += `- ${key2}: <:NeutralTick:1295215969513377802> >> <:GreenTick:1295216311739351070>\n`;
                        }

                        for (const key2 of newDenys) {
                            changesString += `- ${key2}: <:NeutralTick:1295215969513377802> >> <:RedTick:1295216312603250730>\n`;
                        }
                    } else if (!newChannel.permissionOverwrites.resolve(key)) {
                        const oldAllows = oldChannel.permissionOverwrites.resolve(key).allow.toArray();
                        const oldDenys = oldChannel.permissionOverwrites.resolve(key).deny.toArray();

                        for (const key2 of oldAllows) {
                            changesString += `- ${key2}: <:GreenTick:1295216311739351070> >> <:NeutralTick:1295215969513377802>\n`;
                        }

                        for (const key2 of oldDenys) {
                            changesString += `- ${key2}: <:RedTick:1295216312603250730> >> <:NeutralTick:1295215969513377802>\n`;
                        }
                    } else {
                        const oldAllows = oldChannel.permissionOverwrites.resolve(key).allow.toArray();
                        const newAllows = newChannel.permissionOverwrites.resolve(key).allow.toArray();
                        const oldDenys = oldChannel.permissionOverwrites.resolve(key).deny.toArray();
                        const newDenys = newChannel.permissionOverwrites.resolve(key).deny.toArray();

                        const oldAllowsOnly = oldAllows.filter((value) => !newAllows.includes(value));
                        const newAllowsOnly = newAllows.filter((value) => !oldAllows.includes(value));
                        const oldDenysOnly = oldDenys.filter((value) => !newDenys.includes(value));
                        const newDenysOnly = newDenys.filter((value) => !oldDenys.includes(value));

                        for (const key2 of newAllowsOnly) {
                            if (oldDenysOnly.includes(key2)) {
                                changesString += `- ${key2}: <:RedTick:1295216312603250730> >> <:GreenTick:1295216311739351070>\n`;
                            } else {
                                changesString += `- ${key2}: <:NeutralTick:1295215969513377802> >> <:GreenTick:1295216311739351070>\n`;
                            }
                        }

                        for (const key2 of oldAllowsOnly) {
                            if (!newDenysOnly.includes(key2)) {
                                changesString += `- ${key2}: <:GreenTick:1295216311739351070> >> <:NeutralTick:1295215969513377802>\n`;
                            }
                        }

                        for (const key2 of newDenysOnly) {
                            if (oldAllowsOnly.includes(key2)) {
                                changesString += `- ${key2}: <:GreenTick:1295216311739351070> >> <:RedTick:1295216312603250730>\n`;
                            } else {
                                changesString += `- ${key2}: <:NeutralTick:1295215969513377802> >> <:RedTick:1295216312603250730>\n`;
                            }
                        }

                        for (const key2 of oldDenysOnly) {
                            if (!newAllowsOnly.includes(key2)) {
                                changesString += `- ${key2}: <:RedTick:1295216312603250730> >> <:NeutralTick:1295215969513377802>\n`;
                            }
                        }
                    }
                }
            }
        }

        if (auditLogFetch.entries.first()) {
            fieldsOut.push({
                name: '**User Name:**',
                value: auditLog.executor.username,
                inline: true,
            });
            fieldsOut.push({
                name: '**Chanel Name:**',
                value: newChannel.name,
                inline: true,
            });
            fieldsOut.push({
                name: '**Changes:**',
                value: changesString,
                inline: true,
            });
            fieldsOut.push({
                name: '**User Mention:**',
                value: `${auditLog.executor}`,
                inline: true,
            });
            fieldsOut.push({
                name: '**Channel Mention:**',
                value: `${newChannel}`,
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
                value: newChannel.id,
                inline: true,
            });
            fieldsOut.push({
                name: ' ',
                value: ' ',
                inline: true,
            });
        } else {
            fieldsOut.push({
                name: '**Chanel Name:**',
                value: newChannel.name,
                inline: true,
            });
            fieldsOut.push({
                name: '**Old Assigned:**',
                value: changesString,
                inline: true,
            });
            fieldsOut.push({
                name: ' ',
                value: ' ',
                inline: true,
            });
            fieldsOut.push({
                name: '**Channel Mention:**',
                value: `${newChannel}`,
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
                value: newChannel.id,
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

        if (changesString != '') {
            const embMsg = new EmbedBuilder().setColor('#0000ff').setThumbnail(newChannel.guild.iconURL()).setTitle(`Channel Changed`).setFields(fieldsOut).setTimestamp();
            logChannel.send({ embeds: [embMsg] });
        }
    });
    //#endregion

    console.log('... OK');
}
//#endregion

//#region User Logging
/**
 * This function handles logging User events
 * @param client - Discord.js Client
 */
async function logUserUpdate(client: Client) {
    //#region User Update
    client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
        const serverConfig = await MongooseServerConfig.findById(oldMember.guild.id);

        // check the server config and see if they have logging turned on
        // is the bot setup on the server?
        if (serverConfig.setupNeeded) {
            return;
        }

        // is logging turned on?
        if (!serverConfig.logging.enable || !serverConfig.logging.user.enable) {
            return;
        }

        // is logging channel defined?
        if (serverConfig.logging.user.loggingChannel == 'Not Set Up') {
            addToLog(LogType.FatalError, 'logMessageUpdate-delete', 'null', oldMember.guild.name, 'null', 'The logging output channel is not setup.', client);
            return;
        }

        let auditLogFetch: GuildAuditLogs<AuditLogEvent.MemberUpdate> | GuildAuditLogs<AuditLogEvent.MemberRoleUpdate> = await oldMember.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.MemberUpdate,
        }); // Fetching the audit logs.
        const logChannel = await client.channels.fetch(serverConfig.logging.user.loggingChannel);

        if (!auditLogFetch.entries.first() || auditLogFetch.entries.first().targetId != oldMember.user.id) {
            auditLogFetch = await oldMember.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.MemberRoleUpdate }); // Fetching the audit logs.
        }

        const auditLog = auditLogFetch.entries.first();

        if (!logChannel.isTextBased() || logChannel.isDMBased()) {
            return;
        }

        let changes: string = '';
        const oldRoles = new Collection<string, Role>();
        const newRoles = new Collection<string, Role>();

        if (oldMember.nickname != newMember.nickname) {
            changes += '- Nickname: ';
            if (!oldMember.nickname) {
                changes += `${oldMember.user.displayName} >> ${newMember.nickname}`;
            } else if (!newMember.nickname) {
                changes += `${oldMember.nickname} >> ${newMember.user.displayName}`;
            } else {
                changes += `${oldMember.nickname} >> ${newMember.nickname}`;
            }

            changes += '\n';
        }

        for (const [id, role] of oldMember.roles.cache) {
            oldRoles.set(id, role);
        }

        for (const [id, role] of newMember.roles.cache) {
            newRoles.set(id, role);
        }

        let roleChanged = false;

        for (const [id, role] of oldRoles) {
            if (!newRoles.has(id)) {
                if (!roleChanged) {
                    changes += '- Roles:\n';
                }
                roleChanged = true;
                changes += `    - ${role}: <:GreenTick:1295216311739351070> >> <:RedTick:1295216312603250730>\n`;
            }
        }

        for (const [id, role] of newRoles) {
            if (!oldRoles.has(id)) {
                if (!roleChanged) {
                    changes += '- Roles:\n';
                }
                roleChanged = true;
                changes += `    - ${role}: <:RedTick:1295216312603250730> >> <:GreenTick:1295216311739351070>\n`;
            }
        }

        const fieldsOut: { name: string; value: string; inline: boolean }[] = [];

        if (auditLogFetch.entries.first() && auditLog.targetId == oldMember.user.id && changes != '') {
            fieldsOut.push({
                name: '**Changed By Username:**',
                value: auditLog.executor.username,
                inline: true,
            });
            fieldsOut.push({
                name: '**Changed Username:**',
                value: newMember.user.username,
                inline: true,
            });
            fieldsOut.push({
                name: '**Changes:**',
                value: changes,
                inline: true,
            });
            fieldsOut.push({
                name: '**Changed By Mention:**',
                value: `${auditLog.executor}`,
                inline: true,
            });
            fieldsOut.push({
                name: '**Changed Mention:**',
                value: `${newMember}`,
                inline: true,
            });
            fieldsOut.push({
                name: ' ',
                value: ' ',
                inline: true,
            });
            fieldsOut.push({
                name: '**Changed By User ID:**',
                value: auditLog.executor.id,
                inline: true,
            });
            fieldsOut.push({
                name: '**Changed User ID:**',
                value: newMember.user.id,
                inline: true,
            });
            fieldsOut.push({
                name: ' ',
                value: ' ',
                inline: true,
            });
        } else if (changes != '') {
            fieldsOut.push({
                name: '**Changed Username:**',
                value: newMember.user.username,
                inline: true,
            });
            fieldsOut.push({
                name: ' ',
                value: ' ',
                inline: true,
            });
            fieldsOut.push({
                name: '**Changes:**',
                value: changes,
                inline: true,
            });
            fieldsOut.push({
                name: '**Changed Mention:**',
                value: `${newMember}`,
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
                name: '**Changed User ID:**',
                value: newMember.user.id,
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

        const embMsg = new EmbedBuilder().setColor('#0000ff').setThumbnail(newMember.user.avatarURL()).setTitle(`Member Changed`).setFields(fieldsOut).setTimestamp();
        logChannel.send({ embeds: [embMsg] });
    });
    //#endregion

    //#region User Leaving
    client.on(Events.GuildMemberRemove, async (member) => {
        const serverConfig = await MongooseServerConfig.findById(member.guild.id);

        // check the server config and see if they have logging turned on
        // is the bot setup on the server?
        if (serverConfig.setupNeeded) {
            return;
        }

        // is logging turned on?
        if (!serverConfig.logging.enable || !serverConfig.logging.user.enable) {
            return;
        }

        // is logging channel defined?
        if (serverConfig.logging.user.loggingChannel == 'Not Set Up') {
            addToLog(LogType.FatalError, 'logMessageUpdate-delete', 'null', member.guild.name, 'null', 'The logging output channel is not setup.', client);
            return;
        }

        const logChannel = await client.channels.fetch(serverConfig.logging.user.loggingChannel);

        if (!logChannel.isTextBased() || logChannel.isDMBased()) {
            return;
        }

        const fieldsOut: { name: string; value: string; inline: boolean }[] = [];

        let totalSeconds = Math.round((Date.now() - member.joinedTimestamp) / 1000);
        const years = Math.floor(totalSeconds / 31556926);
        totalSeconds -= years * 31556926;
        const months = Math.floor(totalSeconds / 2629743);
        totalSeconds -= months * 2629743;
        const days = Math.floor(totalSeconds / 86400);
        totalSeconds -= days * 86400;
        const hours = Math.floor(totalSeconds / 3600);
        totalSeconds -= hours * 3600;
        const minuets = Math.floor(totalSeconds / 60);
        totalSeconds -= minuets * 60;
        const memberLength = `${years} years, ${months} months, ${days} days, ${hours} hours, ${minuets} minuets, ${totalSeconds} seconds`;

        fieldsOut.push({
            name: '**User Name:**',
            value: member.user.username,
            inline: true,
        });
        fieldsOut.push({
            name: '**User Mention:**',
            value: `${member}`,
            inline: true,
        });
        fieldsOut.push({
            name: '**User ID:**',
            value: member.user.id,
            inline: true,
        });
        fieldsOut.push({
            name: '**Join Date:**',
            value: `<t:${Math.round(member.joinedTimestamp / 1000)}>`,
            inline: true,
        });
        fieldsOut.push({
            name: '**Left Date:**',
            value: `<t:${Math.round(Date.now() / 1000)}>`,
            inline: true,
        });
        fieldsOut.push({
            name: '**Member Length:**',
            value: memberLength,
            inline: true,
        });

        const embMsg = new EmbedBuilder()
            .setColor('#ff0000')
            .setThumbnail(`https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}`)
            .setTitle(`User Left`)
            .setFields(fieldsOut)
            .setTimestamp();
        logChannel.send({ embeds: [embMsg] });
    });
    //#endregion

    console.log('... OK');
}
//#endregion

export { logAdminUpdate, logMessageUpdate, logVoiceUpdate, logUserUpdate };
