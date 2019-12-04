//#region Dependency
var Discord = require('discord.js');
var YouTube = require('simple-youtube-api');
var ytdl = require('ytdl-core');
var fs = require("fs");
var xmlhttp = require("xmlhttprequest");
var XMLHttpRequest = xmlhttp.XMLHttpRequest;
var config = require('./config.json');
var prefixFile = {};
var cmdObj = require('./commands.json');
var doggoLinks = [];
var quotes = [];
var adminRoleIDs = [];
var modRoleIDs = [];
var djRoleIDs = [];
var userAccountInfo = {};
var queue = new Map();
//#endregion

//#region Creates missing files on start
function createJSONfiles() {

    var emptyFile = {};

    if (!fs.existsSync("./botprefix.json")) {
        fs.writeFile("botprefix.json", JSON.stringify(emptyFile), function(err) {
            if (err) {
                console.log(err);
            }
        });
    }

    updateFilevaribles();
}

function updateFilevaribles(){
    prefixFile = require('./botprefix.json');
}
//#endregion

//#region Login / Initialize
// Initialize Discord Bot
var client = new Discord.Client();
const youtube = new YouTube(config.auth.GOOGLE_API_KEY);

//Throws Error if bot's token is not set.
if (config.auth.token === 'YOUR BOT TOKEN' || config.auth.token === '') {
    throw new Error("The 'auth.token' property is not set in the config.js file. Please do this!");
}

//Logs the bot into discord, using it's auth token
client.login(config.auth.token);

