//#region Imports
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    ChannelSelectMenuBuilder,
    ChannelType,
    Client,
    ComponentType,
    EmbedBuilder,
    GuildMember,
    Interaction,
    Message,
    ModalBuilder,
    PermissionFlagsBits,
    RoleSelectMenuBuilder,
    TextInputBuilder,
    TextInputStyle,
    User,
    UserSelectMenuBuilder,
} from 'discord.js';
import { MongooseServerConfig, ServerConfig } from '../models/serverConfigModel.js';
//#endregion

//#region Initial Setup
//Defining a filter for the setup commands to ignore bot messages
const msgFilter = (m: Message) => !m.author.bot;

//Defining some buttons used in all the setup functions
const enableButton = new ButtonBuilder().setCustomId('enable').setLabel('Enable').setStyle(ButtonStyle.Primary);
const disableButton = new ButtonBuilder().setCustomId('disable').setLabel('Disable').setStyle(ButtonStyle.Danger);
const enableDisableButtons = new ActionRowBuilder<ButtonBuilder>().addComponents(enableButton, disableButton);
//#endregion

//#region modMail settings
/**
 * This function runs the setup for the ModMail feature.
 * @param message - Discord.js Message Object
 * @param serverConfig - serverConfig from the server running the command
 */
async function setModMail(message: Message | Interaction, serverConfig: ServerConfig) {
    const channel = message.channel;

    if (channel.isDMBased()) {
        return;
    }

    const serverID = message.guild.id;
    const embMsg1 = new EmbedBuilder().setTitle('ModMail Setup').setDescription('Select Enable To Turn this Feature on, Disable to Leave it off.').setColor('#F5820F');

    const ModMailSetUpMessage = await channel.send({ embeds: [embMsg1], components: [enableDisableButtons] });

    await ModMailSetUpMessage.awaitMessageComponent<ComponentType.Button>().then(async (interaction) => {
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

                const addReplaceModsMessage = await channel.send({ embeds: [embMsg1], components: [new ActionRowBuilder<ButtonBuilder>().addComponents(addModsButton, replaceModsButton)] });

                await addReplaceModsMessage.awaitMessageComponent<ComponentType.Button>().then(async (interaction) => {
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
                });

                const embMsg3 = new EmbedBuilder().setTitle('ModMail Setup').setDescription('Select up to 25 users to receive mod mail.').setColor('#F5820F');
                const kickUserMenu = new UserSelectMenuBuilder().setCustomId('modMailUsers').setMinValues(1).setMaxValues(25);

                const ModMailUserMessage = await channel.send({ embeds: [embMsg3], components: [new ActionRowBuilder<UserSelectMenuBuilder>().addComponents(kickUserMenu)] });
                await ModMailUserMessage.awaitMessageComponent<ComponentType.UserSelect>().then(async (interaction) => {
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
                });
                break;
            }

            case 'disable': {
                ModMailSetUpMessage.edit({ components: [] });
                serverConfig.modMail.enable = false;
                serverConfig.modMail.modList = [];
                break;
            }
        }
    });

    await buildConfigFile(serverConfig, serverID);

    const embMsg4 = new EmbedBuilder().setTitle('ModMail Setup').setDescription('ModMail Setup Complete!').setColor('#355E3B');
    channel.send({ embeds: [embMsg4] });
}
//#endregion

//#region AutoRole settings
/**
 * This function runs the setup for the AutoRole feature.
 * @param message - Discord.js Message Object
 * @param serverConfig - serverConfig from the server running the command
 * @param client - Discord.js Client
 */
