"use client"
import styled from "styled-components"
import { PotionBackground } from "../components/PotionBackground"

export function ProfileNotFound() {
	return (
		<>
			<BackgroundContainer>
				<PotionBackground />
			</BackgroundContainer>
			<Container>
				<NotFoundContent>
					<NotFoundTitle>404</NotFoundTitle>
					<NotFoundText>Profile not found</NotFoundText>
				</NotFoundContent>
			</Container>
		</>
	)
}

const BackgroundContainer = styled.section`
	background-color: var(--background);
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
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
	padding: 2rem;
`

const NotFoundContent = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 1rem;
	margin-top: 4rem;
`

const NotFoundTitle = styled.h1`
	font-size: 6rem;
	font-weight: 700;
	color: var(--foreground);
	margin: 0;
`

const NotFoundText = styled.p`
	color: rgba(var(--foreground-rgb), 0.7);
	font-size: 1.25rem;
	margin: 0;
`
