const config: IConfig = {
	apiKey: process.env.STEAM_API_KEY || null,
	debugMode: process.env.DEBUG_MODE === 'true' || false,
}

interface IConfig {
	apiKey: string | string[] | null
	debugMode: boolean
}

export default config
