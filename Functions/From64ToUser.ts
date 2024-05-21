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
		const { status, data } = await SteamFetch(ids)
		if (status !== 200 || !data.response.players.length) throw new Error('Invalid Steam64 ID')

		const users: IExtendedSteamUser[] = data.response.players
			.map((p: ISteamUser) => ({
				...p,
				steamIds: Steam64ToID(p.steamid),
			}))
			.filter((u): u is IExtendedSteamUser => !!u)

		return users
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
const SteamFetch = async (users: string | string[]): Promise<ISteamUserResponse> => {
	const apiKey = Array.isArray(config.apiKey)
		? config.apiKey[Math.floor(Math.random() * config.apiKey.length)]
		: config.apiKey?.includes(',')
		? config.apiKey.split(',')[Math.floor(Math.random() * config.apiKey.split(',').length)]
		: config.apiKey

	const url = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${apiKey}&format=json&steamids=${
		Array.isArray(users) ? users.join(',') : users
	}`

	try {
		const { data } = await axios.get(url)
		return data
	} catch (error) {
		throw new Error(`Failed to fetch data: ${(error as any).message}`)
	}
}

export default From64ToUser
