"use client"
import { useEffect, useState, useMemo } from "react"
import styled from "styled-components"
import type { LumaEvent } from "@/app/services/luma"
import { lumaService } from "@/app/services/luma"
import { PotionBackground } from "../components/PotionBackground"
import { ErrorBoundary } from "../components/ErrorBoundary"
import { Card, CardContent, CardTitle, CardText } from "../components/Card"
import { Button } from "../components/Button"

// Types //

type EventFilter = "upcoming" | "past"
type EventFormat = "all" | "co-routine" | "weekend-function" | "other"

// Helpers //

function getEventFormat(event: LumaEvent): Exclude<EventFormat, "all"> {
	const name = event.name.toLowerCase()
	if (name.includes("co routine") || name.includes("coworking") || name.includes("cowork")) {
		return "co-routine"
	}
	if (name.includes("weekend function")) {
		return "weekend-function"
	}
	return "other"
}

function formatEventDate(dateString: string): string {
	const date = new Date(dateString)
	return date.toLocaleDateString("en-US", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit"
	})
}

function getDaysInMonth(year: number, month: number): number {
	return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number): number {
	return new Date(year, month, 1).getDay()
}

const MONTH_NAMES = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December"
]

const FORMAT_LABELS: Record<EventFormat, string> = {
	all: "All Events",
	"co-routine": "Co-routine",
	"weekend-function": "Weekend Function",
	other: "Other Events & Workshops"
}

const FORMAT_COLORS: Record<Exclude<EventFormat, "all">, string> = {
	"co-routine": "#10b981",
	"weekend-function": "#8b5cf6",
	other: "#f59e0b"
}

// Components //

