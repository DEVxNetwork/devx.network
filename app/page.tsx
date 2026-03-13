"use client"
import { useRef, useState, useEffect } from "react"
import styled from "styled-components"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { organizers } from "./info/organizers"
import { links } from "./siteConfig"
import { PotionBackground } from "./components/PotionBackground"
import { ErrorBoundary } from "./components/ErrorBoundary"
import { Button } from "./components/Button"
import { lumaService } from "./services/luma"
import type { LumaEvent } from "./services/luma"

// Constants //

const sliderImages = [
	"/images/slides/slide1.webp",
	"/images/slides/slide2.webp",
	"/images/slides/slide3.webp",
	"/images/slides/slide4.webp",
	"/images/slides/slide5.webp",
	"/images/slides/slide6.webp"
]

// Components //

export default function Home() {
	// Add refs for each animated section
	const heroRef = useRef(null)
	const firstLineRef = useRef(null)
	const secondLineRef = useRef(null)
	const thirdLineRef = useRef(null)
	const aboutRef = useRef(null)
	const organizersRef = useRef(null)
	const joinRef = useRef(null)

	// Use IntersectionObserver to check if sections are in view
	const heroInView = useInView(heroRef, { amount: 0.3 })
	const firstLineView = useInView(firstLineRef, { amount: 0.4 })
	const secondLineView = useInView(secondLineRef, { amount: 0.4 })
	const thirdLineView = useInView(thirdLineRef, { amount: 0.4 })
	const aboutInView = useInView(aboutRef, { amount: 0.2 })
	const organizersInView = useInView(organizersRef, { amount: 0.3 })

	// Image slider state
	const [currentImageIndex, setCurrentImageIndex] = useState(0)

	// Next event state
	const [nextEvent, setNextEvent] = useState<LumaEvent | null>(null)

	// Auto-advance slider
	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentImageIndex((prevIndex) => (prevIndex + 1) % sliderImages.length)
		}, 4000) // Change image every 4 seconds

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

	const joinInView = useInView(joinRef, { amount: 0.3 })

	// Determine the link for the next event button
	const nextEventLink = nextEvent ? `/events/${nextEvent.api_id}` : "/events"

	return (
		<>
			<BackgroundContainer>
				<ErrorBoundary
					fallback={<div style={{ backgroundColor: "black", width: "100%", height: "100%" }} />}
				>
					<PotionBackground />
				</ErrorBoundary>
			</BackgroundContainer>
			<Main>
				<Hero>
					<HeroSection
						ref={heroRef}
						animate={{
							opacity: heroInView ? 1 : 0,
							scale: heroInView ? 1 : 0.95
						}}
						transition={{ duration: 0.6, ease: "easeOut" }}
						as={motion.section}
					>
						<HeroImage src="/images/sd-devx-brand.png" alt="Developer meetup hero" />
					</HeroSection>
					<Tagline
						animate={{
							opacity: heroInView ? 1 : 0,
							scale: heroInView ? 1 : 0.95
						}}
						transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
						as={motion.section}
					>
						<TaglineText>
							A developer community of events and open-source projects in San Diego, California.
						</TaglineText>
					</Tagline>
					<HeroButtonContainer
						animate={{
							opacity: heroInView ? 1 : 0,
							y: heroInView ? 0 : 20
						}}
						transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
						as={motion.div}
					>
						<Button href={nextEventLink} size="default">
							Join the Next Event
						</Button>
					</HeroButtonContainer>
					<HeroSocialLinks
						animate={{
							opacity: heroInView ? 1 : 0,
							y: heroInView ? 0 : 20
						}}
						transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
						as={motion.div}
					>
						<HeroSocialIcon href={links.x} aria-label="X" target="_blank">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="currentColor"
							>
								<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
							</svg>
						</HeroSocialIcon>
						<HeroSocialIcon href={links.linkedInUrl} aria-label="LinkedIn" target="_blank">
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 50 50">
								<path d="M41,4H9C6.24,4,4,6.24,4,9v32c0,2.76,2.24,5,5,5h32c2.76,0,5-2.24,5-5V9C46,6.24,43.76,4,41,4z M17,20v19h-6V20H17z M11,14.47c0-1.4,1.2-2.47,3-2.47s2.93,1.07,3,2.47c0,1.4-1.12,2.53-3,2.53C12.2,17,11,15.87,11,14.47z M39,39h-6c0,0,0-9.26,0-10 c0-2-1-4-3.5-4.04h-0.08C27,24.96,26,27.02,26,29c0,0.91,0,10,0,10h-6V20h6v2.56c0,0,1.93-2.56,5.81-2.56 c3.97,0,7.19,2.73,7.19,8.26V39z" />
							</svg>
						</HeroSocialIcon>
						<HeroSocialIcon href={links.youtube} aria-label="Youtube" target="_blank">
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
								<path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
							</svg>
						</HeroSocialIcon>
						<HeroSocialIcon href={links.tiktok} aria-label="TikTok" target="_blank">
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
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
								width="24"
								height="24"
								viewBox="0 0 133 134"
							>
								<path
									fill="currentColor"
									d="M133 67C96.282 67 66.5 36.994 66.5 0c0 36.994-29.782 67-66.5 67 36.718 0 66.5 30.006 66.5 67 0-36.994 29.782-67 66.5-67"
								></path>
							</svg>
						</HeroSocialIcon>
						<HeroSocialIcon href={links.discord} aria-label="Discord" target="_blank">
							<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24">
								<path
									fill="currentColor"
									d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02M8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12m6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12"
								></path>
							</svg>
						</HeroSocialIcon>
						<HeroSocialIcon href={links.github} aria-label="Github" target="_blank">
							<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
								<path
									fill="currentColor"
									d="M5.315 2.1c.791-.113 1.9.145 3.333.966l.272.161l.16.1l.397-.083a13.3 13.3 0 0 1 4.59-.08l.456.08l.396.083l.161-.1c1.385-.84 2.487-1.17 3.322-1.148l.164.008l.147.017l.076.014l.05.011l.144.047a1 1 0 0 1 .53.514a5.2 5.2 0 0 1 .397 2.91l-.047.267l-.046.196l.123.163c.574.795.93 1.728 1.03 2.707l.023.295L21 9.5c0 3.855-1.659 5.883-4.644 6.68l-.245.061l-.132.029l.014.161l.008.157l.004.365l-.002.213L16 21a1 1 0 0 1-.883.993L15 22H9a1 1 0 0 1-.993-.883L8 21v-.734c-1.818.26-3.03-.424-4.11-1.878l-.535-.766c-.28-.396-.455-.579-.589-.644l-.048-.019a1 1 0 0 1 .564-1.918c.642.188 1.074.568 1.57 1.239l.538.769c.76 1.079 1.36 1.459 2.609 1.191L8 17.562l-.018-.168a5 5 0 0 1-.021-.824l.017-.185l.019-.12l-.108-.024c-2.976-.71-4.703-2.573-4.875-6.139l-.01-.31L3 9.5a5.6 5.6 0 0 1 .908-3.051l.152-.222l.122-.163l-.045-.196a5.2 5.2 0 0 1 .145-2.642l.1-.282l.106-.253a1 1 0 0 1 .529-.514l.144-.047z"
								/>
							</svg>
						</HeroSocialIcon>
					</HeroSocialLinks>
				</Hero>

				<ScrollFeatureSection ref={firstLineRef}>
					<ScrollFeatureTitle
						animate={{
							x: firstLineView ? 0 : "-100%",
							opacity: firstLineView ? 1 : 0
						}}
						transition={{ duration: 0.9, ease: "easeOut" }}
					>
						CONNECT
					</ScrollFeatureTitle>
					<ScrollFeatureTagline
						animate={{
							opacity: firstLineView ? 1 : 0,
							y: firstLineView ? 0 : 40
						}}
						transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
					>
						where ideas meet action
					</ScrollFeatureTagline>
				</ScrollFeatureSection>

				<ScrollFeatureSection ref={secondLineRef}>
					<ScrollFeatureTitle
						animate={{
							x: secondLineView ? 0 : "100%",
							opacity: secondLineView ? 1 : 0
						}}
						transition={{ duration: 0.9, ease: "easeOut" }}
					>
						INSPIRE
					</ScrollFeatureTitle>
					<ScrollFeatureTagline
						animate={{
							opacity: secondLineView ? 1 : 0,
							y: secondLineView ? 0 : 40
						}}
						transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
					>
						innovation through imagination
					</ScrollFeatureTagline>
				</ScrollFeatureSection>

				<ScrollFeatureSection ref={thirdLineRef}>
					<ScrollFeatureTitle
						animate={{
							x: thirdLineView ? 0 : "-100%",
							opacity: thirdLineView ? 1 : 0
						}}
						transition={{ duration: 0.9, ease: "easeOut" }}
					>
						BUILD
					</ScrollFeatureTitle>
					<ScrollFeatureTagline
						animate={{
							opacity: thirdLineView ? 1 : 0,
							y: thirdLineView ? 0 : 40
						}}
						transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
					>
						the next big thing
					</ScrollFeatureTagline>
				</ScrollFeatureSection>

				<AboutSectionWithSlider
					ref={aboutRef}
					as={motion.section}
					initial={{ opacity: 1 }}
					animate={{ opacity: aboutInView ? 1 : 0.3 }}
					transition={{ duration: 0.8, ease: "easeOut" }}
				>
					<SliderContainer
						as={motion.div}
						animate={{ opacity: aboutInView ? 1 : 0 }}
						transition={{ duration: 1, ease: "easeOut" }}
					>
						<AnimatePresence>
							<SliderImage
								key={currentImageIndex}
								src={sliderImages[currentImageIndex]}
								alt="Community gathering"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 1.5 }}
							/>
						</AnimatePresence>
					</SliderContainer>
					<SliderOverlay
						as={motion.div}
						animate={{ opacity: aboutInView ? 1 : 0.6 }}
						transition={{ duration: 1, ease: "easeOut" }}
					/>
					<AboutContentOverlay>
						<SectionTitle
							as={motion.h2}
							animate={{ opacity: aboutInView ? 1 : 0, y: aboutInView ? 0 : 50 }}
							transition={{ duration: 0.6, ease: "easeOut" }}
						>
							About us
						</SectionTitle>
						<AboutTextBox
							animate={{
								opacity: aboutInView ? 1 : 0,
								scale: aboutInView ? 1 : 0.9
							}}
							transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
							as={motion.div}
						>
							<AboutTextContent>
								<ContentParagraph>
									We&apos;re a community of developers of all skill levels, dedicated to fostering a
									fun and educational environment.
								</ContentParagraph>
								<ContentParagraph>
									Hosted by a team of passionate organizers, our monthly meetups offer an
									opportunity to network, learn, and showcase community projects. Each event
									features complimentary food and drinks during our networking lunch, followed by
									engaging presentations on various developer and engineering topics.
								</ContentParagraph>
								<ContentParagraph>
									After the talks, we break into groups for casual networking, project showcases,
									and coding help. Whether you&apos;re a seasoned developer or just starting out,
									there&apos;s something for everyone.
								</ContentParagraph>
								<ContentParagraph $noMargin>
									Be sure to bring your laptop if you&apos;d like to share your latest project or
									give a presentation. We look forward to meeting you and seeing what you&apos;re
									excited about!
								</ContentParagraph>
							</AboutTextContent>
						</AboutTextBox>
					</AboutContentOverlay>
				</AboutSectionWithSlider>

				<ContentSection ref={organizersRef} as={motion.section}>
					<SectionTitle
						as={motion.h2}
						animate={{ opacity: organizersInView ? 1 : 0, y: organizersInView ? 0 : 50 }}
						transition={{ duration: 0.6, ease: "easeOut" }}
					>
						Organizers
					</SectionTitle>
					<ContentWrapper>
						<OrganizerGrid>
							{organizers.map((organizer) => (
								<OrganizerCardWrapper key={organizer.name}>
									<OrganizerCardLink
										href={organizer.linkedIn}
										target="_blank"
										rel="noopener noreferrer"
										as={motion.a}
										initial={{ opacity: 0, y: 50 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{
											duration: 0.5,
											ease: "easeOut"
										}}
										whileHover={{ scale: 1.1 }}
									>
										<OrganizerImage src={organizer.imageSrc} alt={organizer.name} />
										<OrganizerName>{organizer.name}</OrganizerName>
										<LinkedInIcon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
											<path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
										</LinkedInIcon>
									</OrganizerCardLink>
								</OrganizerCardWrapper>
							))}
						</OrganizerGrid>
					</ContentWrapper>
				</ContentSection>

				<ContentSection ref={joinRef} as={motion.section}>
					<SectionTitle
						as={motion.h2}
						animate={{ opacity: joinInView ? 1 : 0, y: joinInView ? 0 : 50 }}
						transition={{ duration: 0.6, ease: "easeOut" }}
					>
						Join us
					</SectionTitle>
					<ContentWrapper>
						<ContentText
							as={motion.div}
							animate={{ opacity: joinInView ? 1 : 0, scale: joinInView ? 1 : 0.9 }}
							transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
						>
							<Button href={nextEventLink} size="default">
								Join the Next Event
							</Button>
						</ContentText>
					</ContentWrapper>
				</ContentSection>
			</Main>
		</>
	)
}

