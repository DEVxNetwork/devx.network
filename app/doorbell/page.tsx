"use client"
import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import type { RealtimeChannel } from "@supabase/supabase-js"
import styled from "styled-components"
import { motion } from "framer-motion"
import { PotionBackground } from "../components/PotionBackground"
import { ErrorBoundary } from "../components/ErrorBoundary"
import { Button } from "../components/Button"
import { supabaseClient } from "@/lib/supabaseClient"
import eventsData from "../data/events.json"
import type { LumaEvent } from "../services/luma"

// Components //

export default function Doorbell() {
	const [isRinging, setIsRinging] = useState(false)
	const [ringCount, setRingCount] = useState(0)
	const channelRef = useRef<RealtimeChannel | null>(null)
	const lastRingIdRef = useRef<string | null>(null)

	const nearestEvent = useMemo(() => {
		const events = eventsData as LumaEvent[]
		const now = new Date()

		return events.reduce<LumaEvent | null>((nearest, event) => {
			const eventDate = new Date(event.start_at)
			const diff = Math.abs(eventDate.getTime() - now.getTime())

			if (!nearest) return event

			const nearestDiff = Math.abs(new Date(nearest.start_at).getTime() - now.getTime())
			return diff < nearestDiff ? event : nearest
		}, null)
	}, [])

	const triggerLocalRing = useCallback(() => {
		playDoorbellSound()
		setIsRinging(true)
	}, [])

	const broadcastRing = useCallback(async (ringId: string) => {
		if (!channelRef.current) {
			return
		}

		try {
			const status = await channelRef.current.send({
				type: "broadcast",
				event: "ring",
				payload: { ringId }
			})

			if (status !== "ok") {
				console.error("Failed to broadcast doorbell ring:", status)
			}
		} catch (error) {
			console.error("Failed to broadcast doorbell ring:", error)
		}
	}, [])

	const handleDoorbellClick = () => {
		const ringId = createRingIdentifier()
		lastRingIdRef.current = ringId
		triggerLocalRing()
		void broadcastRing(ringId)
		setRingCount((prev) => prev + 1)
	}

	useEffect(() => {
		const client = supabaseClient
		if (!client) {
			return
		}

		const channel = client
			.channel("doorbell")
			.on("broadcast", { event: "ring" }, ({ payload }) => {
				const ringPayload = payload as RingPayload | undefined
				if (ringPayload?.ringId && ringPayload.ringId === lastRingIdRef.current) {
					return
				}

				triggerLocalRing()
			})
			.subscribe()

		channelRef.current = channel

		return () => {
			void channel.unsubscribe()
			client.removeChannel(channel)
			channelRef.current = null
		}
	}, [triggerLocalRing])

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
			<Main>
				<Hero>
					<HeadingSection>
						<Heading>Welcome to</Heading>
						<Logo src="/images/sd-devx-brand.png" alt="DEVxSD" />
					</HeadingSection>
					<ParagraphSection>
						<Paragraph>Ring the doorbell to enter the event.</Paragraph>
					</ParagraphSection>
					<ButtonSection>
						{isRinging ? (
							<AnimatedButtonContent
								animate={{
									scale: [1, 2, 1],
									x: [0, -10, 10, -5, 5, 0],
									rotate: [0, -10, 10, -5, 5, 0]
								}}
								transition={{
									duration: 0.5,
									ease: "easeInOut"
								}}
							>
								🛎️
							</AnimatedButtonContent>
						) : (
							<Button size="default" onClick={handleDoorbellClick}>
								Ring Doorbell
							</Button>
						)}
						{nearestEvent && (
							<Button
								href={nearestEvent.url}
								variant="tertiary"
								size="default"
								target="_blank"
								rel="noopener noreferrer"
							>
								Get Your Ticket
							</Button>
						)}
					</ButtonSection>
					{ringCount >= 3 && (
						<CallSection>
							<CallMessage>No one answered?</CallMessage>
							<Button href="tel:+17608775333" size="default" variant="primary">
								Call Us
							</Button>
						</CallSection>
					)}
				</Hero>
			</Main>
		</>
	)
}

// Styled Components //

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
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 1rem;
`

const AnimatedButtonContent = styled(motion.span)`
	display: inline-block;
	font-size: 2rem;
	line-height: 1.5;
`

const CallSection = styled.section`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 1rem;
	padding: 0 3rem;
	margin-top: 2rem;
`

const CallMessage = styled.p`
	font-size: 1.25rem;
	text-align: center;
	margin: 0;
	color: white;
`

// Constants //

type RingPayload = {
	ringId?: string
}

const createRingIdentifier = () => {
	if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
		return crypto.randomUUID()
	}

	return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

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
