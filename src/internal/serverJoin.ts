//#region Helpers
import { Client, GuildMember } from 'discord.js';
//#endregion

//#region Modules
import { MongooseServerConfig } from '../models/serverConfigModel.js';
//#endregion

//#region Function that listens for someone to join a server and then gives them a role if this feature is enabled
/**
 * This function listens for someone to join a server and then gives them a role if this feature is enabled.
 * @param client - Discord.js Client Object
 */
function serverJoin(client: Client) {
    client.on('guildMemberAdd', async (guildMember: GuildMember) => {
        //Gets serverConfig from database
        var serverConfig = (await MongooseServerConfig.findById(guildMember.guild.id).exec()).toObject();

        if (serverConfig.joinRole.enable) {
            guildMember.roles.add(guildMember.guild.roles.resolve(serverConfig.joinRole.role));
        }
    });
}
//#endregion

//#region exports
export { serverJoin };
//#endregion
