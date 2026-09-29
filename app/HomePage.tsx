"use client"
import { keyframes, styled } from "styled-components"
import { Button } from "./components/Button"
import { GatheringShowcase } from "./components/GatheringShowcase"
import { HomeHero } from "./components/HomeHero"
import type { PublicGathering } from "./content/gatherings"
import { gatheringOpensNewTab } from "./content/gatherings"
import { organizers } from "./info/organizers"

//
// Types
//

type HomePageProps = {
	gatherings: PublicGathering[]
}

type Portrait = {
	src: string
	size: number
	x: number
	y: number
	z: number
	mobileSize: number
	mobileX: number
	mobileY: number
}

type AvatarHoverMotion = {
	duration: number
	delay: number
	driftX: number
	driftY: number
}

//
// Constants
//

const wordmarkFont = `"Chivo", sans-serif`

// Harbor elevation: convention sails, the Hyatt pair, Emerald's crystal crown,
// Symphony Towers, and the pyramid top of One America Plaza.
const skylinePath = `
	M0 260
	V216 H40 V202 H78 V218 H112
	C148 218 162 184 184 154
	C198 136 214 176 232 206
	C268 216 292 164 324 128
	C344 108 368 156 392 198
	H454 V216
	H498 V184 H540 V202 H586 V156 H632 V216
	H676 V108 H734 V216
	H746 V120 H802 V216
	H848 V146 H872 L900 118 L928 146 H956 V216
	H1004 V96 H1056 V80 H1108 V96 H1168 V216
	H1224 V86
	L1256 34
	L1288 86
	V216
	H1336 V140 H1384 V216
	H1416 V168 H1462 V216
	H1496 V192 H1540 V216
	H1600 V260 Z
`

const portraits: Portrait[] = [
	{
		src: "/images/community/portrait-01.jpg",
		size: 6.2,
		x: 2,
		y: 0,
		z: 4,
		mobileSize: 4.2,
		mobileX: 0,
		mobileY: 0
	},
	{
		src: "/images/community/portrait-02.jpg",
		size: 4.4,
		x: 40,
		y: 2,
		z: 4,
		mobileSize: 3.4,
		mobileX: 16,
		mobileY: 2
	},
	{
		src: "/images/community/portrait-03.jpg",
		size: 3.6,
		x: 70,
		y: 0,
		z: 3,
		mobileSize: 4,
		mobileX: 32,
		mobileY: 0
	},
	{
		src: "/images/community/portrait-04.jpg",
		size: 5,
		x: 16,
		y: 24,
		z: 5,
		mobileSize: 3.3,
		mobileX: 50,
		mobileY: 4
	},
	{
		src: "/images/community/portrait-05.jpg",
		size: 4.2,
		x: 52,
		y: 22,
		z: 4,
		mobileSize: 4.1,
		mobileX: 64,
		mobileY: 0
	},
	{
		src: "/images/community/portrait-06.jpg",
		size: 3.4,
		x: 72,
		y: 20,
		z: 5,
		mobileSize: 3.5,
		mobileX: 78,
		mobileY: 3
	},
	{
		src: "/images/community/portrait-07.jpg",
		size: 5.6,
		x: 0,
		y: 48,
		z: 4,
		mobileSize: 3.4,
		mobileX: 6,
		mobileY: 24
	},
	{
		src: "/images/community/portrait-08.jpg",
		size: 4.5,
		x: 34,
		y: 46,
		z: 5,
		mobileSize: 4.2,
		mobileX: 20,
		mobileY: 22
	},
	{
		src: "/images/community/portrait-09.jpg",
		size: 3.8,
		x: 66,
		y: 50,
		z: 4,
		mobileSize: 3.3,
		mobileX: 40,
		mobileY: 26
	},
	{
		src: "/images/community/portrait-10.jpg",
		size: 5.2,
		x: 6,
		y: 72,
		z: 5,
		mobileSize: 4,
		mobileX: 54,
		mobileY: 22
	},
	{
		src: "/images/community/portrait-11.jpg",
		size: 4,
		x: 44,
		y: 74,
		z: 4,
		mobileSize: 3.5,
		mobileX: 70,
		mobileY: 24
	},
	{
		src: "/images/community/portrait-12.jpg",
		size: 3.5,
		x: 74,
		y: 72,
		z: 3,
		mobileSize: 3.2,
		mobileX: 82,
		mobileY: 26
	},
	{
		src: "/images/community/portrait-13.jpg",
		size: 3.2,
		x: 28,
		y: 2,
		z: 1,
		mobileSize: 4,
		mobileX: 0,
		mobileY: 46
	},
	{
		src: "/images/community/portrait-14.jpg",
		size: 3.3,
		x: 56,
		y: 0,
		z: 1,
		mobileSize: 3.4,
		mobileX: 16,
		mobileY: 48
	},
	{
		src: "/images/community/portrait-15.jpg",
		size: 2.8,
		x: 82,
		y: 6,
		z: 1,
		mobileSize: 4.2,
		mobileX: 32,
		mobileY: 44
	},
	{
		src: "/images/community/portrait-16.jpg",
		size: 3.2,
		x: 0,
		y: 28,
		z: 1,
		mobileSize: 3.3,
		mobileX: 52,
		mobileY: 48
	},
	{
		src: "/images/community/portrait-17.jpg",
		size: 3.6,
		x: 36,
		y: 28,
		z: 1,
		mobileSize: 3.8,
		mobileX: 66,
		mobileY: 46
	},
	{
		src: "/images/community/portrait-18.jpg",
		size: 3,
		x: 78,
		y: 32,
		z: 1,
		mobileSize: 3.5,
		mobileX: 80,
		mobileY: 48
	},
	{
		src: "/images/community/portrait-19.jpg",
		size: 3.1,
		x: 20,
		y: 50,
		z: 1,
		mobileSize: 3.6,
		mobileX: 4,
		mobileY: 68
	},
	{
		src: "/images/community/portrait-20.jpg",
		size: 3,
		x: 52,
		y: 46,
		z: 1,
		mobileSize: 4.1,
		mobileX: 20,
		mobileY: 66
	},
	{
		src: "/images/community/portrait-21.jpg",
		size: 3.2,
		x: 30,
		y: 62,
		z: 1,
		mobileSize: 3.4,
		mobileX: 40,
		mobileY: 70
	},
	{
		src: "/images/community/portrait-22.jpg",
		size: 3,
		x: 60,
		y: 64,
		z: 1,
		mobileSize: 4,
		mobileX: 54,
		mobileY: 66
	},
	{
		src: "/images/community/portrait-23.jpg",
		size: 3.1,
		x: 36,
		y: 84,
		z: 1,
		mobileSize: 3.5,
		mobileX: 70,
		mobileY: 68
	},
	{
		src: "/images/community/portrait-24.jpg",
		size: 3.2,
		x: 80,
		y: 78,
		z: 1,
		mobileSize: 3.2,
		mobileX: 82,
		mobileY: 70
	}
]

