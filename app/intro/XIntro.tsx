"use client"
import { useEffect, useState } from "react"
import { createGlobalStyle, keyframes, styled } from "styled-components"
import { Button } from "../components/Button"
import { XDude } from "./XDude"

//
// Types
//

type FilmProps = {
	onReplay: () => void
}

//
// Constants
//

const film = "9s"

// Shared clock. The face group is inside a flipped SVG, so +Y on .x-face is up.
const hit = "calc(-1 * min(34vw, 300px) - 18%)"

const dudeMove = keyframes`
	0%,
	8% {
		transform: translate(calc(-50vw - 70%), 0) rotate(-8deg) skewX(0deg) scale(1);
		animation-timing-function: cubic-bezier(0.22, 0.7, 0.3, 1);
	}
	14.5% {
		transform: translate(calc(-50vw + 50% + 9vw), -12px) rotate(12deg) skewX(5deg) scale(0.94, 1.08);
		animation-timing-function: cubic-bezier(0.22, 0.7, 0.3, 1);
	}
	18%,
	25% {
		transform: translate(calc(-50vw + 50% + 7vw), 0) rotate(6deg) skewX(0deg) scale(1);
		animation-timing-function: cubic-bezier(0.55, 0.06, 0.68, 0.19);
	}
	31% {
		transform: translate(calc(-50vw + 50% + 3vw), 18px) rotate(-16deg) skewX(0deg) scale(1.3, 0.64);
		animation-timing-function: cubic-bezier(0.7, 0, 0.98, 0.4);
	}
	35%,
	35.55% {
		transform: translate(${hit}, 10px) rotate(4deg) skewX(10deg) scale(1.62, 0.42);
		animation-timing-function: cubic-bezier(0.55, 0.05, 0.85, 0.4);
	}
	36.5% {
		transform: translate(calc(-1 * min(22vw, 180px)), -6px) rotate(-2deg) skewX(-4deg) scale(0.9, 1.16);
		animation-timing-function: cubic-bezier(0.22, 0.7, 0.3, 1);
	}
	37.8% {
		transform: translate(calc(-1 * min(16vw, 140px)), 14px) rotate(-4deg) skewX(4deg) scale(1.1, 0.86);
		animation-timing-function: cubic-bezier(0.22, 0.7, 0.3, 1);
	}
	46% {
		transform: translate(0.4vw, -14px) rotate(3deg) skewX(0deg) scale(0.94, 1.1);
		animation-timing-function: ease-out;
	}
	54%,
	76% {
		transform: translate(0, 0) rotate(0deg) skewX(0deg) scale(1);
		animation-timing-function: cubic-bezier(0.55, 0.06, 0.68, 0.19);
	}
	82% {
		transform: translate(0, 8px) rotate(0deg) skewX(0deg) scale(1.14, 0.78);
		animation-timing-function: cubic-bezier(0.16, 0.84, 0.28, 1);
	}
	89% {
		transform: translate(0, -36px) rotate(0deg) skewX(0deg) scale(0.9, 1.12);
		animation-timing-function: cubic-bezier(0.55, 0.05, 0.9, 0.35);
	}
	95% {
		transform: translate(0, 5px) rotate(0deg) skewX(0deg) scale(1.1, 0.84);
		animation-timing-function: cubic-bezier(0.22, 0.7, 0.3, 1);
	}
	100% {
		transform: translate(0, 0) rotate(0deg) skewX(0deg) scale(1);
	}
`

