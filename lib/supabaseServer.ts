import { createClient, SupabaseClient, User } from "@supabase/supabase-js"

function getSupabaseEnv() {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
	const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

	if (!supabaseUrl || !supabaseAnonKey) {
		throw new Error(
			"Supabase environment variables are not set. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY"
		)
	}

	return { supabaseUrl, supabaseAnonKey }
}

export function createUserScopedSupabaseClient(accessToken: string): SupabaseClient {
	const { supabaseUrl, supabaseAnonKey } = getSupabaseEnv()

	return createClient(supabaseUrl, supabaseAnonKey, {
		global: {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		}
	})
}

export async function getAuthenticatedUser(
	accessToken: string
): Promise<{ user: User; supabase: SupabaseClient } | null> {
	const supabase = createUserScopedSupabaseClient(accessToken)
	const {
		data: { user },
		error
	} = await supabase.auth.getUser()

	if (error || !user) {
		return null
	}

	return { user, supabase }
}