async function setAutoRole(message: Message | Interaction, serverConfig: ServerConfig, client: Client) {
    const channel = message.channel;

    if (channel.isDMBased()) {
        return;
    }

    channel.send('Example Message:');
    const embMsg = new EmbedBuilder().setTitle('Role Message').setDescription('**React to the messages below to receive the associated role.**').setColor('#FFFF00').setFooter({
        text: `If you do not receive the role try reacting again.`,
        iconURL: null,
    });

    channel.send({ embeds: [embMsg] });

    const serverID = message.guild.id;
    const embMsg1 = new EmbedBuilder().setTitle('AutoRole Setup').setDescription('Select Enable To Turn this Feature on, Disable to Leave it off.').setColor('#F5820F');

    const AutoRoleSetUpMessage = await channel.send({ embeds: [embMsg1], components: [enableDisableButtons] });

    await AutoRoleSetUpMessage.awaitMessageComponent<ComponentType.Button>().then(async (interaction: ButtonInteraction) => {
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

                const autoRoleBody = new TextInputBuilder().setCustomId('autoRoleBody').setLabel('Input Role Message:').setValue(serverConfig.autoRole.embedMessage).setStyle(TextInputStyle.Paragraph);
                const autoRoleFooter = new TextInputBuilder()
                    .setCustomId('autoRoleFooter')
                    .setLabel('Input Footer for Role Message:')
                    .setValue(serverConfig.autoRole.embedFooter)
                    .setStyle(TextInputStyle.Short);

                const autoRoleBodyInput = new ActionRowBuilder<TextInputBuilder>().addComponents(autoRoleBody);
                const autoRoleFooterInput = new ActionRowBuilder<TextInputBuilder>().addComponents(autoRoleFooter);

                const autoRoleModal = new ModalBuilder().setCustomId('autoRoleModal').setTitle('AutoRole SetUp - Message Content').addComponents(autoRoleBodyInput, autoRoleFooterInput);

                await interaction.showModal(autoRoleModal);
                await interaction.awaitModalSubmit({ time: 300000 }).then(async (interaction) => {
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

                    const autoRoleThumbnailMessage = await channel.send({ embeds: [embMsg2], components: [enableDisableButtons] });
                    await autoRoleThumbnailMessage.awaitMessageComponent<ComponentType.Button>().then(async (interaction) => {
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
                                    const autoRoleThumbnailURL = new TextInputBuilder()
                                        .setCustomId('autoRoleThumbnailURL')
                                        .setLabel('Input URL below. Blank=Server Profile Image.')
                                        .setRequired(false)
                                        .setStyle(TextInputStyle.Short);

                                    const thumbnailURLField = new ActionRowBuilder<TextInputBuilder>().addComponents(autoRoleThumbnailURL);

                                    const thumbnailModal = new ModalBuilder().setCustomId('thumbnailModal').setTitle('AutoRole SetUp - Thumbnail').addComponents(thumbnailURLField);

                                    await interaction.showModal(thumbnailModal);
                                    await interaction.awaitModalSubmit({ time: 300000 }).then(async (interaction) => {
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
                                    });
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

                        const addReplaceRolesMessage = await channel.send({ embeds: [embMsg3], components: [new ActionRowBuilder<ButtonBuilder>().addComponents(addRolesButton, replaceRolesButton)] });

                        await addReplaceRolesMessage.awaitMessageComponent<ComponentType.Button>().then(async (interaction) => {
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
                        });

                        const autoRoleRoles = new RoleSelectMenuBuilder().setCustomId('autoRoleRoles').setMaxValues(25);

                        const embMsg4 = new EmbedBuilder().setTitle('AutoRole Setup').setDescription('Choose the roles you would like to be managed by the bot.').setColor('#F5820F');

                        let moreRoles = true;
                        while (moreRoles) {
                            const addRolesMessage = await channel.send({ embeds: [embMsg4], components: [new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(autoRoleRoles)] });
                            await addRolesMessage.awaitMessageComponent<ComponentType.RoleSelect>().then(async (interaction) => {
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

                                const moreRolesMessage = await channel.send({ embeds: [embMsg5], components: [new ActionRowBuilder<ButtonBuilder>().addComponents(yesButton, noButton)] });
                                await moreRolesMessage.awaitMessageComponent<ComponentType.Button>().then(async (interaction) => {
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
                                });
                            });
                        }

                        for (const id of serverConfig.autoRole.roles) {
                            channel.send(`\`${(await client.guilds.fetch(channel.guildId)).roles.resolve(id).name}\``);
                        }

                        channel.send(
                            'Please respond to this message with the list of reactions you want to be used for the roles above, matching their order. Format the list with spaces separating the reactions, like this: `🐕 🎩 👾`. (NOTE: You can use custom reactions as long as they are not animated and belong to this server)'
                        );

                        try {
                            const embedReactIn = await channel.awaitMessages({
                                filter: msgFilter,
                                max: 1,
                                time: 300000,
                                errors: ['time'],
                            });
                            const reactions = embedReactIn.first().content.split(' ');
                            serverConfig.autoRole.reactions = reactions;
                        } catch (err) {
                            console.log(err.message);
                        }
                    });
                });
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
    });

    console.log(serverConfig.autoRole);

    await buildConfigFile(serverConfig, serverID);
    const embMsg6 = new EmbedBuilder().setTitle('AutoRole Setup').setDescription('AutoRole Setup Complete!').setColor('#355E3B');
    channel.send({ embeds: [embMsg6] });
}
//#endregion

