#!/usr/bin/env node

/**
 * Script to fetch events from Luma API and update events.json
 *
 * Uses the official Luma API: https://docs.luma.com/reference/get_v1-calendar-list-events
 * Requires LUMA_API_KEY environment variable (from .env file)
 *
 * Events are deduplicated by api_id and sorted chronologically (newest first).
 *
 * Usage:
 *   bun run scripts/update-events.ts
 */

import { readFileSync, writeFileSync } from "fs"
import { join } from "path"
import { marked } from "marked"
import type { LumaEvent, LumaLocation } from "@/app/services/luma/types"

// Constants //

const PROJECT_ROOT = join(process.cwd())
const EVENTS_FILE = join(PROJECT_ROOT, "app/data/events.json")
const LUMA_API_BASE = "https://public-api.luma.com/v1"
const CALENDAR_ID = "cal-XOMDXT4v9EMe4yb"
const DEFAULT_TIMEZONE = "America/Los_Angeles"

// Types //

interface LumaApiGeo {
	latitude?: string
	longitude?: string
	address?: {
		city?: string
		region?: string
		country?: string
		street_address?: string
		full_address?: string
	}
	place_id?: string
}

interface LumaApiEvent {
	api_id: string
	name: string
	description?: string
	description_md?: string // Markdown formatted description from API
	start_at: string
	end_at: string
	timezone: string
	cover_url?: string
	url?: string
	geo?: LumaApiGeo
	geo_latitude?: string
	geo_longitude?: string
	geo_address_json?: {
		city?: string
		region?: string
		country?: string
		address?: string
		full_address?: string
	}
	location_type?: "offline" | "online" | "hybrid"
	meeting_url?: string
	visibility?: "public" | "private"
	guest_count?: number
}

interface LumaApiEntry {
	api_id: string
	event: LumaApiEvent
	calendar_api_id?: string
}

interface LumaApiResponse {
	entries: LumaApiEntry[]
	has_more: boolean
	next_cursor?: string
}

interface LumaApiEventDetailResponse {
	event: LumaApiEvent
}

// Functions //

async function fetchEventDetails(apiKey: string, eventId: string): Promise<LumaApiEvent | null> {
	try {
		const url = new URL(`${LUMA_API_BASE}/event/get`)
		url.searchParams.set("api_id", eventId)

		const response = await fetch(url.toString(), {
			headers: {
				"x-luma-api-key": apiKey,
				"Content-Type": "application/json"
			}
		})

		if (!response.ok) {
			return null
		}

		const data: LumaApiEventDetailResponse = await response.json()
		return data.event
	} catch {
		return null
	}
}

function transformApiEventToLumaEvent(apiEvent: LumaApiEvent): LumaEvent {
	let location: LumaLocation | undefined

	// Check for online event
	if (apiEvent.meeting_url) {
		location = { type: "online" }
	}
	// Check for physical location using geo fields from detailed API response
	else if (apiEvent.geo_latitude && apiEvent.geo_longitude) {
		const addressJson = apiEvent.geo_address_json
		location = {
			type: "physical",
			address: addressJson?.full_address || addressJson?.address,
			city: addressJson?.city,
			state: addressJson?.region,
			coordinates: {
				lat: apiEvent.geo_latitude,
				lng: apiEvent.geo_longitude
			}
		}
	}
	// Fallback to nested geo object (from list endpoint)
	else if (apiEvent.geo) {
		const geo = apiEvent.geo
		const address = geo.address

		location = {
			type: "physical",
			address: address?.full_address || address?.street_address,
			city: address?.city,
			state: address?.region,
			coordinates:
				geo.latitude && geo.longitude
					? {
							lat: geo.latitude,
							lng: geo.longitude
						}
					: undefined
		}
	}

	// Construct the public URL from the api_id
	const eventSlug = apiEvent.api_id.replace(/^evt-/, "")
	const url = apiEvent.url || `https://lu.ma/${eventSlug}`

	// Store markdown and convert to HTML
	const descriptionMd = apiEvent.description_md || undefined
	const descriptionHtml = descriptionMd ? (marked.parse(descriptionMd) as string) : undefined

	return {
		api_id: apiEvent.api_id,
		name: apiEvent.name,
		description: apiEvent.description || apiEvent.name,
		description_md: descriptionMd,
		description_html: descriptionHtml,
		start_at: apiEvent.start_at,
		end_at: apiEvent.end_at,
		location,
		cover_url: apiEvent.cover_url,
		url,
		guest_count: apiEvent.guest_count ?? -1,
		visibility: apiEvent.visibility || "public",
		timezone: apiEvent.timezone || DEFAULT_TIMEZONE
	}
}

