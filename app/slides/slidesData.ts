import fs from "fs"
import path from "path"

// Types //

export interface SlideMetadata {
	title: string
	description: string
	author: string
	timestamp: string // ISO date string
}

export interface SlideData {
	slug: string
	metadata: SlideMetadata
}

// Constants //

const SLIDES_DIR = path.join(process.cwd(), "public/slides")

// Functions //

export function getAllSlideSlugs(): string[] {
	if (!fs.existsSync(SLIDES_DIR)) {
		return []
	}

	const entries = fs.readdirSync(SLIDES_DIR, { withFileTypes: true })
	return entries
		.filter((entry) => entry.isDirectory())
		.filter((entry) => {
			const metadataPath = path.join(SLIDES_DIR, entry.name, "metadata.json")
			const slidesPath = path.join(SLIDES_DIR, entry.name, "slides.html")
			return fs.existsSync(metadataPath) && fs.existsSync(slidesPath)
		})
		.map((entry) => entry.name)
}

function isValidSlug(slug: string): boolean {
	// Prevent path traversal attacks - slug should only contain safe characters
	// and not contain path separators or traversal sequences
	return /^[a-zA-Z0-9_-]+$/.test(slug)
}

export function getSlideMetadata(slug: string): SlideMetadata | null {
	// Validate slug to prevent path traversal
	if (!isValidSlug(slug)) {
		return null
	}

	const metadataPath = path.join(SLIDES_DIR, slug, "metadata.json")

	if (!fs.existsSync(metadataPath)) {
		return null
	}

	try {
		const content = fs.readFileSync(metadataPath, "utf-8")
		return JSON.parse(content) as SlideMetadata
	} catch {
		// Handle malformed JSON gracefully
		return null
	}
}

export function getSlideData(slug: string): SlideData | null {
	const metadata = getSlideMetadata(slug)

	if (!metadata) {
		return null
	}

	return {
		slug,
		metadata
	}
}

export function getAllSlides(): SlideData[] {
	const slugs = getAllSlideSlugs()
	return slugs.map((slug) => getSlideData(slug)).filter((data): data is SlideData => data !== null)
}