//Logs the Bot info when bot starts
client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`)
    getDoggoPics();
    getQuotes();
    createJSONfiles();
    client.user.setPresence({ game: { name: `Use !help to show commands` } });
});

//Logs Errors
client.on('error', console.error);

//#endregion

//#region Server Rolls
//Function that calls the server roles
function serverRoleUpdate(sRole, serverid) {
    
    //Sets Local Varibles
    var basicServerRoles = {};

    //Saves the Server Roles to an object by name
    for (let [key, value] of sRole) {
        index = value.name;
        basicServerRoles[index] = key;
    }

    //Loops throught the Admin Role Names, pushing them to an array
    for (key in config[serverid].general.adminRoles) {
        
        //Pushes role IDs to Admin if they Match config[serverid].general.adminRoles
        if (basicServerRoles[config[serverid].general.adminRoles[key]]){
            adminRoleIDs.push(basicServerRoles[config[serverid].general.adminRoles[key]]);
        }
    }

    //Loops throught the Mod Role Names, pushing them to an array
    for (key in config[serverid].general.modRoles) {
        
        //Pushes role IDs to Mods if they Match config[serverid].general.modRoles
        if (basicServerRoles[config[serverid].general.modRoles[key]]){
            modRoleIDs.push(basicServerRoles[config[serverid].general.modRoles[key]]);
        }
    }

    //Loops throught the DJ Role Names, pushing them to an array
    for (key in config[serverid].general.djRoles) {
        
        //Pushes role IDs to DJs if they Match config[serverid].general.djRoles
        if (basicServerRoles[config[serverid].general.djRoles[key]]){
            djRoleIDs.push(basicServerRoles[config[serverid].general.djRoles[key]]);
        }
    }
}

//#endregion

//#region Admin / Mod / DJ Check
//Function that returns boolean for if the user who sent the message is an Admin (based off config[serverid].connection.adminRoles)
function adminCheck(userRolesArray, serverRolesArray, serverid) {
    
    //Calls a function that updates the server role information
    serverRoleUpdate(serverRolesArray, serverid);
    
    //Checks to see if any of the user role ids match any of the admin role ids
    for (key in userRolesArray) {
        
        for (a in adminRoleIDs) {

            if (userRolesArray[key] == adminRoleIDs [a]) {

                return true;
            }
        }
    }

    return false;
}

//Function that returns boolean for if the user who sent the message is a Moderator (based off config[serverid].connection.modRoles)
function modCheck(userRolesArray, serverRolesArray, serverid) {
    
    //Calls a function that updates the server role information
    serverRoleUpdate(serverRolesArray, serverid);
    
    //Checks to see if user role ids match any of the mod role ids
    for (key in userRolesArray) {
        
        for (a in modRoleIDs) {

            if (userRolesArray[key] == modRoleIDs [a]) {

                return true;
            }
        }
    }

    return false;
}

//Function that returns boolean for if the user who sent the message is a DJ (based off config[serverid].connection.djRole)
function djCheck(userRolesArray, serverRolesArray, serverid) {
    
    //Calls a function that updates the server role information
    serverRoleUpdate(serverRolesArray, serverid);
    
    //Checks to see if user role ids match any of the mod role ids
    for (key in userRolesArray) {
        
        for (a in djRoleIDs) {

            if (userRolesArray[key] == djRoleIDs [a]) {

                return true;
            }
        }
    }

    return false;
}

//#endregion

//#region Message Handling
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
    var adminTF = adminCheck(userRoles, serverRoles, serverid);
    var modTF = modCheck(userRoles, serverRoles, serverid);
    var djTF = djCheck(userRoles, serverRoles, serverid);
    
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
        var attachment = new Discord.Attachment(doggoLinks[getRandomInt(103)]);

        message.channel.send("Bork Bork Bork Bork Bork");
        message.channel.send(attachment);

        setIntervalTimes(function () {
            var attachment = new Discord.Attachment(doggoLinks[getRandomInt(103)]);

            message.author.send("Bork Bork Bork Bork Bork");
            message.author.send(attachment);
        }, 5000, 7)
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
            var attachment = new Discord.Attachment(doggoLinks[getRandomInt(103)]);
            message.channel.send('Woof Woof');
            message.channel.send(attachment);
        }
    }
    //#endregion

    //Everything after this point requires a prefix
    if (!message.content.startsWith(prefix)) return;

    //#region AutoRole Commands
    //Runs AutoRole Message Generation
    if ((command === (prefix + 'createautorolemsg') && (adminTF === true))){
        sendRoleMessage(message, serverid);
        return;
    };
    //#endregion

    //#region Register
    if (command == (prefix + 'register')) {
        refreshUser();
        console.log(userAccountInfo);
        if (message.author.id in userAccountInfo) {
            var txt = `You Have Already Registered.\nThe last time you updated your info was ${userAccountInfo[message.author.id].time}\n If you wish to update you info now, please click on this link: ${config.general.registerLink}`;
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
    }
    //#endregion

    //#region Music Bot Commands
    if (((command == (prefix + 'play') || (command == (prefix + 'skip')) || (command == (prefix + 'stop')) || (command == (prefix + 'pause')) || (command == (prefix + 'resume'))) && (djTF == false))) {
        message.reply(`You do not have access to this command, To gain acces to this command you must have a DJ Role.`)
    }
    else if ((command == (prefix + 'volume')) && (modTF == false)) {
        message.reply(`You do not have access to this command, To gain acces to this command you must be a **BOT MOD*.`)
    }

    if (djTF == true) {
        if (command == (prefix + 'play')) {
            execute(message, noncommand);
            return;
        }
        else if (command == (prefix + 'skip')) {
            skip(message);
            return;
        }
        else if (command == (prefix + 'stop')) {
            stop(message);
            return;
        }
        else if (command == (prefix + 'pause')) {
            pause(message);
            return;
        }
        else if (command == (prefix + 'resume')) {
            resume(message);
            return;
        }
    }

    if (modTF == true) {
        if (command == (prefix + 'volume')) {
            volume(message, userInput[1]);
            return;
        }
    }

    if (command == (prefix + 'nowplaying')) {
        nowPlaying(message);
        return;
    }
    else if (command == (prefix + 'showqueue')) {
        showQueue(message);
        return;
    }
    //#endregion

    //#region prefix Command
    if((command === (prefix + 'changeprefix')) && (adminTF == true)) {
        
        var isSymbol = /[`~!$%^&*()_+-={}[\]\|\\:";'<>?,.\/]/;

        if(userInput[1] != undefined) {
            if ((userInput[1].length == 1) && (isSymbol.test(userInput[1]))){
                prefixChange(userInput[1], serverid);

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
    else if (command === 'prefix') {
        const embMsg = new Discord.RichEmbed()
            .setTitle('Current Prefix:')
            .setColor(32768)
            .setDescription('Current Prefix is ' + prefix);
        message.channel.send(embMsg);
        return;
    }
    //#endregion

    //#region iss command
    if (command == (prefix + 'iss')) {
        var request = new XMLHttpRequest()
        request.open('GET', 'http://api.open-notify.org/astros.json', true)
        request.onload = function() {
           // Begin accessing JSON data here
           var data = JSON.parse(request.responseText)
    
           if (request.status >= 200 && request.status < 400) {
             var response = "\n [Astronaut Information]";

             Array.from(data.people).forEach(function(people){
               response += "\n " + people.name + " : " + people.craft;
             })
             
              message.reply(response);
          } else {
             console.log('error');
             message.reply("The ISS API was unable to be reached at this time. \n Try again later.");
          }
        }

        request.send()
    }
    //#endregion

    //#region agify command
    if (command == (prefix + 'agify')) {
        var request = new XMLHttpRequest()
        request.open('GET', 'https://api.agify.io/?name='+userInput[1], true)
        request.onload = function() {
            // Begin accessing JSON data here
            var data = JSON.parse(request.responseText)
    
            if (request.status >= 200 && request.status < 400) {
                // Capitalizing the first lettter of the returned name
                var capitalizedname = userInput[1].charAt(0).toUpperCase() + userInput[1].slice(1);

                message.reply("\n The age of " + capitalizedname + " is estimated at " + data.age + ".");
            } else {
                console.log('error');
                message.reply("The Agify API was unable to be reached at this time. \n Try again later.");
            }
        }

        request.send()
    }
    //#endregion

    //#region d2 commands
    if (command == (prefix + 'd2')) {
        if (userInput[1] == "status") {
            var pers_name = message.content.toLowerCase().substring(11);
            var request = new XMLHttpRequest()
            request.open('GET', 'https://www.bungie.net/Platform//User/SearchUsers?q='+pers_name, true);
            request.setRequestHeader('X-API-KEY', '671b3211756445cbb83b5d82f6682ebd');
            request.onload = function() {
            // Begin accessing JSON data here
            var data = JSON.parse(request.responseText)["Response"][0]
    
            if (request.status >= 200 && request.status < 400 ) {
                if (data != null) {
                message.reply("\n User was last updated at " + data["lastUpdate"] + "\n User began their journey at " + data["firstAccess"]);
                }
                else {
                    message.reply("\n The Search for a user by that name returned no results. \n Try something else.");
                }
            } else {
                message.reply("The Destiny API was unable to be reached at this time. \n Try again later.");
            }
        }

        request.send()
        }
        else if (userInput[1] == "clan") {
            var clan_name = message.content.toLowerCase().substring(9);
            var request = new XMLHttpRequest()
            request.open('GET', 'https://www.bungie.net/Platform/GroupV2/Name/'+clan_name+'/1', true);
            request.setRequestHeader('X-API-KEY', '671b3211756445cbb83b5d82f6682ebd');
            request.onload = function() {
                // Begin accessing JSON data here
                var data = JSON.parse(request.responseText)["Response"]
        
                if (request.status >= 200 && request.status < 400) {
                    if (data != null) {
                        var domain = "https://www.bungie.net/";
                        // Clan Avatar + about section
                        var attachment = new Discord.Attachment(domain + data["detail"]["avatarPath"]);
                        message.channel.send(data["detail"]["about"], attachment);
                        //Founder Profile pic + name
                        var attachment = new Discord.Attachment(domain + data["founder"]["bungieNetUserInfo"]["iconPath"]);
                        message.channel.send("The founder is " + data["founder"]["bungieNetUserInfo"]["displayName"],attachment);
                        // Clan Creation Date
                        message.reply("The clan was created on " + data["detail"]["creationDate"]);
                    }
                    else {
                        message.reply("\n The Search for a clan by that name returned no results. \n Try something else.");
                    }
                } else {
                    message.reply("The Destiny API was unable to be reached at this time. \n Try again later.");
                }
            }
    
            request.send()
        }
    }
    //#endregion

    //#region dog/storm Commands
    if((command === (prefix + 'dog')) || (command === (prefix + 'storm'))) {
        var attachment = new Discord.Attachment(doggoLinks[getRandomInt(103)]);
        message.channel.send(attachment);
        return;
    }
    //#endregion

    //#region help Command
    if(command === (prefix + 'help')) {
        var txt = "";
        if (userInput[1] == 'help') {
            for (key in cmdObj.help) {
                if (key != "prefix"){
                    txt += prefix + key + ' - ' + cmdObj.help[key] + '\n';
                }
                else {
                    txt += key + ' - ' + cmdObj.help[key] + '\n';
                }
            }
        }
        else if (userInput[1] == 'music') {
            for (key in cmdObj.music) {
                if (key != "prefix"){
                    txt += prefix + key + ' - ' + cmdObj.music[key] + '\n';
                }
                else {
                    txt += key + ' - ' + cmdObj.music[key] + '\n';
                }
            }
        }
        else if (userInput[1] == 'admin') {
            for (key in cmdObj.admin) {
                if (key != "prefix"){
                    txt += prefix + key + ' - ' + cmdObj.admin[key] + '\n';
                }
                else {
                    txt += key + ' - ' + cmdObj.admin[key] + '\n';
                }
            }
        }
        else if (userInput[1] == 'fun') {
            for (key in cmdObj.fun) {
                if (key != "prefix"){
                    txt += prefix + key + ' - ' + cmdObj.fun[key] + '\n';
                }
                else {
                    txt += key + ' - ' + cmdObj.fun[key] + '\n';
                }
            }
        }
        else if (userInput[1] == 'gaming') {
            for (key in cmdObj.gaming) {
                if (key != "prefix"){
                    txt += prefix + key + ' - ' + cmdObj.gaming[key] + '\n';
                }
                else {
                    txt += key + ' - ' + cmdObj.gaming[key] + '\n';
                }
            }
        }
        else {
            for (key in cmdObj.help) {
                if (key != "prefix"){
                    txt += prefix + key + ' - ' + cmdObj.help[key] + '\n';
                }
                else {
                    txt += key + ' - ' + cmdObj.help[key] + '\n';
                }
            }
        }
        
        const embMsg = new Discord.RichEmbed()
            .setTitle('Help')
            .setColor(0xb50000)
            .setDescription(txt);
        message.channel.send(embMsg);
        return;
    }
    //#endregion

    //#region Chat Clear
    if((command === (prefix + 'clear')) && (adminTF == true)) {
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
    //#endregion
    
    //#region quote command
    if (command == (prefix + 'quote')) {
        // Get a random index (random quote) from list of quotes in quotes.json
        var random_index = getRandomInt(15);

        message.channel.send(
            "\"" + quotes[random_index].text + 
            "\" \n Cited from " + quotes[random_index].author + "." + 
            " \n Picked by " + quotes[random_index].submitter + "."
        );
    }
    //#endregion

    //#region torture command
    if (command == (prefix + 'torture') && (adminTF === true)) {
        // Call Torture helper function
        message.mentions.members.forEach((member) => {
            torture_helper(message, member);
        });
    }
    //#endregion
});
//#endregion

//#region Prefix Changing
function prefixChange(newPrefix, serverid) {
    prefixFile[serverid] = {"prefix": newPrefix};

    fs.writeFile("./botprefix.json", JSON.stringify(prefixFile), (err) => {
        if (err) {
            console.error(err);
            return;
        };
    });
}
//#endregion

//#region get random int function
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }
//#endregion

