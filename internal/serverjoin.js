//#region Dependancies
const { updateConfigFile } = require("../helpers/currentsettings.js");
var serverConfig = updateConfigFile();
//#endregion

//#region code that happens when someone joins a server
function serverJoin(client) {
   serverConfig = updateConfigFile();
   client.on('guildMemberAdd', (guildMember) => {
      if (serverConfig[guildMember.guild.id].autorole.joinroleenabled) {
         guildMember.addRole(guildMember.guild.roles.find(role => role.name === serverConfig[guildMember.guild.id].autorole.joinrole));
      }
   });
}
//#endregion

//#region exports
module.exports = { serverJoin };
//#endregion