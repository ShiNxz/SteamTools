import type { IExtendedSteamUser, ISteamUser, ISteamUserResponse } from '../types'
import { takeRight, dropRight } from 'lodash-es'
import axios from 'axios'
import Steam64ToID from './From64ToSteamID'
import config from '../config'

// Function overloads
async function From64ToUser(steam64: string, delay?: number): Promise<IExtendedSteamUser>
async function From64ToUser(steam64: string[], delay?: number): Promise<IExtendedSteamUser[]>

/**
 * Converts a Steam64 ID to a User Object
 * @param steam64 The user Steam64 ID, Example: 76561198000000000 OR Array of Steam64 IDs
 * @param delay The delay between each request (default: 100ms)
 * @returns User Object or null if not found
 */
async function From64ToUser(
	steam64: string | string[],
	delay = 100
): Promise<IExtendedSteamUser | IExtendedSteamUser[]> {
	if (!steam64) throw new Error('Invalid Steam64 ID')

	const fetchUsers = async (ids: string[]): Promise<IExtendedSteamUser[]> => {
		try {
			const data = await SteamFetch(ids)
			if (!data.length) throw new Error('Invalid Steam64 ID')

			const users: IExtendedSteamUser[] = data
				.map((p: ISteamUser) => ({
					...p,
					steamIds: Steam64ToID(p.steamid),
				}))
				.filter((u): u is IExtendedSteamUser => !!u)

			return users
		} catch (error) {
			console.error(error)
			return []
		}
	}

	if (Array.isArray(steam64)) {
		if (steam64.length > 100) {
			const allUsers: IExtendedSteamUser[] = []

			while (steam64.length > 0) {
				const users = takeRight(steam64, 100)
				steam64 = dropRight(steam64, 100)
				try {
					const fetchedUsers = await fetchUsers(users)
					allUsers.push(...fetchedUsers)
				} catch (error) {
					console.error(error)
				}
				if (delay) await new Promise((r) => setTimeout(r, delay))
			}
			return allUsers
		} else {
			return await fetchUsers(steam64)
		}
	} else {
		const users = await fetchUsers([steam64])
		if (!users.length) throw new Error('Could not find user')

		return users[0] as IExtendedSteamUser
	}
}

/**
 * Steam Fetch function to fetch data from the Steam API using Axios
 * @update 2022-07-11: Added support for multiple API keys and random API key selection
 * @param users string or array of strings of Steam64 IDs
 * @returns fetch response
 */
const SteamFetch = async (users: string | string[]): Promise<ISteamUserResponse['data']['response']['players']> => {
	let apiKey = null

	if (typeof config.apiKey === 'string') {
		if (config.apiKey?.includes(',')) {
			const keys = config.apiKey.split(',')
			apiKey = keys[Math.floor(Math.random() * keys.length)]
		} else {
			apiKey = config.apiKey
		}
	} else if (Array.isArray(config.apiKey)) {
		apiKey = config.apiKey[Math.floor(Math.random() * config.apiKey.length)]
	}

	if (!apiKey) throw new Error('No API key found')

	const url = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${apiKey}&format=json&steamids=${
		Array.isArray(users) ? users.join(',') : users
	}`

	try {
		const { data } = await axios.get<ISteamUserResponse['data']>(url)
		return data.response.players
	} catch (error) {
		throw new Error(`Failed to fetch data: ${error as any}`)
	}
}

export default From64ToUser
