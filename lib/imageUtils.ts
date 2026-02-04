/**
 * Client-side image utilities for resizing and hashing profile photos.
 *
 * Photos are resized on the client before upload so no server-side image
 * processing is required (zero-cost). Three sizes are produced:
 *
 *   thumb    – 120 × 120  (nametag avatar)
 *   medium   – 300 × 300  (profile view)
 *   original – max 800px  (high-res fallback)
 *
 * All variants are converted to WebP for optimal file-size.
 */

export type PhotoSize = "thumb" | "medium" | "original"

export interface PhotoSizeConfig {
	name: PhotoSize
	maxDimension: number
}

export const PHOTO_SIZES: PhotoSizeConfig[] = [
	{ name: "thumb", maxDimension: 120 },
	{ name: "medium", maxDimension: 300 },
	{ name: "original", maxDimension: 800 }
]

// ---------------------------------------------------------------------------
// Hashing
// ---------------------------------------------------------------------------

/** Return the hex-encoded SHA-256 digest of an ArrayBuffer. */
export async function hashBuffer(buffer: ArrayBuffer): Promise<string> {
	const digest = await crypto.subtle.digest("SHA-256", buffer)
	return Array.from(new Uint8Array(digest))
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("")
}

/** Hash a File/Blob and return its hex SHA-256. */
export async function hashBlob(blob: Blob): Promise<string> {
	const buffer = await blob.arrayBuffer()
	return hashBuffer(buffer)
}

// ---------------------------------------------------------------------------
// Resizing
// ---------------------------------------------------------------------------

/**
 * Resize an image file so its longest side is at most `maxDimension` pixels.
 * Aspect ratio is preserved. Output is WebP at quality 0.85.
 */
export async function resizeImage(file: Blob, maxDimension: number): Promise<Blob> {
	const bitmap = await createImageBitmap(file)
	const { width, height } = bitmap

	// Calculate target dimensions (maintain aspect ratio, cover the square)
	let targetWidth: number
	let targetHeight: number
	let sx = 0,
		sy = 0,
		sWidth = width,
		sHeight = height

	// For profile photos we want a square crop (center-crop to 1:1)
	if (width > height) {
		sx = Math.floor((width - height) / 2)
		sWidth = height
		sHeight = height
	} else {
		sy = Math.floor((height - width) / 2)
		sWidth = width
		sHeight = width
	}

	targetWidth = Math.min(sWidth, maxDimension)
	targetHeight = Math.min(sHeight, maxDimension)

	const canvas = new OffscreenCanvas(targetWidth, targetHeight)
	const ctx = canvas.getContext("2d")!
	ctx.drawImage(bitmap, sx, sy, sWidth, sHeight, 0, 0, targetWidth, targetHeight)
	bitmap.close()

	return canvas.convertToBlob({ type: "image/webp", quality: 0.85 })
}

/**
 * Given a source File, produce all sized variants.
 * Returns an array of { name, blob } sorted small → large.
 */
export async function generateSizedVariants(
	file: File
): Promise<{ name: PhotoSize; blob: Blob }[]> {
	const results: { name: PhotoSize; blob: Blob }[] = []
	for (const size of PHOTO_SIZES) {
		const blob = await resizeImage(file, size.maxDimension)
		results.push({ name: size.name, blob })
	}
	return results
}

/**
 * Read the natural dimensions of an image file.
 */
export async function getImageDimensions(file: Blob): Promise<{ width: number; height: number }> {
	const bitmap = await createImageBitmap(file)
	const { width, height } = bitmap
	bitmap.close()
	return { width, height }
}
