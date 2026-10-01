"use client"
import { styled } from "styled-components"
import { Button } from "../components/Button"
import { aboutChapters, aboutLead, aboutNow } from "../content/community"

//
// Components
//

export function WhoWeAre() {
	return (
		<Main>
			<Story>
				<Mission>The room teaches itself.</Mission>
				<Purpose>{aboutLead}</Purpose>
				<Frame>
					<Photo src={aboutNow.src} alt={aboutNow.alt} />
					<Caption>One of our newer pictures.</Caption>
				</Frame>
			</Story>

			{aboutChapters.map((chapter) => (
				<Chapter key={chapter.kicker}>
					<Kicker>{chapter.kicker}</Kicker>
					<Frames $pair={chapter.pictures.length > 1}>
						{chapter.pictures.map((picture) => (
							<Photo key={picture.src} src={picture.src} alt={picture.alt} />
						))}
					</Frames>
					<SectionTitle>{chapter.title}</SectionTitle>
					<Purpose>{chapter.copy}</Purpose>
				</Chapter>
			))}

			<Close>
				<SectionTitle>Join the community.</SectionTitle>
				<Purpose>A seat at the next one is the way in.</Purpose>
				<Button href="/events" variant="primary" size="default">
					See our events
				</Button>
			</Close>
		</Main>
	)
}

//
// Styled Components
//

const Main = styled.main`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
`

const Story = styled.section`
	width: min(var(--column), calc(100% - 2.5rem));
	padding: 3.25rem 0 0.5rem;
`

const Mission = styled.h1`
	margin: 0;
	max-width: 11ch;
	font-family: "Fraunces", "Iowan Old Style", Palatino, serif;
	font-weight: 560;
	font-size: clamp(3rem, 7vw, 5.4rem);
	line-height: 0.92;
	letter-spacing: -0.04em;
	color: var(--foreground);
`

const Purpose = styled.p`
	margin: 1rem 0 0;
	max-width: 36rem;
	font-size: 1.15rem;
	line-height: 1.45;
	color: var(--muted-foreground);
`

const Frame = styled.figure`
	margin: 1.75rem 0 0;
`

const Photo = styled.img`
	display: block;
	width: 100%;
	height: auto;
	border-radius: 1.25rem;
	background: var(--wash);
`

const Caption = styled.figcaption`
	margin-top: 0.75rem;
	font-family: "Fraunces", "Iowan Old Style", Palatino, serif;
	font-size: 1.15rem;
	font-weight: 560;
	letter-spacing: -0.02em;
`

const Chapter = styled.section`
	width: min(var(--column), calc(100% - 2.5rem));
	padding: 2.75rem 0 0.25rem;
`

const Kicker = styled.p`
	margin: 0;
	font-size: 0.95rem;
	letter-spacing: 0.04em;
	color: var(--accent);
`

const Frames = styled.div<{ $pair: boolean }>`
	display: grid;
	grid-template-columns: ${(props) => (props.$pair ? "1fr 1fr" : "1fr")};
	gap: 1rem;
	margin-top: 0.85rem;

	${Photo} {
		aspect-ratio: ${(props) => (props.$pair ? "3 / 2" : "auto")};
		object-fit: ${(props) => (props.$pair ? "cover" : "fill")};
		object-position: center;
	}

	@media (max-width: 800px) {
		grid-template-columns: 1fr;

		${Photo} {
			aspect-ratio: auto;
			object-fit: fill;
		}
	}
`

const SectionTitle = styled.h2`
	margin: 1.15rem 0 0;
	max-width: 18ch;
	font-family: "Fraunces", "Iowan Old Style", Palatino, serif;
	font-weight: 560;
	font-size: clamp(1.7rem, 3vw, 2.4rem);
	line-height: 1.1;
	letter-spacing: -0.03em;
`

const Close = styled.section`
	width: min(var(--column), calc(100% - 2.5rem));
	padding: 2.75rem 0 3rem;
	border-top: 1px solid var(--border);
	margin-top: 2.75rem;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 1rem;

	${SectionTitle} {
		margin-top: 0;
	}

	${Purpose} {
		margin-top: 0;
	}
`
