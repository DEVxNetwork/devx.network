"use client"

import { styled } from "styled-components"
import { Link } from "../components/Link"
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
				<Eyebrow>From the seats</Eyebrow>
				<SectionTitle>Slides from the room.</SectionTitle>
				<Lead>
					Decks members have given at Weekend Function. The recordings live on{" "}
					<Link href="/watch">Watch</Link>.
				</Lead>

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
	color: var(--foreground);
	display: flex;
	flex-direction: column;
	align-items: center;
`

const ContentSection = styled.section`
	width: min(var(--column), calc(100% - 2.5rem));
	display: flex;
	flex-direction: column;
	padding: 3rem 0 4rem;
	box-sizing: border-box;
	gap: 0.8rem;
`

const Eyebrow = styled.p`
	margin: 0;
	font-family: "Chivo", sans-serif;
	font-size: 0.78rem;
	font-weight: 700;
	letter-spacing: 0.16em;
	text-transform: uppercase;
	color: var(--accent);
`

const SectionTitle = styled.h1`
	font-family: "Fraunces", "Iowan Old Style", Palatino, serif;
	font-size: clamp(1.9rem, 3.5vw, 2.9rem);
	font-weight: 560;
	letter-spacing: -0.03em;
	line-height: 1.18;
	margin: 0;
`

const Lead = styled.p`
	margin: 0 0 1.2rem;
	max-width: 38rem;
	color: var(--muted-foreground);
	font-size: 1.05rem;
	line-height: 1.55;

	a {
		color: var(--accent);
	}
`

const EmptyState = styled.p`
	font-size: 1.125rem;
	color: rgba(var(--foreground-rgb), 0.7);
`

const SlidesList = styled.div`
	display: flex;
	flex-direction: column;
	border-bottom: 1px solid var(--border);
`

const SlideCard = styled(Link)`
	display: flex;
	flex-direction: column;
	gap: 0.35rem;
	padding: 1.25rem 0;
	border-top: 1px solid var(--border);
	text-decoration: none;
	color: inherit;

	&:hover h2 {
		color: var(--accent);
	}
`

const SlideTitle = styled.h2`
	font-family: "Fraunces", "Iowan Old Style", Palatino, serif;
	font-size: 1.45rem;
	font-weight: 560;
	letter-spacing: -0.02em;
	margin: 0;
`

const SlideAuthor = styled.p`
	font-size: 1rem;
	color: rgba(var(--foreground-rgb), 0.6);
	margin: 0;
`

const SlideDescription = styled.p`
	font-size: 1rem;
	line-height: 1.6;
	color: rgba(var(--foreground-rgb), 0.8);
	margin: 0.5rem 0 0;
`
