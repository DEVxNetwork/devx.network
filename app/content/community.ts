import type { LumaEvent } from "../services/luma"

//
// Types
//

export type GatheringKind = "function" | "coroutine" | "paper" | "founders" | "gathering"

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
	photo?: string
	photoPosition?: string
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
	"San Diego developers, every skill level, at one table. We eat, someone from the seats explains a thing they just learned, and then the laptops come out."

export const afternoon: StoryBeat[] = [
	{
		time: "12pm",
		title: "Lunch",
		copy: "You sit down with someone you don't know yet."
	},
	{
		time: "1:30pm",
		title: "Presentation",
		copy: "Talks from the seats, not a speaker circuit."
	},
	{
		time: "2:30pm",
		title: "Free-form",
		copy: "Laptops open. Bring the stuck question."
	},
	{
		time: "4pm",
		title: "Close",
		copy: "We wander out."
	}
]

export const beliefs: Belief[] = [
	{
		title: "The door is not a skill check.",
		copy: "A first year and a twentieth year share a table."
	},
	{
		title: "The teachers are already seated.",
		copy: "If you're excited about it, the room wants to hear it."
	},
	{
		title: "Bring the bug.",
		copy: "Someone nearby has already hit it, or wants to learn it with you."
	},
	{
		title: "Lunch is on us.",
		copy: "The calendar is free. You bring whatever you're excited about."
	}
]

export const formats: GatheringFormat[] = [
	{
		kind: "function",
		name: "Weekend Function()",
		cadence: "One Saturday a month",
		where: "Edge Offices, Little Italy",
		copy: "Lunch, talks from the seats, laptops open until four.",
		photo: "/images/weekend-function-talk.webp",
		photoPosition: "center 62%"
	},
	{
		kind: "coroutine",
		name: 'co routine("place")',
		cadence: "Friday coworking",
		where: "San Diego and Oceanside",
		copy: "A café, a laptop, and someone else's half-finished idea.",
		photo: "/images/slides/slide4.webp",
		photoPosition: "center 45%"
	},
	{
		kind: "paper",
		name: "Paper Club",
		cadence: "Now and then",
		where: "San Diego",
		copy: "Someone brings a paper. The rest of us show up ready to argue.",
		photo: "/images/paper-club.webp",
		photoPosition: "center 62%"
	}
]

const KIND_LABEL: Record<GatheringKind, string> = {
	function: "Weekend Function",
	coroutine: "co routine",
	paper: "Paper Club",
	founders: "Indie founders",
	gathering: "Gathering"
}

const KIND_BLURB: Record<GatheringKind, string> = {
	function: "Lunch, talks from the seats, laptops open until four.",
	coroutine: "A café, a laptop, and someone else's half-finished idea.",
	paper: "Someone brings a paper. The rest of us show up ready to argue.",
	founders: "Indie founders, laptops open, at the same table.",
	gathering: "Come as you are."
}

const seriesTitle = /weekend function|devx monthly/i
const dateStamp = /^\d{1,2}\/\d{1,2}\/\d{2,4}$/

const PACIFIC = "America/Los_Angeles"

//
// Functions
//

export function gatheringKind(name: string): GatheringKind {
	const normalized = name.toLowerCase()
	if (normalized.includes("weekend function") || normalized.includes("devx monthly"))
		return "function"
	if (normalized.includes("co routine") || normalized.includes("coroutine")) return "coroutine"
	if (normalized.includes("paper club")) return "paper"
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

export function monthlyHeadline(name: string): string {
	const topic = name
		.split(/\s+[—–]\s+|\s+-\s+/)
		.map((part) => part.trim())
		.find((part) => part.length > 0 && !seriesTitle.test(part) && !dateStamp.test(part))
	return topic ?? "Weekend Function()"
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
