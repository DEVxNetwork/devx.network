"use client"
import styled from "styled-components"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabaseClient } from "../../lib/supabaseClient"
import { getProfileFromCache } from "../../lib/profileCache"
import { PotionBackground } from "../components/PotionBackground"
import { Button } from "../components/Button"
import { TextInput } from "../components/TextInput"
import { TextareaInput } from "../components/TextareaInput"
import { RadioInput } from "../components/RadioInput"
import { CheckboxInput } from "../components/CheckboxInput"
import { PageContainer } from "../components/PageContainer"
import { SuccessMessage as SuccessMessageComponent } from "../components/SuccessMessage"
import Link from "next/link"

export default function SubmitTalk() {
	const router = useRouter()
	const [loading, setLoading] = useState(true)
	const [submitting, setSubmitting] = useState(false)
	const [uploading, setUploading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [success, setSuccess] = useState(false)
	const [userEmail, setUserEmail] = useState("")
	const [userFullName, setUserFullName] = useState("")
	const [userHandle, setUserHandle] = useState<string | null>(null)
	const [profileId, setProfileId] = useState<number | null>(null)
	const [profilePhoneNumber, setProfilePhoneNumber] = useState<string | null>(null)
	const [isEditingPhone, setIsEditingPhone] = useState(false)
	const [agreedToTerms, setAgreedToTerms] = useState(false)
	const [formData, setFormData] = useState({
		phoneNumber: "",
		talkTitle: "",
		talkSynopsis: "",
		slidesType: "upload" as "url" | "upload",
		slidesUrl: "",
		slidesFile: null as File | null
	})

	useEffect(() => {
		const checkAuth = async () => {
			// Clean up OAuth callback tokens from URL
			if (typeof window !== "undefined") {
				const hashParams = new URLSearchParams(window.location.hash.substring(1))
				if (hashParams.get("access_token") || hashParams.get("error")) {
					window.history.replaceState(null, "", window.location.pathname)
				}
			}

			const {
				data: { user }
			} = await supabaseClient.auth.getUser()

			if (!user) {
				// Redirect to login with redirect URL back to submit-talk
				const redirectUrl = encodeURIComponent("/submit-talk")
				router.push(`/login?redirect=${redirectUrl}`)
				return
			}

			// Load user email and profile
			setUserEmail(user.email || "")

			// Get handle from cache
			const { handle } = getProfileFromCache(user)
			setUserHandle(handle)

			// Load profile to get full name, profile_id, and phone number
			const { data: profile } = await supabaseClient
				.from("profiles")
				.select("id, full_name, phone_number")
				.eq("user_id", user.id)
				.single()

			if (profile) {
				setUserFullName(profile.full_name)
				setProfileId(profile.id)
				setProfilePhoneNumber(profile.phone_number)
				// If profile has phone number, use it; otherwise start with empty
				if (profile.phone_number) {
					setFormData((prev) => ({ ...prev, phoneNumber: profile.phone_number || "" }))
				} else {
					setFormData((prev) => ({ ...prev, phoneNumber: "" }))
				}
			}

			setLoading(false)
		}

		checkAuth()
	}, [router])

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			setFormData({ ...formData, slidesFile: file })
		}
	}

	const uploadSlidesFile = async (file: File): Promise<string> => {
		setUploading(true)

		try {
			const fileExt = file.name.split(".").pop()
			const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
			const filePath = `slides/${fileName}`

			const { error: uploadError } = await supabaseClient.storage
				.from("talk-slides")
				.upload(filePath, file)

			if (uploadError) throw uploadError

			return filePath
		} catch (error: any) {
			console.error("Error uploading slides:", error)
			throw error
		} finally {
			setUploading(false)
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError(null)

		// Validate form
		// Talk Title validation
		if (!formData.talkTitle.trim()) {
			setError("Talk Title is required")
			return
		}
		if (formData.talkTitle.trim().length < 10) {
			setError("Talk title must be at least 10 characters")
			return
		}
		if (formData.talkTitle.trim().length > 200) {
			setError("Talk title must be 200 characters or less")
			return
		}

		// Talk Synopsis validation
		if (!formData.talkSynopsis.trim()) {
			setError("Talk Synopsis is required")
			return
		}
		if (formData.talkSynopsis.trim().length < 100) {
			setError("Talk synopsis must be at least 100 characters")
			return
		}
		if (formData.talkSynopsis.trim().length > 2000) {
			setError("Talk synopsis must be 2000 characters or less")
			return
		}

		// Phone number validation (optional, but if provided, validate it)
		if (formData.phoneNumber.trim()) {
			if (formData.phoneNumber.trim().length < 10) {
				setError("Please enter a valid phone number (at least 10 characters)")
				return
			}
			if (formData.phoneNumber.trim().length > 20) {
				setError("Phone number must be 20 characters or less")
				return
			}
		}

		// Slides URL validation
		if (formData.slidesType === "url") {
			if (!formData.slidesUrl.trim()) {
				setError("Slides URL is required when using URL option")
				return
			}
			try {
				new URL(formData.slidesUrl.trim())
			} catch {
				setError("Please enter a valid URL")
				return
			}
			if (formData.slidesUrl.trim().length > 2048) {
				setError("URL must be 2048 characters or less")
				return
			}
		}

		// File upload validation
		if (formData.slidesType === "upload") {
			if (!formData.slidesFile) {
				setError("Please upload slides file")
				return
			}
			const maxSize = 50 * 1024 * 1024 // 50MB
			if (formData.slidesFile.size > maxSize) {
				setError("File size must be 50MB or less")
				return
			}
			// Validate file extension
			const allowedExtensions = [".pdf", ".pptx", ".ppt", ".odp", ".key", ".html", ".md", ".zip"]
			const fileName = formData.slidesFile.name.toLowerCase()
			const hasValidExtension = allowedExtensions.some((ext) => fileName.endsWith(ext))
			if (!hasValidExtension) {
				setError("Invalid file format. Accepted formats: PDF, PPTX, PPT, ODP, KEY, HTML, MD, ZIP")
				return
			}
		}

		// Terms agreement validation
		if (!agreedToTerms) {
			setError("You must agree to the terms to submit")
			return
		}

		setSubmitting(true)
		setError(null)

		try {
			const {
				data: { user }
			} = await supabaseClient.auth.getUser()

			if (!user) throw new Error("User not authenticated")

			if (!profileId) throw new Error("Profile not found")

			// Update profile phone number if it's different or if profile doesn't have one
			if (formData.phoneNumber.trim() && formData.phoneNumber.trim() !== profilePhoneNumber) {
				const { error: updateError } = await supabaseClient
					.from("profiles")
					.update({ phone_number: formData.phoneNumber.trim() })
					.eq("id", profileId)

				if (updateError) throw updateError

				// Update local state
				setProfilePhoneNumber(formData.phoneNumber.trim())
			}

			let slidesFilePath: string | null = null

			// Upload slides file if needed
			if (formData.slidesType === "upload" && formData.slidesFile) {
				slidesFilePath = await uploadSlidesFile(formData.slidesFile)
			}

			// Insert talk submission into database
			const { error: insertError } = await supabaseClient.from("talk_submissions").insert({
				profile_id: profileId,
				user_id: user.id,
				talk_title: formData.talkTitle.trim(),
				talk_synopsis: formData.talkSynopsis.trim(),
				slides_type: formData.slidesType,
				slides_url: formData.slidesType === "url" ? formData.slidesUrl.trim() : null,
				slides_file_path: formData.slidesType === "upload" ? slidesFilePath : null,
				status: "pending"
			})

			if (insertError) throw insertError

			// Show success message
			setSuccess(true)

			// Reset form (but keep phone number if it was saved to profile)
			setFormData({
				phoneNumber: profilePhoneNumber || "",
				talkTitle: "",
				talkSynopsis: "",
				slidesType: "upload",
				slidesUrl: "",
				slidesFile: null
			})
			setAgreedToTerms(false)
			setIsEditingPhone(false)

			// Scroll to top to show success message
			window.scrollTo({ top: 0, behavior: "smooth" })
		} catch (err: any) {
			console.error("Failed to submit talk:", err)
			setError(err.message || "Failed to submit talk. Please try again.")
		} finally {
			setSubmitting(false)
			setUploading(false)
		}
	}

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
				<PageContainer>
					<Title>Your DEVx Talk</Title>
					<Subtitle>Inspire the DEVx community!</Subtitle>

					{success ? (
						<SuccessMessageComponent
							title="Talk submitted successfully!"
							message="We'll review your submission and be in touch soon."
						/>
					) : (
						<>
							{error && <ErrorMessage>{error}</ErrorMessage>}

							<Form onSubmit={handleSubmit}>
								<FormSection>
									<SectionTitle>Your Information</SectionTitle>
									<Field>
										<Label>Email</Label>
										<InfoValue>{userEmail}</InfoValue>
									</Field>
									<Field>
										<Label>Full Name</Label>
										<InfoValue>{userFullName || "Not set"}</InfoValue>
										<InfoNote>
											You can update your full name in your{" "}
											{userHandle ? (
												<InfoLink href={`/whois?${userHandle}`}>Nametag</InfoLink>
											) : (
												<InfoLink href="/setup">Nametag</InfoLink>
											)}
											.
										</InfoNote>
									</Field>
									{profilePhoneNumber && !isEditingPhone ? (
										<Field>
											<Label>Phone Number</Label>
											<InfoValue>{profilePhoneNumber}</InfoValue>
											<ChangeButton
												type="button"
												variant="tertiary"
												size="small"
												onClick={() => setIsEditingPhone(true)}
											>
												Change
											</ChangeButton>
										</Field>
									) : (
										<Field>
											<Label htmlFor="phoneNumber">Phone Number</Label>
											<TextInput
												id="phoneNumber"
												type="tel"
												variant="secondary"
												size="default"
												value={formData.phoneNumber}
												onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
												placeholder="+1 (555) 123-4567"
												maxLength={20}
											/>
											{profilePhoneNumber && isEditingPhone && (
												<CancelButton
													type="button"
													variant="tertiary"
													size="small"
													onClick={() => {
														setIsEditingPhone(false)
														setFormData({ ...formData, phoneNumber: profilePhoneNumber })
													}}
												>
													Cancel
												</CancelButton>
											)}
										</Field>
									)}
								</FormSection>

								<FormSection>
									<SectionTitle>Talk Details</SectionTitle>
									<Field>
										<Label htmlFor="talkTitle">Talk Title *</Label>
										<TextInput
											id="talkTitle"
											type="text"
											variant="secondary"
											size="default"
											value={formData.talkTitle}
											onChange={(e) => setFormData({ ...formData, talkTitle: e.target.value })}
											placeholder="Enter your talk title"
											minLength={10}
											maxLength={200}
											required
										/>
									</Field>
									<Field>
										<Label htmlFor="talkSynopsis">Talk Synopsis *</Label>
										<TextareaInput
											id="talkSynopsis"
											variant="secondary"
											size="default"
											value={formData.talkSynopsis}
											onChange={(e) => setFormData({ ...formData, talkSynopsis: e.target.value })}
											placeholder="Describe your talk with a short synopsis. Keep it short and sweet, and give the reader an idea about what you'll be presenting."
											minLength={100}
											maxLength={2000}
											rows={6}
											required
										/>
									</Field>
								</FormSection>

								<FormSection>
									<SectionTitle>Slides</SectionTitle>
									<RadioGroup>
										<RadioOption>
											<RadioInput
												id="slidesUpload"
												name="slidesType"
												variant="secondary"
												size="default"
												value="upload"
												checked={formData.slidesType === "upload"}
												onChange={(e) =>
													setFormData({
														...formData,
														slidesType: e.target.value as "url" | "upload"
													})
												}
											/>
											<RadioLabel htmlFor="slidesUpload">Upload Slides</RadioLabel>
										</RadioOption>
										<RadioOption>
											<RadioInput
												id="slidesUrl"
												name="slidesType"
												variant="secondary"
												size="default"
												value="url"
												checked={formData.slidesType === "url"}
												onChange={(e) =>
													setFormData({
														...formData,
														slidesType: e.target.value as "url" | "upload"
													})
												}
											/>
											<RadioLabel htmlFor="slidesUrl">Link to Slides (URL)</RadioLabel>
										</RadioOption>
									</RadioGroup>

									{formData.slidesType === "upload" ? (
										<Field>
											<Label htmlFor="slidesFile">Upload Slides *</Label>
											<FileInput
												id="slidesFile"
												type="file"
												accept=".pdf,.pptx,.ppt,.odp,.key,.html,.md,.zip"
												onChange={handleFileChange}
												required={formData.slidesType === "upload"}
											/>
											{formData.slidesFile && (
												<FileInfo>Selected: {formData.slidesFile.name}</FileInfo>
											)}
										</Field>
									) : (
										<Field>
											<Label htmlFor="slidesUrl">Slides URL *</Label>
											<TextInput
												id="slidesUrl"
												type="url"
												variant="secondary"
												size="default"
												value={formData.slidesUrl}
												onChange={(e) => setFormData({ ...formData, slidesUrl: e.target.value })}
												placeholder="https://example.com/slides"
												maxLength={2048}
												required={formData.slidesType === "url"}
											/>
										</Field>
									)}
								</FormSection>

								<CheckboxField>
									<CheckboxInput
										id="agreedToTerms"
										variant="secondary"
										size="default"
										checked={agreedToTerms}
										onChange={(e) => setAgreedToTerms(e.target.checked)}
										required
									/>
									<CheckboxLabel htmlFor="agreedToTerms">
										By submitting, I agree to the{" "}
										<TermsLink href="/event-terms" target="_blank" rel="noopener noreferrer">
											event terms and conditions
										</TermsLink>
										.
									</CheckboxLabel>
								</CheckboxField>

								<ButtonContainer>
									<Button type="submit" variant="primary" disabled={submitting}>
										{submitting ? "Submitting..." : "Submit Talk"}
									</Button>
								</ButtonContainer>
							</Form>
						</>
					)}
				</PageContainer>
			</Container>
		</>
	)
}

