import Big from 'big.js'
import { BASE_NUM } from '../utils'

/**
 * Converts a Steam64 ID to a Steam32 ID
 * @param steam64 The user Steam64 ID, Example: 76561198000000000
 * @returns The user Steam32 ID, Example: [U:1:2356325]
 */
const From64To32 = (steam64: string): string => Big(steam64).minus(BASE_NUM).toString()

export default From64To32
