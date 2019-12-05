var Discord = require('discord.js');

function clearMessages(message) {
    var userInput = message.content.toLowerCase().split(' ');
    var amount = userInput[1];
    var passed = true;

    if(isNaN(amount)) {
        const embMsg = new Discord.RichEmbed()
            .setTitle('Error!')
            .setColor(0xb50000)
            .setDescription('That is not a valid number for the ' + prefix + 'clear command!');
        message.channel.send(embMsg);
        passed = false;
    } else if(amount < 2 || amount > 100) {
        const embMsg = new Discord.RichEmbed()
            .setTitle('Error!')
            .setColor(0xb50000)
            .setDescription(userInput[1] + ' is invalid! Number must be between 2 and 100!');
        message.channel.send(embMsg);
        passed = false;
    }

    if(amount >= 2 && amount <= 100) {
        message.channel.bulkDelete(amount, true).catch(err => {
            console.error(err);
            const embMsg = new Discord.RichEmbed()
                .setTitle('Error!')
                .setColor(0xb50000)
                .setDescription('An error occurred while attempting to delete!');
            message.channel.send(embMsg);
            passed = false;
        });
        if(passed == true) {
            const embMsg = new Discord.RichEmbed()
                .setTitle('Success!')
                .setColor(32768)
                .setDescription('As Per ' + message.author.tag + ', successfully deleted ' + amount + ' messages!');
            message.channel.send(embMsg);
        }
    }
}

module.exports = { clearMessages };