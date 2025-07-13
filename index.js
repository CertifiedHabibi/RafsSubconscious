const express = require("express");
const app = express();

app.get("/", (req, res) => res.send("Raf's Subconcious has been activated!"));
app.listen(3000, () => console.log("Raf's Subconcious is online!"));

require('dotenv').config(); 

const { Client, IntentsBitField, SlashCommandBuilder, Routes, AttachmentBuilder } = require("discord.js");
const { REST } = require("@discordjs/rest");
const path = require("path");

const client = new Client({
  intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages],
});

function getRolePing(bonusName) {
  if (bonusName === "Jackpot Token Bonus") return "<@&1312192164188655666>";
  if (bonusName === "Reactor Token Bonus") return "<@&1312192811092807690>";
  return "";
}

const BonusCycle = [

  {
    id: "36DoubleRegen3",
    name: "Double Regeneration",
    displayName: "Double Regeneration",
    time: 36 * 60 * 60 * 1000,
    image: "DoubleRegen3.png",
  },
  { 
    id: "24TripleXP7",
    name: "Triple XP",
    displayName: "Triple XP", 
    time: 24 * 60 * 60 * 1000, 
    image: "TripleXP7.png",
  },
  {
    id: "12X25Pass",
    name: "Campaign Passes x25",
    displayName: "Campaign Passes x25",
    time: 12 * 60 * 60 * 1000,
    image: "X25Pass.png",
  },
  {
    id: "24QuadRegen3",
    name: "Quadruple Regeneration",
    displayName: "Quadruple Regeneration",
    time: 24 * 60 * 60 * 1000,
    image: "QuadRegen3.png",
  },
  { id: "CT",
    name: "Challenge Token", 
    displayName: "Challenge Token",
    time: 3 * 60 * 60 * 1000, 
    image: "CT.png",
   },
  {
    id: "X5Pass",
    name: "Campaign Passes x5",
    displayName: "Campaign Passes x5",
    time: (1 * 24 + 6) * 60 * 60 * 1000,
    image: "X5Pass.png",
  },
  { id: "10DoubleXP3",
    name: "Double XP", 
    displayName: "Double XP",
    time: 10 * 60 * 60 * 1000, 
    image: "DoubleXP3.png",
   },
  {
    id: "15CritStrike3",
    name: "Critical Strikes",
    displayName: "Critical Strikes",
    time: 15 * 60 * 60 * 1000,
    image: "CritStrike3.png",
  },
  {
    id: "36X25Pass",
    name: "Campaign Passes x25",
    displayName: "Campaign Passes x25",
    time: (1 * 24 + 12) * 60 * 60 * 1000,
    image: "X25Pass.png",
  },
  { 
    id: "19JT",
    name: "Jackpot Token Bonus", 
    displayName: "Jackpot Token",
    time: 19 * 60 * 60 * 1000, 
    image: "JT.png",
   },
  {
    id: "12AntiCrit1",
    name: "Anti-Critical Shield",
    displayName: "Anti-Critical Shield",
    time: 12 * 60 * 60 * 1000,
    image: "AntiCrit1.png",
  },
  { 
    id: "RT",
    name: "Reactor Token Bonus", 
    displayName: "Reactor Token",
    time: 3 * 60 * 60 * 1000, 
    image: "RT.png",
   },
  { 
    id: "18TripleXP3",
    name: "Triple XP", 
    displayName: "Triple XP",
    time: 18 * 60 * 60 * 1000, 
    image: "TripleXP3.png",
   },
  {
    id: "42DoubleRegen7",
    name: "Double Regeneration",
    displayName: "Double Regeneration",
    time: (1 * 24 + 18) * 60 * 60 * 1000,
    image: "DoubleRegen7.png",
  },
  {
    id: "15CritStrike7",
    name: "Critical Strikes",
    displayName: "Critical Strikes",
    time: 15 * 60 * 60 * 1000,
    image: "CritStrike7.png",
  },
  {
    id: "12AntiCrit3",
    name: "Anti-Critical Shield",
    displayName: "Anti-Critical Shield",
    time: 12 * 60 * 60 * 1000,
    image: "AntiCrit3.png",
  },
  {
    id: "24X25Pass",
    name: "Campaign Passes x25",
    displayName: "Campaign Passes x25",
    time: 24 * 60 * 60 * 1000,
    image: "X25Pass.png",
  },
  {
    id: "36JT",
    name: "Jackpot Token Bonus",
    displayName: "Jackpot Token",
    time: (1 * 24 + 12) * 60 * 60 * 1000,
    image: "JT.png",
  },
];

