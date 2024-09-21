//#region Import
import { EmbedBuilder } from 'discord.js';
import { errorCustom, warnCustom, warnDisabled } from '../helpers/embedMessages.js';
import { Command } from '../models/commandModel.js';
import { MongooseServerConfig } from '../models/serverConfigModel.js';
//#endregion

//#region This exports the modmail command with the information about it
const modMailCommand: Command = {
    name: 'modmail',
    type: ['DM'],
    aliases: [],
    coolDown: 15,
    class: 'direct',
    usage: '!modmail ***SERVER-ID***, ***MESSAGE*** ',
    description: 'Whisper via Stormageddon to all moderators for the specified server.',
    async execute(message, args, client) {
        const newArgs = args.join(' ').split(', ');
        const serverID = newArgs[0];
        const content = newArgs[1];

        const serverConfig = (await MongooseServerConfig.findById(serverID).exec()).toObject();

        if (serverID != null && serverConfig != undefined) {
            if (serverConfig.modMail.enable) {
                for (const key of serverConfig.modMail.modList) {
                    const mod = await client.users.fetch(key);
                    const embMsg = new EmbedBuilder()
                        .setTitle(`Mod Mail from: ${(await client.guilds.fetch(serverID)).name}`)
                        .setColor('#0B6E29')
                        .setDescription(content)
                        .setFooter({
                            text: `Requested by ${message.author.tag}`,
                            iconURL: null,
                        })
                        .setTimestamp();

                    mod.send({ embeds: [embMsg] });
                }
            } else {
                return warnDisabled(message, 'modMail', this.name);
            }
        } else if (serverConfig == undefined) {
            return errorCustom(message, `The \`!setup\` command has not been run on \`${(await client.guilds.fetch(serverID)).name}\` yet.`, this.name, client);
        } else {
            return warnCustom(message, 'The server you specified does not have this bot, or you failed to specify a server.', this.name);
        }
    },
};
//#endregion

//#region Exports
export default modMailCommand;
//#endregion
