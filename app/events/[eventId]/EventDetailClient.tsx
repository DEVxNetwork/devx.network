"use client"
import { useEffect, useRef, useState } from "react"
import { styled } from "styled-components"
import type { LumaEvent } from "@/app/services/luma"
import { lumaService } from "@/app/services/luma"
import { Button } from "@/app/components/Button"
import { TextInput } from "@/app/components/TextInput"
import { EventRoom } from "@/app/components/WaysToShowUp"
import { isGatheringPast, type PublicGathering } from "@/app/content/gatherings"

// Components //

export default function EventDetailClient({
	gathering,
	eventId
}: {
	gathering: PublicGathering | null
	eventId: string
}) {
	const [event, setEvent] = useState<LumaEvent | null>(null)
	const [loading, setLoading] = useState(true)
	const [userInfo, setUserInfo] = useState<{ name: string; email: string }>({ name: "", email: "" })
	const [registering, setRegistering] = useState(false)
	const [hasStoredInfo, setHasStoredInfo] = useState(false)
	const nameInputRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		loadEvent()
		loadSavedInfo()
	}, [eventId])

	const loadEvent = async () => {
		try {
			const eventData = await lumaService.getEvent(eventId)
			if (!eventData) {
				window.location.assign("/events")
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

	if (loading && !gathering) {
		return (
			<Main>
				<Container>
					<LoadingMessage>Loading event details...</LoadingMessage>
				</Container>
			</Main>
		)
	}

	if (!event && !gathering) {
		return null
	}

	const shown = gathering ?? (event ? gatheringFromLuma(event) : null)
	const isPastEvent = shown ? isGatheringPast(shown) : false

	return (
		<>
			<Main>
				<Container>
					<ContentLayout>
						<MainArea>
							{shown ? <EventRoom gathering={shown} past={isPastEvent} /> : null}

							{!gathering && event?.location && event.location.type === "online" && (
								<LocationSection>
									<SectionTitle>Location</SectionTitle>
									<LocationText>Online Event</LocationText>
								</LocationSection>
							)}

							{event ? (
								<DescriptionSection>
									<SectionTitle>About this gathering</SectionTitle>
									{event.description_html ? (
										<Description dangerouslySetInnerHTML={{ __html: event.description_html }} />
									) : (
										<Description>{event.description}</Description>
									)}
								</DescriptionSection>
							) : null}
						</MainArea>
						<SidebarArea>
							<span id="registration-form" />

							{event && !isPastEvent && (
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

							{event && event.guest_count !== undefined && (
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

							{!gathering && event?.location && event.location.type === "physical" && (
								<LocationSection>
									<SectionTitle>Location</SectionTitle>
									<LocationText>{event.location.address}</LocationText>
								</LocationSection>
							)}

							{!gathering &&
								event?.location &&
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

function gatheringFromLuma(event: LumaEvent): PublicGathering {
	const address = event.location?.type === "physical" ? (event.location.address ?? "") : ""
	return {
		id: event.api_id,
		name: event.name,
		start: event.start_at,
		hasTime: event.start_at.includes("T"),
		location: event.location?.city ?? "",
		address,
		lumaUrl: event.url || null,
		status: "",
		href: `/events/${event.api_id}`
	}
}

// Styled Components //

const Main = styled.main`
	position: relative;
	padding: 2.5rem 0 3rem;
`

const Container = styled.div`
	width: min(var(--column), calc(100% - 2.5rem));
	margin: 0 auto;
`

const ContentLayout = styled.div`
	display: grid;
	grid-template-columns: minmax(0, 1fr);
	gap: 1.75rem;
	grid-template-areas:
		"main"
		"sidebar";
`

const MainArea = styled.div`
	grid-area: main;
	padding: 1.25rem 0 0;

	@media (min-width: 768px) {
		padding: 0;
	}
`

const SidebarArea = styled.div`
	grid-area: sidebar;
	padding: 1.5rem 0 0;
`

const SectionTitle = styled.h2`
	font-family: "Fraunces", "Iowan Old Style", Palatino, serif;
	font-size: clamp(1.35rem, 2vw, 1.6rem);
	font-weight: 560;
	letter-spacing: -0.03em;
	line-height: 1.15;
	color: var(--foreground);
	margin-bottom: 0.85rem;
	border-bottom: 1px solid var(--border);
	padding-bottom: 0.45rem;
`

const LocationSection = styled.section`
	margin-bottom: 2rem;
`

const LocationText = styled.p`
	font-size: 1rem;
	color: var(--muted-foreground);
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
	color: var(--muted-foreground);
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
		color: var(--accent);
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
	color: var(--accent);
	font-weight: 500;
`

const AttendeeLink = styled.a`
	font-size: 1rem;
	color: var(--accent);
	font-weight: 500;
	text-decoration: none;

	&:hover {
		text-decoration: underline;
	}
`

const RegistrationSection = styled.section`
	padding: 0;
	margin: 0;
	display: flex;
	flex-direction: column;
	align-items: stretch;
`

const RegistrationForm = styled.form`
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
`

const OneClickRSVPContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1rem;
`

const StoredInfoDisplay = styled.div`
	font-size: 0.875rem;
	color: var(--muted-foreground);
	text-align: center;
	line-height: 1.6;
`

const NameValue = styled.span`
	color: var(--foreground);
	font-weight: 900;
`

const EmailValue = styled.span`
	color: var(--subtle-foreground);
`

const ClearUserInfoLink = styled.a`
	color: var(--accent);
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
	color: var(--subtle-foreground);
	font-size: 1.125rem;
	padding: 4rem 2rem;
`
