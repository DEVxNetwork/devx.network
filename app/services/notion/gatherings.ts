import eventsData from "@/app/data/events.json"
import type { LumaEvent } from "@/app/services/luma"
import { upcomingGatheringsFromEvents } from "@/app/services/luma/staticGatherings"
import type { PublicGathering } from "@/app/content/gatherings"

//
// Types
//

type RichText = {
	plain_text?: string
}

type NotionProperty = {
	type: string
	title?: RichText[]
	rich_text?: RichText[]
	url?: string | null
	date?: { start: string | null; end: string | null } | null
	status?: { name?: string } | null
}

type NotionPage = {
	id: string
	properties: Record<string, NotionProperty>
}

type NotionQueryResponse = {
	results: NotionPage[]
	has_more: boolean
	next_cursor: string | null
}

//
// Constants
//

const DATA_SOURCE_ID = "b70385ad-4896-82fb-af0d-075f7ef2b990"
const NOTION_VERSION = "2025-09-03"
const PUBLIC_STATUS = "Event"
const PACIFIC = "America/Los_Angeles"

//
// Functions
//

export async function listUpcomingGatherings(): Promise<PublicGathering[]> {
	const today = pacificToday()
	const gatherings = await listPublishedGatherings()
	const upcoming = gatherings
		.filter((gathering) => isOnOrAfterToday(gathering, today))
		.sort((a, b) => a.start.localeCompare(b.start))
	if (upcoming.length > 0) return upcoming
	return upcomingGatheringsFromEvents()
}

export async function listPastGatherings(): Promise<PublicGathering[]> {
	const today = pacificToday()
	const gatherings = await listPublishedGatherings()
	return gatherings
		.filter((gathering) => !isOnOrAfterToday(gathering, today))
		.sort((a, b) => b.start.localeCompare(a.start))
}

export async function findGatheringByLumaUrl(url: string): Promise<PublicGathering | null> {
	const key = canonicalLumaUrl(url)
	const gatherings = await listPublishedGatherings()
	return (
		gatherings.find(
			(gathering) => gathering.lumaUrl && canonicalLumaUrl(gathering.lumaUrl) === key
		) ?? null
	)
}

let publishedGatherings: Promise<PublicGathering[]> | null = null

function listPublishedGatherings(): Promise<PublicGathering[]> {
	if (!publishedGatherings) {
		publishedGatherings = loadPublishedGatherings()
	}
	return publishedGatherings
}

async function loadPublishedGatherings(): Promise<PublicGathering[]> {
	const token = process.env.NOTION_TOKEN
	if (!token) return []

	try {
		const pages = await queryPublishedEvents(token)
		const lumaByUrl = indexLumaEvents(eventsData as LumaEvent[])

		return pages
			.map((page) => toGathering(page, lumaByUrl))
			.filter((gathering): gathering is PublicGathering => gathering !== null)
	} catch (error) {
		console.warn("Notion gatherings unavailable. Using the static event list.")
		console.warn(error)
		return []
	}
}

async function queryPublishedEvents(token: string): Promise<NotionPage[]> {
	const pages: NotionPage[] = []
	let cursor: string | undefined

	do {
		const response = await fetch(`https://api.notion.com/v1/data_sources/${DATA_SOURCE_ID}/query`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
				"Notion-Version": NOTION_VERSION,
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				page_size: 100,
				...(cursor ? { start_cursor: cursor } : {}),
				filter: {
					property: "Status",
					status: { equals: PUBLIC_STATUS }
				},
				sorts: [{ property: "Date", direction: "ascending" }]
			})
		})

		if (!response.ok) {
			throw new Error(`Notion events query failed (${response.status})`)
		}

		const body = (await response.json()) as NotionQueryResponse
		pages.push(...body.results)
		cursor = body.has_more && body.next_cursor ? body.next_cursor : undefined
	} while (cursor)

	return pages
}

function toGathering(page: NotionPage, lumaByUrl: Map<string, string>): PublicGathering | null {
	const name = plainText(page.properties.Name?.title)
	const start = page.properties.Date?.date?.start
	if (!name || !start) return null

	const location = plainText(page.properties.Location?.rich_text)
	const address = plainText(page.properties.Address?.rich_text)
	const lumaUrl = page.properties["Luma URL"]?.url?.trim() || null
	const status = page.properties.Status?.status?.name?.trim() || ""
	const apiId = lumaUrl ? lumaByUrl.get(canonicalLumaUrl(lumaUrl)) : undefined

	return {
		id: page.id,
		name,
		start,
		hasTime: start.includes("T"),
		location,
		address,
		lumaUrl,
		status,
		href: apiId ? `/events/${apiId}` : lumaUrl || "/events"
	}
}

function isOnOrAfterToday(gathering: PublicGathering, today: string): boolean {
	if (gathering.hasTime) return new Date(gathering.start).getTime() >= Date.now()
	return gathering.start.slice(0, 10) >= today
}

function indexLumaEvents(events: LumaEvent[]): Map<string, string> {
	const index = new Map<string, string>()
	for (const event of events) {
		if (!event.url) continue
		index.set(canonicalLumaUrl(event.url), event.api_id)
	}
	return index
}

function canonicalLumaUrl(url: string): string {
	try {
		const parsed = new URL(url.trim())
		const host = parsed.hostname.replace(/^www\./, "")
		return `${host}${parsed.pathname.replace(/\/$/, "")}`.toLowerCase()
	} catch {
		return url.trim().toLowerCase()
	}
}

function plainText(items: RichText[] | undefined): string {
	return (items ?? [])
		.map((item) => item.plain_text ?? "")
		.join("")
		.trim()
}

function pacificToday(): string {
	return new Intl.DateTimeFormat("en-CA", {
		timeZone: PACIFIC,
		year: "numeric",
		month: "2-digit",
		day: "2-digit"
	}).format(new Date())
}