// Same film, but the crouch stays on a narrow screen. 3vw parks the wide squash on the edge.
const dudeMoveSmall = keyframes`
	0%,
	8% {
		transform: translate(calc(-50vw - 70%), 0) rotate(-8deg) skewX(0deg) scale(1);
		animation-timing-function: cubic-bezier(0.22, 0.7, 0.3, 1);
	}
	14.5% {
		transform: translate(calc(-50vw + 50% + 8vw), -8px) rotate(10deg) skewX(4deg) scale(0.96, 1.06);
		animation-timing-function: cubic-bezier(0.22, 0.7, 0.3, 1);
	}
	18%,
	25% {
		transform: translate(calc(-50vw + 50% + 7vw), 0) rotate(6deg) skewX(0deg) scale(1);
		animation-timing-function: cubic-bezier(0.55, 0.06, 0.68, 0.19);
	}
	31% {
		transform: translate(calc(-50vw + 50% + 8vw), 12px) rotate(-12deg) skewX(0deg) scale(1.16, 0.72);
		animation-timing-function: cubic-bezier(0.7, 0, 0.98, 0.4);
	}
	35%,
	35.55% {
		transform: translate(calc(-1 * min(24vw, 96px)), 6px) rotate(2deg) skewX(6deg) scale(1.24, 0.5);
		animation-timing-function: cubic-bezier(0.55, 0.05, 0.85, 0.4);
	}
	36.5% {
		transform: translate(calc(-1 * min(12vw, 52px)), -2px) rotate(-1deg) skewX(-3deg) scale(0.94, 1.1);
		animation-timing-function: cubic-bezier(0.22, 0.7, 0.3, 1);
	}
	37.8% {
		transform: translate(calc(-1 * min(10vw, 48px)), 10px) rotate(-3deg) skewX(3deg) scale(1.08, 0.84);
		animation-timing-function: cubic-bezier(0.22, 0.7, 0.3, 1);
	}
	46% {
		transform: translate(0, -10px) rotate(3deg) skewX(0deg) scale(0.96, 1.08);
		animation-timing-function: ease-out;
	}
	54%,
	76% {
		transform: translate(0, 0) rotate(0deg) skewX(0deg) scale(1);
		animation-timing-function: cubic-bezier(0.55, 0.06, 0.68, 0.19);
	}
	82% {
		transform: translate(0, 6px) rotate(0deg) skewX(0deg) scale(1.1, 0.84);
		animation-timing-function: cubic-bezier(0.16, 0.84, 0.28, 1);
	}
	89% {
		transform: translate(0, -16px) rotate(0deg) skewX(0deg) scale(0.94, 1.08);
		animation-timing-function: cubic-bezier(0.55, 0.05, 0.9, 0.35);
	}
	95% {
		transform: translate(0, 4px) rotate(0deg) skewX(0deg) scale(1.08, 0.86);
		animation-timing-function: cubic-bezier(0.22, 0.7, 0.3, 1);
	}
	100% {
		transform: translate(0, 0) rotate(0deg) skewX(0deg) scale(1);
	}
`

const idleHop = keyframes`
	0%,
	34%,
	86%,
	100% {
		transform: translate(0, 0) rotate(0deg) skewX(0deg) scale(1);
	}
	6% {
		transform: translate(0, 8px) rotate(0deg) skewX(0deg) scale(1.14, 0.8);
		animation-timing-function: cubic-bezier(0.16, 0.84, 0.28, 1);
	}
	16% {
		transform: translate(0, -34px) rotate(-4deg) skewX(0deg) scale(0.9, 1.12);
		animation-timing-function: cubic-bezier(0.55, 0.05, 0.9, 0.35);
	}
	26% {
		transform: translate(0, 6px) rotate(1deg) skewX(0deg) scale(1.14, 0.78);
		animation-timing-function: cubic-bezier(0.22, 0.7, 0.3, 1);
	}
	58% {
		transform: translate(0, 6px) rotate(0deg) skewX(0deg) scale(1.1, 0.86);
		animation-timing-function: cubic-bezier(0.16, 0.84, 0.28, 1);
	}
	68% {
		transform: translate(0, -18px) rotate(4deg) skewX(0deg) scale(0.94, 1.08);
		animation-timing-function: cubic-bezier(0.55, 0.05, 0.9, 0.35);
	}
	78% {
		transform: translate(0, 4px) rotate(0deg) skewX(0deg) scale(1.1, 0.84);
		animation-timing-function: cubic-bezier(0.22, 0.7, 0.3, 1);
	}
`

const pose = keyframes`
	0%,
	50% {
		transform: rotate(0deg);
		animation-timing-function: ease-in-out;
	}
	58%,
	64% {
		transform: rotate(-16deg);
	}
	72%,
	78% {
		transform: rotate(16deg);
	}
	88%,
	100% {
		transform: rotate(-6deg);
	}
`

const idlePose = keyframes`
	0%,
	100% {
		transform: rotate(-6deg);
	}
	35%,
	48% {
		transform: rotate(11deg);
	}
	72% {
		transform: rotate(-9deg);
	}
`

