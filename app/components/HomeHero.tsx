"use client"
import type { ReactNode } from "react"
import { styled } from "styled-components"
import { Button } from "./Button"
import { links } from "../siteConfig"

//
// Types
//

type HomeHeroProps = {
	nextEventLink: string
	nextExternal: boolean
}

type SocialLink = {
	label: string
	href: string
	icon: ReactNode
}

//
// Constants
//

const mobileStackGap = "1rem"

const tagline =
	"A San Diego community for software developers at every stage who're eager to connect, exchange ideas, and grow with each other."

const socialLinks: SocialLink[] = [
	{
		label: "X",
		href: links.x,
		icon: (
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
				<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
			</svg>
		)
	},
	{
		label: "LinkedIn",
		href: links.linkedInUrl,
		icon: (
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 50 50">
				<path d="M41,4H9C6.24,4,4,6.24,4,9v32c0,2.76,2.24,5,5,5h32c2.76,0,5-2.24,5-5V9C46,6.24,43.76,4,41,4z M17,20v19h-6V20H17z M11,14.47c0-1.4,1.2-2.47,3-2.47s2.93,1.07,3,2.47c0,1.4-1.12,2.53-3,2.53C12.2,17,11,15.87,11,14.47z M39,39h-6c0,0,0-9.26,0-10 c0-2-1-4-3.5-4.04h-0.08C27,24.96,26,27.02,26,29c0,0.91,0,10,0,10h-6V20h6v2.56c0,0,1.93-2.56,5.81-2.56 c3.97,0,7.19,2.73,7.19,8.26V39z" />
			</svg>
		)
	},
	{
		label: "Youtube",
		href: links.youtube,
		icon: (
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
				<path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
			</svg>
		)
	},
	{
		label: "TikTok",
		href: links.tiktok,
		icon: (
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
				<path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74a2.89 2.89 0 0 1 2.31-4.64a2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
			</svg>
		)
	},
	{
		label: "Luma",
		href: links.lumaUrl,
		icon: (
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 133 134">
				<path d="M133 67C96.282 67 66.5 36.994 66.5 0c0 36.994-29.782 67-66.5 67 36.718 0 66.5 30.006 66.5 67 0-36.994 29.782-67 66.5-67" />
			</svg>
		)
	},
	{
		label: "Discord",
		href: links.discord,
		icon: (
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
				<path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02M8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12m6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12" />
			</svg>
		)
	},
	{
		label: "Github",
		href: links.github,
		icon: (
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
				<path d="M5.315 2.1c.791-.113 1.9.145 3.333.966l.272.161l.16.1l.397-.083a13.3 13.3 0 0 1 4.59-.08l.456.08l.396.083l.161-.1c1.385-.84 2.487-1.17 3.322-1.148l.164.008l.147.017l.076.014l.05.011l.144.047a1 1 0 0 1 .53.514a5.2 5.2 0 0 1 .397 2.91l-.047.267l-.046.196l.123.163c.574.795.93 1.728 1.03 2.707l.023.295L21 9.5c0 3.855-1.659 5.883-4.644 6.68l-.245.061l-.132.029l.014.161l.008.157l.004.365l-.002.213L16 21a1 1 0 0 1-.883.993L15 22H9a1 1 0 0 1-.993-.883L8 21v-.734c-1.818.26-3.03-.424-4.11-1.878l-.535-.766c-.28-.396-.455-.579-.589-.644l-.048-.019a1 1 0 0 1 .564-1.918c.642.188 1.074.568 1.57 1.239l.538.769c.76 1.079 1.36 1.459 2.609 1.191L8 17.562l-.018-.168a5 5 0 0 1-.021-.824l.017-.185l.019-.12l-.108-.024c-2.976-.71-4.703-2.573-4.875-6.139l-.01-.31L3 9.5a5.6 5.6 0 0 1 .908-3.051l.152-.222l.122-.163l-.045-.196a5.2 5.2 0 0 1 .145-2.642l.1-.282l.106-.253a1 1 0 0 1 .529-.514l.144-.047z" />
			</svg>
		)
	}
]

//
// Components
//

function HeroButtons({
	nextEventLink,
	nextExternal,
	size
}: HomeHeroProps & { size: "small" | "default" }) {
	return (
		<>
			<Button
				href={nextEventLink}
				target={nextExternal ? "_blank" : undefined}
				rel={nextExternal ? "noopener noreferrer" : undefined}
				variant="primary"
				size={size}
			>
				Join the Next Event
			</Button>
			<Button href="/watch" variant="secondary" size={size}>
				Watch Past Talks
			</Button>
			<Button href="/speak" variant="secondary" size={size}>
				Speak at an Event
			</Button>
		</>
	)
}

