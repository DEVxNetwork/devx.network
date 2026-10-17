"use client"

import styled from "styled-components"
import { Button } from "@/app/components/Button"
import type { SlideData } from "../slidesData"

// Types //

interface SlideDetailClientProps {
	slideData: SlideData
}

// Components //

export default function SlideDetailClient({ slideData }: SlideDetailClientProps) {
	const { slug, metadata } = slideData
	const slideUrl = `/slides/${slug}/slides.html`
	const formattedDate = new Date(metadata.timestamp).toLocaleDateString(undefined, {
		year: "numeric",
		month: "long",
		day: "numeric"
	})

	return (
		<Main>
			<ContentSection>
				<SlideContainer>
					<SlideIframe src={slideUrl} title={metadata.title} allowFullScreen />
				</SlideContainer>

				<MetadataSection>
					<SectionTitle>{metadata.title}</SectionTitle>
					<MetaInfo>
						<Author>Presented by {metadata.author}</Author>
						<DateText>{formattedDate}</DateText>
					</MetaInfo>
					<Description>{metadata.description}</Description>

					<ButtonRow>
						<Button href={slideUrl} variant="primary" size="default">
							<ShareIcon />
							Share
						</Button>
						<Button href="/slides" variant="secondary" size="default">
							All Slides
						</Button>
					</ButtonRow>
				</MetadataSection>
			</ContentSection>
		</Main>
	)
}

// Sub-components //

function ShareIcon() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
			<polyline points="16 6 12 2 8 6" />
			<line x1="12" y1="2" x2="12" y2="15" />
		</svg>
	)
}

// Styled Components //

const Main = styled.main`
	color: var(--foreground);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`

const ContentSection = styled.section`
	position: relative;
	width: 100vw;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 4rem;
	padding-top: 6rem;
	box-sizing: border-box;
	gap: 2rem;

	@media (max-width: 1024px) {
		padding: 3rem;
		padding-top: 5rem;
	}

	@media (max-width: 768px) {
		padding: 2rem;
		padding-top: 5rem;
	}

	@media (max-width: 480px) {
		padding: 1rem;
		padding-top: 4rem;
	}
`

const SlideContainer = styled.div`
	position: relative;
	width: 100%;
	max-width: 1200px;
	padding-top: min(56.25%, 675px); /* 16:9 aspect ratio, max height */
	background: rgba(0, 0, 0, 0.4);
	border-radius: 0.5rem;
	overflow: hidden;
	box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
`

const SlideIframe = styled.iframe`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	border: none;
`

const MetadataSection = styled.section`
	display: flex;
	flex-direction: column;
	gap: 1rem;
	max-width: 1200px;
	width: 100%;
	padding: 2rem;
	background: rgba(var(--foreground-rgb), 0.03);
	border-radius: 0.5rem;
	backdrop-filter: blur(8px);
`

const SectionTitle = styled.h1`
	font-size: clamp(1.5rem, 4vw, 2.5rem);
	font-weight: 700;
	margin: 0;
`

const MetaInfo = styled.div`
	display: flex;
	gap: 1rem;
	align-items: center;
	flex-wrap: wrap;
`

const Author = styled.p`
	font-size: 1.125rem;
	color: rgba(var(--foreground-rgb), 0.7);
	margin: 0;
`

const DateText = styled.p`
	font-size: 1rem;
	color: rgba(var(--foreground-rgb), 0.5);
	margin: 0;
`

const Description = styled.p`
	font-size: 1.125rem;
	line-height: 1.8;
	color: rgba(var(--foreground-rgb), 0.9);
	font-weight: 300;
	margin: 0.5rem 0;

	@media (max-width: 768px) {
		font-size: 1.05rem;
		line-height: 1.7;
	}
`

const ButtonRow = styled.div`
	display: flex;
	gap: 1rem;
	margin-top: 1rem;
	flex-wrap: wrap;
`
