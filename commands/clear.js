//#region Helpers
const { errorCustom, embedCustom, warnCustom } = require('../helpers/embedMessages.js');
//#endregion

//#region This exports the clear command with the information about it
module.exports = {
    name: "clear",
    type: ['Guild'],
    aliases: ['clr', 'delete', 'remove', 'clean'],
    coolDown: 0,
    class: 'admin',
    usage: 'clear ***NUMBER(1-99)***',
    description: "Bulk deletes the previous messages in a chat based on user input, up to 99 previous messages.",
    execute(message, args, client, distube) {
        var amount = parseInt(args[0]);

        if(isNaN(amount)) {
            return warnCustom(message, `That is not a valid number for the \`${message.prefix}clear\` command!`, module.name);
        }
        else if (amount < 1 || amount > 100) {
            return warnCustom(message, `${args[0]} is an invalid number! __**Number must be between 1 and 100!**__`, module.name);
        }
        else if(amount >= 1 && amount <= 100) {
            message.delete();
            message.deleted = true;
            message.channel.bulkDelete(amount, true).catch(err => {
                console.error(err);
                return errorCustom(message, 'An error occurred while attempting to delete!', module.name, client)
            });
            return embedCustom(message, 'Success!', '#008000', `Successfully deleted ${amount} messages!`, { text: `Requested by ${message.author.tag}`, iconURL: null }, null, [], null, null);
        }
    }
}
//#endregion
