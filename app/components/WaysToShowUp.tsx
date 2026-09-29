"use client"
import { styled } from "styled-components"
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

type WaysToShowUpProps = {
	gatherings?: PublicGathering[]
}

//
// Components
//

export function WaysToShowUp({ gatherings }: WaysToShowUpProps) {
	return (
		<Band>
			{formats.map((format) => {
				const next = (gatherings ?? []).find(
					(gathering) => gatheringKind(gathering.name) === format.kind
				)
				const nextExternal = next ? gatheringOpensNewTab(next) : false
				return (
					<Room key={format.kind}>
						{format.photo ? (
							<RoomPhoto
								src={format.photo}
								alt={`${format.name}, ${format.where}`}
								$position={format.photoPosition ?? "center"}
							/>
						) : null}
						<Name>{format.name}</Name>
						<Copy>{format.copy}</Copy>
						<Where>{format.where}</Where>
						{next ? (
							<NextLink
								href={next.href}
								target={nextExternal ? "_blank" : undefined}
								rel={nextExternal ? "noopener noreferrer" : undefined}
							>
								{formatPublicLine(next)}
							</NextLink>
						) : null}
					</Room>
				)
			})}
		</Band>
	)
}

export function EventRoom({ gathering, past }: { gathering: PublicGathering; past: boolean }) {
	const kind = gatheringKind(gathering.name)
	const format = formats.find((item) => item.kind === kind)
	const place = gatheringPlace(gathering)
	const street = gathering.address && gathering.address !== place ? gathering.address : ""
	return (
		<Room>
			{format?.photo ? (
				<RoomPhoto src={format.photo} alt="" $position={format.photoPosition ?? "center"} />
			) : null}
			<EventTitle>{gathering.name}</EventTitle>
			<When>
				{formatPublicLine(gathering)}
				{past ? <PastMark>Past</PastMark> : null}
			</When>
			<Where>{place}</Where>
			{street ? <Street>{street}</Street> : null}
			{format ? <Copy>{format.copy}</Copy> : null}
		</Room>
	)
}

//
// Styled Components
//

const Band = styled.section`
	width: 100%;
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 1.25rem;
	margin-top: 2.5rem;
	align-items: start;

	@media (max-width: 900px) {
		grid-template-columns: 1fr;
	}
`

const Room = styled.article`
	display: flex;
	flex-direction: column;
	background: var(--surface-solid);
	border: 1px solid var(--border);
	border-top: 3px solid var(--extrusion);
	border-radius: 1.5rem;
	padding: 0.85rem 0.85rem 1.25rem;
`

const RoomPhoto = styled.img<{ $position: string }>`
	display: block;
	width: 100%;
	aspect-ratio: 16 / 9;
	object-fit: cover;
	object-position: ${(props) => props.$position};
	border-radius: 0.9rem;
	margin-bottom: 0.9rem;
	background: var(--background);
`

const Name = styled.h2`
	margin: 0;
	font-family: "Fraunces", "Iowan Old Style", Palatino, serif;
	font-weight: 560;
	font-size: 1.45rem;
	letter-spacing: -0.03em;
	line-height: 1.15;
`

const EventTitle = styled.h1`
	margin: 0;
	font-family: "Fraunces", "Iowan Old Style", Palatino, serif;
	font-weight: 560;
	font-size: clamp(1.9rem, 3.5vw, 2.9rem);
	letter-spacing: -0.03em;
	line-height: 1.12;
`

const Copy = styled.p`
	margin: 0.55rem 0 0;
	color: var(--muted-foreground);
	line-height: 1.45;
`

const Where = styled.p`
	margin: 0.7rem 0 0;
	font-weight: 600;
	color: var(--foreground);
`

const Street = styled.p`
	margin: 0.25rem 0 0;
	color: var(--muted-foreground);
	line-height: 1.4;
`

const When = styled.p`
	margin: 0.55rem 0 0;
	font-weight: 600;
	color: var(--foreground);
`

const NextLink = styled.a`
	margin-top: 1rem;
	color: var(--foreground);
	font-weight: 600;
	line-height: 1.35;
	text-decoration: underline;
	text-underline-offset: 0.15em;
	align-self: flex-start;

	&:hover {
		color: var(--accent);
	}
`

const PastMark = styled.span`
	margin-left: 0.55rem;
	font-weight: 600;
	color: var(--muted-foreground);
`
