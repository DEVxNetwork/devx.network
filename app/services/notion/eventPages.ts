import { marked } from "marked"
import eventsData from "@/app/data/events.json"
import { gatheringRegistration, type PublicGathering } from "@/app/content/gatherings"
import { gatheringFromEvent } from "@/app/services/luma/staticGatherings"
import type { LumaEvent } from "@/app/services/luma/types"
import { findGatheringBySlug, listEventGatherings } from "@/app/services/notion/gatherings"
import { notionToken } from "@/app/services/notion/token"

//
// Types
//

export type EventMap = {
	lat: string
	lng: string
	address: string
}

export type EventPageModel = {
	gathering: PublicGathering
	descriptionHtml: string
	descriptionPlain: string
	seatUrl: string | null
	map: EventMap | null
}

type RichText = {
	plain_text?: string
	href?: string | null
	annotations?: {
		bold?: boolean
		italic?: boolean
		strikethrough?: boolean
		code?: boolean
	}
}

type BlockPayload = {
	rich_text?: RichText[]
	url?: string
	language?: string
}

type NotionBlock = {
	id: string
	type: string
	has_children: boolean
} & Record<string, BlockPayload | boolean | string | undefined>

type BlockList = {
	results: NotionBlock[]
	has_more: boolean
	next_cursor: string | null
}

type EventCopy = {
	markdown: string
	plain: string
}

//
// Constants
//

const NOTION_VERSION = "2025-09-03"
const EMPTY_COPY: EventCopy = { markdown: "", plain: "" }
const notionPageId = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const nestedTypes = new Set([
	"bulleted_list_item",
	"numbered_list_item",
	"toggle",
	"quote",
	"callout",
	"paragraph"
])

//
// Functions
//

export async function listEventSlugs(): Promise<string[]> {
	const slugs: string[] = []
	const seen = new Set<string>()
	const notionEvents = await listEventGatherings()

	for (const gathering of notionEvents) {
		const slug = slugFromHref(gathering.href)
		if (!slug || seen.has(slug)) continue
		seen.add(slug)
		slugs.push(slug)
	}

	const lumaEvents = eventsData as LumaEvent[]
	if (slugs.length === 0) return lumaEvents.map((event) => event.api_id)

	for (const event of lumaEvents) {
		if (seen.has(event.api_id)) continue
		seen.add(event.api_id)
		slugs.push(event.api_id)
	}

	return slugs
}

export async function loadEventPage(slug: string): Promise<EventPageModel | null> {
	const fromNotion = await findGatheringBySlug(slug)
	const luma = findLumaEvent(slug, fromNotion?.lumaUrl ?? null)
	const gathering = fromNotion ?? (luma ? gatheringFromEvent(luma) : null)
	if (!gathering) return null

	const copy = notionPageId.test(gathering.id) ? await getEventCopy(gathering.id) : EMPTY_COPY
	const markdown = copy.markdown || luma?.description_md || ""
	const descriptionHtml = markdown
		? String(await marked.parse(markdown))
		: (luma?.description_html ?? "")
	const coordinates = luma?.location?.type === "physical" ? luma.location.coordinates : undefined

	return {
		gathering,
		descriptionHtml,
		descriptionPlain: copy.plain || luma?.description || "",
		seatUrl: gatheringRegistration(gathering)?.href || luma?.url || null,
		map:
			coordinates?.lat && coordinates.lng
				? {
						lat: coordinates.lat,
						lng: coordinates.lng,
						address: luma?.location?.address ?? gathering.address
					}
				: null
	}
}

const copyCache = new Map<string, Promise<EventCopy>>()
let notionQueue: Promise<unknown> = Promise.resolve()

function getEventCopy(pageId: string): Promise<EventCopy> {
	const cached = copyCache.get(pageId)
	if (cached) return cached
	const pending = loadEventCopy(pageId)
	copyCache.set(pageId, pending)
	return pending
}

async function loadEventCopy(pageId: string): Promise<EventCopy> {
	const token = notionToken()
	if (!token) return EMPTY_COPY

	try {
		const blocks = await listBlockChildren(token, pageId)
		const markdown = (await blocksToMarkdown(token, blocks, 0)).trim()
		return { markdown, plain: plainFromBlocks(blocks) }
	} catch (error) {
		console.warn(`Notion event copy unavailable for ${pageId}.`)
		console.warn(error)
		return EMPTY_COPY
	}
}

async function listBlockChildren(token: string, blockId: string): Promise<NotionBlock[]> {
	const blocks: NotionBlock[] = []
	let cursor: string | undefined

	do {
		const url = new URL(`https://api.notion.com/v1/blocks/${blockId}/children`)
		url.searchParams.set("page_size", "100")
		if (cursor) url.searchParams.set("start_cursor", cursor)

		const response = await notionGet(token, url)
		if (!response.ok) {
			throw new Error(`Notion blocks query failed (${response.status})`)
		}

		const body = (await response.json()) as BlockList
		blocks.push(...body.results)
		cursor = body.has_more && body.next_cursor ? body.next_cursor : undefined
	} while (cursor)

	return blocks
}

