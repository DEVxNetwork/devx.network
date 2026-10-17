"use client"
import styled from "styled-components"
import { motion, useInView } from "framer-motion"
import { useRef, useEffect } from "react"
import { PotionBackground } from "../components/PotionBackground"
import { ErrorBoundary } from "../components/ErrorBoundary"
import { Button } from "../components/Button"

// Components //

export default function NametagPage() {
	const headingRef = useRef(null)
	const ctaRef = useRef(null)
	const videoRef = useRef<HTMLVideoElement>(null)
	const headingInView = useInView(headingRef, { amount: 0.3 })
	const ctaInView = useInView(ctaRef, { amount: 0.3 })

	useEffect(() => {
		// Add .full class to body to make header fixed instead of sticky
		document.body.classList.add("full")

		return () => {
			// Remove .full class when component unmounts
			document.body.classList.remove("full")
		}
	}, [])

	const handleVideoEnd = () => {
		if (videoRef.current) {
			videoRef.current.currentTime = 0
			videoRef.current.play()
		}
	}

	return (
		<>
			<BackgroundContainer>
				<VideoBackground ref={videoRef} autoPlay loop muted playsInline onEnded={handleVideoEnd}>
					<source src="/videos/nametags-hero.mp4" type="video/mp4" />
					<source
						src="/videos/nametags-hero-h265.mp4"
						type="video/mp4"
						media="(max-width: 768px)"
					/>
					<source src="/videos/nametags-hero.webm" type="video/webm" />
				</VideoBackground>
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
					<HeadingContainer
						ref={headingRef}
						animate={{
							opacity: headingInView ? 1 : 0,
							y: headingInView ? 0 : -20
						}}
						transition={{ duration: 0.6, ease: "easeOut" }}
						as={motion.div}
					>
						<Heading>Introducing Nametags</Heading>
					</HeadingContainer>
					<BottomContent
						ref={ctaRef}
						animate={{
							opacity: ctaInView ? 1 : 0,
							y: ctaInView ? 0 : 20
						}}
						transition={{ duration: 0.6, ease: "easeOut" }}
						as={motion.div}
					>
						<Description>
							Nametags are your digital persona, a way to say &quot;hello&quot; to the community and
							introduce yourself, your interests and skills. Nametags are your personal brand and
							profile communicated through DEVx.
						</Description>
						<ButtonContainer>
							<Button href="/login" size="default">
								Get your Nametag
							</Button>
						</ButtonContainer>
					</BottomContent>
				</Hero>
			</Main>
		</>
	)
}

// Styled Components //

const Main = styled.main`
	color: var(--foreground);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`

const BackgroundContainer = styled.section`
	background-color: var(--background);
	position: fixed;
	height: 100vh;
	width: 100vw;
	top: 0;
	left: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	overflow: hidden;
`

const VideoBackground = styled.video`
	position: absolute;
	top: 50%;
	left: 50%;
	width: 100%;
	height: 100%;
	object-fit: cover;
	transform: translate(-50%, -50%);
	z-index: 0;
`

const Hero = styled.section`
	position: relative;
	height: 100vh;
	width: 100vw;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	padding-top: 6rem;
	padding-bottom: 4rem;

	&::before {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(
			to bottom,
			rgba(0, 0, 0, 1) 0%,
			rgba(0, 0, 0, 0.3) 20%,
			transparent 40%,
			transparent 60%,
			rgba(0, 0, 0, 0.5) 80%,
			rgba(0, 0, 0, 1) 100%
		);
		pointer-events: none;
		z-index: 1;
	}

	@media (max-width: 768px) {
		padding-top: 6rem;
		padding-bottom: 6rem;
	}
`

const HeadingContainer = styled(motion.div)`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	text-align: center;
	padding: 0 2rem;
	max-width: 1024px;
	position: relative;
	z-index: 2;
`

const BottomContent = styled(motion.div)`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 2rem;
	text-align: center;
	padding: 0 2rem;
	max-width: 1024px;
	position: relative;
	z-index: 2;
`

const Heading = styled.h1`
	font-size: clamp(2.5rem, 8vw, 5rem);
	font-weight: 700;
	margin: 0;
	letter-spacing: 0.02em;
`

const Description = styled.p`
	font-size: clamp(1.25rem, 2vw, 1.75rem);
	margin: 0;
	color: rgba(var(--foreground-rgb), 0.9);
	line-height: 1.4;
`

const ButtonContainer = styled.div`
	margin-top: 1rem;
	display: flex;
	justify-content: center;
	align-items: center;
`
