"use client"
import { useEffect, useState } from "react"
import styled, { keyframes } from "styled-components"
import { AnimatePresence, motion } from "framer-motion"
import { organizers } from "./info/organizers"
import { links } from "./siteConfig"
import { Button } from "./components/Button"
import { ErrorBoundary } from "./components/ErrorBoundary"
import { PotionBackground } from "./components/PotionBackground"
import { lumaService } from "./services/luma"
import type { LumaEvent } from "./services/luma"

// Constants //

const heroAccentCycle = keyframes`
	0%,
	100% {
		filter: hue-rotate(0deg) brightness(1.05);
		text-shadow:
			0 0 0.04em rgba(255, 64, 96, 0.35),
			0 0 0.09em rgba(64, 224, 255, 0.25),
			0 0 0.14em rgba(190, 90, 255, 0.18);
	}

	50% {
		filter: hue-rotate(180deg) brightness(1.25);
		text-shadow:
			0 0 0.08em rgba(255, 90, 120, 0.72),
			0 0 0.15em rgba(90, 235, 255, 0.56),
			0 0 0.22em rgba(215, 120, 255, 0.42);
	}
`

const heroLocations = [
	{ code: "SD", city: "San Diego" },
	{ code: "LA", city: "Los Angeles" },
	{ code: "SF", city: "San Francisco" }
] as const

const aboutItems = [
	{
		title: "Connects everyone",
		copy: "We're a community of developers of all skill levels, hosted by organizers who want everyone to have a place to learn, meet people, and share what they're working on.",
		image: "/images/slides/slide1.webp"
	},
	{
		title: "Inspires ideas",
		copy: "Our monthly meetups pair good food and real conversation with talks from local developers. Members can present an idea, demo a project, or ask the room for help.",
		image: "/images/slides/slide3.webp"
	},
	{
		title: "Builds together",
		copy: "After the talks, we break into groups for project showcases, coding help, and casual networking. Bring your laptop and leave with feedback, collaborators, or a problem solved.",
		image: "/images/slides/slide5.webp"
	}
] as const

// Components //