const avatarHover = keyframes`
	from {
		transform: translate(0, 0);
	}
	to {
		transform: translate(var(--drift-x), var(--drift-y));
	}
`

//
// Components
//

export function HomePage({ gatherings }: HomePageProps) {
	const nextEvent = gatherings[0]
	const nextEventLink = nextEvent ? nextEvent.href : "/events"
	const nextExternal = nextEvent ? gatheringOpensNewTab(nextEvent) : false

	return (
		<>
			<Main>
				<HomeHero nextEventLink={nextEventLink} nextExternal={nextExternal} />

				<Statement>
					<Skyline viewBox="0 0 1600 260" aria-hidden="true">
						<path d={skylinePath} />
					</Skyline>
					<StatementInner>
						<StatementLead>
							San Diego
							<br />
							is full of <Mark>life.</Mark>
						</StatementLead>
						<AvatarField aria-hidden="true">
							{portraits.map((portrait, index) => {
								const motion = avatarHoverMotion(index)
								return (
									<Avatar
										key={portrait.src}
										src={portrait.src}
										alt=""
										$size={portrait.size}
										$x={portrait.x}
										$y={portrait.y}
										$z={portrait.z}
										$mSize={portrait.mobileSize}
										$mX={portrait.mobileX}
										$mY={portrait.mobileY}
										$duration={motion.duration}
										$delay={motion.delay}
										$driftX={motion.driftX}
										$driftY={motion.driftY}
									/>
								)
							})}
						</AvatarField>
						<StatementBody>
							<StatementLine>
								It's our belief that people from all industries have something to add to the
								technology conversation. Whether you're simply using Lovable to build your website
								or developing leading AI harness memory infra,{" "}
								<Highlight>everyone has something to add to the conversation.</Highlight>
							</StatementLine>
						</StatementBody>
					</StatementInner>
				</Statement>

				<GatheringShowcase />

				<ContentSection>
					<SectionTitle $center>The people behind DEVx</SectionTitle>
					<OrganizerQuote>
						How many devs does it take to screw in a light bulb? Well, apparently{" "}
						{organizers.length}&nbsp;volunteers
					</OrganizerQuote>
					<OrganizerGrid>
						{organizers.map((organizer) => (
							<OrganizerCard
								key={organizer.name}
								href={organizer.linkedIn}
								target="_blank"
								rel="noopener noreferrer"
							>
								<OrganizerImage src={organizer.imageSrc} alt={organizer.name} />
								<OrganizerName>{organizer.name}</OrganizerName>
								<OrganizerRole>{organizer.role}</OrganizerRole>
								<LinkedInIcon
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									aria-hidden="true"
								>
									<path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
								</LinkedInIcon>
							</OrganizerCard>
						))}
					</OrganizerGrid>
				</ContentSection>

				<JoinSection>
					<JoinPanel>
						<SectionTitle $center>Join us at the next event</SectionTitle>
						<JoinText>
							Free to attend, open to every skill level. Come meet the San Diego developer
							community.
						</JoinText>
						<JoinActions>
							<Button
								href={nextEventLink}
								target={nextExternal ? "_blank" : undefined}
								rel={nextExternal ? "noopener noreferrer" : undefined}
								variant="primary"
								size="default"
							>
								Join the Next Event
							</Button>
							<Button href="/speak" variant="secondary" size="default">
								Speak at an Event
							</Button>
						</JoinActions>
					</JoinPanel>
				</JoinSection>
			</Main>
		</>
	)
}

