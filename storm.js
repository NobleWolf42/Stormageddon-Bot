var Discord = require('discord.js');
var fs = require("fs");
var config = require('./config.json');

// Initialize Discord Bot
var bot = new Discord.Client();

//Logs the bot into discord, using it's auth token
bot.login(config.auth.token);