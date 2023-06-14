const { REST, Routes } = require('discord.js');
const config = require('../config.json');
const fs = require('fs');
const path = require('path')

const commands = [];
const commandsPath = path.join(__dirname, '..', 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(commandsPath + `/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(config.token);

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {

        try {
            console.log(`Started refreshing ${commands.length} application (/) commands.`);

            // The put method is used to fully refresh all commands in the guild with the current set
            const data = await rest.put(
                Routes.applicationCommands(client.user.id),
                { body: commands },
            );

            console.log(`Successfully reloaded ${commands.length} application (/) commands.`);
        } catch (error) {
            // And of course, make sure you catch and log any errors!
            console.error(error);
        }

    }

};
