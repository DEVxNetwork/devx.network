"use client"
import { styled } from "styled-components"
import { monthlyHeadline } from "../content/community"
import { formatPublicWhen, gatheringPlace, type PublicGathering } from "../content/gatherings"
import { Link } from "./Link"

//
// Types
//

export type AnnouncementBarProps = {
	gathering: PublicGathering
}

//
// Constants
//

const PACIFIC = "America/Los_Angeles"

//
// Components
//

export function AnnouncementBar({ gathering }: AnnouncementBarProps) {
	const href = gathering.lumaUrl || gathering.href
	const copy = announcementCopy(gathering)

	return (
		<Bar href={href} aria-label={`${copy.statement} RSVP Now.`}>
			<Statement>{copy.statement}</Statement>
			<Brief aria-hidden="true">{copy.brief}</Brief>
			<Cta>RSVP Now</Cta>
		</Bar>
	)
}

const Cta = styled.span`
	flex: none;
	padding: 0.22rem 0.7rem;
	border: 1.5px solid #ffffff;
	border-radius: 999px;
	color: #ffffff;
	font-weight: 600;
	line-height: 1.2;
`

const Bar = styled(Link)`
	box-sizing: border-box;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 1rem;
	width: 100%;
	height: var(--announce-offset);
	padding: 0 1.25rem;
	position: relative;
	z-index: 100;
	background: var(--chrome-accent);
	color: #ffffff;
	font-size: 0.95rem;
	line-height: 1;
	text-decoration: none;

	&:hover ${Cta} {
		background: #ffffff;
		color: var(--chrome-accent);
	}

	&:focus-visible {
		outline: 2px solid #ffffff;
		outline-offset: -2px;
	}
`

const Statement = styled.span`
	min-width: 0;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;

	@media (max-width: 719px) {
		display: none;
	}
`

const Brief = styled.span`
	min-width: 0;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;

	@media (min-width: 720px) {
		display: none;
	}
`

//
// Functions
//

function announcementCopy(gathering: PublicGathering): { statement: string; brief: string } {
	const headline = monthlyHeadline(gathering.name)
	const when = formatPublicWhen(gathering)
	const place = gatheringPlace(gathering)
	return {
		statement: `${headline} is ${when.day} at ${place}.`,
		brief: `${headline} is ${shortDay(gathering)}.`
	}
}

function shortDay(gathering: PublicGathering): string {
	const date = gathering.hasTime ? new Date(gathering.start) : dateOnly(gathering.start)
	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		timeZone: PACIFIC
	}).format(date)
}

function dateOnly(start: string): Date {
	const [year, month, day] = start.split("-").map(Number)
	return new Date(Date.UTC(year, month - 1, day, 20))
}
