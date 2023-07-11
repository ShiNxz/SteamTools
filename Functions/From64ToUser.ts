import type { IExtendedSteamUser, ISteamUser, ISteamUserResponse } from '../types'
import { takeRight } from 'lodash-es'
import { dropRight } from 'lodash-es'
import axios from 'axios'
import Steam64ToID from './From64ToSteamID'
import config from '../config'

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
				try {
					let users = takeRight(steam64, 100)
					steam64 = dropRight(steam64, 100)

					const { status, data } = await SteamFetch(users)
					if (status !== 200 && data.response.players.length > 0) return null

					const newUsers: IExtendedSteamUser[] = data.response.players.map((p: ISteamUser) => ({
						...p,
						steamIds: Steam64ToID(p.steamid),
					}))

					allUsers.push(...newUsers)
				} catch (error) {
					console.error(error)
				}
			}

			return allUsers
		}

		// If the array is less than 100 users, we will just fetch the data
		else {
			try {
				const { status, data } = await SteamFetch(steam64)

				if (status !== 200 && data.response.players.length > 0) return null

				return data.response.players.map((p: ISteamUser) => ({ ...p, steamIds: Steam64ToID(p.steamid) }))
			} catch (error) {
				console.error(error)

				return null
			}
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
 * @update 2022-07-11: Added support for multiple API keys and random API key selection
 * @param users string or array of strings of Steam64 IDs
 * @returns fetch response
 */
const SteamFetch = async (users: string | string[]): Promise<ISteamUserResponse> =>
	new Promise(async (resolve, reject) => {
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

		try {
			const data = await axios(
				`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${apiKey}&format=json&steamids=${
					Array.isArray(users) ? users.join(',') : users
				}`
			)

			resolve(data)
		} catch (error) {
			reject(error)
		}
	})

export default From64ToUser
