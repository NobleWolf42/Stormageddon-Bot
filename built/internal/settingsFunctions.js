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
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelSelectMenuBuilder, ChannelType, EmbedBuilder, GuildMember, LabelBuilder, ModalBuilder, PermissionFlagsBits, RoleSelectMenuBuilder, TextInputBuilder, TextInputStyle, UserSelectMenuBuilder, } from 'discord.js';
import { MongooseServerConfig } from '../models/serverConfigModel.js';
//#endregion
//#region Initial Setup
//Defining a filter for the setup commands to ignore bot messages
const msgFilter = (m) => !m.author.bot;
//Defining some buttons used in all the setup functions
const enableButton = new ButtonBuilder().setCustomId('enable').setLabel('Enable').setStyle(ButtonStyle.Primary);
const disableButton = new ButtonBuilder().setCustomId('disable').setLabel('Disable').setStyle(ButtonStyle.Danger);
const enableDisableButtons = new ActionRowBuilder().addComponents(enableButton, disableButton);
//#endregion
//#region ModMail settings
/**
 * This function runs the setup for the ModMail feature.
 * @param message - Discord.js Message Object
 * @param serverConfig - serverConfig from the server running the command
 */
function setModMail(message, serverConfig) {
    return __awaiter(this, void 0, void 0, function* () {
        const channel = message.channel;
        if (channel.isDMBased()) {
            return;
        }
        const serverID = message.guild.id;
        const embMsg1 = new EmbedBuilder().setTitle('ModMail Setup').setDescription('Select Enable To Turn this Feature on, Disable to Leave it off.').setColor('#F5820F');
        const ModMailSetUpMessage = yield channel.send({ embeds: [embMsg1], components: [enableDisableButtons] });
        yield ModMailSetUpMessage.awaitMessageComponent().then((interaction) => __awaiter(this, void 0, void 0, function* () {
            if (!interaction.inGuild() || !(interaction.member instanceof GuildMember)) {
                return;
            }
            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                return;
            }
            switch (interaction.customId) {
                case 'enable': {
                    ModMailSetUpMessage.edit({ components: [] });
                    serverConfig.modMail.enable = true;
                    const embMsg1 = new EmbedBuilder().setTitle('ModMail Setup').setDescription('Would you like to add to existing mods, or replace current mods?').setColor('#F5820F');
                    const addModsButton = new ButtonBuilder().setCustomId('addMods').setLabel('Add Mods').setStyle(ButtonStyle.Primary);
                    const replaceModsButton = new ButtonBuilder().setCustomId('replaceMods').setLabel('Replace Mods').setStyle(ButtonStyle.Danger);
                    const addReplaceModsMessage = yield channel.send({ embeds: [embMsg1], components: [new ActionRowBuilder().addComponents(addModsButton, replaceModsButton)] });
                    yield addReplaceModsMessage.awaitMessageComponent().then((interaction) => __awaiter(this, void 0, void 0, function* () {
                        if (!interaction.inGuild() || !(interaction.member instanceof GuildMember)) {
                            return;
                        }
                        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                            return;
                        }
                        switch (interaction.customId) {
                            case 'addMods': {
                                addReplaceModsMessage.edit({ components: [] });
                                break;
                            }
                            case 'replaceMods': {
                                addReplaceModsMessage.edit({ components: [] });
                                serverConfig.modMail.modList = [];
                                break;
                            }
                        }
                    }));
                    const embMsg3 = new EmbedBuilder().setTitle('ModMail Setup').setDescription('Select up to 25 users to receive mod mail.').setColor('#F5820F');
                    const userMenu = new UserSelectMenuBuilder().setCustomId('modMailUsers').setMinValues(1).setMaxValues(25);
                    const ModMailUserMessage = yield channel.send({ embeds: [embMsg3], components: [new ActionRowBuilder().addComponents(userMenu)] });
                    yield ModMailUserMessage.awaitMessageComponent().then((interaction) => __awaiter(this, void 0, void 0, function* () {
                        if (!interaction.inGuild() || !(interaction.member instanceof GuildMember)) {
                            return;
                        }
                        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                            return;
                        }
                        if (interaction.customId != 'modMailUsers') {
                            return;
                        }
                        ModMailUserMessage.edit({ components: [] });
                        for (const id of interaction.values) {
                            serverConfig.modMail.modList.push(id);
                        }
                    }));
                    break;
                }
                case 'disable': {
                    ModMailSetUpMessage.edit({ components: [] });
                    serverConfig.modMail.enable = false;
                    serverConfig.modMail.modList = [];
                    break;
                }
            }
        }));
        yield buildConfigFile(serverConfig, serverID);
        const embMsg4 = new EmbedBuilder().setTitle('ModMail Setup').setDescription('ModMail Setup Complete!').setColor('#355E3B');
        channel.send({ embeds: [embMsg4] });
    });
}
//#endregion
//#region AutoRole settings
/**
 * This function runs the setup for the AutoRole feature.
 * @param message - Discord.js Message Object
 * @param serverConfig - serverConfig from the server running the command
 * @param client - Discord.js Client
 */
