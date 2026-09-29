//
// Types
//

export type TalkProposal = {
	name: string
	email: string
	title: string
	about: string
	eventId: string
	eventName: string
}

export type ParsedProposal =
	| { kind: "ignore" }
	| { kind: "invalid"; error: string }
	| { kind: "ok"; proposal: TalkProposal }

//
// Constants
//

export const TALK_MAILBOX = "tryston@devx.network"

const LIMITS = {
	name: 120,
	email: 200,
	title: 180,
	about: 4000,
	eventName: 200,
	eventId: 80
} as const

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

//
// Functions
//

export function parseTalkProposal(input: unknown): ParsedProposal {
	if (!input || typeof input !== "object") {
		return { kind: "invalid", error: "That form didn't come through. Try again." }
	}

	const record = input as Record<string, unknown>
	if (typeof record.company === "string" && record.company.trim() !== "") {
		return { kind: "ignore" }
	}

	const name = readText(record.name, LIMITS.name)
	const email = readText(record.email, LIMITS.email)
	const title = readText(record.title, LIMITS.title)
	const about = readText(record.about, LIMITS.about)
	const eventId = readText(record.eventId, LIMITS.eventId)
	const eventName = readText(record.eventName, LIMITS.eventName)

	if (!name || !email || !title || !about) {
		return { kind: "invalid", error: "Name, email, a title, and a few sentences are required." }
	}
	if (!emailPattern.test(email)) {
		return { kind: "invalid", error: "That email doesn't look usable." }
	}

	return {
		kind: "ok",
		proposal: { name, email, title, about, eventId, eventName }
	}
}

export function talkMailHref(proposal: TalkProposal): string {
	const subject = `Talk proposal: ${proposal.title}`
	const eventLine = proposal.eventName || "Any upcoming Saturday"
	const body = [
		`Name: ${proposal.name}`,
		`Email: ${proposal.email}`,
		`Event: ${eventLine}`,
		"",
		proposal.about
	].join("\n")

	return `mailto:${TALK_MAILBOX}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

function readText(value: unknown, max: number): string {
	if (typeof value !== "string") return ""
	return value.trim().slice(0, max)
}
