import type { LumaEvent } from "../services/luma"

//
// Types
//

export type GatheringKind = "function" | "coroutine" | "paper" | "founders" | "gathering"

export type AboutPicture = {
	src: string
	alt: string
}

export type AboutChapter = {
	kicker: string
	title: string
	copy: string
	pictures: AboutPicture[]
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

// Editorial copy Notion does not hold: why the room exists, and the short
// blurbs for each kind of gathering.

export const aboutLead = "The room did not start here."

export const aboutDescription =
	"DEVx started in the back of a coffee shop, coming out of COVID. Edge gave the room a home. It grew from there."

export const aboutNow: AboutPicture = {
	src: "/images/weekend-function-talk.webp",
	alt: "A full room at a recent Saturday, facing someone from the seats"
}

export const aboutChapters: AboutChapter[] = [
	{
		kicker: "2023",
		title: "The back of a coffee shop.",
		copy: "Coming out of COVID, we wanted people in the same room again. The first meetup was a handful of laptops in the back of a café.",
		pictures: [
			{
				src: "/images/about/coffee-2023.webp",
				alt: "A handful of people with laptops around a table in the back of a café, December 2023"
			}
		]
	},
	{
		kicker: "2024",
		title: "Then we partnered with Edge.",
		copy: "Edge had a room and hosted us. A banner, a projector, and enough chairs for the people who came back.",
		pictures: [
			{
				src: "/images/about/edge-2024.webp",
				alt: "March 2024, a small room with an Edge banner and someone talking at the front"
			}
		]
	},
	{
		kicker: "2025",
		title: "Then we had the space.",
		copy: "The office became the place we return to. Same partnership, a room that could hold the crowd.",
		pictures: [
			{
				src: "/images/about/space-2025.webp",
				alt: "A packed room at the Edge office in 2025, the Edge banner beside the screen"
			}
		]
	},
	{
		kicker: "Now",
		title: "It grew from there.",
		copy: "Saturdays fill the office. Fridays move through the cafés. Paper Club happens when someone brings a paper. One table turned into a lot of ways to show up.",
		pictures: [
			{
				src: "/images/about/friday.webp",
				alt: "Friday coworking at a long café table, laptops open"
			},
			{
				src: "/images/about/paper-club.webp",
				alt: "Paper Club, a smaller room gathered around a paper"
			}
		]
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

// Notion titles end with an em dash and a date. The calendar already shows the day.
export function gatheringTitle(name: string): string {
	const parts = name.split(/\s*—\s*/)
	if (parts.length < 2) return name.trim()
	const last = parts[parts.length - 1]?.trim() ?? ""
	if (!dateStamp.test(last)) return name.trim()
	return parts.slice(0, -1).join(" — ").trim()
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