function setAutoRole(message, serverConfig, client) {
    return __awaiter(this, void 0, void 0, function* () {
        const channel = message.channel;
        if (channel.isDMBased()) {
            return;
        }
        channel.send('Example Message:');
        const embMsg = new EmbedBuilder()
            .setTitle('Role Message')
            .setDescription('**React to the messages below to receive the associated role.**')
            .setColor('#FFFF00')
            .setFooter({ text: `If you do not receive the role try reacting again.`, iconURL: null });
        channel.send({ embeds: [embMsg] });
        const serverID = message.guild.id;
        const embMsg1 = new EmbedBuilder().setTitle('AutoRole Setup').setDescription('Select Enable To Turn this Feature on, Disable to Leave it off.').setColor('#F5820F');
        const AutoRoleSetUpMessage = yield channel.send({ embeds: [embMsg1], components: [enableDisableButtons] });
        yield AutoRoleSetUpMessage.awaitMessageComponent().then((interaction) => __awaiter(this, void 0, void 0, function* () {
            if (!interaction.inGuild() || !(interaction.member instanceof GuildMember)) {
                return;
            }
            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                return;
            }
            switch (interaction.customId) {
                case 'enable': {
                    AutoRoleSetUpMessage.edit({ components: [] });
                    serverConfig.autoRole.enable = true;
                    const autoRoleBody = new TextInputBuilder().setCustomId('autoRoleBody').setValue(serverConfig.autoRole.embedMessage).setStyle(TextInputStyle.Paragraph);
                    const autoRoleFooter = new TextInputBuilder().setCustomId('autoRoleFooter').setValue(serverConfig.autoRole.embedFooter).setStyle(TextInputStyle.Short);
                    const autoRoleBodyInput = new LabelBuilder().setLabel('Input Role Message:').setTextInputComponent(autoRoleBody);
                    const autoRoleFooterInput = new LabelBuilder().setLabel('Input Footer for Role Message:').setTextInputComponent(autoRoleFooter);
                    const autoRoleModal = new ModalBuilder().setCustomId('autoRoleModal').setTitle('AutoRole SetUp - Message Content').addLabelComponents(autoRoleBodyInput, autoRoleFooterInput);
                    yield interaction.showModal(autoRoleModal);
                    yield interaction.awaitModalSubmit({ time: 300000 }).then((interaction) => __awaiter(this, void 0, void 0, function* () {
                        if (!interaction.inGuild() || !(interaction.member instanceof GuildMember)) {
                            return;
                        }
                        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                            return;
                        }
                        if (interaction.customId != 'autoRoleModal') {
                            return;
                        }
                        serverConfig.autoRole.embedMessage = interaction.fields.getField('autoRoleBody').value;
                        serverConfig.autoRole.embedFooter = interaction.fields.getField('autoRoleFooter').value;
                        interaction.deferReply();
                        interaction.deleteReply();
                        const embMsg2 = new EmbedBuilder()
                            .setTitle('AutoRole Setup')
                            .setDescription('Would you like to have a thumbnail in the react message? (Shown in this message.)')
                            .setThumbnail(client.user.avatarURL())
                            .setColor('#F5820F');
                        const autoRoleThumbnailMessage = yield channel.send({ embeds: [embMsg2], components: [enableDisableButtons] });
                        yield autoRoleThumbnailMessage.awaitMessageComponent().then((interaction) => __awaiter(this, void 0, void 0, function* () {
                            if (!interaction.inGuild() || !(interaction.member instanceof GuildMember)) {
                                return;
                            }
                            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                                return;
                            }
                            autoRoleThumbnailMessage.edit({ components: [] });
                            switch (interaction.customId) {
                                case 'enable':
                                    {
                                        serverConfig.autoRole.embedThumbnail.enable = true;
                                        const autoRoleThumbnailURL = new TextInputBuilder().setCustomId('autoRoleThumbnailURL').setRequired(false).setStyle(TextInputStyle.Short);
                                        const thumbnailURLField = new LabelBuilder().setLabel('Input URL below. Blank=Server Profile Image.').setTextInputComponent(autoRoleThumbnailURL);
                                        const thumbnailModal = new ModalBuilder().setCustomId('thumbnailModal').setTitle('AutoRole SetUp - Thumbnail').addLabelComponents(thumbnailURLField);
                                        yield interaction.showModal(thumbnailModal);
                                        yield interaction.awaitModalSubmit({ time: 300000 }).then((interaction) => __awaiter(this, void 0, void 0, function* () {
                                            if (!interaction.inGuild() || !(interaction.member instanceof GuildMember)) {
                                                return;
                                            }
                                            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                                                return;
                                            }
                                            if (interaction.customId != 'thumbnailModal') {
                                                return;
                                            }
                                            serverConfig.autoRole.embedThumbnail.url = interaction.fields.getField('autoRoleThumbnailURL').value;
                                            interaction.deferReply();
                                            interaction.deleteReply();
                                        }));
                                    }
                                    break;
                                case 'disable':
                                    {
                                        serverConfig.autoRole.embedThumbnail.enable = false;
                                    }
                                    break;
                            }
                            const embMsg3 = new EmbedBuilder().setTitle('AutoRole Setup').setDescription('Would you like to add to existing roles, or replace current roles?').setColor('#F5820F');
                            const addRolesButton = new ButtonBuilder().setCustomId('addRoles').setLabel('Add Roles').setStyle(ButtonStyle.Primary);
                            const replaceRolesButton = new ButtonBuilder().setCustomId('replaceRoles').setLabel('Replace Roles').setStyle(ButtonStyle.Danger);
                            const addReplaceRolesMessage = yield channel.send({ embeds: [embMsg3], components: [new ActionRowBuilder().addComponents(addRolesButton, replaceRolesButton)] });
                            yield addReplaceRolesMessage.awaitMessageComponent().then((interaction) => __awaiter(this, void 0, void 0, function* () {
                                if (!interaction.inGuild() || !(interaction.member instanceof GuildMember)) {
                                    return;
                                }
                                if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                                    return;
                                }
                                switch (interaction.customId) {
                                    case 'addRoles': {
                                        addReplaceRolesMessage.edit({ components: [] });
                                        break;
                                    }
                                    case 'replaceRoles': {
                                        addReplaceRolesMessage.edit({ components: [] });
                                        serverConfig.autoRole.roles = [];
                                        break;
                                    }
                                }
                            }));
                            const autoRoleRoles = new RoleSelectMenuBuilder().setCustomId('autoRoleRoles').setMaxValues(25);
                            const embMsg4 = new EmbedBuilder().setTitle('AutoRole Setup').setDescription('Choose the roles you would like to be managed by the bot.').setColor('#F5820F');
                            let moreRoles = true;
                            while (moreRoles) {
                                const addRolesMessage = yield channel.send({ embeds: [embMsg4], components: [new ActionRowBuilder().addComponents(autoRoleRoles)] });
                                yield addRolesMessage.awaitMessageComponent().then((interaction) => __awaiter(this, void 0, void 0, function* () {
                                    if (!interaction.inGuild() || !(interaction.member instanceof GuildMember)) {
                                        return;
                                    }
                                    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                                        return;
                                    }
                                    if (interaction.customId != 'autoRoleRoles') {
                                        return;
                                    }
                                    addRolesMessage.edit({ components: [] });
                                    for (const id of interaction.values) {
                                        if (!serverConfig.autoRole.roles.includes(id)) {
                                            serverConfig.autoRole.roles.push(id);
                                        }
                                    }
                                    const embMsg5 = new EmbedBuilder().setTitle('AutoRole Setup').setDescription('Would you like to add more roles?').setColor('#F5820F');
                                    const yesButton = new ButtonBuilder().setCustomId('yes').setLabel('Yes').setStyle(ButtonStyle.Primary);
                                    const noButton = new ButtonBuilder().setCustomId('no').setLabel('No').setStyle(ButtonStyle.Danger);
                                    const moreRolesMessage = yield channel.send({ embeds: [embMsg5], components: [new ActionRowBuilder().addComponents(yesButton, noButton)] });
                                    yield moreRolesMessage.awaitMessageComponent().then((interaction) => __awaiter(this, void 0, void 0, function* () {
                                        if (!interaction.inGuild() || !(interaction.member instanceof GuildMember)) {
                                            return;
                                        }
                                        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                                            return;
                                        }
                                        moreRolesMessage.edit({ components: [] });
                                        switch (interaction.customId) {
                                            case 'yes':
                                                break;
                                            case 'no':
                                                moreRoles = false;
                                                break;
                                        }
                                    }));
                                }));
                            }
                            for (const id of serverConfig.autoRole.roles) {
                                channel.send(`\`${(yield client.guilds.fetch(channel.guildId)).roles.resolve(id).name}\``);
                            }
                            channel.send('Please respond to this message with the list of reactions you want to be used for the roles above, matching their order. Format the list with spaces separating the reactions, like this: `🐕 🎩 👾`. (NOTE: You can use custom reactions as long as they are not animated and belong to this server)');
                            try {
                                const embedReactIn = yield channel.awaitMessages({ filter: msgFilter, max: 1, time: 300000, errors: ['time'] });
                                const reactions = embedReactIn.first().content.split(' ');
                                serverConfig.autoRole.reactions = reactions;
                            }
                            catch (err) {
                                console.log(err.message);
                            }
                        }));
                    }));
                    break;
                }
                case 'disable': {
                    AutoRoleSetUpMessage.edit({ components: [] });
                    serverConfig.autoRole.enable = false;
                    serverConfig.autoRole.embedFooter = 'Not Set Up';
                    serverConfig.autoRole.embedMessage = 'Not Set Up';
                    serverConfig.autoRole.embedThumbnail.url = 'Not Set Up';
                    serverConfig.autoRole.embedThumbnail.enable = false;
                    serverConfig.autoRole.reactions = [];
                    serverConfig.autoRole.roles = [];
                    break;
                }
            }
        }));
        yield buildConfigFile(serverConfig, serverID);
        const embMsg6 = new EmbedBuilder().setTitle('AutoRole Setup').setDescription('AutoRole Setup Complete!').setColor('#355E3B');
        channel.send({ embeds: [embMsg6] });
    });
}
//#endregion
//#region joinRole settings
/**
 * This function runs the setup for the JoinRole feature.
 * @param message - Discord.js Message Object
 * @param serverConfig - serverConfig from the server running the command
 */