async function blocksToMarkdown(
	token: string,
	blocks: NotionBlock[],
	depth: number
): Promise<string> {
	const lines: string[] = []

	for (const block of blocks) {
		const line = blockLine(block)
		if (line) lines.push(line)
		if (!block.has_children || depth >= 2 || !nestedTypes.has(block.type)) continue

		const children = await listBlockChildren(token, block.id)
		const nested = (await blocksToMarkdown(token, children, depth + 1)).trim()
		if (!nested) continue
		lines.push(
			nested
				.split("\n")
				.map((row) => (row ? `  ${row}` : row))
				.join("\n")
		)
	}

	return lines.join("\n\n")
}

function blockLine(block: NotionBlock): string {
	const text = richTextToMarkdown(payloadOf(block)?.rich_text)
	switch (block.type) {
		case "heading_1":
			return text ? `# ${text}` : ""
		case "heading_2":
			return text ? `## ${text}` : ""
		case "heading_3":
			return text ? `### ${text}` : ""
		case "bulleted_list_item":
			return text ? `- ${text}` : ""
		case "numbered_list_item":
			return text ? `1. ${text}` : ""
		case "quote":
			return text ? `> ${text}` : ""
		case "paragraph":
		case "callout":
		case "toggle":
			return text
		case "divider":
			return "---"
		case "code":
			return codeFence(block)
		case "bookmark": {
			const url = payloadOf(block)?.url
			return url && isSafeUrl(url) ? `[${url}](${url})` : ""
		}
		default:
			return ""
	}
}

function codeFence(block: NotionBlock): string {
	const payload = payloadOf(block)
	const code = (payload?.rich_text ?? []).map((item) => item.plain_text ?? "").join("")
	if (!code) return ""
	const language = (payload?.language ?? "").replace(/[^a-z0-9_+-]/gi, "")
	return `\`\`\`${language}\n${code}\n\`\`\``
}

function payloadOf(block: NotionBlock): BlockPayload | undefined {
	const payload = block[block.type]
	if (!payload || typeof payload !== "object") return undefined
	return payload
}

function richTextToMarkdown(items: RichText[] | undefined): string {
	return (items ?? []).map(spanToMarkdown).join("")
}

function spanToMarkdown(span: RichText): string {
	let text = escapeMarkdown(span.plain_text ?? "")
	if (!text) return ""
	if (span.annotations?.code) text = `\`${text}\``
	if (span.annotations?.bold) text = `**${text}**`
	if (span.annotations?.italic) text = `*${text}*`
	if (span.annotations?.strikethrough) text = `~~${text}~~`
	if (span.href && isSafeUrl(span.href)) text = `[${text}](${span.href})`
	return text
}

function plainFromBlocks(blocks: NotionBlock[]): string {
	return blocks
		.map((block) =>
			(payloadOf(block)?.rich_text ?? []).map((item) => item.plain_text ?? "").join("")
		)
		.map((line) => line.trim())
		.filter(Boolean)
		.join(" ")
}

function findLumaEvent(slug: string, lumaUrl: string | null): LumaEvent | null {
	const events = eventsData as LumaEvent[]
	const byId = events.find((event) => event.api_id === slug)
	if (byId) return byId
	if (!lumaUrl) return null
	const key = canonicalLumaUrl(lumaUrl)
	return events.find((event) => event.url && canonicalLumaUrl(event.url) === key) ?? null
}

function slugFromHref(href: string): string | null {
	if (!href.startsWith("/events/")) return null
	const slug = href.slice("/events/".length)
	if (!slug || slug.includes("/")) return null
	return slug
}

function canonicalLumaUrl(url: string): string {
	try {
		const parsed = new URL(url.trim())
		let host = parsed.hostname.replace(/^www\./, "").toLowerCase()
		if (host === "lu.ma") host = "luma.com"
		return `${host}${parsed.pathname.replace(/\/$/, "").toLowerCase()}`
	} catch {
		return url.trim().toLowerCase()
	}
}

function escapeMarkdown(value: string): string {
	return value.replace(/[\\`*_{}[\]()#+\-.!|<>&]/g, (char) => {
		if (char === "<") return "&lt;"
		if (char === ">") return "&gt;"
		if (char === "&") return "&amp;"
		return `\\${char}`
	})
}

function isSafeUrl(url: string): boolean {
	try {
		const parsed = new URL(url)
		return (
			parsed.protocol === "https:" || parsed.protocol === "http:" || parsed.protocol === "mailto:"
		)
	} catch {
		return false
	}
}

function notionGet(token: string, url: URL): Promise<Response> {
	const run = notionQueue.then(
		() => fetchBlocks(token, url),
		() => fetchBlocks(token, url)
	)
	notionQueue = run.then(
		() => delay(250),
		() => delay(250)
	)
	return run
}

async function fetchBlocks(token: string, url: URL): Promise<Response> {
	const first = await fetch(url, { headers: notionHeaders(token) })
	if (first.status !== 429) return first
	await delay(800)
	return fetch(url, { headers: notionHeaders(token) })
}

function notionHeaders(token: string): HeadersInit {
	return {
		Authorization: `Bearer ${token}`,
		"Notion-Version": NOTION_VERSION
	}
}

function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms))
}
