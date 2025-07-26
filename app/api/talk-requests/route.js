import { NextResponse } from "next/server"

export async function POST(req) {
	try {
		const formData = await req.formData()
		const name = formData.get("name")
		const email = formData.get("email")
		const phone = formData.get("phone") || ""
		const title = formData.get("title")
		const description = formData.get("description")
		const timeSlot = parseInt(formData.get("timeSlot"))

		const discordWebhookUrl =
			process.env.DISCORD_WEBHOOK_URL ||
			"https://discord.com/api/webhooks/1398562330798981120/xAfw8ZqO4qMV7BKYjWV1KXtct9jDVHTir7L9nRbfsUKMSwhZePLAzl771U6ZIrTCp-b0"
		if (discordWebhookUrl) {
			const embed = {
				title: "🎤 New Talk Proposal Submitted",
				color: 0x5865f2,
				fields: [
					{
						name: "Speaker",
						value: name,
						inline: true
					},
					{
						name: "Email",
						value: email,
						inline: true
					},
					{
						name: "Phone",
						value: phone || "Not provided",
						inline: true
					},
					{
						name: "Presentation Title",
						value: title,
						inline: false
					},
					{
						name: "Time Slot",
						value: `${timeSlot} minutes`,
						inline: true
					},
					{
						name: "Description",
						value: description.length > 1000 ? description.substring(0, 1000) + "..." : description,
						inline: false
					}
				],
				timestamp: new Date().toISOString()
			}

			await fetch(discordWebhookUrl, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					embeds: [embed]
				})
			})
		}

		return NextResponse.redirect(new URL("/talk/submitted", req.url))
	} catch (error) {
		console.error("Error processing talk submission:", error)
		return NextResponse.json({ error: "Failed to submit talk proposal" }, { status: 500 })
	}
}
