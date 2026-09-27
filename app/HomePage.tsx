"use client"
import { styled } from "styled-components"
import { organizerEmeritus, organizers } from "./info/organizers"
import { Button } from "./components/Button"
import { gatheringBlurb, gatheringLabel } from "./content/community"
import {
	formatPublicWhen,
	gatheringOpensNewTab,
	gatheringPlace,
	type PublicGathering
} from "./content/gatherings"

//
// Types
//

type HomePageProps = {
	gatherings: PublicGathering[]
}

type StoryBeat = {
	time: string
	title: string
	copy: string
}

type RoomFormat = {
	cadence: string
	name: string
	where: string
	copy: string
	tone: "orange" | "teal"
}

type Belief = {
	title: string
	copy: string
}

//
// Constants
//

const ROOM_PHOTO = "/images/slides/slide1.webp"
const UPCOMING_LIMIT = 4

const beats: StoryBeat[] = [
	{
		time: "12:00",
		title: "Lunch",
		copy: "Sit down with someone new. Food and drinks are on us."
	},
	{
		time: "1:00",
		title: "Talks from the seats",
		copy: "Usually three, from members. What you learned last month is enough."
	},
	{
		time: "2:15",
		title: "Laptops open",
		copy: "Show a project or ask the stuck question. We stay until four."
	}
]

const rooms: RoomFormat[] = [
	{
		cadence: "One Saturday a month",
		name: "Weekend Function()",
		where: "Edge Offices, Little Italy",
		copy: "Lunch, member talks, then an open hang until four, near the trolley.",
		tone: "orange"
	},
	{
		cadence: "Friday coworking",
		name: 'co routine("place")',
		where: "San Diego and Oceanside",
		copy: "A smaller table that moves. Laptops and coffee, lately at Moniker and Communal.",
		tone: "teal"
	}
]

const beliefs: Belief[] = [
	{
		title: "The door is not a skill check.",
		copy: "A first year and a twentieth year share a table."
	},
	{
		title: "The teachers are already seated.",
		copy: "If you are excited about it, the room wants to hear it."
	},
	{
		title: "Help is part of the afternoon.",
		copy: "Bring the bug. Someone nearby has already hit it."
	},
	{
		title: "Hospitality is the program.",
		copy: "Free to attend. Lunch is on us."
	}
]

//
// Components
//

