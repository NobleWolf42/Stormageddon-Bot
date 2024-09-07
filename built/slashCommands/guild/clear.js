var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//#region Imports
import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { errorCustom, embedCustom, warnCustom } from '../../helpers/embedSlashMessages.js';
//#endregion
//#region This exports the clear command with the information about it
const clearSlashCommand = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Bulk deletes the previous messages in a chat, up to 99 previous messages.')
        .addNumberOption((option) => option.setName('amount').setDescription('The number of messages to delete (1-100).').setRequired(true).setMinValue(1).setMaxValue(100))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    execute(client, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            //#region Escape Logic
            if (!interaction.isChatInputCommand()) {
                return;
            }
            const amount = Number(interaction.options.getInteger('amount'));
            if (isNaN(amount)) {
                warnCustom(interaction, `That is not a valid number for the clear command!`, clearSlashCommand.data.name);
                return;
            }
            if (amount < 1 || amount > 100) {
                warnCustom(interaction, `${amount} is an invalid number! __**Number must be between 1 and 100!**__`, clearSlashCommand.data.name);
                return;
            }
            const channel = yield client.channels.fetch(interaction.channelId);
            if (!channel.isTextBased() || channel.isDMBased()) {
                return;
            }
            //#endregion
            channel
                .bulkDelete(amount, true)
                .then(() => {
                embedCustom(interaction, 'Success!', '#008000', `Successfully deleted ${amount} messages!`, {
                    text: `Requested by ${interaction.user.tag}`,
                    iconURL: null,
                }, null, [], null, null);
            })
                .catch((err) => {
                if (err.message == 'You can only bulk delete messages that are under 14 days old.') {
                    warnCustom(interaction, `You can only bulk delete messages that are under 14 days old.`, clearSlashCommand.data.name);
                    return;
                }
                else {
                    errorCustom(interaction, `An error occurred while attempting to delete! ${err.message}`, clearSlashCommand.data.name, client);
                    return;
                }
            });
        });
    },
};
//#endregion
//#region Exports
export default clearSlashCommand;
//#endregion
