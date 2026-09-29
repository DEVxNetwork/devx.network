"use client"
import { styled } from "styled-components"
import { Button } from "../components/Button"
import { WaysToShowUp } from "../components/WaysToShowUp"
import { afternoon, beliefs, missionLead } from "../content/community"
import type { PublicGathering } from "../content/gatherings"

//
// Components
//

export function WhoWeAre({ upcoming }: { upcoming: PublicGathering[] }) {
	return (
		<Main>
			<Story>
				<Mission>The room teaches itself.</Mission>
				<Purpose>{missionLead}</Purpose>
				<RoomPhoto
					src="/images/weekend-function-talk.webp"
					alt="A Weekend Function talk, the room facing a speaker"
				/>
			</Story>

			<Band>
				<BeliefGrid>
					{beliefs.map((belief) => (
						<Belief key={belief.title}>
							<BeliefTitle>{belief.title}</BeliefTitle>
						</Belief>
					))}
				</BeliefGrid>
			</Band>

			<Band>
				<SectionTitle>A Saturday</SectionTitle>
				<BeatList>
					{afternoon.map((beat) => (
						<Beat key={beat.time}>
							<BeatTime>{beat.time}</BeatTime>
							<BeatTitle>{beat.title}</BeatTitle>
						</Beat>
					))}
				</BeatList>
			</Band>

			<WaysFrame>
				<WaysToShowUp gatherings={upcoming} />
			</WaysFrame>

			<Close>
				<SectionTitle>Come sit down.</SectionTitle>
				<Purpose>Free to get in. Lunch is on us.</Purpose>
				<Button href="/events" variant="primary" size="default">
					See what's next
				</Button>
			</Close>
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

const Story = styled.section`
	width: min(var(--column), calc(100% - 2.5rem));
	padding: 3.25rem 0 0.5rem;
`

const Mission = styled.h1`
	margin: 0;
	max-width: 11ch;
	font-family: "Fraunces", "Iowan Old Style", Palatino, serif;
	font-weight: 560;
	font-size: clamp(3rem, 7vw, 5.4rem);
	line-height: 0.92;
	letter-spacing: -0.04em;
	color: var(--foreground);
`

const Purpose = styled.p`
	margin: 1rem 0 0;
	max-width: 36rem;
	font-size: 1.15rem;
	line-height: 1.45;
	color: var(--muted-foreground);
`

const RoomPhoto = styled.img`
	display: block;
	width: 100%;
	aspect-ratio: 16 / 9;
	object-fit: cover;
	object-position: center 62%;
	margin-top: 1.75rem;
	border-radius: 1.25rem;
	background: var(--wash);
`

const Band = styled.section`
	width: min(var(--column), calc(100% - 2.5rem));
	padding: 2.5rem 0 0.5rem;
`

const SectionTitle = styled.h2`
	margin: 0;
	font-family: "Fraunces", "Iowan Old Style", Palatino, serif;
	font-weight: 560;
	font-size: clamp(1.45rem, 2.2vw, 1.9rem);
	line-height: 1.15;
	letter-spacing: -0.03em;
`

const BeliefGrid = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 1.15rem 2rem;

	@media (max-width: 800px) {
		grid-template-columns: 1fr;
	}
`

const Belief = styled.article`
	padding-top: 1rem;
	border-top: 1px solid var(--border);
`

const BeliefTitle = styled.h3`
	margin: 0;
	font-family: "Fraunces", "Iowan Old Style", Palatino, serif;
	font-size: 1.2rem;
	font-weight: 560;
	letter-spacing: -0.02em;
	line-height: 1.25;
`

const BeatList = styled.ol`
	list-style: none;
	margin: 1.25rem 0 0;
	padding: 0;
	display: grid;
	grid-template-columns: repeat(4, minmax(0, 1fr));
	gap: 1.25rem;
	border-top: 1px solid var(--border);

	@media (max-width: 800px) {
		grid-template-columns: 1fr 1fr;
	}
`

const Beat = styled.li`
	padding-top: 1.25rem;
	border-top: 1px solid var(--border);
	margin-top: -1px;
`

const BeatTime = styled.p`
	margin: 0;
	font-family: "Fraunces", "Iowan Old Style", Palatino, serif;
	font-size: 1.35rem;
	font-weight: 560;
	letter-spacing: -0.03em;
	color: var(--accent);
`

const BeatTitle = styled.h3`
	margin: 0.2rem 0 0;
	font-family: "Fraunces", "Iowan Old Style", Palatino, serif;
	font-size: 1.15rem;
	font-weight: 560;
	letter-spacing: -0.02em;
`

const WaysFrame = styled.div`
	width: min(var(--column), calc(100% - 2.5rem));
`

const Close = styled.section`
	width: min(var(--column), calc(100% - 2.5rem));
	padding: 2.5rem 0 3rem;
	border-top: 1px solid var(--border);
	margin-top: 2.5rem;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 0.25rem;
`