const faceLift = keyframes`
	0%,
	24% {
		transform: none;
		animation-timing-function: cubic-bezier(0.55, 0.06, 0.68, 0.19);
	}
	31% {
		transform: translate(10px, 22px);
		animation-timing-function: cubic-bezier(0.55, 0.05, 0.9, 0.35);
	}
	35.4% {
		transform: translate(0px, -8px);
		animation-timing-function: cubic-bezier(0.22, 0.7, 0.3, 1);
	}
	44% {
		transform: translate(0px, 8px);
		animation-timing-function: ease-out;
	}
	52%,
	100% {
		transform: none;
	}
`

const stir = keyframes`
	0%,
	33% {
		transform: none;
	}
	37% {
		transform: translate(-28px, 36px);
	}
	48%,
	54% {
		transform: none;
	}
	60%,
	66% {
		transform: translate(20px, 0);
	}
	74%,
	80% {
		transform: translate(-20px, 0);
	}
	90%,
	100% {
		transform: none;
	}
`

const logoBlur = keyframes`
	0%,
	35%,
	43%,
	100% {
		filter: blur(0);
	}
	37.2% {
		filter: blur(4px);
	}
`

const oldExit = keyframes`
	0% {
		transform: translateY(0) rotate(0deg);
		animation-timing-function: ease-in-out;
	}
	9% {
		transform: translateY(-8px) rotate(0deg);
	}
	18% {
		transform: translateY(0) rotate(0deg);
	}
	28% {
		transform: translate(0, 0) rotate(0deg);
		animation-timing-function: ease-in;
	}
	33.6% {
		transform: translate(14px, 0) rotate(2.5deg);
		animation-timing-function: cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	35.3%,
	35.55% {
		transform: translate(48px, 10px) rotate(-18deg) scale(0.76, 1.3);
		animation-timing-function: cubic-bezier(0.05, 0.85, 0.15, 1);
	}
	37.2% {
		transform: translate(24vw, -20vh) rotate(108deg) scale(1.05);
		opacity: 1;
		animation-timing-function: linear;
	}
	40.5% {
		transform: translate(72vw, -2vh) rotate(268deg) scale(0.9);
		opacity: 1;
	}
	44.2%,
	100% {
		transform: translate(128vw, 34vh) rotate(490deg) scale(0.58);
		opacity: 0;
	}
`

const shake = keyframes`
	0%,
	34%,
	42%,
	100% {
		transform: none;
	}
	35.2% {
		transform: translate(-22px, 11px) rotate(-0.9deg);
	}
	36.2% {
		transform: translate(15px, -9px) rotate(0.55deg);
	}
	37.4% {
		transform: translate(-6px, 3px);
	}
	39.2% {
		transform: translate(2px, -1px);
	}
`

const impactFlash = keyframes`
	0%,
	34.8%,
	35.7%,
	100% {
		opacity: 0;
	}
	35.15% {
		opacity: 1;
	}
`

const edgeFade = keyframes`
	0%,
	46% {
		opacity: 1;
	}
	51%,
	100% {
		opacity: 0;
	}
`

const wipe = keyframes`
	0%,
	42% {
		transform: translateX(-105%);
		animation-timing-function: cubic-bezier(0.7, 0.05, 0.25, 1);
	}
	51% {
		transform: translateX(1.4%);
	}
	56%,
	100% {
		transform: translateX(0);
	}
`

const eyes = keyframes`
	0%,
	14% {
		transform: scaleY(1);
	}
	15.4% {
		transform: scaleY(0.12);
	}
	17.8%,
	25% {
		transform: scaleY(1.08);
	}
	29.5%,
	32% {
		transform: scaleY(0.58);
	}
	35% {
		transform: scaleY(1.22) scaleX(0.9);
	}
	40%,
	68% {
		transform: scaleY(1);
	}
	71% {
		transform: scaleY(0.1);
	}
	74%,
	91% {
		transform: scaleY(1);
	}
	94.2% {
		transform: scaleY(0.1);
	}
	97%,
	100% {
		transform: scaleY(1);
	}
`

const mouth = keyframes`
	0%,
	28%,
	48%,
	78% {
		transform: scaleY(1);
	}
	31.2% {
		transform: scaleY(0.3);
	}
	35.2% {
		transform: scaleY(1.45);
	}
	90%,
	96% {
		transform: scaleY(1.35);
	}
	100% {
		transform: scaleY(1);
	}
`

const idleBlink = keyframes`
	0%,
	72%,
	78%,
	100% {
		transform: scaleY(1);
	}
	75% {
		transform: scaleY(0.1);
	}
`