//#region Function that sets joinRole settings
/**
 * This function runs the setup for the JoinRole feature.
 * @param message - Discord.js Message Object
 * @param serverConfig - serverConfig from the server running the command
 */
async function setJoinRole(message: Message | Interaction, serverConfig: ServerConfig) {
    const channel = message.channel;

    if (channel.isDMBased()) {
        return;
    }

    const serverID = message.guild.id;
    const embMsg1 = new EmbedBuilder().setTitle('JoinRole Setup').setDescription('Select Enable To Turn this Feature on, Disable to Leave it off.').setColor('#F5820F');

    const JoinRoleSetUpMessage = await channel.send({ embeds: [embMsg1], components: [enableDisableButtons] });

    await JoinRoleSetUpMessage.awaitMessageComponent<ComponentType.Button>().then(async (interaction) => {
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
                const embMsg2 = new EmbedBuilder().setTitle('JoinRole Setup').setDescription('Select a role to give upon joining the server..').setColor('#F5820F');
                const roleMenu = new RoleSelectMenuBuilder().setCustomId('joinRoleRole').setMinValues(1).setMaxValues(1);

                const JoinRoleRoleMessage = await channel.send({ embeds: [embMsg2], components: [new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(roleMenu)] });
                await JoinRoleRoleMessage.awaitMessageComponent<ComponentType.RoleSelect>().then(async (interaction) => {
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
                });
                break;
            }

            case 'disable': {
                JoinRoleSetUpMessage.edit({ components: [] });
                serverConfig.joinRole.enable = false;
                serverConfig.joinRole.role = 'Not Set Up';
                break;
            }
        }
    });

    await buildConfigFile(serverConfig, serverID);

    const embMsg3 = new EmbedBuilder().setTitle('JoinRole Setup').setDescription('JoinRole Setup Complete!').setColor('#355E3B');
    channel.send({ embeds: [embMsg3] });
}
//#endregion

//#region Function that sets joinToCreateVC settings
/**
 * This function runs the setup for the joinToCreateVC feature.
 * @param message - Discord.js Message Object
 * @param serverConfig - serverConfig from the server running the command
 */