export default function Home() {
	const [currentHeroLocationIndex, setCurrentHeroLocationIndex] = useState(0)

	const [activeAboutIndex, setActiveAboutIndex] = useState(0)

	// Next event state
	const [nextEvent, setNextEvent] = useState<LumaEvent | null>(null)

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentHeroLocationIndex((previousIndex) => (previousIndex + 1) % heroLocations.length)
		}, 3000)

		return () => clearInterval(interval)
	}, [])

	// Fetch next upcoming event
	useEffect(() => {
		const loadNextEvent = async () => {
			try {
				const allEvents = await lumaService.listEvents()
				const now = new Date()
				const upcomingEvents = allEvents
					.filter((event) => new Date(event.start_at) >= now)
					.sort((a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime())

				if (upcomingEvents.length > 0) {
					setNextEvent(upcomingEvents[0])
				}
			} catch (error) {
				console.error("Failed to load next event:", error)
			}
		}

		loadNextEvent()
	}, [])

	const nextEventLink = nextEvent ? `/events/${nextEvent.api_id}` : "/events"
	const heroLocation = heroLocations[currentHeroLocationIndex]

	return (
		<>
			<BackgroundContainer>
				<ErrorBoundary
					fallback={
						<div style={{ backgroundColor: "var(--background)", width: "100%", height: "100%" }} />
					}
				>
					<PotionBackground />
				</ErrorBoundary>
			</BackgroundContainer>
			<Main>
				<Hero>
					<HeroEyebrow>{heroLocation.city}</HeroEyebrow>
					<HeroWordmark aria-label={`DEVx ${heroLocation.code}`}>
						<HeroWordmarkBase>DEV</HeroWordmarkBase>
						<HeroWordmarkAccent aria-label="x">
							<HeroWordmarkAccentFill aria-hidden="true">x</HeroWordmarkAccentFill>
							<HeroWordmarkAccentOutline aria-hidden="true">x</HeroWordmarkAccentOutline>
						</HeroWordmarkAccent>
						<HeroLocationSlot aria-hidden="true">
							<AnimatePresence initial={false}>
								<HeroLocationCode
									key={heroLocation.code}
									initial={{ opacity: 0, x: "-0.35em", y: "0.45em" }}
									animate={{ opacity: 1, x: 0, y: 0 }}
									exit={{ opacity: 0, x: "0.35em", y: "-0.45em" }}
									transition={{ duration: 0.35, ease: "easeInOut" }}
								>
									{heroLocation.code}
								</HeroLocationCode>
							</AnimatePresence>
						</HeroLocationSlot>
					</HeroWordmark>
					<HeroTagline>
						A developer community of events and open-source projects in {heroLocation.city},
						California.
					</HeroTagline>
					<HeroActions>
						<Button href={nextEventLink} variant="primary" size="default">
							Join the Next Event
						</Button>
						<Button href="/watch" variant="secondary" size="default">
							Watch Past Talks
						</Button>
					</HeroActions>
					<HeroSocialLinks>
						<HeroSocialIcon href={links.x} aria-label="X" target="_blank">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="currentColor"
							>
								<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
							</svg>
						</HeroSocialIcon>
						<HeroSocialIcon href={links.linkedInUrl} aria-label="LinkedIn" target="_blank">
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 50 50">
								<path d="M41,4H9C6.24,4,4,6.24,4,9v32c0,2.76,2.24,5,5,5h32c2.76,0,5-2.24,5-5V9C46,6.24,43.76,4,41,4z M17,20v19h-6V20H17z M11,14.47c0-1.4,1.2-2.47,3-2.47s2.93,1.07,3,2.47c0,1.4-1.12,2.53-3,2.53C12.2,17,11,15.87,11,14.47z M39,39h-6c0,0,0-9.26,0-10 c0-2-1-4-3.5-4.04h-0.08C27,24.96,26,27.02,26,29c0,0.91,0,10,0,10h-6V20h6v2.56c0,0,1.93-2.56,5.81-2.56 c3.97,0,7.19,2.73,7.19,8.26V39z" />
							</svg>
						</HeroSocialIcon>
						<HeroSocialIcon href={links.youtube} aria-label="Youtube" target="_blank">
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
								<path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
							</svg>
						</HeroSocialIcon>
						<HeroSocialIcon href={links.tiktok} aria-label="TikTok" target="_blank">
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
								<path
									fill="currentColor"
									d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74a2.89 2.89 0 0 1 2.31-4.64a2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"
								/>
							</svg>
						</HeroSocialIcon>
						<HeroSocialIcon href={links.lumaUrl} aria-label="Luma" target="_blank">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								width="20"
								height="20"
								viewBox="0 0 133 134"
							>
								<path
									fill="currentColor"
									d="M133 67C96.282 67 66.5 36.994 66.5 0c0 36.994-29.782 67-66.5 67 36.718 0 66.5 30.006 66.5 67 0-36.994 29.782-67 66.5-67"
								></path>
							</svg>
						</HeroSocialIcon>
						<HeroSocialIcon href={links.discord} aria-label="Discord" target="_blank">
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
								<path
									fill="currentColor"
									d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02M8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12m6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12"
								></path>
							</svg>
						</HeroSocialIcon>
						<HeroSocialIcon href={links.github} aria-label="Github" target="_blank">
							<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24">
								<path
									fill="currentColor"
									d="M5.315 2.1c.791-.113 1.9.145 3.333.966l.272.161l.16.1l.397-.083a13.3 13.3 0 0 1 4.59-.08l.456.08l.396.083l.161-.1c1.385-.84 2.487-1.17 3.322-1.148l.164.008l.147.017l.076.014l.05.011l.144.047a1 1 0 0 1 .53.514a5.2 5.2 0 0 1 .397 2.91l-.047.267l-.046.196l.123.163c.574.795.93 1.728 1.03 2.707l.023.295L21 9.5c0 3.855-1.659 5.883-4.644 6.68l-.245.061l-.132.029l.014.161l.008.157l.004.365l-.002.213L16 21a1 1 0 0 1-.883.993L15 22H9a1 1 0 0 1-.993-.883L8 21v-.734c-1.818.26-3.03-.424-4.11-1.878l-.535-.766c-.28-.396-.455-.579-.589-.644l-.048-.019a1 1 0 0 1 .564-1.918c.642.188 1.074.568 1.57 1.239l.538.769c.76 1.079 1.36 1.459 2.609 1.191L8 17.562l-.018-.168a5 5 0 0 1-.021-.824l.017-.185l.019-.12l-.108-.024c-2.976-.71-4.703-2.573-4.875-6.139l-.01-.31L3 9.5a5.6 5.6 0 0 1 .908-3.051l.152-.222l.122-.163l-.045-.196a5.2 5.2 0 0 1 .145-2.642l.1-.282l.106-.253a1 1 0 0 1 .529-.514l.144-.047z"
								/>
							</svg>
						</HeroSocialIcon>
					</HeroSocialLinks>
				</Hero>

				<AboutSection>
					<AboutLayout>
						<AboutSummary>
							<SectionEyebrow>About us</SectionEyebrow>
							<AboutLead>A community that</AboutLead>
						</AboutSummary>
						<AboutAccordion>
							{aboutItems.map((item, index) => {
								const isActive = activeAboutIndex === index
								const panelId = `about-panel-${index}`

								return (
									<AboutAccordionItem key={item.title} $active={isActive} $image={item.image}>
										<AboutAccordionButton
											type="button"
											$active={isActive}
											aria-expanded={isActive}
											aria-controls={panelId}
											onClick={() => setActiveAboutIndex(index)}
										>
											<AboutItemIndex>0{index + 1}</AboutItemIndex>
											<AboutItemTitle>{item.title}</AboutItemTitle>
											<AboutItemIndicator aria-hidden="true">
												{isActive ? "−" : "+"}
											</AboutItemIndicator>
										</AboutAccordionButton>
										<AboutPanel id={panelId} $active={isActive}>
											<AboutPanelClip>
												<AboutPanelContent>
													<AboutPanelCopy>{item.copy}</AboutPanelCopy>
												</AboutPanelContent>
											</AboutPanelClip>
										</AboutPanel>
									</AboutAccordionItem>
								)
							})}
						</AboutAccordion>
					</AboutLayout>
				</AboutSection>

				<ContentSection>
					<SectionEyebrow $center>Organizers</SectionEyebrow>
					<SectionTitle $center>The people behind DEVx</SectionTitle>
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
								<LinkedInIcon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
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
						<Button href={nextEventLink} variant="primary" size="default">
							Join the Next Event
						</Button>
					</JoinPanel>
				</JoinSection>
			</Main>
		</>
	)
}

