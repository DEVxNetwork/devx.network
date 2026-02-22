import { compareSlides, type SlideData } from "./slidesData"

function slide(title: string, timestamp?: string): SlideData {
	return {
		slug: title.toLowerCase().replace(/\s+/g, "-"),
		metadata: { title, description: "", author: "", timestamp: timestamp ?? "" }
	}
}

function assert(condition: boolean, message: string) {
	if (!condition) {
		throw new Error(`FAIL: ${message}`)
	}
}

function test(name: string, fn: () => void) {
	try {
		fn()
		console.log(`  ✓ ${name}`)
	} catch (e) {
		console.error(`  ✗ ${name}`)
		console.error(`    ${(e as Error).message}`)
		process.exitCode = 1
	}
}

console.log("compareSlides sorting tests\n")

test("sorts newer slides before older slides", () => {
	const slides = [slide("Old", "2024-01-01T00:00:00Z"), slide("New", "2025-06-15T00:00:00Z")]
	slides.sort(compareSlides)
	assert(
		slides[0].metadata.title === "New",
		`expected "New" first, got "${slides[0].metadata.title}"`
	)
	assert(
		slides[1].metadata.title === "Old",
		`expected "Old" second, got "${slides[1].metadata.title}"`
	)
})

test("uses title DESC as tiebreaker for equal timestamps", () => {
	const ts = "2025-01-01T00:00:00Z"
	const slides = [slide("Alpha", ts), slide("Zulu", ts), slide("Mike", ts)]
	slides.sort(compareSlides)
	assert(
		slides[0].metadata.title === "Zulu",
		`expected "Zulu" first, got "${slides[0].metadata.title}"`
	)
	assert(
		slides[1].metadata.title === "Mike",
		`expected "Mike" second, got "${slides[1].metadata.title}"`
	)
	assert(
		slides[2].metadata.title === "Alpha",
		`expected "Alpha" third, got "${slides[2].metadata.title}"`
	)
})

test("slides without timestamps sort to the end", () => {
	const slides = [
		slide("No Date"),
		slide("Has Date", "2025-01-01T00:00:00Z"),
		slide("Also No Date")
	]
	slides.sort(compareSlides)
	assert(
		slides[0].metadata.title === "Has Date",
		`expected "Has Date" first, got "${slides[0].metadata.title}"`
	)
})

test("slides with invalid timestamps sort to the end", () => {
	const slides = [slide("Bad", "not-a-date"), slide("Good", "2025-03-01T00:00:00Z")]
	slides.sort(compareSlides)
	assert(
		slides[0].metadata.title === "Good",
		`expected "Good" first, got "${slides[0].metadata.title}"`
	)
	assert(
		slides[1].metadata.title === "Bad",
		`expected "Bad" second, got "${slides[1].metadata.title}"`
	)
})

test("all-missing timestamps falls back to title DESC", () => {
	const slides = [slide("Bravo"), slide("Charlie"), slide("Alpha")]
	slides.sort(compareSlides)
	assert(
		slides[0].metadata.title === "Charlie",
		`expected "Charlie" first, got "${slides[0].metadata.title}"`
	)
	assert(
		slides[1].metadata.title === "Bravo",
		`expected "Bravo" second, got "${slides[1].metadata.title}"`
	)
	assert(
		slides[2].metadata.title === "Alpha",
		`expected "Alpha" third, got "${slides[2].metadata.title}"`
	)
})

test("single slide returns as-is", () => {
	const slides = [slide("Only", "2025-01-01T00:00:00Z")]
	slides.sort(compareSlides)
	assert(slides.length === 1, `expected 1 slide, got ${slides.length}`)
	assert(slides[0].metadata.title === "Only", `expected "Only", got "${slides[0].metadata.title}"`)
})

test("empty array stays empty", () => {
	const slides: SlideData[] = []
	slides.sort(compareSlides)
	assert(slides.length === 0, `expected 0 slides, got ${slides.length}`)
})

console.log("")
