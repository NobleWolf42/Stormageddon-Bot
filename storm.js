var Discord = require('discord.js');
var fs = require("fs");
var config = require('./config.json');
var queue = [];
var oldqueue = [];
var member_info = [];
var role_ids = [];
var channel_ids = [];

// Initialize Discord Bot
var bot = new Discord.Client();

//Logs the bot into discord, using it's auth token
bot.login(config.auth.token);