export default function Events() {
	const [events, setEvents] = useState<LumaEvent[]>([])
	const [filter, setFilter] = useState<EventFilter>("upcoming")
	const [formatFilter, setFormatFilter] = useState<EventFormat>("all")
	const [loading, setLoading] = useState(true)
	const [calendarDate, setCalendarDate] = useState(() => {
		const now = new Date()
		return { year: now.getFullYear(), month: now.getMonth() }
	})

	useEffect(() => {
		loadEvents()
	}, [])

	const loadEvents = async () => {
		try {
			const allEvents = await lumaService.listEvents()
			setEvents(allEvents)
		} catch (error) {
			console.error("Failed to load events:", error)
		} finally {
			setLoading(false)
		}
	}

	const filteredEvents = useMemo(() => {
		return events
			.filter((event) => {
				const eventDate = new Date(event.start_at)
				const now = new Date()
				const timeMatch = filter === "upcoming" ? eventDate >= now : eventDate < now
				const formatMatch = formatFilter === "all" || getEventFormat(event) === formatFilter
				return timeMatch && formatMatch
			})
			.sort((a, b) => {
				const dateA = new Date(a.start_at).getTime()
				const dateB = new Date(b.start_at).getTime()
				return filter === "upcoming" ? dateA - dateB : dateB - dateA
			})
	}, [events, filter, formatFilter])

	// Calendar data
	const calendarEvents = useMemo(() => {
		const { year, month } = calendarDate
		const map: Record<number, LumaEvent[]> = {}
		events.forEach((event) => {
			const d = new Date(event.start_at)
			if (d.getFullYear() === year && d.getMonth() === month) {
				const day = d.getDate()
				if (!map[day]) map[day] = []
				map[day].push(event)
			}
		})
		return map
	}, [events, calendarDate])

	const daysInMonth = getDaysInMonth(calendarDate.year, calendarDate.month)
	const firstDay = getFirstDayOfMonth(calendarDate.year, calendarDate.month)

	const navigateMonth = (delta: number) => {
		setCalendarDate((prev) => {
			let newMonth = prev.month + delta
			let newYear = prev.year
			if (newMonth < 0) {
				newMonth = 11
				newYear--
			} else if (newMonth > 11) {
				newMonth = 0
				newYear++
			}
			return { year: newYear, month: newMonth }
		})
	}

	return (
		<>
			<BackgroundContainer>
				<ErrorBoundary
					fallback={<div style={{ backgroundColor: "black", width: "100%", height: "100%" }} />}
				>
					<PotionBackground />
				</ErrorBoundary>
			</BackgroundContainer>
			<Main>
				<EventSection>
					<Title>DEVx Events</Title>
					<EventDescription>
						Stay updated with our latest events, workshops, and meetups. Join us to network and
						learn with fellow developers.
					</EventDescription>

					<FilterToggle>
						<Button
							variant={filter === "upcoming" ? "primary" : "secondary"}
							onClick={() => setFilter("upcoming")}
						>
							Upcoming
						</Button>
						<Button
							variant={filter === "past" ? "primary" : "secondary"}
							onClick={() => setFilter("past")}
						>
							Past Events
						</Button>
					</FilterToggle>

					<FormatFilterRow>
						{(["all", "co-routine", "weekend-function", "other"] as EventFormat[]).map((fmt) => (
							<FormatChip
								key={fmt}
								$active={formatFilter === fmt}
								$color={fmt === "all" ? undefined : FORMAT_COLORS[fmt]}
								onClick={() => setFormatFilter(fmt)}
							>
								{fmt !== "all" && <FormatDot $color={FORMAT_COLORS[fmt]} />}
								{FORMAT_LABELS[fmt]}
							</FormatChip>
						))}
					</FormatFilterRow>

					{loading ? (
						<LoadingMessage>Loading events...</LoadingMessage>
					) : filteredEvents.length === 0 ? (
						<NoEventsMessage>No {filter} events at this time. Check back soon!</NoEventsMessage>
					) : (
						<EventsGrid>
							{filteredEvents.map((event) => (
								<Card
									key={event.api_id}
									href={`/events/${event.api_id}`}
									image={event.cover_url}
									imageAlt={event.name}
									imageAspectRatio="1/1"
								>
									<CardContent>
										<FormatBadge $color={FORMAT_COLORS[getEventFormat(event)]}>
											{FORMAT_LABELS[getEventFormat(event)]}
										</FormatBadge>
										<CardTitle>{event.name}</CardTitle>
										<CardText>{formatEventDate(event.start_at)}</CardText>
										{event.location && (
											<CardText $color="#d1d5db">
												{event.location.type === "physical"
													? `${event.location.city}, ${event.location.state}`
													: "Online Event"}
											</CardText>
										)}
										{event.guest_count !== undefined && event.guest_count !== -1 && (
											<CardText $color="#8b5cf6" $weight="500">
												{event.guest_count} attendees
											</CardText>
										)}
									</CardContent>
								</Card>
							))}
						</EventsGrid>
					)}

					<ButtonSection>
						<Button href="https://lu.ma/DEVxNetwork" target="_blank" rel="noopener noreferrer">
							View Full Calendar
						</Button>
					</ButtonSection>
				</EventSection>

				<CalendarSection>
					<Title>Event Calendar</Title>
					<CalendarNav>
						<CalendarNavButton onClick={() => navigateMonth(-1)}>&larr;</CalendarNavButton>
						<CalendarMonthLabel>
							{MONTH_NAMES[calendarDate.month]} {calendarDate.year}
						</CalendarMonthLabel>
						<CalendarNavButton onClick={() => navigateMonth(1)}>&rarr;</CalendarNavButton>
					</CalendarNav>
					<CalendarLegend>
						{(["co-routine", "weekend-function", "other"] as const).map((fmt) => (
							<LegendItem key={fmt}>
								<FormatDot $color={FORMAT_COLORS[fmt]} />
								<LegendLabel>{FORMAT_LABELS[fmt]}</LegendLabel>
							</LegendItem>
						))}
					</CalendarLegend>
					<CalendarGrid>
						{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
							<CalendarDayHeader key={day}>{day}</CalendarDayHeader>
						))}
						{Array.from({ length: firstDay }).map((_, i) => (
							<CalendarCell key={`empty-${i}`} />
						))}
						{Array.from({ length: daysInMonth }).map((_, i) => {
							const day = i + 1
							const dayEvents = calendarEvents[day] || []
							const today = new Date()
							const isToday =
								today.getFullYear() === calendarDate.year &&
								today.getMonth() === calendarDate.month &&
								today.getDate() === day
							return (
								<CalendarCell key={day} $hasEvents={dayEvents.length > 0} $isToday={isToday}>
									<CalendarDayNumber $isToday={isToday}>{day}</CalendarDayNumber>
									{dayEvents.length > 0 && (
										<CalendarEventDots>
											{dayEvents.map((event) => (
												<CalendarEventDot
													key={event.api_id}
													$color={FORMAT_COLORS[getEventFormat(event)]}
													title={event.name}
												/>
											))}
										</CalendarEventDots>
									)}
									{dayEvents.length > 0 && (
										<CalendarEventList>
											{dayEvents.map((event) => (
												<CalendarEventLink
													key={event.api_id}
													href={`/events/${event.api_id}`}
													$color={FORMAT_COLORS[getEventFormat(event)]}
												>
													{event.name.length > 20
														? event.name.substring(0, 20) + "..."
														: event.name}
												</CalendarEventLink>
											))}
										</CalendarEventList>
									)}
								</CalendarCell>
							)
						})}
					</CalendarGrid>
				</CalendarSection>
			</Main>
		</>
	)
}

