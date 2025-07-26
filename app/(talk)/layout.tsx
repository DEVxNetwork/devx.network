import { ReactNode } from "react"
import type { Metadata } from "next"
import "../globals.css"
import { Header } from "../components/Header"
import { siteConfig } from "../siteConfig"
import StyledComponentsRegistry from "../StyledComponentsRegistry"

export const metadata: Metadata = {
	title: siteConfig.title,
	description: siteConfig.description,
	openGraph: {
		type: "website",
		url: siteConfig.url,
		title: siteConfig.title,
		description: siteConfig.description,
		images: siteConfig.ogImage
	}
}

export default function TalkRootLayout({
	children
}: Readonly<{
	children: ReactNode
}>) {
	return (
		<html lang="en">
			<head>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/images/favicon.png" />
			</head>
			<body>
				<StyledComponentsRegistry>
					<Header opacity={0} />
					<Header />
					{children}
				</StyledComponentsRegistry>
			</body>
		</html>
	)
}
