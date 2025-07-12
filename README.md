# Raf's Subconscious

A custom Discord bot built for the MGG Discord server.  
It sends messages when the crafting bonus changes in game, and pings specific roles during important bonuses.

---

## Key Features

- Slash command `/startbonus` to trigger the ongoing bonus while taking the time left for the bonus to end into consideration
- Automatically cycles through all 18 crafting bonuses in a loop
- Uses real-time countdowns via Discord's `<t:...:R>` timestamps
- Sends bonus-specific image attachments
- Role pings for important bonuses which are the Jackpot Token & Reactor Token bonuses
- Keeps itself awake with an Express web server (UptimeRobot-compatible)

---

## License

See [LICENSE](./LICENSE) for usage terms.