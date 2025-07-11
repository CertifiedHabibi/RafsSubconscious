const { REST, Routes, SlashCommandBuilder } = require('discord.js');
require('dotenv/config');

const commands = [
  new SlashCommandBuilder()
    .setName('startbonus')
    .setDescription('Start the bonus cycle manually')
    .addStringOption(option =>
      option.setName('bonus')
        .setDescription('Select the current bonus')
        .setRequired(true)
        .addChoices(
          { name: 'DoubleRegen3', value: 'Double Regeneration 3 (36 hours)' },
          { name: 'TripleXP7', value: 'Triple XP 7 (24 hours)' },
          { name: 'X25Pass', value: 'Campaign Passes x25 (12 hours)' },
          { name: 'TripleRegen3', value: 'Triple Regeneration 3 (24 hours)' },
          { name: 'CT', value: 'Challenge Token (3 hours)' },
          { name: 'X5Pass', value: 'Campaign Passes x5 (30 hours)' },
          { name: 'DoubleXP3', value: 'Double XP 3 (10 hours)' },
          { name: 'CritStrike3', value: 'Critical Strikes 3 (15 hours)' },
          { name: 'X25Pass2', value: 'Campaign Passes x25 (36 hours)' },
          { name: 'JT', value: 'Jackpot Token (19 hours)' },
          { name: 'AntiCrit1', value: 'AntiCritical Shield 1 (12 hours)' },
          { name: 'RT', value: 'Reactor Token (3 hours)' },
          { name: 'TripleXP3', value: 'Triple XP 3 (18 hours)' },
          { name: 'DoubleRegen7', value: 'Double Regeneration 7 (42 hours)' },
          { name: 'CritStrike7', value: 'Critical Strikes 7 (15 hours)' },
          { name: 'AntiCrit3', value: 'AntiCritical Shield 3 (12 hours)' },
          { name: 'X25Pass3', value: 'Campaign Passes x25 (24 hours)' },
          { name: 'JT2', value: 'Jackpot Token (36 hours)' },

        )
    )
    .addStringOption(option =>
  option.setName('end_time')
    .setDescription('Enter end time in HH:mm format (IST)')
    .setRequired(true)
)

].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_CLIENT_TOKEN);

(async () => {
  try {
    await rest.put(
      Routes.applicationGuildCommands('1381837160394784838', '1381837515702407178'),
      { body: commands }
    );
    console.log('Slash command registered!');
  } catch (err) {
    console.error(err);
  }
})();
