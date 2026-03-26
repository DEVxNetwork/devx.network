"use client"
import styled from "styled-components"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { supabaseClient } from "../../lib/supabaseClient"
import { updateProfileCache } from "../../lib/profileCache"
import { PotionBackground } from "../components/PotionBackground"
import { Nametag } from "../components/Nametag"
import { TextInput } from "../components/TextInput"
import { Button } from "../components/Button"
import { HelpInfoButton } from "../components/HelpInfoButton"

const HANDLE_REGEX = /^(?:[a-z0-9_]|-)+$/

type NametagData = {
	fullName: string
	title: string
	affiliation: string
	profilePhoto: string
}

/** Same rules as the availability effect: empty, format, or not explicitly available. */
function getHandleHasError(handle: string, handleAvailable: boolean | null): boolean {
	const trimmed = handle.trim()
	const formatInvalid =
		!trimmed || !HANDLE_REGEX.test(handle) || handle.length < 3 || handle.length > 30
	return formatInvalid || handleAvailable !== true
}

export default function Setup() {
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const [uploading, setUploading] = useState(false)
	const [handle, setHandle] = useState("")
	const [handleAvailable, setHandleAvailable] = useState<boolean | null>(null)
	const [checkingHandle, setCheckingHandle] = useState(false)
	const [nametagData, setNametagData] = useState<NametagData>({
		fullName: "",
		title: "",
		affiliation: "",
		profilePhoto: ""
	})
	const [validationErrors, setValidationErrors] = useState({
		handle: false,
		profilePhoto: false,
		fullName: false
	})
	const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false)
	const router = useRouter()

	useEffect(() => {
		const checkAuth = async () => {
			// Get redirect URL from query params
			const searchParams = new URLSearchParams(window.location.search)
			const redirectUrl = searchParams.get("redirect")

			// Clean up OAuth callback tokens from URL
			if (typeof window !== "undefined") {
				const hashParams = new URLSearchParams(window.location.hash.substring(1))
				if (hashParams.get("access_token") || hashParams.get("error")) {
					const newUrl = redirectUrl
						? `${window.location.pathname}?redirect=${encodeURIComponent(redirectUrl)}`
						: window.location.pathname
					window.history.replaceState(null, "", newUrl)
				}
			}

			const {
				data: { user }
			} = await supabaseClient.auth.getUser()

			if (!user) {
				const loginUrl = redirectUrl
					? `/login?redirect=${encodeURIComponent(redirectUrl)}`
					: "/login"
				router.push(loginUrl)
				return
			}

			// Check if profile already exists
			const { data: existingProfile } = await supabaseClient
				.from("profiles")
				.select("id")
				.eq("user_id", user.id)
				.single()

			if (existingProfile) {
				// Get handle and redirect to handle-based URL or redirect URL
				const { data: profileWithHandle } = await supabaseClient
					.from("profiles")
					.select("handle")
					.eq("user_id", user.id)
					.single()

				if (profileWithHandle?.handle) {
					// If redirect URL is provided, use it; otherwise go to profile
					if (redirectUrl) {
						router.push(decodeURIComponent(redirectUrl))
					} else {
						router.push(`/whois?${profileWithHandle.handle}`)
					}
				} else {
					// User has profile but no handle - stay on setup to create handle
					setLoading(false)
				}
				return
			}

			// Pre-populate nametag data from OAuth metadata
			setNametagData({
				fullName:
					user.user_metadata?.full_name ||
					user.user_metadata?.name ||
					user.user_metadata?.display_name ||
					user.email?.split("@")[0] ||
					"",
				title: "",
				affiliation: "",
				profilePhoto: ""
			})

			setLoading(false)
		}

		checkAuth()
	}, [router])

	// Check handle availability
	useEffect(() => {
		const checkAvailability = async () => {
			if (!handle.trim()) {
				setHandleAvailable(null)
				return
			}

			// Validate handle format: lowercase alphanumeric with underscores/hyphens, 3-30 chars
			if (!HANDLE_REGEX.test(handle) || handle.length < 3 || handle.length > 30) {
				setHandleAvailable(false)
				return
			}

			setCheckingHandle(true)

			try {
				const { data, error } = await supabaseClient
					.from("profiles")
					.select("handle")
					.eq("handle", handle.toLowerCase())
					.maybeSingle()

				if (error) {
					// If there's an error (other than not found), mark as unavailable
					setHandleAvailable(false)
				} else if (!data) {
					// No profile found with this handle - available
					setHandleAvailable(true)
				} else {
					// Handle already exists
					setHandleAvailable(false)
				}
			} catch (err) {
				console.error("Error checking handle availability:", err)
				setHandleAvailable(false)
			} finally {
				setCheckingHandle(false)
			}
		}

		const timeoutId = setTimeout(checkAvailability, 500) // Debounce
		return () => clearTimeout(timeoutId)
	}, [handle])

	const handleImageUpload = async (file: File): Promise<string> => {
		setUploading(true)

		try {
			const fileExt = file.name.split(".").pop()
			const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
			const filePath = `${fileName}`

			const { error: uploadError } = await supabaseClient.storage
				.from("avatars")
				.upload(filePath, file)

			if (uploadError) throw uploadError

			const {
				data: { publicUrl }
			} = supabaseClient.storage.from("avatars").getPublicUrl(filePath)

			// Clear photo error immediately when photo is uploaded
			if (hasAttemptedSubmit && validationErrors.profilePhoto) {
				setValidationErrors((prev) => ({ ...prev, profilePhoto: false }))
			}

			return publicUrl
		} catch (error: any) {
			console.error("Error uploading image:", error)
			throw error
		} finally {
			setUploading(false)
		}
	}

	const handleDataChange = useCallback((data: NametagData) => {
		setNametagData(data)
		setValidationErrors((prev) => {
			const newPhoto = !data.profilePhoto
			const newName = !data.fullName.trim()
			if (prev.profilePhoto === newPhoto && prev.fullName === newName) return prev
			return { ...prev, profilePhoto: newPhoto, fullName: newName }
		})
	}, [])

	const handleHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setHandle(e.target.value.toLowerCase())
	}

	// After first submit, recompute handle error from current value + availability (not unconditional clear on keystroke)
	useEffect(() => {
		if (!hasAttemptedSubmit) return

		const handleError = getHandleHasError(handle, handleAvailable)

		setValidationErrors((prev) => {
			if (prev.handle === handleError) return prev
			return { ...prev, handle: handleError }
		})
	}, [handle, handleAvailable, hasAttemptedSubmit])

	const handleFinishSetup = async (e: React.FormEvent) => {
		e.preventDefault()
		setHasAttemptedSubmit(true)

		// Validate form and set error states
		const errors = {
			handle: getHandleHasError(handle, handleAvailable),
			profilePhoto: !nametagData.profilePhoto,
			fullName: !nametagData.fullName.trim()
		}

		setValidationErrors(errors)

		// If there are any errors, don't proceed
		if (errors.handle || errors.profilePhoto || errors.fullName) {
			return
		}

		setSaving(true)

		try {
			const {
				data: { user }
			} = await supabaseClient.auth.getUser()

			if (!user) throw new Error("User not authenticated")

			const handleValue = handle.toLowerCase().trim()

			// Check if profile already exists for this user
			const { data: existingProfile } = await supabaseClient
				.from("profiles")
				.select("id, handle")
				.eq("user_id", user.id)
				.maybeSingle()

			let profileData
			if (existingProfile) {
				// Update existing profile
				const { data, error } = await supabaseClient
					.from("profiles")
					.update({
						handle: handleValue,
						full_name: nametagData.fullName,
						profile_photo: nametagData.profilePhoto,
						title: nametagData.title || null,
						affiliation: nametagData.affiliation || null
					})
					.eq("user_id", user.id)
					.select()
					.single()

				if (error) throw error
				profileData = data
			} else {
				// Create new profile
				const { data, error } = await supabaseClient
					.from("profiles")
					.insert({
						user_id: user.id,
						email: user.email,
						handle: handleValue,
						full_name: nametagData.fullName,
						profile_photo: nametagData.profilePhoto,
						title: nametagData.title || null,
						affiliation: nametagData.affiliation || null
					})
					.select()
					.single()

				if (error) throw error
				profileData = data
			}

			// Cache profile info in user metadata
			await updateProfileCache(handleValue, nametagData.profilePhoto)

			// Get redirect URL from query params
			const searchParams = new URLSearchParams(window.location.search)
			const redirectUrl = searchParams.get("redirect")

			// Redirect to redirect URL if provided, otherwise to profile page
			if (redirectUrl) {
				router.push(decodeURIComponent(redirectUrl))
			} else {
				router.push(`/whois?${handleValue}`)
			}
		} catch (err: any) {
			console.error("Failed to create profile:", err)
			// TODO: Show error message to user
		} finally {
			setSaving(false)
		}
	}

	const isHandleFormatValid = HANDLE_REGEX.test(handle) && handle.length >= 3 && handle.length <= 30
	const isHandleUnavailable = isHandleFormatValid && handleAvailable === false && !!handle.trim()

	if (loading) {
		return (
			<>
				<BackgroundContainer>
					<PotionBackground />
				</BackgroundContainer>
				<Container>
					<LoadingText>Loading...</LoadingText>
				</Container>
			</>
		)
	}

	return (
		<>
			<BackgroundContainer>
				<PotionBackground />
			</BackgroundContainer>
			<Container>
				<ContentWrapper>
					<HeaderRow>
						<Title>Welcome to DEVx</Title>
					</HeaderRow>

					<Form onSubmit={handleFinishSetup} noValidate>
						<Section>
							<SectionTitle>
								Choose a handle <RequiredAsterisk>*</RequiredAsterisk>
							</SectionTitle>
							<HandleInputWrapper>
								<HandleInputRow>
									<TextInput
										variant="secondary"
										size="default"
										value={handle}
										onChange={handleHandleChange}
										placeholder="your-handle"
										pattern="(?:[a-z0-9_]|-){3,30}"
										minLength={3}
										maxLength={30}
										error={hasAttemptedSubmit && validationErrors.handle}
									/>
									<HelpInfoButton minWidth="220px" maxWidth="260px">
										Your unique DEVx username, used for your nametag or public profile.
									</HelpInfoButton>
								</HandleInputRow>
								{handle && (
									<HandleStatus>
										{checkingHandle ? (
											<StatusText $color="rgba(255, 255, 255, 0.5)">Checking...</StatusText>
										) : handleAvailable === true ? (
											<StatusText $color="#4ade80">✓ Available</StatusText>
										) : handleAvailable === false ? (
											<StatusText $color="var(--error-color)">✗ Unavailable</StatusText>
										) : null}
									</HandleStatus>
								)}
							</HandleInputWrapper>
							{hasAttemptedSubmit && validationErrors.handle && !isHandleUnavailable && (
								<FieldError>Please choose a valid handle</FieldError>
							)}
							<HelpText>
								3-30 characters, lowercase letters, numbers, underscores, and hyphens only
							</HelpText>
						</Section>

						<Section>
							<SectionTitle>Get your nametag</SectionTitle>
							<Nametag
								data={nametagData}
								onSave={async () => {}}
								onImageUpload={handleImageUpload}
								uploading={uploading}
								forcedEditMode={true}
								onDataChange={handleDataChange}
								validationErrors={{
									profilePhoto: hasAttemptedSubmit && validationErrors.profilePhoto,
									fullName: hasAttemptedSubmit && validationErrors.fullName
								}}
								showRequiredAsterisks={true}
							/>
						</Section>

						<ButtonWrapper>
							<Button type="submit" variant="primary" size="default" disabled={saving || uploading}>
								{saving ? "Creating Profile..." : "Finish Setup"}
							</Button>
						</ButtonWrapper>
					</Form>
				</ContentWrapper>
			</Container>
		</>
	)
}