//#region Imgur Handling for Storm Pics
function getDoggoPics() {
    for (key in require('./stormpics.json').data) {
        doggoLinks.push(require('./stormpics.json').data[key].link);
    }
}
//#endregion

//#region Quote handing
function getQuotes() {
    for (key in require('./quotes.json').data) {
        quotes.push(require('./quotes.json').data[key]);
    }
}
//#endregion

//#region Set An Interval that only runs x times function (setIntervalTimes)
function setIntervalTimes(callback, delay, repetitions) {
    var x = 0;
    var intervalID = setInterval(function () {
        
        callback();

        if (++x === repetitions) {
            clearInterval(intervalID);
        }
    }, delay);
}
//#endregion

//#region Refresh User Account Info
function refreshUser() {
    userAccountInfo = JSON.parse(fs.readFileSync('./userinfo.json', 'utf8'));
}
//#endregion

//#region Music Bot Functionality
//Execute the Play Command Function
async function execute(msg, url) {
    const voiceChannel = msg.member.voiceChannel;

    if (!voiceChannel) return msg.reply('I\'m sorry but you need to be in a voice channel to play music!');
        
    const permissions = voiceChannel.permissionsFor(msg.client.user);
        
    if (!permissions.has('CONNECT')) {
	    return msg.reply('I cannot connect to your voice channel, make sure I have the proper permissions!');
	}
        
    if (!permissions.has('SPEAK')) {
		return msg.reply('I cannot speak in this voice channel, make sure I have the proper permissions!');
	}

	if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
        const playlist = await youtube.getPlaylist(url);
        const videos = await playlist.getVideos();
        if (videos.length <= 30) {
		    for (const video of Object.values(videos)) {
			    const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
			    await handleVideo(video2, msg, voiceChannel, true); // eslint-disable-line no-await-in-loop
            }
            return msg.channel.send(`✅ Playlist: **${playlist.title}** has been added to the queue!`);
        }
        else if (videos.length > 30) {
            return msg.reply(`🆘 Playlist: **${playlist.title}** has too many videos! You may only queue playlists tha have 30 or less videos.`);
        }
    }
    else {
		try {
			var video = await youtube.getVideo(url);
        }
        catch (error) {
            
            try {
				var videos = await youtube.searchVideos(url, 10);
				let index = 0;
				msg.channel.send(`__**Song selection:**__\n${videos.map(video2 => `**${++index} -** ${video2.title} ----- ${video2.id}`).join('\n')}\nPlease provide a value to select one of the search results ranging from 1-10.`);
                
                // eslint-disable-next-line max-depth
				try {
					var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
						maxMatches: 1,
						time: 10000,
						errors: ['time']
					});
                }
                catch (err) {
					console.error(err);
					return msg.channel.send('No or invalid value entered, cancelling video selection.');
				}
                
                const videoIndex = parseInt(response.first().content);
				var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
            }
            catch (err) {
				console.error(err);
				return msg.channel.send('🆘 I could not obtain any search results.');
			}
		}
		return handleVideo(video, msg, voiceChannel);
	}
}