// Styled Components //

const BackgroundContainer = styled.section`
	background-color: #0a0a0a;
	position: fixed;
	height: 100vh;
	width: 100vw;
	top: 0;
	left: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`

const Main = styled.main`
	position: relative;
	z-index: 1;
`

const EventSection = styled.section`
	background-color: transparent;
	padding: 2rem;
	border-radius: 0.5rem;
	box-shadow:
		0 4px 6px -1px rgba(0, 0, 0, 0.1),
		0 2px 4px -1px rgba(0, 0, 0, 0.06);
	margin-bottom: 1rem;
	max-width: 1200px;
	margin-left: auto;
	margin-right: auto;
	padding-top: 8rem;
`

const CalendarSection = styled.section`
	max-width: 1200px;
	margin: 0 auto 3rem;
	padding: 2rem;
`

const Title = styled.h2`
	font-size: 1.875rem;
	font-weight: bold;
	margin-bottom: 1rem;
	text-align: center;
	color: white;
`

const EventDescription = styled.p`
	margin-top: 0.5rem;
	font-size: 1.25rem;
	text-align: center;
	max-width: 60rem;
	margin-left: auto;
	margin-right: auto;
	margin-bottom: 2rem;
	color: #d1d5db;
`

const FilterToggle = styled.div`
	display: flex;
	justify-content: center;
	gap: 1rem;
	margin-bottom: 1rem;
`

const FormatFilterRow = styled.div`
	display: flex;
	justify-content: center;
	gap: 0.5rem;
	margin-bottom: 2rem;
	flex-wrap: wrap;
`

const FormatChip = styled.button<{ $active: boolean; $color?: string }>`
	display: inline-flex;
	align-items: center;
	gap: 0.375rem;
	padding: 0.375rem 0.75rem;
	border-radius: 9999px;
	font-size: 0.875rem;
	font-family: inherit;
	cursor: pointer;
	transition: all 0.2s ease;
	border: 1px solid
		${(props) => (props.$active ? props.$color || "white" : "rgba(255,255,255,0.3)")};
	background-color: ${(props) =>
		props.$active
			? props.$color
				? props.$color + "22"
				: "rgba(255,255,255,0.15)"
			: "transparent"};
	color: ${(props) => (props.$active ? "white" : "rgba(255,255,255,0.7)")};

	&:hover {
		border-color: ${(props) => props.$color || "white"};
		color: white;
	}
`

const FormatDot = styled.span<{ $color: string }>`
	display: inline-block;
	width: 8px;
	height: 8px;
	border-radius: 50%;
	background-color: ${(props) => props.$color};
`

const FormatBadge = styled.span<{ $color: string }>`
	display: inline-block;
	font-size: 0.7rem;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.05em;
	color: ${(props) => props.$color};
	margin-bottom: 0.25rem;
`