const Main = styled.main`
	color: white;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`

const BackgroundContainer = styled.section`
	background-color: #0a0a0a;
	position: fixed;
	height: 100vh;
	width: 100vw;
	top: 0;
	left: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`

const Hero = styled.section`
	position: relative;
	height: 100vh;
	width: 100vw;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`

const HeroSocialLinks = styled.div`
	position: absolute;
	bottom: 4rem;
	display: flex;
	gap: 5vw;
	align-items: center;
	justify-content: center;

	@media (max-width: 768px) {
		bottom: 3rem;
	}
`

const HeroSocialIcon = styled.a`
	display: flex;
	align-items: center;
	color: rgba(255, 255, 255, 0.7);
	transition: all 0.3s ease;

	svg {
		fill: currentColor;
		width: 28px;
		height: 28px;
	}

	&:hover {
		color: rgba(255, 255, 255, 1);
		transform: scale(1.1);
	}
`

const HeroSection = styled.section`
	position: relative;
	margin: 0 1rem;
`

const HeroImage = styled.img`
	width: 100%;
	max-width: 688px;
	margin: 0 auto;
`

const Tagline = styled.section`
	padding: 3rem;
	border-radius: 0.5rem;
`

const TaglineText = styled.p`
	font-size: 1.25rem;
	text-align: center;
	max-width: 1024px;
`

