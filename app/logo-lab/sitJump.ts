"use client"
import { keyframes } from "styled-components"

// Local +Y is up. The wordmark group is scale(0.46, -0.46).
// Origin 50% 0% is the visual feet, so a squash stays on the ground.
// The header rise is shorter so the X stays inside the bar at the top of the viewport.
const makeSitJump = (rise: string) => keyframes`
	0% {
		transform: none;
		animation-timing-function: cubic-bezier(0.55, 0.06, 0.68, 0.19);
	}
	18% {
		transform: scale(1.18, 0.68);
		animation-timing-function: linear;
	}
	24% {
		transform: scale(1.18, 0.68);
		animation-timing-function: cubic-bezier(0.16, 0.84, 0.28, 1);
	}
	48% {
		transform: translateY(${rise}) scale(0.9, 1.12);
		animation-timing-function: linear;
	}
	56% {
		transform: translateY(${rise}) scale(0.9, 1.12);
		animation-timing-function: cubic-bezier(0.55, 0.05, 0.9, 0.35);
	}
	70% {
		transform: scale(1.12, 0.82);
		animation-timing-function: linear;
	}
	76% {
		transform: scale(1.12, 0.82);
		animation-timing-function: cubic-bezier(0.22, 0.7, 0.3, 1);
	}
	90% {
		transform: scale(0.98, 1.04);
		animation-timing-function: ease-in-out;
	}
	100% {
		transform: none;
	}
`

export const sitJump = makeSitJump("140%")
export const headerSitJump = makeSitJump("82%")
