import { supabaseClient } from "./supabaseClient"

export class AvatarUploadError extends Error {
	statusCode?: number

	constructor(message: string, statusCode?: number) {
		super(message)
		this.name = "AvatarUploadError"
		this.statusCode = statusCode
	}
}

export async function uploadAvatar(file: File): Promise<string> {
	const {
		data: { session }
	} = await supabaseClient.auth.getSession()

	if (!session) {
		throw new AvatarUploadError("You must be logged in to upload a photo", 401)
	}

	const formData = new FormData()
	formData.append("file", file)

	const response = await fetch("/api/avatars/upload", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${session.access_token}`
		},
		body: formData
	})

	const body = (await response.json().catch(() => ({}))) as { url?: string; error?: string }

	if (!response.ok) {
		throw new AvatarUploadError(body.error ?? "Failed to upload image", response.status)
	}

	if (!body.url) {
		throw new AvatarUploadError("Invalid response from upload server", 500)
	}

	return body.url
}