export function HomeHero({ nextEventLink, nextExternal }: HomeHeroProps) {
	return (
		<Stage>
			<HeroMedia aria-hidden="true">
				<source media="(min-width: 800px)" srcSet="/images/hero/room-wide.webp" />
				<img src="/images/hero/room-tall.webp" alt="" />
			</HeroMedia>
			<Panel>
				<Copy>
					<Title>DEVx San Diego</Title>
					<Logo src="/images/logo/devxsd-white-thick.svg" alt="" />
					<LogoDesktop src="/images/logo/devxsd-white.svg" alt="" />
					<Tagline>{tagline}</Tagline>
				</Copy>
				<Actions>
					<ButtonRow>
						<DesktopButtons>
							<HeroButtons
								nextEventLink={nextEventLink}
								nextExternal={nextExternal}
								size="default"
							/>
						</DesktopButtons>
						<MobileButtons>
							<HeroButtons nextEventLink={nextEventLink} nextExternal={nextExternal} size="small" />
						</MobileButtons>
					</ButtonRow>
					<SocialRow>
						{socialLinks.map((item) => (
							<SocialIcon
								key={item.label}
								href={item.href}
								aria-label={item.label}
								target="_blank"
								rel="noopener noreferrer"
							>
								{item.icon}
							</SocialIcon>
						))}
					</SocialRow>
				</Actions>
			</Panel>
		</Stage>
	)
}

const Stage = styled.section`
	position: relative;
	isolation: isolate;
	width: 100%;
	height: calc(100svh - 9.5rem - var(--announce-offset, 0px));
	min-height: min(22rem, calc(100svh - 9.5rem - var(--announce-offset, 0px)));
	overflow: hidden;
	background-color: #181818;
`

const HeroMedia = styled.picture`
	position: absolute;
	inset: 0;
	z-index: 0;

	img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center 35%;
	}
`

const Panel = styled.div`
	position: absolute;
	z-index: 1;
	right: 0;
	bottom: 3.75rem;
	left: 0;
	display: flex;
	align-items: flex-end;
	justify-content: space-between;
	gap: 1.25rem 2rem;
	width: min(2000px, calc(100% - 9rem));
	margin-inline: auto;

	@media (max-width: 860px) {
		bottom: 1.7rem;
		width: min(2000px, calc(100% - 3.4rem));
		flex-direction: column;
		align-items: stretch;
		gap: ${mobileStackGap};
	}
`

const Copy = styled.div`
	display: flex;
	flex: 1 1 18rem;
	flex-direction: column;
	align-items: flex-start;
	gap: 0.4rem;
	min-width: 0;

	@media (max-width: 860px) {
		flex: none;
		gap: ${mobileStackGap};
	}
`

const Title = styled.h1`
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

const Logo = styled.img`
	display: block;
	height: 3.15rem;
	width: auto;
	max-width: 100%;

	@media (min-width: 861px) {
		display: none;
	}
`

const LogoDesktop = styled.img`
	display: none;

	@media (min-width: 861px) {
		display: block;
		height: auto;
		width: auto;
		max-height: clamp(6.9rem, 9.75vw, 9rem);
		max-width: 100%;
	}
`

const Tagline = styled.p`
	max-width: 28rem;
	margin: 0;
	font-size: 1rem;
	line-height: 1.45;
	text-wrap: balance;
	color: #ffffff;
	text-shadow: 0 1px 2px rgba(24, 24, 24, 0.9);

	@media (min-width: 861px) {
		max-width: 36rem;
		font-size: 1.5rem;
		line-height: 1.35;
	}
`

const Actions = styled.div`
	display: flex;
	flex: 0 1 auto;
	flex-direction: column;
	align-items: flex-end;
	justify-content: center;
	gap: 0.7rem;

	@media (max-width: 860px) {
		align-items: flex-start;
		align-self: stretch;
		gap: ${mobileStackGap};
	}
`

const ButtonRow = styled.div`
	--foreground: #ffffff;
	--foreground-rgb: 255, 255, 255;
	--background: #181818;
	--background-rgb: 24, 24, 24;
`

const DesktopButtons = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 0.65rem;
	justify-content: flex-end;

	@media (max-width: 860px) {
		display: none;
	}
`

const MobileButtons = styled.div`
	display: none;

	@media (max-width: 860px) {
		display: flex;
		flex-wrap: wrap;
		gap: 0.45rem;
		justify-content: flex-start;

		a {
			padding: 0.35rem 0.7rem;
			font-size: 0.78rem;
			font-weight: 600;
		}
	}
`

const SocialRow = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 0.85rem;
	align-items: center;
	color: #ffffff;
`

const SocialIcon = styled.a`
	display: flex;
	align-items: center;
	color: inherit;
	filter: drop-shadow(0 1px 1px rgba(24, 24, 24, 0.85));
	transition: color 0.2s ease;

	svg {
		fill: currentColor;
	}

	&:hover {
		color: var(--extrusion);
	}
`
