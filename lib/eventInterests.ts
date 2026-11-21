import { supabaseClient } from "./supabaseClient"

//
// Types
//

export type EventInterest = {
	id: number
	user_id: string
	profile_id: number
	event_id: string
	created_at: string
}

type AuthContext = {
	userId: string
	profileId: number
}

//
// Functions
//

export async function listInterestedEventIds(): Promise<string[]> {
	const {
		data: { user }
	} = await supabaseClient.auth.getUser()

	if (!user) {
		return []
	}

	const { data, error } = await supabaseClient
		.from("event_interests")
		.select("event_id")
		.eq("user_id", user.id)
		.order("created_at", { ascending: false })

	if (error) {
		throw error
	}

	return (data ?? []).map((row) => row.event_id as string)
}

/**
 * Deletes the current user's interests for past (or unknown) events so the
 * table only keeps actionable upcoming saves.
 * Returns the remaining interested event ids.
 */
export async function pruneStaleEventInterests(
	knownEvents: Array<{ api_id: string; start_at: string }>
): Promise<string[]> {
	const {
		data: { user }
	} = await supabaseClient.auth.getUser()

	if (!user) {
		return []
	}

	const interestedIds = await listInterestedEventIds()
	if (interestedIds.length === 0) {
		return []
	}

	const now = Date.now()
	const eventById = new Map(knownEvents.map((event) => [event.api_id, event]))
	const staleIds = interestedIds.filter((eventId) => {
		const event = eventById.get(eventId)
		if (!event) {
			return true
		}
		return new Date(event.start_at).getTime() < now
	})

	if (staleIds.length === 0) {
		return interestedIds
	}

	const { error } = await supabaseClient
		.from("event_interests")
		.delete()
		.eq("user_id", user.id)
		.in("event_id", staleIds)

	if (error) {
		throw error
	}

	return interestedIds.filter((eventId) => !staleIds.includes(eventId))
}

export async function isInterestedInEvent(eventId: string): Promise<boolean> {
	const {
		data: { user }
	} = await supabaseClient.auth.getUser()

	if (!user) {
		return false
	}

	const { data, error } = await supabaseClient
		.from("event_interests")
		.select("id")
		.eq("user_id", user.id)
		.eq("event_id", eventId)
		.maybeSingle()

	if (error) {
		throw error
	}

	return data !== null
}

export async function addEventInterest(eventId: string): Promise<EventInterest> {
	const auth = await requireAuthContext()

	const { data, error } = await supabaseClient
		.from("event_interests")
		.upsert(
			{
				user_id: auth.userId,
				profile_id: auth.profileId,
				event_id: eventId
			},
			{ onConflict: "user_id,event_id", ignoreDuplicates: true }
		)
		.select("id, user_id, profile_id, event_id, created_at")
		.maybeSingle()

	if (error) {
		throw error
	}

	if (data) {
		return data as EventInterest
	}

	const { data: existing, error: fetchError } = await supabaseClient
		.from("event_interests")
		.select("id, user_id, profile_id, event_id, created_at")
		.eq("user_id", auth.userId)
		.eq("event_id", eventId)
		.single()

	if (fetchError) {
		throw fetchError
	}

	return existing as EventInterest
}

export async function removeEventInterest(eventId: string): Promise<void> {
	const {
		data: { user }
	} = await supabaseClient.auth.getUser()

	if (!user) {
		throw new Error("You must be logged in to update event interests")
	}

	const { error } = await supabaseClient
		.from("event_interests")
		.delete()
		.eq("user_id", user.id)
		.eq("event_id", eventId)

	if (error) {
		throw error
	}
}

export async function toggleEventInterest(eventId: string): Promise<boolean> {
	const currentlyInterested = await isInterestedInEvent(eventId)

	if (currentlyInterested) {
		await removeEventInterest(eventId)
		return false
	}

	await addEventInterest(eventId)
	return true
}

async function requireAuthContext(): Promise<AuthContext> {
	const {
		data: { user }
	} = await supabaseClient.auth.getUser()

	if (!user) {
		throw new Error("You must be logged in to save event interests")
	}

	const { data: profile, error } = await supabaseClient
		.from("profiles")
		.select("id")
		.eq("user_id", user.id)
		.single()

	if (error || !profile) {
		throw new Error("Profile not found. Please finish account setup first.")
	}

	return {
		userId: user.id,
		profileId: profile.id as number
	}
}
