"use client"
import { useState } from "react"
import { styled } from "styled-components"
import { Button } from "../components/Button"
import { WaysToShowUp } from "../components/WaysToShowUp"
import { type PublicGathering } from "../content/gatherings"

// Types //

type EventFilter = "upcoming" | "past"

type EventsPageProps = {
	upcoming: PublicGathering[]
	past: PublicGathering[]
}

// Components //

export function EventsPage({ upcoming, past }: EventsPageProps) {
	const [filter, setFilter] = useState<EventFilter>("upcoming")

	return (
		<>
			<Main>
				<EventSection>
					<Eyebrow>Calendar</Eyebrow>
					<Title>Come sit down.</Title>

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

					<WaysToShowUp
						gatherings={filter === "upcoming" ? upcoming : past}
						nextId={filter === "upcoming" ? upcoming[0]?.id : undefined}
					/>

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

const Main = styled.main`
	position: relative;
`

const EventSection = styled.section`
	width: min(var(--column), calc(100% - 2.5rem));
	margin: 0 auto;
	padding: 3.25rem 0 3rem;
`

const Eyebrow = styled.p`
	margin: 0 0 0.55rem;
	font-family: "Chivo", sans-serif;
	font-size: 0.72rem;
	font-weight: 700;
	letter-spacing: 0.14em;
	text-transform: uppercase;
	color: var(--accent);
`

const Title = styled.h1`
	font-family: "Fraunces", "Iowan Old Style", Palatino, serif;
	font-size: clamp(1.9rem, 3.5vw, 2.9rem);
	font-weight: 560;
	letter-spacing: -0.03em;
	line-height: 1.18;
	margin: 0 0 0.75rem;
	max-width: 16em;
	color: var(--foreground);
`

const KindLabel = styled.p`
	margin: 0 0 0.35rem;
	font-family: "Chivo", sans-serif;
	font-size: 0.72rem;
	font-weight: 700;
	letter-spacing: 0.12em;
	text-transform: uppercase;
	color: var(--accent);
`

const FilterToggle = styled.div`
	display: flex;
	justify-content: flex-start;
	gap: 0.75rem;
	margin-bottom: 2rem;
`

const EventList = styled.div`
	display: flex;
	flex-direction: column;
	border-top: 1px solid var(--border);
`

const EventRow = styled.a`
	display: grid;
	grid-template-columns: minmax(11rem, 16rem) minmax(0, 1fr) minmax(10rem, 16rem);
	gap: 1rem;
	align-items: center;
	padding: 1rem 0.15rem;
	border-bottom: 1px solid var(--border);
	text-decoration: none;
	color: inherit;

	&:hover ${() => EventName} {
		color: var(--accent);
	}

	@media (max-width: 800px) {
		grid-template-columns: 1fr;
		gap: 0.2rem;
		padding: 0.95rem 0;
	}
`

const EventWhen = styled.p`
	margin: 0;
	font-weight: 600;
	line-height: 1.35;
`

const EventBody = styled.div`
	min-width: 0;
`

const EventName = styled.p`
	margin: 0.1rem 0 0;
	font-family: "Fraunces", "Iowan Old Style", Palatino, serif;
	font-size: 1.15rem;
	font-weight: 560;
	letter-spacing: -0.02em;
	line-height: 1.25;
`

const Why = styled.p`
	margin: 0.3rem 0 0;
	color: var(--muted-foreground);
	font-size: 0.95rem;
	line-height: 1.45;
`

const EventPlace = styled.p`
	margin: 0;
	text-align: right;
	color: var(--muted-foreground);

	@media (max-width: 800px) {
		text-align: left;
	}
`

const NoEventsMessage = styled.p`
	text-align: center;
	color: var(--subtle-foreground);
	font-size: 1.125rem;
	padding: 2rem;
`

const ButtonSection = styled.div`
	margin-top: 3rem;
	display: flex;
	justify-content: center;
`
