var Discord = require('discord.io');
var fs = require("fs");
var config = require('./config.json');
var queue = [];
var oldqueue = [];
var member_info = [];
var role_ids = [];
var channel_ids = [];

// Initialize Discord Bot
var bot = new Discord.Client({
   token: config.auth.token,
   autorun: true
});

//Include this function at the top of any admin olny commands
function admincheck () {
    //Memory Cleanup
    role_ids = [];

    //Sets server_info to be all info for your server
    server_info = bot.servers[config.connection.server_id];

    //This pulls the role information required to verify Admin
    member_info = server_info.members;
    role = server_info.roles;

    //Makes an array of ids for selected roles
    for (key in role) {

        for (a in config.connection.admin_roles){

            if (role[key].name === config.connection.admin_roles[a]) {
                role_ids.push(role[key].id);
            };
        };
    };
};

//Function for checking roles
function checkarray (user_roles) {

    for (i = 0; i < role_ids.length; i++) {
  
        for (x = 0; x < user_roles.length; x++) {

            if (role_ids[i] === user_roles[x]) {
                return true;
            }
        }
    }
    return false;
}

//Function that checks to see if changes have been made to the queue, and if they have, saves them to a file
function saveQueue () {

    queueOutput = [];

    if (oldqueue != queue) {
        
        for (i = 0; i < queue.length; i++) {
            queueOutput.push({
                "Name": queue[i].Name,
                "Message": queue[i].Message
            });
        }

        fs.writeFile("savedQueue.json", JSON.stringify(queueOutput), function(err) {
            if (err) {
                console.log(err);
            }
        });

        oldqueue = queue;
    }
}

//Loads a saved queue from file, if one exists
function loadQueue () {
    
    if (fs.existsSync("./savedQueue.json")) {

        fs.readFile("./savedQueue.json", function (err, data) {
            if (err) {
                console.log(err);
            }

            var queueInput = JSON.parse(data);

            for (i = 0; i < queueInput.length; i++) {
                queue.push(new User (queueInput[i].Name, queueInput[i].Message));
            }
        });
    }
}

// Checks the given channel ID to the allowed channel IDs in our config
function isChannelAllowed (channelID) {
    
    //Memory Cleanup
    role_ids = [];

    //Sets server_info to be all info for your server
    server_info = bot.servers[config.connection.server_id];

    //This pulls the channel information required to verify Admin
    channels_info = server_info.channels;

    //Makes an array of ids for selected channels
    for (key in channels_info) {

        for (a in config.connection.allowed_channels){

            if (channels_info[key].name === config.connection.allowed_channels[a]) {
                channel_ids.push(channels_info[key].id);
            };
        };
    };
   
    //Returns True if the channel posted in is one of the channels in config.connection.allowed_chanels
    if(channel_ids.indexOf(channelID) != -1) { 
        return true;
    }

    return false;
}

// Sets the Status Message of the bot (i.e. when a user is "Playing Sea Of Thieves")
bot.on('ready', function(evt) {
    bot.setPresence( {game: {name: "*help"}} );
    loadQueue;
    setInterval(saveQueue, 600000);

    //Info code for minor Debugging
    /*for (key in bot.servers[config.connection.server_id].channels) {
        console.log(bot.servers[config.connection.server_id].channels[key]);
    };*/
});

// Listens to Messages and executes various commands
bot.on('message', function (user, userID, channelID, message, evt) {

    // The bot will listen for messages that will start with `*`, in the channels in config.connection.allowed_channels
    if ((message.substring(0, 1) == '*' && isChannelAllowed(channelID))) {
        var args = message.substring(1).split(', ');
        var cmd = args[0];
       
        args = args.splice(1);
        
        // All commands go here
        switch(cmd) {
            
            // *join, adds the user who sent the message to an Array containing the Queue list
            case 'join':
                if (queue.indexOf(String(user + "#" + bot.users[userID].discriminator)) === -1) {
                    queue.push(String(user + "#" + bot.users[userID].discriminator));
                    location = queue.indexOf(String(user + "#" + bot.users[userID].discriminator));
                    bot.sendMessage({
                        to: channelID,
                        message: `You are at position ${location + 1} in the queue!`
                    });
                }
                else {
                    location = queue.indexOf(String(user + "#" + bot.users[userID].discriminator));
                    bot.sendMessage({
                        to: channelID,
                        message: `You are already at position ${location + 1} in the queue!`
                    });
                }
            break;

            // *leave, removes the user who sent the message from the Queue list
            case 'leave':
                queue.splice(queue.indexOf(String(user + "#" + bot.users[userID].discriminator)), 1);
                bot.sendMessage({
                    to: channelID,
                    message: 'You have left the queue!'
                });
            break;

            // *queue, displays the current Queue list
            case 'queue':
                arrtext = "";
                msgtxt = "";
                arrlen = queue.length;

                for (i = 0; i < arrlen; i++) {
                    arrtext += (i + 1) + ' - ' + queue[i] + "\n";
                }

                if (arrtext === ""){
                    arrtext = "Queue is Currently Empty."
                }

                msgtxt = '```' + arrtext + '```';
                bot.sendMessage({
                    to: channelID,
                    message: `${msgtxt}`
                });
            break;

            // *remove, "USERNAME", Server Admin/Creator only command that removes the user specified from the Queue list
            case 'remove':
                admincheck();

                if(checkarray(member_info[userID].roles)) {

                    if (queue.indexOf(String(args)) == -1) {
                        bot.sendMessage({
                            to: channelID,
                            message: `You did not specify a valid user.`
                        });
                    }
                    else {
                        queue.splice(queue.indexOf(String(args)), 1);
                        bot.sendMessage({
                            to: channelID,
                            message: `Removed ${args} from Queue.`
                        });
                    }
                }
                else {
                    bot.sendMessage({
                        to: channelID,
                        message: `You do not have permission to use this command.`
                    });
                }
            break;

            // *clearqueue, Server Admin/Creator only command that clears the entire Queue list
            case 'clearqueue':
                admincheck();
                
                if(checkarray(member_info[userID].roles)) {
                    queue = ['Test'];
                    bot.sendMessage({
                        to: channelID,
                        message: `Cleared Queue.`
                    });
                }
                else {
                    bot.sendMessage({
                        to: channelID,
                        message: `You do not have permission to use this command.`
                    });
                }
            break;

            // *help, Lists all commands and what they do
            case 'help':
                bot.sendMessage({
                    to:channelID,
                    message: '```*help - Displays All Commands\n*join - Adds you to the Queue to get into a ship\n*leave - Removes you from the Queue to get into a ship\n*queue - Displays the current Queue list\n*remove, USERNAME - Server Admin/Creators only caommnad that removes the specified user from the Queue List\n*clearqueue - Server Admin/Creators only command that clears the entire Queue list\n*info - Information about the bot and its creators.```'
                })
            break;

            // *info, Lists all commands and what they do
            case 'info':
                bot.sendMessage({
                    to:channelID,
                    message: '```Queue System Bot\nQueue system for Sea of Thieves Fleet/Alliance Servers\nDesigned and Bulit by: NobleWolf42 and DK1\nIf you would like to assist with the bot, you can find us on Discord at https://discord.gg/tgJtK7f, and on GitHub at https://github.com/NobleWolf42/Queue-Bot/.```'
                })
            break;
         }
     }
});