function setJoinRole(message, serverConfig) {
    return __awaiter(this, void 0, void 0, function* () {
        const channel = message.channel;
        if (channel.isDMBased()) {
            return;
        }
        const serverID = message.guild.id;
        const embMsg1 = new EmbedBuilder().setTitle('JoinRole Setup').setDescription('Select Enable To Turn this Feature on, Disable to Leave it off.').setColor('#F5820F');
        const JoinRoleSetUpMessage = yield channel.send({ embeds: [embMsg1], components: [enableDisableButtons] });
        yield JoinRoleSetUpMessage.awaitMessageComponent().then((interaction) => __awaiter(this, void 0, void 0, function* () {
            if (!interaction.inGuild() || !(interaction.member instanceof GuildMember)) {
                return;
            }
            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                return;
            }
            switch (interaction.customId) {
                case 'enable': {
                    JoinRoleSetUpMessage.edit({ components: [] });
                    serverConfig.joinRole.enable = true;
                    const embMsg2 = new EmbedBuilder().setTitle('JoinRole Setup').setDescription('Select a role to give upon joining the server.').setColor('#F5820F');
                    const roleMenu = new RoleSelectMenuBuilder().setCustomId('joinRoleRole').setMinValues(1).setMaxValues(1);
                    const JoinRoleRoleMessage = yield channel.send({ embeds: [embMsg2], components: [new ActionRowBuilder().addComponents(roleMenu)] });
                    yield JoinRoleRoleMessage.awaitMessageComponent().then((interaction) => __awaiter(this, void 0, void 0, function* () {
                        if (!interaction.inGuild() || !(interaction.member instanceof GuildMember)) {
                            return;
                        }
                        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                            return;
                        }
                        if (interaction.customId != 'joinRoleRole') {
                            return;
                        }
                        JoinRoleRoleMessage.edit({ components: [] });
                        serverConfig.joinRole.role = interaction.values[0];
                    }));
                    break;
                }
                case 'disable': {
                    JoinRoleSetUpMessage.edit({ components: [] });
                    serverConfig.joinRole.enable = false;
                    serverConfig.joinRole.role = 'Not Set Up';
                    break;
                }
            }
        }));
        yield buildConfigFile(serverConfig, serverID);
        const embMsg3 = new EmbedBuilder().setTitle('JoinRole Setup').setDescription('JoinRole Setup Complete!').setColor('#355E3B');
        channel.send({ embeds: [embMsg3] });
    });
}
//#endregion
//#region JoinToCreateVC settings
/**
 * This function runs the setup for the joinToCreateVC feature.
 * @param message - Discord.js Message Object
 * @param serverConfig - serverConfig from the server running the command
 */
function setJoinToCreateVC(message, serverConfig) {
    return __awaiter(this, void 0, void 0, function* () {
        const channel = message.channel;
        if (channel.isDMBased()) {
            return;
        }
        const serverID = message.guild.id;
        const embMsg1 = new EmbedBuilder().setTitle('Join to Create Voice Channel Setup').setDescription('Select Enable To Turn this Feature on, Disable to Leave it off.').setColor('#F5820F');
        const JTCVCSetUpMessage = yield channel.send({ embeds: [embMsg1], components: [enableDisableButtons] });
        yield JTCVCSetUpMessage.awaitMessageComponent().then((interaction) => __awaiter(this, void 0, void 0, function* () {
            if (!interaction.inGuild() || !(interaction.member instanceof GuildMember)) {
                return;
            }
            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                return;
            }
            switch (interaction.customId) {
                case 'enable': {
                    JTCVCSetUpMessage.edit({ components: [] });
                    serverConfig.JTCVC.enable = true;
                    const embMsg2 = new EmbedBuilder()
                        .setTitle('Join to Create Voice Channel Setup')
                        .setDescription('Select a channel to join for the bot to create a new voice channel.')
                        .setColor('#F5820F');
                    const channelMenu = new ChannelSelectMenuBuilder().setCustomId('JTVCChannel').setMinValues(1).setMaxValues(1).setChannelTypes(ChannelType.GuildVoice);
                    const JTCVCChannelMessage = yield channel.send({ embeds: [embMsg2], components: [new ActionRowBuilder().addComponents(channelMenu)] });
                    yield JTCVCChannelMessage.awaitMessageComponent().then((interaction) => __awaiter(this, void 0, void 0, function* () {
                        if (!interaction.inGuild() || !(interaction.member instanceof GuildMember)) {
                            return;
                        }
                        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                            return;
                        }
                        if (interaction.customId != 'JTVCChannel') {
                            return;
                        }
                        JTCVCChannelMessage.edit({ components: [] });
                        serverConfig.JTCVC.voiceChannel = interaction.values[0];
                    }));
                    break;
                }
                case 'disable': {
                    JTCVCSetUpMessage.edit({ components: [] });
                    serverConfig.JTCVC.enable = false;
                    serverConfig.JTCVC.voiceChannel = 'Not Set Up';
                    break;
                }
            }
        }));
        yield buildConfigFile(serverConfig, serverID);
        const embMsg3 = new EmbedBuilder().setTitle('Join to Create Voice Channel Setup').setDescription('Join to Create Voice Channel Setup Complete!').setColor('#355E3B');
        channel.send({ embeds: [embMsg3] });
    });
}
//#endregion
//#region Music settings
/**
 * This function runs the setup for the Music feature.
 * @param message - Discord.js Message Object
 * @param serverConfig - serverConfig from the server running the command
 */
