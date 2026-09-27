//
// Types
//

export type PublicGathering = {
	id: string
	name: string
	start: string
	hasTime: boolean
	location: string
	address: string
	lumaUrl: string | null
	status: string
	href: string
}

export type GatheringWhen = {
	day: string
	time: string | null
}

//
// Constants
//

const PACIFIC = "America/Los_Angeles"

//
// Functions
//

export function formatPublicWhen(gathering: PublicGathering): GatheringWhen {
	if (!gathering.hasTime) {
		const [year, month, day] = gathering.start.split("-").map(Number)
		// Noon UTC stays on the same calendar day in Pacific time.
		const date = new Date(Date.UTC(year, month - 1, day, 20))
		return {
			day: new Intl.DateTimeFormat("en-US", {
				weekday: "long",
				month: "long",
				day: "numeric",
				timeZone: PACIFIC
			}).format(date),
			time: null
		}
	}

	const date = new Date(gathering.start)
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

export function formatPublicLine(gathering: PublicGathering): string {
	const when = formatPublicWhen(gathering)
	return when.time ? `${when.day} at ${when.time}` : when.day
}

export function gatheringOpensNewTab(gathering: PublicGathering): boolean {
	return gathering.href.startsWith("http")
}

export function gatheringPlace(gathering: PublicGathering): string {
	return gathering.location || gathering.address || "San Diego"
}

export function isGatheringPast(gathering: PublicGathering, now = new Date()): boolean {
	const today = new Intl.DateTimeFormat("en-CA", {
		timeZone: PACIFIC,
		year: "numeric",
		month: "2-digit",
		day: "2-digit"
	}).format(now)
	if (gathering.hasTime) return new Date(gathering.start).getTime() < now.getTime()
	return gathering.start.slice(0, 10) < today
}
