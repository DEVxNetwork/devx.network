import type { LumaEvent, LumaService, LumaLocation } from "./types"

// Constants //

const LUMA_API_BASE_URL = "https://public-api.luma.com/v1"

// Implementation //

export class ApiLumaService implements LumaService {
	private apiKey: string

	constructor(apiKey: string) {
		this.apiKey = apiKey
	}

	async listEvents(): Promise<LumaEvent[]> {
		const response = await fetch(`${LUMA_API_BASE_URL}/calendar/list-events`, {
			headers: {
				"x-luma-api-key": this.apiKey
			}
		})

		if (!response.ok) {
			throw new Error(`Failed to fetch events: ${response.statusText}`)
		}

		const data: { entries?: Array<{ event: Record<string, unknown> }> } = await response.json()
		// The list endpoint returns entries with nested event objects; extract them.
		return (data.entries || []).map((entry) => this.transformApiEvent(entry.event))
	}

	async getEvent(eventId: string): Promise<LumaEvent | null> {
		const url = new URL(`${LUMA_API_BASE_URL}/event/get`)
		url.searchParams.set("api_id", eventId)
		const response = await fetch(url.toString(), {
			headers: {
				"x-luma-api-key": this.apiKey
			}
		})

		if (!response.ok) {
			if (response.status === 404) {
				return null
			}
			throw new Error(`Failed to fetch event: ${response.statusText}`)
		}

		const data: { event?: Record<string, unknown> } = await response.json()
		if (!data.event) {
			return null
		}
		return this.transformApiEvent(data.event)
	}

	async registerForEvent(eventId: string, email: string): Promise<void> {
		const response = await fetch(`${LUMA_API_BASE_URL}/event/add-guests`, {
			method: "POST",
			headers: {
				"x-luma-api-key": this.apiKey,
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				event_api_id: eventId,
				guests: [{ email }]
			})
		})

		if (!response.ok) {
			throw new Error(`Failed to register for event: ${response.statusText}`)
		}
	}

	async checkRegistration(eventId: string, email: string): Promise<boolean> {
		try {
			const response = await fetch(`${LUMA_API_BASE_URL}/event/get-guests?api_id=${eventId}`, {
				headers: {
					"x-luma-api-key": this.apiKey
				}
			})

			if (!response.ok) {
				return false
			}

			const data = await response.json()
			const guests = data.entries || []
			return guests.some((guest: any) => guest.email === email)
		} catch {
			return false
		}
	}

	/**
	 * Transform a raw API event object into a typed LumaEvent,
	 * matching the transformation in scripts/update-events.ts.
	 */
	private transformApiEvent(raw: Record<string, unknown>): LumaEvent {
		let location: LumaLocation | undefined
		const meetingUrl = raw.meeting_url as string | undefined
		const geo = raw.geo as Record<string, unknown> | undefined

		if (meetingUrl) {
			location = { type: "online" }
		} else if (geo) {
			const address = geo.address as Record<string, unknown> | undefined
			location = {
				type: "physical",
				address: (address?.full_address as string) || (address?.street_address as string),
				city: address?.city as string,
				state: address?.region as string,
				coordinates:
					geo.latitude && geo.longitude
						? { lat: geo.latitude as string, lng: geo.longitude as string }
						: undefined
			}
		}

		return {
			api_id: raw.api_id as string,
			name: raw.name as string,
			description: (raw.description as string) || (raw.name as string),
			description_md: raw.description_md as string | undefined,
			description_html: raw.description_html as string | undefined,
			start_at: raw.start_at as string,
			end_at: raw.end_at as string,
			location,
			cover_url: raw.cover_url as string | undefined,
			url: (raw.url as string) || `https://lu.ma/${(raw.api_id as string).replace(/^evt-/, "")}`,
			guest_count: (raw.guest_count as number) ?? -1,
			visibility: (raw.visibility as "public" | "private") || "public",
			timezone: (raw.timezone as string) || "America/Los_Angeles"
		}
	}
}
