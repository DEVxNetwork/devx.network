// Types //

export interface LumaLocation {
	type: "physical" | "online"
	address?: string
	city?: string
	state?: string
	coordinates?: {
		lat: string
		lng: string
	}
}

export interface LumaEvent {
	api_id: string
	name: string
	description: string
	description_md?: string // Markdown formatted description
	description_html?: string // HTML converted from markdown
	start_at: string
	end_at: string
	location?: LumaLocation
	cover_url?: string
	url: string
	guest_count?: number
	visibility: "public" | "private"
	timezone?: string
}

export interface LumaRegistration {
	event_id: string
	email: string
	registered_at: string
}

// Interface //

export interface LumaService {
	listEvents(): Promise<LumaEvent[]>
	getEvent(eventId: string): Promise<LumaEvent | null>
	registerForEvent(eventId: string, email: string): Promise<void>
	checkRegistration(eventId: string, email: string): Promise<boolean>
}
