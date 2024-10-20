var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//#region Dependencies
import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { errorCustom } from '../../helpers/embedSlashMessages.js';
import { setAutoRole, setJoinRole, setMusic, setGeneral, setModMail, setJoinToCreateVC, setBlame, setLogging } from '../../internal/settingsFunctions.js';
import { MongooseServerConfig } from '../../models/serverConfigModel.js';
//#endregion
//#region This exports the set command with the information about it
const setSlashCommand = {
    data: new SlashCommandBuilder()
        .setName('set')
        .setDescription('Allows you to change the settings you set during setup.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption((option) => option.setName('setting').setDescription('Pick the setting to edit.').setRequired(true).setChoices({ name: 'Auto Role', value: 'autorole' }, { name: 'Blame', value: 'blame' }, { name: 'General', value: 'general' }, { name: 'Join Role', value: 'joinrole' }, {
        name: 'Join To Create Voice Channel',
        value: 'jointocreatevc',
    }, { name: 'Logging', value: 'logging' }, { name: 'ModMail', value: 'modmail' }, { name: 'Music', value: 'music' })),
    execute(client, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            //#region Escape Logic
            if (!interaction.isChatInputCommand()) {
                return;
            }
            //#endregion
            const serverConfig = (yield MongooseServerConfig.findById(interaction.guildId).exec()).toObject();
            switch (interaction.options.getString('setting')) {
                case 'autorole':
                    yield setAutoRole(interaction, serverConfig, client);
                    break;
                case 'joinrole':
                    yield setJoinRole(interaction, serverConfig);
                    break;
                case 'general':
                    yield setGeneral(interaction, serverConfig);
                    break;
                case 'music':
                    yield setMusic(interaction, serverConfig);
                    break;
                case 'modmail':
                    yield setModMail(interaction, serverConfig);
                    break;
                case 'jointocreatevc':
                    yield setJoinToCreateVC(interaction, serverConfig);
                    break;
                case 'blame':
                    yield setBlame(interaction, serverConfig);
                    break;
                case 'logging':
                    yield setLogging(interaction, serverConfig);
                    break;
                default:
                    errorCustom(interaction, 'Not a valid settings category!', setSlashCommand.data.name, client);
                    break;
            }
        });
    },
};
//#endregion
//#region Exports
export default setSlashCommand;
//#endregion
