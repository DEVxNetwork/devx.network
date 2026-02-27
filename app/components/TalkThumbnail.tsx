"use client"
import { useId } from "react"
import styled from "styled-components"

//
// Types
//

export type TalkThumbnailData = {
	speakerName: string
	hook: string
	profilePhotoUrl?: string
}

export type TalkThumbnailProps = TalkThumbnailData & {
	/** Width in pixels; height is derived for 16:9 (YouTube thumbnail). */
	width?: number
	className?: string
}

//
// Constants
//

const ASPECT_RATIO = 16 / 9
const DEFAULT_WIDTH = 640
const BG_IMAGE_PATH = "/images/devx-thumbnail-bg.png"
const LOGO_IMAGE_PATH = "/images/sd-devx-brand.png"

//
// Components
//

/**
 * Renders a DEVx-style talk video thumbnail matching the DEVxYouTubeThumbnail.svg
 * template layout: hook text on the left, circular speaker photo on the right,
 * DEVxSD branding at bottom-left, dark silk texture background.
 *
 * 16:9 aspect ratio (YouTube standard 1280x720).
 */
export function TalkThumbnail({
	speakerName,
	hook,
	profilePhotoUrl,
	width = DEFAULT_WIDTH,
	className
}: TalkThumbnailProps) {
	const clipId = useId()
	const height = Math.round(width / ASPECT_RATIO)

	// Layout proportions matching the template
	const pad = width * 0.06
	const photoRadius = Math.round(height * 0.3)
	const photoBackdropRadius = photoRadius + Math.round(width * 0.01)
	const photoCx = width - pad - photoBackdropRadius
	const photoCy = height * 0.44
	const titleX = pad
	const photoLeftEdge = photoCx - photoBackdropRadius
	const titleGap = width * 0.04
	const titleMaxWidth = photoLeftEdge - pad - titleGap
	const titleFontSize = Math.round(width * 0.058)
	const titleY = height * 0.38
	const logoWidth = Math.round(width * 0.18)
	const logoHeight = Math.round(logoWidth * (582 / 2772))
	const logoX = pad
	const logoY = height - pad - logoHeight

	const titleLines = wrapText(hook || "Your Hook", titleMaxWidth, titleFontSize)

	return (
		<Wrapper className={className} $width={width} $height={height}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				xmlnsXlink="http://www.w3.org/1999/xlink"
				viewBox={`0 0 ${width} ${height}`}
				width="100%"
				height="100%"
				preserveAspectRatio="xMidYMid meet"
				aria-label={`Talk thumbnail: ${hook} by ${speakerName}`}
			>
				<defs>
					{profilePhotoUrl ? (
						<clipPath id={clipId}>
							<circle cx={photoCx} cy={photoCy} r={photoRadius} />
						</clipPath>
					) : null}
				</defs>

				{/* Dark silk texture background */}
				<image
					href={BG_IMAGE_PATH}
					x={0}
					y={0}
					width={width}
					height={height}
					preserveAspectRatio="xMidYMid slice"
				/>

				{/* Speaker photo circle with light backdrop — right side */}
				{profilePhotoUrl ? (
					<>
						<circle
							cx={photoCx}
							cy={photoCy}
							r={photoBackdropRadius}
							fill="rgba(200, 200, 200, 0.25)"
						/>
						<image
							href={profilePhotoUrl}
							x={photoCx - photoRadius}
							y={photoCy - photoRadius}
							width={photoRadius * 2}
							height={photoRadius * 2}
							clipPath={`url(#${clipId})`}
							preserveAspectRatio="xMidYMid slice"
						/>
					</>
				) : (
					<circle
						cx={photoCx}
						cy={photoCy}
						r={photoRadius}
						fill="rgba(255, 255, 255, 0.06)"
						stroke="rgba(255, 255, 255, 0.1)"
						strokeWidth={2}
					/>
				)}

				{/* Hook text — large bold white, left side */}
				<text
					x={titleX}
					y={titleY}
					fill="#ffffff"
					fontFamily="'Chivo', 'Helvetica Neue', Helvetica, Arial, sans-serif"
					fontSize={titleFontSize}
					fontWeight="400"
				>
					{titleLines.map((line, i) => (
						<tspan key={i} x={titleX} dy={i === 0 ? 0 : titleFontSize * 1.15}>
							{line}
						</tspan>
					))}
				</text>

				{/* DEVxSD branding — bottom left */}
				<image
					href={LOGO_IMAGE_PATH}
					x={logoX}
					y={logoY}
					width={logoWidth}
					height={logoHeight}
					opacity={0.9}
				/>
			</svg>
		</Wrapper>
	)
}

const Wrapper = styled.div<{ $width: number; $height: number }>`
	width: ${(p) => p.$width}px;
	max-width: 100%;
	aspect-ratio: 16 / 9;
	overflow: hidden;
	border-radius: 0.5rem;
	border: 1px solid rgba(255, 255, 255, 0.1);
	background: #0a0a0a;

	svg {
		display: block;
		width: 100%;
		height: auto;
	}
`

//
// Functions
//

/** Wrap text into lines that fit within maxWidth, max 3 lines. */
function wrapText(text: string, maxWidth: number, fontSize: number): string[] {
	if (!text.trim()) return ["Your Hook"]
	const words = text.trim().split(/\s+/)
	const approxCharWidth = fontSize * 0.52
	const maxLines = 3
	const lines: string[] = []
	let current = ""

	for (const word of words) {
		const candidate = current ? `${current} ${word}` : word
		if (candidate.length * approxCharWidth <= maxWidth) {
			current = candidate
		} else {
			if (current) lines.push(current)
			if (lines.length >= maxLines) {
				const last = lines[lines.length - 1]
				if (last && word) {
					lines[lines.length - 1] = last + "..."
				}
				return lines
			}
			current = word
		}
	}
	if (current && lines.length < maxLines) lines.push(current)
	return lines
}