export function HomePage({ gatherings }: HomePageProps) {
	const upcoming = gatherings.slice(0, UPCOMING_LIMIT)
	const nextEvent = upcoming[0]
	const nextWhen = nextEvent ? formatPublicWhen(nextEvent) : null
	const nextHref = nextEvent ? nextEvent.href : "/events"
	const nextExternal = nextEvent ? gatheringOpensNewTab(nextEvent) : false

	return (
		<Main>
			<Hero>
				<HeroCopy>
					<Eyebrow>San Diego · a developer community</Eyebrow>
					<Headline>
						We get together
						<br />
						so we can learn
						<br />
						<Emphasis>from each other.</Emphasis>
					</Headline>
					<Lead>
						Developers at every level, in the same room. Eat, hear a talk from the seats, then build
						beside each other.
					</Lead>
					<HeroActions>
						<Button
							href={nextHref}
							target={nextExternal ? "_blank" : undefined}
							rel={nextExternal ? "noopener noreferrer" : undefined}
							variant="primary"
							size="default"
						>
							Join the next gathering
						</Button>
					</HeroActions>
				</HeroCopy>
				<HeroVisual>
					<RoomPhoto src={ROOM_PHOTO} alt="DEVx members seated for a talk" />
					<NextCard>
						<NextKicker>{nextEvent ? "Next up" : "Calendar"}</NextKicker>
						{nextEvent && nextWhen ? (
							<>
								<NextKind>{gatheringLabel(nextEvent.name)}</NextKind>
								<NextName>{nextEvent.name}</NextName>
								<NextMeta>
									{nextWhen.day}
									{nextWhen.time ? (
										<>
											<MetaDot aria-hidden="true">·</MetaDot>
											{nextWhen.time}
										</>
									) : null}
								</NextMeta>
								<NextPlace>{gatheringPlace(nextEvent)}</NextPlace>
								<NextBlurb>{gatheringBlurb(nextEvent.name)}</NextBlurb>
							</>
						) : (
							<NextBlurb>The next date is going on the calendar. Check back shortly.</NextBlurb>
						)}
						<Button
							href={nextHref}
							target={nextExternal ? "_blank" : undefined}
							rel={nextExternal ? "noopener noreferrer" : undefined}
							variant="primary"
							size="small"
						>
							Save a seat
						</Button>
					</NextCard>
				</HeroVisual>
			</Hero>

			<Band id="saturday">
				<SectionIntro>
					<Eyebrow>The shape of a Saturday</Eyebrow>
					<SectionTitle>Lunch, then the room teaches itself.</SectionTitle>
					<SectionCopy>Meet someone before anyone presents. Stay after, and build.</SectionCopy>
				</SectionIntro>
				<BeatList>
					{beats.map((beat) => (
						<Beat key={beat.time}>
							<BeatTime>{beat.time}</BeatTime>
							<BeatTitle>{beat.title}</BeatTitle>
							<BeatCopy>{beat.copy}</BeatCopy>
						</Beat>
					))}
				</BeatList>
			</Band>

			<FormatBand id="formats">
				{rooms.map((room) => (
					<FormatPanel key={room.name}>
						<FormatEyebrow $tone={room.tone}>{room.cadence}</FormatEyebrow>
						<FormatName>{room.name}</FormatName>
						<FormatWhere>{room.where}</FormatWhere>
						<FormatCopy>{room.copy}</FormatCopy>
					</FormatPanel>
				))}
			</FormatBand>

			<Band id="why">
				<SectionIntro>
					<Eyebrow>Why we keep showing up</Eyebrow>
					<SectionTitle>A room that expects you.</SectionTitle>
				</SectionIntro>
				<BeliefGrid>
					{beliefs.map((belief) => (
						<BeliefCard key={belief.title}>
							<BeliefTitle>{belief.title}</BeliefTitle>
							<BeliefCopy>{belief.copy}</BeliefCopy>
						</BeliefCard>
					))}
				</BeliefGrid>
			</Band>

			<UpcomingBand id="upcoming">
				<UpcomingHeader>
					<div>
						<Eyebrow>On the calendar</Eyebrow>
						<SectionTitle>Come sit down.</SectionTitle>
					</div>
					<Button href="/events" variant="secondary" size="small">
						All gatherings
					</Button>
				</UpcomingHeader>
				{upcoming.length === 0 ? (
					<Empty>No upcoming gatherings are posted yet.</Empty>
				) : (
					<UpcomingList>
						{upcoming.map((gathering) => {
							const when = formatPublicWhen(gathering)
							const external = gatheringOpensNewTab(gathering)
							return (
								<UpcomingItem
									key={gathering.id}
									href={gathering.href}
									target={external ? "_blank" : undefined}
									rel={external ? "noopener noreferrer" : undefined}
								>
									<UpcomingWhen>
										<UpcomingDay>{when.day}</UpcomingDay>
										{when.time ? <UpcomingTime>{when.time}</UpcomingTime> : null}
									</UpcomingWhen>
									<UpcomingBody>
										<UpcomingKind>{gatheringLabel(gathering.name)}</UpcomingKind>
										<UpcomingName>{gathering.name}</UpcomingName>
									</UpcomingBody>
									<UpcomingPlace>{gatheringPlace(gathering)}</UpcomingPlace>
								</UpcomingItem>
							)
						})}
					</UpcomingList>
				)}
			</UpcomingBand>

			<Band id="people">
				<SectionIntro>
					<Eyebrow>Who holds the room</Eyebrow>
					<SectionTitle>Volunteer organizers, not a company.</SectionTitle>
					<SectionCopy>The people who set out lunch will sit with your bug afterward.</SectionCopy>
				</SectionIntro>
				<PeopleGrid>
					{organizers.map((organizer) => (
						<Person
							key={organizer.name}
							href={organizer.linkedIn}
							target="_blank"
							rel="noopener noreferrer"
							aria-label={`${organizer.name} on LinkedIn`}
						>
							<PersonPhoto src={organizer.imageSrc} alt="" />
							<PersonName>{organizer.name}</PersonName>
						</Person>
					))}
				</PeopleGrid>
				<EmeritusLabel>Earlier organizers</EmeritusLabel>
				<EmeritusRow>
					{organizerEmeritus.map((organizer) => (
						<Person
							key={organizer.name}
							href={organizer.linkedIn}
							target="_blank"
							rel="noopener noreferrer"
							aria-label={`${organizer.name} on LinkedIn`}
						>
							<PersonPhoto src={organizer.imageSrc} alt="" />
							<PersonName>{organizer.name}</PersonName>
						</Person>
					))}
				</EmeritusRow>
			</Band>
		</Main>
	)
}

