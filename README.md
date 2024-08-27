# 🐺 Stormageddon (Discord Bot)

> Stormageddon is a Discord Bot built with discord.js & uses Command Handler from [discordjs.guide](https://discordjs.guide)
> If you would like to help in the development of this bot, the discord is https://discord.gg/tgJtK7f.

## 📖 Table of Contents

-   [🐺 Stormageddon (Discord Bot)](#-stormageddon-discord-bot)
    -   [📖 Table of Contents](#-table-of-contents)
    -   [📝 Features](#-features)
    -   [✅ Requirements](#-requirements)
    -   [🚀 Getting Started](#-getting-started)
    -   [⚙️ Configuration](#️-configuration)
    -   [🏎️ Running the Bot](#️-running-the-bot)
    -   [📝 Commands](#-commands)
    -   [🤝 Contributing](#-contributing)

## 📝 Features

-   React to Receive Role

    -   A system for creating a message with reactions that users can use to self-assign roles.

-   Join to Create Voice channel

    -   This allows you to set up a voice channel that users can join to have their own temporary voice channel created

-   Music Player

    -   The music functionality allows for youtube, spotify, and soundcloud songs and playlists, might also work with other sites, but it is only tested with those three.
    -   Media Controls via Buttons  
        ![buttons](https://i.imgur.com/T6BV1zH.png)

-   Slash Commands

    -   The current slash commands are:

        -   Add/Remove Mod
        -   Agify
        -   Blame
        -   BugReport
        -   Change Prefix
        -   Clear
        -   Destiny 2
        -   Help
        -   Info
        -   ISS
        -   Join To Create
        -   ModMail
        -   Music
        -   Quote
        -   Say

-   And Much More

    -   There are many more commands that can be found [below](#-commands) in the

## ✅ Requirements

1. Discord Bot Token
    - **[Guide](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot)**
2. [Node.js](https://nodejs.org/en/download/package-manager) v22.2.0 or newer
3. [FFMPEG](https://ffmpeg.org/download.html)

## 🚀 Getting Started

```
git clone https://github.com/NobleWolf42/Stormageddon-bot.git
cd stormageddon-bot
npm install
```

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

## 🏎️ Running the Bot

After installation and configuration you can use `npm start` or `node storm.js` to start the bot.

## 📝 Commands

> Note: The default prefix is '!'

-   Admin Commands

    -   `!addmod ***MENTION-USERS*** i.e. (@NobleWolf42)`

        -   Adds users to the list of people that get the PM when someone whispers the bot with the modmail command. MUST HAVE SERVER ADMINISTRATOR STATUS.

    -   `!changeprefix ***INSERT-SYMBOL*** i.e. (!)`

        -   Changes the prefix the bot uses in your server. Available Symbols: `~!$%^&*()_+-=[];',.{}|:\"<>?`.

    -   `!clear ***NUMBER(1-99)*** i.e. (99)`

        -   Bulk deletes the previous messages in a chat based on user input, up to 99 previous messages.

    -   `!createrolemsg`

        -   Create the reactions message for auto role assignment.

    -   `!removemod ***MENTION-USERS*** i.e. (@NobleWolf42)`

        -   Removes users from the list of people that get the PM when someone whispers the bot with the !modmail command. MUST HAVE SERVER ADMINISTRATOR STATUS.

    -   `!say ***MESSAGE-CONTENT*** i.e (Hello World!)`

        -   Sends a message as the bot.

    -   `!set autorole/general/joinrole/jointocreatevc/modmail/music`

        -   Allows you to change the settings you set during setup. MUST HAVE SERVER ADMINISTRATOR STATUS.

    -   `!setup`
        -   Fist time set up on a server. MUST HAVE SERVER ADMINISTRATOR STATUS.

-   Developer-Only Commands

    -   `!devsend ***USER-ID***, ***MESSAGE***'  i.e (0123456789012345678, Hello World!)`

        -   Developer-only command for sending messages as the bot. (Only works in Direct Message.)

    -   `!logs`
        -   Triggers the bot to send you the log files

-   DM Only Commands

    -   `!bugreport ***MESSAGE***  i.e (It Brokey 😿)`

        -   Whisper via Stormageddon to report a bug to the developers of Stormageddon.

    -   `!modmail, ***SERVER-NAME***, ***MESSAGE***  i.e (A Server Name, Hello World!)`
        -   Whisper via Stormageddon to all moderators for the specified server.

-   Fun Commands

    -   `!agify ***INSERT-NAME*** i.e. (Steve)`

        -   Uses [Agify.io](https://agify.io/) to estimate someone's age based off of their name. (Works in Direct Messages too.)

    -   `!blame ""/add/remove/addperm/removeperm/list/fix ***FOR-ADD/REMOVE/ADDPERM/REMOVEPERM-ONLY-TYPE-NAME-HERE***/***FIX-ONLY-NUMBER-IN-LIST-OF-PERSON*** i.e. (!blame, !blame list, !blame add NobleWolf42, or  !blame fix 3)`

        -   Blames someone based on a weekly rotation. Can also add someone to a permanent blame list. Add/Remove/AddPerm/RemovePerm/List are Admin ONLY Commands.

    -   `!iss`

        -   Displays the names of all the astronauts that are in transit to/from, or currently aboard the International Space Station. (Works in Direct Messages too.)

    -   `!quote`
        -   Display a random quote, picked by the developers of Stormageddon. (works in Direct Messages too.)

-   Gaming Commands

    -   `!destiny2 clan ***INSERT-CLAN-NAME** i.e. (The Taken Clan Name)`
        -   Displays Destiny 2 clan's bio, avatar, motto, and founder. (Works in Direct Messages too.)

-   Help Commands

    -   `!help ***PAGE*** i.e. (All)`

        -   Displays Help Message, specifying a page will show that help info, including a listing of all help pages. Using the **\"All\"** page will display all commands, the **\"DM\"** page will display all commands that can be Direct Messaged to the bot, and the **\"Server\"** page will display all commands that can be used in a discord server. (Works in Direct Messages too.)

    -   `!info`
        -   Displays information about the bot, it's creators, and where you can go if you would like to contribute to it. (Works in Direct Messages too.)

-   Miscellaneous Commands

    -   `!jointocreate name ***YOUR NAME HERE*** i.e. (My Channel 😺)`
        -   Allows you to change the name of your voice channel (only if you created it).

-   Music Commands

    -   `!autoplay`

        -   Toggles wether or not the bot will automatically pick a new song when the queue is done.

    -   `!loop ***SONG/QUEUE/OFF*** i.e (Song)`

        -   Toggle music loop for song/queue/off.

    -   `!lyrics`

        -   Gets the lyrics for the currently playing song.

    -   `!pause`
        -   Pauses the currently playing music.
    -   `!play ***SEARCH-TERM/YOUTUBE-LINK-or-PLAYLIST/SPOTIFY-LINK-or-PLAYLIST/SOUNDCLOUD-LINK*** i.e. (Crossfire By Stephan)`
        -   Plays the selected music in the voice channel you are in.
    -   `!playnext ***QUEUE-NUMBER/SEARCH-TERM/YOUTUBE-LINK/SPOTIFY-LINK/SOUNDCLOUD-LINK*** i.e. (5)`
        -   Plays the selected song next. (NOTE: Bot Moderator Command ONLY)
    -   `!remove ***QUEUE-NUMBER***`

        -   Removes selected song from the queue.

    -   `!resume`
        -   Resumes the currently paused music.
    -   `!showqueue`

        -   Shows the music queue.

    -   `shuffle`

        -   Shuffles the currently queued music.

    -   `!skip`

        -   Skips the currently playing song.

    -   `!skipto ***QUEUE-NUMBER***`

        -   Skips to the selected queue number.

    -   `!stop`

        -   Stops the playing music.

    -   `!volume ***NUMBER(1-100)***`
        -   Displays volume of currently playing music if no numbers are entered. Can change volume percent if numbers are entered.

## 🤝 Contributing

1. Check the ["Design Documentation.js"](https://github.com/NobleWolf42/Stormageddon-Bot/blob/master/Design%20Documentation.js) file before starting, it contains a rough layout of how files should look
2. [Fork the repository](https://github.com/NobleWolf42/Stormageddon-bot/fork)
3. Clone your fork: `git clone https://github.com/your-username/Stormageddon-bot.git`
4. Create your feature branch: `git checkout -b my-new-feature`
5. Commit your changes: `git commit -am 'Add some feature'`
6. Push to the branch: `git push origin my-new-feature`
7. Submit a pull request
