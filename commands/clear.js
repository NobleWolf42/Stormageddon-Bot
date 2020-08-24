//#region Dependancies
const { errorCustom, embedCustom, warnCustom } = require('../helpers/embedMessages.js');
//#endregion

//#region Clear Messages Command
module.exports = {
    name: "clear",
    type: ['Guild'],
    aliases: ['clr', 'delete', 'remove'],
    cooldown: 0,
    class: 'admin',
    usage: 'clear ***NUMBER(1-99)***',
    description: "Bulk deletes the previous messages in a chat based on user input, up to 99 previous messages.",
    execute(message, args) {
        var amount = parseInt(args[0]);
        var passed = true;

        if(isNaN(amount)) {
            warnCustom(message, `That is not a valid number for the \`${message.prefix}clear\` command!`, module.name);
            passed = false;
        }
        else if (amount < 1 || amount > 99) {
            warnCustom(message, `${args[0]} is an invalid number! __**Number must be between 1 and 99!**__`, module.name);
            passed = false;
        }
        else if(amount >= 1 && amount <= 99) {
            message.channel.bulkDelete((amount + 1), true).catch(err => {
                console.error(err);
                errorCustom(message, 'An error occurred while attempting to delete!', module.name)
                passed = false;
            });
            if(passed == true) {
                embedCustom(message, 'Sucess!', '#008000', `As Per \`${message.author.tag}\`, successfully deleted ${amount} messages!`);
            }
        }
    }
}