// Styled Components //

const Main = styled.main`
	display: flex;
	flex-direction: column;
	align-items: center;
`

const BackgroundContainer = styled.section`
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background-color: var(--background);
`

const Hero = styled.section`
	width: 100%;
	max-width: 900px;
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
	padding: 6rem 1.5rem 5rem;

	@media (max-width: 768px) {
		padding: 3.5rem 1.5rem 3rem;
	}
`

const HeroEyebrow = styled.p`
	text-transform: uppercase;
	letter-spacing: 0.2em;
	font-size: 0.85rem;
	font-weight: 700;
	color: var(--accent);
	margin: 0 0 1rem 0;
`

const HeroWordmark = styled.h1`
	display: flex;
	align-items: baseline;
	justify-content: center;
	font-size: clamp(4rem, 13vw, 8rem);
	font-weight: 900;
	letter-spacing: -0.04em;
	line-height: 1;
	margin: 0;
	color: var(--foreground);
`

const HeroWordmarkBase = styled.span`
	color: var(--foreground);
`

const HeroWordmarkAccent = styled.span`
	display: inline-grid;
	align-items: baseline;
`

const HeroWordmarkAccentFill = styled.span`
	grid-area: 1 / 1;
	display: inline-block;
	padding: 0.12em;
	margin: -0.12em;
	color: transparent;
	background: linear-gradient(
		45deg,
		#ff0000 0%,
		#ff7f00 12.5%,
		#ffff00 25%,
		#00ff00 37.5%,
		#00ffff 50%,
		#0000ff 62.5%,
		#4b0082 75%,
		#9400d3 87.5%,
		#ff0000 100%
	);
	background-size: 100% 100%;
	background-clip: text;
	-webkit-background-clip: text;
	text-shadow:
		0 0 0.04em rgba(255, 64, 96, 0.35),
		0 0 0.09em rgba(64, 224, 255, 0.25),
		0 0 0.14em rgba(190, 90, 255, 0.18);
	animation: ${heroAccentCycle} 4s ease-in-out infinite;
	will-change: filter, text-shadow;

	@media (prefers-reduced-motion: reduce) {
		animation: none;
		filter: none;
	}
`