//
// Styled Components
//

const Main = styled.main`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
`

const Eyebrow = styled.p`
	margin: 0 0 0.85rem;
	font-family: "Chivo", sans-serif;
	font-size: 0.78rem;
	font-weight: 700;
	letter-spacing: 0.16em;
	text-transform: uppercase;
	color: var(--accent);
`

const Hero = styled.section`
	position: relative;
	width: min(var(--column), calc(100% - 2.5rem));
	display: grid;
	grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
	gap: 3.5rem;
	align-items: end;
	padding: 3.5rem 0 4.5rem;

	&::before {
		content: "";
		position: absolute;
		z-index: -1;
		right: -6%;
		top: -8%;
		width: min(34rem, 70%);
		height: 78%;
		background: radial-gradient(
				circle at 70% 40%,
				color-mix(in srgb, var(--accent-display) 22%, transparent),
				transparent 62%
			),
			radial-gradient(
				circle at 20% 80%,
				color-mix(in srgb, var(--accent-2) 18%, transparent),
				transparent 58%
			);
		pointer-events: none;
	}

	@media (max-width: 900px) {
		grid-template-columns: 1fr;
		gap: 2rem;
		padding: 2.25rem 0 3rem;
	}
`

const HeroCopy = styled.div`
	padding-bottom: 0.5rem;
`

const Headline = styled.h1`
	margin: 0;
	font-family: "Fraunces", "Iowan Old Style", Palatino, serif;
	font-weight: 560;
	font-size: clamp(2.6rem, 5.4vw, 4.6rem);
	line-height: 0.98;
	letter-spacing: -0.035em;
	color: var(--foreground);
`

const Emphasis = styled.em`
	font-style: italic;
	font-weight: 560;
	color: var(--accent-display);
`

const Lead = styled.p`
	margin: 1.35rem 0 0;
	max-width: 34rem;
	font-size: 1.12rem;
	line-height: 1.55;
	color: var(--muted-foreground);
`

const HeroActions = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 0.75rem;
	margin-top: 1.75rem;
`

const HeroVisual = styled.div`
	position: relative;
`

const RoomPhoto = styled.img`
	display: block;
	width: 100%;
	aspect-ratio: 4 / 3;
	object-fit: cover;
	object-position: center 30%;
	border-radius: 1.25rem;
	background: var(--surface-solid);
	box-shadow: 0 18px 40px rgba(27, 18, 12, 0.12);
`

const NextCard = styled.aside`
	position: relative;
	margin: -3.25rem 1rem 0;
	padding: 1.15rem 1.2rem 1.2rem;
	background: var(--surface-solid);
	color: var(--foreground);
	border: 1px solid var(--border);
	border-radius: 1rem;
	box-shadow: 0 18px 40px rgba(27, 18, 12, 0.14);

	@media (max-width: 900px) {
		margin-top: -2.25rem;
	}
`

const NextKicker = styled.p`
	margin: 0;
	font-size: 0.72rem;
	font-weight: 700;
	letter-spacing: 0.14em;
	text-transform: uppercase;
	color: var(--accent);
`

const NextKind = styled.p`
	margin: 0.7rem 0 0;
	font-size: 0.85rem;
	color: var(--subtle-foreground);