//handlevideo function
async function handleVideo(video, msg, voiceChannel, playlist = false) {
	const serverQueue = queue.get(msg.guild.id);
	const song = {
		id: video.id,
		title: Discord.Util.escapeMarkdown(video.title),
		url: `https://www.youtube.com/watch?v=${video.id}`
	};
	if (!serverQueue) {
		const queueConstruct = {
			textChannel: msg.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 20,
			playing: true
		};
		queue.set(msg.guild.id, queueConstruct);

		queueConstruct.songs.push(song);

		try {
			var connection = await voiceChannel.join();
			queueConstruct.connection = connection;
			play(msg.guild, queueConstruct.songs[0]);
		} catch (error) {
			console.error(`I could not join the voice channel: ${error}`);
			queue.delete(msg.guild.id);
			return msg.channel.send(`I could not join the voice channel: ${error}`);
		}
	} else {
		serverQueue.songs.push(song);
		if (playlist) return undefined;
		else return msg.channel.send(`✅ **${song.title}** has been added to the queue!`);
	}
	return undefined;
}

//play function
function play(guild, song) {
	const serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}

	const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
		.on('end', reason => {
			if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
			else console.log(reason);
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => console.error(error));
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 100);

	serverQueue.textChannel.send(`🎶 Start playing: **${song.title}**`);
}

