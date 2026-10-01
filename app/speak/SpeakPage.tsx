"use client"
import { styled } from "styled-components"
import { Button } from "@/app/components/Button"
import { TALK_MAILBOX } from "@/app/speak/proposal"
import { links } from "@/app/siteConfig"

//
// Constants
//

const embedSrc = tallyEmbedSrc(links.tallySpeakUrl)

//
// Components
//

export function SpeakPage() {
	return (
		<Main>
			<Title>Speak at an event</Title>
			<Lead>
				{embedSrc
					? "Talks come from the seats. Send a title and what you want the room to see."
					: "Talks come from the seats. The form is on its way."}
			</Lead>
			{embedSrc ? (
				<FormFrame src={embedSrc} title="Speak at a DEVx Saturday" loading="lazy" />
			) : (
				<MailRow>
					<Button href={`mailto:${TALK_MAILBOX}?subject=A talk for a Saturday`} variant="primary">
						Write us
					</Button>
				</MailRow>
			)}
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

const FormFrame = styled.iframe`
	display: block;
	width: min(40rem, 100%);
	height: 48rem;
	margin-top: 1.75rem;
	border: 1px solid var(--border);
	border-radius: 1.5rem;
	background: var(--surface-solid);
`

const MailRow = styled.div`
	margin-top: 1.75rem;
`

//
// Functions
//

function tallyEmbedSrc(url: string): string | null {
	const trimmed = url.trim()
	if (!trimmed) return null
	try {
		const parsed = new URL(trimmed)
		if (parsed.hostname !== "tally.so" && parsed.hostname !== "www.tally.so") return null
		const id = parsed.pathname.split("/").filter(Boolean).pop()
		if (!id || id === "embed" || id === "r") return null
		const params = new URLSearchParams({
			alignLeft: "1",
			hideTitle: "1",
			transparentBackground: "1",
			dynamicHeight: "1"
		})
		return `https://tally.so/embed/${id}?${params.toString()}`
	} catch {
		return null
	}
}
