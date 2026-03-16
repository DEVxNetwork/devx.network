/**
 * Photo upload service.
 *
 * Handles the full lifecycle of a profile photo upload:
 *   1. Hash the original to derive a dedup key
 *   2. Check if the hash already exists in `profile_photos`
 *   3. Resize to all preset sizes (client-side, zero server cost)
 *   4. Upload each variant to Supabase Storage
 *   5. Insert a row into `profile_photos`
 *   6. Return the hash + default display URL (medium)
 *
 * Storage layout inside the `avatars` bucket:
 *   photos/{hash}/thumb.webp
 *   photos/{hash}/medium.webp
 *   photos/{hash}/original.webp
 */

import { supabaseClient } from "./supabaseClient"
import {
	hashBlob,
	generateSizedVariants,
	getImageDimensions,
	type PhotoSize
} from "./imageUtils"

const BUCKET = "avatars"

// ---------------------------------------------------------------------------
// URL helpers
// ---------------------------------------------------------------------------

/** Build the storage path for a given photo hash + size. */
export function photoStoragePath(hash: string, size: PhotoSize): string {
	return `photos/${hash}/${size}.webp`
}

/** Return the public URL for a photo variant. */
export function getPhotoUrl(hash: string, size: PhotoSize = "medium"): string {
	const path = photoStoragePath(hash, size)
	const {
		data: { publicUrl }
	} = supabaseClient.storage.from(BUCKET).getPublicUrl(path)
	return publicUrl
}

// ---------------------------------------------------------------------------
// Upload
// ---------------------------------------------------------------------------

export interface UploadResult {
	hash: string
	/** Public URL to the medium-sized variant (the default display size). */
	url: string
}

/**
 * Upload a profile photo. Handles dedup, resize, and storage in one call.
 *
 * If an image with the same hash already exists, the upload is skipped and
 * the existing URLs are returned immediately.
 */
export async function uploadProfilePhoto(file: File): Promise<UploadResult> {
	// 1. Hash the original file for dedup
	const hash = await hashBlob(file)

	// 2. Check for existing record
	const { data: existing } = await supabaseClient
		.from("profile_photos")
		.select("id")
		.eq("id", hash)
		.maybeSingle()

	if (existing) {
		// Photo already uploaded — reuse it
		return { hash, url: getPhotoUrl(hash, "medium") }
	}

	// 3. Get original dimensions (before resize)
	const { width, height } = await getImageDimensions(file)

	// 4. Generate all sized variants (client-side resize)
	const variants = await generateSizedVariants(file)

	// 5. Upload each variant to storage
	for (const variant of variants) {
		const storagePath = photoStoragePath(hash, variant.name)
		const { error } = await supabaseClient.storage
			.from(BUCKET)
			.upload(storagePath, variant.blob, {
				contentType: "image/webp",
				upsert: false
			})

		if (error && !error.message.includes("already exists")) {
			throw error
		}
	}

	// 6. Insert record into profile_photos
	const {
		data: { user }
	} = await supabaseClient.auth.getUser()

	const { error: insertError } = await supabaseClient.from("profile_photos").insert({
		id: hash,
		original_width: width,
		original_height: height,
		uploaded_by: user?.id ?? null
	})

	// Ignore unique-violation (race condition with concurrent upload of same image)
	if (insertError && !insertError.message.includes("duplicate key")) {
		throw insertError
	}

	return { hash, url: getPhotoUrl(hash, "medium") }
}
