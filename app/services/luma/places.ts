import eventsData from "@/app/data/events.json"
import { placeLine } from "@/app/content/community"
import type { PublicGathering } from "@/app/content/gatherings"
import type { EventPlace } from "@/app/events/eventPlace"
import type { LumaEvent } from "./types"

//
// Types
//

type PlacePart = {
	key: string
	place: EventPlace
	anchor: boolean
}

type PlaceIndex = {
	byId: Map<string, EventPlace>
	bySlug: Map<string, EventPlace>
	byUrl: Map<string, EventPlace>
	byExact: Map<string, EventPlace>
	parts: PlacePart[]
}

//
// Constants
//

const generic = new Set([
	"san diego",
	"san diego ca",
	"san diego california",
	"oceanside",
	"oceanside ca",
	"oceanside california",
	"carlsbad",
	"carlsbad ca",
	"carlsbad california",
	"encinitas",
	"encinitas ca",
	"la jolla",
	"la jolla ca",
	"solana beach",
	"solana beach ca",
	"california",
	"online"
])

//
// Functions
//

export function placesForGatherings(gatherings: PublicGathering[]): Record<string, EventPlace> {
	const index = buildIndex(eventsData as LumaEvent[])
	const places: Record<string, EventPlace> = {}

	for (const gathering of gatherings) {
		const place = matchGathering(gathering, index)
		if (place) places[gathering.id] = place
	}

	return places
}

function buildIndex(events: LumaEvent[]): PlaceIndex {
	const index: PlaceIndex = {
		byId: new Map(),
		bySlug: new Map(),
		byUrl: new Map(),
		byExact: new Map(),
		parts: []
	}

	for (const event of events) {
		const place = placeFromEvent(event)
		if (!place) continue

		index.byId.set(event.api_id, place)
		index.byId.set(event.api_id.toLowerCase(), place)

		const slug = pathSlug(event.url)
		if (slug) index.bySlug.set(slug, place)

		const url = canonicalLumaUrl(event.url)
		if (url) index.byUrl.set(url, place)

		const address = event.location?.address ?? ""
		remember(index, normalize(address), place, false)
		for (const part of address.split(",")) {
			remember(index, normalize(part), place, true)
		}

		const alias = normalize(placeLine(event))
		if (alias && !generic.has(alias)) remember(index, alias, place, false)
	}

	index.parts.sort((a, b) => b.key.length - a.key.length)
	return index
}

function matchGathering(gathering: PublicGathering, index: PlaceIndex): EventPlace | null {
	// The words on the card win when they name a venue. A Luma link can lag behind a move.
	const fromText = placeFromText(gathering, index)
	if (fromText) return fromText

	const slug = hrefSlug(gathering.href)
	const bySlug = (slug && index.byId.get(slug)) || (slug && index.bySlug.get(slug.toLowerCase()))
	if (bySlug) return bySlug

	if (gathering.lumaUrl) {
		const url = canonicalLumaUrl(gathering.lumaUrl)
		const fromUrl = (url && index.byUrl.get(url)) || index.bySlug.get(pathSlug(gathering.lumaUrl))
		if (fromUrl) return fromUrl
	}

	return null
}

function placeFromText(gathering: PublicGathering, index: PlaceIndex): EventPlace | null {
	const needles = [normalize(gathering.location), normalize(gathering.address)].filter(isExactKey)
	for (const needle of needles) {
		const exact = index.byExact.get(needle)
		if (exact) return exact
	}

	for (const part of index.parts) {
		if (!part.anchor) continue
		for (const needle of needles) {
			if (needle.includes(part.key) || part.key.includes(needle)) return part.place
		}
	}

	return null
}

function remember(index: PlaceIndex, key: string, place: EventPlace, fromPart: boolean) {
	if (!isExactKey(key) || index.byExact.has(key)) return
	index.byExact.set(key, place)
	index.parts.push({
		key,
		place,
		anchor: fromPart && key.length >= 12 && /\d/.test(key)
	})
}

function placeFromEvent(event: LumaEvent): EventPlace | null {
	if (event.location?.type !== "physical") return null
	const lat = Number(event.location.coordinates?.lat)
	const lng = Number(event.location.coordinates?.lng)
	if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
	if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return null
	return { lat, lng }
}

function isExactKey(value: string): boolean {
	if (value.length < 6) return false
	if (generic.has(value)) return false
	if (/^\d+$/.test(value)) return false
	return true
}

function normalize(value: string): string {
	return value
		.toLowerCase()
		.replace(/\b(usa|united states)\b/g, " ")
		.replace(/[^a-z0-9]+/g, " ")
		.replace(/\s+/g, " ")
		.trim()
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
		return ""
	}
}

function hrefSlug(href: string): string {
	return href.split("/").filter(Boolean).pop() ?? ""
}
