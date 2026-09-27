"use client"
import { styled } from "styled-components"
import { Button } from "../components/Button"
import { WaysToShowUp } from "../components/WaysToShowUp"
import { afternoon, beliefs, missionLead } from "../content/community"
import type { PublicGathering } from "../content/gatherings"
import { siteConfig } from "../siteConfig"

//
// Components
//

export function WhoWeAre({ upcoming }: { upcoming: PublicGathering[] }) {
	return (
		<Main>
			<Story>
				<Eyebrow>Who we are</Eyebrow>
				<Mission>{missionLead}</Mission>
				<Purpose>{siteConfig.description}</Purpose>
			</Story>

			<Band>
				<SectionIntro>
					<Eyebrow>Why we gather</Eyebrow>
					<SectionTitle>To learn from each other, and to build beside each other.</SectionTitle>
				</SectionIntro>
				<BeliefGrid>
					{beliefs.map((belief) => (
						<Belief key={belief.title}>
							<BeliefTitle>{belief.title}</BeliefTitle>
							<BeliefCopy>{belief.copy}</BeliefCopy>
						</Belief>
					))}
				</BeliefGrid>
			</Band>

			<Band>
				<SectionIntro>
					<Eyebrow>How a Saturday goes</Eyebrow>
					<SectionTitle>Lunch, then the room teaches itself.</SectionTitle>
					<SectionCopy>
						You meet someone before anyone presents, and you still have time to build after.
					</SectionCopy>
				</SectionIntro>
				<BeatList>
					{afternoon.map((beat) => (
						<Beat key={beat.time}>
							<BeatTime>{beat.time}</BeatTime>
							<BeatTitle>{beat.title}</BeatTitle>
							<BeatCopy>{beat.copy}</BeatCopy>
						</Beat>
					))}
				</BeatList>
			</Band>

			<WaysFrame>
				<WaysToShowUp gatherings={upcoming} linksOnly />
			</WaysFrame>

			<Close>
				<SectionTitle>Come sit down.</SectionTitle>
				<Purpose>{beliefs[3].copy}</Purpose>
				<Button href="/events" variant="primary" size="default">
					See the calendar
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

const Eyebrow = styled.p`
	margin: 0 0 0.55rem;
	font-family: "Chivo", sans-serif;
	font-size: 0.72rem;
	font-weight: 700;
	letter-spacing: 0.14em;
	text-transform: uppercase;
	color: var(--accent);
`

const Story = styled.section`
	width: min(var(--column), calc(100% - 2.5rem));
	padding: 3.25rem 0 0.5rem;
`

const Mission = styled.h1`
	margin: 0;
	max-width: 18em;
	font-family: "Fraunces", "Iowan Old Style", Palatino, serif;
	font-weight: 560;
	font-size: clamp(1.9rem, 3.5vw, 2.9rem);
	line-height: 1.18;
	letter-spacing: -0.03em;
	color: var(--foreground);
`

const Purpose = styled.p`
	margin: 1rem 0 0;
	max-width: 36rem;
	font-size: 1.05rem;
	line-height: 1.55;
	color: var(--muted-foreground);
`

const Band = styled.section`
	width: min(var(--column), calc(100% - 2.5rem));
	padding: 2.5rem 0 0.5rem;
`

const SectionIntro = styled.div`
	max-width: 36rem;
	margin-bottom: 1.25rem;
`

const SectionTitle = styled.h2`
	margin: 0;
	font-family: "Fraunces", "Iowan Old Style", Palatino, serif;
	font-weight: 560;
	font-size: clamp(1.45rem, 2.2vw, 1.9rem);
	line-height: 1.15;
	letter-spacing: -0.03em;
`

const SectionCopy = styled.p`
	margin: 0.55rem 0 0;
	font-size: 1.02rem;
	line-height: 1.55;
	color: var(--muted-foreground);
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

const BeliefCopy = styled.p`
	margin: 0.55rem 0 0;
	color: var(--muted-foreground);
	line-height: 1.55;
`

const BeatList = styled.ol`
	list-style: none;
	margin: 0;
	padding: 0;
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 1.25rem;
	border-top: 1px solid var(--border);

	@media (max-width: 800px) {
		grid-template-columns: 1fr;
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

const BeatCopy = styled.p`
	margin: 0.55rem 0 0;
	color: var(--muted-foreground);
	line-height: 1.55;
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