//skip function
function skip(msg) {
    const serverQueue = queue.get(msg.guild.id);

    if (!msg.member.voiceChannel) return msg.reply('You are not in a voice channel!');
		if (!serverQueue) return msg.reply('There is nothing playing that I could skip for you.');
	    serverQueue.connection.dispatcher.end('Skip command has been used!');
        return undefined;
}

//stop function
function stop(msg) {
    const serverQueue = queue.get(msg.guild.id);

    if (!msg.member.voiceChannel) return msg.reply('You are not in a voice channel!');
		if (!serverQueue) return msg.reply('There is nothing playing that I could stop for you.');
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end('Stop command has been used!');
		return undefined;
}

function volume(msg, volumePercent) {
    const serverQueue = queue.get(msg.guild.id);

    if (!msg.member.voiceChannel) return msg.reply('You are not in a voice channel!');
		if (!serverQueue) return msg.reply('There is nothing playing.');
		if (!volumePercent) return msg.channel.send(`The current volume is: **${serverQueue.volume}**`);
        if ((volumePercent >= 1) && (volumePercent <= 100)) {
            serverQueue.volume = volumePercent;
		    serverQueue.connection.dispatcher.setVolumeLogarithmic(volumePercent / 100);
            return msg.channel.send(`I set the volume to: **${volumePercent}%**`);
        }
        else {
            return msg.reply(`**${volumePercent}** is not a valid volume setting, you must choose a value inbetween 1-100.`);
        }
}