// Pupils live in the flipped face, so a positive Y looks up.
const pupils = keyframes`
	0%,
	12% {
		transform: translate(5px, 2px);
	}
	17%,
	28% {
		transform: translate(11px, 2px);
	}
	33%,
	42% {
		transform: translate(1px, 3px);
	}
	52% {
		transform: translate(0px, 2px);
	}
	59%,
	66% {
		transform: translate(-11px, 2px);
	}
	73%,
	80% {
		transform: translate(11px, 2px);
	}
	90%,
	100% {
		transform: translate(0px, 2px);
	}
`

const idlePupils = keyframes`
	0%,
	100% {
		transform: translate(0px, 2px);
	}
	28%,
	40% {
		transform: translate(-7px, 1px);
	}
	62%,
	74% {
		transform: translate(7px, 2px);
	}
`

const captionIn = keyframes`
	0%,
	80% {
		opacity: 0;
		transform: translateY(12px);
	}
	92%,
	100% {
		opacity: 1;
		transform: translateY(0);
	}
`

const replayIn = keyframes`
	0%,
	90% {
		opacity: 0;
		visibility: hidden;
	}
	100% {
		opacity: 1;
		visibility: visible;
	}
`

const ring = keyframes`
	0%,
	34.2% {
		opacity: 0;
		transform: scale(0.2);
	}
	35.2% {
		opacity: 1;
		transform: scale(0.42);
	}
	37.2%,
	100% {
		opacity: 0;
		transform: scale(1.55);
	}
`

const shard = keyframes`
	0%,
	33.5% {
		opacity: 0;
		transform: translate(0, 0) scale(0.3) rotate(0deg);
	}
	35.6% {
		opacity: 1;
		transform: translate(calc(var(--dx) * 0.35), calc(var(--dy) * 0.35)) scale(1) rotate(20deg);
	}
	41.5%,
	100% {
		opacity: 0;
		transform: translate(var(--dx), var(--dy)) scale(0.4) rotate(var(--spin));
	}
`

const streak = keyframes`
	0%,
	31%,
	37.6%,
	100% {
		opacity: 0;
		transform: scaleX(0.15);
	}
	33.4%,
	35.4% {
		opacity: 1;
		transform: scaleX(1);
	}
`

const motionOff = `
	@media (prefers-reduced-motion: reduce) {
		.shake,
		.paper,
		.paper::before,
		.old,
		.dude,
		.pose,
		.eyes,
		.pupils,
		.mouth,
		.x-face,
		.x-pattern,
		.ring,
		.shards span,
		.lines span,
		.flash,
		.caption,
		.replay {
			animation: none !important;
		}

		.shake,
		.paper,
		.dude,
		.x-face,
		.x-pattern {
			transform: none;
		}

		.pose {
			transform: rotate(-6deg);
		}

		.pupils {
			transform: translate(0, 2px);
		}

		.old,
		.lines,
		.shards,
		.ring,
		.flash,
		.paper::before {
			opacity: 0;
		}

		.caption {
			opacity: 1;
			transform: none;
		}

		.replay {
			display: none;
		}
	}
`

//
// Components
//

export function XIntro() {
	const [take, setTake] = useState(0)

	return (
		<Main className="x-intro">
			<Film key={take} onReplay={() => setTake((n) => n + 1)} />
		</Main>
	)
}

function Film({ onReplay }: FilmProps) {
	useEffect(() => {
		document.body.classList.add("x-intro-open")
		return () => document.body.classList.remove("x-intro-open")
	}, [])

	return (
		<Stage>
			<IntroGlobal />
			<Shake className="shake">
				<Paper className="paper" />
				<World>
					<Anchor $layer={2}>
						<Old className="old">
							<img src="/images/DEVxLogo.png" alt="" width={2772} height={582} />
						</Old>
					</Anchor>
					<Anchor $layer={3}>
						<Dude className="dude">
							<Lines className="lines" aria-hidden="true">
								<span />
								<span />
								<span />
								<span />
								<span />
							</Lines>
							<Pose className="pose">
								<XDude />
							</Pose>
							<Burst>
								<Ring className="ring" />
								<Ring className="ring late" />
								<Shards className="shards" aria-hidden="true">
									<span />
									<span />
									<span />
									<span />
									<span />
									<span />
									<span />
								</Shards>
							</Burst>
						</Dude>
					</Anchor>
				</World>
				<Flash className="flash" aria-hidden="true" />
			</Shake>
			<Copy>
				<Caption className="caption">Look at the new x.</Caption>
				<Replay className="replay">
					<Button onClick={onReplay}>Play again</Button>
				</Replay>
			</Copy>
			<VisuallyHidden>
				The old DEVx mark sits on the page. The new x comes in from the left, bumps it off, and
				looks around.
			</VisuallyHidden>
		</Stage>
	)
}