function setMusic(message, serverConfig) {
    return __awaiter(this, void 0, void 0, function* () {
        const channel = message.channel;
        if (channel.isDMBased()) {
            return;
        }
        const serverID = message.guild.id;
        const embMsg1 = new EmbedBuilder().setTitle('Music Setup').setDescription('Select Enable To Turn this Feature on, Disable to Leave it off.').setColor('#F5820F');
        const MusicSetUpMessage = yield channel.send({ embeds: [embMsg1], components: [enableDisableButtons] });
        yield MusicSetUpMessage.awaitMessageComponent().then((interaction) => __awaiter(this, void 0, void 0, function* () {
            if (!interaction.inGuild() || !(interaction.member instanceof GuildMember)) {
                return;
            }
            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                return;
            }
            switch (interaction.customId) {
                case 'enable': {
                    MusicSetUpMessage.edit({ components: [] });
                    serverConfig.music.enable = true;
                    const embMsg2 = new EmbedBuilder().setTitle('Music Setup').setDescription('Select a channel for the music text events.').setColor('#F5820F');
                    const channelMenu = new ChannelSelectMenuBuilder().setCustomId('musicChannel').setMinValues(1).setMaxValues(1).setChannelTypes(ChannelType.GuildText);
                    const musicChannelMessage = yield channel.send({ embeds: [embMsg2], components: [new ActionRowBuilder().addComponents(channelMenu)] });
                    yield musicChannelMessage.awaitMessageComponent().then((interaction) => __awaiter(this, void 0, void 0, function* () {
                        if (!interaction.inGuild() || !(interaction.member instanceof GuildMember)) {
                            return;
                        }
                        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                            return;
                        }
                        if (interaction.customId != 'musicChannel') {
                            return;
                        }
                        musicChannelMessage.edit({ components: [] });
                        serverConfig.music.textChannel = interaction.values[0];
                    }));
                    const embMsg3 = new EmbedBuilder().setTitle('Music Setup').setDescription('Would you like to add to existing roles, or replace current roles?').setColor('#F5820F');
                    const addRolesButton = new ButtonBuilder().setCustomId('addRoles').setLabel('Add Roles').setStyle(ButtonStyle.Primary);
                    const replaceRolesButton = new ButtonBuilder().setCustomId('replaceRoles').setLabel('Replace Roles').setStyle(ButtonStyle.Danger);
                    const addReplaceRolesMessage = yield channel.send({ embeds: [embMsg3], components: [new ActionRowBuilder().addComponents(addRolesButton, replaceRolesButton)] });
                    yield addReplaceRolesMessage.awaitMessageComponent().then((interaction) => __awaiter(this, void 0, void 0, function* () {
                        if (!interaction.inGuild() || !(interaction.member instanceof GuildMember)) {
                            return;
                        }
                        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                            return;
                        }
                        switch (interaction.customId) {
                            case 'addRoles': {
                                addReplaceRolesMessage.edit({ components: [] });
                                break;
                            }
                            case 'replaceRoles': {
                                addReplaceRolesMessage.edit({ components: [] });
                                serverConfig.music.djRoles = [];
                                break;
                            }
                        }
                    }));
                    const embMsg4 = new EmbedBuilder().setTitle('Music Setup').setDescription('Select djRoles.').setColor('#F5820F');
                    const roleMenu = new RoleSelectMenuBuilder().setCustomId('musicRoles').setMinValues(1).setMaxValues(25);
                    const JoinRoleRoleMessage = yield channel.send({ embeds: [embMsg4], components: [new ActionRowBuilder().addComponents(roleMenu)] });
                    yield JoinRoleRoleMessage.awaitMessageComponent().then((interaction) => __awaiter(this, void 0, void 0, function* () {
                        if (!interaction.inGuild() || !(interaction.member instanceof GuildMember)) {
                            return;
                        }
                        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                            return;
                        }
                        if (interaction.customId != 'musicRoles') {
                            return;
                        }
                        JoinRoleRoleMessage.edit({ components: [] });
                        for (const id of interaction.values) {
                            if (!serverConfig.music.djRoles.includes(id)) {
                                serverConfig.music.djRoles.push(id);
                            }
                        }
                    }));
                    break;
                }
                case 'disable': {
                    MusicSetUpMessage.edit({ components: [] });
                    serverConfig.music.enable = false;
                    serverConfig.music.djRoles = [];
                    serverConfig.music.textChannel = 'Not Set Up';
                    break;
                }
            }
        }));
        yield buildConfigFile(serverConfig, serverID);
        const embMsg5 = new EmbedBuilder().setTitle('Music Setup').setDescription('Music Setup Complete!').setColor('#355E3B');
        channel.send({ embeds: [embMsg5] });
    });
}
//#endregion
//#region General settings
/**
 * This function runs the setup for the general features.
 * @param message - Discord.js Message Object
 * @param serverConfig - serverConfig from the server running the command
 */
