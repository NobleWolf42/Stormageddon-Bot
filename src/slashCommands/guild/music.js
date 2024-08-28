//#region Dependencies
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
//#endregion

//#region Helpers
const { warnCustom, warnDisabled, warnWrongChannel, errorNoDJ, embedCustom, errorNoMod, errorCustom } = require('../../helpers/embedSlashMessages.js');
const { djCheck } = require('../../helpers/userPermissions.js');
const { addToLog } = require('../../helpers/errorLog.js');
const { updateConfigFile } = require('../../helpers/currentSettings.js');
//#endregion

//#region This exports the music command with the information about it
module.exports = {
    //#region Sets up the command and subcommands and their options
    data: new SlashCommandBuilder()
        .setName('music')
        .setDescription('Commands related to the music function.')
        .addSubcommand((subcommand) =>
            subcommand
                .setName('play')
                .setDescription('Starts playing a song/playlist or adds it to the queue.')
                .addStringOption((option) => option.setName('song').setDescription('Song Name, or Youtube/Spotify/SoundCloud link.').setRequired(true))
        )
        .addSubcommand((subcommand) => subcommand.setName('autoplay').setDescription('Toggles autoplay, where the bot will automatically pick a new song when the queue is done.'))
        .addSubcommand((subcommand) =>
            subcommand
                .setName('loop')
                .setDescription('Set loop type for currently playing music.')
                .addStringOption((option) =>
                    option
                        .setName('looptype')
                        .setDescription('Pick type of loop (song/queue/off).')
                        .setRequired(true)
                        .setChoices({ name: 'Song', value: 'song' }, { name: 'Queue', value: 'queue' }, { name: 'Off', value: 'off' })
                )
        )
        .addSubcommand((subcommand) => subcommand.setName('lyrics').setDescription('Displays lyrics for the current song if they can be found.'))
        .addSubcommand((subcommand) => subcommand.setName('pause').setDescription('Pauses the currently playing music.'))
        .addSubcommand((subcommand) => subcommand.setName('resume').setDescription('Resumes paused music.'))
        .addSubcommand((subcommand) => subcommand.setName('skip').setDescription('Skips to the next song in queue.'))
        .addSubcommand((subcommand) =>
            subcommand
                .setName('playnext')
                .setDescription('Pick the song to play next from the queue or add a new one up next.')
                .addIntegerOption((option) => option.setName('song').setDescription('Queue Position (number), Song Name, or Youtube/Spotify/SoundCloud link.').setRequired(true))
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('remove')
                .setDescription('Remove a song from the queue.')
                .addStringOption((option) => option.setName('song').setDescription('Queue position of Song.').setRequired(true))
        )
        .addSubcommand((subcommand) => subcommand.setName('queue').setDescription('Displays the current queue.'))
        .addSubcommand((subcommand) => subcommand.setName('shuffle').setDescription('Shuffles the current queue.'))
        .addSubcommand((subcommand) =>
            subcommand
                .setName('skipto')
                .setDescription('Skips to a specific song from the queue.')
                .addIntegerOption((option) => option.setName('song').setDescription('Queue position of Song.').setRequired(true))
        )
        .addSubcommand((subcommand) => subcommand.setName('stop').setDescription('Stops the current queue.'))
        .addSubcommand((subcommand) =>
            subcommand
                .setName('volume')
                .setDescription('Display or change the volume.')
                .addIntegerOption((option) => option.setName('volume').setDescription('Volume to change to.').setRequired(false))
        ),
    //#endregion

    //#region Execution of the commands
    async execute(client, interaction, distube) {
        //#region Function wide variables and permission checks
        //Max fields for an embed per discord, change this if it ever changes
        var maxFields = 20;

        //Calls serverConfig from database
        var serverConfig = await MongooseServerConfig.findById(interaction.guildId).exec()[0];

        //Checks to see if the music feature is enabled in this server
        if (!serverConfig.music.enable) {
            return warnDisabled(interaction, 'music', module.name, client);
        }

        //Checks to see if the user has DJ access
        if (!djCheck(interaction)) {
            return errorNoDJ(interaction, module.name, client);
        }

        //Checks to see if the interaction was sent in the correct channel
        var channel = await client.channels.fetch(interaction.channelId);

        if (serverConfig.music.textChannel != channel.name) {
            return warnWrongChannel(interaction, serverConfig.music.textChannel, module.name, client);
        }

        //Sets some global music variables
        var voiceChannel = interaction.member.voice.channel;
        var queue = distube.getQueue(interaction);

        //Checks to see if user is in a voice channel
        if (!voiceChannel) {
            return warnCustom(interaction, 'You must join a voice channel to use this command!', module.name, client);
        } else if (queue && voiceChannel != queue.voiceChannel) {
            return warnCustom(interaction, `You must join the <#${queue.voiceChannel.id}> voice channel to use this command!`, module.name, client);
        }
        //#endregion

        //#region Subcommand handling
        switch (interaction.options.getSubcommand()) {
            //#region Play subcommand
            case 'play':
                var song = interaction.options.getString('song');
                //Checks to see if a song input is detected, is there is a song it checks to see if there is a queue, if there is no queue it plays the song, if there is an queue it will add it to the end of the queue
                if (!song) {
                    return warnCustom(interaction, 'No song input detected, please try again.', module.name, client);
                } else {
                    distube.play(voiceChannel, song, {
                        member: interaction.member,
                        textChannel: channel,
                    });
                    interaction.reply({
                        content: 'Added',
                        ephemeral: true,
                    });
                }
                break;
            //#endregion

            //#region Autoplay subcommand
            case 'autoplay':
                var autoPlay = queue.toggleAutoplay();
                embedCustom(
                    interaction,
                    'Autoplay Toggled',
                    '#0000FF',
                    `Autoplay is now ${autoPlay ? 'On' : 'Off'}.`,
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
            //#endregion

            //#region loop subcommand
            case 'loop':
                var loopMode = interaction.options.getString('looptype');
                var mods = ['song', 'queue', 'off'];

                if (!queue) {
                    return warnCustom(interaction, 'Nothing is playing right now.', module.name, client);
                } else if (!mods.includes(loopMode)) {
                    return warnCustom(interaction, `You must use one of the following options: ${mods.join(', ')}`, module.name, client);
                } else {
                    switch (loopMode) {
                        case 'song':
                            queue.setRepeatMode(1);
                            embedCustom(
                                interaction,
                                `Loop On - Song`,
                                '#0E4CB0',
                                'Music set to loop song.',
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

                        case 'queue':
                            queue.setRepeatMode(2);
                            embedCustom(
                                interaction,
                                `Loop On - Queue`,
                                '#0E4CB0',
                                'Music set to loop queue.',
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

                        case 'off':
                            queue.setRepeatMode(0);
                            embedCustom(
                                interaction,
                                `Loop Off`,
                                '#0E4CB0',
                                'Music has returned to normal playback.',
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
                    }
                }
                break;
            //#endregion

            //#region Lyrics subcommand
            case 'lyrics':
                if (!queue) {
                    return warnCustom(interaction, 'There is nothing playing.', module.name);
                }

                var lyrics = null;

                try {
                    const searches = await Genius.songs.search(queue.songs[0].name);
                    var song = searches[0];
                    lyrics = await song.lyrics();
                    if (!lyrics) {
                        lyrics = `No lyrics found for ${queue.songs[0].name}.`;
                    }
                } catch (error) {
                    addToLog('fatal error', module.name, interaction.user.username, interaction.guild.name, channel.name, error, client);
                    lyrics = `No lyrics found for ${queue.songs[0].name}.`;
                }

                slicedLyrics = [];
                while (lyrics.length >= 2048) {
                    slicedLyrics.push(`${lyrics.substring(0, 2045)}...`);
                    lyrics = lyrics.slice(2045);
                }
                slicedLyrics.push(lyrics);

                slicedLyrics.forEach(async (m, index) => {
                    embedCustom(
                        interaction,
                        `${song.fullTitle} - ${index + 1} of ${slicedLyrics.length}:`,
                        '#0E4CB0',
                        m,
                        {
                            text: `Requested by ${interaction.user.username}`,
                            iconURL: null,
                        },
                        null,
                        [],
                        null,
                        null
                    );
                });
                break;
            //#endregion

            //#region Pause subcommand
            case 'pause':
                if (!queue) {
                    return warnCustom(interaction, 'Nothing is playing right now.', module.name, client);
                } else if (queue.paused) {
                    return warnCustom(interaction, 'Music is already paused.', module.name, client);
                } else {
                    queue.pause();
                    embedCustom(
                        interaction,
                        'Pause',
                        '#0000FF',
                        `Music Paused.`,
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
            //#endregion

            //#region Resume subcommand
            case 'resume':
                if (!queue) {
                    return warnCustom(interaction, 'Nothing is playing right now.', module.name, client);
                } else if (!queue.paused) {
                    return warnCustom(interaction, 'Music is not paused.', module.name, client);
                } else {
                    queue.resume();
                    embedCustom(
                        interaction,
                        'Music Resumed',
                        '#0000FF',
                        `Playing [\`${queue.songs[0].name}\`](${queue.songs[0].url}).`,
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
            //#endregion

            //#region PlayNext subcommand
            case 'playnext':
                if (!modCheck(interaction)) {
                    return errorNoMod(interaction, module.name, client);
                }

                var song = interaction.options.getString('song');

                if (!queue) {
                    return warnCustom(interaction, 'Nothing is playing right now.', module.name, client);
                } else if (song > 0 && song <= queue.songs.length) {
                    var playNext = queue.songs.splice(song - 1, 1)[0];

                    if (!playNext) {
                        return errorCustom(interaction, 'Failed to find the track in the queue.', module.name, client);
                    }

                    distube.play(voiceChannel, song, {
                        member: interaction.member,
                        textChannel: channel,
                        position: 1,
                    });
                } else if (!song || isNaN(song)) {
                    return warnCustom(interaction, 'No song information was included in the command.', module.name, client);
                } else {
                    distube.play(voiceChannel, song, {
                        member: interaction.member,
                        textChannel: channel,
                        position: 1,
                    });
                }
                break;
            //#endregion

            //#region Remove subcommand
            case 'remove':
                var song = interaction.options.getInteger('song');
                if (!queue) {
                    return warnCustom(interaction, 'Nothing is playing right now.', module.name, client);
                } else if (song < 1 || song > queue.songs.length) {
                    return warnCustom(interaction, `Number must be between 1 and ${queue.songs.length}`, module.name, client);
                } else if (!song || isNaN(song)) {
                    return warnCustom(interaction, 'No song information was included in the command.', module.name, client);
                } else if (song == 1) {
                    var song = queue.songs[0];
                    queue.skip().then(() => {
                        embedCustom(
                            interaction,
                            'Removed',
                            '#0000FF',
                            `Removed [\`${son.name}\`](${song.url}) from the queue.`,
                            {
                                text: `Requested by ${interaction.user.username}`,
                                iconURL: null,
                            },
                            null,
                            [],
                            null,
                            null
                        );
                    });
                } else {
                    var removeMe = queue.songs.splice(song - 1, 1)[0];

                    if (!removeMe) {
                        return errorCustom(interaction, 'Failed to remove the track from the queue.', module.name, client), client;
                    }

                    return embedCustom(
                        interaction,
                        'Removed',
                        '#0000FF',
                        `Removed [\`${removeMe.name}\`](${removeMe.url}) from the queue.`,
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
            //#endregion

            //#region Queue subcommand
            case 'queue':
                if (!queue) {
                    return warnCustom(interaction, 'Nothing is playing right now.', module.name, client);
                } else {
                    var description = queue.songs.map((song, index) => `${index + 1} - [\`${song.name}\`](${song.url})\n`);

                    var maxTimes = Math.ceil(description.length / maxFields);
                    slicedDesc = [];
                    for (var i = 0; i < maxTimes; i++) {
                        slicedDesc.push(description.slice(0, 20).join(''));
                        description = description.slice(20);
                    }
                    slicedDesc.forEach(async (m, index) => {
                        const embMsg = new EmbedBuilder()
                            .setTitle(`Stormageddon Music Queue - ${index + 1} of ${slicedDesc.length}`)
                            .setColor('#0E4CB0')
                            .setDescription(m)
                            .setFooter({
                                text: `Requested by ${interaction.user.username}`,
                                iconURL: null,
                            })
                            .setTimestamp();

                        if (index > 0) {
                            channel.send({ embeds: [embMsg] });
                        } else {
                            interaction.reply({ embeds: [embMsg] });
                        }
                    });
                }
                break;
            //#endregion

            //#region Shuffle subcommand
            case 'shuffle':
                if (!queue) {
                    return warnCustom(interaction, 'Nothing is playing right now.', module.name, client);
                } else if (queue.songs.length == 1) {
                    return warnCustom(interaction, 'There is not another song in the queue.', module.name, client);
                } else {
                    queue.shuffle();
                    embedCustom(
                        interaction,
                        'Shuffled',
                        '#0000FF',
                        `Queue successfully shuffled.`,
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
            //#endregion

            //#region Skip subcommand
            case 'skip':
                if (!queue) {
                    return warnCustom(interaction, 'Nothing is playing right now.', module.name, client);
                } else if (queue.songs.length == 1) {
                    return warnCustom(interaction, 'There is not another song in the queue.', module.name, client);
                } else {
                    var song = queue.songs[0];
                    queue.skip().then(() => {
                        embedCustom(
                            interaction,
                            'Skipped',
                            '#0000FF',
                            `[\`${song.name}\`](${song.url}) successfully skipped.`,
                            {
                                text: `Requested by ${interaction.user.username}`,
                                iconURL: null,
                            },
                            null,
                            [],
                            null,
                            null
                        );
                    });
                }
                break;
            //#endregion

            //#region SkipTo subcommand
            case 'skipto':
                var skip = interaction.options.getInteger('song');
                if (!queue) {
                    return warnCustom(interaction, 'Nothing is playing right now.', module.name, client);
                } else if (skip < 2 || skip > queue.songs.length) {
                    return warnCustom(interaction, `Number must be between 2 and ${queue.songs.length}`, module.name, client);
                } else if (!skip || isNaN(skip)) {
                    return warnCustom(interaction, 'No song information was included in the command.', module.name, client);
                } else {
                    queue.songs = queue.songs.splice(skip - 2);
                    queue.skip().then((s) => {
                        embedCustom(
                            interaction,
                            'Skipped',
                            '#0000FF',
                            `Skipped to [\`${s.name}\`](${s.url}).`,
                            {
                                text: `Requested by ${interaction.user.username}`,
                                iconURL: null,
                            },
                            null,
                            [],
                            null,
                            null
                        );
                    });
                }
                break;
            //#endregion

            //#region Stop subcommand
            case 'stop':
                if (!queue || !queue.voiceChannel) {
                    return warnCustom(interaction, 'Nothing is playing right now.', module.name, client);
                } else {
                    queue.stop().then(() => {
                        queue.voice.leave();
                        embedCustom(
                            interaction,
                            'Stop',
                            '#0000FF',
                            `Music Stopped.`,
                            {
                                text: `Requested by ${interaction.user.username}`,
                                iconURL: null,
                            },
                            null,
                            [],
                            null,
                            null
                        );
                    });
                }
                break;
            //#endregion

            //#region Volume subcommand
            case 'volume':
                var volume = interaction.options.getNumber('song');

                if (!queue) {
                    return warnCustom(interaction, 'Nothing is playing right now.', module.name, client);
                } else if (!volume) {
                    embedCustom(
                        interaction,
                        'Volume',
                        '#0000FF',
                        `Volume is currently ${queue.volume}%.`,
                        {
                            text: `Requested by ${interaction.user.username}`,
                            iconURL: null,
                        },
                        null,
                        [],
                        null,
                        null
                    );
                } else {
                    queue.setVolume(volume);
                    embedCustom(
                        interaction,
                        'Volume',
                        '#0000FF',
                        `Volume changed to ${queue.volume}%.`,
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
            //#endregion
        }
    },
    //#endregion
};
//#endregion
