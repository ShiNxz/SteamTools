const bigInt = require('big-integer')
import { BASE_NUM } from '../utils'

/**
 * Converts a Steam64 ID to a SteamID
 * @param steam64 The user Steam64 ID, Example: 76561198000000000
 * @returns array of 2 steam ids; Example: ['STEAM_0:0:2356325', 'STEAM_1:0:2356325']
 */
const Steam64ToID = (steam64: string): TResult => {
	if (!steam64 || typeof steam64 !== 'string') return null

	let v = BASE_NUM,
		w = bigInt(steam64),
		y = w.mod(2).toString()

	w = w.minus(y).minus(v)

	if (parseInt(w as unknown as string) < 1) return null

	return [`STEAM_0:${y}:${w.divide(2).toString()}`, `STEAM_1:${y}:${w.divide(2).toString()}`]
}

type TResult = [string, string] | null

export default Steam64ToID
