"use client"
import { useMemo } from "react"
import { styled } from "styled-components"
import { talks } from "../info/talks"
import { Card, CardContent, CardTitle, CardText } from "../components/Card"
import { Button } from "../components/Button"

// Types

interface Talk {
	videoId: string
	speaker: string
	title: string
	date: string
	year: number
	startTime: string
	endTime: string
}

// Components

export default function Watch() {
	// Memoize video processing: sort by date, partition featured vs archive
	const { featuredTalks, talksByYear, years } = useMemo(() => {
		const sorted = [...talks].sort(
			(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
		)

		// Show 3 most recent talks in hero
		const featured = sorted.slice(0, 3)
		const remaining = sorted.slice(3)

		// Group remaining talks by year (excludes featured)
		const grouped = remaining.reduce(
			(acc: Record<number, Talk[]>, talk) => {
				if (!acc[talk.year]) acc[talk.year] = []
				acc[talk.year].push(talk)
				return acc
			},
			{} as Record<number, Talk[]>
		)

		const sortedYears = Object.keys(grouped)
			.map(Number)
			.sort((a, b) => b - a)

		return {
			featuredTalks: featured,
			talksByYear: grouped,
			years: sortedYears
		}
	}, [])

	return (
		<>
			<Main>
				<HeroSection>
					<Eyebrow>Talks</Eyebrow>
					<Title>The room, on the record.</Title>
					<HeroBlurb>
						Every Weekend Function is livestreamed. The talks come from people in the seats. Within
						a week of each one, the speaker gets the recording and a transcript. These are the ones
						we kept.
					</HeroBlurb>

					{/* 3 most recent talks displayed as cards */}
					<FeaturedGrid>
						{featuredTalks.map((talk) => (
							<Card
								key={`${talk.videoId}-${talk.speaker}`}
								image={getYouTubeThumbnail(talk.videoId)}
								imageAlt={talk.title}
								showPlayButton
								imageAspectRatio="16/9"
								href={buildYouTubeUrl(talk.videoId, talk.startTime)}
								target="_blank"
								rel="noopener noreferrer"
							>
								<CardContent>
									<CardTitle $size="1rem">{talk.title}</CardTitle>
									<CardText $size="0.9rem" $weight="600">
										{talk.speaker}
									</CardText>
								</CardContent>
							</Card>
						))}
					</FeaturedGrid>
				</HeroSection>

				<WatchSection>
					{years.map((year) => {
						const yearTalks = talksByYear[year]

						if (yearTalks.length === 0) return null

						return (
							<YearSection key={year}>
								<YearHeader>{year}</YearHeader>

								{/* Render all talks in grid */}
								<LivestreamGrid>
									{yearTalks.map((talk: Talk) => (
										<Card
											key={`${talk.videoId}-${talk.speaker}`}
											image={getYouTubeThumbnail(talk.videoId)}
											imageAlt={talk.title}
											showPlayButton
											imageAspectRatio="16/9"
											href={buildYouTubeUrl(talk.videoId, talk.startTime)}
											target="_blank"
											rel="noopener noreferrer"
										>
											<CardContent $padding="1rem 1rem">
												<CardText $size="0.9rem" $color="var(--muted-foreground)" $weight="500">
													{talk.title}
												</CardText>
												<CardText $size="0.85rem" $color="var(--subtle-foreground)" $weight="600">
													{talk.speaker}
												</CardText>
											</CardContent>
										</Card>
									))}
								</LivestreamGrid>
							</YearSection>
						)
					})}
					<ButtonSection>
						<Button href="/slides" variant="secondary">
							Read the slides
						</Button>
						<Button
							href="https://www.youtube.com/@DEVxNetwork"
							target="_blank"
							rel="noopener noreferrer"
						>
							Watch on YouTube
						</Button>
					</ButtonSection>
				</WatchSection>
			</Main>
		</>
	)
}

// Styles

const Main = styled.main`
	position: relative;
`

const WatchSection = styled.section`
	width: min(var(--column), calc(100% - 2.5rem));
	margin: 0 auto 4rem;
`

const LivestreamGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
	gap: 1.5rem;
	width: 100%;

	@media (min-width: 768px) {
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
	}

	@media (min-width: 1200px) {
		grid-template-columns: repeat(4, 1fr);
	}
`

const ButtonSection = styled.div`
	margin-top: 2rem;
	display: flex;
	flex-wrap: wrap;
	gap: 0.75rem;
`

const HeroSection = styled.section`
	width: min(var(--column), calc(100% - 2.5rem));
	margin: 0 auto;
	padding: 3rem 0 2.5rem;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 1.5rem;
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

const Title = styled.h1`
	margin: 0;
	font-family: "Fraunces", "Iowan Old Style", Palatino, serif;
	font-size: clamp(1.9rem, 3.5vw, 2.9rem);
	font-weight: 560;
	letter-spacing: -0.03em;
	line-height: 1.18;
	color: var(--foreground);
`

const HeroBlurb = styled.p`
	font-size: 1.1rem;
	line-height: 1.6;
	color: var(--muted-foreground);
	text-align: left;
	max-width: 40rem;
	margin: 0;
`

const FeaturedGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 2rem;
	width: 100%;

	@media (max-width: 968px) {
		grid-template-columns: 1fr;
		gap: 1.5rem;
	}
`

const YearSection = styled.div`
	margin-bottom: 4rem;
	scroll-margin-top: 4.5rem;
`

const YearHeader = styled.h2`
	font-family: "Fraunces", "Iowan Old Style", Palatino, serif;
	font-size: 2rem;
	font-weight: 560;
	letter-spacing: -0.03em;
	margin-bottom: 1.25rem;
	text-align: left;
	color: var(--foreground);
	border-bottom: 1px solid var(--border);
	padding-bottom: 0.6rem;
`

// Utility Functions

const buildYouTubeUrl = (id: string, startTime?: string) => {
	let url = `https://youtube.com/watch?v=${id}`

	if (startTime && startTime !== "0s") {
		url += `&t=${startTime}`
	}

	return url
}

const getYouTubeThumbnail = (id: string) => {
	// Use hqdefault for consistent availability across all videos
	return `https://img.youtube.com/vi/${id}/hqdefault.jpg`
}