let currentIndex = 0;
let currentTimeout = null;

async function startBonusCycle(channel, manual = false) {
  const Bonus = BonusCycle[currentIndex];
  const imagePath = path.join(__dirname, "bonuses", Bonus.image);
  const attachment = new AttachmentBuilder(imagePath);
  const rolePing = getRolePing(Bonus.name);
  const endTimestamp = Math.floor((Date.now() + Bonus.time) / 1000);

  await channel.send({
    content: `${rolePing} New crafting bonus is available: **${Bonus.displayName ?? Bonus.name}**\nEnd: <t:${endTimestamp}:R>`,
    files: [attachment],
  });

  if (!manual) {
  currentTimeout = setTimeout(() => {
    currentIndex = (currentIndex + 1) % BonusCycle.length;
    startBonusCycle(channel);
  }, Bonus.time);
}

}

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName === "startbonus") {
    const selectedBonus = interaction.options.getString("bonus");
    const endTimeString = interaction.options.getString("end_time");

    const bonus = BonusCycle.find(b => b.id === selectedBonus);

    if (!bonus) {
      return interaction.reply({ content: "Invalid bonus!", ephemeral: true });
    }

    const imagePath = path.join(__dirname, "bonuses", bonus.image);
    const attachment = new AttachmentBuilder(imagePath);

    const now = new Date();
    const [hours, minutes] = endTimeString.split(":").map(Number);
    const endDateIST = new Date(now);
    endDateIST.setUTCHours(hours - 5, minutes - 30, 0, 0); // Convert IST to UTC
    if (endDateIST < now) endDateIST.setUTCDate(endDateIST.getUTCDate() + 1);

    const endTimestamp = Math.floor(endDateIST.getTime() / 1000);

    const rolePing = getRolePing(bonus.name);

    await interaction.channel.send({
      content: `${rolePing} New crafting bonus is available: **${bonus.displayName ?? bonus.name}**\nEnds <t:${endTimestamp}:R>`,
      files: [attachment],
    });

    await interaction.reply({ content: "Bonus message sent!", ephemeral: true });

    const selectedIndex = BonusCycle.findIndex(b => b.id === selectedBonus);
    currentIndex = (selectedIndex + 1) % BonusCycle.length;
    
    const delay = endDateIST.getTime() - Date.now();
    if (currentTimeout) clearTimeout(currentTimeout);
    currentTimeout = setTimeout(() => startBonusCycle(interaction.channel), delay);

  }

else if (interaction.commandName === "nextbonus") {
  if (currentTimeout) clearTimeout(currentTimeout);

  await startBonusCycle(interaction.channel, true);

  currentIndex = (currentIndex + 1) % BonusCycle.length;

  await interaction.reply({ content: "Next bonus triggered and cycle resumed.", ephemeral: true });
}

else if (interaction.commandName === "prevbonus") {
  if (currentTimeout) clearTimeout(currentTimeout);

  currentIndex = (currentIndex - 1 + BonusCycle.length) % BonusCycle.length;

  await startBonusCycle(interaction.channel, true);

  await interaction.reply({ content: "Previous bonus triggered and cycle resumed.", ephemeral: true });
}

});

client.once("ready", async () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.login(process.env.DISCORD_CLIENT_TOKEN)