const Main = styled.main`
	position: relative;
	z-index: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
`

const Statement = styled.section`
	position: relative;
	box-sizing: border-box;
	width: 100%;
	overflow: hidden;
	background: var(--wash);
	border-bottom: 1px solid var(--border);
`

const Skyline = styled.svg`
	position: absolute;
	left: 50%;
	bottom: 0;
	z-index: 0;
	width: 140%;
	height: auto;
	transform: translateX(-50%);
	fill: currentColor;
	color: var(--foreground);
	opacity: 0.065;
	pointer-events: none;

	@media (max-width: 800px) {
		width: 230%;
	}
`

const StatementInner = styled.div`
	width: min(68rem, calc(100% - 2.5rem));
	margin: 0 auto;
	position: relative;
	z-index: 1;
	padding: 6.5rem 0 8rem;
	display: grid;
	grid-template-columns: minmax(0, 1.45fr) minmax(16rem, 0.72fr);
	grid-template-areas:
		"lead faces"
		"body faces";
	column-gap: 1.25rem;
	row-gap: 1.35rem;
	align-items: start;

	@media (max-width: 800px) {
		grid-template-columns: 1fr;
		grid-template-areas:
			"lead"
			"faces"
			"body";
		row-gap: 1.25rem;
		padding: 4.5rem 0 6rem;
	}
`

const StatementLead = styled.h2`
	grid-area: lead;
	margin: 0;
	max-width: 11ch;
	font-family: var(--font-display);
	font-weight: 560;
	font-size: clamp(3rem, 7vw, 5.4rem);
	line-height: 0.92;
	letter-spacing: -0.04em;
	color: var(--foreground);
`

const Mark = styled.span`
	background-image: linear-gradient(var(--extrusion), var(--extrusion));
	background-repeat: no-repeat;
	background-position: 0 92%;
	background-size: 100% 0.11em;
`

const Highlight = styled.span`
	background: var(--accent);
	color: var(--accent-contrast);
	padding: 0.08em 0.28em;
	border-radius: 0.12em;
	box-decoration-break: clone;
	-webkit-box-decoration-break: clone;
`

const StatementLine = styled.p`
	margin: 1.35rem 0 0;
	font-size: 1.15rem;
	line-height: 1.4;
	color: var(--muted-foreground);
`

const StatementBody = styled.div`
	grid-area: body;

	> ${StatementLine} {
		margin-top: 0;
	}
`

const AvatarField = styled.div`
	grid-area: faces;
	position: relative;
	align-self: stretch;
	min-height: 22rem;

	@media (max-width: 800px) {
		min-height: 18rem;
	}
`

const Avatar = styled.img<{
	$size: number
	$x: number
	$y: number
	$z: number
	$mSize: number
	$mX: number
	$mY: number
	$duration: number
	$delay: number
	$driftX: number
	$driftY: number
}>`
	position: absolute;
	box-sizing: border-box;
	width: ${(props) => props.$size}rem;
	height: ${(props) => props.$size}rem;
	left: ${(props) => props.$x}%;
	top: ${(props) => props.$y}%;
	z-index: ${(props) => props.$z};
	object-fit: cover;
	border-radius: 50%;
	border: 3px solid var(--wash);
	background: var(--border);
	box-shadow: ${(props) =>
		props.$z === 1 ? "0 6px 14px rgba(0, 0, 0, 0.1)" : "0 10px 22px rgba(0, 0, 0, 0.14)"};
	--drift-x: ${(props) => props.$driftX}rem;
	--drift-y: ${(props) => props.$driftY}rem;
	animation: ${avatarHover} ${(props) => props.$duration}s ease-in-out ${(props) => props.$delay}s
		infinite alternate;

	@media (prefers-reduced-motion: reduce) {
		animation: none;
	}

	@media (max-width: 800px) {
		display: ${(props) => (props.$mSize === 0 ? "none" : "block")};
		width: ${(props) => props.$mSize}rem;
		height: ${(props) => props.$mSize}rem;
		left: ${(props) => props.$mX}%;
		top: ${(props) => props.$mY}%;
	}
`

