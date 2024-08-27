//#region Dependencies
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
//#endregion

//#region Data Files
var serverConfig = require('../../data/serverConfig.ts');
//#endregion

//#region Helpers
const {
    embedCustom,
    warnDisabled,
    errorCustom,
    warnCustom,
    errorNoAdmin,
} = require('../../helpers/embedSlashMessages.js');
const { adminCheck } = require('../../helpers/userPermissions.js');
//#endregion

//#region Internals
const { addRemoveBlame } = require('../../internal/settingsFunctions.js');
//#endregion

//#region This exports the blame command with the information about it
module.exports = {
    data: new SlashCommandBuilder()
        .setName('editblame')
        .setDescription('Admin commands for the blame command.')
        .addSubcommand((subcommand) =>
            subcommand
                .setName('add')
                .setDescription('Adds a user to the rotating blame list.')
                .addStringOption((option) =>
                    option
                        .setName('person')
                        .setDescription("A person's name/username.")
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('addperm')
                .setDescription('Adds a user to the permanent blame list.')
                .addStringOption((option) =>
                    option
                        .setName('person')
                        .setDescription("A person's name/username.")
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('remove')
                .setDescription('Removes a user from the rotating blame list.')
                .addStringOption((option) =>
                    option
                        .setName('person')
                        .setDescription("A person's name/username.")
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('removeperm')
                .setDescription('Removes a user from the permanent blame list.')
                .addStringOption((option) =>
                    option
                        .setName('person')
                        .setDescription("A person's name/username.")
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('list')
                .setDescription('Shows the current blame lists.')
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('fix')
                .setDescription(
                    'Fixes the current weeks blame to the specified person.'
                )
                .addIntegerOption((option) =>
                    option
                        .setName('person')
                        .setDescription("The person's position in the list.")
                        .setRequired(true)
                )
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(client, interaction, distube) {
        var serverID = interaction.guildId;
        var erroredOut = false;
        var adminTF = adminCheck(interaction);

        if (serverConfig[serverID].blame.enable) {
            //Handles the blame sub commands
            switch (interaction.options.getSubcommand()) {
                //Adds a person to the blame rotation
                case 'add':
                    if (!adminTF) {
                        errorNoAdmin(
                            interaction,
                            module.name + interaction.options.getSubcommand(),
                            client
                        );
                    }
                    var argsString = interaction.options.getString('person');
                    serverConfig = await addRemoveBlame(
                        serverID,
                        true,
                        false,
                        argsString
                    ).catch((err) => {
                        if (
                            err.name == 'PersonExists' ||
                            err.name == 'PersonNotExists'
                        ) {
                            warnCustom(
                                interaction,
                                err.message,
                                '/editblame' +
                                    interaction.options.getSubcommand(),
                                client
                            );
                        } else {
                            errorCustom(
                                interaction,
                                err.message,
                                '/editblame' +
                                    interaction.options.getSubcommand(),
                                client
                            );
                        }

                        erroredOut = true;
                        return serverConfig;
                    });

                    if (!erroredOut) {
                        embedCustom(
                            interaction,
                            'Success',
                            '#00FF00',
                            `Successfully added ${argsString} to the rotating blame list.`,
                            {
                                text: `Requested by ${interaction.user.username}`,
                                iconURL: null,
                            },
                            null,
                            [],
                            null,
                            null
                        );
                    }
                    break;

                //Adds a person to the permanent blame list
                case 'addperm':
                    if (!adminTF) {
                        errorNoAdmin(
                            interaction,
                            module.name + interaction.options.getSubcommand(),
                            client
                        );
                    }
                    var argsString = interaction.options.getString('person');
                    serverConfig = await addRemoveBlame(
                        serverID,
                        true,
                        true,
                        argsString
                    ).catch((err) => {
                        if (
                            err.name == 'PersonExists' ||
                            err.name == 'PersonNotExists'
                        ) {
                            warnCustom(
                                interaction,
                                err.message,
                                '/editblame' +
                                    interaction.options.getSubcommand(),
                                client
                            );
                        } else {
                            errorCustom(
                                interaction,
                                err.message,
                                '/editblame' +
                                    interaction.options.getSubcommand(),
                                client
                            );
                        }

                        erroredOut = true;
                        return serverConfig;
                    });

                    if (!erroredOut) {
                        embedCustom(
                            interaction,
                            'Success',
                            '#00FF00',
                            `Successfully added ${argsString} to the rotating blame list.`,
                            {
                                text: `Requested by ${interaction.user.username}`,
                                iconURL: null,
                            },
                            null,
                            [],
                            null,
                            null
                        );
                    }
                    break;

                //Removes a person from the blame rotation
                case 'remove':
                    if (!adminTF) {
                        errorNoAdmin(
                            interaction,
                            module.name + interaction.options.getSubcommand(),
                            client
                        );
                    }
                    var argsString = interaction.options.getString('person');
                    serverConfig = await addRemoveBlame(
                        serverID,
                        false,
                        false,
                        argsString
                    ).catch((err) => {
                        if (
                            err.name == 'PersonExists' ||
                            err.name == 'PersonNotExists'
                        ) {
                            warnCustom(
                                interaction,
                                err.message,
                                '/editblame' +
                                    interaction.options.getSubcommand(),
                                client
                            );
                        } else {
                            errorCustom(
                                interaction,
                                err.message,
                                '/editblame' +
                                    interaction.options.getSubcommand(),
                                client
                            );
                        }

                        erroredOut = true;
                        return serverConfig;
                    });

                    if (!erroredOut) {
                        embedCustom(
                            interaction,
                            'Success',
                            '#00FF00',
                            `Successfully removed ${argsString} to the rotating blame list.`,
                            {
                                text: `Requested by ${interaction.user.username}`,
                                iconURL: null,
                            },
                            null,
                            [],
                            null,
                            null
                        );
                    }
                    break;

                //Removes a person from the permanent blame list
                case 'removeperm':
                    if (!adminTF) {
                        errorNoAdmin(
                            interaction,
                            module.name + interaction.options.getSubcommand(),
                            client
                        );
                    }
                    var argsString = interaction.options.getString('person');
                    serverConfig = await addRemoveBlame(
                        serverID,
                        false,
                        true,
                        argsString
                    ).catch((err) => {
                        if (
                            err.name == 'PersonExists' ||
                            err.name == 'PersonNotExists'
                        ) {
                            warnCustom(
                                interaction,
                                err.message,
                                '/editblame' +
                                    interaction.options.getSubcommand(),
                                client
                            );
                        } else {
                            errorCustom(
                                interaction,
                                err.message,
                                '/editblame' +
                                    interaction.options.getSubcommand(),
                                client
                            );
                        }

                        erroredOut = true;
                        return serverConfig;
                    });

                    if (!erroredOut) {
                        embedCustom(
                            interaction,
                            'Success',
                            '#00FF00',
                            `Successfully removed ${argsString} to the rotating blame list.`,
                            {
                                text: `Requested by ${interaction.user.username}`,
                                iconURL: null,
                            },
                            null,
                            [],
                            null,
                            null
                        );
                    }
                    break;

                //Send the list to the user
                case 'list':
                    var rBlameString = '';
                    var pBlameString = '';

                    if (!adminTF) {
                        errorNoAdmin(
                            interaction,
                            module.name + interaction.options.getSubcommand(),
                            client
                        );
                    }

                    for (key in serverConfig[serverID].blame.permList) {
                        if (
                            key ==
                            serverConfig[serverID].blame.permList.length - 1
                        ) {
                            pBlameString += `${serverConfig[serverID].blame.permList[key]}`;
                        } else {
                            pBlameString += `${serverConfig[serverID].blame.permList[key]}, `;
                        }
                    }

                    for (key in serverConfig[serverID].blame.rotateList) {
                        if (
                            key ==
                            serverConfig[serverID].blame.rotateList.length - 1
                        ) {
                            rBlameString += `${serverConfig[serverID].blame.rotateList[key]}`;
                        } else {
                            rBlameString += `${serverConfig[serverID].blame.rotateList[key]}, `;
                        }
                    }

                    embedCustom(
                        interaction,
                        'Blame List:',
                        '#B54A65',
                        `Rotating Blame List: ${rBlameString}\nPermanent Blame List: ${pBlameString}`,
                        {
                            text: `Requested by ${interaction.user.username}`,
                            iconURL: null,
                        },
                        null,
                        [],
                        null,
                        null
                    );
                    break;

                //Fixes the person whose week it is
                case 'fix':
                    var currentVal =
                        Math.floor((Date.now() - 493200000) / 604800000) -
                        Math.floor(
                            Math.floor((Date.now() - 493200000) / 604800000) /
                                serverConfig[serverID].blame.rotateList.length
                        ) *
                            serverConfig[serverID].blame.rotateList.length;

                    var wantedVal =
                        interaction.options.getInteger('person') - 1;

                    if (
                        wantedVal == undefined ||
                        wantedVal < 1 ||
                        wantedVal > serverConfig[serverID].blame.rotateList
                    ) {
                        return warnCustom(
                            interaction,
                            `You must put a number between 1 and ${serverConfig[serverID].blame.rotateList.length}`,
                            module.name,
                            client
                        );
                    }

                    if (currentVal != wantedVal) {
                        var offset = currentVal - wantedVal;

                        console.log(currentVal);
                        console.log(wantedVal);
                        console.log(offset);

                        serverConfig = await changeBlameOffset(
                            serverID,
                            offset
                        ).catch((err) => {
                            errorCustom(
                                interaction,
                                err.message,
                                'blame' + oldSubCommand,
                                client
                            );

                            erroredOut = true;
                            return serverConfig;
                        });

                        if (!erroredOut) {
                            embedCustom(
                                interaction,
                                'Success',
                                '#00FF00',
                                `Successfully changed ${serverConfig[serverID].blame.rotateList[wantedVal]} to the current one to blame.`,
                                {
                                    text: `Requested by ${interaction.user.username}`,
                                    iconURL: null,
                                },
                                null,
                                [],
                                null,
                                null
                            );
                        }
                    } else {
                        warnCustom(
                            interaction,
                            "It is already that user's week!",
                            module.name,
                            client
                        );
                    }
                    break;

                default:
                    warnCustom(
                        interaction,
                        'Not an option for the editblame command!',
                        '/editblame',
                        client
                    );
                    break;
            }
        } else {
            warnDisabled(interaction, 'blame', module.name, client);
        }
    },
};
//#endregion
