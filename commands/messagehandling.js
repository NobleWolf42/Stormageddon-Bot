//#region Initalize
    //#region Dependancies
    var Discord = require('discord.js');
    var fs = require('fs');

    var DoggoLinks = require('../helpers/doggoLinks.js');
    var Agify = require('./agify.js');
    var Clear = require('./clear.js');
    var Destiny2Commands = require('./destiny2.js');
    var Help = require('./help.js');
    var ISS = require('./iss.js');
    var Quote = require('./quote.js');
    var Torture = require('./torture.js');
    var Music = require('./music.js');
    var userHandeling = require('../helpers/userHandeling.js');
    var intervalMgr = require('../helpers/intervalManagers.js')
    var pfx = require('./changeprefix.js')
    var AutoRole = require('./autorole.js');
    //#endregion
//#endregion

//#region Message Handling
function messageHandeling(client) {
    //Handels Messages and their responses
    client.on("message", message => {

        //#region Permission Checks
        // Make sure bots can't run this command
        if (message.author.bot) return;

        // Make sure the command can only be run in a server
        if (!message.guild) return;
        //#endregion

        //#region Varibles for the message info needed
        var serverid = message.channel.guild.id;
        var userInputNoLower = message.content.split(' ');
        var userInput = message.content.toLowerCase().split(' ');
        var noncommand = '';
        var command = userInput[0];
        var userRoles = message.author.lastMessage.member._roles;
        var serverRoles = message.channel.guild.roles;
        var adminTF = userHandeling.adminCheck(userRoles, serverRoles, serverid);
        var modTF = userHandeling.modCheck(userRoles, serverRoles, serverid);
        var djTF = userHandeling.djCheck(userRoles, serverRoles, serverid);
        var prefixFile = JSON.parse(fs.readFileSync('../data/botprefix.json'));

        if (prefixFile[serverid] != undefined) {
            if (prefixFile[serverid].prefix != undefined) {
                var prefix = prefixFile[serverid].prefix;
            }
            else {
                var prefix = "!";
            }
        }
        else {
            var prefix = "!";
        }

        for (i = 1; i <= userInputNoLower.length; i++) {
            if (userInputNoLower.length != 2) {
                if (i < (userInputNoLower.length - 1)) {
                    noncommand += (userInputNoLower[i] + ' ');
                }
                else {
                    noncommand += userInputNoLower[i-1];
                }
            }
            else {
                if (userInputNoLower[i] != undefined) {
                    noncommand += userInputNoLower[i];
                }
            }
        }
        //#endregion

        //#region replys to meow/mew/cat/kitty/squirrel
        if((userInput.includes('meow')) || (userInput.includes('mew')) || (userInput.includes('cat')) || (userInput.includes('kitty')) || (userInput.includes('squirrel'))) {
            var attachment = new Discord.Attachment(DoggoLinks.getRandomDoggo());

            message.channel.send("Bork Bork Bork Bork Bork");
            message.channel.send(attachment);

            intervalMgr.setIntervalTimes(function () {
                var attachment = new Discord.Attachment(DoggoLinks.getRandomDoggo());

                message.author.send("Bork Bork Bork Bork Bork");
                message.author.send(attachment);
            }, 2000, 3)
        }
        //#endregion

        //#region for all @ Commands
        if(message.mentions.users.first() !== undefined) {

            //@magma
            if(message.mentions.users.first().id === '211865015592943616') {
                var attachment = new Discord.Attachment('https://cdn.discordapp.com/attachments/254389303294165003/649734083366223895/kji50lq4nhq11.png');
                message.channel.send('Nep Nep Nep Nep Nep Nep Nep');
                message.channel.send(attachment);
            }

            //@storm
            if(message.mentions.users.first().id === '645141555719569439') {
                var attachment = new Discord.Attachment(DoggoLinks.getRandomDoggo());
                message.channel.send(`Woof Woof, My Prefix is \`${prefix}\``);
                message.channel.send(attachment);
            }
        }
        //#endregion

        //Everything after this point requires a prefix
        if (!message.content.startsWith(prefix)) return;

        //#region AutoRole Commands
        //Runs AutoRole Message Generation
        if ((command === (prefix + 'createautorolemsg') && (adminTF === true))){
            AutoRole.sendRoleMessage(message, serverid, client);
            message.delete().catch(O_o=>{});
            return;
        };
        //#endregion

        //#region Register
        if (command == (prefix + 'register')) {
            userHandeling.refreshUser();
            if (message.author.id in userAccountInfo) {
                var txt = `You Have Already Registered.\nThe last time you updated your info was ${userAccountInfo[message.author.id].time}\n If you wish to update you info now, please click on this link: ${config.general.registerLink}`;
                var color = 2385434;
            }
            else {
                var txt = `Click on this link to register: ${config.general.registerLink}`;
                var color = 0xb50000;
            }


            const embMsg = new Discord.RichEmbed()
                .setTitle('Register')
                .setColor(color)
                .setDescription(txt);
            message.author.send(embMsg);
            message.delete().catch(O_o=>{})
            return;
        }
        //#endregion

        //#region Music Bot Commands
        if (((command == (prefix + 'play') || (command == (prefix + 'skip')) || (command == (prefix + 'stop')) || (command == (prefix + 'pause')) || (command == (prefix + 'resume'))) && (djTF == false))) {
            message.reply(`You do not have access to this command, To gain acces to this command you must have a DJ Role.`);
            return;
        }
        else if ((command == (prefix + 'volume')) && (modTF == false)) {
            message.reply(`You do not have access to this command, To gain acces to this command you must be a **BOT MOD*.`);
            return;
        }

        if (djTF == true) {
            if (command == (prefix + 'play')) {
                Music.execute(message, noncommand);
                return;
            }
            else if (command == (prefix + 'skip')) {
                Music.skip(message);
                return;
            }
            else if (command == (prefix + 'stop')) {
                Music.stop(message);
                return;
            }
            else if (command == (prefix + 'pause')) {
                Music.pause(message);
                return;
            }
            else if (command == (prefix + 'resume')) {
                Music.resume(message);
                return;
            }
        }

        if (modTF == true) {
            if (command == (prefix + 'volume')) {
                Music.volume(message, userInput[1]);
                return;
            }
        }

        if (command == (prefix + 'nowplaying')) {
            Music.nowPlaying(message);
            return;
        }
        else if (command == (prefix + 'showqueue')) {
            Music.showQueue(message);
            return;
        }
        //#endregion

        //#region prefix Command
        if((command === (prefix + 'changeprefix')) && (adminTF == true)) {

            var isSymbol = /[`~!$%^&*()_+-={}[\]\|\\:";'<>?,.\/]/;

            if(userInput[1] != undefined) {
                if ((userInput[1].length == 1) && (isSymbol.test(userInput[1]))){
                    pfx.prefixChange(userInput[1], serverid);

                    const embMsg = new Discord.RichEmbed()
                        .setTitle('Current Prefix:')
                        .setColor(32768)
                        .setDescription('Current Prefix is ' + userInput[1]);
                    message.channel.send(embMsg);
                    return;
                }
                else {
                    const embMsg = new Discord.RichEmbed()
                        .setTitle('Error!')
                        .setColor(0xb50000)
                        .setDescription('Bot Prefix Must be one of the following: ````~!$%^&*()_+-={}[]|\:";\'<>?,./```');
                    message.channel.send(embMsg);
                    return;
                }
            }
            else {
                const embMsg = new Discord.RichEmbed()
                    .setTitle('Error!')
                    .setColor(0xb50000)
                    .setDescription('You must define a bot prefix.');
                message.channel.send(embMsg);
                return;
            }
        }
        else if((command === (prefix + 'changeprefix')) && (adminTF === false)) {
            const embMsg = new Discord.RichEmbed()
            .setTitle('Error!')
            .setColor(0xb50000)
            .setDescription('You lack the required permissions to change the prefix!');
            message.channel.send(embMsg);
            return;
        }
        //#endregion

        //#region iss command
        else if (command == (prefix + 'iss')) {
            ISS.iss(message);
        }
        //#endregion

        //#region agify command
        else if (command == (prefix + 'agify')) {
            Agify.agify(message);
        }
        //#endregion

        //#region d2 commands
        else if (command == (prefix + 'd2')) {
            if (userInput[1] == "status") {
                Destiny2Commands.getStatus(message, message.content.toLowerCase().substring(11));
            }
            else if (userInput[1] == "clan") {
                Destiny2Commands.getClan(message, message.content.toLowerCase().substring(9));
            }
            return;
        }
        //#endregion

        //#region help Command
        else if(command === (prefix + 'help')) {
            Help.getHelp(message);
        }
        //#endregion

        //#region Chat Clear
        if((command === (prefix + 'clear')) && (adminTF == true)) {
            Clear.clearMessages(message);
        }
        //#endregion

        //#region quote command
        else if (command == (prefix + 'quote')) {
            // Get a random index (random quote) from list of quotes in quotes.json
            Quote.getRandomQuote(message);
        }
        //#endregion

        //#region torture command
        else if (command == (prefix + 'torture') && (adminTF === true)) {
            // Call Torture helper function
            message.mentions.members.forEach((member) => {
                Torture.torture(message, member);
            });
            return;
        }
        //#endregion
    });
}
//#endregion

//#region exports
module.exports = { messageHandeling };
//#endregion