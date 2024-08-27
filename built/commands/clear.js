//#region Helpers
var _a = require('../helpers/embedMessages.js'), errorCustom = _a.errorCustom, embedCustom = _a.embedCustom, warnCustom = _a.warnCustom, errorNoMod = _a.errorNoMod;
var modCheck = require('../helpers/userPermissions.js').modCheck;
//#endregion
//#region This exports the clear command with the information about it
module.exports = {
    name: 'clear',
    type: ['Guild'],
    aliases: ['clr', 'delete', 'clean'],
    coolDown: 0,
    class: 'admin',
    usage: 'clear ***NUMBER(2-99)***',
    description: 'Bulk deletes the previous messages in a chat based on user input, up to 99 previous messages.',
    execute: function (message, args, client, distube) {
        var amount = parseInt(args[0]);
        if (!modCheck(message)) {
            return errorNoMod(message, module.name);
        }
        if (isNaN(amount)) {
            return warnCustom(message, "That is not a valid number for the `".concat(message.prefix, "clear` command!"), module.name);
        }
        else if (amount < 2 || amount > 99) {
            return warnCustom(message, "".concat(args[0], " is an invalid number! __**Number must be between 1 and 100!**__"), module.name);
        }
        else if (amount >= 2 && amount <= 99) {
            message.delete();
            message.deleted = true;
            message.channel
                .bulkDelete(amount)
                .then(function () {
                return embedCustom(message, 'Success!', '#008000', "Successfully deleted ".concat(amount, " messages!"), {
                    text: "Requested by ".concat(message.author.tag),
                    iconURL: null,
                }, null, [], null, null);
            })
                .catch(function (err) {
                if (err.message ==
                    'You can only bulk delete messages that are under 14 days old.') {
                    return warnCustom(message, "You can only bulk delete messages that are under 14 days old.", module.name);
                }
                else {
                    return errorCustom(message, "An error occurred while attempting to delete! ".concat(err.message), module.name, client);
                }
            });
        }
    },
};
//#endregion