const HeroButtonContainer = styled.div`
	margin-top: 2rem;
	display: flex;
	justify-content: center;
	align-items: center;
`

const ScrollFeatureSection = styled.section`
	width: 100%;
	min-height: 80vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 6rem 2rem;
	gap: 1.5rem;
	box-sizing: border-box;
	margin: 4rem 0;
	overflow: hidden;
	position: relative;

	@media (max-width: 768px) {
		min-height: 70vh;
		padding: 4rem 1.5rem;
		margin: 2rem 0;
	}

	@media (max-width: 480px) {
		min-height: 60vh;
		padding: 3rem 1rem;
	}
`

const ScrollFeatureTitle = styled(motion.h1)`
	font-size: clamp(3rem, 10vw, 8rem);
	font-weight: 800;
	letter-spacing: 0.1em;
	text-transform: uppercase;
	text-align: center;
`

const ScrollFeatureTagline = styled(motion.p)`
	font-size: clamp(1.5rem, 3vw, 2.5rem);
	text-align: center;
	max-width: 820px;
	color: rgba(255, 255, 255, 0.8);
	line-height: 1.4;
`

const ContentSection = styled.section`
	position: relative;
	width: 100vw;
	height: auto;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 4rem;
	box-sizing: border-box;

	@media (max-width: 1024px) {
		padding: 3rem;
		height: auto;
		min-height: 100vh;
	}

	@media (max-width: 768px) {
		padding: 2rem;
		height: auto;
		min-height: 80vh;
	}

	@media (max-width: 480px) {
		padding: 1rem;
		height: auto;
		min-height: 70vh;
	}
`

