var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//Work in progrees to make buttons do the heavy lifting
//#region Helpers
const { updateConfigFile } = require('../../helpers/currentSettings.js');
const { errorCustom } = require('../../helpers/embedSlashMessages.js');
//#endregion
//#region Internals
const { setup } = require('../../internal/settingsFunctions.js');
//#endregion
//#region This exports the setup command with the information about it
module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Fist time set up on a server.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    execute(message, args, client, distube) {
        return __awaiter(this, void 0, void 0, function* () {
            //Loads current server config settings
            var serverConfig = updateConfigFile();
            if (serverConfig[message.guild.id].setupNeeded) {
                if (message.member.permissions.has('ADMINISTRATOR')) {
                    yield setup(message);
                }
                else {
                    errorNoServerAdmin(message, module.name);
                }
            }
            else {
                errorCustom(message, 'Server Setup has already been completed.', module.name, client);
            }
            return;
        });
    },
};
export {};
//#endregion
