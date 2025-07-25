const express = require("express");
const app = express();

app.get("/", (req, res) => res.send("Raf's Subconcious has been activated!"));
app.listen(3000, () => console.log("Raf's Subconcious is online!"));

require("dotenv").config();

const { Client, IntentsBitField, AttachmentBuilder } = require("discord.js");
const path = require("path");

const client = new Client({
  intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages],
});

function getRolePing(bonusName) {
  if (bonusName === "Jackpot Token Bonus") return "<@&1312192164188655666>";
  if (bonusName === "Reactor Token Bonus") return "<@&1312192811092807690>";
  return "";
}

function findNextOffsetByName(targetName, startIndex) {
  let totalTime = 0;
  for (let i = 1; i <= BonusCycle.length; i++) {
    const idx = (startIndex + i) % BonusCycle.length;
    totalTime += BonusCycle[(startIndex + i - 1 + BonusCycle.length) % BonusCycle.length].time;
    if (BonusCycle[idx].name === targetName) {
      return totalTime;
    }
  }
  return null;
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

  {
    id: "CT",
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

  {
    id: "10DoubleXP3",
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
    name: "Anti-Critical Shield (1st Instance)",
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
    name: "Anti-Critical Shield (2nd Instance)",
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
let currentRemaining = null;
let currentSelectedIndex = null;

async function startBonusCycle(channel, manual = false) {
  const Bonus = BonusCycle[currentIndex];
  const remaining = currentRemaining ?? Bonus.time;
  const jtOffset = findNextOffsetByName("Jackpot Token Bonus", currentIndex);
  const rtOffset = findNextOffsetByName("Reactor Token Bonus", currentIndex);

  let extraInfo = "";
  if (jtOffset !== null) {
    extraInfo += `\nNext JT Bonus: <t:${Math.floor((Date.now() + remaining + jtOffset - Bonus.time) / 1000)}:R>`;
  }
  if (rtOffset !== null) {
    extraInfo += `\nNext RT Bonus: <t:${Math.floor((Date.now() + remaining + rtOffset - Bonus.time) / 1000)}:R>`;
  }

  await channel.send({
    content: `${getRolePing(Bonus.name)} New crafting bonus is available: **${Bonus.displayName}**\nEnds: <t:${Math.floor((Date.now() + remaining) / 1000)}:R>${extraInfo}`,
    files: [new AttachmentBuilder(path.join(__dirname, "bonuses", Bonus.image))],
  });

  if (!manual) {
    if (currentTimeout) clearTimeout(currentTimeout);
    currentTimeout = setTimeout(() => {
      currentIndex = (currentIndex + 1) % BonusCycle.length;
      currentRemaining = BonusCycle[currentIndex].time;
      currentSelectedIndex = currentIndex;
      startBonusCycle(channel);
    }, remaining);
  }
}

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "startbonus") {
    const selectedBonus = interaction.options.getString("bonus");
    const bonus = BonusCycle.find((b) => b.id === selectedBonus);
    if (!bonus) return interaction.reply({ content: "Invalid bonus!", ephemeral: true });

    const endTimeString = interaction.options.getString("end_time");
    const endDateString = interaction.options.getString("end_date");

    const now = new Date();
    let endDateIST;
    if (endDateString) {
      const [d, m, y] = endDateString.split("-").map(Number);
      endDateIST = new Date(Date.UTC(y, m - 1, d));
    } else {
      endDateIST = new Date(now);
    }
    const [hours, minutes] = endTimeString.split(":").map(Number);
    endDateIST.setUTCHours(hours - 5, minutes - 30, 0, 0);
    if (!endDateString && endDateIST < now) {
      endDateIST.setUTCDate(endDateIST.getUTCDate() + 1);
    }

    const selectedIndex = BonusCycle.findIndex((b) => b.id === selectedBonus);
    currentIndex = selectedIndex;
    currentSelectedIndex = selectedIndex;
    const remaining = endDateIST.getTime() - Date.now();
    currentRemaining = remaining;

    const jtOffset = findNextOffsetByName("Jackpot Token Bonus", selectedIndex);
    const rtOffset = findNextOffsetByName("Reactor Token Bonus", selectedIndex);

    let extraInfo = "";
    if (jtOffset !== null) {
      extraInfo += `\nNext JT Bonus: <t:${Math.floor((Date.now() + remaining + jtOffset - bonus.time) / 1000)}:R>`;
    }
    if (rtOffset !== null) {
      extraInfo += `\nNext RT Bonus: <t:${Math.floor((Date.now() + remaining + rtOffset - bonus.time) / 1000)}:R>`;
    }

    await interaction.deferReply({ ephemeral: true });
    await interaction.channel.send({
      content: `${getRolePing(bonus.name)} New crafting bonus is available: **${bonus.displayName}**\nEnds <t:${Math.floor(endDateIST.getTime() / 1000)}:R>${extraInfo}`,
      files: [new AttachmentBuilder(path.join(__dirname, "bonuses", bonus.image))],
    });
    await interaction.editReply({ content: "Bonus message sent!" });

    const delay = endDateIST.getTime() - Date.now();
    if (currentTimeout) clearTimeout(currentTimeout);
    currentTimeout = setTimeout(() => {
      currentIndex = (currentIndex + 1) % BonusCycle.length;
      currentRemaining = BonusCycle[currentIndex].time;
      currentSelectedIndex = currentIndex;
      startBonusCycle(interaction.channel);
    }, delay);
  }

  else if (interaction.commandName === "nextbonus") {
    if (currentTimeout) clearTimeout(currentTimeout);
    currentIndex = (currentIndex + 1) % BonusCycle.length;
    currentRemaining = BonusCycle[currentIndex].time;
    currentSelectedIndex = currentIndex;
    await startBonusCycle(interaction.channel, true);
    await interaction.reply({ content: "Next bonus triggered and cycle resumed.", ephemeral: true });
  }

  else if (interaction.commandName === "prevbonus") {
    if (currentTimeout) clearTimeout(currentTimeout);
    currentIndex = (currentIndex - 1 + BonusCycle.length) % BonusCycle.length;
    currentRemaining = BonusCycle[currentIndex].time;
    currentSelectedIndex = currentIndex;
    await startBonusCycle(interaction.channel, true);
    await interaction.reply({ content: "Previous bonus triggered and cycle resumed.", ephemeral: true });
  }
});

client.once("ready", async () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.login(process.env.DISCORD_CLIENT_TOKEN);