const AboutSectionWithSlider = styled.section`
	position: relative;
	width: 100vw;
	min-height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;

	@media (max-width: 768px) {
		overflow: visible;
		padding: 4rem 0;
	}
`

const SliderContainer = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 0;
`

const SliderImage = styled(motion.img)`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	object-fit: cover;
	filter: blur(2px);
`

const SliderOverlay = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.4);
	z-index: 1;
`

const AboutContentOverlay = styled.div`
	position: relative;
	z-index: 2;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 2rem;
	width: 100%;
	max-width: 1200px;

	@media (max-width: 768px) {
		padding: 3rem 1rem;
	}
`

const AboutTextBox = styled.div`
	background-color: rgba(0, 0, 0, 0.75);
	padding: 3.5rem;
	border-radius: 1rem;
	backdrop-filter: blur(8px);
	max-width: 800px;
	margin: 0 auto;
	box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);

	@media (max-width: 768px) {
		padding: 2.5rem;
		max-width: 90%;
	}

	@media (max-width: 480px) {
		padding: 2rem;
		border-radius: 0.75rem;
	}
`

const AboutTextContent = styled.div`
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
`

const ContentParagraph = styled.p<{ $noMargin?: boolean }>`
	font-size: 1.125rem;
	line-height: 1.9;
	text-align: left;
	margin: ${(props) => (props.$noMargin ? "0" : "0")};
	color: rgba(255, 255, 255, 0.9);
	font-weight: 300;

	&:first-child {
		font-size: 1.375rem;
		font-weight: 300;
		text-align: center;
		margin-bottom: 0.75rem;
		color: rgba(255, 255, 255, 0.95);
		letter-spacing: 0.02em;
	}

	@media (max-width: 768px) {
		font-size: 1.05rem;
		line-height: 1.8;

		&:first-child {
			font-size: 1.25rem;
		}
	}

	@media (max-width: 480px) {
		font-size: 1rem;
		line-height: 1.7;

		&:first-child {
			font-size: 1.15rem;
		}
	}
`

