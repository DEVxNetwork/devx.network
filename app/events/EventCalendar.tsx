"use client"
import { css, styled } from "styled-components"
import { gatheringKind, gatheringTitle } from "@/app/content/community"
import { isGatheringPast, type PublicGathering } from "@/app/content/gatherings"
import {
	KIND_DOT,
	WEEKDAYS,
	formatDayLabel,
	formatMonth,
	monthGrid,
	pacificDayKey,
	todayKey
} from "./calendar"

//
// Types
//

type EventCalendarProps = {
	gatherings: PublicGathering[]
	month: string
	selectedDay: string
	onSelectDay: (dayKey: string) => void
}

//
// Components
//

export function EventCalendar({ gatherings, month, selectedDay, onSelectDay }: EventCalendarProps) {
	const today = todayKey()
	const byDay = indexByDay(gatherings)

	return (
		<Grid aria-label={`${formatMonth(month)} calendar`}>
			{WEEKDAYS.map((weekday) => (
				<Weekday key={weekday}>{weekday}</Weekday>
			))}
			{monthGrid(month).map((cell) => {
				const events = cell.inMonth ? (byDay.get(cell.key) ?? []) : []
				const isToday = cell.key === today
				const selected = cell.key === selectedDay
				if (!cell.inMonth && !isToday) {
					return (
						<Quiet key={cell.key}>
							<DayNumber $today={false}>{cell.day}</DayNumber>
						</Quiet>
					)
				}

				const label = dayLabel(cell.key, events)
				return (
					<Day
						key={cell.key}
						type="button"
						$selected={selected}
						aria-pressed={selected}
						aria-current={isToday ? "date" : undefined}
						aria-label={isToday ? `Today, ${label}` : label}
						onClick={() => onSelectDay(cell.key)}
					>
						<DayNumber $today={isToday}>{cell.day}</DayNumber>
						{events.slice(0, 2).map((gathering) => (
							<Chip
								key={gathering.id}
								$past={isGatheringPast(gathering)}
								$color={KIND_DOT[gatheringKind(gathering.name)]}
							>
								<ChipName>{gatheringTitle(gathering.name)}</ChipName>
							</Chip>
						))}
						{events.length > 2 ? <More>+{events.length - 2}</More> : null}
					</Day>
				)
			})}
		</Grid>
	)
}

const cell = css`
	box-sizing: border-box;
	min-width: 0;
	max-width: 100%;
	overflow: hidden;
	min-height: 5.75rem;
	padding: 0.45rem 0.4rem 0.4rem;
	border-top: 0;
	border-left: 0;
	border-right: 1px solid var(--border);
	border-bottom: 1px solid var(--border);

	&:nth-child(7n) {
		border-right: none;
	}

	&:nth-last-child(-n + 7) {
		border-bottom: none;
	}

	@media (max-width: 700px) {
		min-height: 2.75rem;
		padding: 0.28rem 0.1rem;
	}
`

const Grid = styled.div`
	display: grid;
	grid-template-columns: repeat(7, minmax(0, 1fr));
	width: 100%;
	overflow: hidden;
	background: var(--surface-solid);
`

const Weekday = styled.div`
	min-width: 0;
	overflow: hidden;
	padding: 0.6rem 0.15rem;
	border-right: 1px solid var(--border);
	border-bottom: 1px solid var(--border);
	background: var(--wash);
	text-align: center;
	font-size: 0.78rem;
	font-weight: 700;
	color: var(--subtle-foreground);

	&:nth-child(7n) {
		border-right: none;
	}

	@media (max-width: 700px) {
		font-size: 0.68rem;
		padding: 0.4rem 0.1rem;
	}
`

const Quiet = styled.div`
	${cell}
	color: var(--subtle-foreground);
	background: color-mix(in srgb, var(--wash) 70%, transparent);
`

const Day = styled.button<{ $selected: boolean }>`
	${cell}
	appearance: none;
	display: flex;
	flex-direction: column;
	align-items: stretch;
	width: 100%;
	margin: 0;
	font: inherit;
	text-align: left;
	color: inherit;
	cursor: pointer;
	background: ${(props) => (props.$selected ? "var(--wash)" : "transparent")};
	box-shadow: ${(props) => (props.$selected ? "inset 0 3px 0 var(--extrusion)" : "none")};

	&:hover {
		background: var(--wash);
	}

	&:focus-visible {
		outline: 2px solid var(--extrusion);
		outline-offset: -2px;
		z-index: 1;
	}

	@media (max-width: 700px) {
		align-items: center;
	}
`

const DayNumber = styled.span<{ $today: boolean }>`
	display: inline-flex;
	align-self: flex-start;
	align-items: center;
	justify-content: center;
	min-width: 1.55rem;
	height: 1.55rem;
	padding: 0 0.25rem;
	border-radius: 999px;
	font-size: 0.85rem;
	font-weight: 700;
	line-height: 1;
	background: ${(props) => (props.$today ? "var(--extrusion)" : "transparent")};
	color: ${(props) => (props.$today ? "var(--accent-contrast)" : "inherit")};

	@media (max-width: 700px) {
		align-self: center;
		min-width: 1.4rem;
		height: 1.4rem;
	}
`

const Chip = styled.span<{ $past: boolean; $color: string }>`
	box-sizing: border-box;
	display: block;
	width: 100%;
	min-width: 0;
	max-width: 100%;
	margin-top: 0.28rem;
	padding: 0.16rem 0.4rem 0.16rem 0.45rem;
	overflow: hidden;
	border-radius: 0.35rem;
	background: var(--surface-solid);
	box-shadow: inset 3px 0 0 ${(props) => props.$color};
	font-size: 0.78rem;
	font-weight: 600;
	line-height: 1.3;
	opacity: ${(props) => (props.$past ? 0.62 : 1)};

	@media (max-width: 700px) {
		width: 0.45rem;
		height: 0.45rem;
		margin-top: 0.18rem;
		padding: 0;
		border-radius: 999px;
		background: ${(props) => props.$color};
		box-shadow: inset 0 0 0 1px rgba(24, 24, 24, 0.28);
	}
`

const ChipName = styled.span`
	display: block;
	min-width: 0;
	max-width: 100%;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;

	@media (max-width: 700px) {
		display: none;
	}
`

const More = styled.span`
	display: block;
	margin-top: 0.12rem;
	font-size: 0.72rem;
	color: var(--muted-foreground);

	@media (max-width: 700px) {
		display: none;
	}
`

//
// Functions
//

function indexByDay(gatherings: PublicGathering[]): Map<string, PublicGathering[]> {
	const index = new Map<string, PublicGathering[]>()
	for (const gathering of gatherings) {
		const key = pacificDayKey(gathering)
		const list = index.get(key)
		if (list) list.push(gathering)
		else index.set(key, [gathering])
	}
	return index
}

function dayLabel(dayKey: string, gatherings: PublicGathering[]): string {
	if (gatherings.length === 0) return formatDayLabel(dayKey)
	const names = gatherings.map((gathering) => gatheringTitle(gathering.name)).join(", ")
	return `${formatDayLabel(dayKey)}. ${names}`
}
