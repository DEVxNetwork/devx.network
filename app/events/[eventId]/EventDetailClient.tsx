"use client"
import { useEffect, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import styled from "styled-components"
import type { LumaEvent } from "@/app/services/luma"
import { lumaService } from "@/app/services/luma"
import { PotionBackground } from "@/app/components/PotionBackground"
import { ErrorBoundary } from "@/app/components/ErrorBoundary"
import { Button } from "@/app/components/Button"
import { TextInput } from "@/app/components/TextInput"

// Components //

export default function EventDetailClient() {
	const params = useParams()
	const router = useRouter()
	const eventId = params.eventId as string

	const [event, setEvent] = useState<LumaEvent | null>(null)
	const [loading, setLoading] = useState(true)
	const [userInfo, setUserInfo] = useState<{ name: string; email: string }>({ name: "", email: "" })
	const [registering, setRegistering] = useState(false)
	const [hasStoredInfo, setHasStoredInfo] = useState(false)
	const nameInputRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		loadEvent()
		loadSavedInfo()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [eventId])

	const loadEvent = async () => {
		try {
			const eventData = await lumaService.getEvent(eventId)
			if (!eventData) {
				router.push("/events")
				return
			}
			setEvent(eventData)
		} catch (error) {
			console.error("Failed to load event:", error)
		} finally {
			setLoading(false)
		}
	}

	const loadSavedInfo = () => {
		const savedUserInfo = localStorage.getItem("devx_user_info")
		if (savedUserInfo) {
			try {
				const parsed = JSON.parse(savedUserInfo)
				if (parsed.email) {
					setUserInfo({ name: parsed.name || "", email: parsed.email })
					setHasStoredInfo(true)
				}
			} catch (error) {
				// Fallback for old format (just email)
				const savedEmail = localStorage.getItem("devx_user_email")
				if (savedEmail) {
					setUserInfo({ name: "", email: savedEmail })
					setHasStoredInfo(true)
				}
			}
		} else {
			// Fallback for old format (just email)
			const savedEmail = localStorage.getItem("devx_user_email")
			if (savedEmail) {
				setUserInfo({ name: "", email: savedEmail })
				setHasStoredInfo(true)
			}
		}
	}

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!userInfo.email || !event) return

		try {
			gtag("event", "register_button_click", {
				event_category: "engagement",
				event_label: "Register Event Form Button",
				luma_event_id: eventId
			})
		} catch (error) {
			console.error("Failed to track event:", error)
		}

		setRegistering(true)
		try {
			// Save name and email for future use
			localStorage.setItem("devx_user_info", JSON.stringify(userInfo))
			setHasStoredInfo(true)

			// Register for event
			await lumaService.registerForEvent(eventId, userInfo.email)

			// Open Luma event page in new tab
			window.open(event.url, "_blank", "noopener,noreferrer")
			setRegistering(false)
		} catch (error) {
			console.error("Failed to register:", error)
			alert("Failed to register for event. Please try again.")
			setRegistering(false)
		}
	}

	const handleOneClickRSVP = async () => {
		if (!userInfo.email || !event) return

		setRegistering(true)
		try {
			// Register for event
			await lumaService.registerForEvent(eventId, userInfo.email)

			// Open Luma event page in new tab
			window.open(event.url, "_blank", "noopener,noreferrer")
			setRegistering(false)
		} catch (error) {
			console.error("Failed to register:", error)
			alert("Failed to register for event. Please try again.")
			setRegistering(false)
		}
	}

	const handleClearUserInfo = () => {
		localStorage.removeItem("devx_user_info")
		localStorage.removeItem("devx_user_email")
		setUserInfo({ name: "", email: "" })
		setHasStoredInfo(false)
	}

	if (loading) {
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
					<Container>
						<LoadingMessage>Loading event details...</LoadingMessage>
					</Container>
				</Main>
			</>
		)
	}

	if (!event) {
		return null
	}

	const eventDate = new Date(event.start_at)
	const isPastEvent = eventDate < new Date()

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
				<Container>
					<ContentLayout>
						<ImageArea>
							{event.cover_url && <CoverImage src={event.cover_url} alt={event.name} />}
						</ImageArea>
						<MainArea>
							<Header>
								<Title>{event.name}</Title>
								<DateTime>{formatEventDateTime(event.start_at, event.end_at)}</DateTime>
								<Button
									onClick={() => {
										nameInputRef.current?.scrollIntoView({
											behavior: "smooth",
											block: "center"
										})
										setTimeout(() => nameInputRef.current?.focus(), 400)
									}}
								>
									Attend This Event
								</Button>
							</Header>

							{event.location && event.location.type === "online" && (
								<LocationSection>
									<SectionTitle>Location</SectionTitle>
									<LocationText>Online Event</LocationText>
								</LocationSection>
							)}

							<DescriptionSection>
								<SectionTitle>About Event</SectionTitle>
								{event.description_html ? (
									<Description dangerouslySetInnerHTML={{ __html: event.description_html }} />
								) : (
									<Description>{event.description}</Description>
								)}
							</DescriptionSection>
						</MainArea>
						<SidebarArea>
							<span id="registration-form" />

							{!isPastEvent && (
								<RegistrationSection>
									<SectionTitle>Registration</SectionTitle>
									{hasStoredInfo ? (
										<OneClickRSVPContainer>
											<StoredInfoDisplay>
												RSVP as: <NameValue>{userInfo.name}</NameValue>{" "}
												<EmailValue>{userInfo.email}</EmailValue>{" "}
												<ClearUserInfoLink
													href="#"
													onClick={(e) => {
														e.preventDefault()
														handleClearUserInfo()
													}}
												>
													Change
												</ClearUserInfoLink>
											</StoredInfoDisplay>
											<Button onClick={handleOneClickRSVP} disabled={registering}>
												{registering ? "Redirecting..." : "One-Click RSVP"}
											</Button>
										</OneClickRSVPContainer>
									) : (
										<RegistrationForm onSubmit={handleRegister}>
											<TextInput
												ref={nameInputRef}
												type="text"
												placeholder="Enter your name"
												value={userInfo.name}
												onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
												required
											/>
											<TextInput
												type="email"
												placeholder="Enter your email"
												value={userInfo.email}
												onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
												required
											/>
											<Button type="submit" disabled={registering}>
												{registering ? "Registering..." : "Register on Luma"}
											</Button>
										</RegistrationForm>
									)}
								</RegistrationSection>
							)}

							{event.guest_count !== undefined && (
								<AttendeeSection>
									<SectionTitle>Attendees</SectionTitle>
									{event.guest_count === -1 ? (
										hasStoredInfo ? (
											<AttendeeLink href={event.url} target="_blank" rel="noopener noreferrer">
												Click to see attendees on Luma →
											</AttendeeLink>
										) : (
											<AttendeeLink
												href="#registration-form"
												onClick={(e) => {
													e.preventDefault()
													nameInputRef.current?.scrollIntoView({
														behavior: "smooth",
														block: "center"
													})
													setTimeout(() => nameInputRef.current?.focus(), 400)
												}}
											>
												Register to see attendees →
											</AttendeeLink>
										)
									) : (
										<AttendeeCount>{event.guest_count} people attending</AttendeeCount>
									)}
								</AttendeeSection>
							)}

							{event.location && event.location.type === "physical" && (
								<LocationSection>
									<SectionTitle>Location</SectionTitle>
									<LocationText>{event.location.address}</LocationText>
								</LocationSection>
							)}

							{event.location &&
								event.location.type === "physical" &&
								event.location.coordinates && (
									<LocationSection>
										<SectionTitle>Map</SectionTitle>
										<MapContainer>
											<MiniMap
												lat={event.location.coordinates.lat}
												lng={event.location.coordinates.lng}
												address={event.location.address}
											/>
										</MapContainer>
									</LocationSection>
								)}
						</SidebarArea>
					</ContentLayout>
				</Container>
			</Main>
		</>
	)
}

