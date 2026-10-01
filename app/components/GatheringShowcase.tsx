"use client"
import { useEffect, useState } from "react"
import type { FocusEvent } from "react"
import { keyframes, styled } from "styled-components"

//
// Types
//

type Beat = {
	time: string
	title: string
	shot: number
}

type Shot = {
	image: string
	position: string
}

type PauseHandlers = {
	onMouseEnter: () => void
	onMouseLeave: () => void
	onFocus: () => void
	onBlur: (event: FocusEvent<HTMLElement>) => void
}

//
// Constants
//

const wordmarkFont = `"Chivo", sans-serif`
const eventsHref = "/events"

const beatMs = 2800
const paperMs = 3400

const monthlyShots: Shot[] = [
	{ image: "/images/slides/slide5.webp", position: "center 58%" },
	{ image: "/images/weekend-function-talk.webp", position: "center 42%" },
	{ image: "/images/slides/slide2.webp", position: "center 46%" }
]

const monthlyBeats: Beat[] = [
	{ time: "12pm", title: "Lunch", shot: 0 },
	{ time: "1:30pm", title: "Presentation", shot: 1 },
	{ time: "2:30pm", title: "Free-form", shot: 2 },
	{ time: "4pm", title: "Close", shot: 0 }
]

const paperTitles = [
	"World Models",
	"Ethical pluralism",
	"Hierarchical VLAs",
	"Zero-shot video models"
]

const coroutine = {
	name: "DEVx Co-routine",
	copy: "Weekly Friday casual co-working events",
	image: "/images/slides/slide4.webp",
	position: "center 45%",
	places: ["Moniker", "Communal", "Treehouse", "Ansir", "Portal", "The Consultancy"]
}

const drift = keyframes`
	from {
		transform: scale(1);
	}
	to {
		transform: scale(1.08) translate3d(-1.5%, -1.5%, 0);
	}
`

const pan = keyframes`
	from {
		object-position: 18% center;
	}
	to {
		object-position: 82% center;
	}
`

const tickerMove = keyframes`
	from {
		transform: translateX(0);
	}
	to {
		transform: translateX(-50%);
	}
`

const sheetIn = keyframes`
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
`

const motionOff = `
	@media (prefers-reduced-motion: reduce) {
		animation: none;
	}
`

//
// Components
//

export function GatheringShowcase() {
	return (
		<Section id="meetups" aria-labelledby="our-events-title">
			<SectionTitle id="our-events-title">Our Events</SectionTitle>
			<CollageGrid>
				<MonthlyCard />
				<PaperCard />
				<Ticket />
			</CollageGrid>
		</Section>
	)
}

function MonthlyCard() {
	const [paused, setPaused] = useState(false)
	const index = useCycle(monthlyBeats.length, beatMs, paused)
	const shot = monthlyBeats[index].shot

	return (
		<FillLink href={eventsHref} {...pauseHandlers(setPaused)}>
			{monthlyShots.map((frame, frameIndex) => (
				<ZoomPhoto
					key={frame.image}
					src={frame.image}
					alt=""
					$position={frame.position}
					$paused={paused}
					$on={frameIndex === shot}
				/>
			))}
			<Schedule>
				{monthlyBeats.map((beat, beatIndex) => (
					<ScheduleRow key={beat.time} $active={beatIndex === index}>
						<ScheduleTime>{beat.time}</ScheduleTime>
						<span>{beat.title}</span>
					</ScheduleRow>
				))}
			</Schedule>
			<MonthlyCaption>
				<Name>DEVx Monthly</Name>
				<Copy>Presentations, speakers, and social hour. Every third Saturday of the month.</Copy>
			</MonthlyCaption>
		</FillLink>
	)
}

function PaperCard() {
	const [paused, setPaused] = useState(false)
	const index = useCycle(paperTitles.length, paperMs, paused)
	const front = paperTitles[index]
	const mid = paperTitles[(index + 1) % paperTitles.length]
	const back = paperTitles[(index + 2) % paperTitles.length]

	return (
		<PaperLink href={eventsHref} {...pauseHandlers(setPaused)}>
			<PaperFrame>
				<ZoomPhoto
					src="/images/paper-club.webp"
					alt=""
					$position="center 62%"
					$paused={paused}
					$on
				/>
				<Shade />
				<PaperCaption>
					<Name>DEVx Paper Club</Name>
					<Copy>Discuss leading AI research papers</Copy>
				</PaperCaption>
				<Pile>
					<Leaf $tilt={4} $offset="-0.7rem, -0.85rem">
						<LeafTitle>{back}</LeafTitle>
					</Leaf>
					<Leaf $tilt={1} $offset="-0.32rem, -0.4rem">
						<LeafTitle>{mid}</LeafTitle>
					</Leaf>
					<Leaf key={front} $tilt={-3} $offset="0, 0" $front>
						<LeafTitle>{front}</LeafTitle>
					</Leaf>
				</Pile>
			</PaperFrame>
		</PaperLink>
	)
}