async function setJoinToCreateVC(message: Message | Interaction, serverConfig: ServerConfig) {
    const channel = message.channel;

    if (channel.isDMBased()) {
        return;
    }

    const serverID = message.guild.id;
    const embMsg1 = new EmbedBuilder().setTitle('Join to Create Voice Channel Setup').setDescription('Select Enable To Turn this Feature on, Disable to Leave it off.').setColor('#F5820F');

    const JTCVCSetUpMessage = await channel.send({ embeds: [embMsg1], components: [enableDisableButtons] });

    await JTCVCSetUpMessage.awaitMessageComponent<ComponentType.Button>().then(async (interaction) => {
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
                const embMsg2 = new EmbedBuilder().setTitle('Join to Create Voice Channel Setup').setDescription('Select a role to give upon joining the server..').setColor('#F5820F');
                const channelMenu = new ChannelSelectMenuBuilder().setCustomId('JTVCChannel').setMinValues(1).setMaxValues(1).setChannelTypes(ChannelType.GuildVoice);

                const JTCVCChannelMessage = await channel.send({ embeds: [embMsg2], components: [new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(channelMenu)] });
                await JTCVCChannelMessage.awaitMessageComponent<ComponentType.RoleSelect>().then(async (interaction) => {
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
                });
                break;
            }

            case 'disable': {
                JTCVCSetUpMessage.edit({ components: [] });
                serverConfig.JTCVC.enable = false;
                serverConfig.JTCVC.voiceChannel = 'Not Set Up';
                break;
            }
        }
    });

    await buildConfigFile(serverConfig, serverID);

    const embMsg3 = new EmbedBuilder().setTitle('Join to Create Voice Channel Setup').setDescription('Join to Create Voice Channel Setup Complete!').setColor('#355E3B');
    channel.send({ embeds: [embMsg3] });
}
//#endregion

//#region Function that sets music settings
/**
 * This function runs the setup for the Music feature.
 * @param message - Discord.js Message Object
 * @param serverConfig - serverConfig from the server running the command
 */
async function setMusic(message: Message | Interaction, serverConfig: ServerConfig) {
    const channel = message.channel;

    if (channel.isDMBased()) {
        return;
    }

    const serverID = message.guild.id;
    const embMsg1 = new EmbedBuilder().setTitle('Join to Create Voice Channel Setup').setDescription('Select Enable To Turn this Feature on, Disable to Leave it off.').setColor('#F5820F');

    const MusicSetUpMessage = await channel.send({ embeds: [embMsg1], components: [enableDisableButtons] });

    await MusicSetUpMessage.awaitMessageComponent<ComponentType.Button>().then(async (interaction) => {
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
                const embMsg2 = new EmbedBuilder().setTitle('Join to Create Voice Channel Setup').setDescription('Select a role to give upon joining the server..').setColor('#F5820F');
                const channelMenu = new ChannelSelectMenuBuilder().setCustomId('musicChannel').setMinValues(1).setMaxValues(1).setChannelTypes(ChannelType.GuildText);

                const musicChannelMessage = await channel.send({ embeds: [embMsg2], components: [new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(channelMenu)] });
                await musicChannelMessage.awaitMessageComponent<ComponentType.RoleSelect>().then(async (interaction) => {
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
                });

                const embMsg3 = new EmbedBuilder().setTitle('Music Setup').setDescription('Would you like to add to existing roles, or replace current roles?').setColor('#F5820F');

                const addRolesButton = new ButtonBuilder().setCustomId('addRoles').setLabel('Add Roles').setStyle(ButtonStyle.Primary);
                const replaceRolesButton = new ButtonBuilder().setCustomId('replaceRoles').setLabel('Replace Roles').setStyle(ButtonStyle.Danger);

                const addReplaceRolesMessage = await channel.send({ embeds: [embMsg3], components: [new ActionRowBuilder<ButtonBuilder>().addComponents(addRolesButton, replaceRolesButton)] });

                await addReplaceRolesMessage.awaitMessageComponent<ComponentType.Button>().then(async (interaction) => {
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
                });

                const embMsg4 = new EmbedBuilder().setTitle('Music Setup').setDescription('Select djRoles.').setColor('#F5820F');
                const roleMenu = new RoleSelectMenuBuilder().setCustomId('musicRoles').setMinValues(1).setMaxValues(25);

                const JoinRoleRoleMessage = await channel.send({ embeds: [embMsg4], components: [new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(roleMenu)] });
                await JoinRoleRoleMessage.awaitMessageComponent<ComponentType.RoleSelect>().then(async (interaction) => {
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
                });
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
    });

    await buildConfigFile(serverConfig, serverID);

    const embMsg5 = new EmbedBuilder().setTitle('Join to Create Voice Channel Setup').setDescription('Join to Create Voice Channel Setup Complete!').setColor('#355E3B');
    channel.send({ embeds: [embMsg5] });
}
//#endregion

