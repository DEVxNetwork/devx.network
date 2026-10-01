import type { GatheringKind } from "@/app/content/community"
import type { PublicGathering } from "@/app/content/gatherings"

//
// Types
//

export type CalendarDay = {
	key: string
	day: number
	inMonth: boolean
}

export type DayGroup = {
	key: string
	label: string
	events: PublicGathering[]
}

//
// Constants
//

export const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const

export const KIND_DOT: Record<GatheringKind, string> = {
	function: "var(--extrusion)",
	coroutine: "var(--pop-cyan)",
	paper: "var(--pop-yellow)",
	founders: "var(--pop-orange)",
	gathering: "var(--pop-pink)"
}

const PACIFIC = "America/Los_Angeles"

const WEEKDAY_INDEX: Record<string, number> = {
	Sun: 0,
	Mon: 1,
	Tue: 2,
	Wed: 3,
	Thu: 4,
	Fri: 5,
	Sat: 6
}

//
// Functions
//

export function pacificDayKey(gathering: Pick<PublicGathering, "start" | "hasTime">): string {
	if (!gathering.hasTime) return gathering.start.slice(0, 10)
	return new Intl.DateTimeFormat("en-CA", {
		timeZone: PACIFIC,
		year: "numeric",
		month: "2-digit",
		day: "2-digit"
	}).format(new Date(gathering.start))
}

export function todayKey(now = new Date()): string {
	return new Intl.DateTimeFormat("en-CA", {
		timeZone: PACIFIC,
		year: "numeric",
		month: "2-digit",
		day: "2-digit"
	}).format(now)
}

export function todayMonth(now = new Date()): string {
	return todayKey(now).slice(0, 7)
}

export function monthOfGathering(gathering: PublicGathering): string {
	return pacificDayKey(gathering).slice(0, 7)
}

export function shiftMonth(month: string, delta: number): string {
	const parsed = parseMonth(month)
	if (!parsed) return month
	const shifted = new Date(Date.UTC(parsed.year, parsed.monthIndex - 1 + delta, 1))
	const year = shifted.getUTCFullYear()
	const next = String(shifted.getUTCMonth() + 1).padStart(2, "0")
	return `${year}-${next}`
}

export function formatMonth(month: string): string {
	const parsed = parseMonth(month)
	if (!parsed) return month
	return new Intl.DateTimeFormat("en-US", {
		month: "long",
		year: "numeric",
		timeZone: "UTC"
	}).format(new Date(Date.UTC(parsed.year, parsed.monthIndex - 1, 1, 12)))
}

export function formatDayLabel(dayKey: string): string {
	const [year, monthIndex, day] = dayKey.split("-").map(Number)
	if (!year || !monthIndex || !day) return dayKey
	return new Intl.DateTimeFormat("en-US", {
		weekday: "long",
		month: "long",
		day: "numeric",
		timeZone: "UTC"
	}).format(new Date(Date.UTC(year, monthIndex - 1, day, 12)))
}

export function monthGrid(month: string): CalendarDay[] {
	const parsed = parseMonth(month)
	if (!parsed) return []

	const { year, monthIndex } = parsed
	const offset = weekdayIndex(year, monthIndex, 1)
	const daysInMonth = new Date(Date.UTC(year, monthIndex, 0)).getUTCDate()
	const total = Math.ceil((offset + daysInMonth) / 7) * 7
	const cells: CalendarDay[] = []

	for (let index = 0; index < total; index++) {
		const key = shiftCivil(year, monthIndex, 1, index - offset)
		cells.push({
			key,
			day: Number(key.slice(8, 10)),
			inMonth: key.startsWith(month)
		})
	}

	return cells
}

export function eventsInMonth(gatherings: PublicGathering[], month: string): PublicGathering[] {
	return gatherings
		.filter((gathering) => pacificDayKey(gathering).startsWith(`${month}-`))
		.sort((a, b) => a.start.localeCompare(b.start))
}

// During the last week, today also sits on the next month's grid. Open the view
// that still has more gatherings ahead, and keep today visible there.
export function openingMonth(gatherings: PublicGathering[], now = new Date()): string {
	const today = todayKey(now)
	const current = today.slice(0, 7)
	const next = shiftMonth(current, 1)
	const candidates = [current]
	if (monthGrid(next).some((cell) => cell.key === today)) candidates.push(next)

	let best = current
	let bestScore = -1
	for (const month of candidates) {
		const score = eventsInMonth(gatherings, month).filter(
			(gathering) => pacificDayKey(gathering) >= today
		).length
		if (score > bestScore) {
			best = month
			bestScore = score
		}
	}
	return best
}

export function monthSpan(gatherings: PublicGathering[]): { min: string; max: string } | null {
	if (gatherings.length === 0) return null
	let min = monthOfGathering(gatherings[0])
	let max = min
	for (const gathering of gatherings) {
		const month = monthOfGathering(gathering)
		if (month < min) min = month
		if (month > max) max = month
	}
	return { min, max }
}

export function groupByDay(gatherings: PublicGathering[]): DayGroup[] {
	const groups: DayGroup[] = []
	for (const gathering of gatherings) {
		const key = pacificDayKey(gathering)
		const last = groups[groups.length - 1]
		if (last && last.key === key) {
			last.events.push(gathering)
			continue
		}
		groups.push({ key, label: formatDayLabel(key), events: [gathering] })
	}
	return groups
}

function parseMonth(month: string): { year: number; monthIndex: number } | null {
	const match = /^(\d{4})-(\d{2})$/.exec(month)
	if (!match) return null
	const year = Number(match[1])
	const monthIndex = Number(match[2])
	if (monthIndex < 1 || monthIndex > 12) return null
	return { year, monthIndex }
}

function weekdayIndex(year: number, monthIndex: number, day: number): number {
	const name = new Intl.DateTimeFormat("en-US", {
		weekday: "short",
		timeZone: PACIFIC
	}).format(new Date(Date.UTC(year, monthIndex - 1, day, 12)))
	return WEEKDAY_INDEX[name] ?? 0
}

function shiftCivil(year: number, monthIndex: number, day: number, deltaDays: number): string {
	const date = new Date(Date.UTC(year, monthIndex - 1, day + deltaDays, 12))
	const y = date.getUTCFullYear()
	const m = String(date.getUTCMonth() + 1).padStart(2, "0")
	const d = String(date.getUTCDate()).padStart(2, "0")
	return `${y}-${m}-${d}`
}