const BackgroundContainer = styled.section`
	background-color: #0a0a0a;
	position: fixed;
	height: 100vh;
	width: 100vw;
	top: 0;
	left: 0;
	z-index: -1;
`

const Container = styled.main`
	min-height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 2rem 1rem;
`

const Title = styled.h1`
	font-size: 2rem;
	font-weight: 700;
	color: white;
	margin: 0;
	text-align: center;
`

const Subtitle = styled.p`
	color: rgba(255, 255, 255, 0.7);
	margin: -1rem 0 0 0;
	text-align: center;
`

const Form = styled.form`
	display: flex;
	flex-direction: column;
	gap: 2rem;
`

const FormSection = styled.div`
	display: flex;
	flex-direction: column;
	gap: 1rem;
	padding-top: 1rem;
	border-top: 1px solid rgba(255, 255, 255, 0.1);

	&:first-of-type {
		border-top: none;
		padding-top: 0;
	}
`

const SectionTitle = styled.h2`
	font-size: 1.25rem;
	font-weight: 600;
	color: white;
	margin: 0;
`

const Field = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	margin-bottom: 1.5rem;

	&:last-child {
		margin-bottom: 0;
	}
`

const InfoValue = styled.div`
	color: rgba(255, 255, 255, 0.9);
	font-size: 0.9375rem;
	margin: 0;
