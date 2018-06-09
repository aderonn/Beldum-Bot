
// Acquire token from .env
require('dotenv').config()
const token = process.env.TOKEN;

// Init discord
const Discord = require('discord.js');
const client = new Discord.Client();
client.login(token);

// Ready check
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

  // Set bot's playing status
  client.user.setActivity("with an Everstone, //help");

});


// Prefix for commands
const prefix = '//';

// My imports
require('./js/help.js')(client, prefix);
