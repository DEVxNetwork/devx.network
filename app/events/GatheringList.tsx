"use client"
import { styled } from "styled-components"
import { Button } from "../components/Button"
import { gatheringTitle } from "../content/community"
import {
	gatheringOpensNewTab,
	gatheringPlace,
	gatheringRegistration,
	isGatheringPast,
	type PublicGathering
} from "../content/gatherings"
import { links } from "../siteConfig"
import { groupByDay } from "./calendar"

//
// Types
//

type GatheringListProps = {
	gatherings: PublicGathering[]
	covers: Record<string, string>
	selectedId: string | null
	onSelect: (id: string) => void
}

//
// Constants
//

const PACIFIC = "America/Los_Angeles"

//
// Components
//

export function GatheringList({ gatherings, covers, selectedId, onSelect }: GatheringListProps) {
	const groups = groupByDay(gatherings)
	if (groups.length === 0) return <Empty>Nothing coming up.</Empty>

	return (
		<Timeline>
			{groups.map((group) => (
				<Day key={group.key}>
					<Dot aria-hidden="true" />
					<DayLabel>{dayHeading(group.key)}</DayLabel>
					<Cards>
						{group.events.map((gathering) => (
							<GatheringCard
								key={gathering.id}
								gathering={gathering}
								cover={covers[gathering.id] ?? ""}
								selected={gathering.id === selectedId}
								onSelect={onSelect}
							/>
						))}
					</Cards>
				</Day>
			))}
		</Timeline>
	)
}

function GatheringCard({
	gathering,
	cover,
	selected,
	onSelect
}: {
	gathering: PublicGathering
	cover: string
	selected: boolean
	onSelect: (id: string) => void
}) {
	const external = gatheringOpensNewTab(gathering)
	const past = isGatheringPast(gathering)
	const time = clock(gathering)
	const place = gatheringPlace(gathering)
	const registration = gatheringRegistration(gathering)
	const rsvpHref = registration?.href || links.lumaUrl
	const rsvpLabel = registration?.label || "RSVP On Luma"

	return (
		<Card
			id={`gathering-${gathering.id}`}
			$selected={selected}
			$past={past}
			onClick={() => onSelect(gathering.id)}
		>
			<Body>
				{time ? <Time>{time}</Time> : null}
				<Name>
					<NameLink
						href={gathering.href}
						target={external ? "_blank" : undefined}
						rel={external ? "noopener noreferrer" : undefined}
						onClick={(event) => event.stopPropagation()}
					>
						{gatheringTitle(gathering.name)}
					</NameLink>
				</Name>
				<Place>
					<Pin aria-hidden="true" />
					<span>{place}</span>
					{past ? <Past>Past</Past> : null}
				</Place>
			</Body>
			{cover ? <Cover src={cover} alt="" /> : <CoverFallback aria-hidden="true" />}
			<Actions>
				<Button
					href={rsvpHref}
					variant="secondary"
					size="small"
					onClick={(event) => event?.stopPropagation()}
				>
					{rsvpLabel}
				</Button>
			</Actions>
		</Card>
	)
}

function Pin() {
	return (
		<svg width="14" height="14" viewBox="0 0 16 16" fill="none">
			<path
				d="M8 1.6a4.2 4.2 0 0 0-4.2 4.2c0 3.2 4.2 8.6 4.2 8.6s4.2-5.4 4.2-8.6A4.2 4.2 0 0 0 8 1.6Z"
				stroke="currentColor"
				strokeWidth="1.4"
			/>
			<circle cx="8" cy="5.8" r="1.4" fill="currentColor" />
		</svg>
	)
}

const Timeline = styled.div`
	display: flex;
	flex-direction: column;
`

const Day = styled.section`
	position: relative;
	padding: 0 0 1.15rem 1.15rem;

	&::before {
		content: "";
		position: absolute;
		left: 0.22rem;
		top: 0.7rem;
		bottom: 0;
		border-left: 1px dashed var(--border);
	}

	&:last-child::before {
		bottom: 1.2rem;
	}

	@media (min-width: 960px) {
		padding: 0 0 0.35rem;

		&::before {
			display: none;
		}
	}
`

const Dot = styled.span`
	position: absolute;
	left: 0;
	top: 0.38rem;
	width: 0.5rem;
	height: 0.5rem;
	border-radius: 999px;
	background: var(--subtle-foreground);

	@media (min-width: 960px) {
		display: none;
	}
`

const DayLabel = styled.h2`
	margin: 0 0 0.65rem;
	color: var(--muted-foreground);
	font-family: "Chivo", sans-serif;
	font-size: 0.98rem;
	font-weight: 600;
	letter-spacing: 0;
	line-height: 1.3;
`

const Cards = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	min-width: 0;

	@media (min-width: 960px) {
		gap: 0.15rem;
	}
