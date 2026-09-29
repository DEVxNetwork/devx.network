"use client"
import { useState } from "react"
import { styled } from "styled-components"
import { Button } from "../components/Button"
import { formats, gatheringKind } from "../content/community"
import {
	formatPublicLine,
	gatheringOpensNewTab,
	gatheringPlace,
	type PublicGathering
} from "../content/gatherings"

//
// Types
//

type EventFilter = "upcoming" | "past"

type EventsPageProps = {
	upcoming: PublicGathering[]
	past: PublicGathering[]
}

//
// Components
//

export function EventsPage({ upcoming, past }: EventsPageProps) {
	const [filter, setFilter] = useState<EventFilter>("upcoming")
	const list = filter === "upcoming" ? upcoming : past
	const feature = filter === "upcoming" ? list[0] : undefined
	const rest = feature ? list.slice(1) : list

	return (
		<Main>
			<EventSection>
				<Title>Come sit down.</Title>
				<Lead>Saturdays downtown. Fridays at a café.</Lead>

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
						Past
					</Button>
				</FilterToggle>

				{list.length === 0 ? (
					<Empty>
						{filter === "upcoming"
							? "Nothing dated yet. The next one will land here."
							: "The old ones aren't written down yet."}
					</Empty>
				) : (
					<>
						{feature ? <FeatureCard gathering={feature} /> : null}
						{rest.length > 0 ? (
							<List>
								{rest.map((gathering) => (
									<GatheringRow key={gathering.id} gathering={gathering} />
								))}
							</List>
						) : null}
					</>
				)}

				<ButtonSection>
					<Button href="/speak" variant="secondary">
						Speak at an Event
					</Button>
					<Button href="https://lu.ma/DEVxNetwork" target="_blank" rel="noopener noreferrer">
						Every date, on Luma
					</Button>
				</ButtonSection>
			</EventSection>
		</Main>
	)
}

function FeatureCard({ gathering }: { gathering: PublicGathering }) {
	const format = formats.find((item) => item.kind === gatheringKind(gathering.name))
	const detailsExternal = gatheringOpensNewTab(gathering)
	const seat = gathering.lumaUrl || gathering.href
	const seatExternal = seat.startsWith("http")

	return (
		<Feature>
			{format?.photo ? (
				<FeaturePhoto src={format.photo} alt="" $position={format.photoPosition ?? "center"} />
			) : null}
			<FeatureName
				href={gathering.href}
				target={detailsExternal ? "_blank" : undefined}
				rel={detailsExternal ? "noopener noreferrer" : undefined}
			>
				{gathering.name}
			</FeatureName>
			{format ? <FeatureCopy>{format.copy}</FeatureCopy> : null}
			<FeatureMeta>
				{formatPublicLine(gathering)}
				{" · "}
				{gatheringPlace(gathering)}
			</FeatureMeta>
			<Button
				href={seat}
				target={seatExternal ? "_blank" : undefined}
				rel={seatExternal ? "noopener noreferrer" : undefined}
				variant="primary"
				size="default"
			>
				Save a seat
			</Button>
		</Feature>
	)
}

function GatheringRow({ gathering }: { gathering: PublicGathering }) {
	const external = gatheringOpensNewTab(gathering)
	return (
		<Row
			href={gathering.href}
			target={external ? "_blank" : undefined}
			rel={external ? "noopener noreferrer" : undefined}
		>
			<RowName>{gathering.name}</RowName>
			<RowMeta>
				{formatPublicLine(gathering)}
				{" · "}
				{gatheringPlace(gathering)}
			</RowMeta>
		</Row>
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

const Title = styled.h1`
	font-family: "Fraunces", "Iowan Old Style", Palatino, serif;
	font-size: clamp(2.4rem, 6vw, 4.4rem);
	font-weight: 560;
	letter-spacing: -0.04em;
	line-height: 0.95;
	margin: 0;
	max-width: 12ch;
	color: var(--foreground);
`

const Lead = styled.p`
	margin: 0.85rem 0 0;
	max-width: 28rem;
	font-size: 1.15rem;
	line-height: 1.45;
	color: var(--muted-foreground);
`

const FilterToggle = styled.div`
	display: flex;
	justify-content: flex-start;
	gap: 0.75rem;
	margin: 1.5rem 0 1.25rem;
`

const Empty = styled.p`
	margin: 1.5rem 0 0;
	color: var(--muted-foreground);
	font-size: 1.125rem;
`

const Feature = styled.article`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	background: var(--surface-solid);
	border: 1px solid var(--border);
	border-top: 3px solid var(--extrusion);
	border-radius: 1.5rem;
	padding: 0.85rem 0.85rem 1.35rem;
`

const FeaturePhoto = styled.img<{ $position: string }>`
	display: block;
	width: 100%;
	aspect-ratio: 16 / 9;
	object-fit: cover;
	object-position: ${(props) => props.$position};
	border-radius: 0.9rem;
	margin-bottom: 1rem;
	background: var(--wash);
`

const FeatureName = styled.a`
	font-family: "Fraunces", "Iowan Old Style", Palatino, serif;
	font-size: clamp(1.6rem, 3vw, 2.2rem);
	font-weight: 560;
	letter-spacing: -0.03em;
	line-height: 1.15;
	color: inherit;
	text-decoration: none;

	&:hover {
		color: var(--accent);
	}
`

const FeatureCopy = styled.p`
	margin: 0.45rem 0 0;
	max-width: 36rem;
	color: var(--muted-foreground);
	line-height: 1.45;
`

const FeatureMeta = styled.p`
	margin: 0.45rem 0 0.95rem;
	font-weight: 600;
`

const List = styled.div`
	display: flex;
	flex-direction: column;
	margin-top: 1.75rem;
	border-top: 1px solid var(--border);
`

const Row = styled.a`
	display: flex;
	flex-direction: column;
	gap: 0.2rem;
	padding: 0.95rem 0.1rem;
	border-bottom: 1px solid var(--border);
	text-decoration: none;
	color: inherit;

	&:hover h3 {
		color: var(--accent);
	}
`

const RowName = styled.h3`
	margin: 0;
	font-family: "Fraunces", "Iowan Old Style", Palatino, serif;
	font-size: 1.35rem;
	font-weight: 560;
	letter-spacing: -0.02em;
	line-height: 1.25;
`

const RowMeta = styled.p`
	margin: 0;
	color: var(--muted-foreground);
`

const ButtonSection = styled.div`
	margin-top: 2.5rem;
	display: flex;
	flex-wrap: wrap;
	gap: 0.75rem;
	justify-content: flex-start;
`
