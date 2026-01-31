import type { LumaService } from "./types"
import { StaticLumaService } from "./StaticLumaService"

// Exports //

export * from "./types"

// Service Factory //

function createLumaService(): LumaService {
	// TODO: Uncomment this when we have a way to communicate with the Luma API
	// from the client-side without revealing the API key.
	// const apiKey = process.env.LUMA_API_KEY
	// if (apiKey) {
	// 	// Use real API if key is available
	// 	return new ApiLumaService(apiKey)
	// }

	// Default to static service for development/demo
	return new StaticLumaService()
}

export const lumaService = createLumaService()
