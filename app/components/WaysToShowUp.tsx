"use client"
import { styled } from "styled-components"
import { Button } from "./Button"
import { formats, gatheringFormatName, gatheringKind, whyWeShowUp } from "../content/community"
import { formatPublicLine, gatheringOpensNewTab, type PublicGathering } from "../content/gatherings"

//
// Types
//

type WaysToShowUpProps = {
	gatherings?: PublicGathering[]
	nextId?: string
	linksOnly?: boolean
}

type DateCardProps = {
	gathering: PublicGathering
	next: boolean
	past?: boolean
	seat?: "page" | "luma"
	linkName?: boolean
}

//
// Constants
//

const ROOM_PHOTO = "/images/weekend-function-talk.webp"

//
// Components
//

export function WaysToShowUp({ gatherings, nextId, linksOnly }: WaysToShowUpProps) {
	return (
		<Band>
			{formats.map((format) => {
				const dates = (gatherings ?? []).filter(
					(gathering) => gatheringKind(gathering.name) === format.kind
				)
				const next = linksOnly ? dates[0] : undefined
				const nextExternal = next ? gatheringOpensNewTab(next) : false
				return (
					<Room key={format.kind}>
						{format.kind === "function" ? (
							<RoomPhoto src={ROOM_PHOTO} alt={`${format.name}, ${format.where}`} />
						) : null}
						<Name>{format.name}</Name>
						<Why>{whyWeShowUp(format.name)}</Why>
						<Copy>{format.copy}</Copy>
						<Where>{format.where}</Where>
						{next ? (
							<NextLink
								href={next.href}
								target={nextExternal ? "_blank" : undefined}
								rel={nextExternal ? "noopener noreferrer" : undefined}
							>
								{next.name}
							</NextLink>
						) : null}
						{!linksOnly && dates.length > 0 ? (
							<Dates>
								{dates.map((gathering) => (
									<DateCard
										key={gathering.id}
										gathering={gathering}
										next={gathering.id === nextId}
									/>
								))}
							</Dates>
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
	const name = format?.name ?? gatheringFormatName(gathering.name)
	return (
		<Room>
			{kind === "function" ? (
				<RoomPhoto src={ROOM_PHOTO} alt={format ? `${format.name}, ${format.where}` : name} />
			) : null}
			<Name>{name}</Name>
			<Why>{whyWeShowUp(gathering.name)}</Why>
			{format ? <Copy>{format.copy}</Copy> : null}
			{format ? <Where>{format.where}</Where> : null}
			<Dates>
				<DateCard gathering={gathering} next={!past} past={past} seat="luma" linkName={false} />
			</Dates>
		</Room>
	)
}

function DateCard({
	gathering,
	next,
	past = false,
	seat = "page",
	linkName = true
}: DateCardProps) {
	const external = gatheringOpensNewTab(gathering)
	const seatHref = next ? (seat === "luma" ? gathering.lumaUrl : gathering.href) : null
	const seatExternal = seatHref ? seatHref.startsWith("http") : false
	return (
		<DateBlock>
			<Field>
				<FieldLabel>Name</FieldLabel>
				<FieldValue>
					{linkName ? (
						<DateLink
							href={gathering.href}
							target={external ? "_blank" : undefined}
							rel={external ? "noopener noreferrer" : undefined}
						>
							{gathering.name}
						</DateLink>
					) : (
						gathering.name
					)}
				</FieldValue>
			</Field>
			<Field>
				<FieldLabel>Date</FieldLabel>
				<FieldValue>
					{formatPublicLine(gathering)}
					{past ? <PastMark>Past</PastMark> : null}
				</FieldValue>
			</Field>
			<Field>
				<FieldLabel>Location</FieldLabel>
				<FieldValue>{gathering.location || "Not listed"}</FieldValue>
			</Field>
			<Field>
				<FieldLabel>Address</FieldLabel>
				<FieldValue>{gathering.address || "Not listed"}</FieldValue>
			</Field>
			<Field>
				<FieldLabel>Luma URL</FieldLabel>
				<FieldValue>
					{gathering.lumaUrl ? (
						<DateLink href={gathering.lumaUrl} target="_blank" rel="noopener noreferrer">
							{gathering.lumaUrl.replace(/^https?:\/\//, "")}
						</DateLink>
					) : (
						"Not listed"
					)}
				</FieldValue>
			</Field>
			<Field>
				<FieldLabel>Status</FieldLabel>
				<FieldValue>{gathering.status || "Not listed"}</FieldValue>
			</Field>
			{seatHref ? (
				<Button
					href={seatHref}
					target={seatExternal ? "_blank" : undefined}
					rel={seatExternal ? "noopener noreferrer" : undefined}
					variant="primary"
					size="small"
				>
					Save a seat
				</Button>
			) : null}
		</DateBlock>
	)
}

//
// Styled Components
//

const Band = styled.section`
	width: 100%;
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 1.25rem;
	margin-top: 2.5rem;
	align-items: start;

	@media (max-width: 800px) {
		grid-template-columns: 1fr;
	}
`

const Room = styled.article`
	display: flex;
	flex-direction: column;
	background: var(--surface-solid);
	border: 1px solid var(--border);
	border-top: 3px solid var(--accent);
	border-radius: 0.75rem;
	padding: 1.15rem 1.15rem 1.35rem;
`

const RoomPhoto = styled.img`
	display: block;
	width: 100%;
	aspect-ratio: 16 / 9;
	object-fit: cover;
	object-position: center 62%;
	border-radius: 0.5rem;
	margin-bottom: 1rem;
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

const Why = styled.p`
	margin: 0.65rem 0 0;
	font-family: "Fraunces", "Iowan Old Style", Palatino, serif;
	font-size: 1.05rem;
	font-weight: 560;
	letter-spacing: -0.02em;
	line-height: 1.35;
	color: var(--foreground);
`

const Copy = styled.p`
	margin: 0.65rem 0 0;
	color: var(--muted-foreground);
	line-height: 1.55;
`

const Where = styled.p`
	margin: 0.85rem 0 0;
	font-weight: 600;
	color: var(--foreground);
`

const Dates = styled.div`
	display: flex;
	flex-direction: column;
	gap: 1rem;
	margin-top: 1.15rem;
`

const DateBlock = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.45rem;
	padding-top: 0.9rem;
	border-top: 1px solid var(--border);
`

const Field = styled.div`
	display: grid;
	grid-template-columns: 5.5rem minmax(0, 1fr);
	gap: 0.5rem;
	align-items: baseline;
`

const FieldLabel = styled.span`
	font-family: "Chivo", sans-serif;
	font-size: 0.68rem;
	font-weight: 700;
	letter-spacing: 0.12em;
	text-transform: uppercase;
	color: var(--accent);
`

const FieldValue = styled.span`
	color: var(--foreground);
	line-height: 1.4;
`

const DateLink = styled.a`
	color: inherit;
	text-decoration: underline;
	text-underline-offset: 0.15em;
`

const NextLink = styled.a`
	margin-top: 1.15rem;
	color: var(--foreground);
	line-height: 1.4;
	text-decoration: underline;
	text-underline-offset: 0.15em;
	align-self: flex-start;
`

const PastMark = styled.span`
	margin-left: 0.55rem;
	font-family: "Chivo", sans-serif;
	font-size: 0.68rem;
	font-weight: 700;
	letter-spacing: 0.12em;
	text-transform: uppercase;
	color: var(--muted-foreground);
`
