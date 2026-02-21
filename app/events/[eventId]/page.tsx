import type { Metadata } from "next"
import EventDetailClient from "./EventDetailClient"
import { lumaService } from "@/app/services/luma"
import { siteConfig } from "@/app/siteConfig"
import { formatOgDate, sanitizeDescription } from "./og-utils"

// Static Generation //

export async function generateStaticParams() {
	const events = await lumaService.listEvents()
	return events.map((event) => ({
		eventId: event.api_id
	}))
}

export async function generateMetadata({
	params
}: {
	params: { eventId: string }
}): Promise<Metadata> {
	const event = await lumaService.getEvent(params.eventId)

	if (!event) {
		return { title: "Event Not Found" }
	}

	const date = formatOgDate(event.start_at)
	const title = `${event.name} — ${date} | DEVxClaw`
	const description = sanitizeDescription(event.description) || siteConfig.description

	return {
		title,
		description,
		openGraph: {
			type: "article",
			title,
			description,
			url: `${siteConfig.url}/events/${event.api_id}`,
			images: [{ url: siteConfig.ogImage, width: 1200, height: 630 }]
		}
	}
}

// Components //

export default function EventDetail() {
	return <EventDetailClient />
}
