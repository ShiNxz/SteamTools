# Steam-API-SDK

This package includes many functions to use along with the Steam API.
It is a work in progress and will be updated over time.
Currently it includes some basic and advanced functions to fetch data about users.

#

## Installation

Install from npm using the following command:

```
npm install steam-api-sdk
```

or if you are using yarn:

```
yarn add steam-api-sdk
```

#

## Getting Started

First add an environment variable to your .env file with the name `STEAM_API_KEY` and the value of your Steam API key.
You can get your Steam API key from [here](https://steamcommunity.com/dev/apikey).

`.env` example:

```env
API_KEY = 'user-api-key';
```

Then import the package into your project:

```javascript
const steam = require('steam-api-sdk')
```

Or if you are using ES6:

```javascript
import steam from 'steam-api-sdk'
```

#

## Functions

#### Convert Steam32 to Steam64 ID ([U:1:XXX] ➜ 7656119XXX)

```javascript
import { From32To64 } from 'steam-api-sdk'

const steam64 = From32To64([U:1:XXX]) // 7656119XXX
```

#### Convert Steam64 to Steam32 ID (7656119XXX ➜ [U:1:XXX])

```javascript
import { From64To32 } from 'steam-api-sdk'

const steam32 = From64To32('7656119XXX') // [U:1:XXX]
```

#### Convert Steam64 to Steam ID (7656119XXX ➜ STEAM_0:0:XXX) Array

```javascript
import { From64ToSteamID } from 'steam-api-sdk'

const steamIds = From64ToSteamID('7656119XXX')
// Array of: [STEAM_0:0:XXX, STEAM_0:1:XXX]
```

#### Convert Steam64 to a user object (7656119XXX ➜ object details about the user)

```javascript
import { From64ToUser } from 'steam-api-sdk'

const user = From64ToUser('7656119XXX')
// User Object
const user = From64ToUser(['7656119XXX', '7656119XXX', '7656119XXX'])
// User Object Array
```

Please note that you can use string OR array of strings that contains the user's Steam64 id.<br/>
**you should use that if you want to get multiple users at once** without getting rate limited by Steam and also reduce the response time!<br/>
(instead of sending 50 requests for 50 users, it will send 1 request for 50 users = 50x faster)

#### Convert Steam64 to a user object (7656119XXX ➜ object details about the user)

```javascript
import { GetSteamUser } from 'steam-api-sdk'

const user = GetSteamUser('https://steamcommunity.com/id/NXTShiNxz/')
// profile url -> User Object
const user = GetSteamUser('http://steamcommunity.com/profiles/76561198998419941')
// profile url (2) -> User Object
const user = GetSteamUser('STEAM_0:0:454468949')
// profile url (2) -> User Object
const user = GetSteamUser('76561198869203626')
// profile url (2) -> User Object
```

#### Convert Steam ID to steam64 ID (STEAM_0:0:454468949 ➜ 76561198869203626)

```javascript
import { SteamIDToSteam64 } from 'steam-api-sdk'

const steam64 = SteamIDToSteam64('STEAM_0:0:454468949')
// 76561198869203626
```

#### Convert Steam ID to steam64 ID (STEAM_0:0:454468949 ➜ 76561198869203626)

```javascript
import { VanityUrlTo64 } from 'steam-api-sdk'

const steam64 = VanityUrlTo64('https://steamcommunity.com/id/XXX/')
// 76561198869203626
```

#

## Contributing

If you want to contribute to this package, please feel free to do so by opening a pull request with your changes.<br>
Currently this package is in development and will be updated over time.<br>
We are looking for contributors to help us improve this package by adding new functions and improving the existing ones.

#

## Issues & Questions

If you have any questions or suggestions, please open an issue and I will get back to you as soon as possible.<br>
