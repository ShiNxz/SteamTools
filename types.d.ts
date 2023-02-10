import type { AxiosResponse } from 'axios'

export interface ISteamUser {
	/**
	 * The user's 64 bit Steam ID
	 * Example: 76561198000000000
	 */
	steamid: string
	/**
	 * The user's visibility state
	 * 1 - public
	 * 2 - friends only
	 * 3 - private
	 * If the profile is private, only basic information is available
	 * If the profile is friends only, only friends of friends information is available
	 * If the profile is public, all information is available
	 * Note: This will always return "public" if the user has set their Steam Community profile settings to "Private"
	 */
	communityvisibilitystate: number
	/**
	 * If set, indicates the user has a community profile configured (will be set to '1')
	 * If not set, the profile could be private (will be set to 'null')
	 */
	profilestate: number
	/**
	 * The user's persona name (display name)
	 * Example: 'ShiNxz/>'
	 * Note: This may be returned as "Private" if the user has set their Steam Community profile settings to "Private"
	 */
	personaname: string
	/**
	 * If set, indicates the user has set a custom URL
	 * Example: 'https://steamcommunity.com/id/NXTShiNxz/'
	 * Note: This may be returned as "Private" if the user has set their Steam Community profile settings to "Private"
	 * Note: This may be returned as "null" if the user has not set a custom URL
	 */
	commentpermission: number
	/**
	 * The full URL of the user's Steam Community profile
	 * Example: 'https://steamcommunity.com/id/NXTShiNxz/'
	 * Note: This may be returned as "Private" if the user has set their Steam Community profile settings to "Private"
	 */
	profileurl: string
	/**
	 * The full URL of the user's 32x32px avatar
	 * If the user hasn't configured an avatar, this will be the default ? avatar
	 * Example: https://avatars.akamai.steamstatic.com/e40cb717337c06937237cf2b4a67d0a59dd473e7.jpg
	 */
	avatar: string
	/**
	 * The full URL of the user's 64x64px avatar
	 * If the user hasn't configured an avatar, this will be the default ? avatar
	 * Example: https://avatars.akamai.steamstatic.com/e40cb717337c06937237cf2b4a67d0a59dd473e7_medium.jpg
	 */
	avatarmedium: string
	/**
	 * The full URL of the user's 184x184px avatar
	 * If the user hasn't configured an avatar, this will be the default ? avatar
	 * Example: https://avatars.akamai.steamstatic.com/e40cb717337c06937237cf2b4a67d0a59dd473e7_full.jpg
	 */
	avatarfull: string
	/**
	 * The full URL of the user's 184x184px avatar
	 * If the user hasn't configured an avatar, this will be the default ? avatar
	 * Example: e40cb717337c06937237cf2b4a67d0a59dd473e7
	 */
	avatarhash: string
	/**
	 * the user last time logged off
	 * Example: 1675931258
	 * Note: This is a unix timestamp
	 */
	lastlogoff: number
	/**
	 * If set, indicates the profile allows public comments
	 * Example: 1
	 */
	personastate: number
	/**
	 * the user real name (if set)
	 * Example: 'https://next-il.co.il'
	 * Note: This may be returned as "Private" if the user has set their Steam Community profile settings to "Private"
	 */
	realname: string
	/**
	 * the user primary clan ID
	 * Example: '103582791468520675'
	 */
	primaryclanid: string
	/**
	 * the user time created
	 * Example: 1541434572
	 * Note: This is a unix timestamp
	 */
	timecreated: number
	/**
	 * Still not sure?
	 * Example: 0
	 * Note: This may be returned as "Private" if the user has set their Steam Community profile settings to "Private"
	 */
	personastateflags: number
}

export interface IExtendedSteamUser extends ISteamUser {
	steamIds: [string, string] | null
}

export interface ISteamUserResponse extends AxiosResponse {
	data: {
		response: {
			players: ISteamUser[]
		}
	}
}