// Styled Components

const BackgroundContainer = styled.section`
	position: fixed;
	inset: 0;
	z-index: -1;
`

const Container = styled.main`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	min-height: 100vh;
	padding: 2rem;
	position: relative;
	z-index: 0;
`

const ContentWrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 2rem;
	width: 100%;
	max-width: 700px;
	align-items: center;
`

const HeaderRow = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	margin-bottom: 1rem;
`

const Title = styled.h1`
	font-size: 2.5rem;
	font-weight: 700;
	color: rgba(255, 255, 255, 0.95);
	text-align: center;
	width: 100%;
`

const LoadingText = styled.p`
	color: rgba(255, 255, 255, 0.7);
	font-size: 1.2rem;
`

const Form = styled.form`
	display: flex;
	flex-direction: column;
	gap: 2rem;
	width: 100%;
`

const Section = styled.div`
	display: flex;
	flex-direction: column;
	gap: 1rem;
	width: 100%;
`

const SectionTitle = styled.h2`
	font-size: 1.5rem;
	font-weight: 600;
	color: rgba(255, 255, 255, 0.95);
	margin: 0;
`

const HandleInputWrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	width: 100%;
`

const HandleInputRow = styled.div`
	display: flex;
	align-items: center;
	gap: 0.5rem;
	width: 100%;
`

const HandleStatus = styled.div`
	display: flex;
	align-items: center;
	gap: 0.5rem;
`

const StatusText = styled.span<{ $color: string }>`
	color: ${(props) => props.$color};
	font-size: 0.875rem;
	font-weight: 500;
`

const HelpText = styled.p`
	color: rgba(255, 255, 255, 0.6);
	font-size: 0.875rem;
	margin: 0;
`

const RequiredAsterisk = styled.span`
	color: var(--error-color);
	font-weight: 700;
	margin-left: 0.25rem;
`

const FieldError = styled.p`
	color: var(--error-color);
	font-size: 1.1rem;
	font-weight: 500;
	margin: 0.5rem 0 0 0;
`

const ButtonWrapper = styled.div`
	display: flex;
	justify-content: center;
	width: 100%;
`
