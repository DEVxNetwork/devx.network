import { describe, it, expect } from "vitest"
import { compareSlides, type SlideData } from "./slidesData"

function makeSlide(slug: string, timestamp: string, title: string): SlideData {
	return { slug, metadata: { title, description: "", author: "", timestamp } }
}

describe("compareSlides", () => {
	it("sorts newer timestamps first", () => {
		const older = makeSlide("a", "2024-01-01T00:00:00Z", "A")
		const newer = makeSlide("b", "2025-06-15T00:00:00Z", "B")
		expect(compareSlides(newer, older)).toBeLessThan(0)
		expect(compareSlides(older, newer)).toBeGreaterThan(0)
	})

	it("uses title DESC as tiebreaker for equal timestamps", () => {
		const slideA = makeSlide("a", "2024-01-01T00:00:00Z", "Alpha")
		const slideZ = makeSlide("z", "2024-01-01T00:00:00Z", "Zulu")
		expect(compareSlides(slideZ, slideA)).toBeLessThan(0)
		expect(compareSlides(slideA, slideZ)).toBeGreaterThan(0)
	})

	it("returns 0 for identical timestamp and title", () => {
		const s1 = makeSlide("a", "2024-01-01T00:00:00Z", "Same")
		const s2 = makeSlide("b", "2024-01-01T00:00:00Z", "Same")
		expect(compareSlides(s1, s2)).toBe(0)
	})

	it("pushes slides with missing timestamp to the end", () => {
		const valid = makeSlide("a", "2024-01-01T00:00:00Z", "A")
		const noTs = makeSlide("b", "", "B")
		expect(compareSlides(valid, noTs)).toBeLessThan(0)
		expect(compareSlides(noTs, valid)).toBeGreaterThan(0)
	})

	it("pushes slides with invalid timestamp to the end", () => {
		const valid = makeSlide("a", "2024-01-01T00:00:00Z", "A")
		const invalid = makeSlide("b", "not-a-date", "B")
		expect(compareSlides(valid, invalid)).toBeLessThan(0)
		expect(compareSlides(invalid, valid)).toBeGreaterThan(0)
	})

	it("sorts two invalid-timestamp slides by title DESC", () => {
		const alpha = makeSlide("a", "", "Alpha")
		const zulu = makeSlide("z", "", "Zulu")
		expect(compareSlides(zulu, alpha)).toBeLessThan(0)
		expect(compareSlides(alpha, zulu)).toBeGreaterThan(0)
	})

	it("sorts a full array correctly", () => {
		const slides = [
			makeSlide("old", "2023-01-01T00:00:00Z", "Old Talk"),
			makeSlide("no-ts", "", "No Timestamp"),
			makeSlide("new", "2025-06-15T00:00:00Z", "New Talk"),
			makeSlide("same-a", "2024-06-01T00:00:00Z", "Alpha"),
			makeSlide("same-z", "2024-06-01T00:00:00Z", "Zulu")
		]

		const sorted = [...slides].sort(compareSlides)
		const slugOrder = sorted.map((s) => s.slug)
		expect(slugOrder).toEqual(["new", "same-z", "same-a", "old", "no-ts"])
	})
})