// Utility Components //

function MiniMap({ lat, lng, address }: { lat: string; lng: string; address?: string }) {
	const latNum = parseFloat(lat)
	const lngNum = parseFloat(lng)
	const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lngNum - 0.01},${latNum - 0.01},${lngNum + 0.01},${latNum + 0.01}&layer=mapnik&marker=${lat},${lng}`

	return <MapFrame src={mapUrl} title={`Map for ${address || "event location"}`} loading="lazy" />
}

// Utility Functions //

function formatEventDateTime(startAt: string, endAt: string): string {
	const start = new Date(startAt)
	const end = new Date(endAt)

	const dateStr = start.toLocaleDateString("en-US", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric"
	})

	const startTime = start.toLocaleTimeString("en-US", {
		hour: "numeric",
		minute: "2-digit"
	})

	const endTime = end.toLocaleTimeString("en-US", {
		hour: "numeric",
		minute: "2-digit"
	})

	return `${dateStr} • ${startTime} - ${endTime}`
}

// Styled Components //

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

const Main = styled.main`
	position: relative;
	z-index: 1;
	padding-top: 8rem;
	padding-bottom: 4rem;
`

const Container = styled.div`
	max-width: 1100px;
	margin: 0 auto;
	margin-inline: 1rem;

	@media (min-width: 1132px) {
		margin-inline: auto;
	}
	background-color: rgba(21, 21, 28, 0.75);
	backdrop-filter: blur(10px);
	border-radius: 0.5rem;
	box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
	overflow: hidden;
`

const ContentLayout = styled.div`
	display: grid;
	grid-template-columns: 1fr;
	grid-template-areas:
		"image"
		"main"
		"sidebar";

	@media (min-width: 768px) {
		grid-template-columns: 380px 1fr;
		grid-template-rows: auto 1fr;
		column-gap: 2rem;
		grid-template-areas:
			"image main"
			"sidebar main";
	}
`

const ImageArea = styled.div`
	grid-area: image;
