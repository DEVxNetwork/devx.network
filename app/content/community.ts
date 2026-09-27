import type { LumaEvent } from "../services/luma"

//
// Types
//

export type GatheringKind = "function" | "coroutine" | "founders" | "gathering"

export type StoryBeat = {
	time: string
	title: string
	copy: string
}

export type Belief = {
	title: string
	copy: string
}

export type GatheringFormat = {
	kind: GatheringKind
	name: string
	cadence: string
	copy: string
	where: string
}

export type GatheringWhen = {
	day: string
	time: string
}

//
// Constants
//

// Editorial copy Notion does not hold: why the room exists, the shape of a
// Saturday, and the short blurbs for each kind of gathering.

export const missionLead =
	"DEVx is a San Diego community of developers at every skill level. We get together to eat, to hear someone from the room explain a thing they just learned, and to open laptops beside each other."

export const afternoon: StoryBeat[] = [
	{
		time: "12:00",
		title: "Lunch",
		copy: "You sit down with someone you don't know yet. Food and drinks are on us. The introductions happen at the table, not on a slide."
	},
	{
		time: "1:00",
		title: "Talks from the seats",
		copy: "Usually three. They come from members, not a circuit of imported experts. Something you figured out last month is already enough of a talk."
	},
	{
		time: "2:15",
		title: "Laptops open",
		copy: "Show the project. Ask the stuck question. Organizers will sit with you, and so will strangers. We stay until four."
	}
]

export const beliefs: Belief[] = [
	{
		title: "The door is not a skill check.",
		copy: "A first year and a twentieth year share a table. We ask one thing of everyone who walks in: be courteous with other people's time."
	},
	{
		title: "The teachers are already seated.",
		copy: "If you are excited about it, the room wants to hear it. We livestream every talk. Within a week you get the recording and a transcript."
	},
	{
		title: "Help is an ordinary part of the afternoon.",
		copy: "Bring the bug you are stuck on. Someone nearby has already hit it, or wants to learn it with you. That is why the laptops come out."
	},
	{
		title: "Hospitality is the program.",
		copy: "The calendar is free to attend. Lunch is complimentary. You bring a laptop if you want to share, and whatever you are excited about."
	}
]

export const formats: GatheringFormat[] = [
	{
		kind: "function",
		name: "Weekend Function()",
		cadence: "One Saturday a month",
		where: "Edge Offices, Little Italy",
		copy: "The big room. Networking lunch, member talks, community announcements, then an open hang until four. Downtown, a block from the trolley and the Coaster."
	},
	{
		kind: "coroutine",
		name: 'co routine("place")',
		cadence: "Friday coworking",
		where: "San Diego and Oceanside",
		copy: "A smaller table that moves. Laptops, coffee, and other people's half-finished ideas. Lately that has meant Moniker in San Diego and Communal in Oceanside."
	}
]

const KIND_LABEL: Record<GatheringKind, string> = {
	function: "Weekend Function",
	coroutine: "co routine",
	founders: "Indie founders",
	gathering: "Gathering"
}

const KIND_BLURB: Record<GatheringKind, string> = {
	function: "The monthly Saturday. Lunch, talks from the room, then laptops open until four.",
	coroutine: "A Friday at a café. Bring a laptop, a question, and room for coffee.",
	founders: "Indie founders, laptops open, building at the same table.",
	gathering: "A DEVx gathering. Come as you are."
}

const PACIFIC = "America/Los_Angeles"

//
// Functions
//

export function gatheringKind(name: string): GatheringKind {
	const normalized = name.toLowerCase()
	if (normalized.includes("weekend function")) return "function"
	if (normalized.includes("co routine") || normalized.includes("coroutine")) return "coroutine"
	if (normalized.includes("indie") || normalized.includes("founder")) return "founders"
	return "gathering"
}

export function gatheringLabel(name: string): string {
	return KIND_LABEL[gatheringKind(name)]
}

export function gatheringBlurb(name: string): string {
	return KIND_BLURB[gatheringKind(name)]
}

export function gatheringFormatName(name: string): string {
	const kind = gatheringKind(name)
	return formats.find((format) => format.kind === kind)?.name ?? gatheringLabel(name)
}

export function whyWeShowUp(name: string): string {
	const kind = gatheringKind(name)
	if (kind === "function") return sentenceAt(beliefs[1].copy, 0)
	if (kind === "coroutine") return sentenceAt(beliefs[2].copy, 1)
	if (kind === "founders") return sentenceAt(KIND_BLURB.founders, 0)
	return sentenceAt(missionLead, 1)
}

function sentenceAt(copy: string, index: number): string {
	const sentences = copy.match(/[^.!?]+[.!?]/g)?.map((sentence) => sentence.trim()) ?? [copy]
	return sentences[index] ?? sentences[0]
}

export function formatGatheringWhen(iso: string): GatheringWhen {
	const date = new Date(iso)
	return {
		day: new Intl.DateTimeFormat("en-US", {
			weekday: "long",
			month: "long",
			day: "numeric",
			timeZone: PACIFIC
		}).format(date),
		time: new Intl.DateTimeFormat("en-US", {
			hour: "numeric",
			minute: "2-digit",
			timeZone: PACIFIC,
			timeZoneName: "short"
		}).format(date)
	}
}

export function formatGatheringLine(iso: string): string {
	const when = formatGatheringWhen(iso)
	return `${when.day} at ${when.time}`
}

export function placeLine(event: LumaEvent): string {
	const address = event.location?.address ?? ""
	if (address.includes("1495 Pacific")) return "Edge Offices, Little Italy"
	if (address.includes("Communal")) return "Communal, Oceanside"
	if (address.includes("Moniker")) return "Moniker Coffee, San Diego"
	if (address.includes("Treehouse")) return "Treehouse, San Diego"
	if (!event.location || event.location.type === "online") return "Online"
	if (event.location.city && event.location.state) {
		return `${event.location.city}, ${event.location.state}`
	}
	return event.location.city ?? "San Diego"
}
