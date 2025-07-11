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

const BonusCycle = [
  {
    name: "Double Regeneration",
    time: 36 * 60 * 60 * 1000,
    image: "DoubleRegen3.png",
  },
  { name: "Triple XP", 
    time: 24 * 60 * 60 * 1000, 
    image: "TripleXP7.png" },
  {
    name: "Campaign Passes x25",
    time: 12 * 60 * 60 * 1000,
    image: "X25Pass.png",
  },
  {
    name: "Quadruple Regeneration",
    time: 24 * 60 * 60 * 1000,
    image: "QuadRegen3.png",
  },
  { name: "Challenge Token", 
    time: 3 * 60 * 60 * 1000, 
    image: "CT.png" },
  {
    name: "Campaign Passes x5",
    time: (1 * 24 + 6) * 60 * 60 * 1000,
    image: "X5Pass.png",
  },
  { name: "Double XP", 
    time: 10 * 60 * 60 * 1000, 
    image: "DoubleXP3.png" },
  {
    name: "Critical Strikes",
    time: 15 * 60 * 60 * 1000,
    image: "CritStrike3.png",
  },
  {
    name: "Campaign Passes x25",
    time: (1 * 24 + 12) * 60 * 60 * 1000,
    image: "X25Pass.png",
  },
  { name: "Jackpot Token Bonus", 
    time: 19 * 60 * 60 * 1000, 
    image: "JT.png" },
  {
    name: "Anti-Critical Shield",
    time: 12 * 60 * 60 * 1000,
    image: "AntiCrit1.png",
  },
  { name: "Reactor Token Bonus", 
    time: 3 * 60 * 60 * 1000, 
    image: "RT.png" },
  { 
    name: "Triple XP", 
    time: 18 * 60 * 60 * 1000, 
    image: "TripleXP3.png" },
  {
    name: "Double Regeneration",
    time: (1 * 24 + 18) * 60 * 60 * 1000,
    image: "DoubleRegen7.png",
  },
  {
    name: "Critical Strikes",
    time: 15 * 60 * 60 * 1000,
    image: "CritStrike7.png",
  },
  {
    name: "Anti-Critical Shield",
    time: 12 * 60 * 60 * 1000,
    image: "AntiCrit3.png",
  },
  {
    name: "Campaign Passes x25",
    time: 24 * 60 * 60 * 1000,
    image: "X25Pass.png",
  },
  {
    name: "Jackpot Token Bonus",
    time: (1 * 24 + 12) * 60 * 60 * 1000,
    image: "JT.png",
  },
];

let currentIndex = 0;
let currentTimeout = null;

async function startBonusCycle(channel) {
  const Bonus = BonusCycle[currentIndex];
  const imagePath = path.join(__dirname, "bonuses", Bonus.image);
  const attachment = new AttachmentBuilder(imagePath);

  let rolePing = "";
  if (Bonus.name === "Jackpot Token Bonus") {
    rolePing = "<@&1392185205678411919>";
  } else if (Bonus.name === "Reactor Token Bonus") {
    rolePing = "<@&1392185334594277386>";
  }

  const endTimestamp = Math.floor((Date.now() + Bonus.time) / 1000);
  await channel.send({
    content: `${rolePing} New crafting bonus is available: **${Bonus.name}**\nEnd: <t:${endTimestamp}:R>`,
    files: [attachment],
  });

  currentIndex = (currentIndex + 1) % BonusCycle.length;
  setTimeout(() => startBonusCycle(channel), Bonus.time);
}

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName === "startbonus") {
    const selectedBonus = interaction.options.getString("bonus");
    const endTimeString = interaction.options.getString("end_time");

    const bonus = BonusCycle.find(b => b.image.startsWith(selectedBonus));
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

    let rolePing = "";
    if (selectedBonus === "Jackpot Token Bonus") {
      rolePing = "<@&1392185205678411919>";
    } else if (selectedBonus === "Reactor Token Bonus") {
      rolePing = "<@&1392185334594277386>";
    }

    await interaction.channel.send({
      content: `${rolePing} New crafting bonus is available: **${selectedBonus}**\nEnds <t:${endTimestamp}:R>`,
      files: [attachment],
    });

    await interaction.reply({ content: "Bonus message sent!", ephemeral: true });

    const delay = endDateIST.getTime() - Date.now();
    if (currentTimeout) clearTimeout(currentTimeout);
    currentTimeout = setTimeout(() => startBonusCycle(interaction.channel), delay);
  }
});

client.once("ready", async () => {
  console.log(`Logged in as ${client.user.tag}`);

  const channel = await client.channels.fetch("1381837516495126670");
  startBonusCycle(channel);
});

client.login(process.env.DISCORD_CLIENT_TOKEN)