`

const MainArea = styled.div`
	grid-area: main;
	padding: 2rem;

	@media (min-width: 768px) {
		padding: 2rem 2rem 2rem 0;
	}
`

const SidebarArea = styled.div`
	grid-area: sidebar;
	padding: 0 2rem 2rem;

	@media (min-width: 768px) {
		padding: 0 0 2rem 2rem;
	}
`

const CoverImage = styled.img`
	width: 100%;
	aspect-ratio: 1 / 1;
	object-fit: cover;
	display: block;

	@media (min-width: 768px) {
		border-radius: 0.5rem;
		margin: 2rem 0 0 2rem;
		width: calc(100% - 2rem);
	}
`

const Header = styled.header`
	margin-bottom: 2rem;
`

const Title = styled.h1`
	font-size: 2.25rem;
	font-weight: bold;
	color: white;
	margin-bottom: 0.5rem;
`

const DateTime = styled.p`
	font-size: 1.125rem;
	color: #9ca3af;
	margin-bottom: 1rem;
`

const SectionTitle = styled.h2`
	font-size: 1.5rem;
	font-weight: bold;
	color: white;
	margin-bottom: 1rem;
	border-bottom: 1px solid #374151;
	padding-bottom: 0.75rem;
`

const LocationSection = styled.section`
	margin-bottom: 2rem;
`

const LocationText = styled.p`
	font-size: 1rem;
	color: #d1d5db;
	margin-bottom: 1rem;
`

const MapContainer = styled.div`
	width: 100%;
	height: 300px;
	border-radius: 0.5rem;
	overflow: hidden;
`

const MapFrame = styled.iframe`
	width: 100%;
	height: 100%;
	border: none;
	filter: brightness(0.75);
	&:hover {
		filter: brightness(0.9);
	}
`

const DescriptionSection = styled.section`
	margin-bottom: 2rem;
`

const Description = styled.div`
	font-size: 1rem;
	color: #d1d5db;
	line-height: 1.5;
	word-break: break-word;

	p {
		margin: 0 0 1.2rem;
		line-height: 1.5;
	}

	p:last-child {
		margin-bottom: 0;
	}

	h1 {
		font-size: 1.5rem;
		font-weight: 600;
		line-height: 1.2;
		margin: 2rem 0 1.5rem;
	}

	h2 {
		font-size: 1.25rem;
		font-weight: 600;
		line-height: 1.2;
		margin: 1.5rem 0 1rem;
	}

	h1:first-child,
	h2:first-child {
		margin-top: 0;
	}

	ul {
		list-style: disc;
	}
	ol {
		list-style: auto;
	}
	ul,
	ol {
		margin: 1rem 0 1.2rem;
		padding-left: 1.375rem;
	}

	ol p + ol,
	ol p + ul,
	ul p + ol,
	ul p + ul {
		margin-top: 0.25rem;
	}

	ol p,
	ul p {
		margin-bottom: 0rem;
	}

	ul:last-child,
	ol:last-child {
		margin-bottom: 0;
	}

	li {
		padding-left: 0.3125rem;
		margin: 0;
	}

	code {
		font-size: 0.875rem;
		line-height: 1.5;
	}

	a {
		color: #8b5cf6;
		text-decoration: underline;
		text-underline-offset: 0.2em;
	}

	strong {
		font-weight: 600;
		color: inherit;
	}
`

const AttendeeSection = styled.section`
	margin-bottom: 2rem;
`

const AttendeeCount = styled.p`
	font-size: 1rem;
	color: #8b5cf6;
	font-weight: 500;
`

const AttendeeLink = styled.a`
	font-size: 1rem;
	color: #8b5cf6;
	font-weight: 500;
	text-decoration: none;

	&:hover {
		text-decoration: underline;
	}
`

const RegistrationSection = styled.section`
	background-color: rgba(255, 255, 255, 0.01);
	backdrop-filter: blur(32px);
	box-shadow: 4px 8px 8px 0 rgba(0, 0, 0, 0.05);
	padding: 1.5rem;
	border-radius: 0.5rem;
	margin: 2rem 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`

const RegistrationForm = styled.form`
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	gap: 1rem;

	> input {
		flex: 1 1 10rem;
	}
`

const OneClickRSVPContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1rem;
`

const StoredInfoDisplay = styled.div`
	font-size: 0.875rem;
	color: #d1d5db;
	text-align: center;
	line-height: 1.6;
`

const NameValue = styled.span`
	color: white;
	font-weight: 900;
`

const EmailValue = styled.span`
	color: #aaa;
`

const ClearUserInfoLink = styled.a`
	color: #8b5cf6;
	font-weight: 500;
	text-decoration: none;
	font-size: 0.875rem;
	margin-top: 0.25rem;
	display: inline-block;

	&:hover {
		text-decoration: underline;
	}
`

const LoadingMessage = styled.p`
	text-align: center;
	color: #9ca3af;
	font-size: 1.125rem;
	padding: 4rem 2rem;
`
