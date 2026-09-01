"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import styled from "styled-components"
import { TextInput } from "../components/TextInput"

// Components //

export default function Talk() {
	const router = useRouter()
	const [isSubmitting, setIsSubmitting] = useState(false)

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setIsSubmitting(true)

		// For now, we'll just simulate a submission and redirect
		// In production, this would submit to a form service like:
		// - Formspree
		// - Netlify Forms
		// - Google Forms
		// - Custom serverless function

		const formData = new FormData(e.currentTarget)
		const data = {
			speaker: formData.get("speaker"),
			title: formData.get("title"),
			description: formData.get("description")
		}

		// Log the submission for now
		console.log("Talk submission:", data)

		// Simulate API delay
		await new Promise((resolve) => setTimeout(resolve, 1000))

		// Redirect to success page
		router.push("/talk/submitted")
	}

	return (
		<Main>
			<FormContainer onSubmit={handleSubmit}>
				<TextInput
					type="text"
					placeholder="Speaker Name"
					name="speaker"
					variant="secondary"
					size="default"
					required
				/>
				<TextInput
					type="text"
					placeholder="Talk Title"
					name="title"
					variant="secondary"
					size="default"
					required
				/>
				<TextArea placeholder="Talk Description..." name="description" required></TextArea>
				<ButtonContainer>
					<ResetButton type="reset" value="Reset" disabled={isSubmitting} />
					<SubmitButton type="submit" disabled={isSubmitting}>
						{isSubmitting ? "Submitting..." : "Submit"}
					</SubmitButton>
				</ButtonContainer>
			</FormContainer>
		</Main>
	)
}

const Main = styled.main`
	padding-top: 5rem;
	min-height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
`

const FormContainer = styled.form`
	width: 100%;
	max-width: 48rem;
	margin: 0 auto;
	padding: 2rem;
	background-color: rgba(var(--foreground-rgb), 0.05);
	backdrop-filter: blur(10px);
	border-radius: 0.5rem;
	border: 1px solid var(--border);
	display: flex;
	flex-direction: column;
	gap: 1rem;

	@media (min-width: 768px) {
		padding: 3rem;
	}
`

const TextArea = styled.textarea`
	padding: 0.75rem;
	border-radius: 0.375rem;
	background-color: rgba(0, 0, 0, 0.8);
	color: var(--foreground);
	border: 1px solid rgba(var(--foreground-rgb), 0.2);
	font-size: 1rem;
	min-height: 8rem;
	resize: vertical;
	font-family: inherit;
	transition: all 0.2s;

	&:focus {
		outline: none;
		border-color: rgba(147, 51, 234, 0.5);
		box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.1);
	}

	&::placeholder {
		color: rgba(var(--foreground-rgb), 0.5);
	}

	&:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
`

const ButtonContainer = styled.div`
	display: flex;
	gap: 1rem;
	margin-top: 1rem;

	@media (max-width: 640px) {
		flex-direction: column;
	}
`

const Button = styled.button`
	padding: 0.75rem 2rem;
	border-radius: 0.375rem;
	font-size: 1rem;
	font-weight: 500;
	transition: all 0.2s;
	cursor: pointer;
	border: none;

	&:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
`

const SubmitButton = styled(Button)`
	background: linear-gradient(135deg, rgba(147, 51, 234, 0.8), rgba(99, 102, 241, 0.8));
	color: var(--foreground);

	&:hover:not(:disabled) {
		background: linear-gradient(135deg, rgba(147, 51, 234, 1), rgba(99, 102, 241, 1));
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(147, 51, 234, 0.4);
	}

	&:active:not(:disabled) {
		transform: translateY(0);
	}
`

const ResetButton = styled.input`
	padding: 0.75rem 2rem;
	border-radius: 0.375rem;
	font-size: 1rem;
	font-weight: 500;
	transition: all 0.2s;
	cursor: pointer;
	background-color: rgba(var(--foreground-rgb), 0.1);
	color: var(--foreground);
	border: 1px solid rgba(var(--foreground-rgb), 0.2);

	&:hover:not(:disabled) {
		background-color: rgba(var(--foreground-rgb), 0.15);
		transform: translateY(-1px);
	}

	&:active:not(:disabled) {
		transform: translateY(0);
	}

	&:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
`