function setGeneral(message, serverConfig) {
    return __awaiter(this, void 0, void 0, function* () {
        const channel = message.channel;
        if (channel.isDMBased()) {
            return;
        }
        const serverID = message.guild.id;
        const embMsg1 = new EmbedBuilder().setTitle('General Setup').setDescription('Would you like to add to existing roles, or replace current roles? (This is for Bot Admin Roles)').setColor('#F5820F');
        const addRolesButton = new ButtonBuilder().setCustomId('addRoles').setLabel('Add Roles').setStyle(ButtonStyle.Primary);
        const replaceRolesButton = new ButtonBuilder().setCustomId('replaceRoles').setLabel('Replace Roles').setStyle(ButtonStyle.Danger);
        const addReplaceRolesMessage1 = yield channel.send({ embeds: [embMsg1], components: [new ActionRowBuilder().addComponents(addRolesButton, replaceRolesButton)] });
        yield addReplaceRolesMessage1.awaitMessageComponent().then((interaction) => __awaiter(this, void 0, void 0, function* () {
            if (!interaction.inGuild() || !(interaction.member instanceof GuildMember)) {
                return;
            }
            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                return;
            }
            switch (interaction.customId) {
                case 'addRoles': {
                    addReplaceRolesMessage1.edit({ components: [] });
                    break;
                }
                case 'replaceRoles': {
                    addReplaceRolesMessage1.edit({ components: [] });
                    serverConfig.general.adminRoles = [];
                    break;
                }
            }
        }));
        const embMsg2 = new EmbedBuilder().setTitle('General Setup').setDescription('Select roles for Bot Admin.').setColor('#F5820F');
        const roleMenu1 = new RoleSelectMenuBuilder().setCustomId('botAdminRoles').setMinValues(1).setMaxValues(25);
        const botAdminRolesMessage = yield channel.send({ embeds: [embMsg2], components: [new ActionRowBuilder().addComponents(roleMenu1)] });
        yield botAdminRolesMessage.awaitMessageComponent().then((interaction) => __awaiter(this, void 0, void 0, function* () {
            if (!interaction.inGuild() || !(interaction.member instanceof GuildMember)) {
                return;
            }
            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                return;
            }
            if (interaction.customId != 'botAdminRoles') {
                return;
            }
            botAdminRolesMessage.edit({ components: [] });
            for (const id of interaction.values) {
                if (!serverConfig.general.adminRoles.includes(id)) {
                    serverConfig.general.adminRoles.push(id);
                }
            }
        }));
        const embMsg3 = new EmbedBuilder().setTitle('General Setup').setDescription('Would you like to add to existing roles, or replace current roles? (This is for Bot Mod Roles)').setColor('#F5820F');
        const addReplaceRolesMessage2 = yield channel.send({ embeds: [embMsg3], components: [new ActionRowBuilder().addComponents(addRolesButton, replaceRolesButton)] });
        yield addReplaceRolesMessage2.awaitMessageComponent().then((interaction) => __awaiter(this, void 0, void 0, function* () {
            if (!interaction.inGuild() || !(interaction.member instanceof GuildMember)) {
                return;
            }
            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                return;
            }
            switch (interaction.customId) {
                case 'addRoles': {
                    addReplaceRolesMessage2.edit({ components: [] });
                    break;
                }
                case 'replaceRoles': {
                    addReplaceRolesMessage2.edit({ components: [] });
                    serverConfig.general.modRoles = [];
                    break;
                }
            }
        }));
        const embMsg4 = new EmbedBuilder().setTitle('General Setup').setDescription('Select roles for Bot Mod.').setColor('#F5820F');
        const roleMenu2 = new RoleSelectMenuBuilder().setCustomId('botModRoles').setMinValues(1).setMaxValues(25);
        const botModRolesMessage = yield channel.send({ embeds: [embMsg4], components: [new ActionRowBuilder().addComponents(roleMenu2)] });
        yield botModRolesMessage.awaitMessageComponent().then((interaction) => __awaiter(this, void 0, void 0, function* () {
            if (!interaction.inGuild() || !(interaction.member instanceof GuildMember)) {
                return;
            }
            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                return;
            }
            if (interaction.customId != 'botModRoles') {
                return;
            }
            botModRolesMessage.edit({ components: [] });
            for (const id of interaction.values) {
                if (!serverConfig.general.modRoles.includes(id)) {
                    serverConfig.general.modRoles.push(id);
                }
            }
        }));
        yield buildConfigFile(serverConfig, serverID);
        const embMsg5 = new EmbedBuilder().setTitle('General Setup').setDescription('General Setup Complete!').setColor('#355E3B');
        channel.send({ embeds: [embMsg5] });
    });
}
//#endregion
//#region Logging settings
//#region Main set logging
/**
 * This function runs the setup for the logging features.
 * @param message - Discord.js Message Object
 * @param serverConfig - serverConfig from the server running the command
 */
function setLogging(message, serverConfig) {
    return __awaiter(this, void 0, void 0, function* () {
        const channel = message.channel;
        if (channel.isDMBased()) {
            return;
        }
        const serverID = message.guild.id;
        const embMsg1 = new EmbedBuilder().setTitle('Logging Setup').setDescription('Select Enable To Turn this Feature on, Disable to Leave it off.').setColor('#F5820F');
        const LoggingSetUpMessage = yield channel.send({ embeds: [embMsg1], components: [enableDisableButtons] });
        yield LoggingSetUpMessage.awaitMessageComponent().then((interaction) => __awaiter(this, void 0, void 0, function* () {
            if (!interaction.inGuild() || !(interaction.member instanceof GuildMember)) {
                return;
            }
            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                return;
            }
            switch (interaction.customId) {
                case 'enable': {
                    LoggingSetUpMessage.edit({ components: [] });
                    serverConfig.logging.enable = true;
                    yield setLoggingVoice(message, serverConfig);
                    yield setLoggingText(message, serverConfig);
                    yield setLoggingAdmin(message, serverConfig);
                    yield setLoggingUser(message, serverConfig);
                    break;
                }
                case 'disable': {
                    LoggingSetUpMessage.edit({ components: [] });
                    serverConfig.logging.enable = false;
                    serverConfig.logging.voice = { enable: false, loggingChannel: 'Not Set Up', ignoreChannels: [], ignoreCategories: [] };
                    serverConfig.logging.text = { enable: false, loggingChannel: 'Not Set Up', ignoreChannels: [], ignoreCategories: [] };
                    serverConfig.logging.admin = { enable: false, loggingChannel: 'Not Set Up', ignoreChannels: [], ignoreCategories: [] };
                    serverConfig.logging.user = { enable: false, loggingChannel: 'Not Set Up' };
                    break;
                }
            }
        }));
        yield buildConfigFile(serverConfig, serverID);
        const embMsg2 = new EmbedBuilder().setTitle('Logging Setup').setDescription('Logging Setup Complete!').setColor('#355E3B');
        channel.send({ embeds: [embMsg2] });
    });
}
//#endregion
//#region Set voice logging
/**
 * This function runs the setup for the voice logging features.
 * @param message - Discord.js Message Object
 * @param serverConfig - serverConfig from the server running the command
 */
function setLoggingVoice(message, serverConfig) {
    return __awaiter(this, void 0, void 0, function* () {
        const channel = message.channel;
        if (channel.isDMBased()) {
            return;
        }
        const embMsg1 = new EmbedBuilder().setTitle('Voice Logging Setup').setDescription('Select Enable To Turn this Feature on, Disable to Leave it off.').setColor('#F5820F');
        const LoggingVoiceSetUpMessage = yield channel.send({ embeds: [embMsg1], components: [enableDisableButtons] });
        yield LoggingVoiceSetUpMessage.awaitMessageComponent().then((interaction) => __awaiter(this, void 0, void 0, function* () {
            if (!interaction.inGuild() || !(interaction.member instanceof GuildMember)) {
                return;
            }
            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                return;
            }
            switch (interaction.customId) {
                case 'enable': {
                    LoggingVoiceSetUpMessage.edit({ components: [] });
                    serverConfig.logging.voice.enable = true;
                    const embMsg2 = new EmbedBuilder().setTitle('Voice Logging Setup').setDescription('Select a channel for the voice logs.').setColor('#F5820F');
                    const channelMenu = new ChannelSelectMenuBuilder().setCustomId('voiceLoggingChannel').setMinValues(1).setMaxValues(1).setChannelTypes(ChannelType.GuildText);
                    const VoiceLoggingChannelMessage = yield channel.send({ embeds: [embMsg2], components: [new ActionRowBuilder().addComponents(channelMenu)] });
                    yield VoiceLoggingChannelMessage.awaitMessageComponent().then((interaction) => __awaiter(this, void 0, void 0, function* () {
                        if (!interaction.inGuild() || !(interaction.member instanceof GuildMember)) {
                            return;
                        }
                        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                            return;
                        }
                        if (interaction.customId != 'voiceLoggingChannel') {
                            return;
                        }
                        VoiceLoggingChannelMessage.edit({ components: [] });
                        serverConfig.logging.voice.loggingChannel = interaction.values[0];
                    }));
                    break;
                }
                case 'disable': {
                    LoggingVoiceSetUpMessage.edit({ components: [] });
                    serverConfig.logging.voice = { enable: false, loggingChannel: 'Not Set Up', ignoreChannels: [], ignoreCategories: [] };
                    break;
                }
            }
        }));
    });
}
//#endregion
//#region Set text logging
/**
 * This function runs the setup for the text logging features.
 * @param message - Discord.js Message Object
 * @param serverConfig - serverConfig from the server running the command
 */