function Ticket() {
	const [paused, setPaused] = useState(false)

	return (
		<TicketLink href={eventsHref} {...pauseHandlers(setPaused)}>
			<TicketBody>
				<InkName>{coroutine.name}</InkName>
				<InkCopy>{coroutine.copy}</InkCopy>
				<Ticker places={coroutine.places} paused={paused} />
			</TicketBody>
			<TicketPhoto>
				<PanPhoto src={coroutine.image} alt="" $position={coroutine.position} $paused={paused} />
			</TicketPhoto>
		</TicketLink>
	)
}

function Ticker({ places, paused }: { places: string[]; paused: boolean }) {
	const reduce = useReducedMotion()
	if (reduce) return <TickerStatic>{places.join(" · ")}</TickerStatic>

	const loop = [...places, ...places]
	return (
		<TickerBar aria-hidden="true">
			<TickerTrack $paused={paused}>
				{loop.map((place, index) => (
					<TickerItem key={`${place}-${index}`}>
						{place}
						<TickerDot />
					</TickerItem>
				))}
			</TickerTrack>
		</TickerBar>
	)
}

const Section = styled.section`
	box-sizing: border-box;
	width: 100%;
	padding: 3rem 0 2.5rem;
	overflow: visible;
`

const SectionTitle = styled.h2`
	box-sizing: border-box;
	width: min(100% - 6rem, 70rem);
	margin: 0 auto 1.5rem;
	font-family: ${wordmarkFont};
	font-size: clamp(1.75rem, 4vw, 2.75rem);
	font-weight: 800;
	line-height: 1.1;
	text-align: center;
	color: var(--foreground);

	@media (max-width: 800px) {
		width: min(100% - 2.5rem, 28rem);
	}
`

const CollageGrid = styled.div`
	box-sizing: border-box;
	display: grid;
	grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.95fr);
	grid-template-rows: minmax(0, 1.05fr) minmax(0, 0.9fr);
	gap: 1rem;
	width: min(100% - 6rem, 70rem);
	height: clamp(32rem, 68vh, 40rem);
	margin: 0 auto;
	overflow: visible;

	> :first-child {
		grid-row: 1 / span 2;
	}

	@media (max-width: 800px) {
		grid-template-columns: 1fr;
		grid-template-rows: none;
		width: min(100% - 2.5rem, 28rem);
		height: auto;

		> :first-child {
			grid-row: auto;
		}
	}
`

const cardLink = `
	color: inherit;
	text-decoration: none;

	&:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 3px;
	}
`

const FillLink = styled.a`
	${cardLink}
	position: relative;
	display: block;
	min-height: 0;
	overflow: hidden;
	border-radius: 1.5rem;
	background: #181818;
	transition:
		transform 0.25s ease,
		box-shadow 0.25s ease;

	&:hover {
		transform: translateY(-6px);
		box-shadow: 0 18px 36px rgba(24, 24, 24, 0.16);
	}

	@media (max-width: 800px) {
		aspect-ratio: 9 / 16;
	}
`

const ZoomPhoto = styled.img<{ $position: string; $paused?: boolean; $on: boolean }>`
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	object-fit: cover;
	object-position: ${(props) => props.$position};
	opacity: ${(props) => (props.$on ? 1 : 0)};
	transition: opacity 0.55s ease;
	animation: ${drift} 22s ease-in-out infinite alternate;
	animation-play-state: ${(props) => (props.$paused ? "paused" : "running")};
	${motionOff}
`

const Schedule = styled.ol`
	position: absolute;
	z-index: 2;
	bottom: 7.15rem;
	left: 1.15rem;
	display: flex;
	flex-direction: column;
	gap: 0.18rem;
	width: max-content;
	max-width: calc(100% - 2.3rem);
	margin: 0;
	padding: 0;
	list-style: none;
`