const IntroGlobal = createGlobalStyle`
	body.x-intro-open {
		overflow: hidden;
	}

	body.x-intro-open footer {
		display: none;
	}
`

const Main = styled.main`
	position: relative;
	display: flex;
	flex: 1;
	min-height: 0;
`

const Stage = styled.div`
	position: relative;
	flex: 1;
	overflow: hidden;
	background: #181818;
	color: #181818;
	--foreground: #181818;
	--background: #ffffff;
	--foreground-rgb: 24, 24, 24;
	--background-rgb: 255, 255, 255;

	${motionOff}
`

const Shake = styled.div`
	position: absolute;
	inset: 0;
	animation: ${shake} ${film} linear both;
`

const Flash = styled.div`
	position: absolute;
	inset: 0;
	z-index: 5;
	pointer-events: none;
	background: radial-gradient(
		circle at 46% 42%,
		rgba(255, 255, 255, 0.96) 0%,
		rgba(249, 226, 20, 0.7) 7%,
		rgba(255, 255, 255, 0.14) 14%,
		transparent 26%
	);
	opacity: 0;
	animation: ${impactFlash} ${film} linear both;
`

const Paper = styled.div`
	position: absolute;
	top: 0;
	bottom: 0;
	left: -6%;
	width: 112%;
	background: #ffffff;
	transform: translateX(-105%);
	animation: ${wipe} ${film} linear both;

	&::before {
		content: "";
		position: absolute;
		top: 0;
		bottom: 0;
		right: 0;
		width: 14px;
		background: #f9e214;
		opacity: 0;
		animation: ${edgeFade} ${film} linear both;
	}
`

const World = styled.div`
	position: absolute;
	inset: 0;
`

const Anchor = styled.div<{ $layer: number }>`
	position: absolute;
	left: 50%;
	top: 42%;
	z-index: ${(props) => props.$layer};
	width: 0;
	height: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: visible;
`

const Old = styled.div`
	animation:
		${oldExit} ${film} ease-in-out both,
		${logoBlur} ${film} linear both;

	img {
		display: block;
		width: min(62vw, 560px);
		height: auto;
		max-width: none;
	}

	@media (max-width: 1240px) {
		img {
			width: min(40vw, 360px);
		}
	}

	@media (max-width: 700px) {
		img {
			width: min(34vw, 148px);
		}
	}
`

const Dude = styled.div`
	position: relative;
	height: clamp(148px, 28vh, 220px);
	transform-origin: 50% 74%;
	transform: translate(calc(-50vw - 70%), 0) rotate(-8deg);
	animation:
		${dudeMove} ${film} linear both,
		${idleHop} 6.4s ease-in-out ${film} infinite;

	@media (max-width: 1240px) {
		height: clamp(120px, 24vh, 168px);
	}

	@media (max-width: 700px) {
		height: 96px;
		animation:
			${dudeMoveSmall} ${film} linear both,
			${idleHop} 6.4s ease-in-out ${film} infinite;
	}

	svg {
		display: block;
		height: 100%;
		width: auto;
		overflow: visible;
		filter: drop-shadow(1.4px 0 0 #ffffff) drop-shadow(-1.4px 0 0 #ffffff)
			drop-shadow(0 1.4px 0 #ffffff) drop-shadow(0 -1.4px 0 #ffffff);
	}

	.x-face {
		animation: ${faceLift} ${film} linear both;
	}

	.x-pattern {
		animation: ${stir} ${film} ease-out both;
	}

	.eyes,
	.pupils {
		transform-box: fill-box;
		transform-origin: center;
	}

	.eyes {
		animation:
			${eyes} ${film} linear both,
			${idleBlink} 4.6s linear calc(${film} + 0.4s) infinite;
	}

	.pupils {
		animation:
			${pupils} ${film} ease-in-out both,
			${idlePupils} 6.2s ease-in-out ${film} infinite;
	}

	.mouth {
		transform-box: fill-box;
		transform-origin: center;
		animation: ${mouth} ${film} ease-in-out both;
	}
`