`

const InfoNote = styled.p`
	margin: 0.5rem 0 0 0;
	color: rgba(255, 255, 255, 0.6);
	font-size: 0.875rem;
	line-height: 1.5;
`

const InfoLink = styled(Link)`
	color: rgba(156, 163, 255, 0.9);
	text-decoration: underline;
	transition: color 0.2s ease;

	&:hover {
		color: rgba(156, 163, 255, 1);
	}
`

const Label = styled.label`
	font-size: 0.875rem;
	font-weight: 700;
	color: rgba(255, 255, 255, 0.9);
`

const ReadOnlyValue = styled.div`
	padding: 0.75rem;
	background-color: rgba(255, 255, 255, 0.05);
	border: 1px solid rgba(255, 255, 255, 0.1);
	border-radius: 0.5rem;
	color: rgba(255, 255, 255, 0.7);
	font-size: 1rem;
`

const RadioGroup = styled.div`
	display: flex;
	gap: 1.5rem;
	flex-wrap: wrap;
`

const RadioOption = styled.div`
	display: flex;
	align-items: center;
	gap: 0.5rem;
`

const RadioLabel = styled.label`
	font-size: 0.875rem;
	color: rgba(255, 255, 255, 0.9);
	cursor: pointer;
`

const FileInput = styled.input`
	padding: 0.75rem;
	background-color: rgba(255, 255, 255, 0.1);
	border: 1px solid rgba(255, 255, 255, 0.2);
	border-radius: 0.5rem;
	color: white;
	font-size: 1rem;
	cursor: pointer;

	&::file-selector-button {
		padding: 0.5rem 1rem;
		margin-right: 1rem;
		background-color: rgba(156, 163, 255, 0.2);
		border: 1px solid rgba(156, 163, 255, 0.4);
		border-radius: 0.375rem;
		color: white;
		cursor: pointer;
		font-size: 0.875rem;
		transition: all 0.2s ease;

		&:hover {
			background-color: rgba(156, 163, 255, 0.3);
		}
	}
