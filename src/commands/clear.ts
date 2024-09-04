//#region Import
import { errorCustom, embedCustom, warnCustom, errorNoMod } from '../helpers/embedMessages.js';
import { modCheck } from '../helpers/userPermissions.js';
import { Command } from '../models/commandModel.js';
//#endregion

//#region This creates the clear command with the information about it
const clearCommand: Command = {
    name: 'clear',
    type: ['Guild'],
    aliases: ['clr', 'delete', 'clean'],
    coolDown: 0,
    class: 'admin',
    usage: 'clear ***NUMBER(2-99)***',
    description: 'Bulk deletes the previous messages in a chat based on user input, up to 99 previous messages.',
    async execute(message, args, client, distube, collections, serverConfig) {
        const channel = message.channel;
        var amount = parseInt(args[0]);

        if (channel.isDMBased()) {
            return;
        }

        if (!modCheck(message)) {
            return errorNoMod(message, this.name);
        }

        if (isNaN(amount)) {
            return warnCustom(message, `That is not a valid number for the \`${serverConfig.prefix}clear\` command!`, this.name);
        } else if (amount < 2 || amount > 99) {
            return warnCustom(message, `${args[0]} is an invalid number! __**Number must be between 1 and 100!**__`, this.name);
        } else if (amount >= 2 && amount <= 99) {
            message.delete();
            message.deleted = true;
            channel
                .bulkDelete(amount)
                .then(() => {
                    return embedCustom(
                        message,
                        'Success!',
                        '#008000',
                        `Successfully deleted ${amount} messages!`,
                        {
                            text: `Requested by ${message.author.tag}`,
                            iconURL: null,
                        },
                        null,
                        [],
                        null,
                        null
                    );
                })
                .catch((err) => {
                    if (err.message == 'You can only bulk delete messages that are under 14 days old.') {
                        return warnCustom(message, `You can only bulk delete messages that are under 14 days old.`, this.name);
                    } else {
                        return errorCustom(message, `An error occurred while attempting to delete! ${err.message}`, this.name, client);
                    }
                });
        }
    },
};
//#endregion

//#region Exports
export default clearCommand;
//#endregion