//#region Function that sets general settings
/**
 * This function runs the setup for the general features.
 * @param message - Discord.js Message Object
 * @param serverConfig - serverConfig from the server running the command
 */
async function setGeneral(message: Message | Interaction, serverConfig: ServerConfig) {
    const channel = message.channel;

    if (channel.isDMBased()) {
        return;
    }

    const serverID = message.guild.id;
    const embMsg1 = new EmbedBuilder().setTitle('General Setup').setDescription('Would you like to add to existing roles, or replace current roles? (This is for Bot Admin Roles)').setColor('#F5820F');

    const addRolesButton = new ButtonBuilder().setCustomId('addRoles').setLabel('Add Roles').setStyle(ButtonStyle.Primary);
    const replaceRolesButton = new ButtonBuilder().setCustomId('replaceRoles').setLabel('Replace Roles').setStyle(ButtonStyle.Danger);

    const addReplaceRolesMessage1 = await channel.send({ embeds: [embMsg1], components: [new ActionRowBuilder<ButtonBuilder>().addComponents(addRolesButton, replaceRolesButton)] });

    await addReplaceRolesMessage1.awaitMessageComponent<ComponentType.Button>().then(async (interaction) => {
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
    });

    const embMsg2 = new EmbedBuilder().setTitle('General Setup').setDescription('Select roles for Bot Admin.').setColor('#F5820F');
    const roleMenu1 = new RoleSelectMenuBuilder().setCustomId('botAdminRoles').setMinValues(1).setMaxValues(25);

    const botAdminRolesMessage = await channel.send({ embeds: [embMsg2], components: [new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(roleMenu1)] });
    await botAdminRolesMessage.awaitMessageComponent<ComponentType.RoleSelect>().then(async (interaction) => {
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
    });

    const embMsg3 = new EmbedBuilder().setTitle('General Setup').setDescription('Would you like to add to existing roles, or replace current roles? (This is for Bot Mod Roles)').setColor('#F5820F');

    const addReplaceRolesMessage2 = await channel.send({ embeds: [embMsg3], components: [new ActionRowBuilder<ButtonBuilder>().addComponents(addRolesButton, replaceRolesButton)] });

    await addReplaceRolesMessage2.awaitMessageComponent<ComponentType.Button>().then(async (interaction) => {
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
    });

    const embMsg4 = new EmbedBuilder().setTitle('General Setup').setDescription('Select roles for Bot Mod.').setColor('#F5820F');
    const roleMenu2 = new RoleSelectMenuBuilder().setCustomId('botModRoles').setMinValues(1).setMaxValues(25);

    const botModRolesMessage = await channel.send({ embeds: [embMsg4], components: [new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(roleMenu2)] });
    await botModRolesMessage.awaitMessageComponent<ComponentType.RoleSelect>().then(async (interaction) => {
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
    });

    await buildConfigFile(serverConfig, serverID);

    const embMsg5 = new EmbedBuilder().setTitle('Join to Create Voice Channel Setup').setDescription('Join to Create Voice Channel Setup Complete!').setColor('#355E3B');
    channel.send({ embeds: [embMsg5] });
}
//#endregion

//#region Function that sets blame settings
/**
 * This function runs the setup for the blame features.
 * @param message - Discord.js Message Object
 * @param serverConfig - serverConfig from the server running the command
 */
