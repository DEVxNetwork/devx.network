"use client"
import styled from "styled-components"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabaseClient } from "../../lib/supabaseClient"
import { updateProfileCache } from "../../lib/profileCache"
import { PotionBackground } from "../components/PotionBackground"
import { Button } from "../components/Button"
import { PageContainer } from "../components/PageContainer"
import { TextInput } from "../components/TextInput"
import { SuccessMessage } from "../components/SuccessMessage"

export default function Login() {
	const [error, setError] = useState<string | null>(null)
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [signingIn, setSigningIn] = useState(false)
	const [signingUp, setSigningUp] = useState(false)
	const [signupSuccess, setSignupSuccess] = useState(false)
	const [showEmailForm, setShowEmailForm] = useState(false)
	const router = useRouter()

	useEffect(() => {
		// Handle OAuth callback and check for existing session
		const checkAuth = async () => {
			// Get redirect URL from query params or localStorage (stored before OAuth)
			const searchParams = new URLSearchParams(window.location.search)
			let redirectUrl = searchParams.get("redirect")

			// If no redirect in URL, check localStorage (might have been stored before OAuth)
			if (!redirectUrl && typeof window !== "undefined") {
				redirectUrl = localStorage.getItem("auth_redirect") || null
				if (redirectUrl) {
					localStorage.removeItem("auth_redirect")
				}
			}

			// Check for OAuth callback in URL hash
			const hashParams = new URLSearchParams(window.location.hash.substring(1))
			if (hashParams.get("access_token") || hashParams.get("error")) {
				// OAuth callback detected - Supabase will handle it automatically
				// Wait a moment for session to be restored
				await new Promise((resolve) => setTimeout(resolve, 500))
			}

			// Check for existing session
			const {
				data: { session }
			} = await supabaseClient.auth.getSession()

			if (session?.user) {
				// Get handle and profile photo, cache in metadata, then redirect
				const { data: profile } = await supabaseClient
					.from("profiles")
					.select("handle, profile_photo")
					.eq("user_id", session.user.id)
					.single()

				if (profile) {
					// Cache profile info in user metadata
					await updateProfileCache(profile.handle || null, profile.profile_photo || null)

					// If redirect URL is provided, use it (user has profile, so they can go to redirect)
					// Otherwise, redirect to setup if no handle, or to profile if handle exists
					if (redirectUrl) {
						router.push(decodeURIComponent(redirectUrl))
					} else if (profile.handle) {
						router.push(`/whois?${profile.handle}`)
					} else {
						// No handle - redirect to setup
						router.push("/setup")
					}
				} else {
					// No profile - redirect to setup with redirect URL
					const setupUrl = redirectUrl
						? `/setup?redirect=${encodeURIComponent(redirectUrl)}`
						: "/setup"
					router.push(setupUrl)
				}
			}
		}
		checkAuth()
	}, [router])

	const handleLogin = (provider: "google" | "github") => async () => {
		try {
			setError(null)
			// Get redirect URL from query params to preserve it through OAuth flow
			const searchParams = new URLSearchParams(window.location.search)
			const redirectUrl = searchParams.get("redirect")

			// Store redirect URL in localStorage before OAuth (in case query params get lost)
			if (redirectUrl && typeof window !== "undefined") {
				localStorage.setItem("auth_redirect", redirectUrl)
			}

			// Include redirect in the OAuth callback URL
			const loginUrl = redirectUrl
				? `${window.location.origin}/login?redirect=${encodeURIComponent(redirectUrl)}`
				: `${window.location.origin}/login`

			const { error } = await supabaseClient!.auth.signInWithOAuth({
				provider,
				options: {
					redirectTo: loginUrl
				}
			})
			if (error) throw error
		} catch (err: any) {
			setError(err.message)
		}
	}

	const handleEmailSignIn = async (e: React.FormEvent) => {
		e.preventDefault()
		setError(null)
		setSigningIn(true)

		try {
			// Get redirect URL from query params
			const searchParams = new URLSearchParams(window.location.search)
			const redirectUrl = searchParams.get("redirect")

			// Sign in with email and password
			const { data, error: signInError } = await supabaseClient.auth.signInWithPassword({
				email,
				password
			})

			if (signInError) throw signInError

			// Get handle and profile photo, cache in metadata, then redirect
			if (data.user) {
				const { data: profile } = await supabaseClient
					.from("profiles")
					.select("handle, profile_photo")
					.eq("user_id", data.user.id)
					.maybeSingle()

				if (profile) {
					// Cache profile info in user metadata
					await updateProfileCache(profile.handle || null, profile.profile_photo || null)

					// If redirect URL is provided, use it (user has profile, so they can go to redirect)
					// Otherwise, redirect to setup if no handle, or to profile if handle exists
					if (redirectUrl) {
						router.push(decodeURIComponent(redirectUrl))
					} else if (profile.handle) {
						router.push(`/whois?${profile.handle}`)
					} else {
						// No handle - redirect to setup
						router.push("/setup")
					}
				} else {
					// No profile - redirect to setup with redirect URL
					const setupUrl = redirectUrl
						? `/setup?redirect=${encodeURIComponent(redirectUrl)}`
						: "/setup"
					router.push(setupUrl)
				}
			}
		} catch (err: any) {
			setError(err.message)
		} finally {
			setSigningIn(false)
		}
	}

	const handleEmailSignUp = async (e: React.FormEvent | React.MouseEvent) => {
		e.preventDefault()
		setError(null)
		setSigningUp(true)

		try {
			// Get redirect URL from query params
			const searchParams = new URLSearchParams(window.location.search)
			const redirectUrl = searchParams.get("redirect")

			// Sign up with email and password
			const { data, error: signUpError } = await supabaseClient.auth.signUp({
				email,
				password,
				options: {
					emailRedirectTo: redirectUrl
						? `${window.location.origin}/setup?redirect=${encodeURIComponent(redirectUrl)}`
						: `${window.location.origin}/setup`
				}
			})

			if (signUpError) throw signUpError

			// Check if email confirmation is required by checking if session exists
			// Supabase only returns a session on signup if email confirmation is disabled
			if (data.session) {
				// No email confirmation required - redirect to setup
				const setupUrl = redirectUrl
					? `/setup?redirect=${encodeURIComponent(redirectUrl)}`
					: "/setup"
				router.push(setupUrl)
			} else {
				// Email confirmation required - show success message
				setSignupSuccess(true)
			}
		} catch (err: any) {
			setError(err.message)
		} finally {
			setSigningUp(false)
		}
	}

	const handleBackClick = () => {
		setError(null)
		setShowEmailForm(false)
	}

	const handleContinueEmailClick = () => {
		setError(null)
		setShowEmailForm(true)
	}

	return (
		<>
			<BackgroundContainer>
				<PotionBackground />
			</BackgroundContainer>
			<Container>
				<PageContainer alignItems="center">
					{signupSuccess ? (
						<SuccessContainer>
							<SuccessMessage
								title="Check your email"
								message="We've sent you a verification email. Please check your inbox and click the link to verify your account and complete the signup process."
							/>
						</SuccessContainer>
					) : (
						<>
							<Title>Sign In</Title>
							<Subtitle>Join the DEVx community</Subtitle>

							{error && <ErrorMessage>{error}</ErrorMessage>}

							{showEmailForm ? (
								<EmailForm
									onSubmit={(e) => {
										e.preventDefault()
										handleEmailSignIn(e)
									}}
								>
									<InputGroup>
										<TextInput
											type="email"
											variant="secondary"
											size="default"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											placeholder="Email"
											required
											disabled={signingIn || signingUp}
										/>
									</InputGroup>
									<InputGroup>
										<TextInput
											type="password"
											variant="secondary"
											size="default"
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											placeholder="Password"
											required
											minLength={6}
											disabled={signingIn || signingUp}
										/>
										<PasswordHelpText>Password must be at least 6 characters</PasswordHelpText>
									</InputGroup>
									<ButtonWrapper>
										<Button
											type="submit"
											size="default"
											variant="primary"
											disabled={signingIn || signingUp || !email || !password}
										>
											{signingIn ? "Signing in..." : "Sign In"}
										</Button>
										<Button
											type="button"
											size="default"
											variant="secondary"
											disabled={signingIn || signingUp || !email || !password}
											onClick={(e) => {
												if (e) {
													e.preventDefault()
													e.stopPropagation()
												}
												handleEmailSignUp(e!)
											}}
										>
											{signingUp ? "Signing up..." : "Sign Up"}
										</Button>
									</ButtonWrapper>
									<BackButton type="button" onClick={handleBackClick}>
										← Back to sign in options
									</BackButton>
								</EmailForm>
							) : (
								<ButtonContainer>
									<Button onClick={handleLogin("google")} size="default" variant="primary">
										Continue with Google
									</Button>

									<Button onClick={handleLogin("github")} size="default" variant="secondary">
										Continue with GitHub
									</Button>

									<Button onClick={handleContinueEmailClick} size="default" variant="tertiary">
										Continue with Email
									</Button>
								</ButtonContainer>
							)}
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
	padding: 1rem;
`

const Title = styled.h1`
	font-size: 2rem;
	font-weight: 700;
	color: white;
	margin: 0;
`

const Subtitle = styled.p`
	color: rgba(255, 255, 255, 0.7);
	margin: -1rem 0 0 0;
	text-align: center;
`

const ButtonContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 1rem;
	width: 100%;

	button {
		width: 100%;
		justify-content: center;
	}
`

const ErrorMessage = styled.div`
	color: #ff6b6b;
	background-color: rgba(255, 107, 107, 0.1);
	padding: 0.75rem;
	border-radius: 0.5rem;
	font-size: 0.875rem;
	text-align: center;
	width: 100%;
`

const EmailForm = styled.form`
	display: flex;
	flex-direction: column;
	gap: 1rem;
	width: 100%;
`

const ButtonWrapper = styled.div`
	display: flex;
	flex-direction: row;
	gap: 1rem;
	justify-content: center;
	width: 100%;
	margin-top: 1rem;

	button {
		flex: 1;
		justify-content: center;
	}
`

const InputGroup = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	gap: 0.5rem;
`

const PasswordHelpText = styled.p`
	color: rgba(255, 255, 255, 0.5);
	font-size: 0.75rem;
	margin: 0;
	line-height: 1.4;
`

const SuccessContainer = styled.div`
	width: 100%;
`

const BackButton = styled.button`
	background: none;
	border: none;
	color: rgba(255, 255, 255, 0.6);
	font-size: 0.875rem;
	cursor: pointer;
	padding: 0.5rem;
	margin-top: 0.5rem;
	transition: color 0.2s ease;
	font-family: inherit;

	&:hover {
		color: rgba(255, 255, 255, 0.9);
	}
`
