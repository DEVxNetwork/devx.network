"use client"
import { useEffect, useState } from "react"
import styled from "styled-components"
import type { LumaEvent } from "@/app/services/luma"
import { lumaService } from "@/app/services/luma"
import { PotionBackground } from "../components/PotionBackground"
import { ErrorBoundary } from "../components/ErrorBoundary"
import { Card, CardContent, CardTitle, CardText } from "../components/Card"
import { Button } from "../components/Button"

// Types //

type EventFilter = "upcoming" | "past"

// Components //

export default function Events() {
	const [events, setEvents] = useState<LumaEvent[]>([])
	const [filter, setFilter] = useState<EventFilter>("upcoming")
	const [loading, setLoading] = useState(true)

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

	const filteredEvents = events
		.filter((event) => {
			const eventDate = new Date(event.start_at)
			const now = new Date()
			return filter === "upcoming" ? eventDate >= now : eventDate < now
		})
		.sort((a, b) => {
			const dateA = new Date(a.start_at).getTime()
			const dateB = new Date(b.start_at).getTime()
			// Ascending for upcoming (oldest first), descending for past (newest first)
			return filter === "upcoming" ? dateA - dateB : dateB - dateA
		})

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
			</Main>
		</>
	)
}

// Functions //

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
	margin-bottom: 3rem;
	max-width: 1200px;
	margin-left: auto;
	margin-right: auto;
	padding-top: 8rem;
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
	margin-bottom: 2rem;
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
