"use client"

import styled from "styled-components"
import Link from "next/link"
import type { SlideData } from "./slidesData"

// Types //

interface SlidesListClientProps {
	slides: SlideData[]
}

// Components //

export default function SlidesListClient({ slides }: SlidesListClientProps) {
	return (
		<Main>
			<ContentSection>
				<SectionTitle>Slides</SectionTitle>

				{slides.length === 0 ? (
					<EmptyState>No slides available yet.</EmptyState>
				) : (
					<SlidesList>
						{slides.map((slide) => (
							<SlideCard key={slide.slug} href={`/slides/${slide.slug}`}>
								<SlideTitle>{slide.metadata.title}</SlideTitle>
								<SlideAuthor>by {slide.metadata.author}</SlideAuthor>
								<SlideDescription>{slide.metadata.description}</SlideDescription>
							</SlideCard>
						))}
					</SlidesList>
				)}
			</ContentSection>
		</Main>
	)
}

// Styled Components //

const Main = styled.main`
	color: white;
	display: flex;
	flex-direction: column;
	align-items: center;
`

const ContentSection = styled.section`
	width: 100%;
	max-width: 1200px;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
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

const SectionTitle = styled.h1`
	font-size: clamp(2rem, 6vw, 3rem);
	font-weight: 700;
	margin: 0;
`

const EmptyState = styled.p`
	font-size: 1.125rem;
	color: rgba(255, 255, 255, 0.7);
`

const SlidesList = styled.div`
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
`

const SlideCard = styled(Link)`
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	padding: 1.5rem;
	background: rgba(255, 255, 255, 0.03);
	border-radius: 0.5rem;
	text-decoration: none;
	color: inherit;
	transition: background-color 0.3s ease;

	&:hover {
		background: rgba(255, 255, 255, 0.08);
	}
`

const SlideTitle = styled.h2`
	font-size: 1.5rem;
	font-weight: 600;
	margin: 0;
`

const SlideAuthor = styled.p`
	font-size: 1rem;
	color: rgba(255, 255, 255, 0.6);
	margin: 0;
`

const SlideDescription = styled.p`
	font-size: 1rem;
	line-height: 1.6;
	color: rgba(255, 255, 255, 0.8);
	margin: 0.5rem 0 0;
`