function setLoggingText(message, serverConfig) {
    return __awaiter(this, void 0, void 0, function* () {
        const channel = message.channel;
        if (channel.isDMBased()) {
            return;
        }
        const embMsg1 = new EmbedBuilder().setTitle('Text Logging Setup').setDescription('Select Enable To Turn this Feature on, Disable to Leave it off.').setColor('#F5820F');
        const LoggingTextSetUpMessage = yield channel.send({ embeds: [embMsg1], components: [enableDisableButtons] });
        yield LoggingTextSetUpMessage.awaitMessageComponent().then((interaction) => __awaiter(this, void 0, void 0, function* () {
            if (!interaction.inGuild() || !(interaction.member instanceof GuildMember)) {
                return;
            }
            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                return;
            }
            switch (interaction.customId) {
                case 'enable': {
                    LoggingTextSetUpMessage.edit({ components: [] });
                    serverConfig.logging.text.enable = true;
                    const embMsg2 = new EmbedBuilder().setTitle('Text Logging Setup').setDescription('Select a channel for the text logs.').setColor('#F5820F');
                    const channelMenu = new ChannelSelectMenuBuilder().setCustomId('textLoggingChannel').setMinValues(1).setMaxValues(1).setChannelTypes(ChannelType.GuildText);
                    const TextLoggingChannelMessage = yield channel.send({ embeds: [embMsg2], components: [new ActionRowBuilder().addComponents(channelMenu)] });
                    yield TextLoggingChannelMessage.awaitMessageComponent().then((interaction) => __awaiter(this, void 0, void 0, function* () {
                        if (!interaction.inGuild() || !(interaction.member instanceof GuildMember)) {
                            return;
                        }
                        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                            return;
                        }
                        if (interaction.customId != 'textLoggingChannel') {
                            return;
                        }
                        TextLoggingChannelMessage.edit({ components: [] });
                        serverConfig.logging.text.loggingChannel = interaction.values[0];
                    }));
                    break;
                }
                case 'disable': {
                    LoggingTextSetUpMessage.edit({ components: [] });
                    serverConfig.logging.text = { enable: false, loggingChannel: 'Not Set Up', ignoreChannels: [], ignoreCategories: [] };
                    break;
                }
            }
        }));
    });
}
//#endregion
//#region Set admin logging
/**
 * This function runs the setup for the admin logging features.
 * @param message - Discord.js Message Object
 * @param serverConfig - serverConfig from the server running the command
 */
function setLoggingAdmin(message, serverConfig) {
    return __awaiter(this, void 0, void 0, function* () {
        const channel = message.channel;
        if (channel.isDMBased()) {
            return;
        }
        const embMsg1 = new EmbedBuilder().setTitle('Admin Logging Setup').setDescription('Select Enable To Turn this Feature on, Disable to Leave it off.').setColor('#F5820F');
        const LoggingAdminSetUpMessage = yield channel.send({ embeds: [embMsg1], components: [enableDisableButtons] });
        yield LoggingAdminSetUpMessage.awaitMessageComponent().then((interaction) => __awaiter(this, void 0, void 0, function* () {
            if (!interaction.inGuild() || !(interaction.member instanceof GuildMember)) {
                return;
            }
            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                return;
            }
            switch (interaction.customId) {
                case 'enable': {
                    LoggingAdminSetUpMessage.edit({ components: [] });
                    serverConfig.logging.admin.enable = true;
                    const embMsg2 = new EmbedBuilder().setTitle('Admin Logging Setup').setDescription('Select a channel for the admin logs.').setColor('#F5820F');
                    const channelMenu = new ChannelSelectMenuBuilder().setCustomId('adminLoggingChannel').setMinValues(1).setMaxValues(1).setChannelTypes(ChannelType.GuildText);
                    const AdminLoggingChannelMessage = yield channel.send({ embeds: [embMsg2], components: [new ActionRowBuilder().addComponents(channelMenu)] });
                    yield AdminLoggingChannelMessage.awaitMessageComponent().then((interaction) => __awaiter(this, void 0, void 0, function* () {
                        if (!interaction.inGuild() || !(interaction.member instanceof GuildMember)) {
                            return;
                        }
                        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                            return;
                        }
                        if (interaction.customId != 'adminLoggingChannel') {
                            return;
                        }
                        AdminLoggingChannelMessage.edit({ components: [] });
                        serverConfig.logging.admin.loggingChannel = interaction.values[0];
                    }));
                    break;
                }
                case 'disable': {
                    LoggingAdminSetUpMessage.edit({ components: [] });
                    serverConfig.logging.admin = { enable: false, loggingChannel: 'Not Set Up', ignoreChannels: [], ignoreCategories: [] };
                    break;
                }
            }
        }));
    });
}
//#endregion
//#region Set user logging
/**
 * This function runs the setup for the user logging features.
 * @param message - Discord.js Message Object
 * @param serverConfig - serverConfig from the server running the command
 */
