import { IExtendedSteamUser } from '../types'
import From64ToUser from './From64ToUser'
import SteamIDTo64 from './SteamIDToSteam64'
import VanityURLTo64 from './VanityUrlTo64'

/**
 * A function that handles the fetching of the Steam User from the identifier (SteamID / SteamID64 / SteamID3 / CustomURL) and returns the Steam User Object
 * It will save the use of multiple functions to get the Steam User Object from the identifier, no matter what the identifier is
 * @param {string} identifier The identifier of the user (SteamID / SteamID64 / SteamID3 / CustomURL)
 * @returns {object | null} The Steam User Object or null if not found
 */
const GetSteamUser = async (identifier: string): Promise<IExtendedSteamUser> => {
	if (!identifier) throw new Error('Invalid Identifier')

	// We will use this later
	let steam64: string | null = null

	// IF Vanity URL => VanityURLTo64
	if (identifier.includes('steamcommunity.com/id/')) {
		steam64 = await VanityURLTo64(identifier)
		if (!steam64) throw new Error('Invalid Custom URL')
	}

	// 64 URL => Clear URL => Steam JSON
	else if (identifier.includes('steamcommunity.com/profiles/')) {
		identifier = identifier
			.replace('steamcommunity.com/profiles/', '')
			.replace('https://', '')
			.replace('http://', '')
			.replace('/', '')

		steam64 = identifier
	}

	// SteamID => Steam64
	else if (identifier && identifier.toString().startsWith('STEAM_')) {
		steam64 = SteamIDTo64(identifier)
		if (!steam64) throw new Error('Invalid SteamID')
	}

	// Steam64 => Steam JSON
	if (!identifier.startsWith('765') && !steam64) {
		console.log('ERROR', 'Invalid SteamID64', identifier, steam64)

		throw new Error('Invalid SteamID64')
	}

	const user = await From64ToUser(steam64 || identifier)
	if (!user) throw new Error('Invalid SteamID64')

	return user
}

export default GetSteamUser