function nowPlaying(msg) {
    const serverQueue = queue.get(msg.guild.id);

    if (!serverQueue) return msg.reply('There is nothing playing.');
    return msg.channel.send(`🎶 Now playing: **${serverQueue.songs[0].title}**`);
}

function showQueue(msg) {
    const serverQueue = queue.get(msg.guild.id);

    if (!serverQueue) return msg.reply('There is nothing playing.');
		return msg.channel.send(`__**Song queue:**__\n${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}\n**Now playing:** ${serverQueue.songs[0].title}`);
}

function pause(msg) {
    const serverQueue = queue.get(msg.guild.id);

    if (serverQueue && serverQueue.playing) {
        serverQueue.playing = false;
        serverQueue.connection.dispatcher.pause();
        return msg.channel.send('⏸ Paused the music for you!');
    }
    return msg.reply('There is nothing playing.');
}

function resume(msg) {
    const serverQueue = queue.get(msg.guild.id);

    if (serverQueue && !serverQueue.playing) {
        serverQueue.playing = true;
        serverQueue.connection.dispatcher.resume();
        return msg.channel.send('▶ Resumed the music for you!');
    }
    return msg.reply('There is nothing playing.');
}
//#endregion

//#region Autoroll
//Function that will create messages to allow you to assign yourself a role
function generateMessages(serverid) {
    return config[serverid].autorole.roles.map((r, e) => {
        return {
            role: r,
            message: `React below to get the **"${r}"** role!`, //DONT CHANGE THIS,
            emoji: config[serverid].autorole.reactions[e]
        };
    });
}

//Function that generates embed feilds if config[serverid].autorole.embed is set to true
function generateEmbedFields(serverid) {
    return config[serverid].autorole.roles.map((r, e) => {
        return {
            emoji: config[serverid].autorole.reactions[e],
            role: r
        };
    });
}