`

const FileInfo = styled.div`
	margin-top: 0.5rem;
	font-size: 0.875rem;
	color: rgba(255, 255, 255, 0.7);
	font-style: italic;
`

const ButtonContainer = styled.div`
	display: flex;
	justify-content: center;
	margin-top: 1rem;
`

const ErrorMessage = styled.div`
	color: #ff6b6b;
	background-color: rgba(255, 107, 107, 0.1);
	padding: 0.75rem;
	border-radius: 0.5rem;
	font-size: 0.875rem;
	text-align: center;
`

const ChangeButton = styled(Button)`
	margin-top: 0.5rem;
	align-self: flex-start;
`

const CancelButton = styled(Button)`
	margin-top: 0.5rem;
	align-self: flex-start;
`

const LoadingText = styled.div`
	color: white;
	font-size: 1.25rem;
	text-align: center;
`

const CheckboxField = styled.div`
	display: flex;
	align-items: center;
	gap: 0.75rem;
	margin-top: 1rem;
	padding-top: 1.5rem;
	border-top: 1px solid rgba(255, 255, 255, 0.1);
`

const CheckboxLabel = styled.label`
	font-size: 0.875rem;
	color: rgba(255, 255, 255, 0.9);
	cursor: pointer;
	line-height: 1.5;
`

const TermsLink = styled(Link)`
	color: rgba(156, 163, 255, 0.9);
	text-decoration: underline;
	transition: color 0.2s ease;

	&:hover {
		color: rgba(156, 163, 255, 1);
	}
`
