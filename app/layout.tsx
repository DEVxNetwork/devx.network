import { ReactNode } from "react"
import type { Metadata } from "next"
import "./globals.css"
import Header from "./components/Header"
import Footer from "./components/Footer"

export const metadata: Metadata = {
	title: "San Diego DEVx",
	description: "Fostering developer community through events and open-source projects.",
	openGraph: {
		type: "website",
		url: "https://devx.network",
		title: "San Diego DEVx",
		description: "Fostering developer community through events and open-source projects.",
		images: "/images/DEVxCover.png"
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
			</body>
		</html>
	)
}