`

const NextName = styled.h2`
	margin: 0.15rem 0 0;
	font-family: "Fraunces", "Iowan Old Style", Palatino, serif;
	font-size: 1.45rem;
	font-weight: 560;
	letter-spacing: -0.03em;
	line-height: 1.15;
`

const NextMeta = styled.p`
	margin: 0.55rem 0 0;
	font-size: 0.95rem;
	color: var(--foreground);
`

const MetaDot = styled.span`
	margin: 0 0.4rem;
	color: var(--subtle-foreground);
`

const NextPlace = styled.p`
	margin: 0.15rem 0 0;
	font-size: 0.95rem;
	color: var(--muted-foreground);
`

const NextBlurb = styled.p`
	margin: 0.7rem 0 0.95rem;
	font-size: 0.95rem;
	line-height: 1.5;
	color: var(--muted-foreground);
`

const Band = styled.section`
	width: min(var(--column), calc(100% - 2.5rem));
	padding: 1rem 0 4.5rem;
	scroll-margin-top: 4.5rem;
`

const SectionIntro = styled.div`
	max-width: 38rem;
	margin-bottom: 1.75rem;
`

const SectionTitle = styled.h2`
	margin: 0;
	font-family: "Fraunces", "Iowan Old Style", Palatino, serif;
	font-weight: 560;
	font-size: clamp(1.9rem, 3.6vw, 2.9rem);
	line-height: 1.05;
	letter-spacing: -0.03em;
`

const SectionCopy = styled.p`
	margin: 0.75rem 0 0;
	font-size: 1.05rem;
	line-height: 1.55;
	color: var(--muted-foreground);
`

const BeatList = styled.ol`
	list-style: none;
	margin: 0;
	padding: 0;
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 1.25rem;

	@media (max-width: 800px) {
		grid-template-columns: 1fr;
	}
`

const Beat = styled.li`
	padding: 1.15rem 1rem 0.2rem;
	border-top: 3px solid var(--accent-display);
	background: linear-gradient(180deg, var(--wash), transparent 72%);
`

const BeatTime = styled.p`
	margin: 0;
	font-family: "Fraunces", "Iowan Old Style", Palatino, serif;
	font-size: 1.7rem;
	font-weight: 560;
	letter-spacing: -0.03em;
	color: var(--accent);
`

const BeatTitle = styled.h3`
	margin: 0.3rem 0 0;
	font-family: "Fraunces", "Iowan Old Style", Palatino, serif;
	font-size: 1.35rem;
	font-weight: 560;
	letter-spacing: -0.02em;
`

const BeatCopy = styled.p`
	margin: 0.5rem 0 0;
	color: var(--muted-foreground);
	line-height: 1.5;
`

const FormatBand = styled.section`
	width: 100%;
	display: grid;
	grid-template-columns: 1fr 1fr;
	border-top: 1px solid var(--border);
	border-bottom: 1px solid var(--border);
	background: var(--surface-solid);

	@media (max-width: 800px) {
		grid-template-columns: 1fr;
	}
`

const FormatPanel = styled.article`
	padding: 2.5rem clamp(1.25rem, 4vw, 3.5rem);

	&:first-child {
		background: linear-gradient(160deg, var(--wash), var(--surface-solid) 70%);
	}

	& + & {
		border-left: 1px solid var(--border);
	}

	@media (max-width: 800px) {
		& + & {
			border-left: none;
			border-top: 1px solid var(--border);
		}
	}
`

const FormatEyebrow = styled(Eyebrow)<{ $tone: "orange" | "teal" }>`
	color: ${(props) => (props.$tone === "teal" ? "var(--accent-2)" : "var(--accent)")};
`

const FormatName = styled.h2`
	margin: 0;
	font-family: "Fraunces", "Iowan Old Style", Palatino, serif;
	font-weight: 560;
	font-size: clamp(1.7rem, 3vw, 2.45rem);
	letter-spacing: -0.03em;
	line-height: 1.05;
`

const FormatWhere = styled.p`
	margin: 0.65rem 0 0;
	font-weight: 650;
	color: var(--foreground);
`

const FormatCopy = styled.p`
	margin: 0.65rem 0 0;
	max-width: 34rem;
	color: var(--muted-foreground);
	line-height: 1.55;
