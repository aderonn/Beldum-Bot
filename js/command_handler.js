const fs = require('fs');
const path = require('path');
const Discord = require('discord.js');
const { prefix, creator_id } = require('../config.json');
const { Reply_Usage_Error } = require('./utilities.js');

// Event listener for messages
module.exports = (client) => {

  // Read js files dynamically in ./commands
  client.commands = new Discord.Collection();
  const command_files = fs.readdirSync(path.resolve(__dirname, './commands')).filter(file => file.endsWith('.js'));
  for (const file of command_files) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command)
  }

  // Read js files dynamically in ./admin_commands
  client.admin_commands = new Discord.Collection();
  const admin_command_files = fs.readdirSync(path.resolve(__dirname, './admin_commands')).filter(file => file.endsWith('.js'));
  for (const file of admin_command_files) {
    const command = require(`./admin_commands/${file}`);
    client.admin_commands.set(command.name, command)
  }

  // Listen on message
  client.on('message', message => {

    const prefix_mention = `<@!${client.user.id}>`;

    // Ignore bots, and must be valid guild
    if (message.author.bot || message.guild == null || !message.guild.available) {
      return;
    }

    // Starting with prefix "//"
    else if (message.content.startsWith(prefix)) {

      // Parse message into command_name and arguments
      const arguments = message.content.slice(prefix.length).trim().split(/ +/);
      const command_name = arguments.shift().toLowerCase();

      // Does the command or its aliases exist?
      const command = client.commands.get(command_name) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command_name));
      if (!command) return;
      
      // Check argument(s) validity
      if (command.args && arguments.length == 0) {
        return Reply_Usage_Error(message, command.name, command.usage);
      }

      // Execute command
      try {
        command.execute(message, arguments);
      } catch (error) {
        console.error(error);
      }

    }
    
    // Admin commands
    else if (message.content.startsWith(prefix_mention) && message.author.id == creator_id) {

      // Parse message into command_name and arguments
      const arguments = message.content.slice(prefix_mention.length).trim().split(/ +/);
      const command_name = arguments.shift().toLowerCase();

      // Does the command or its aliases exist?
      const command = client.admin_commands.get(command_name) || client.admin_commands.find(cmd => cmd.aliases && cmd.aliases.includes(command_name));
      if (!command) return;
      
      // Check argument(s) validity
      if (command.args && arguments.length == 0) {
        return Reply_Usage_Error(message, command.name, command.usage);
      }

      // Execute command
      try {
        command.execute(message, arguments);
      } catch (error) {
        console.error(error);
      }
    }

  });

}