`

const Card = styled.article<{ $selected: boolean; $past: boolean }>`
	display: grid;
	grid-template-columns: minmax(0, 1fr) 4.6rem;
	grid-template-areas:
		"body cover"
		"actions cover";
	gap: 0.45rem 0.85rem;
	align-items: start;
	min-width: 0;
	padding: 0.9rem;
	border: 1px solid var(--border);
	border-radius: 1rem;
	background: ${(props) =>
		props.$selected ? "var(--events-selected, #eaeaea)" : "var(--surface-solid)"};
	box-shadow: 0 1px 2px rgba(24, 24, 24, 0.04);
	opacity: ${(props) => (props.$past ? 0.72 : 1)};
	cursor: pointer;
	scroll-margin: 5rem;

	@media (max-width: 380px) {
		grid-template-columns: minmax(0, 1fr) 3.6rem;
		gap: 0.35rem 0.65rem;
		padding: 0.7rem;
	}

	@media (min-width: 960px) {
		grid-template-columns: 4.25rem minmax(0, 1fr);
		grid-template-areas:
			"cover body"
			"cover actions";
		gap: 0.2rem 0.8rem;
		padding: 0.55rem 0.4rem;
		border-color: transparent;
		border-radius: 0.85rem;
		background: ${(props) => (props.$selected ? "var(--surface-solid)" : "transparent")};
		box-shadow: none;

		&:hover {
			background: var(--surface-solid);
		}
	}
`

const Body = styled.div`
	grid-area: body;
	display: flex;
	flex-direction: column;
	gap: 0.28rem;
	min-width: 0;
`

const Time = styled.p`
	margin: 0;
	color: var(--muted-foreground);
	font-size: 0.92rem;
	font-weight: 500;
	line-height: 1.2;
`

const Name = styled.h3`
	margin: 0;
	min-width: 0;
	font-family: "Chivo", sans-serif;
	font-size: 1.12rem;
	font-weight: 700;
	letter-spacing: -0.02em;
	line-height: 1.25;
	overflow-wrap: break-word;

	@media (max-width: 380px) {
		font-size: 1rem;
	}
`

const NameLink = styled.a`
	color: inherit;
	text-decoration: none;

	&:hover {
		color: var(--accent);
	}
`

const Place = styled.p`
	display: flex;
	align-items: flex-start;
	gap: 0.35rem;
	min-width: 0;
	margin: 0.1rem 0 0;
	color: var(--muted-foreground);
	font-size: 0.92rem;
	line-height: 1.35;
	overflow-wrap: break-word;

	svg {
		flex: none;
		margin-top: 0.15rem;
	}

	span {
		min-width: 0;
	}
`

const Past = styled.span`
	flex: none;
	color: var(--subtle-foreground);
	font-weight: 600;
`

const Cover = styled.img`
	grid-area: cover;
	width: 4.6rem;
	height: 4.6rem;
	border-radius: 0.75rem;
	align-self: start;
	object-fit: cover;
	background: #181818;

	@media (max-width: 380px) {
		width: 3.6rem;
		height: 3.6rem;
	}

	@media (min-width: 960px) {
		width: 4.25rem;
		height: 4.25rem;
		border-radius: 0.65rem;
	}
`

const CoverFallback = styled.span`
	grid-area: cover;
	align-self: start;
	width: 4.6rem;
	height: 4.6rem;
	border-radius: 0.75rem;
	background: var(--extrusion);

	@media (max-width: 380px) {
		width: 3.6rem;
		height: 3.6rem;
	}

	@media (min-width: 960px) {
		width: 4.25rem;
		height: 4.25rem;
		border-radius: 0.65rem;
	}
`

const Actions = styled.div`
	grid-area: actions;
	min-width: 0;
	margin-top: 0.35rem;

	a,
	button {
		max-width: 100%;
	}

	@media (min-width: 960px) {
		margin-top: 0.15rem;
	}
`

const Empty = styled.p`
	margin: 0;
	color: var(--muted-foreground);
	font-size: 1.05rem;
`

//
// Functions
//

function dayHeading(dayKey: string): string {
	const [year, monthIndex, day] = dayKey.split("-").map(Number)
	if (!year || !monthIndex || !day) return dayKey
	const date = new Date(Date.UTC(year, monthIndex - 1, day, 12))
	const month = new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" }).format(date)
	const weekday = new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone: "UTC" }).format(
		date
	)
	return `${month} ${day} / ${weekday}`
}

function clock(gathering: PublicGathering): string | null {
	if (!gathering.hasTime) return null
	return new Intl.DateTimeFormat("en-US", {
		hour: "numeric",
		minute: "2-digit",
		timeZone: PACIFIC
	}).format(new Date(gathering.start))
}
