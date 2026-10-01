import eventsData from "@/app/data/events.json"
import { gatheringKind } from "@/app/content/community"
import type { PublicGathering } from "@/app/content/gatherings"
import type { LumaEvent } from "./types"

//
// Constants
//

const FALLBACK: Record<string, string> = {
	function: "/images/weekend-function-talk.webp",
	coroutine: "/images/about/friday.webp",
	paper: "/images/paper-club.webp",
	founders: "/images/hero/room-wide.webp",
	gathering: "/images/hero/room-tall.webp"
}

//
// Functions
//

export function coversForGatherings(gatherings: PublicGathering[]): Record<string, string> {
	const byId = new Map<string, string>()
	const byUrl = new Map<string, string>()
	const bySlug = new Map<string, string>()

	for (const event of eventsData as LumaEvent[]) {
		if (!event.cover_url) continue
		byId.set(event.api_id, event.cover_url)
		if (!event.url) continue
		byUrl.set(canonicalLumaUrl(event.url), event.cover_url)
		const slug = pathSlug(event.url)
		if (slug) bySlug.set(slug, event.cover_url)
	}

	const covers: Record<string, string> = {}
	for (const gathering of gatherings) {
		const fromUrl = gathering.lumaUrl ? byUrl.get(canonicalLumaUrl(gathering.lumaUrl)) : undefined
		const slug = pathSlug(gathering.lumaUrl || gathering.href)
		covers[gathering.id] =
			byId.get(gathering.id) ||
			fromUrl ||
			(slug ? bySlug.get(slug) : undefined) ||
			FALLBACK[gatheringKind(gathering.name)]
	}
	return covers
}

function canonicalLumaUrl(url: string): string {
	try {
		const parsed = new URL(url.trim())
		let host = parsed.hostname.replace(/^www\./, "").toLowerCase()
		if (host === "lu.ma") host = "luma.com"
		return `${host}${parsed.pathname.replace(/\/$/, "").toLowerCase()}`
	} catch {
		return ""
	}
}

function pathSlug(url: string): string {
	try {
		return new URL(url.trim()).pathname.split("/").filter(Boolean).pop()?.toLowerCase() ?? ""
	} catch {
		return url.split("/").filter(Boolean).pop()?.toLowerCase() ?? ""
	}
}