// Handles the creation of the role reactions. Will either send the role messages separately or in an embed, depending on your settings in config[serverid].json
function sendRoleMessage(message, serverid) {

    //Checks to make sure your roles and reactions match up
    if (config[serverid].autorole.roles.length !== config[serverid].autorole.reactions.length) {
        throw new Error("Roles list and reactions list are not the same length! Please double check this in the config[serverid].js file");
    }  
    
    // We don't want the bot to do anything further if it can't send messages in the channel
    if (message.guild && !message.channel.permissionsFor(message.guild.me).missing('SEND_MESSAGES')) return;
    
    if (config[serverid].autorole.deleteSetupCMD) {
        const missing = message.channel.permissionsFor(message.guild.me).missing('MANAGE_MESSAGES');
        // Here we check if the bot can actually delete messages in the channel the command is being ran in
        if (missing.includes('MANAGE_MESSAGES'))
            throw new Error("I need permission to delete your command message! Please assign the 'Manage Messages' permission to me in this channel!");
        message.delete().catch(O_o=>{});
    }

    const missing = message.channel.permissionsFor(message.guild.me).missing('MANAGE_MESSAGES');

    // Here we check if the bot can actually add recations in the channel the command is being ran in
    if (missing.includes('ADD_REACTIONS'))
        throw new Error("I need permission to add reactions to these messages! Please assign the 'Add Reactions' permission to me in this channel!");

    if (!config[serverid].autorole.embed) {
        if (!config[serverid].autorole.initialMessage || (config[serverid].autorole.initialMessage === '')) 
            throw "The 'initialMessage' property is not set in the config[serverid].js file. Please do this!";

        message.channel.send(config[serverid].autorole.initialMessage);

        const messages = generateMessages(serverid);
        for (const { role, message: msg, emoji } of messages) {
            if (!message.guild.roles.find(r => r.name === role))
                throw `The role '${role}' does not exist!`;

            message.channel.send(msg).then(async m => {
                const customCheck = message.guild.emojis.find(e => e.name === emoji);
                if (!customCheck) await m.react(emoji);
                else await m.react(customCheck.id);
            }).catch(console.error);
        }
    } else {
        if (!config[serverid].autorole.embedMessage || (config[serverid].autorole.embedMessage === ''))
            throw "The 'embedMessage' property is not set in the config[serverid].js file. Please do this!";
        if (!config[serverid].autorole.embedFooter || (config[serverid].autorole.embedMessage === ''))
            throw "The 'embedFooter' property is not set in the config[serverid].js file. Please do this!";

        const roleEmbed = new Discord.RichEmbed()
            .setDescription(config[serverid].autorole.embedMessage)
            .setFooter(config[serverid].autorole.embedFooter);

        if (config[serverid].autorole.embedColor) roleEmbed.setColor(config[serverid].autorole.embedColor);

        if (config[serverid].autorole.embedThumbnail && (config[serverid].autorole.embedThumbnailLink !== '')) 
            roleEmbed.setThumbnail(config[serverid].autorole.embedThumbnailLink);
        else if (config[serverid].autorole.embedThumbnail && message.guild.icon)
            roleEmbed.setThumbnail(message.guild.iconURL);

        const fields = generateEmbedFields(serverid);
        if (fields.length > 25) throw "That maximum roles that can be set for an embed is 25!";

        for (const { emoji, role } of fields) {
            if (!message.guild.roles.find(r => r.name === role))
                throw `The role '${role}' does not exist!`;

            const customEmote = client.emojis.find(e => e.name === emoji);
            
            if (!customEmote) roleEmbed.addField(emoji, role, true);
            else roleEmbed.addField(customEmote, role, true);
        }

        message.channel.send(roleEmbed).then(async m => {
            for (const r of config[serverid].autorole.reactions) {
                const emoji = r;
                const customCheck = client.emojis.find(e => e.name === emoji);
                
                if (!customCheck) await m.react(emoji);
                else await m.react(customCheck.id);
            }
        });
    }
};

// This makes the events used a bit more readable
const events = {
	MESSAGE_REACTION_ADD: 'messageReactionAdd',
	MESSAGE_REACTION_REMOVE: 'messageReactionRemove',
};

// This event handles adding/removing users from the role(s) they chose based on message reactions
client.on('raw', async event => {
    if (!events.hasOwnProperty(event.t)) return;

    const { d: data } = event;
    const user = client.users.get(data.user_id);
    const channel = client.channels.get(data.channel_id);

    const message = await channel.fetchMessage(data.message_id);
    const member = message.guild.members.get(user.id);
    var serverid = message.channel.guild.id;

    const emojiKey = (data.emoji.id) ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.name;
    let reaction = message.reactions.get(emojiKey);

    if (!reaction) {
        // Create an object that can be passed through the event like normal
        const emoji = new Emoji(client.guilds.get(data.guild_id), data.emoji);
        reaction = new MessageReaction(message, emoji, 1, data.user_id === client.user.id);
    }

    let embedFooterText;
    if (message.embeds[0]) embedFooterText = message.embeds[0].footer.text;

    if (
        (message.author.id === client.user.id) && (message.content !== config[serverid].autorole.initialMessage || 
        (message.embeds[0] && (embedFooterText !== config[serverid].autorole.embedFooter)))
    ) {

        if (!config[serverid].autorole.embed && (message.embeds.length < 1)) {
            const re = `\\*\\*"(.+)?(?="\\*\\*)`;
            const role = message.content.match(re)[1];

            if (member.id !== client.user.id) {
                const guildRole = message.guild.roles.find(r => r.name === role);
                if (event.t === "MESSAGE_REACTION_ADD") member.addRole(guildRole.id);
                else if (event.t === "MESSAGE_REACTION_REMOVE") member.removeRole(guildRole.id);
            }
        } else if (config[serverid].autorole.embed && (message.embeds.length >= 1)) {
            const fields = message.embeds[0].fields;

            for (const { name, value } of fields) {
                if (member.id !== client.user.id) {
                    const guildRole = message.guild.roles.find(r => r.name === value);
                    if ((name === reaction.emoji.name) || (name === reaction.emoji.toString())) {
                        if (event.t === "MESSAGE_REACTION_ADD") member.addRole(guildRole.id);
                        else if (event.t === "MESSAGE_REACTION_REMOVE") member.removeRole(guildRole.id);
                    }
                }
            }
        }
    }
});