const HeroWordmarkAccentOutline = styled.span`
	grid-area: 1 / 1;
	display: inline-block;
	padding: 0.12em;
	margin: -0.12em;
	color: transparent;
	-webkit-text-stroke: 1px white;
	paint-order: stroke fill;
`

const HeroLocationSlot = styled.span`
	display: inline-grid;
	width: 2ch;
	color: var(--foreground);
`

const HeroLocationCode = styled(motion.span)`
	grid-area: 1 / 1;
	display: inline-block;
	color: transparent;
	-webkit-text-stroke: 2px var(--foreground);
	letter-spacing: -0.04em;
	paint-order: stroke fill;
`

const HeroTagline = styled.p`
	font-size: 1.25rem;
	color: var(--muted-foreground);
	max-width: 620px;
	margin: 1.5rem 0 0 0;

	@media (max-width: 768px) {
		font-size: 1.1rem;
	}
`

const HeroActions = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 1rem;
	justify-content: center;
	margin-top: 2.25rem;
`

const HeroSocialLinks = styled.div`
	display: flex;
	gap: 1.5rem;
	align-items: center;
	justify-content: center;
	margin-top: 3rem;
`

const HeroSocialIcon = styled.a`
	display: flex;
	align-items: center;
	color: var(--subtle-foreground);
	transition: color 0.2s ease;

	svg {
		fill: currentColor;
	}

	&:hover {
		color: var(--accent);
	}
`

const AboutSection = styled.section`
	width: 100%;
	padding: 3rem 0;

	@media (max-width: 768px) {
		padding: 1rem 0;
	}
`

const AboutLayout = styled.div`
	display: flex;
	width: 100%;
	min-height: 620px;
	background-color: var(--surface-solid);
	border-top: 1px solid var(--border);
	border-bottom: 1px solid var(--border);
	overflow: hidden;

	@media (max-width: 800px) {
		min-height: 0;
		flex-direction: column;
	}
`

const AboutSummary = styled.div`
	flex: 0 0 clamp(240px, 25vw, 380px);
	padding: 2.5rem;
	border-right: 1px solid var(--border);

	@media (max-width: 800px) {
		flex-basis: auto;
		border-right: none;
		border-bottom: 1px solid var(--border);
	}
`

const AboutLead = styled.h2`
	font-size: clamp(2rem, 4vw, 3.5rem);
	font-weight: 800;
	line-height: 1.05;
	margin: 0;
	color: var(--foreground);
`

const AboutAccordion = styled.div`
	display: flex;
	flex: 1;
	min-width: 0;

	@media (max-width: 800px) {
		flex-direction: column;
	}
`

const AboutAccordionItem = styled.div<{ $active: boolean; $image: string }>`
	display: flex;
	flex: ${(props) => (props.$active ? "5 1 0" : "1 1 0")};
	flex-direction: column;
	min-width: 0;
	overflow: hidden;
	border-left: 1px solid rgba(255, 255, 255, 0.2);
	background-image: ${(props) =>
		`linear-gradient(rgba(5, 5, 8, ${props.$active ? 0.48 : 0.7}), rgba(5, 5, 8, ${
			props.$active ? 0.78 : 0.84
		})), url("${props.$image}")`};
	background-position: center;
	background-size: cover;
	transition: flex 0.5s ease;

	&:first-child {
		border-left: none;
	}

	@media (max-width: 800px) {
		flex: none;
		border-top: 1px solid rgba(255, 255, 255, 0.2);
		border-left: none;

		&:first-child {
			border-top: none;
		}
	}
