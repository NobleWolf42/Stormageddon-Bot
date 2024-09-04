//#region Import
import { EmbedBuilder } from 'discord.js';
import { embedCustom } from '../helpers/embedMessages.js';
import { Command } from '../models/commandModel.js';
//#endregion

//#region This creates the bugreport command with the information about it
const bugReportCommand: Command = {
    name: 'bugreport',
    type: ['DM'],
    aliases: [],
    coolDown: 60,
    class: 'direct',
    usage: '!bugreport ***MESSAGE***',
    description: 'Whisper via Stormageddon to report a bug to the developers of Stormageddon. (Only works in Direct Message.)',
    async execute(message, args, client) {
        var argsString = args.join(' ');
        var newArgs = argsString.split(', ');
        var content = newArgs[0];

        var devList = process.env.devIDs.split(',');

        for (let key in devList) {
            var dev = await client.users.fetch(devList[key]);
            const embMsg = new EmbedBuilder()
                .setTitle('Bug Report')
                .setColor('#F8AA2A')
                .setDescription(content)
                .setFooter({
                    text: `From - ${message.author.tag}.`,
                    iconURL: null,
                })
                .setTimestamp();

            await dev.send({ embeds: [embMsg] });
        }

        embedCustom(
            message,
            'Bug Report Sent.',
            '#0B6E29',
            `**Bug Report:** \`${content}\` \n**Sent To:** \`🐺 The Developers 🐺\``,
            { text: `Requested by ${message.author.tag}`, iconURL: null },
            null,
            [],
            null,
            null
        );
    },
};
//#endregion

//#region Exports
export default bugReportCommand;
//#endregion
