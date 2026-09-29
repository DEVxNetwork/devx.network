"use client"
import { css, keyframes, styled } from "styled-components"
import { DevxWordmark } from "./DevxWordmark"
import { sitJump } from "./sitJump"

//
// Types
//

type Idea = {
	id: string
	name: string
	text: string
}

//
// Constants
//

const ideas: Idea[] = [
	{ id: "step", name: "Step", text: "The X eases to the right." },
	{ id: "lean", name: "Lean", text: "The X rotates a little, and stays tilted." },
	{ id: "hop", name: "Hop", text: "The X eases up, and stays up." },
	{
		id: "lift",
		name: "Lift",
		text: "The colored face eases up. The purple extrusion stays."
	},
	{ id: "turn", name: "Turn", text: "The X eases through a quarter turn." },
	{
		id: "sway",
		name: "Sway",
		text: "The X rocks back and forth while the pointer is on the card."
	},
	{
		id: "stir",
		name: "Stir",
		text: "The colors inside the X slide. The outline stays put."
	},
	{ id: "nudge", name: "Nudge", text: "The X eases left, toward the V." },
	{
		id: "sit",
		name: "Sit",
		text: "It squats, jumps, lands in a squish, and settles."
	},
	{
		id: "look",
		name: "Look",
		text: "It cranes left, then right, and keeps looking while you hover."
	}
]

const sway = keyframes`
	0% {
		transform: rotate(0deg);
	}
	35% {
		transform: rotate(-9deg);
	}
	70% {
		transform: rotate(9deg);
	}
	100% {
		transform: rotate(0deg);
	}
`

const look = keyframes`
	0% {
		transform: none;
		animation-timing-function: ease-in-out;
	}
	22%,
	40% {
		transform: translateX(-14%) rotate(-12deg);
		animation-timing-function: ease-in-out;
	}
	62%,
	80% {
		transform: translateX(16%) rotate(13deg);
		animation-timing-function: ease-in-out;
	}
	100% {
		transform: none;
	}
`

const lookFill = keyframes`
	0% {
		transform: translateX(0);
		animation-timing-function: ease-in-out;
	}
	22%,
	40% {
		transform: translateX(-7%);
		animation-timing-function: ease-in-out;
	}
	62%,
	80% {
		transform: translateX(7%);
		animation-timing-function: ease-in-out;
	}
	100% {
		transform: translateX(0);
	}
`

const motionOff = `
	@media (prefers-reduced-motion: reduce) {
		.x-all,
		.x-face,
		.x-pattern {
			transition: none;
			animation: none;
		}
	}
`

//
// Components
//

export function LogoLabPage() {
	return (
		<Main>
			<Intro>
				<h1>Logo lab</h1>
				<Lead>
					Hover a card. Most poses hold until you leave. Sit jumps once. Look keeps glancing. The
					big mark and the header-size one move together. The header above this page is still the
					live one.
				</Lead>
			</Intro>
			<Grid>
				{ideas.map((idea, index) => (
					<Card key={idea.id} id={idea.id} data-idea={idea.id} tabIndex={0}>
						<Stage $tall={idea.id === "sit"}>
							<DevxWordmark />
						</Stage>
						<Name>
							{index + 1}. {idea.name}
						</Name>
						<Text>{idea.text}</Text>
						<Strip>
							<DevxWordmark />
							<NavPreview aria-hidden="true">
								<span>Home</span>
								<span>Events</span>
								<span>Watch</span>
							</NavPreview>
						</Strip>
					</Card>
				))}
			</Grid>
		</Main>
	)
}

const pose = (
	idea: string,
	target: string,
	transform: string,
	duration: string,
	origin?: string
) => css`
	&[data-idea="${idea}"] ${target} {
		transition-duration: ${duration};
		${origin ? `transform-origin: ${origin};` : ""}
	}

	@media (hover: hover) {
		&[data-idea="${idea}"]:hover ${target} {
			transform: ${transform};
		}
	}

	@media (hover: none) {
		&[data-idea="${idea}"]:focus ${target}, &[data-idea="${idea}"]:active ${target} {
			transform: ${transform};
		}
	}

	&[data-idea="${idea}"]:focus-visible ${target} {
		transform: ${transform};
	}
`

