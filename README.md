# Stormageddon-Bot

# 🐺 Stormageddon (Discord Bot)
> Stormageddon is a Discord Bot built with discord.js & uses Command Handler from [discordjs.guide](https://discordjs.guide)
> If you would like to help in the development of this bot, the discord is https://discord.gg/tgJtK7f.

## Requirements

1. Discord Bot Token **[Guide](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot)**
2. Discord OAUTH2 redirectURI. You will need identify, email, and connections infromation **[Guide](https://discordjs.guide/oauth2/#setting-up-a-basic-web-server)**  
   1. Register HTTPS, a great free website is **[Lets Encrypt](https://letsencrypt.org/docs/)**

3.  Get your API access Keys
    1.  YouTube Data API v3 Key **[Guide](https://developers.google.com/youtube/v3/getting-started)**
    2. Spotify API Client Keys **[Guide](https://developer.spotify.com/documentation/general/guides/app-settings/#register-your-app)**
    3. **(Optional)** Soundcloud Client ID **[Guide](https://github.com/zackradisic/node-soundcloud-downloader#client-id)**
4. Node.js v22.2.0 or newer

## 🚀 Getting Started

```
git clone https://github.com/NobleWolf42/Stormageddon-bot.git
cd stormageddon-bot
npm install
```
After installation finishes you can use `node storm.js` to start the bot.

## ⚙️ Configuration

Copy or Rename `botConfig.example.json` located in the `data` folder to `botConfig.json` and fill out the values:

⚠️ **Note: Never commit or share your token or api keys publicly** ⚠️

```json
{
    "auth": {
        "token": "YOUR BOT TOKEN",
        "clientSecret": "YOUR CLIENT SECRET",
        "youtubeApiKey": "YOUR YOUTUBE API KEY",
        "soundcloudApiKey": "YOUwR SOUND CLOUD API KEY",
        "imgurApiKey" : "YOUR IMGUR API KEY",
        "d2ApiKey": "YOUR DESTINY 2 API KEY",
        "spotifyToken": "YOUR SPOTIFY TOKEN",
        "spotifySecret": "YOUR SPOTIFY SECRET"
    },
    "oauth": {
        "privateKey": "LOCATION OF PRIVATE HTTPS KEY",
        "publicKey": "LOCATION OF PUBLIC HTTPS KEY",
        "port": "PORT YOU WANT THE OAUTH SERVER TO USE"
    },
    "general": {
        "clientId": "YOUR CLIENT ID",
        "redirectUri": "YOUR REDIRECT URI:3000",
        "registerLink": "YOUR REGISTER URL"

    },
    "imgur": {
        "clientID" : "YOUR IMGUR CLIENT ID",
        "apiCall" : "IMGUR API CALL"
    },
    "music": {
        "maxPlatlistSize": NUMBER OF MAX PLAYLIST LENGTH,
        "pruning": TRUE OR FALSE TO ENABLE OR DISABLE PRUNING
    },
    "devids": ["YOUR DISCORD IDS 1", "YOUR DISCORD IDS 2", "YOUR DISCORD IDS 3"]
}
```

## 📝 Features & Commands


> Note: The default prefix is '!'


- Help Commands

    - Displays Help Message, specifying a page will show that help info, using the **\"All\"** page will display all commands, the **\"DM\"** page will display all commands that can be Direct Messaged to the bot, and the **\"Server\"** page will display all commands that can be used in a discord server. (Works in Direct Messages Too.)

        `!help ***PAGE*** i.e. (All)` 

    - Displays information about the bot, it's creators, and where you can go if you would like to contribute to it. (Works in Direct Messages Too.)

        `!info`

    - Lets you know if you are registered and gives you the link to register/update you info. (Works in Direct Message Too.)

        `!register`

- Admin Commands
  
  -  Changes the prefix the bot uses in your server. Available Symbols: ~!$%^&*()_+-=[];',.{}|:"<>?

        `!changeprefix ***INSERT-SYMBOL*** i.e. (!)`

    - Create the reactions message for auto role assignment.

        `!createautoRolemsg`

    - Bulk deletes the previous messages in a chat based on user input, up to 99 previous messages.

        `!clear ***NUMBER(1-99)*** i.e. (99)`

    - Adds users to the list of people that get the PM when someone whispers the bot with the !modmail command. MUST HAVE SERVER ADMINISTRATOR STATUS.

        `!addmod ***MENTION-USERS*** i.e. (@NobleWolf42)`

    - Fist time set up on a server. MUST HAVE SERVER ADMINISTRATOR STATUS.

        `!setup`

    - Allows you to change the settings you set during setup. MUST HAVE SERVER ADMINISTRATOR STATUS.

        `!set autoRole/joinrole/general/music/modmail`

- Fun Commands

    - Estimates someone's age based off of their name. (Works in Direct Messages Too.)

        `!agify ***INSERT-NAME*** i.e. (Steve)`

    - Displays the names of which astronauts are aboard the ISS. (Works in Direct Messages Too.)

        `!iss`

    - Display a random quote, picked by the developers of Stormageddon. (works in Direct Messages Too.)

        `!quote`

- Gaming Commands

    - Displays the Destiny 2 account's original creation date and last API update date. (Works in Direct Messages Too.)

        `!destiny2 status ***INSERT-BUNGIE-NAME*** i.e. (NobleWolf42)`

    - Displays Destiny 2 clan's bio, avatar, motto, and founder. (Works in Direct Messages Too.)

        `!destiny2 clan ***INSERT-CLAN-NAME** i.e. (The Taken Clan Name)`

- Music Commands

    - 🎶 Play music from YouTube via url

        `!play ***YOUTUBE-URL*** i.e. (https://www.youtube.com/watch?v=GLvohMXgcBo)`

    - 🔎 Play music from YouTube via search query

        `!play ***SEARCH-TERM*** i.e. (under the bridge red hot chili peppers)`

    - 🎶 Play music from Spotify via url

        `!play ***SPOTIFY-URL*** i.e. (https://open.spotify.com/track/64UmuvjJk7CxLZB6pKTrsS?si=6e3eccebb9a048f6)`

    - 🎶 Play music from Soundcloud via url

        `!play ***SOUNDCLOUD-URL*** i.e. (https://soundcloud.com/blackhorsebrigade/pearl-jam-alive)`

    - 🔎 Search and select music to play

        `!songsearch ***SEARCH-TERM** i.e. (Pearl Jam)`

    - 📃 Play youtube playlists via url

        `!playlist ***YOUTUBE-URL*** i.e. (https://www.youtube.com/watch?v=YlUKcNNmywk&list=PL5RNCwK3GIO13SR_o57bGJCEmqFAwq82c)`

    - 📃 Play spotify playlists via url

        `!play ***SPOTIFY-URL*** i.e. (https://open.spotify.com/playlist/2x75Df1nc0aRCxKoVorpcI?si=dae40d03326d4e86)`

    - 🔎 Play youtube playlists via search query

        `!playlist ***SEARCH-TERM*** i.e. (linkin park meteora)`

    - 🎶 Play music from YouTube via url

        `!playnext ***QUEUE-NUMBER/SEARCH-TEARM/YOUTUBE-LINK/SPOTIFY-LINK*** (NOTE: Bot Moderator Command ONLY)`

    - Shows the currently playing song

        `!nowplaying`

    - Pauses the currently playing music.

        `!pause`

    - Resumes the currently paused music.

        `!resume`

    - Removes selected song from the queue.

        `!remove ***QUEUE-NUMBER*** i.e. (5)`

    - Toggle music loop on/off.

        `!loop`

    - Gets the lyrics for the currently playing song.

        `!lyrics`

    - Stops the playing music.

        `!stop`

    - Skips the currently playing song.

        `!skip`

    - Skips to the selected queue number.

        `!skipto ***QUEUE-NUMBER*** i.e. (5)`
    
    - Shuffles the currently queued music.

        `!shuffle`

    - Shows the music queue and now playing.

        `!showqueue`

    - Displays volume of currently playing music if no numbers anre entered. Can change volume percent if numbers are entered.

        `!volume ***NUMBER(1-100)*** i.e. (100)`

    - Force the bot to disconnect from the voice chat.

        `!disconnect`

    - Force the bot to reconnect to the voice chat.

        `!reconnect`
    
- Direct Message Commands

    - Whisper via Stormageddon to all moderators for the specified server.

        `!modmail, ***SERVER-NAME***, ***MESSAGE*** i.e. (The Wolf Pack, Test Message.`

    - Whisper via Stormageddon to report a bug to the developers of Stormageddon.

        `!bugreport ***MESSAGE*** i.e. (Test Message.)`

    - Developer-only command for sending messages as the bot.

        `!devsend ***USER-ID***, ***MESSAGE*** i.e. (645141555719569439, Test Message.)`

- Command Handler from [discordjs.guide](https://discordjs.guide/)
- Media Controls via Reactions  
![reactions](https://i.imgur.com/KKzNGxL.png)

## 🤝 Contributing

1. [Fork the repository](https://github.com/NobleWolf42/Stormageddon-bot/fork)
2. Clone your fork: `git clone https://github.com/your-username/Stormageddon-bot.git`
3. Create your feature branch: `git checkout -b my-new-feature`
4. Commit your changes: `git commit -am 'Add some feature'`
5. Push to the branch: `git push origin my-new-feature`
6. Submit a pull request

## 📝 Credits

[@eritislami](https://github.com/eritislami) For the base music system used in this application which was adapted from [@eritislami/evobot](https://github.com/eritislami/evobot) (Also Borrowed ReadMe Style from Them)
