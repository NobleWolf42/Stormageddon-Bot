//#region Dependencies
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
//#endregion

//#region Data Files
const botConfig = require('../../data/botConfig.json');
//#endregion

//#region Helpers
const { embedCustom } = require('../../helpers/embedSlashMessages.js');
//#endregion


//#region This exports the bugreport command with the information about it
module.exports = {
    data: new SlashCommandBuilder()
        .setName("bugreport")
        .setDescription("Send a bug report to the developers.")
        .addStringOption(option =>
            option.setName('bugreport')
                .setDescription('Description of the bug encountered, if you got an error message it was auto-reported.')
                .setRequired(true)
        ),
    async execute(client, interaction, distube) {
        var content = interaction.options.getString('bugreport');
        var devList = botConfig.devIDs;
        
        for (key in devList) {
            var  dev = await client.users.fetch(devList[key]);
            const embMsg = new EmbedBuilder()
                .setTitle("Bug Report")
                .setColor("#F8AA2A")
                .setDescription(content)
                .setFooter({ text: `From - ${interaction.user.username}.`, iconURL: null })
                .setTimestamp();

            await (dev.send({ embeds: [embMsg] }));
        }
        
        return embedCustom(interaction, 'Bug Report Sent.', '#0B6E29', `**Bug Report:** \`${content}\` \n**Sent To:** \`🐺 The Developers 🐺\``, { text: `Requested by ${interaction.user.username}`, iconURL: null }, null, [], null, null);
    }
}
//#endregion
