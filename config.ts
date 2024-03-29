const config: IConfig = {
	apiKey: process.env.STEAM_API_KEY || null,
}

interface IConfig {
	apiKey: string | string[] | null
}

export default config
