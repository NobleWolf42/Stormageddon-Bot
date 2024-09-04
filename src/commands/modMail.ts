//#region Import
import { EmbedBuilder } from 'discord.js';
import { errorCustom, warnCustom, warnDisabled } from '../helpers/embedMessages.js';
import { Command } from '../models/commandModel.js';
//#endregion

//#region This exports the modmail command with the information about it
const modMailCommand: Command = {
    name: 'modmail',
    type: ['DM'],
    aliases: [],
    coolDown: 15,
    class: 'direct',
    usage: '!modmail ***SERVER-NAME***, ***MESSAGE*** ',
    description: 'Whisper via Stormageddon to all moderators for the specified server.',
    async execute(message, args, client, distube, collections, serverConfig) {
        var argsString = args.join(' ');
        var newArgs = argsString.split(', ');
        var serverID = null;
        var servername = newArgs[0];
        var content = newArgs[1];

        client.guilds.cache.forEach(function (key) {
            if (key.name == servername) {
                serverID = key.id;
            }
        });

        if (serverID != 0 && serverConfig[serverID] != undefined) {
            if (serverConfig[serverID].modMail.enable) {
                var modList = serverConfig[serverID].modMail.modList;

                for (let key in modList) {
                    var mod = await client.users.fetch(modList[key]);
                    const embMsg = new EmbedBuilder()
                        .setTitle(`Mod Mail from: ${servername}`)
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
        } else if (serverConfig[serverID] == undefined) {
            return errorCustom(message, `The \`!setup\` command has not been run on \`${servername}\` yet.`, this.name, client);
        } else {
            return warnCustom(message, 'The server you specified does not have this bot, or you failed to specify a server.', this.name);
        }
    },
};
//#endregion

//#region Exports
export default modMailCommand;
//#endregion
