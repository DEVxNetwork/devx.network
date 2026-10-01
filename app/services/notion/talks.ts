import { talks as staticTalks } from "@/app/info/talks"
import { notionToken } from "@/app/services/notion/token"

//
// Types
//

export type WatchTalk = {
	videoId: string
	speaker: string
	title: string
	date: string
	year: number
	startTime: string
	endTime: string
}

type RichText = {
	plain_text?: string
}

type NotionProperty = {
	type: string
	title?: RichText[]
	rich_text?: RichText[]
	url?: string | null
	date?: { start: string | null } | null
}

type NotionPage = {
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

const DATA_SOURCE_ID = "415948ee-438b-4bec-9da8-576fff9d9b74"
const NOTION_VERSION = "2025-09-03"

//
// Functions
//

export async function listWatchTalks(): Promise<WatchTalk[]> {
	const fromNotion = await loadNotionTalks()
	if (fromNotion.length > 0) return fromNotion
	return staticTalks.map(toWatchTalk)
}

let notionTalks: Promise<WatchTalk[]> | null = null

function loadNotionTalks(): Promise<WatchTalk[]> {
	if (!notionTalks) notionTalks = queryNotionTalks()
	return notionTalks
}

async function queryNotionTalks(): Promise<WatchTalk[]> {
	const token = notionToken()
	if (!token) return []

	try {
		const pages = await queryTalkPages(token)
		return pages.map(toTalk).filter((talk): talk is WatchTalk => talk !== null)
	} catch (error) {
		console.warn("Notion talks unavailable. Using the static talk list.")
		console.warn(error)
		return []
	}
}

async function queryTalkPages(token: string): Promise<NotionPage[]> {
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
				sorts: [{ property: "Date", direction: "descending" }]
			})
		})

		if (!response.ok) {
			throw new Error(`Notion talks query failed (${response.status})`)
		}

		const body = (await response.json()) as NotionQueryResponse
		pages.push(...body.results)
		cursor = body.has_more && body.next_cursor ? body.next_cursor : undefined
	} while (cursor)

	return pages
}

function toTalk(page: NotionPage): WatchTalk | null {
	const title = plainText(page.properties.Name?.title)
	const videoId = videoIdFromUrl(page.properties["YouTube URL"]?.url ?? "")
	const date = page.properties.Date?.date?.start?.slice(0, 10) ?? ""
	if (!title || !videoId || !date) return null

	const year = Number(date.slice(0, 4))
	if (!Number.isFinite(year)) return null

	return {
		videoId,
		speaker: plainText(page.properties.Speaker?.rich_text),
		title,
		date,
		year,
		startTime: plainText(page.properties.Start?.rich_text) || "0s",
		endTime: plainText(page.properties.End?.rich_text)
	}
}

function toWatchTalk(talk: (typeof staticTalks)[number]): WatchTalk {
	return {
		videoId: talk.videoId,
		speaker: talk.speaker,
		title: talk.title,
		date: talk.date,
		year: talk.year,
		startTime: talk.startTime,
		endTime: talk.endTime
	}
}

function videoIdFromUrl(url: string): string | null {
	try {
		const parsed = new URL(url.trim())
		const host = parsed.hostname.replace(/^www\./, "")
		if (host === "youtu.be") {
			return parsed.pathname.split("/").filter(Boolean)[0] ?? null
		}
		if (host !== "youtube.com" && host !== "m.youtube.com") return null
		const watch = parsed.searchParams.get("v")
		if (watch) return watch
		const [marker, id] = parsed.pathname.split("/").filter(Boolean)
		if ((marker === "live" || marker === "embed" || marker === "shorts") && id) return id
		return null
	} catch {
		return null
	}
}

function plainText(items: RichText[] | undefined): string {
	return (items ?? [])
		.map((item) => item.plain_text ?? "")
		.join("")
		.trim()
}
