import { BASE_NUM } from '../utils'

/**
 * Converts a SteamID to a Steam64 ID
 * @param steamid The user SteamID, Example: STEAM_0:0:2356325 or STEAM_1:1:2356325
 * @returns Steam64 ID, Example: 76561198000000000
 */
const SteamIDTo64 = (steamid: string): string | null => {
	if (!steamid || typeof steamid !== 'string') return null

	let split: string[] = steamid.split(':'),
		v = BASE_NUM,
		z = split[2],
		y = split[1]

	if (z && y)
		return v
			.plus(parseInt(z) * 2)
			.plus(y)
			.toString()

	return null
}

export default SteamIDTo64