`

const BeliefGrid = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 1.25rem 2rem;

	@media (max-width: 800px) {
		grid-template-columns: 1fr;
	}
`

const BeliefCard = styled.article`
	padding-top: 0.9rem;
	border-top: 1px solid var(--border);
`

const BeliefTitle = styled.h3`
	margin: 0;
	font-family: "Fraunces", "Iowan Old Style", Palatino, serif;
	font-size: 1.3rem;
	font-weight: 560;
	letter-spacing: -0.02em;
	line-height: 1.2;
`

const BeliefCopy = styled.p`
	margin: 0.45rem 0 0;
	color: var(--muted-foreground);
	line-height: 1.5;
`

const UpcomingBand = styled.section`
	width: min(var(--column), calc(100% - 2.5rem));
	padding: 0.5rem 0 4.5rem;
	scroll-margin-top: 4.5rem;
`

const UpcomingHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: flex-end;
	gap: 1.5rem;
	margin-bottom: 1.25rem;

	@media (max-width: 700px) {
		flex-direction: column;
		align-items: flex-start;
	}
`

const UpcomingList = styled.div`
	display: flex;
	flex-direction: column;
	border-top: 1px solid var(--border);
`

const UpcomingName = styled.p`
	margin: 0.15rem 0 0;
	font-family: "Fraunces", "Iowan Old Style", Palatino, serif;
	font-size: 1.2rem;
	font-weight: 560;
	letter-spacing: -0.02em;
	line-height: 1.25;
`

const UpcomingItem = styled.a`
	display: grid;
	grid-template-columns: minmax(11rem, 16rem) minmax(0, 1fr) minmax(10rem, 16rem);
	gap: 1rem;
	align-items: center;
	padding: 1.1rem 0.2rem;
	border-bottom: 1px solid var(--border);
	text-decoration: none;
	color: inherit;

	&:hover ${UpcomingName} {
		color: var(--accent);
	}

	@media (max-width: 800px) {
		grid-template-columns: 1fr;
		gap: 0.25rem;
		padding: 1rem 0;
	}
`

const UpcomingWhen = styled.div`
	display: flex;
	flex-direction: column;
`

const UpcomingDay = styled.span`
	font-weight: 650;
`

const UpcomingTime = styled.span`
	color: var(--subtle-foreground);
	font-size: 0.92rem;
`

const UpcomingBody = styled.div`
	min-width: 0;
`

const UpcomingKind = styled.p`
	margin: 0;
	font-size: 0.75rem;
	font-weight: 700;
	letter-spacing: 0.12em;
	text-transform: uppercase;
	color: var(--accent-2);
`

const UpcomingPlace = styled.p`
	margin: 0;
	text-align: right;
	color: var(--muted-foreground);

	@media (max-width: 800px) {
		text-align: left;
	}
`

const Empty = styled.p`
	margin: 0;
	color: var(--muted-foreground);
`

const PeopleGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(4, minmax(0, 1fr));
	gap: 1.25rem 1rem;

	@media (max-width: 900px) {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	@media (max-width: 640px) {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
`

const Person = styled.a`
	display: flex;
	flex-direction: column;
	gap: 0.55rem;
	text-decoration: none;
	color: inherit;

	&:hover {
		color: var(--accent);
	}
`

const PersonPhoto = styled.img`
	width: 100%;
	aspect-ratio: 1;
	object-fit: cover;
	border-radius: 0.9rem;
	background: var(--surface-solid);
`

const PersonName = styled.span`
	font-size: 0.95rem;
	font-weight: 600;
	line-height: 1.3;
`

const EmeritusLabel = styled.p`
	margin: 2rem 0 0.8rem;
	font-size: 0.78rem;
	font-weight: 700;
	letter-spacing: 0.14em;
	text-transform: uppercase;
	color: var(--subtle-foreground);
`

const EmeritusRow = styled.div`
	display: grid;
	grid-template-columns: repeat(4, minmax(0, 1fr));
	gap: 1.25rem 1rem;

	@media (max-width: 900px) {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	@media (max-width: 640px) {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
`
