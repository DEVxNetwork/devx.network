import eventsData from "@/app/data/events.json"
import { placeLine } from "@/app/content/community"
import type { PublicGathering } from "@/app/content/gatherings"
import type { LumaEvent } from "./types"

//
// Functions
//

export function gatheringFromEvent(event: LumaEvent): PublicGathering {
	return {
		id: event.api_id,
		name: event.name,
		start: event.start_at,
		hasTime: true,
		location: placeLine(event),
		address: event.location?.address ?? "",
		lumaUrl: event.url,
		meetupUrl: null,
		eventshipUrl: null,
		eventbriteUrl: null,
		status: "",
		href: `/events/${event.api_id}`
	}
}

export function upcomingGatheringsFromEvents(now = new Date()): PublicGathering[] {
	return (eventsData as LumaEvent[])
		.filter((event) => new Date(event.start_at).getTime() >= now.getTime())
		.map(gatheringFromEvent)
		.sort((a, b) => a.start.localeCompare(b.start))
}