async function fetchAllEvents(apiKey: string): Promise<Map<string, LumaEvent>> {
	const eventMap = new Map<string, LumaEvent>()
	const eventIds: string[] = []
	let paginationCursor: string | undefined
	let pageCount = 0

	console.log("Fetching event list from Luma API (newest first)...")

	// First, get list of all event IDs
	do {
		pageCount++
		const url = new URL(`${LUMA_API_BASE}/calendar/list-events`)
		url.searchParams.set("calendar_api_id", CALENDAR_ID)
		url.searchParams.set("sort_column", "start_at")
		url.searchParams.set("sort_direction", "desc")
		if (paginationCursor) {
			url.searchParams.set("pagination_cursor", paginationCursor)
		}

		console.log(`  Page ${pageCount}${paginationCursor ? "" : " (initial)"}`)

		const response = await fetch(url.toString(), {
			headers: {
				"x-luma-api-key": apiKey,
				"Content-Type": "application/json"
			}
		})

		if (!response.ok) {
			const errorText = await response.text()
			throw new Error(`Luma API error: ${response.status} ${response.statusText}\n${errorText}`)
		}

		const data: LumaApiResponse = await response.json()

		let newCount = 0
		for (const entry of data.entries) {
			const eventId = entry.event.api_id
			// Deduplicate by event ID
			if (!eventIds.includes(eventId)) {
				eventIds.push(eventId)
				newCount++
			}
		}

		console.log(
			`    → ${data.entries.length} results, ${newCount} new (${eventIds.length} total unique)`
		)

		paginationCursor = data.has_more ? data.next_cursor : undefined
	} while (paginationCursor)

	// Now fetch full details for each event (includes description_html)
	console.log(`\nFetching full details for ${eventIds.length} events...`)

	for (let i = 0; i < eventIds.length; i++) {
		const eventId = eventIds[i]
		process.stdout.write(`  Fetching event ${i + 1}/${eventIds.length}...\r`)

		const eventDetails = await fetchEventDetails(apiKey, eventId)
		if (eventDetails) {
			const lumaEvent = transformApiEventToLumaEvent(eventDetails)
			eventMap.set(eventId, lumaEvent)
		}

		// Small delay to avoid rate limiting
		if (i < eventIds.length - 1) {
			await new Promise((resolve) => setTimeout(resolve, 100))
		}
	}

	console.log(`  Fetched details for ${eventMap.size} events                `)

	return eventMap
}

function synchronizeEvents(
	existingEvents: LumaEvent[],
	fetchedEvents: Map<string, LumaEvent>
): LumaEvent[] {
	const eventMap = new Map<string, LumaEvent>()

	// Start with existing events
	for (const event of existingEvents) {
		if (event.api_id) {
			eventMap.set(event.api_id, event)
		}
	}

	// Update with fetched events (API data takes precedence)
	for (const [eventId, event] of fetchedEvents) {
		const existing = eventMap.get(eventId)
		if (existing) {
			// Merge: new data wins, but preserve fields not in API response
			eventMap.set(eventId, {
				...existing,
				...event,
				// Keep existing descriptions if API didn't provide new ones
				description_md: event.description_md || existing.description_md,
				description_html: event.description_html || existing.description_html
			})
		} else {
			eventMap.set(eventId, event)
		}
	}

	// Convert to array and sort chronologically (newest first)
	const events = Array.from(eventMap.values())
	events.sort((a, b) => new Date(b.start_at).getTime() - new Date(a.start_at).getTime())

	return events
}

async function main() {
	console.log("=== Luma Events Sync ===\n")

	const apiKey = process.env.LUMA_API_KEY
	if (!apiKey) {
		console.error("❌ LUMA_API_KEY environment variable is required")
		console.error("   Add it to .env: LUMA_API_KEY=your-key-here")
		process.exit(1)
	}

	try {
		// Load existing events
		let existingEvents: LumaEvent[] = []
		try {
			const data = readFileSync(EVENTS_FILE, "utf-8")
			existingEvents = JSON.parse(data) as LumaEvent[]
			console.log(`Loaded ${existingEvents.length} existing events\n`)
		} catch {
			console.log("No existing events file, starting fresh\n")
		}

		// Fetch from API
		const fetchedEvents = await fetchAllEvents(apiKey)
		console.log(`\nFetched ${fetchedEvents.size} unique events from API`)

		// Synchronize
		const syncedEvents = synchronizeEvents(existingEvents, fetchedEvents)

		// Write to file
		writeFileSync(EVENTS_FILE, JSON.stringify(syncedEvents, null, "\t") + "\n", "utf-8")

		// Summary
		const now = new Date()
		const upcoming = syncedEvents.filter((e) => new Date(e.start_at) >= now).length
		const past = syncedEvents.filter((e) => new Date(e.start_at) < now).length

		console.log(`\n✅ Synchronized ${syncedEvents.length} events`)
		console.log(`   Upcoming: ${upcoming}`)
		console.log(`   Past: ${past}`)
	} catch (error) {
		console.error("\n❌ Error:", error)
		process.exit(1)
	}
}

main()