function setLoggingUser(message, serverConfig) {
    return __awaiter(this, void 0, void 0, function* () {
        const channel = message.channel;
        if (channel.isDMBased()) {
            return;
        }
        const embMsg1 = new EmbedBuilder().setTitle('User Logging Setup').setDescription('Select Enable To Turn this Feature on, Disable to Leave it off.').setColor('#F5820F');
        const LoggingUserSetUpMessage = yield channel.send({ embeds: [embMsg1], components: [enableDisableButtons] });
        yield LoggingUserSetUpMessage.awaitMessageComponent().then((interaction) => __awaiter(this, void 0, void 0, function* () {
            if (!interaction.inGuild() || !(interaction.member instanceof GuildMember)) {
                return;
            }
            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                return;
            }
            switch (interaction.customId) {
                case 'enable': {
                    LoggingUserSetUpMessage.edit({ components: [] });
                    serverConfig.logging.user.enable = true;
                    const embMsg2 = new EmbedBuilder().setTitle('User Logging Setup').setDescription('Select a channel for the user logs.').setColor('#F5820F');
                    const channelMenu = new ChannelSelectMenuBuilder().setCustomId('userLoggingChannel').setMinValues(1).setMaxValues(1).setChannelTypes(ChannelType.GuildText);
                    const UserLoggingChannelMessage = yield channel.send({ embeds: [embMsg2], components: [new ActionRowBuilder().addComponents(channelMenu)] });
                    yield UserLoggingChannelMessage.awaitMessageComponent().then((interaction) => __awaiter(this, void 0, void 0, function* () {
                        if (!interaction.inGuild() || !(interaction.member instanceof GuildMember)) {
                            return;
                        }
                        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                            return;
                        }
                        if (interaction.customId != 'userLoggingChannel') {
                            return;
                        }
                        UserLoggingChannelMessage.edit({ components: [] });
                        serverConfig.logging.user.loggingChannel = interaction.values[0];
                    }));
                    break;
                }
                case 'disable': {
                    LoggingUserSetUpMessage.edit({ components: [] });
                    serverConfig.logging.user = { enable: false, loggingChannel: 'Not Set Up' };
                    break;
                }
            }
        }));
    });
}
//#endregion
//#endregion
//#region Blame settings
/**
 * This function runs the setup for the blame features.
 * @param message - Discord.js Message Object
 * @param serverConfig - serverConfig from the server running the command
 */
function setBlame(message, serverConfig) {
    return __awaiter(this, void 0, void 0, function* () {
        const channel = message.channel;
        if (channel.isDMBased()) {
            return;
        }
        const serverID = message.guild.id;
        const embMsg1 = new EmbedBuilder().setTitle('Blame Setup').setDescription('Select Enable To Turn this Feature on, Disable to Leave it off.').setColor('#F5820F');
        const BlameSetUpMessage = yield channel.send({ embeds: [embMsg1], components: [enableDisableButtons] });
        yield BlameSetUpMessage.awaitMessageComponent().then((interaction) => __awaiter(this, void 0, void 0, function* () {
            if (!interaction.inGuild() || !(interaction.member instanceof GuildMember)) {
                return;
            }
            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                return;
            }
            switch (interaction.customId) {
                case 'enable': {
                    BlameSetUpMessage.edit({ components: [] });
                    serverConfig.blame.enable = true;
                    const embMsg2 = new EmbedBuilder().setTitle('Blame Setup').setDescription('Would you like to enable cursing?.').setColor('#F5820F');
                    const BlameCursingMessage = yield channel.send({ embeds: [embMsg2], components: [enableDisableButtons] });
                    yield BlameCursingMessage.awaitMessageComponent().then((interaction) => __awaiter(this, void 0, void 0, function* () {
                        if (!interaction.inGuild() || !(interaction.member instanceof GuildMember)) {
                            return;
                        }
                        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                            return;
                        }
                        switch (interaction.customId) {
                            case 'enable': {
                                BlameCursingMessage.edit({ components: [] });
                                serverConfig.blame.cursing = true;
                                break;
                            }
                            case 'disable': {
                                BlameCursingMessage.edit({ components: [] });
                                serverConfig.blame.cursing = false;
                                break;
                            }
                        }
                    }));
                    break;
                }
                case 'disable': {
                    BlameSetUpMessage.edit({ components: [] });
                    serverConfig.blame.enable = false;
                    serverConfig.blame.cursing = false;
                    serverConfig.blame.offset = 0;
                    serverConfig.blame.permList = [];
                    serverConfig.blame.rotateList = [];
                    break;
                }
            }
        }));
        yield buildConfigFile(serverConfig, serverID);
        const embMsg3 = new EmbedBuilder()
            .setTitle('Blame Setup')
            .setDescription(`Blame Setup Complete! You can use ${serverConfig.prefix}blame add/remove/addperm/removeperm to add people to the rotation.`)
            .setColor('#355E3B');
        channel.send({ embeds: [embMsg3] });
    });
}
//#endregion
//#region Add/Remove blame
/**
 * This function takes several inputs and adds/removes someone from the blame command.
 * @param addTF - True makes it add the person, False removes them
 * @param permTF - True adds them to the permanent blame list, False adds them to the weekly rotation
 * @param person - Name of the person
 * @param serverConfig - serverConfig from the server running the command
 * @return ServerConfig Object
 */
function addRemoveBlame(addTF, permTF, user, serverConfig) {
    return __awaiter(this, void 0, void 0, function* () {
        //Pulls the current blame lists
        //Gets serverConfig from database
        let personFound = false;
        const person = user.id;
        if (permTF) {
            serverConfig.blame.permList.forEach((item) => {
                if (item == person) {
                    personFound = true;
                }
            });
            if (addTF) {
                serverConfig.blame.permList.forEach((item) => {
                    if (item == person) {
                        personFound = true;
                    }
                });
                if (!personFound) {
                    serverConfig.blame.permList.push(person);
                }
                else {
                    throw { name: 'PersonExists', message: `${user} is already in the permanent blame list!` };
                }
            }
            else {
                serverConfig.blame.permList.forEach((item) => {
                    if (item == person) {
                        personFound = true;
                    }
                });
                if (personFound) {
                    serverConfig.blame.permList = serverConfig.blame.permList.filter(function (item) {
                        return item !== person;
                    });
                }
                else {
                    throw { name: 'PersonNotExists', message: `${user} is not in the permanent blame list!` };
                }
            }
        }
        else {
            serverConfig.blame.rotateList.forEach((item) => {
                if (item == person) {
                    personFound = true;
                }
            });
            if (addTF) {
                serverConfig.blame.rotateList.forEach((item) => {
                    if (item == person) {
                        personFound = true;
                    }
                });
                if (!personFound) {
                    serverConfig.blame.rotateList.push(person);
                }
                else {
                    throw { name: 'PersonExists', message: `${user} is already in the rotating blame list!` };
                }
            }
            else {
                serverConfig.blame.permList.forEach((item) => {
                    if (item == person) {
                        personFound = true;
                    }
                });
                if (personFound) {
                    serverConfig.blame.rotateList = serverConfig.blame.rotateList.filter(function (item) {
                        return item !== person;
                    });
                }
                else {
                    throw { name: 'PersonNotExists', message: `${user} is not in the rotating blame list!` };
                }
            }
        }
        return serverConfig;
    });
}
//#endregion
//#region Offset blame
/**
 * This function takes several inputs and adds/removes someone from the blame command.
 * @param serverID - The id for the server this is run in
 * @param offset - Number of places to offset the blame by
 * @param serverConfig - serverConfig from the server running the command
 * @return ServerConfig Object
 */