const SectionTitle = styled.h2`
	font-size: clamp(2rem, 8vw, 4rem);
	font-weight: 700;
	margin: 0 0 2rem 0;
`

const ContentWrapper = styled.div`
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 5rem;
	padding: 5rem;

	@media (max-width: 1280px) {
		flex-direction: column;
		gap: 2rem;
		padding: 2rem;
	}

	@media (max-width: 480px) {
		padding: 1rem;
		gap: 1.5rem;
	}
`

const ContentText = styled.p`
	margin-top: 0.5rem;
	font-size: 1.25rem;
	text-align: center;
	max-width: 1024px;

	@media (max-width: 768px) {
		font-size: 1.125rem;
		max-width: 90vw;
	}

	@media (max-width: 480px) {
		font-size: 1rem;
		line-height: 1.6;
	}
`

const OrganizerGrid = styled.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	gap: 1.5rem;
	width: 100%;
`

const OrganizerCardWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	flex: 1 1 300px;
	max-width: 350px;
`

const OrganizerCardLink = styled.a`
	background-color: rgba(255, 255, 255, 0.02);
	padding: 3rem;
	border-radius: 0.5rem;
	text-align: center;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 280px;
	text-decoration: none;
	color: inherit;
	cursor: pointer;
	transition: background-color 0.3s ease;

	&:hover {
		background-color: rgba(255, 255, 255, 0.05);
	}

	@media (max-width: 768px) {
		width: 260px;
		padding: 2.5rem;
	}

	@media (max-width: 480px) {
		width: 240px;
		padding: 2rem;
	}
`

const OrganizerImage = styled.img`
	width: 8rem;
	height: 8rem;
	object-fit: cover;
	border-radius: 50%;
	margin: 0 auto 0.5rem auto;
`

const OrganizerName = styled.h3`
	font-size: 1.25rem;
	font-weight: 700;
	margin: 1rem 0;
`

const LinkedInIcon = styled.svg`
	height: 2rem;
	width: 2rem;
	fill: currentColor;
	margin-top: 0.5rem;
`
