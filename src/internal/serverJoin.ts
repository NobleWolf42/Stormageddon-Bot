//#region Helpers
import { Client, GuildMember, Role } from 'discord.js';
//#endregion

//#region Modules
import { MongooseServerConfig } from '../models/serverConfig.js';
//#endregion

//#region Function that listens for someone to join a server and then gives them a role if this feature is enabled
/**
 * This function listens for someone to join a server and then gives them a role if this feature is enabled.
 * @param {Client} client - Discord.js Client Object
 */
function serverJoin(client: Client) {
    client.on('guildMemberAdd', async (guildMember: GuildMember) => {
        //Gets serverConfig from database
        var serverConfig = (await MongooseServerConfig.findById(guildMember.guild.id).exec()).toObject();

        if (serverConfig.joinRole.enabled) {
            guildMember.addRole(guildMember.guild.roles.find((role: Role) => role.name === serverConfig.joinRole.role));
        }
    });
}
//#endregion

//#region exports
export { serverJoin };
//#endregion
