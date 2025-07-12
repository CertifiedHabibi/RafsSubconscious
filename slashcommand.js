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
  { name: 'Double Regeneration (36h)', value: 'DoubleRegen3' },
  { name: 'Triple XP (24h)', value: 'TripleXP7' },
  { name: 'Campaign Passes x25 (12h)', value: 'X25Pass' },
  { name: 'Quadruple Regeneration (24h)', value: 'QuadRegen3' },
  { name: 'Challenge Token (3h)', value: 'CT' },
  { name: 'Campaign Passes x5 (30h)', value: 'X5Pass' },
  { name: 'Double XP (10h)', value: 'DoubleXP3' },
  { name: 'Critical Strikes (15h)', value: 'CritStrike3' },
  { name: 'Campaign Passes x25 (36h)', value: 'X25Pass' }, // same image, reused
  { name: 'Jackpot Token Bonus (19h)', value: 'JT' },
  { name: 'Anti-Critical Shield (12h)', value: 'AntiCrit1' },
  { name: 'Reactor Token Bonus (3h)', value: 'RT' },
  { name: 'Triple XP (18h)', value: 'TripleXP3' },
  { name: 'Double Regeneration (42h)', value: 'DoubleRegen7' },
  { name: 'Critical Strikes (15h)', value: 'CritStrike7' },
  { name: 'Anti-Critical Shield (12h)', value: 'AntiCrit3' },
  { name: 'Campaign Passes x25 (24h)', value: 'X25Pass' },
  { name: 'Jackpot Token Bonus (36h)', value: 'JT' }
)

    )
    .addStringOption(option =>
  option.setName('end_time')
    .setDescription('Enter end time in HH:mm format (IST)')
    .setRequired(true)
),

new SlashCommandBuilder()
    .setName("nextbonus")
    .setDescription("Manually trigger the next bonus in the cycle"),

  new SlashCommandBuilder()
    .setName("prevbonus")
    .setDescription("Manually trigger the previous bonus in the cycle")

].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_CLIENT_TOKEN);

(async () => {
  try {
    await rest.put(
      Routes.applicationGuildCommands('1381837160394784838', '997145720643665931'),
      { body: commands }
    );
    console.log('Slash command registered!');
  } catch (err) {
    console.error(err);
  }
})();
