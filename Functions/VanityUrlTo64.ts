import axios from 'axios'
import { config } from 'dotenv'
config()

/**
 * Converts a vanity url to a Steam64 id using Axios and the Steam API
 * @param url the vanity url of the user (https://steamcommunity.com/id/username/)
 * @returns the Steam64 id of the user
 */
const VanityURLTo64 = async (url: string): Promise<string | null> => {
	if (!url || typeof url !== 'string') return null
	if (!url.includes('steamcommunity.com/id/')) return null

	const newUrl = url
		.replace('steamcommunity.com/id/', '')
		.replace('https://', '')
		.replace('http://', '')
		.replace('/', '')

	if (newUrl.length < 1) return null

	const API = `http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${process.env.STEAM_API_KEY}&vanityurl=${newUrl}`
	const {
		data: { response },
	} = await axios(API)

	const { success, steamid } = response
	if (!success) return null

	return steamid
}

export default VanityURLTo64
