"use client"
import { useMemo } from "react"
import styled from "styled-components"
import { talks } from "../info/talks"
import { PotionBackground } from "../components/PotionBackground"
import { ErrorBoundary } from "../components/ErrorBoundary"
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
			<BackgroundContainer>
				<ErrorBoundary
					fallback={
						<div style={{ backgroundColor: "var(--background)", width: "100%", height: "100%" }} />
					}
				>
					<PotionBackground />
				</ErrorBoundary>
			</BackgroundContainer>
			<Main>
				{/* Hero section: intro blurb + featured talks grid */}
				<HeroSection>
					<HeroBlurb>
						{`DEVx brings developers together to share ideas and spark conversations.
Our monthly events feature talks on topics in software development and engineering.
Explore our collection of presentations from the community.`}
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
						<Button
							href="https://www.youtube.com/@DEVxNetwork"
							target="_blank"
							rel="noopener noreferrer"
						>
							Watch More
						</Button>
					</ButtonSection>
				</WatchSection>
			</Main>
		</>
	)
}

// Styles

const BackgroundContainer = styled.section`
	background-color: var(--background);
	position: fixed;
	height: 100vh;
	width: 100vw;
	top: 0;
	left: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`

const Main = styled.main`
	position: relative;
	z-index: 1;
`

const WatchSection = styled.section`
	background-color: transparent;
	padding: 2rem;
	border-radius: 0.5rem;
	box-shadow:
		0 4px 6px -1px rgba(0, 0, 0, 0.1),
		0 2px 4px -1px rgba(0, 0, 0, 0.06);
	margin-bottom: 3rem;
	max-width: 1200px;
	margin-left: auto;
	margin-right: auto;
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
	margin-top: 3rem;
	display: flex;
	justify-content: center;
`

const HeroSection = styled.section`
	max-width: 1200px;
	width: 100%;
	min-height: 100vh;
	margin: 0 auto;
	padding: 4rem 2rem;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 3rem;

	@media (max-width: 968px) {
		padding: 2rem 1rem;
		gap: 2rem;
	}
`

const HeroBlurb = styled.p`
	font-size: 1.25rem;
	line-height: 1.8;
	color: var(--muted-foreground);
	text-align: center;
	max-width: 900px;
	margin: 0;
	white-space: pre-line;

	@media (max-width: 768px) {
		font-size: 1.1rem;
		line-height: 1.6;
	}
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
`

const YearHeader = styled.h2`
	font-size: 2.5rem;
	font-weight: bold;
	margin-bottom: 2rem;
	text-align: center;
	color: var(--foreground);
	border-bottom: 2px solid rgba(var(--foreground-rgb), 0.2);
	padding-bottom: 1rem;
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
