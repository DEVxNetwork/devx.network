import { parseTalkProposal, type TalkProposal } from "@/app/speak/proposal"

//
// Types
//

type SpeakResponse = {
	status: number
	body: { ok: boolean; error?: string }
}

type NotionText = {
	type: "text"
	text: { content: string; link?: { url: string } }
}

//
// Constants
//

const DATA_SOURCE_ID = "58a385ad-4896-82b6-a599-0740d8733571"
const NOTION_VERSION = "2025-09-03"

// The option name uses an em dash, matching the Presentations status list.
const INBOUND_STATUS = "Inbound — Website"

const notionPageId = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

//
// Functions
//

export async function handleSpeakPost(raw: string): Promise<SpeakResponse> {
	let input: unknown
	try {
		input = JSON.parse(raw)
	} catch {
		return { status: 400, body: { ok: false, error: "That form didn't come through. Try again." } }
	}

	const parsed = parseTalkProposal(input)
	if (parsed.kind === "ignore") return { status: 200, body: { ok: true } }
	if (parsed.kind === "invalid") return { status: 400, body: { ok: false, error: parsed.error } }

	try {
		await createTalkProposal(parsed.proposal)
		return { status: 200, body: { ok: true } }
	} catch (error) {
		console.warn("Talk proposal was not saved.")
		console.warn(error)
		const missing = error instanceof Error && error.message === "missing-token"
		return {
			status: missing ? 503 : 502,
			body: {
				ok: false,
				error: missing ? "Saving talks is offline right now." : "We couldn't save that. Try again."
			}
		}
	}
}

export async function createTalkProposal(proposal: TalkProposal): Promise<void> {
	const token = process.env.NOTION_TOKEN
	if (!token) throw new Error("missing-token")

	const properties: Record<string, unknown> = {
		Name: { title: [{ type: "text", text: { content: proposal.title } }] },
		Status: { select: { name: INBOUND_STATUS } }
	}

	if (notionPageId.test(proposal.eventId)) {
		properties.Event = { relation: [{ id: proposal.eventId }] }
	}

	const response = await fetch("https://api.notion.com/v1/pages", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
			"Notion-Version": NOTION_VERSION,
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			parent: { data_source_id: DATA_SOURCE_ID },
			properties,
			children: pageBody(proposal)
		})
	})

	if (!response.ok) {
		const detail = await response.text()
		throw new Error(
			`Notion presentation create failed (${response.status}): ${detail.slice(0, 500)}`
		)
	}
}

function pageBody(proposal: TalkProposal): unknown[] {
	const eventLine = proposal.eventName || "Any upcoming Saturday"
	const email: NotionText = emailPattern.test(proposal.email)
		? {
				type: "text",
				text: { content: proposal.email, link: { url: `mailto:${proposal.email}` } }
			}
		: { type: "text", text: { content: proposal.email } }

	return [
		paragraph([{ type: "text", text: { content: `${proposal.name} · ` } }, email]),
		paragraph([{ type: "text", text: { content: `Event: ${eventLine}` } }]),
		...chunkText(proposal.about).map((content) => paragraph([{ type: "text", text: { content } }]))
	]
}

function paragraph(richText: NotionText[]): unknown {
	return {
		object: "block",
		type: "paragraph",
		paragraph: { rich_text: richText }
	}
}

function chunkText(value: string): string[] {
	const chunks: string[] = []
	let rest = value
	while (rest.length > 0) {
		chunks.push(rest.slice(0, 1800))
		rest = rest.slice(1800)
	}
	return chunks
}
