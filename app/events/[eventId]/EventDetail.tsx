"use client"
import { styled } from "styled-components"
import { Button } from "@/app/components/Button"
import { EventRoom } from "@/app/components/WaysToShowUp"
import {
	gatheringRegistration,
	isGatheringPast,
	type PublicGathering
} from "@/app/content/gatherings"
import type { EventMap } from "@/app/services/notion/eventPages"

//
// Types
//

type EventDetailProps = {
	gathering: PublicGathering
	descriptionHtml: string
	seatUrl: string | null
	map: EventMap | null
}

//
// Components
//

export function EventDetail({ gathering, descriptionHtml, seatUrl, map }: EventDetailProps) {
	const past = isGatheringPast(gathering)
	const registration = gatheringRegistration(gathering)
	const rsvpHref = registration?.href || seatUrl
	const rsvpLabel = registration?.label || "RSVP On Luma"
	const seatExternal = Boolean(rsvpHref && rsvpHref.startsWith("http"))

	return (
		<Main>
			<Container>
				<EventRoom gathering={gathering} past={past} />
				{descriptionHtml ? (
					<Description dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
				) : null}
				{rsvpHref ? (
					<SeatRow>
						<Button
							href={rsvpHref}
							target={seatExternal ? "_blank" : undefined}
							rel={seatExternal ? "noopener noreferrer" : undefined}
							variant="primary"
							size="default"
						>
							{rsvpLabel}
						</Button>
					</SeatRow>
				) : null}
				{map ? (
					<LocationSection>
						<SectionTitle>How to get there</SectionTitle>
						<MapFrame
							src={mapSrc(map)}
							title={`Map for ${map.address || gathering.name}`}
							loading="lazy"
						/>
					</LocationSection>
				) : null}
			</Container>
		</Main>
	)
}

const Main = styled.main`
	position: relative;
	padding: 2.5rem 0 3rem;
`

const Container = styled.div`
	width: min(var(--column), calc(100% - 2.5rem));
	margin: 0 auto;
	padding: 1.25rem 0 0;
`

const Description = styled.div`
	margin: 1.75rem 0 0;
	max-width: 40rem;
	font-size: 1rem;
	color: var(--muted-foreground);
	line-height: 1.5;
	word-break: break-word;

	p {
		margin: 0 0 1.2rem;
	}

	h1,
	h2,
	h3 {
		font-family: "Fraunces", "Iowan Old Style", Palatino, serif;
		font-weight: 560;
		letter-spacing: -0.03em;
		line-height: 1.2;
		color: var(--foreground);
	}

	h1 {
		font-size: 1.5rem;
		margin: 2rem 0 1rem;
	}

	h2 {
		font-size: 1.25rem;
		margin: 1.5rem 0 0.75rem;
	}

	h3 {
		font-size: 1.1rem;
		margin: 1.25rem 0 0.6rem;
	}

	h1:first-child,
	h2:first-child,
	h3:first-child {
		margin-top: 0;
	}

	ul,
	ol {
		margin: 1rem 0 1.2rem;
		padding-left: 1.375rem;
	}

	ul {
		list-style: disc;
	}

	a {
		color: var(--accent);
		text-underline-offset: 0.2em;
	}

	code {
		font-size: 0.875rem;
	}
`

const SeatRow = styled.div`
	margin-top: 1.5rem;
`

const LocationSection = styled.section`
	margin-top: 2rem;
`

const SectionTitle = styled.h2`
	font-family: "Fraunces", "Iowan Old Style", Palatino, serif;
	font-size: clamp(1.35rem, 2vw, 1.6rem);
	font-weight: 560;
	letter-spacing: -0.03em;
	line-height: 1.15;
	color: var(--foreground);
	margin: 0 0 0.85rem;
`

const MapFrame = styled.iframe`
	width: 100%;
	height: 300px;
	border: 1px solid var(--border);
	border-radius: 1rem;
`

//
// Functions
//

function mapSrc(map: EventMap): string {
	const lat = Number(map.lat)
	const lng = Number(map.lng)
	const pad = 0.01
	return `https://www.openstreetmap.org/export/embed.html?bbox=${lng - pad},${lat - pad},${lng + pad},${lat + pad}&layer=mapnik&marker=${lat},${lng}`
}
