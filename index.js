const express = require("express");
const app = express();

app.get("/", (req, res) => res.send("Raf's Subconcious has been activated!"));
app.listen(3000, () => console.log("Raf's Subconcious is online!"));

require("dotenv/config");
const { Client, IntentsBitField, AttachmentBuilder } = require("discord.js");
const path = require("path");

const client = new Client({
  intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages],
});

const BonusCycle = [
  {
    name: "Double Regeneration",
    time: 10 * 1000, //time: 36 * 60 * 60 * 1000,
    image: "DoubleRegen3.png",
  },
  { name: "Triple XP", 
    time: 10 * 1000, //time: 24 * 60 * 60 * 1000, 
    image: "TripleXP7.png" },
  {
    name: "Campaign Passes x25",
    time: 10 * 1000, //time: 12 * 60 * 60 * 1000,
    image: "X25Pass.png",
  },
  {
    name: "Quadruple Regeneration",
    time: 10 * 1000, //time: 24 * 60 * 60 * 1000,
    image: "QuadRegen3.png",
  },
  { name: "Challenge Token", 
    time: 10 * 1000, //time: 3 * 60 * 60 * 1000, 
    image: "CT.png" },
  {
    name: "Campaign Passes x5",
    time: 10 * 1000, //time: (1 * 24 + 6) * 60 * 60 * 1000,
    image: "X5Pass.png",
  },
  { name: "Double XP", 
    time: 10 * 1000, //time: 10 * 60 * 60 * 1000, 
    image: "DoubleXP3.png" },
  {
    name: "Critical Strikes",
    time: 10 * 1000, //time: 15 * 60 * 60 * 1000,
    image: "CritStrike3.png",
  },
  {
    name: "Campaign Passes x25",
    time: 10 * 1000, //time: (1 * 24 + 12) * 60 * 60 * 1000,
    image: "X25Pass.png",
  },
  { name: "Jackpot Token Bonus", 
    time: 10 * 1000, //time: 19 * 60 * 60 * 1000, 
    image: "JT.png" },
  {
    name: "Anti-Critical Shield",
    time: 10 * 1000, //time: 12 * 60 * 60 * 1000,
    image: "AntiCrit1.png",
  },
  { name: "Reactor Token Bonus", 
    time: 10 * 1000, //time: 3 * 60 * 60 * 1000, 
    image: "RT.png" },
  { 
    name: "Triple XP", 
    time: 10 * 1000, //time: 18 * 60 * 60 * 1000, 
    image: "TripleXP3.png" },
  {
    name: "Double Regeneration",
    time: 10 * 1000, //time: (1 * 24 + 18) * 60 * 60 * 1000,
    image: "DoubleRegen7.png",
  },
  {
    name: "Critical Strikes",
    time: 10 * 1000, //time: 15 * 60 * 60 * 1000,
    image: "CritStrike7.png",
  },
  {
    name: "Anti-Critical Shield",
    time: 10 * 1000, //time: 12 * 60 * 60 * 1000,
    image: "AntiCrit3.png",
  },
  {
    name: "Campaign Passes x25",
    time: 10 * 1000, //time: 24 * 60 * 60 * 1000,
    image: "X25Pass.png",
  },
  {
    name: "Jackpot Token Bonus",
    time: 10 * 1000, //time: (1 * 24 + 12) * 60 * 60 * 1000,
    image: "JT.png",
  },
];

let currentIndex = 0;

async function startBonusCycle(channel) {
  const Bonus = BonusCycle[currentIndex];
  const imagePath = path.join(__dirname, "bonuses", Bonus.image);
  const attachment = new AttachmentBuilder(imagePath);

  let rolePing = ""; // default: no ping

  if (Bonus.name === "Jackpot Token Bonus") {
    rolePing = "<@&1392185205678411919>";
  } else if (Bonus.name === "Reactor Token Bonus") {
    rolePing = "<@&1392185334594277386>";
  }

  const endTimestamp = Math.floor((Date.now() + Bonus.time) / 1000); // convert ms to seconds

await channel.send({
  content: `${rolePing} New crafting bonus is available: **${Bonus.name}**\n End: <t:${endTimestamp}:R>`,
  files: [attachment],
});

  currentIndex = (currentIndex + 1) % BonusCycle.length;
  setTimeout(() => startBonusCycle(channel), Bonus.time);
}

client.once("ready", async () => {
  console.log(`Logged in as ${client.user.tag}`);

  const channel = await client.channels.fetch("1381837516495126670");
  startBonusCycle(channel);
});

client.login(process.env.DISCORD_CLIENT_TOKEN);
