"use client"
import { useState } from "react"
import type { FormEvent } from "react"
import { styled } from "styled-components"
import { Button } from "@/app/components/Button"
import { TextInput } from "@/app/components/TextInput"
import { parseTalkProposal, talkMailHref, type TalkProposal } from "@/app/speak/proposal"

//
// Types
//

export type SpeakEvent = {
	id: string
	name: string
	when: string
}

type SpeakPageProps = {
	events: SpeakEvent[]
}

type FormState = "editing" | "sending" | "saved" | "mailed"

type Draft = {
	name: string
	email: string
	title: string
	about: string
	eventId: string
	company: string
}

//
// Constants
//

const emptyDraft: Draft = {
	name: "",
	email: "",
	title: "",
	about: "",
	eventId: "",
	company: ""
}

//
// Components
//

export function SpeakPage({ events }: SpeakPageProps) {
	const [draft, setDraft] = useState<Draft>(emptyDraft)
	const [state, setState] = useState<FormState>("editing")
	const [error, setError] = useState("")

	const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		if (state === "sending") return

		const proposal = toProposal(draft, events)
		const parsed = parseTalkProposal({ ...proposal, company: draft.company })
		if (parsed.kind === "invalid") {
			setError(parsed.error)
			return
		}
		if (parsed.kind === "ignore") {
			setState("saved")
			return
		}

		setError("")
		setState("sending")

		try {
			const response = await fetch("/api/speak", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ ...parsed.proposal, company: draft.company })
			})

			if (response.ok) {
				setState("saved")
				return
			}

			if (response.status === 400) {
				const body = (await response.json().catch(() => null)) as { error?: string } | null
				setError(body?.error || "Check the form and try again.")
				setState("editing")
				return
			}
		} catch {
			// The static site has no save route. Mail is the fallback below.
		}

		window.location.href = talkMailHref(parsed.proposal)
		setState("mailed")
	}

	if (state === "saved" || state === "mailed") {
		return (
			<Main>
				<Title>Got it.</Title>
				<Lead>
					{state === "saved"
						? "We'll write back about a Saturday."
						: "Your mail app has the note. Send it, and we'll write back about a Saturday."}
				</Lead>
				<SubmitRow>
					<Button href="/events" variant="secondary" size="default">
						See what's next
					</Button>
				</SubmitRow>
			</Main>
		)
	}

	return (
		<Main>
			<Title>Speak at an event</Title>
			<Lead>Talks come from the seats. Send a title and what you want the room to see.</Lead>
			<Panel onSubmit={onSubmit} noValidate>
				<HoneyPot
					tabIndex={-1}
					autoComplete="off"
					aria-hidden="true"
					value={draft.company}
					onChange={(event) => setDraft({ ...draft, company: event.target.value })}
				/>
				<Field>
					<FieldLabel htmlFor="speaker-name">Your name</FieldLabel>
					<TextInput
						id="speaker-name"
						name="name"
						size="default"
						autoComplete="name"
						value={draft.name}
						onChange={(event) => setDraft({ ...draft, name: event.target.value })}
					/>
				</Field>
				<Field>
					<FieldLabel htmlFor="speaker-email">Email</FieldLabel>
					<TextInput
						id="speaker-email"
						name="email"
						type="email"
						size="default"
						autoComplete="email"
						value={draft.email}
						onChange={(event) => setDraft({ ...draft, email: event.target.value })}
					/>
				</Field>
				<Field>
					<FieldLabel htmlFor="talk-title">Talk title</FieldLabel>
					<TextInput
						id="talk-title"
						name="title"
						size="default"
						value={draft.title}
						onChange={(event) => setDraft({ ...draft, title: event.target.value })}
					/>
				</Field>
				<Field>
					<FieldLabel htmlFor="talk-event">Event</FieldLabel>
					<EventSelect
						id="talk-event"
						name="event"
						value={draft.eventId}
						onChange={(event) => setDraft({ ...draft, eventId: event.target.value })}
					>
						<option value="">Any upcoming Saturday</option>
						{events.map((item) => (
							<option key={item.id} value={item.id}>
								{item.name} — {item.when}
							</option>
						))}
					</EventSelect>
				</Field>
				<Field>
					<FieldLabel htmlFor="talk-about">What you'll talk about</FieldLabel>
					<About
						id="talk-about"
						name="about"
						rows={6}
						value={draft.about}
						onChange={(event) => setDraft({ ...draft, about: event.target.value })}
					/>
				</Field>
				{error ? <Alert role="alert">{error}</Alert> : null}
				<SubmitRow>
					<Button type="submit" variant="primary" size="default" disabled={state === "sending"}>
						{state === "sending" ? "Sending" : "Send it"}
					</Button>
				</SubmitRow>
			</Panel>
		</Main>
	)
}

const Main = styled.main`
	width: min(var(--column), calc(100% - 2.5rem));
	margin: 0 auto;
	padding: 3.25rem 0 5rem;
`

const Title = styled.h1`
	margin: 0;
	max-width: 12ch;
	font-family: "Fraunces", "Iowan Old Style", Palatino, serif;
	font-weight: 560;
	font-size: clamp(2.4rem, 6vw, 4.2rem);
	letter-spacing: -0.03em;
	line-height: 0.98;
`

const Lead = styled.p`
	margin: 1rem 0 0;
	max-width: 36rem;
	color: var(--muted-foreground);
	font-size: 1.15rem;
	line-height: 1.45;
`

const Panel = styled.form`
	display: flex;
	flex-direction: column;
	gap: 1.15rem;
	width: min(36rem, 100%);
	margin-top: 2rem;
	background: var(--surface-solid);
	border: 1px solid var(--border);
	border-top: 3px solid var(--extrusion);
	border-radius: 1.5rem;
	padding: 1.35rem 1.25rem 1.5rem;
`

const Field = styled.div`
	display: flex;
	flex-direction: column;
`

const FieldLabel = styled.label`
	margin-bottom: 0.4rem;
	font-weight: 600;
`

const fieldChrome = `
	padding: 0.75rem 1.5rem;
	border-radius: 0.25rem;
	font-weight: 600;
	font-size: 1.1rem;
	font-family: inherit;
	line-height: 1.5;
	width: 100%;
	box-sizing: border-box;
	background-color: transparent;
	color: var(--foreground);
	border: 1px solid rgba(var(--foreground-rgb), 0.3);

	&:focus {
		outline: none;
		border-color: var(--foreground);
		background-color: rgba(var(--foreground-rgb), 0.05);
	}
`

const EventSelect = styled.select`
	${fieldChrome}
`

const About = styled.textarea`
	${fieldChrome}
	resize: vertical;
	min-height: 9rem;
`

const HoneyPot = styled.input`
	position: absolute;
	left: -10000px;
	width: 1px;
	height: 1px;
	overflow: hidden;
`

const Alert = styled.p`
	margin: 0;
	color: var(--error-color);
	font-weight: 600;
`

const SubmitRow = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 0.75rem;
	margin-top: 0.25rem;
`

//
// Functions
//

function toProposal(draft: Draft, events: SpeakEvent[]): TalkProposal {
	const event = events.find((item) => item.id === draft.eventId)
	return {
		name: draft.name,
		email: draft.email,
		title: draft.title,
		about: draft.about,
		eventId: draft.eventId,
		eventName: event ? `${event.name} — ${event.when}` : ""
	}
}
