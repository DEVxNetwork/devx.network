import { loadEnv } from "vite"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

//
// Constants
//

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../..")

let loaded = false

//
// Functions
//

export function notionToken(): string | undefined {
	if (process.env.NOTION_TOKEN) return process.env.NOTION_TOKEN
	if (loaded) return undefined
	loaded = true

	const env = loadEnv(process.env.NODE_ENV || "development", root, "NOTION_")
	if (env.NOTION_TOKEN) process.env.NOTION_TOKEN = env.NOTION_TOKEN
	return process.env.NOTION_TOKEN
}
