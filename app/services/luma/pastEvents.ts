import eventsData from "@/app/data/events.json"
import type { LumaEvent } from "./types"

//
// Functions
//

export function listPastEvents(now = new Date()): LumaEvent[] {
	return (eventsData as LumaEvent[])
		.filter((event) => new Date(event.start_at).getTime() < now.getTime())
		.sort((a, b) => new Date(b.start_at).getTime() - new Date(a.start_at).getTime())
}