const ScheduleTime = styled.span`
	font-variant-numeric: tabular-nums;
`

const ScheduleRow = styled.li<{ $active: boolean }>`
	display: grid;
	grid-template-columns: 3.2rem auto;
	column-gap: 0.5rem;
	align-items: baseline;
	color: ${(props) => (props.$active ? "var(--extrusion)" : "#ffffff")};
	font-size: 0.84rem;
	font-weight: 700;
	line-height: 1.25;
	white-space: nowrap;
	text-shadow:
		0 1px 2px rgba(0, 0, 0, 0.9),
		0 0 10px rgba(0, 0, 0, 0.55);
	transition: color 0.3s ease;
`

const Caption = styled.div`
	position: absolute;
	z-index: 2;
	right: 0;
	bottom: 0;
	left: 0;
	padding: 4.5rem 1.15rem 1.2rem;
	background: linear-gradient(
		to top,
		rgba(24, 24, 24, 0.92) 0%,
		rgba(24, 24, 24, 0.55) 42%,
		rgba(24, 24, 24, 0) 100%
	);
`

const MonthlyCaption = styled(Caption)`
	padding-top: 13rem;
	background: linear-gradient(
		to top,
		rgba(24, 24, 24, 0.94) 0%,
		rgba(24, 24, 24, 0.78) 34%,
		rgba(24, 24, 24, 0.35) 62%,
		rgba(24, 24, 24, 0) 100%
	);
`

const Name = styled.h2`
	margin: 0;
	font-family: ${wordmarkFont};
	font-size: 1.45rem;
	font-weight: 800;
	line-height: 1.15;
	letter-spacing: -0.03em;
	color: #ffffff;
`

const Copy = styled.p`
	margin: 0.4rem 0 0;
	font-size: 0.98rem;
	line-height: 1.4;
	color: #ffffff;
`

const PaperLink = styled.a`
	${cardLink}
	position: relative;
	display: block;
	min-height: 0;
	overflow: hidden;

	@media (min-width: 801px) {
		height: 100%;
	}

	@media (max-width: 800px) {
		aspect-ratio: 4 / 5;
	}
`

const PaperFrame = styled.div`
	position: absolute;
	inset: 0;
	overflow: hidden;
	border-radius: 1.5rem;
	background: #181818;
	transition:
		transform 0.25s ease,
		box-shadow 0.25s ease;

	${PaperLink}:hover & {
		transform: translateY(-6px);
		box-shadow: 0 18px 36px rgba(24, 24, 24, 0.16);
	}
`

const Shade = styled.div`
	position: absolute;
	inset: 0;
	background: rgba(24, 24, 24, 0.28);
`

const PaperCaption = styled(Caption)`
	top: 0;
	bottom: auto;
	padding: 1.15rem 1.15rem 3.2rem;
	background: linear-gradient(
		to bottom,
		rgba(24, 24, 24, 0.9) 0%,
		rgba(24, 24, 24, 0.45) 58%,
		rgba(24, 24, 24, 0) 100%
	);
`

const Pile = styled.div`
	position: absolute;
	z-index: 3;
	right: 1rem;
	bottom: -8rem;
	width: 12rem;
	aspect-ratio: 9 / 12;
	pointer-events: none;

	@media (max-width: 800px) {
		right: 0.75rem;
		bottom: -6.7rem;
		width: 10rem;
	}
`

const Leaf = styled.div<{ $tilt: number; $offset: string; $front?: boolean }>`
	position: absolute;
	inset: 0;
	display: flex;
	flex-direction: column;
	padding: 0.85rem 0.7rem 0.55rem;
	border-radius: 0.1rem;
	background: ${(props) => (props.$front ? "#fffef8" : "#f3efe6")};
	color: #181818;
	box-shadow: 0 6px 14px rgba(24, 24, 24, 0.2);
	transform: translate(${(props) => props.$offset}) rotate(${(props) => props.$tilt}deg);
	transform-origin: 100% 100%;
	animation: ${(props) => (props.$front ? sheetIn : "none")} 0.45s ease;
	${motionOff}

	&::before {
		content: "";
		position: absolute;
		top: 0;
		right: 0;
		left: 0;
		height: 4px;
		background: var(--extrusion);
	}

	&::after {
		content: "";
		flex: 1;
		margin-top: 0.35rem;
		background-image: repeating-linear-gradient(
			to bottom,
			transparent 0,
			transparent 0.72rem,
			rgba(24, 24, 24, 0.12) 0.72rem,
			rgba(24, 24, 24, 0.12) 0.78rem
		);
	}
`

