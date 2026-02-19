// Functions //

export function formatOgDate(startAt: string): string {
	const date = new Date(startAt)
	return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export function sanitizeDescription(description: string | undefined): string {
	if (!description) return ""
	return description.replace(/\n+/g, " ").trim().slice(0, 200)
}
