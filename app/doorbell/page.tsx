"use client"
import { useState, useEffect } from "react"
import styled from "styled-components"
import { motion } from "framer-motion"
import { PotionBackground } from "../components/PotionBackground"
import { ErrorBoundary } from "../components/ErrorBoundary"
import { Button } from "../components/Button"

// Components //

export default function Doorbell() {
	const [isRinging, setIsRinging] = useState(false)

	const handleDoorbellClick = () => {
		setIsRinging(true)
	}

	useEffect(() => {
		if (isRinging) {
			const timer = setTimeout(() => {
				setIsRinging(false)
			}, 5000)
			return () => clearTimeout(timer)
		}
	}, [isRinging])

	return (
		<>
			<BackgroundContainer>
				<ErrorBoundary
					fallback={<div style={{ backgroundColor: "black", width: "100%", height: "100%" }} />}
				>
					<PotionBackground />
				</ErrorBoundary>
			</BackgroundContainer>
			<Main $ignoreHeader>
				<Hero>
					<HeadingSection>
						<Heading>Welcome to</Heading>
						<Logo src="/images/sd-devx-brand.png" alt="DEVxSD" />
					</HeadingSection>
					<ParagraphSection>
						<Paragraph>Ring the doorbell to enter the event.</Paragraph>
					</ParagraphSection>
					<ButtonSection>
						<Button size="default" onClick={handleDoorbellClick}>
							<AnimatedButtonContent
								animate={
									isRinging
										? {
												scale: [1, 2, 1],
												x: [0, -10, 10, -5, 5, 0],
												rotate: [0, -10, 10, -5, 5, 0]
											}
										: {}
								}
								transition={{
									duration: 0.5,
									ease: "easeInOut"
								}}
							>
								{isRinging ? "🛎️" : "Ring Doorbell"}
							</AnimatedButtonContent>
						</Button>
					</ButtonSection>
				</Hero>
			</Main>
		</>
	)
}

// Styled Components //

const Main = styled.main<{ $ignoreHeader?: boolean }>`
	margin-top: ${({ $ignoreHeader = false }) => ($ignoreHeader ? "-72px" : "0")};
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
	gap: 3rem;
`

const HeadingSection = styled.section`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 1rem;
	padding: 0 3rem;
`

const Heading = styled.h1`
	font-size: clamp(2rem, 8vw, 4rem);
	font-weight: 700;
	margin: 0;
	text-align: center;
`

const Logo = styled.img`
	width: 100%;
	max-width: 688px;
	margin: 0 auto;
`

const ParagraphSection = styled.section`
	padding: 0 3rem;
`

const Paragraph = styled.p`
	font-size: 1.25rem;
	text-align: center;
	max-width: 1024px;
	margin: 0;
`

const ButtonSection = styled.section`
	display: flex;
	justify-content: center;
	align-items: center;
`

const AnimatedButtonContent = styled(motion.span)`
	display: inline-block;
`
