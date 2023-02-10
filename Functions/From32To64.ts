import Big from 'big.js'
import { BASE_NUM } from '../utils'

/**
 * Converts a Steam32 ID to a Steam64 ID
 * @param steam32 The user Steam32 ID, Example: [U:1:2356325]
 * @returns The user Steam32 ID, Example: 76561198000000000
 */

const From32To64 = (steam32: string): string => Big(steam32).plus(BASE_NUM).toString()

export default From32To64
