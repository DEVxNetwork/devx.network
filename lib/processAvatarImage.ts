import sharp from "sharp"
import {
	AVATAR_ALLOWED_EXTENSIONS,
	AVATAR_ALLOWED_MIME_TYPES,
	AVATAR_MAX_DIMENSION,
	AVATAR_MAX_INPUT_BYTES,
	AVATAR_WEBP_QUALITY
} from "./avatarImageConfig"

export class AvatarImageError extends Error {
	statusCode: number

	constructor(message: string, statusCode: number) {
		super(message)
		this.name = "AvatarImageError"
		this.statusCode = statusCode
	}
}

type AvatarInputFile = {
	size: number
	type: string
	name: string
}

function hasAllowedExtension(fileName: string): boolean {
	const ext = fileName.split(".").pop()?.toLowerCase()
	return AVATAR_ALLOWED_EXTENSIONS.includes(ext as (typeof AVATAR_ALLOWED_EXTENSIONS)[number])
}

function hasAllowedMimeType(mimeType: string): boolean {
	return AVATAR_ALLOWED_MIME_TYPES.includes(mimeType as (typeof AVATAR_ALLOWED_MIME_TYPES)[number])
}

export function validateAvatarInput(file: AvatarInputFile): void {
	if (file.size > AVATAR_MAX_INPUT_BYTES) {
		throw new AvatarImageError("Image must be 4MB or smaller", 413)
	}

	if (!hasAllowedMimeType(file.type) && !hasAllowedExtension(file.name)) {
		throw new AvatarImageError("Only JPG and PNG images are allowed", 415)
	}
}

export async function processAvatarImage(input: Buffer): Promise<Buffer> {
	try {
		const image = sharp(input)
		const metadata = await image.metadata()

		if (metadata.format !== "jpeg" && metadata.format !== "png") {
			throw new AvatarImageError("Only JPG and PNG images are allowed", 415)
		}

		return await image
			.rotate()
			.resize(AVATAR_MAX_DIMENSION, AVATAR_MAX_DIMENSION, {
				fit: "inside",
				withoutEnlargement: true
			})
			.webp({ quality: AVATAR_WEBP_QUALITY })
			.toBuffer()
	} catch (error) {
		if (error instanceof AvatarImageError) {
			throw error
		}

		throw new AvatarImageError("Invalid or unsupported image file", 415)
	}
}
