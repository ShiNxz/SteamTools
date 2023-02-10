import type { IExtendedSteamUser, ISteamUser, ISteamUserResponse } from '../types'
import { takeRight } from 'lodash'
import { dropRight } from 'lodash'
import axios from 'axios'
import Steam64ToID from './From64ToSteamID'

/**
 * Converts a Steam64 ID to a User Object
 * @param steam64 The user Steam64 ID, Example: 76561198000000000 OR Array of Steam64 IDs
 * @returns User Object or null if not found
 */
const From64ToUser = async (steam64: string | string[]): Promise<IExtendedSteamUser[] | null> => {
	if (!steam64) return null

	// If the steam64 is an array -> we will split it into chunks of 100 users
	if (Array.isArray(steam64)) {
		if (steam64.length > 100) {
			const allUsers: IExtendedSteamUser[] = []

			while (steam64.length != 0) {
				let users = takeRight(steam64, 100)
				steam64 = dropRight(steam64, 100)

				const { status, data } = await SteamFetch(users)
				if (status !== 200 && data.response.players.length > 0) return null

				const newUsers: IExtendedSteamUser[] = data.response.players.map((p: ISteamUser) => ({
					...p,
					steamIds: Steam64ToID(p.steamid),
				}))

				allUsers.push(...newUsers)
			}

			return allUsers
		}

		// If the array is less than 100 users, we will just fetch the data
		else {
			const { status, data } = await SteamFetch(steam64)

			if (status !== 200 && data.response.players.length > 0) return null

			return data.response.players.map((p: ISteamUser) => ({ ...p, steamIds: Steam64ToID(p.steamid) }))
		}
	}

	// If the steam64 is a string, we will just fetch the data
	else {
		const { status, data } = await SteamFetch(steam64)

		if (status !== 200 && data.response.players.length > 0) return null

		return data.response.players.map((p: ISteamUser) => ({ ...p, steamIds: Steam64ToID(p.steamid) }))
	}
}

/**
 * Steam Fetch function to fetch data from the Steam API using Axios
 * @param users string or array of strings of Steam64 IDs
 * @returns fetch response
 */
const SteamFetch = async (users: string | string[]): Promise<ISteamUserResponse> =>
	await axios(
		`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${
			process.env.STEAM_API_KEY
		}&format=json&steamids=${Array.isArray(users) ? users.join(',') : users}`
	)

export default From64ToUser
