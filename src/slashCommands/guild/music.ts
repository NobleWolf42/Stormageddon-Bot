//#region Imports
import { EmbedBuilder, GuildMember, SlashCommandBuilder, MessageFlags } from 'discord.js';
import { Client as GeniusClient } from 'genius-lyrics';
import { Innertube } from 'youtubei.js';
import { embedCustom, errorCustom, errorNoDJ, errorNoMod, warnCustom, warnDisabled, warnWrongChannel } from '../../helpers/embedSlashMessages.js';
import { addToLog } from '../../helpers/errorLog.js';
import { djCheck, modCheck } from '../../helpers/userSlashPermissions.js';
import { MongooseServerConfig } from '../../models/serverConfigModel.js';
import { SlashCommand } from '../../models/slashCommandModel.js';
import { LogType } from '../../models/loggingModel.js';
//#endregion

//#region Initialization
const Genius = new GeniusClient();
//#endregion

//#region This exports the music command with the information about it
const musicSlashCommand: SlashCommand = {
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
    async execute(client, interaction, distube, _collections) {
        //#region Function wide variables and permission checks
        //Max fields for an embed per discord, change this if it ever changes
        const maxFields = 20;

        //#region Escape Logic
        if (!interaction.isChatInputCommand() || !(interaction.member instanceof GuildMember)) {
            return;
        }

        //Sets some global music variables
        const voiceChannel = interaction.member.voice.channel;
        const queue = distube.getQueue(interaction.guildId);

        //Checks to see if user is in a voice channel
        if (!voiceChannel) {
            warnCustom(interaction, 'You must join a voice channel to use this command!', musicSlashCommand.data.name);
            return;
        } else if (queue && voiceChannel.id != queue.voiceChannel.id) {
            warnCustom(interaction, `You must join the <#${queue.voiceChannel.id}> voice channel to use this command!`, musicSlashCommand.data.name);
            return;
        }

        //Calls serverConfig from database
        const serverConfig = (await MongooseServerConfig.findById(interaction.guildId).exec()).toObject();

        //Checks to see if the music feature is enabled in this server
        if (!serverConfig.music.enable) {
            warnDisabled(interaction, 'music', musicSlashCommand.data.name);
            return;
        }

        //Checks to see if the user has DJ access
        if (!djCheck(interaction, serverConfig)) {
            errorNoDJ(interaction, musicSlashCommand.data.name);
            return;
        }

        //Checks to see if the interaction was sent in the correct channel
        const channel = await client.channels.fetch(interaction.channelId);

        if (channel.isDMBased() || !channel.isTextBased()) {
            return;
        }

        if (serverConfig.music.textChannel != channel.id) {
            warnWrongChannel(interaction, serverConfig.music.textChannel, musicSlashCommand.data.name);
            return;
        }
        //#endregion
        //#endregion

        //#region Subcommand handling
        switch (interaction.options.getSubcommand()) {
            //#region Play subcommand
            case 'play': {
                const regex =
                    /^(?:https?:\/\/)?(?:(?:www|m)\.)?(?:youtube\.com|youtu\.be|music\.youtube\.com)(?:\/(?:(?:watch\?v=|embed\/|v\/|shorts\/|live\/)?([\w-]{11}))(?:\S+)?|\/playlist\?list=((?:PL|UU|LL|RD|OL)[\w-]{16,41}))(?:\S+)?/;
                let song = interaction.options.getString('song');
                //Checks to see if a song input is detected, is there is a song it checks to see if there is a queue, if there is no queue it plays the song, if there is an queue it will add it to the end of the queue
                if (!song) {
                    warnCustom(interaction, 'No song input detected, please try again.', musicSlashCommand.data.name);
                    return;
                } else if (song.match(regex)) {
                    const youtube = await Innertube.create();
                    const info = await youtube.getBasicInfo(Array.from(song.matchAll(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/gi), (m) => m[1])[0]);
                    song = info.basic_info.title;
                }

                distube.play(voiceChannel, song, {
                    member: interaction.member,
                    textChannel: channel,
                });
                interaction.reply({
                    content: 'Adding...',
                    flags: MessageFlags.Ephemeral,
                });
                break;
            }
            //#endregion

            //#region Autoplay subcommand
            case 'autoplay': {
                const autoPlay = queue.toggleAutoplay();
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
            }
            //#endregion

            //#region Loop subcommand
            case 'loop': {
                const loopMode = interaction.options.getString('looptype');
                const mods = ['song', 'queue', 'off'];

                if (!queue) {
                    warnCustom(interaction, 'Nothing is playing right now.', musicSlashCommand.data.name);
                    return;
                }

                if (!mods.includes(loopMode)) {
                    warnCustom(interaction, `You must use one of the following options: ${mods.join(', ')}`, musicSlashCommand.data.name);
                    return;
                }

                switch (loopMode) {
                    case 'song': {
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
                    }

                    case 'queue': {
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
                    }

                    case 'off': {
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
            }
            //#endregion

            //#region Lyrics subcommand
            case 'lyrics': {
                if (!queue) {
                    warnCustom(interaction, 'There is nothing playing.', musicSlashCommand.data.name);
                    return;
                }

                let lyrics: string = null;

                try {
                    const searches = await Genius.songs.search(queue.songs[0].name);
                    const song = searches[0];
                    lyrics = await song.lyrics();
                    if (!lyrics) {
                        lyrics = `No lyrics found for ${queue.songs[0].name}.`;
                    }

                    const slicedLyrics: string[] = [];
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
                } catch (error) {
                    addToLog(LogType.FatalError, musicSlashCommand.data.name, interaction.user.username, interaction.guild.name, channel.name, error, client);
                    lyrics = `No lyrics found for ${queue.songs[0].name}.`;
                }
                break;
            }
            //#endregion

            //#region Pause subcommand
            case 'pause': {
                if (!queue) {
                    warnCustom(interaction, 'Nothing is playing right now.', musicSlashCommand.data.name);
                    return;
                }

                if (queue.paused) {
                    warnCustom(interaction, 'Music is already paused.', musicSlashCommand.data.name);
                    return;
                }

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
                break;
            }
            //#endregion

            //#region Resume subcommand
            case 'resume': {
                if (!queue) {
                    return warnCustom(interaction, 'Nothing is playing right now.', musicSlashCommand.data.name);
                }

                if (!queue.paused) {
                    return warnCustom(interaction, 'Music is not paused.', musicSlashCommand.data.name);
                }

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
                break;
            }
            //#endregion

            //#region PlayNext subcommand
            case 'playnext': {
                if (!modCheck(interaction, serverConfig)) {
                    errorNoMod(interaction, musicSlashCommand.data.name);
                    return;
                }

                const song = interaction.options.getString('song');
                const songNum = Number(song);

                if (!queue) {
                    warnCustom(interaction, 'Nothing is playing right now.', musicSlashCommand.data.name);
                    return;
                }

                if (!song) {
                    warnCustom(interaction, 'No song information was included in the command.', musicSlashCommand.data.name);
                    return;
                }

                if (songNum > 0 && songNum <= queue.songs.length) {
                    const playNext = queue.songs.splice(songNum - 1, 1)[0];

                    if (!playNext) {
                        errorCustom(interaction, 'Failed to find the track in the queue.', musicSlashCommand.data.name, client);
                        return;
                    }

                    //FIX this error in the future, distube and discordjs hate each other apparently
                    distube.play(voiceChannel, song, {
                        member: interaction.member,
                        textChannel: channel,
                        position: 1,
                    });
                } else {
                    //FIX this error in the future, distube and discordjs hate each other apparently
                    distube.play(voiceChannel, song, {
                        member: interaction.member,
                        textChannel: channel,
                        position: 1,
                    });
                }
                break;
            }
            //#endregion

            //#region Remove subcommand
            case 'remove': {
                const song = interaction.options.getInteger('song');
                if (!queue) {
                    warnCustom(interaction, 'Nothing is playing right now.', musicSlashCommand.data.name);
                    return;
                }

                if (song < 1 || song > queue.songs.length) {
                    warnCustom(interaction, `Number must be between 1 and ${queue.songs.length}`, musicSlashCommand.data.name);
                    return;
                }

                if (!song || isNaN(song)) {
                    warnCustom(interaction, 'No song information was included in the command.', musicSlashCommand.data.name);
                    return;
                }

                if (song == 1) {
                    const oldSong = queue.songs[0];
                    queue.skip().then(() => {
                        embedCustom(
                            interaction,
                            'Removed',
                            '#0000FF',
                            `Removed [\`${oldSong.name}\`](${oldSong.url}) from the queue.`,
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
                    const removeMe = queue.songs.splice(song - 1, 1)[0];

                    if (!removeMe) {
                        errorCustom(interaction, 'Failed to remove the track from the queue.', musicSlashCommand.data.name, client);
                        return;
                    }

                    embedCustom(
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
            }
            //#endregion

            //#region Queue subcommand
            case 'queue': {
                if (!queue) {
                    warnCustom(interaction, 'Nothing is playing right now.', musicSlashCommand.data.name);
                    return;
                }

                let description = queue.songs.map((song, index) => `${index + 1} - [\`${song.name}\`](${song.url})\n`);

                const maxTimes = Math.ceil(description.length / maxFields);
                const slicedDesc: string[] = [];
                for (let i = 0; i < maxTimes; i++) {
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
                break;
            }
            //#endregion

            //#region Shuffle subcommand
            case 'shuffle': {
                if (!queue) {
                    warnCustom(interaction, 'Nothing is playing right now.', musicSlashCommand.data.name);
                    return;
                }

                if (queue.songs.length == 1) {
                    warnCustom(interaction, 'There is not another song in the queue.', musicSlashCommand.data.name);
                    return;
                }

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
                break;
            }
            //#endregion

            //#region Skip subcommand
            case 'skip': {
                if (!queue) {
                    warnCustom(interaction, 'Nothing is playing right now.', musicSlashCommand.data.name);
                    return;
                }

                if (queue.songs.length == 1) {
                    warnCustom(interaction, 'There is not another song in the queue.', musicSlashCommand.data.name);
                    return;
                }

                const song = queue.songs[0];
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
                break;
            }
            //#endregion

            //#region SkipTo subcommand
            case 'skipto': {
                const skip = interaction.options.getInteger('song');
                if (!queue) {
                    warnCustom(interaction, 'Nothing is playing right now.', musicSlashCommand.data.name);
                    return;
                }

                if (skip < 2 || skip > queue.songs.length) {
                    warnCustom(interaction, `Number must be between 2 and ${queue.songs.length}`, musicSlashCommand.data.name);
                    return;
                }

                if (!skip || isNaN(skip)) {
                    warnCustom(interaction, 'No song information was included in the command.', musicSlashCommand.data.name);
                    return;
                }

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
                break;
            }
            //#endregion

            //#region Stop subcommand
            case 'stop': {
                if (!queue || !queue.voiceChannel) {
                    warnCustom(interaction, 'Nothing is playing right now.', musicSlashCommand.data.name);
                    return;
                }

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
                break;
            }
            //#endregion

            //#region Volume subcommand
            case 'volume': {
                const volume = interaction.options.getNumber('song');

                if (!queue) {
                    warnCustom(interaction, 'Nothing is playing right now.', musicSlashCommand.data.name);
                    return;
                }

                if (!volume) {
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
            }
            //#endregion
        }
    },
    //#endregion
};
//#endregion

//#region Exports
export default musicSlashCommand;
//#endregion