const OrganizerQuote = styled.blockquote`
	margin: -0.75rem auto 0.5rem;
	padding: 0;
	max-width: 48rem;
	font-size: 1.05rem;
	font-style: italic;
	line-height: 1.5;
	text-align: center;
	color: var(--muted-foreground);
`

const SectionTitle = styled.h2<{ $center?: boolean }>`
	font-family: ${wordmarkFont};
	font-size: clamp(1.75rem, 4vw, 2.75rem);
	font-weight: 800;
	margin: 0 0 1.5rem 0;
	color: var(--foreground);
	text-align: ${(props) => (props.$center ? "center" : "left")};
	max-width: 720px;
	${(props) => props.$center && "margin-left: auto; margin-right: auto;"}
`

const ContentSection = styled.section`
	box-sizing: border-box;
	width: 100%;
	max-width: 1200px;
	padding: 3rem 1.5rem 5rem;
	display: flex;
	flex-direction: column;
	align-items: center;

	@media (max-width: 768px) {
		padding: 2rem 1.5rem 3rem;
	}
`

const OrganizerGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	gap: 1.5rem;
	width: 100%;
	margin-top: 1rem;

	@media (max-width: 768px) {
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.65rem;
	}
`

const OrganizerCard = styled.a`
	background-color: var(--surface-solid);
	border: 1px solid var(--border);
	padding: 2.5rem 1.5rem;
	border-radius: 1rem;
	text-align: left;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: flex-start;
	text-decoration: none;
	color: inherit;
	cursor: pointer;
	transition:
		transform 0.2s ease,
		box-shadow 0.2s ease;

	&:hover {
		transform: translateY(-4px);
		box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
	}

	@media (max-width: 768px) {
		padding: 0.85rem 0.55rem;
		border-radius: 0.75rem;
	}
`

const OrganizerImage = styled.img`
	box-sizing: border-box;
	width: 100%;
	aspect-ratio: 1;
	object-fit: cover;
	border-radius: 50%;
	margin: 0 0 1rem;
	border: 3px solid var(--border);

	@media (max-width: 768px) {
		margin-bottom: 0.55rem;
		border-width: 2px;
	}
`

const OrganizerName = styled.h3`
	font-family: ${wordmarkFont};
	font-size: 1.1rem;
	font-weight: 700;
	line-height: 1.25;
	margin: 0;
	color: var(--foreground);

	@media (max-width: 768px) {
		font-size: 0.8rem;
	}
`

const OrganizerRole = styled.p`
	margin: 0.4rem 0 0;
	max-width: 16rem;
	font-size: 0.85rem;
	line-height: 1.35;
	color: var(--muted-foreground);

	@media (max-width: 768px) {
		margin-top: 0.25rem;
		font-size: 0.68rem;
		line-height: 1.3;
	}
`

const LinkedInIcon = styled.svg`
	height: 1.5rem;
	width: 1.5rem;
	fill: var(--subtle-foreground);
	margin-top: auto;
	padding-top: 0.75rem;

	@media (max-width: 768px) {
		width: 1.05rem;
		height: 1.05rem;
		padding-top: 0.45rem;
	}
`

const JoinSection = styled.section`
	box-sizing: border-box;
	width: 100%;
	max-width: 1200px;
	padding: 1rem 1.5rem 6rem;
`

const JoinPanel = styled.div`
	background-color: var(--surface-solid);
	border: 1px solid var(--border);
	border-radius: 1.5rem;
	padding: 4.5rem 2rem;
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;

	@media (max-width: 768px) {
		padding: 3rem 1.5rem;
	}
`

const JoinText = styled.p`
	font-size: 1.1rem;
	color: var(--muted-foreground);
	max-width: 480px;
	margin: 0 0 2rem 0;
`

const JoinActions = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 0.75rem;
	justify-content: center;
`

//
// Functions
//

// Periods stay out of step so neighboring bubbles never lift on the same beat.
function avatarHoverMotion(index: number): AvatarHoverMotion {
	const duration = round2(3.8 + ((index * 5) % 11) * 0.26)
	const delay = round2(-((index * 1.37) % duration))
	const driftX = round2(((index % 7) - 3) * 0.045)
	const driftY = round2(-(0.32 + (index % 5) * 0.08))
	return { duration, delay, driftX, driftY }
}

function round2(value: number): number {
	return Math.round(value * 100) / 100
}
