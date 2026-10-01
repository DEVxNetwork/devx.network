"use client"
import { useId } from "react"
import { xDudeMarkup } from "./xDudeMarkup"

//
// Types
//

export type XDudeProps = {
	className?: string
}

//
// Constants
//

// Face space is the flipped wordmark group: +Y is up on screen.
const eyeY = 248
const eyeLeft = 252
const eyeRight = 338
const eyeR = 32
const pupilR = 13
const glintR = 5

const faceBits = `
<g class="eyes">
	<circle cx="${eyeLeft}" cy="${eyeY}" r="${eyeR}" fill="#ffffff" stroke="#181818" stroke-width="8"/>
	<circle cx="${eyeRight}" cy="${eyeY}" r="${eyeR}" fill="#ffffff" stroke="#181818" stroke-width="8"/>
	<g class="pupils">
		<circle cx="${eyeLeft}" cy="${eyeY}" r="${pupilR}" fill="#181818"/>
		<circle cx="${eyeLeft - 7}" cy="${eyeY + 8}" r="${glintR}" fill="#ffffff"/>
		<circle cx="${eyeRight}" cy="${eyeY}" r="${pupilR}" fill="#181818"/>
		<circle cx="${eyeRight - 7}" cy="${eyeY + 8}" r="${glintR}" fill="#ffffff"/>
	</g>
</g>
<g class="mouth" fill="none" stroke="#181818" stroke-width="8" stroke-linecap="round">
	<path d="M268 220 Q295 162 322 220"/>
</g>`

//
// Components
//

export function XDude({ className }: XDudeProps) {
	const clipId = `intro-x-${useId().replace(/:/g, "")}`
	const markup = xDudeMarkup.replaceAll("%%CLIP%%", clipId).replace(/<\/g>\s*$/, `${faceBits}</g>`)

	return (
		<svg
			className={className}
			viewBox="0 0 307.2 336.3"
			fill="none"
			overflow="visible"
			aria-hidden="true"
		>
			<g
				transform="translate(0,238.4) scale(0.46,-0.46)"
				dangerouslySetInnerHTML={{ __html: markup }}
			/>
		</svg>
	)
}
