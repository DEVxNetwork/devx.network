"use client"
import { useEffect, useMemo, useRef, useState } from "react"
import { styled } from "styled-components"
import { Button } from "../components/Button"
import { isGatheringPast, type PublicGathering } from "../content/gatherings"
import { EventMap } from "./EventMap"
import type { EventPlace } from "./eventPlace"
import { GatheringList } from "./GatheringList"

//
// Types
//

type EventScope = "upcoming" | "all"

type EventsPageProps = {
	upcoming: PublicGathering[]
	past: PublicGathering[]
	places: Record<string, EventPlace>
	covers: Record<string, string>
}

//
// Components
//

export function EventsPage({ upcoming, past, places, covers }: EventsPageProps) {
	const gatherings = useMemo(() => mergeGatherings(upcoming, past), [upcoming, past])
	const [scope, setScope] = useState<EventScope>("upcoming")
	const visible = useMemo(() => eventsForScope(gatherings, scope), [gatherings, scope])
	const [selectedId, setSelectedId] = useState<string | null>(null)
	const activeId = visible.some((gathering) => gathering.id === selectedId)
		? selectedId
		: (visible[0]?.id ?? null)

	const skipScroll = useRef(true)
	useEffect(() => {
		if (skipScroll.current) {
			skipScroll.current = false
			return
		}
		if (!activeId) return
		const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
		document.getElementById(`gathering-${activeId}`)?.scrollIntoView({
			behavior: reduce ? "auto" : "smooth",
			block: "nearest"
		})
	}, [activeId])

	return (
		<Explore>
			<ListPane>
				<ListHead>
					<Title>Our Events</Title>
					<Filters role="group" aria-label="Which events">
						<Filter
							type="button"
							$on={scope === "all"}
							aria-pressed={scope === "all"}
							onClick={() => setScope("all")}
						>
							All events
						</Filter>
						<Filter
							type="button"
							$on={scope === "upcoming"}
							aria-pressed={scope === "upcoming"}
							onClick={() => setScope("upcoming")}
						>
							Upcoming
						</Filter>
					</Filters>
				</ListHead>
				<GatheringList
					gatherings={visible}
					covers={covers}
					selectedId={activeId}
					onSelect={setSelectedId}
				/>
				<Speak>
					<Button href="/speak" variant="secondary" size="default">
						Add to the conversation
					</Button>
				</Speak>
			</ListPane>
			<MapPane>
				<EventMap
					gatherings={visible}
					places={places}
					selectedId={activeId}
					onSelect={setSelectedId}
				/>
			</MapPane>
		</Explore>
	)
}

const Explore = styled.div`
	--events-canvas: #f5f5f5;
	--events-selected: #eaeaea;
	display: flex;
	flex-direction: column;
	width: 100%;
	background: var(--events-canvas);

	@media (prefers-color-scheme: dark) {
		--events-canvas: #222222;
		--events-selected: #2a2a2a;
	}

	@media (min-width: 960px) {
		flex-direction: row;
		align-items: stretch;
		height: calc(100svh - var(--announce-offset) - 4rem);
		min-height: 32rem;
		background: var(--background);
	}
`

const ListPane = styled.section`
	display: flex;
	flex-direction: column;
	gap: 1rem;
	min-width: 0;
	padding: 1.25rem 1rem 2.5rem;

	@media (min-width: 960px) {
		flex: 0 0 28rem;
		width: min(28rem, 42%);
		overflow: auto;
		border-right: 1px solid var(--border);
		background: var(--events-canvas);
		padding: 1.15rem 1rem 1.5rem;
	}
`

const ListHead = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.85rem;
`

const Title = styled.h1`
	margin: 0;
	font-family: "Fraunces", "Iowan Old Style", Palatino, serif;
	font-size: clamp(2rem, 4vw, 2.4rem);
	font-weight: 560;
	letter-spacing: -0.03em;
	line-height: 1;
`

const Filters = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
`

const Filter = styled.button<{ $on: boolean }>`
	appearance: none;
	margin: 0;
	padding: 0.4rem 0.85rem;
	border: 0;
	border-radius: 999px;
	background: ${(props) => (props.$on ? "var(--surface-solid)" : "transparent")};
	box-shadow: ${(props) => (props.$on ? "0 1px 2px rgba(24, 24, 24, 0.08)" : "none")};
	color: ${(props) => (props.$on ? "var(--foreground)" : "var(--muted-foreground)")};
	font: inherit;
	font-size: 0.95rem;
	font-weight: 600;
	line-height: 1.2;
	cursor: pointer;

	&:hover {
		color: var(--foreground);
	}

	&:focus-visible {
		outline: 2px solid var(--extrusion);
		outline-offset: 2px;
	}
`

const Speak = styled.div`
	margin-top: 0.5rem;
`

const MapPane = styled.div`
	display: none;
	min-width: 0;

	@media (min-width: 960px) {
		display: block;
		flex: 1 1 auto;
		height: 100%;
		min-height: 0;
		overflow: hidden;
	}
`

//
// Functions
//

function mergeGatherings(upcoming: PublicGathering[], past: PublicGathering[]): PublicGathering[] {
	const seen = new Set<string>()
	const merged: PublicGathering[] = []
	for (const gathering of [...upcoming, ...past]) {
		if (seen.has(gathering.id)) continue
		seen.add(gathering.id)
		merged.push(gathering)
	}
	return merged
}

function eventsForScope(gatherings: PublicGathering[], scope: EventScope): PublicGathering[] {
	const source =
		scope === "upcoming"
			? gatherings.filter((gathering) => !isGatheringPast(gathering))
			: gatherings
	const sorted = [...source].sort((a, b) => a.start.localeCompare(b.start))
	if (scope === "all") sorted.reverse()
	return sorted
}
