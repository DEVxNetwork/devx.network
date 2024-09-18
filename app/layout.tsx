import { ReactNode } from "react"
import type { Metadata } from "next"
import "./globals.css"
import Header from "./components/Header"
import Footer from "./components/Footer"
import { siteConfig } from "./siteConfig"
import GiveATalkCTA from "./components/GiveATalkCTA"

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

export default function RootLayout({
	children
}: Readonly<{
	children: ReactNode
}>) {
	return (
		<html lang="en">
			<body>
				<Header />
				{children}
				<Footer />
				<GiveATalkCTA />
			</body>
		</html>
	)
}
