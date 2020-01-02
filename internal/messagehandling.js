//#region Initalize
    //#region Dependancies
    var Discord = require('discord.js');
    var fs = require('fs');

    var DoggoLinks = require('../helpers/doggoLinks.js');
    var Agify = require('../commands/agify.js');
    var Clear = require('../commands/clear.js');
    var Destiny2Commands = require('../commands/destiny2.js');
    var Help = require('../commands/help.js');
    var ISS = require('../commands/iss.js');
    var Quote = require('../commands/quote.js');
    var Torture = require('../commands/torture.js');
    var Music = require('../commands/music.js');
    var userHandeling = require('../helpers/userHandling.js');
    var intervalMgr = require('../helpers/intervalManagers.js')
    var pfx = require('../commands/changeprefix.js')
    var AutoRole = require('../internal/autorole.js');
    var errormsg = require('../helpers/errormessages.js');
    var sconfig = JSON.parse(fs.readFileSync('./data/serverconfig.json', 'utf8'));
    var bconfig = require('../data/botconfig.json');
    var set = require('../commands/setsettings.js');
    var stringHelper = require('../helpers/stringhelpers.js');
    var mail = require('../commands/mail.js');
    //#endregion
//#endregion

//#region Message Handling for Server
function messageHandling(client) {
    //Handels Messages and their responses
    client.on("message", message => {

        //#region Permission Checks
        // Make sure bots can't run this command
        if (message.author.bot) return;

        // Make sure the command can only be run in a server
        if (!message.guild) return;
        //#endregion

        //#region prefix/defaultprefix set
        var serverid = message.channel.guild.id;
        var prefixFile = JSON.parse(fs.readFileSync('./data/botprefix.json', 'utf8'));

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
        console.log(serverid);
        console.log(prefixFile[serverid]);
        //#endregion

        //#region Varible part 1
        var userInputNoLower = message.content.split(' ');
        var userInput = message.content.toLowerCase().split(' ');
        var noncommand = '';
        var command = userInput[0];
        var serverAdmin = message.member.hasPermission('ADMINISTRATOR');
        //#endregion

        //#region for all @ Commands
        if(message.mentions.users.first() !== undefined) {

            //@magma
            if(message.mentions.users.first().id === '211865015592943616') {
                var attachment = new Discord.Attachment('https://cdn.discordapp.com/attachments/254389303294165003/649734083366223895/kji50lq4nhq11.png');
                message.channel.send('Nep Nep Nep Nep Nep Nep Nep');
                message.channel.send(attachment);
                return;
            }

            //@storm
            if(message.mentions.users.first().id === '645141555719569439') {
                var attachment = new Discord.Attachment(DoggoLinks.getRandomDoggo());
                var firstime = '';
                if (sconfig[serverid] == undefined) {
                    firstime = ' Run !setup in an admin only chat channel to set up server.';
                }
                message.channel.send(`Woof Woof, My Prefix is \`${prefix}\`, for more commands, please use the ${prefix}help command.${firstime}`);
                message.channel.send(attachment);
                return;
            }
        }
        //#endregion

        //#region setup command
        if (!(serverid in sconfig)) {
            if ((command == (prefix + 'setup')) && (serverAdmin)) {
                set.setup(message);
            }
            return;
        };
        //#endregion

        //#region Varibles part 2
        var userRoles = message.author.lastMessage.member._roles;
        var serverRoles = message.channel.guild.roles;
        var adminTF = userHandeling.adminCheck(userRoles, serverRoles, serverid);
        var modTF = userHandeling.modCheck(userRoles, serverRoles, serverid);
        var djTF = userHandeling.djCheck(userRoles, serverRoles, serverid);
        
        if (userInput[1] != undefined) {
            if (!userInput[1].startsWith('http')) {
                var noncommand = stringHelper.combineArray(userInputNoLower, 1);
            }
            else {
                var noncommand = userInputNoLower[1];
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
            return;
        }
        //#endregion

        //Everything after this point requires a prefix
        if (!message.content.startsWith(prefix)) return;

        //#region setting commands
        if ((command == (prefix + 'set')) && (serverAdmin)) {

            if (userInput[1] == 'autorole') {
                set.setAutorole(message);
                updatesconfig();
                return;
            }
            else if (userInput[1] == 'joinrole') {
                set.setJoinrole(message);
                updatesconfig();
                return;
            }
            else if (userInput[1] == 'general') {
                set.setGeneral(message);
                updatesconfig();
                return;
            }
            else if (userInput[1] == 'music') {
                set.setMusic(message);
                updatesconfig();
                return;
            }
            else if (userInput[1] == 'modmail') {
                set.setModMail(message);
                updatesconfig();
            }
            else {
                errormsg.custom(message, 'Invalid command, valid commands are `!set` `autorole, joinrole, general, modmail, and music`');
                return;
            }
        }
        else if ((command == (prefix + 'set')) && (!serverAdmin)) {
            errormsg.noServerAdmin(message);
        }
        //#endregion

        //#region AutoRole Commands
        //Runs AutoRole Message Generation
        if ((command === (prefix + 'createautorolemsg') && (adminTF))) {
            if (!sconfig[serverid].autorole.enable) {
                errormsg.disabled(message, 'autorole');
                return;
            }
            else {
                AutoRole.sendRoleMessage(message, serverid, client);
                message.delete().catch(O_o=>{});
                return;
            }
        }
        else if ((command === (prefix + 'createautorolemsg') && (!adminTF))) {
            errormsg.noAdmin(message);
            return;
        }
        //#endregion

        //#region Register
        if (command == (prefix + 'register')) {
            userHandeling.refreshUser();
            if (message.author.id in userAccountInfo) {
                var txt = `You Have Already Registered.\nThe last time you updated your info was ${userAccountInfo[message.author.id].time}\n If you wish to update you info now, please click on this link: ${bconfig.general.registerLink}`;
                var color = 2385434;
            }
            else {
                var txt = `Click on this link to register: ${bconfig.general.registerLink}`;
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

        //#region addmod
        if (command == (prefix + 'addmod') && (adminTF) && (message.mentions.members.first() != undefined)) {
            // Call Torture helper function
            message.mentions.members.forEach((member) => {
                set.addMod(message, member);
            });
            updatesconfig();
            return;
        }
        else if (command == (prefix + 'addmod') && (!adminTF)) {
            errormsg.noAdmin(message);
            return;
        }
        else if (command == (prefix + 'addmod') && (message.mentions.members.first() == undefined)) {
            errormsg.custom(message, 'You must specify a user to torture. Command is !addmod @USERS.');
            return;
        }
        //#endregion

        //#region Info
        if (command == (prefix + 'info')) {
            Help.getInfo(message);
        }
        //#endregion

        //#region Music Bot Commands
        if (((command == (prefix + 'play') || (command == (prefix + 'skip')) || (command == (prefix + 'stop')) || (command == (prefix + 'pause')) || (command == (prefix + 'resume'))))) {
            if (!sconfig[serverid].music.enable) {
                errormsg.disabled(message, 'music');
            }
            else if (sconfig[serverid].music.textChannel != message.channel.name) {
                errormsg.wrongChannel(message, sconfig[serverid].music.textChannel);
                return;
            }
            else if (!djTF) {
                errormsg.noDJ(message);
                return;
            }
        }
        else if ((command == (prefix + 'volume')) && (!modTF)) {
            errormsg.noMod(message);
            return;
        }
        else if ((command == (prefix + 'nowplaying')) || (command == (prefix + 'showqueue'))) {
            if (!sconfig[serverid].music.enable) {
                errormsg.disabled(message, 'music');
            }
            else if (sconfig[serverid].music.textChannel != message.channel.name) {
                errormsg.wrongChannel(message, sconfig[serverid].music.textChannel);
                return;
            }
        }

        if (sconfig[serverid].music.textChannel == message.channel.name) {
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
            
            if (command == (prefix + 'nowplaying')) {
                Music.nowPlaying(message);
                return;
            }
            else if (command == (prefix + 'showqueue')) {
                Music.showQueue(message);
                return;
            }
        }
        if(modTF == true || adminTF == true) {
            if (command == (prefix + 'volume')) {
                Music.volume(message, userInput[1]);
                return;
            }
        }
        //#endregion

        //#region prefix Command
        if((command === (prefix + 'changeprefix')) && (adminTF)) {

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
        else if((command === (prefix + 'changeprefix')) && (!adminTF)) {
            errormsg.noAdmin(message);
            return;
        }
        //#endregion

        //#region iss command
        if (command == (prefix + 'iss')) {
            ISS.iss(message);
            return;
        }
        //#endregion

        //#region agify command
        if (command == (prefix + 'agify')) {
            Agify.agify(message);
            return;
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
            Help.getHelp(adminTF, message, serverAdmin);
            return;
        }
        //#endregion

        //#region Chat Clear
        if((command === (prefix + 'clear')) && (adminTF)) {
            Clear.clearMessages(message);
            return;
        }
        else if ((command === (prefix + 'clear')) && (!adminTF)) {
            errormsg.noAdmin(message);
            return;
        }
        //#endregion

        //#region quote command
        if (command == (prefix + 'quote')) {
            // Get a random index (random quote) from list of quotes in quotes.json
            Quote.getRandomQuote(message);
            return;
        }
        //#endregion

        //#region torture command
        if (command == (prefix + 'torture') && (adminTF) && (message.mentions.members.first() != undefined)) {
            // Call Torture helper function
            message.mentions.members.forEach((member) => {
                Torture.torture(message, member);
            });
            return;
        }
        else if (command == (prefix + 'torture') && (!adminTF)) {
            errormsg.noAdmin(message);
            return;
        }
        else if (command == (prefix + 'torture') && (message.mentions.members.first() == undefined)) {
            errormsg.custom(message, 'You must specify a user to torture. Command is !torture @USERS.');
            return;
        }
        //#endregion
    });
}
//#endregion

//#region Message Handling for PM
function PMHandling (client) {
    client.on("message", message => {

        //#region Permission Checks
        // Make sure the command can only be run in a server
        if (message.guild) return;

        // Make sure bots can't run this command
        if (message.author.bot) return;
        //#endregion

        //#region varibles
        var userInputNoLowerComma = message.content.split(', ');
        var userInputComma = message.content.toLowerCase().split(', ');
        var userInputNoLower = message.content.split(' ');
        var userInput = message.content.toLowerCase().split(' ');
        var command = userInput[0];
        //#endregion

        //#region modmail command
        if (userInputComma[0] == ('!modmail')) {
            mail.modMailSend(client, message, userInputNoLowerComma[1], userInputNoLowerComma[2]);
        }
        //#endregion

        //#region devSend command
        if ((command == ('!devsend')) && (bconfig.devids.includes(message.author.id))) {
            mail.devSend(client, message, userInputNoLower[1], stringHelper.combineArray(userInputNoLower, 2));
        }
        else if ((command == ('!devsend')) && (!bconfig.devids.includes(message.author.id))) {
            errormsg.custom(message, 'You do not have acces to that command. It is for the **BOT DEVS ONLY**. Your attempt has been logged.');
            mail.bugReport(client, message, `${message.author.tag} has attempted to use devsend.`);
        }
        //#endregion

        //#region modmail command
        if (command == ('!bugreport')) {
            mail.bugReport(client, message, userInputNoLower[1]);
        }
        //#endregion
    })
};
//#endregion

//#region updatesconfig function
async function updatesconfig() {
    sconfig = await set.updateConfigFile();
};
//#endregion

//#region exports
module.exports = { messageHandling, PMHandling };
//#endregion