`

const AboutAccordionButton = styled.button<{ $active: boolean }>`
	display: ${(props) => (props.$active ? "grid" : "flex")};
	grid-template-columns: 3rem minmax(0, 1fr) auto;
	flex: ${(props) => (props.$active ? "none" : "1")};
	flex-direction: column;
	gap: 1rem;
	align-items: center;
	justify-content: ${(props) => (props.$active ? "normal" : "space-between")};
	width: 100%;
	min-height: ${(props) => (props.$active ? "auto" : "100%")};
	padding: 1.5rem 2rem;
	border: none;
	background: transparent;
	color: ${(props) => (props.$active ? "#ffffff" : "rgba(255, 255, 255, 0.72)")};
	font: inherit;
	text-align: left;
	cursor: pointer;
	transition: color 0.2s ease;

	&:hover,
	&:focus-visible {
		color: #ffffff;
	}

	&:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: -2px;
	}

	@media (max-width: 800px) {
		display: grid;
		grid-template-columns: 2rem minmax(0, 1fr) auto;
		flex: none;
		flex-direction: row;
		gap: 0.5rem;
		align-items: center;
		min-height: auto;
		padding: 1.25rem;
	}
`

const AboutItemIndex = styled.span`
	align-self: start;
	padding-top: 0.4rem;
	font-size: 0.8rem;
	font-weight: 700;
`

const AboutItemTitle = styled.span`
	font-size: clamp(2.25rem, 5.5vw, 4.75rem);
	font-weight: 500;
	letter-spacing: -0.04em;
	line-height: 0.95;

	${AboutAccordionButton}:not([aria-expanded="true"]) & {
		font-size: clamp(1.5rem, 2.5vw, 2.5rem);
		writing-mode: vertical-rl;
		transform: rotate(180deg);
	}

	@media (max-width: 800px) {
		${AboutAccordionButton}:not([aria-expanded="true"]) & {
			font-size: clamp(2rem, 9vw, 3.5rem);
			writing-mode: horizontal-tb;
			transform: none;
		}
	}
`

const AboutItemIndicator = styled.span`
	font-size: 1.75rem;
	font-weight: 300;
`

const AboutPanel = styled.div<{ $active: boolean }>`
	display: grid;
	flex: ${(props) => (props.$active ? "1" : "0")};
	min-height: 0;
	grid-template-rows: ${(props) => (props.$active ? "1fr" : "0fr")};
	opacity: ${(props) => (props.$active ? 1 : 0)};
	transition:
		flex 0.45s ease,
		grid-template-rows 0.45s ease,
		opacity 0.3s ease;
`

const AboutPanelClip = styled.div`
	min-height: 0;
	overflow: hidden;
`

const AboutPanelContent = styled.div`
	display: flex;
	align-items: flex-end;
	height: 100%;
	padding: 0 2rem 2rem 6rem;

	@media (max-width: 900px) {
		padding-left: 2rem;
	}

	@media (max-width: 600px) {
		padding: 0 1.25rem 1.5rem;
	}
`

const AboutPanelCopy = styled.p`
	max-width: 560px;
	font-size: 1.05rem;
	line-height: 1.7;
	color: rgba(255, 255, 255, 0.88);
	margin: 0;
`

const SectionEyebrow = styled.p<{ $center?: boolean }>`
	text-transform: uppercase;
	letter-spacing: 0.2em;
	font-size: 0.85rem;
	font-weight: 700;
	color: var(--accent);
	margin: 0 0 0.75rem 0;
	text-align: ${(props) => (props.$center ? "center" : "left")};
`

const SectionTitle = styled.h2<{ $center?: boolean }>`
	font-size: clamp(1.75rem, 4vw, 2.75rem);
	font-weight: 800;
	margin: 0 0 1.5rem 0;
	color: var(--foreground);
	text-align: ${(props) => (props.$center ? "center" : "left")};
	max-width: 720px;
	${(props) => props.$center && "margin-left: auto; margin-right: auto;"}
`

const ContentSection = styled.section`
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
`

const OrganizerCard = styled.a`
	background-color: var(--surface-solid);
	border: 1px solid var(--border);
	padding: 2.5rem 1.5rem;
	border-radius: 1rem;
	text-align: center;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
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
`

const OrganizerImage = styled.img`
	width: 7rem;
	height: 7rem;
	object-fit: cover;
	border-radius: 50%;
	margin: 0 auto 1rem auto;
	border: 3px solid var(--border);
`

const OrganizerName = styled.h3`
	font-size: 1.1rem;
	font-weight: 700;
	margin: 0;
	color: var(--foreground);
`

const LinkedInIcon = styled.svg`
	height: 1.5rem;
	width: 1.5rem;
	fill: var(--subtle-foreground);
	margin-top: 0.75rem;
`

const JoinSection = styled.section`
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