function changeBlameOffset(serverID, offset, serverConfig) {
    return __awaiter(this, void 0, void 0, function* () {
        //Pulls the current blame lists
        serverConfig.blame.offset = offset;
        yield buildConfigFile(serverConfig, serverID);
        return serverConfig;
    });
}
//#endregion
//#region Setup all
/**
 * This function runs the setup for all features.
 * @param message - Discord.js Message Object
 * @param serverID - String of numbers for the server/guild ID
 * @param client - Discord.js Client
 */
function setup(message, serverConfig, client) {
    return __awaiter(this, void 0, void 0, function* () {
        const serverID = message.guild.id;
        const channel = message.channel;
        if (channel.isDMBased()) {
            return;
        }
        //Sets up all commands
        yield setAutoRole(message, serverConfig, client);
        yield setGeneral(message, serverConfig);
        yield setJoinRole(message, serverConfig);
        yield setMusic(message, serverConfig);
        yield setModMail(message, serverConfig);
        yield setJoinToCreateVC(message, serverConfig);
        yield setBlame(message, serverConfig);
        yield setLogging(message, serverConfig);
        //Removes the Setup Needed Tag
        serverConfig.setupNeeded = false;
        yield buildConfigFile(serverConfig, serverID);
        const embMsg = new EmbedBuilder()
            .setTitle('Server Setup Complete')
            .setDescription("**MAKE SURE TO PUT THE ROLE FOR THIS BOT ABOVE ROLES YOU WANT THE BOT TO MANAGE, if you don't the bot will not work properly!**")
            .setColor('#5D3FD3')
            .setFooter({ text: `Requested by ${message.member.user.username}`, iconURL: null });
        channel.send({ embeds: [embMsg] });
    });
}
//#endregion
//#region Build config
/**
 * This function builds the serverConfig file with the provided JSON.
 * @param config - String of JSON
 * @param serverID - String of numbers for the server/guild ID
 */
function buildConfigFile(config, serverID) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //FIX ticketing
            const update = {
                _id: serverID,
                guildID: serverID,
                setupNeeded: config.setupNeeded,
                prefix: config.prefix,
                autoRole: {
                    enable: config.autoRole.enable,
                    embedMessage: config.autoRole.embedMessage,
                    embedFooter: config.autoRole.embedFooter,
                    roles: config.autoRole.roles,
                    reactions: config.autoRole.reactions,
                    embedThumbnail: config.autoRole.embedThumbnail,
                },
                ticketing: {
                    enable: false,
                    embedTitle: 'Not Set Up',
                    embedMessage: 'Not Set Up',
                    embedFooter: 'Not Set Up',
                    embedThumbnail: {
                        enable: false,
                        url: 'Not Set Up',
                    },
                },
                joinRole: { enable: config.joinRole.enable, role: config.joinRole.role },
                music: { enable: config.music.enable, djRoles: config.music.djRoles, textChannel: config.music.textChannel },
                general: { adminRoles: config.general.adminRoles, modRoles: config.general.modRoles },
                modMail: { enable: config.modMail.enable, modList: config.modMail.modList },
                JTCVC: { enable: config.JTCVC.enable, voiceChannel: config.JTCVC.voiceChannel },
                blame: { enable: config.blame.enable, cursing: config.blame.cursing, offset: config.blame.offset, permList: config.blame.permList, rotateList: config.blame.rotateList },
                logging: {
                    enable: config.logging.enable,
                    voice: {
                        enable: config.logging.voice.enable,
                        loggingChannel: config.logging.voice.loggingChannel,
                        ignoreCategories: config.logging.voice.ignoreCategories,
                        ignoreChannels: config.logging.voice.ignoreChannels,
                    },
                    text: {
                        enable: config.logging.text.enable,
                        loggingChannel: config.logging.text.loggingChannel,
                        ignoreCategories: config.logging.text.ignoreCategories,
                        ignoreChannels: config.logging.text.ignoreChannels,
                    },
                    admin: {
                        enable: config.logging.admin.enable,
                        loggingChannel: config.logging.admin.loggingChannel,
                        ignoreCategories: config.logging.admin.ignoreCategories,
                        ignoreChannels: config.logging.admin.ignoreChannels,
                    },
                    user: { enable: config.logging.user.enable, loggingChannel: config.logging.user.loggingChannel },
                },
            };
            yield MongooseServerConfig.findByIdAndUpdate(serverID, update, { new: true, upsert: true })
                .exec()
                .then(() => {
                console.log(`Updated ServerConfig for ${serverID}`);
            });
        }
        catch (err) {
            console.log(err);
        }
    });
}
//#endregion
//#region Adds server config
/**
 * This function adds the provided server to the serverConfig file.
 * @param serverID - Server ID for server to be added
 * @returns Void
 */
function addServerConfig(serverID) {
    return __awaiter(this, void 0, void 0, function* () {
        const defaultConfig = {
            _id: serverID,
            guildID: serverID,
            setupNeeded: true,
            prefix: '!',
            autoRole: { enable: false, embedMessage: 'Not Set Up', embedFooter: 'Not Set Up', roles: [], reactions: [], embedThumbnail: { enable: false, url: 'Not Set Up' } },
            ticketing: {
                enable: false,
                embedTitle: 'Not Set Up',
                embedMessage: 'Not Set Up',
                embedFooter: 'Not Set Up',
                embedThumbnail: {
                    enable: false,
                    url: 'Not Set Up',
                },
            },
            joinRole: { enable: false, role: 'Not Set Up' },
            music: { enable: false, djRoles: [], textChannel: 'Not Set Up' },
            general: { adminRoles: [], modRoles: [] },
            modMail: { enable: false, modList: [] },
            JTCVC: { enable: false, voiceChannel: 'Not Set Up' },
            blame: { enable: false, cursing: false, offset: 0, permList: [], rotateList: [] },
            logging: {
                enable: false,
                voice: { enable: false, loggingChannel: 'Not Set Up', ignoreChannels: [], ignoreCategories: [] },
                text: { enable: false, loggingChannel: 'Not Set Up', ignoreChannels: [], ignoreCategories: [] },
                admin: { enable: false, loggingChannel: 'Not Set Up', ignoreChannels: [], ignoreCategories: [] },
                user: { enable: false, loggingChannel: 'Not Set Up' },
            },
        };
        buildConfigFile(defaultConfig, serverID);
        return;
    });
}
//#endregion
//#region Removes server config
/**
 * This function removes the provided server from the serverConfig file
 * @param serverID - Server ID for server to be added
 * @returns Void
 */
function removeServerConfig(serverID) {
    MongooseServerConfig.findByIdAndDelete(serverID);
    return;
}
//#endregion
//#region exports
export { addRemoveBlame, addServerConfig, buildConfigFile, changeBlameOffset, removeServerConfig, setAutoRole, setBlame, setGeneral, setJoinRole, setJoinToCreateVC, setModMail, setMusic, setLogging, setup, };
//#endregion