async function setBlame(message: Message | Interaction, serverConfig: ServerConfig) {
    const channel = message.channel;

    if (channel.isDMBased()) {
        return;
    }

    const serverID = message.guild.id;
    const embMsg1 = new EmbedBuilder().setTitle('Blame Setup').setDescription('Select Enable To Turn this Feature on, Disable to Leave it off.').setColor('#F5820F');

    const BlameSetUpMessage = await channel.send({ embeds: [embMsg1], components: [enableDisableButtons] });

    await BlameSetUpMessage.awaitMessageComponent<ComponentType.Button>().then(async (interaction) => {
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

                const BlameCursingMessage = await channel.send({ embeds: [embMsg2], components: [enableDisableButtons] });
                await BlameCursingMessage.awaitMessageComponent<ComponentType.Button>().then(async (interaction) => {
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
                });
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
    });

    await buildConfigFile(serverConfig, serverID);

    const embMsg3 = new EmbedBuilder()
        .setTitle('Blame Setup')
        .setDescription(`Blame Setup Complete! You can use ${serverConfig.prefix}blame add/remove/addperm/removeperm to add people to the rotation.`)
        .setColor('#355E3B');
    channel.send({ embeds: [embMsg3] });
}
//#endregion

//#region Function that adds/removes from blame lists in settings
/**
 * This function takes several inputs and adds/removes someone from the blame command.
 * @param addTF - True makes it add the person, False removes them
 * @param permTF - True adds them to the permanent blame list, False adds them to the weekly rotation
 * @param person - Name of the person
 * @param serverConfig - serverConfig from the server running the command
 * @return ServerConfig Object
 */
async function addRemoveBlame(addTF: boolean, permTF: boolean, user: User, serverConfig: ServerConfig) {
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
            } else {
                throw {
                    name: 'PersonExists',
                    message: `${user} is already in the permanent blame list!`,
                };
            }
        } else {
            serverConfig.blame.permList.forEach((item) => {
                if (item == person) {
                    personFound = true;
                }
            });
            if (personFound) {
                serverConfig.blame.permList = serverConfig.blame.permList.filter(function (item) {
                    return item !== person;
                });
            } else {
                throw {
                    name: 'PersonNotExists',
                    message: `${user} is not in the permanent blame list!`,
                };
            }
        }
    } else {
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
            } else {
                throw {
                    name: 'PersonExists',
                    message: `${user} is already in the rotating blame list!`,
                };
            }
        } else {
            serverConfig.blame.permList.forEach((item) => {
                if (item == person) {
                    personFound = true;
                }
            });
            if (personFound) {
                serverConfig.blame.rotateList = serverConfig.blame.rotateList.filter(function (item) {
                    return item !== person;
                });
            } else {
                throw {
                    name: 'PersonNotExists',
                    message: `${user} is not in the rotating blame list!`,
                };
            }
        }
    }

    return serverConfig;
}
//#endregion

//#region Function that changes offsets for blame lists in settings
/**
 * This function takes several inputs and adds/removes someone from the blame command.
 * @param serverID - The id for the server this is run in
 * @param offset - Number of places to offset the blame by
 * @param serverConfig - serverConfig from the server running the command
 * @return ServerConfig Object
 */
async function changeBlameOffset(serverID: string, offset: number, serverConfig: ServerConfig) {
    //Pulls the current blame lists
    serverConfig.blame.offset = offset;

    await buildConfigFile(serverConfig, serverID);

    return serverConfig;
}
//#endregion

//#region Function that runs all setup commands
/**
 * This function runs the setup for all features.
 * @param message - Discord.js Message Object
 * @param serverID - String of numbers for the server/guild ID
 * @param client - Discord.js Client
 */
async function setup(message: Message | Interaction, serverConfig: ServerConfig, client: Client) {
    const serverID = message.guild.id;
    const channel = message.channel;

    if (channel.isDMBased()) {
        return;
    }

    //Sets up all commands
    await setAutoRole(message, serverConfig, client);
    await setGeneral(message, serverConfig);
    await setJoinRole(message, serverConfig);
    await setMusic(message, serverConfig);
    await setModMail(message, serverConfig);
    await setJoinToCreateVC(message, serverConfig);
    await setBlame(message, serverConfig);

    //Removes the Setup Needed Tag
    serverConfig.setupNeeded = false;
    await buildConfigFile(serverConfig, serverID);
    const embMsg = new EmbedBuilder()
        .setTitle('Server Setup Complete')
        .setDescription("**MAKE SURE TO PUT THE ROLE FOR THIS BOT ABOVE ROLES YOU WANT THE BOT TO MANAGE, if you don't the bot will not work properly!**")
        .setColor('#5D3FD3')
        .setFooter({ text: `Requested by ${message.member.user.username}`, iconURL: null });

    channel.send({ embeds: [embMsg] });
}
//#endregion

