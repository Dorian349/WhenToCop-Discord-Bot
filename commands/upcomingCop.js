const { SlashCommandBuilder } = require('discord.js');
const {getUpcomingDate, getUpcomingShoes} = require("../utils/requestHelper");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('upcomingcop')
        .setDescription('Voir les cops de la journée.')
        .setDMPermission(false),
    async execute(interaction, client) {

        interaction.reply("Drop(s) - " + await getUpcomingDate());
        getUpcomingShoes(interaction.channel, client);
    },
};
