"use client"
import styled from "styled-components"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabaseClient } from "../../lib/supabaseClient"
import { PotionBackground } from "../components/PotionBackground"
import { Button } from "../components/Button"
import { PageContainer } from "../components/PageContainer"
import { TextInput } from "../components/TextInput"
import { SuccessMessage } from "../components/SuccessMessage"

export default function ResetPasswordPage() {
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const [success, setSuccess] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [password, setPassword] = useState("")
	const [confirmPassword, setConfirmPassword] = useState("")
	const router = useRouter()

	useEffect(() => {
		const checkRecoverySession = async () => {
			const {
				data: { session }
			} = await supabaseClient.auth.getSession()

			if (!session?.user) {
				setError("Password reset link is invalid or has expired. Please request a new one.")
			}

			setLoading(false)
		}

		checkRecoverySession()
	}, [])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError(null)

		if (!password || !confirmPassword) {
			setError("Please fill in both password fields.")
			return
		}

		if (password !== confirmPassword) {
			setError("Passwords do not match.")
			return
		}

		try {
			setSaving(true)
			const { error: updateError } = await supabaseClient.auth.updateUser({ password })
			if (updateError) throw updateError
			setSuccess(true)
		} catch (err: any) {
			setError(err?.message || "Failed to update password.")
		} finally {
			setSaving(false)
		}
	}

	const handleBackToLogin = async () => {
		// Recovery + updateUser leaves a valid session; /login auto-redirects if a session exists.
		await supabaseClient.auth.signOut()
		const searchParams = new URLSearchParams(window.location.search)
		const redirectParam = searchParams.get("redirect")
		const loginUrl = redirectParam
			? `/login?redirect=${encodeURIComponent(redirectParam)}`
			: "/login"
		router.push(loginUrl)
	}

	if (loading) {
		return (
			<>
				<BackgroundContainer>
					<PotionBackground />
				</BackgroundContainer>
				<Container>
					<PageContainer alignItems="center">
						<Title>Reset Password</Title>
						<Subtitle>Loading...</Subtitle>
					</PageContainer>
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
				<PageContainer alignItems="center">
					<Title>Reset Password</Title>
					<Subtitle>Choose a new password for your account</Subtitle>

					{error && <ErrorMessage>{error}</ErrorMessage>}

					{success ? (
						<SuccessContainer>
							<SuccessMessage
								title="Password updated"
								message="Your password has been reset. You can now sign in with your new password."
							/>
							<Button type="button" variant="primary" size="default" onClick={handleBackToLogin}>
								Go to Sign In
							</Button>
						</SuccessContainer>
					) : (
						<Form onSubmit={handleSubmit}>
							<InputGroup>
								<TextInput
									type="password"
									variant="secondary"
									size="default"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder="New password"
									required
									minLength={6}
									disabled={saving}
								/>
							</InputGroup>
							<InputGroup>
								<TextInput
									type="password"
									variant="secondary"
									size="default"
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									placeholder="Confirm new password"
									required
									minLength={6}
									disabled={saving}
								/>
							</InputGroup>
							<Button type="submit" size="default" variant="primary" disabled={saving}>
								{saving ? "Updating..." : "Update Password"}
							</Button>
						</Form>
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

const Form = styled.form`
	display: flex;
	flex-direction: column;
	gap: 1rem;
	width: 100%;
`

const InputGroup = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	gap: 0.5rem;
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

const SuccessContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 1rem;
	width: 100%;
`