const EventsGrid = styled.div`
	display: grid;
	grid-template-columns: 1fr;
	gap: 1.5rem;
	width: 100%;

	@media (min-width: 768px) {
		grid-template-columns: repeat(2, 1fr);
	}

	@media (min-width: 1024px) {
		grid-template-columns: repeat(3, 1fr);
	}
`

const LoadingMessage = styled.p`
	text-align: center;
	color: #9ca3af;
	font-size: 1.125rem;
	padding: 2rem;
`

const NoEventsMessage = styled.p`
	text-align: center;
	color: #9ca3af;
	font-size: 1.125rem;
	padding: 2rem;
`

const ButtonSection = styled.div`
	margin-top: 3rem;
	display: flex;
	justify-content: center;
`

// Calendar styled components

const CalendarNav = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 1.5rem;
	margin-bottom: 1rem;
`

const CalendarNavButton = styled.button`
	background: transparent;
	border: 1px solid rgba(255, 255, 255, 0.3);
	color: white;
	font-size: 1.25rem;
	padding: 0.25rem 0.75rem;
	border-radius: 0.25rem;
	cursor: pointer;
	font-family: inherit;
	transition: all 0.2s ease;

	&:hover {
		border-color: white;
		background: rgba(255, 255, 255, 0.1);
	}
`

const CalendarMonthLabel = styled.span`
	color: white;
	font-size: 1.25rem;
	font-weight: 600;
	min-width: 200px;
	text-align: center;
`

const CalendarLegend = styled.div`
	display: flex;
	justify-content: center;
	gap: 1.5rem;
	margin-bottom: 1rem;
	flex-wrap: wrap;
`

const LegendItem = styled.div`
	display: flex;
	align-items: center;
	gap: 0.375rem;
`

const LegendLabel = styled.span`
	color: rgba(255, 255, 255, 0.7);
	font-size: 0.8rem;
`

const CalendarGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(7, 1fr);
	gap: 1px;
	background: rgba(255, 255, 255, 0.1);
	border: 1px solid rgba(255, 255, 255, 0.1);
	border-radius: 0.5rem;
	overflow: hidden;
`

const CalendarDayHeader = styled.div`
	background: rgba(255, 255, 255, 0.05);
	color: rgba(255, 255, 255, 0.6);
	text-align: center;
	padding: 0.5rem;
	font-size: 0.75rem;
	font-weight: 600;
	text-transform: uppercase;
`

const CalendarCell = styled.div<{ $hasEvents?: boolean; $isToday?: boolean }>`
	background: ${(props) => (props.$isToday ? "rgba(139, 92, 246, 0.1)" : "rgba(0, 0, 0, 0.3)")};
	min-height: 80px;
	padding: 0.375rem;
	display: flex;
	flex-direction: column;
	gap: 0.25rem;

	@media (max-width: 768px) {
		min-height: 60px;
		padding: 0.25rem;
	}
`

const CalendarDayNumber = styled.span<{ $isToday: boolean }>`
	font-size: 0.8rem;
	color: ${(props) => (props.$isToday ? "#8b5cf6" : "rgba(255, 255, 255, 0.6)")};
	font-weight: ${(props) => (props.$isToday ? "700" : "400")};
`

const CalendarEventDots = styled.div`
	display: flex;
	gap: 3px;
	flex-wrap: wrap;

	@media (min-width: 768px) {
		display: none;
	}
`

const CalendarEventDot = styled.span<{ $color: string }>`
	width: 6px;
	height: 6px;
	border-radius: 50%;
	background-color: ${(props) => props.$color};
`

const CalendarEventList = styled.div`
	display: none;
	flex-direction: column;
	gap: 2px;

	@media (min-width: 768px) {
		display: flex;
	}
`

const CalendarEventLink = styled.a<{ $color: string }>`
	font-size: 0.65rem;
	color: white;
	background: ${(props) => props.$color + "33"};
	border-left: 2px solid ${(props) => props.$color};
	padding: 1px 4px;
	border-radius: 2px;
	text-decoration: none;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	display: block;
	transition: background 0.2s ease;

	&:hover {
		background: ${(props) => props.$color + "55"};
	}
`
