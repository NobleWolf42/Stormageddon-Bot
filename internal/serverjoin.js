//#region Dependancies
var config = require('../data/serverconfig.json');
//#endregion

//#region code that happens when someone joins a server
function serverJoin(client) {
   client.on('guildMemberAdd', (guildMember) => {
      if (config[guildMember.guild.id].autorole.joinroleenabled) {
         guildMember.addRole(guildMember.guild.roles.find(role => role.name === config[guildMember.guild.id].autorole.joinrole));
      }
   });
}
//#endregion

//#region exports
module.exports = { serverJoin };
//#endregion