const Card = styled.article`
	display: flex;
	flex-direction: column;
	gap: 0.65rem;
	min-width: 0;
	cursor: pointer;

	.x-all,
	.x-face,
	.x-pattern {
		transform-box: fill-box;
		transform-origin: center;
		transition: transform 0.55s ease-in-out;
	}

	${pose("step", ".x-all", "translateX(34%)", "0.52s")}
	${pose("lean", ".x-all", "rotate(-16deg)", "0.5s")}
	${pose("hop", ".x-all", "translateY(28%)", "0.46s")}
	${pose("lift", ".x-face", "translateY(46%)", "0.64s")}
	${pose("turn", ".x-all", "rotate(90deg)", "0.78s")}
	${pose("stir", ".x-pattern", "translate(-22%, 26%)", "0.7s")}
	${pose("nudge", ".x-all", "translateX(-22%)", "0.52s")}

	&[data-idea="sit"] .x-all {
		transform-origin: 50% 0%;
		transition: none;
	}

	&[data-idea="sway"] .x-all,
	&[data-idea="look"] .x-all,
	&[data-idea="look"] .x-pattern {
		transition-duration: 0.45s;
	}

	@media (hover: hover) {
		&[data-idea="sway"]:hover .x-all {
			animation: ${sway} 1.8s ease-in-out infinite;
		}

		&[data-idea="sit"]:hover .x-all {
			animation: ${sitJump} 1.4s forwards;
		}

		&[data-idea="look"]:hover .x-all {
			animation: ${look} 2.6s ease-in-out infinite;
		}

		&[data-idea="look"]:hover .x-pattern {
			animation: ${lookFill} 2.6s ease-in-out infinite;
		}
	}

	@media (hover: none) {
		&[data-idea="sway"]:focus .x-all,
		&[data-idea="sway"]:active .x-all {
			animation: ${sway} 1.8s ease-in-out infinite;
		}

		&[data-idea="sit"]:focus .x-all,
		&[data-idea="sit"]:active .x-all {
			animation: ${sitJump} 1.4s forwards;
		}

		&[data-idea="look"]:focus .x-all,
		&[data-idea="look"]:active .x-all {
			animation: ${look} 2.6s ease-in-out infinite;
		}

		&[data-idea="look"]:focus .x-pattern,
		&[data-idea="look"]:active .x-pattern {
			animation: ${lookFill} 2.6s ease-in-out infinite;
		}
	}

	&[data-idea="sway"]:focus-visible .x-all {
		animation: ${sway} 1.8s ease-in-out infinite;
	}

	&[data-idea="sit"]:focus-visible .x-all {
		animation: ${sitJump} 1.4s forwards;
	}

	&[data-idea="look"]:focus-visible .x-all {
		animation: ${look} 2.6s ease-in-out infinite;
	}

	&[data-idea="look"]:focus-visible .x-pattern {
		animation: ${lookFill} 2.6s ease-in-out infinite;
	}

	&:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 4px;
		border-radius: 0.75rem;
	}

	&:hover,
	&:focus-visible {
		position: relative;
		z-index: 1;
	}

	${motionOff}

	svg {
		display: block;
		width: auto;
		max-width: 100%;
		overflow: visible;
	}
`

const Main = styled.main`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
	padding-bottom: 4rem;
`

const Intro = styled.section`
	width: min(var(--column), calc(100% - 2.5rem));
	padding: 3.25rem 0 0.5rem;
`

const Lead = styled.p`
	margin: 0.85rem 0 0;
	max-width: 38rem;
	font-size: 1.05rem;
	line-height: 1.55;
	color: var(--muted-foreground);
`

const Grid = styled.div`
	display: grid;
	grid-template-columns: 1fr;
	gap: 1.75rem;
	width: min(var(--column), calc(100% - 2.5rem));
	padding-top: 1.75rem;

	@media (min-width: 720px) {
		grid-template-columns: 1fr 1fr;
	}

	@media (min-width: 1024px) {
		grid-template-columns: 1fr 1fr 1fr;
	}
`

const Stage = styled.div<{ $tall?: boolean }>`
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 8.75rem;
	padding: 1.35rem 0.85rem;
	padding-top: ${(props) => (props.$tall ? "3.4rem" : "1.35rem")};
	background: var(--header-background);
	border: 1px solid var(--border);
	border-radius: 0.75rem;

	svg {
		height: 5.4rem;
	}
`

const Name = styled.h2`
	margin: 0.35rem 0 0;
	font-family: "Chivo", sans-serif;
	font-weight: 800;
	font-size: 1.35rem;
	letter-spacing: -0.03em;
`

const Text = styled.p`
	margin: 0;
	color: var(--muted-foreground);
	font-size: 0.95rem;
	line-height: 1.45;
`

const Strip = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 0.75rem;
	min-height: 3.35rem;
	margin-top: 0.2rem;
	padding: 0.55rem 0.85rem;
	background: var(--header-background);
	border: 1px solid var(--border);
	border-radius: 0.75rem;
	container-type: inline-size;

	svg {
		height: 1.85rem;
	}
`

const NavPreview = styled.div`
	display: none;
	align-items: center;
	gap: 0.85rem;
	color: var(--chrome-ink);
	font-size: 0.92rem;
	font-weight: 500;

	@container (min-width: 19rem) {
		display: flex;
	}
`