const Pose = styled.div`
	height: 100%;
	transform-origin: 50% 42%;
	animation:
		${pose} ${film} ease-in-out both,
		${idlePose} 5.6s ease-in-out ${film} infinite;
`

const Lines = styled.div`
	position: absolute;
	right: calc(100% + 4px);
	top: 16%;
	width: 220px;
	height: 100px;
	z-index: 0;
	pointer-events: none;

	span {
		position: absolute;
		left: 0;
		height: 7px;
		border-radius: 7px;
		transform-origin: left center;
		opacity: 0;
		animation: ${streak} ${film} ease-out both;
	}

	span:nth-child(1) {
		top: 6px;
		width: 62%;
		background: #f9e214;
	}

	span:nth-child(2) {
		top: 30px;
		width: 100%;
		background: #ffffff;
		animation-delay: 0.03s;
	}

	span:nth-child(3) {
		top: 54px;
		width: 74%;
		background: #3ce2c8;
	}

	span:nth-child(4) {
		top: 78px;
		width: 44%;
		background: #f010d7;
		animation-delay: 0.05s;
	}

	span:nth-child(5) {
		top: 18px;
		width: 86%;
		height: 5px;
		background: #2454e6;
		animation-delay: 0.02s;
	}

	@media (max-width: 700px) {
		width: 78px;
		height: 64px;
		top: 22%;

		span {
			height: 5px;
		}
	}
`

const Burst = styled.div`
	position: absolute;
	left: 88%;
	top: 42%;
	width: 0;
	height: 0;
	z-index: 4;
	pointer-events: none;
`

const Ring = styled.div`
	position: absolute;
	left: -62px;
	top: -62px;
	width: 124px;
	height: 124px;
	border: 5px solid #5010a0;
	border-radius: 50%;
	opacity: 0;
	animation: ${ring} ${film} linear both;

	&.late {
		border-color: #f9e214;
		border-width: 4px;
		animation-delay: 0.04s;
	}
`

const Shards = styled.div`
	position: absolute;
	left: 0;
	top: 0;
	width: 0;
	height: 0;

	span {
		position: absolute;
		left: 0;
		top: 0;
		width: 16px;
		height: 16px;
		margin: -8px 0 0 -8px;
		opacity: 0;
		animation: ${shard} ${film} ease-out both;
	}

	span:nth-child(1) {
		background: #2454e6;
		--dx: -86px;
		--dy: -72px;
		--spin: 40deg;
	}

	span:nth-child(2) {
		background: #f9e214;
		border-radius: 50%;
		--dx: 78px;
		--dy: -64px;
		--spin: -30deg;
	}

	span:nth-child(3) {
		background: #f010d7;
		--dx: -36px;
		--dy: 70px;
		--spin: 80deg;
	}

	span:nth-child(4) {
		background: #3ce2c8;
		border-radius: 50%;
		--dx: 104px;
		--dy: 24px;
		--spin: 20deg;
	}

	span:nth-child(5) {
		background: #ef5b30;
		--dx: -112px;
		--dy: 16px;
		--spin: -50deg;
	}

	span:nth-child(6) {
		background: #e52a51;
		border-radius: 50%;
		--dx: 24px;
		--dy: -108px;
		--spin: 60deg;
	}

	span:nth-child(7) {
		width: 8px;
		height: 8px;
		background: #5010a0;
		--dx: 58px;
		--dy: 86px;
		--spin: -70deg;
	}
`

const Copy = styled.div`
	position: absolute;
	left: 0;
	right: 0;
	top: calc(42% + clamp(118px, 18vh, 168px));
	z-index: 3;

	@media (max-width: 700px) {
		top: calc(42% + 72px);
	}
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.9rem;
	pointer-events: none;
`

const Caption = styled.p`
	margin: 0;
	opacity: 0;
	font-family: var(--font-display);
	font-weight: 560;
	font-style: italic;
	font-size: clamp(2rem, 5vw, 3.5rem);
	letter-spacing: -0.03em;
	line-height: 1;
	animation: ${captionIn} ${film} ease-out both;
`

const Replay = styled.div`
	opacity: 0;
	visibility: hidden;
	pointer-events: auto;
	animation: ${replayIn} ${film} linear both;
`

const VisuallyHidden = styled.p`
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	white-space: nowrap;
	border: 0;
`
