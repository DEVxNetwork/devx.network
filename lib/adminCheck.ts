import { supabaseClient } from "./supabaseClient"

export async function checkIsAdmin(): Promise<boolean> {
	const {
		data: { user }
	} = await supabaseClient.auth.getUser()

	if (!user) return false

	const { data: profile } = await supabaseClient
		.from("profiles")
		.select("is_admin")
		.eq("user_id", user.id)
		.single()

	return profile?.is_admin === true
}