process.on('unhandledRejection', err => {
    const msg = err.stack.replace(new RegExp(`${__dirname}/`, 'g'), './');
	console.error("Unhandled Rejection", msg);
});
//#endregion

//#region torture function and helper
function torture_helper(message, user) {
    // Assigning variables
    var attachment = new Discord.Attachment(doggoLinks[getRandomInt(103)]);
    var target = getRandomInt(100);

    // Torture game intro
    user.send(
        "Woof Woof <@" + user.id + ">" +
        "\n It's time to play a game like Russian Roulette...." +
        "\n Stormjack but not like Blackjack!" +
        "\n Guess a number between 1 and 100." +
        "\n If you are within 5, you get shamed." +
        "\n If you are more than 5 away from the number, you get kicked!" +
        "\n 30 seconds on the clock, if time runs out, you get shamed AND kicked!"
        , attachment
    ).then((newmsg) => {
        newmsg.channel.awaitMessages(response => (parseInt(response.content)<100), {
            max: 1,
            time: 30000,
            errors: ['time']
        }).then(mg => {
            if (Math.abs((parseInt(mg.first().content)-target) <= 5))  { // guess within range
                user.send(
                    "Right!" +
                    "\n The number was " + target + "." +
                    "\n You were close, but it's time to be kinkshamed by a dog!"
                );

                message.guild.channels.find(x => x.name === "general").send(
                    "<@" + user.id + "> got beaten by the almighty Stormaggedon." +
                    "\n They are into some weird wacky stuff, but they still survived."
                );
            }
            else if (Math.abs((parseInt(mg.first().content)-target)) <= 0){
                user.send(
                    "Right!" +
                    "\n The number was " + target + "." +
                    "\n You actually guessed the right number!"
                );

                message.guild.channels.find(x => x.name === "general").send(
                    "<@" + user.id + "> beat the almighty Stormaggedon." +
                    "\n They are into some weird wacky stuff, but they survived!"
                );
            }
            else { // guess out of range
                user.send(
                    "Wrong!" +
                    "\n Your guess was either too far off, or was not valid." +
                    "\n The number was " + target + "." +
                    "\n It's time to get booted by a ruff ruff like me!"
                );
        
                message.guild.channels.find(x => x.name === "general").send(
                    "<@" + user.id + "> got beaten by the almighty Stormaggedon." +
                    "\n They lost their game of stormjack!"
                ).then((newmsg) => {
                    if (newmsg.mentions.members.first().kick()) {
                        console.log(newmsg.mentions.members.first().username + " was kicked.");
                    }
                })
            }
        }).catch((err) => {
            user.send(
                "Ran out of time!" +
                "\n It's time to be kinkshamed by a dog!"
            );

            message.guild.channels.find(x => x.name === "general").send(
                "<@" + user.id + ">  got beaten by the almighty Stormaggedon." +
                "\n They lost their game of stormjack!"
            ).then((newmsg) => {
                if (newmsg.mentions.members.first().kick()) {
                    console.log(newmsg.mentions.members.first().username + " was kicked.");
                }
            })
        })
    })
}
//#endregion