//#region Function that builds config file
/**
 * This function builds the serverConfig file with the provided JSON.
 * @param config - String of JSON
 * @param serverID - String of numbers for the server/guild ID
 */
async function buildConfigFile(config: ServerConfig, serverID: string) {
    try {
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
            joinRole: {
                enable: config.joinRole.enable,
                role: config.joinRole.role,
            },
            music: {
                enable: config.music.enable,
                djRoles: config.music.djRoles,
                textChannel: config.music.textChannel,
            },
            general: {
                adminRoles: config.general.adminRoles,
                modRoles: config.general.modRoles,
            },
            modMail: {
                enable: config.modMail.enable,
                modList: config.modMail.modList,
            },
            JTCVC: {
                enable: config.JTCVC.enable,
                voiceChannel: config.JTCVC.voiceChannel,
            },
            blame: {
                enable: config.blame.enable,
                cursing: config.blame.cursing,
                offset: config.blame.offset,
                permList: config.blame.permList,
                rotateList: config.blame.rotateList,
            },
            logging: {
                enable: config.logging.enable,
                loggingChannel: config.logging.loggingChannel,
                voice: {
                    enable: config.logging.voice.enable,
                },
            },
        };
        await MongooseServerConfig.findByIdAndUpdate(serverID, update, {
            new: true,
            upsert: true,
        })
            .exec()
            .then(() => {
                console.log(`Updated ServerConfig for ${serverID}`);
            });
    } catch (err) {
        console.log(err);
    }
}
//#endregion

//#region Function that adds the provided server to the serverConfig file
/**
 * This function adds the provided server to the serverConfig file.
 * @param serverID - Server ID for server to be added
 * @returns Void
 */
async function addServerConfig(serverID: string) {
    const defaultConfig: ServerConfig = {
        _id: serverID,
        guildID: serverID,
        setupNeeded: true,
        prefix: '!',
        autoRole: {
            enable: false,
            embedMessage: 'Not Set Up',
            embedFooter: 'Not Set Up',
            roles: [],
            reactions: [],
            embedThumbnail: {
                enable: false,
                url: 'Not Set Up',
            },
        },
        joinRole: {
            enable: false,
            role: 'Not Set Up',
        },
        music: {
            enable: false,
            djRoles: [],
            textChannel: 'Not Set Up',
        },
        general: {
            adminRoles: [],
            modRoles: [],
        },
        modMail: {
            enable: false,
            modList: [],
        },
        JTCVC: {
            enable: false,
            voiceChannel: 'Not Set Up',
        },
        blame: {
            enable: false,
            cursing: false,
            offset: 0,
            permList: [],
            rotateList: [],
        },
        logging: {
            enable: false,
            loggingChannel: 'Not Set Up',
            voice: {
                enable: false,
            },
        },
    };

    buildConfigFile(defaultConfig, serverID);
    return;
}
//#endregion

//#region Function that removes the provided server form the serverConfig file
/**
 * This function removes the provided server from the serverConfig file
 * @param serverID - Server ID for server to be added
 * @returns Void
 */
function removeServerConfig(serverID: string) {
    MongooseServerConfig.findByIdAndDelete(serverID);
    return;
}
//#endregion

//#region exports
export { addRemoveBlame, addServerConfig, buildConfigFile, changeBlameOffset, removeServerConfig, setAutoRole, setBlame, setGeneral, setJoinRole, setJoinToCreateVC, setModMail, setMusic, setup };
//#endregion
