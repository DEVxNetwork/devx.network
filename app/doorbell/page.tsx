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
		playDoorbellSound()
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

// Constants //

const playDoorbellSound = () => {
	try {
		const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
		const now = audioContext.currentTime

		const scheduleBellTone = ({
			baseFrequency,
			startTime,
			duration
		}: {
			baseFrequency: number
			startTime: number
			duration: number
		}) => {
			const masterGain = audioContext.createGain()
			const shimmerFilter = audioContext.createBiquadFilter()
			const resonanceFilter = audioContext.createBiquadFilter()
			const delayNode = audioContext.createDelay()
			const feedbackGain = audioContext.createGain()

			shimmerFilter.type = "highpass"
			shimmerFilter.frequency.value = 180

			resonanceFilter.type = "bandpass"
			resonanceFilter.frequency.value = baseFrequency * 1.3
			resonanceFilter.Q.value = 6

			delayNode.delayTime.value = 0.42
			feedbackGain.gain.value = 0.38

			masterGain.connect(shimmerFilter)
			shimmerFilter.connect(resonanceFilter)
			resonanceFilter.connect(audioContext.destination)
			resonanceFilter.connect(delayNode)
			delayNode.connect(feedbackGain)
			feedbackGain.connect(resonanceFilter)

			masterGain.gain.setValueAtTime(0, startTime)
			masterGain.gain.linearRampToValueAtTime(0.95, startTime + 0.015)
			masterGain.gain.setValueAtTime(0.92, startTime + 0.18)
			masterGain.gain.exponentialRampToValueAtTime(0.000005, startTime + duration)

			const partials = [
				{ ratio: 1, gain: 1 },
				{ ratio: 1.99, gain: 0.42 },
				{ ratio: 2.54, gain: 0.3 },
				{ ratio: 3.01, gain: 0.2 },
				{ ratio: 3.96, gain: 0.14 },
				{ ratio: 5.43, gain: 0.08 }
			]

			partials.forEach(({ ratio, gain }) => {
				const osc = audioContext.createOscillator()
				const partialGain = audioContext.createGain()

				osc.type = "sine"
				osc.frequency.value = baseFrequency * ratio
				osc.detune.value = (Math.random() - 0.5) * 6
				partialGain.gain.value = gain

				osc.connect(partialGain)
				partialGain.connect(masterGain)

				osc.start(startTime)
				osc.stop(startTime + duration + 0.8)
			})
		}

		// Ding (higher chime) followed by Dong (lower chime) with longer resonance
		scheduleBellTone({ baseFrequency: 659, startTime: now, duration: 4 })
		scheduleBellTone({ baseFrequency: 415, startTime: now + 0.45, duration: 4.8 })
	} catch (error) {
		// Fallback: silently fail if audio context is not available
		console.warn("Could not play doorbell sound:", error)
	}
}
