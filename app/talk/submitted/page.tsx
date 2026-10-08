"use client"
import styled from "styled-components"

// Components //

export default function TalkSubmitted() {
	return (
		<Main>
			<SuccessContainer>
				<SuccessTitle>Thank You!</SuccessTitle>
				<SuccessMessage>
					Your talk submission has been received. We&apos;ll review it and get back to you soon.
				</SuccessMessage>
				<BackLink href="/talk">Submit Another Talk</BackLink>
			</SuccessContainer>
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

const SuccessContainer = styled.div`
	max-width: 30rem;
	margin: 0 auto;
	padding: 3rem;
	background-color: rgba(var(--foreground-rgb), 0.05);
	backdrop-filter: blur(10px);
	border-radius: 0.5rem;
	border: 1px solid var(--border);
	text-align: center;
`

const SuccessTitle = styled.h1`
	font-size: 2rem
	font-weight: bold
	color: #10b981
	margin-bottom: 1rem
`

const SuccessMessage = styled.p`
	color: var(--muted-foreground);
	font-size: 1.125rem;
	margin-bottom: 2rem;
	line-height: 1.6;
`

const BackLink = styled.a`
	display: inline-block;
	padding: 0.75rem 1.5rem;
	background-color: #8b5cf6;
	color: var(--foreground);
	border-radius: 0.375rem;
	text-decoration: none;
	font-weight: 500;
	transition: all 0.2s ease;

	&:hover {
		background-color: #7c3aed;
		transform: translateY(-1px);
	}
`