const LeafTitle = styled.p`
	position: relative;
	z-index: 1;
	margin: 0;
	font-family: var(--font-display);
	font-size: 1.15rem;
	font-weight: 560;
	line-height: 1.12;
	letter-spacing: -0.03em;
	overflow-wrap: break-word;
`

const InkName = styled(Name)`
	color: var(--foreground);
`

const InkCopy = styled(Copy)`
	color: var(--muted-foreground);
`

const TicketLink = styled.a`
	${cardLink}
	position: relative;
	z-index: 1;
	display: grid;
	grid-template-columns: 1.15fr 0.85fr;
	min-height: 0;
	overflow: hidden;
	border: 1px solid var(--border);
	border-radius: 1.5rem;
	background: var(--surface-solid);
	transition:
		transform 0.25s ease,
		box-shadow 0.25s ease;

	&:hover {
		transform: translateY(-4px);
		box-shadow: 0 16px 32px rgba(24, 24, 24, 0.12);
	}

	@media (max-width: 800px) {
		grid-template-columns: 1fr;
		min-height: 22rem;
	}
`

const TicketPhoto = styled.div`
	min-height: 0;
	overflow: hidden;

	@media (max-width: 800px) {
		order: -1;
		height: 11rem;
	}
`

const PanPhoto = styled.img<{ $position: string; $paused?: boolean }>`
	display: block;
	width: 100%;
	height: 100%;
	object-fit: cover;
	object-position: ${(props) => props.$position};
	animation: ${pan} 16s ease-in-out infinite alternate;
	animation-play-state: ${(props) => (props.$paused ? "paused" : "running")};
	${motionOff}
`

const TicketBody = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	min-width: 0;
	padding-top: 1rem;

	${InkName},
	${InkCopy} {
		padding-inline: 1rem;
	}
`

const TickerBar = styled.div`
	flex: none;
	margin-top: 0.85rem;
	overflow: hidden;
	background: var(--foreground);
	color: var(--background);
`

const TickerTrack = styled.div<{ $paused: boolean }>`
	display: flex;
	width: max-content;
	animation: ${tickerMove} 22s linear infinite;
	animation-play-state: ${(props) => (props.$paused ? "paused" : "running")};
	${motionOff}
`

const TickerItem = styled.span`
	display: inline-flex;
	align-items: center;
	gap: 0.75rem;
	padding: 0.42rem 0 0.42rem 0.75rem;
	font-size: 0.92rem;
	font-weight: 700;
	white-space: nowrap;
`

const TickerDot = styled.span`
	width: 0.4rem;
	height: 0.4rem;
	border-radius: 999px;
	background: var(--pop-cyan);
`

const TickerStatic = styled.p`
	margin: 0.85rem 0 0;
	padding: 0.45rem 0.9rem;
	background: var(--foreground);
	color: var(--background);
	font-size: 0.92rem;
	font-weight: 700;
	line-height: 1.4;
`

//
// Functions
//

function pauseHandlers(setPaused: (paused: boolean) => void): PauseHandlers {
	return {
		onMouseEnter: () => setPaused(true),
		onMouseLeave: () => setPaused(false),
		onFocus: () => setPaused(true),
		onBlur: (event) => {
			const next = event.relatedTarget
			if (next instanceof Node && event.currentTarget.contains(next)) return
			setPaused(false)
		}
	}
}

function useReducedMotion(): boolean {
	const [reduce, setReduce] = useState(false)

	useEffect(() => {
		const media = window.matchMedia("(prefers-reduced-motion: reduce)")
		const update = () => setReduce(media.matches)
		update()
		media.addEventListener("change", update)
		return () => media.removeEventListener("change", update)
	}, [])

	return reduce
}

function useCycle(length: number, ms: number, paused: boolean): number {
	const reduce = useReducedMotion()
	const [index, setIndex] = useState(0)

	useEffect(() => {
		if (paused || reduce || length < 2) return
		const id = window.setInterval(() => {
			setIndex((current) => (current + 1) % length)
		}, ms)
		return () => window.clearInterval(id)
	}, [paused, reduce, length, ms])

	return index
}
