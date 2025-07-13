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
  { name: 'Double Regeneration (36h)', value: '36DoubleRegen3' },
  { name: 'Triple XP (24h)', value: '24TripleXP7' },
  { name: 'Campaign Passes x25 (12h)', value: '12X25Pass' },
  { name: 'Quadruple Regeneration (24h)', value: '24QuadRegen3' },
  { name: 'Challenge Token (3h)', value: 'CT' },
  { name: 'Campaign Passes x5 (30h)', value: 'X5Pass' },
  { name: 'Double XP (10h)', value: '10DoubleXP3' },
  { name: 'Critical Strikes (15h)', value: '15CritStrike3' },
  { name: 'Campaign Passes x25 (36h)', value: '36X25Pass' },
  { name: 'Jackpot Token Bonus (19h)', value: '19JT' },
  { name: 'Anti-Critical Shield (12h)', value: '12AntiCrit1' },
  { name: 'Reactor Token Bonus (3h)', value: 'RT' },
  { name: 'Triple XP (18h)', value: '18TripleXP3' },
  { name: 'Double Regeneration (42h)', value: '42DoubleRegen7' },
  { name: 'Critical Strikes (15h)', value: '15CritStrike7' },
  { name: 'Anti-Critical Shield (12h)', value: '12AntiCrit3' },
  { name: 'Campaign Passes x25 (24h)', value: '24X25Pass' },
  { name: 'Jackpot Token Bonus (36h)', value: '36JT' }
)

    )
    .addStringOption(option =>
  option.setName('end_time')
    .setDescription('Enter end time in HH:mm format (IST)')
    .setRequired(true)
)

    .addStringOption(option =>
  option.setName('end_date')
    .setDescription('Enter end date in DD-MM-YYYY format (optional)')
    .setRequired(false)
),

new SlashCommandBuilder()
    .setName("nextbonus")
    .setDescription("Manually trigger the next bonus in the cycle"),

  new SlashCommandBuilder()
    .setName("prevbonus")
    .setDescription("Manually trigger the previous bonus in the cycle")

].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_CLIENT_TOKEN);

const CLIENT_ID = '1381837160394784838';
const GUILD_ID = '997145720643665931';

(async () => {
  try {

    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: [] }
    );
    console.log('Cleared existing guild slash commands');

    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );
    console.log('Re-registered updated guild slash commands');
  } catch (err) {
    console.error('Failed to register commands:', err);
  }
})();
