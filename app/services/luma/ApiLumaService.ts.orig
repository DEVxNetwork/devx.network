import type { LumaEvent, LumaService } from "./types"

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

		const data = await response.json()
		return data.entries || []
	}

	async getEvent(eventId: string): Promise<LumaEvent | null> {
		const response = await fetch(`${LUMA_API_BASE_URL}/event/get?event_api_id=${eventId}`, {
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

		const data = await response.json()
		return data
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
			const response = await fetch(
				`${LUMA_API_BASE_URL}/event/get-guests?event_api_id=${eventId}`,
				{
					headers: {
						"x-luma-api-key": this.apiKey
					}
				}
			)

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
}
