"use client"
import { useRef } from "react"
import styled from "styled-components"
import { motion, useInView } from "framer-motion"
import { PotionBackground } from "../components/PotionBackground"
import { organizers } from "../info/organizers"
import { links } from "../siteConfig"

export default function Home() {
	// Add refs for each animated section
	const heroRef = useRef(null)
	const buildConnectEmpowerRef = useRef(null)
	const aboutRef = useRef(null)
	const organizersRef = useRef(null)
	const joinRef = useRef(null)

	// Add useInView hooks for each section
	const heroInView = useInView(heroRef, { amount: 0.3 })
	const buildConnectEmpowerInView = useInView(buildConnectEmpowerRef, { amount: 0.3 })
	const aboutInView = useInView(aboutRef, { amount: 0.3 })
	const organizersInView = useInView(organizersRef, { amount: 0.3 })
	const joinInView = useInView(joinRef, { amount: 0.3 })

	return (
		<>
			<BackgroundContainer>
				<PotionBackground />
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
				</Hero>

				<ContentSection
					ref={buildConnectEmpowerRef}
					as={motion.section}
					style={{
						overflowX: "hidden",
						height: "100vh",
						display: "flex",
						alignItems: "center"
					}}
				>
					<motion.h1
						style={{ fontSize: "10vh", whiteSpace: "nowrap", position: "relative" }}
						animate={{
							x: buildConnectEmpowerInView ? 0 : "100vw",
							opacity: buildConnectEmpowerInView ? 1 : 0
						}}
						transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
					>
						BUILD
					</motion.h1>
					<motion.h1
						style={{ fontSize: "10vh", whiteSpace: "nowrap", position: "relative" }}
						animate={{
							x: buildConnectEmpowerInView ? 0 : "100vw",
							opacity: buildConnectEmpowerInView ? 1 : 0
						}}
						transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
					>
						CONNECT
					</motion.h1>
					<motion.h1
						style={{ fontSize: "10vh", whiteSpace: "nowrap", position: "relative" }}
						animate={{
							x: buildConnectEmpowerInView ? 0 : "100vw",
							opacity: buildConnectEmpowerInView ? 1 : 0
						}}
						transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
					>
						EMPOWER
					</motion.h1>
				</ContentSection>

				<ContentSection ref={aboutRef} as={motion.section}>
					<SectionTitle
						as={motion.h2}
						animate={{ opacity: aboutInView ? 1 : 0, y: aboutInView ? 0 : 50 }}
						transition={{ duration: 0.6, ease: "easeOut" }}
					>
						About us
					</SectionTitle>
					<ContentWrapper>
						<ResponsiveImage
							as={motion.img}
							src="/images/crowd.webp"
							alt="Big crowd"
							animate={{
								scale: aboutInView ? 1 : 1.1,
								opacity: aboutInView ? 1 : 0
							}}
							transition={{ duration: 0.8, ease: "easeOut" }}
						/>
						<ContentText
							animate={{
								opacity: aboutInView ? 1 : 0,
								scale: aboutInView ? 1 : 0.9
							}}
							transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
							as={motion.p}
						>
							{`We're a community of developers of all skill levels, dedicated to fostering a fun and
							educational environment. Hosted by a team of passionate organizers, our
							monthly meetups offer an opportunity to network, learn, and showcase community projects. At
							each event, you'll enjoy complimentary food and drinks during our networking lunch,
							followed by a series of engaging presentations on various developer and engineering
							topics. After the talks, we break into groups for casual networking, project showcases,
							and coding help. Whether you're a seasoned developer or just starting out, there's
							something for everyone. Be sure to bring your laptop if you'd like to share your latest
							project or give a presentation. We look forward to meeting you and seeing what you're
							excited about!`}
						</ContentText>
					</ContentWrapper>
				</ContentSection>

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
								<OrganizerCardWrapper
									as={motion.div}
									key={organizer.name}
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
									<SocialLink href={organizer.linkedIn} target="_blank" rel="noopener noreferrer">
										<LinkedInLogo src="/images/linkedin-logo.webp" alt="LinkedIn Logo" />
									</SocialLink>
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
							<Button target="_blank" href={links.lumaUrl}>
								View Upcoming Events
							</Button>
						</ContentText>
					</ContentWrapper>
				</ContentSection>
			</Main>
		</>
	)
}

// Styled components
const Main = styled.main`
	color: white;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`

const Button = styled.a`
	background-color: white;
	color: black;
	padding: 1rem 2rem;
	border-radius: 0.5rem;
	border: none;
	font-size: 1.25rem;
	cursor: pointer;

	&:hover {
		background-color: #ddd;
	}
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

const SectionTitle = styled.h2`
	font-size: clamp(2rem, 8vw, 4rem);
	font-weight: 700;
	margin: 0;
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
	background-color: rgba(255, 255, 255, 0.02);
	padding: 3rem;
	border-radius: 0.5rem;
	text-align: center;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	flex: 1;
	min-width: 250px;
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
`

const SocialLink = styled.a`
	margin-top: 0.5rem;
	font-size: 1.125rem;
	color: #60a5fa;
	display: inline-flex;
	align-items: center;

	&:hover {
		text-decoration: underline;
	}
`

const LinkedInLogo = styled.img`
	height: 3rem;
	width: 3rem;
	margin-left: 0.5rem;
`

const ResponsiveImage = styled.img`
	border-radius: 0.5rem;
	box-shadow:
		0 4px 6px -1px rgba(0, 0, 0, 0.1),
		0 2px 4px -1px rgba(0, 0, 0, 0.06);
	object-fit: cover;
	width: min(40vw, 500px);

	@media (max-width: 768px) {
		width: 80vw;
		max-width: 400px;
	}

	@media (max-width: 480px) {
		width: 90vw;
		max-width: 300px;
	}
`
