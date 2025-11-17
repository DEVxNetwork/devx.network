import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
	console.warn("Supabase environment variables are not set. Realtime features are disabled.")
}

export const supabaseClient =
	supabaseUrl && supabaseAnonKey
		? createClient(supabaseUrl, supabaseAnonKey, {
				auth: {
					persistSession: false
				},
				global: {
					headers: {
						"X-Client-Info": "devx-doorbell"
					}
				}
			})
		: null
