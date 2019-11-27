var Discord = require('discord.js');
var config = require('./config.json');

// Initialize Discord Bot
var client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
  });
  
  client.on('message', msg => {
    if (msg.content === 'ping') {
      msg.reply('pong');
    }
  });
  

//Logs the bot into discord, using it's auth token
client.login(config.auth.token);