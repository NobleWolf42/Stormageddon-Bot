//#region Imports
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { embedCustom, errorCustom, warnCustom, warnDisabled } from '../../helpers/embedSlashMessages.js';
import { SlashCommand } from '../../models/slashCommandModel.js';
import { MongooseServerConfig } from '../../models/serverConfigModel.js';
//#endregion

//#region This exports the modmail command with the information about it
const modMailSlashCommand: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName('modmail')
        .setDescription('Whisper via Stormageddon to all moderators for the specified server.')
        .addStringOption((option) => option.setName('servername').setDescription('Name of the Server you want to message the mods in.').setRequired(true))
        .addStringOption((option) => option.setName('message').setDescription('Message to send.').setRequired(true)),
    async execute(client, interaction) {
        //#region Escape Logic
        if (!interaction.isChatInputCommand()) {
            return;
        }

        let serverID: string = null;

        client.guilds.cache.forEach(function (key) {
            if (key.name == interaction.options.getString('servername')) {
                serverID = key.id;
            }
        });

        if (!serverID) {
            warnCustom(interaction, 'The server you specified does not have this bot, or you failed to specify a server.', modMailSlashCommand.data.name);
            return;
        }

        const serverConfig = (await MongooseServerConfig.findById(interaction.guildId).exec()).toObject();

        if (!serverConfig) {
            errorCustom(interaction, `The \`!setup\` command has not been run on \`${interaction.options.getString('servername')}\` yet.`, modMailSlashCommand.data.name, client);
            return;
        }

        if (serverConfig.modMail.enable) {
            return warnDisabled(interaction, 'modMail', modMailSlashCommand.data.name);
        }
        //#endregion

        for (const key of serverConfig.modMail.modList) {
            const mod = await client.users.fetch(key);
            const embMsg = new EmbedBuilder()
                .setTitle(`Mod Mail from: ${interaction.options.getString('servername')}`)
                .setColor('#0B6E29')
                .setDescription(interaction.options.getString('message'))
                .setFooter({
                    text: `Requested by ${interaction.user.tag}`,
                    iconURL: null,
                })
                .setTimestamp();

            mod.send({ embeds: [embMsg] });
        }

        embedCustom(
            interaction,
            'Mod Mail Sent.',
            '#0B6E29',
            `**Message:** \`${interaction.options.getString('message')}\` \n**Sent To:** \`The Mods at ${interaction.options.getString('servername')}\``,
            {
                text: `Requested by ${interaction.user.tag}`,
                iconURL: null,
            },
            null,
            [],
            null,
            null
        );
    },
};
//#endregion

//#region Exports
export default modMailSlashCommand;
//#endregion
