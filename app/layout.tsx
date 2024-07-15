import { ReactNode } from "react"
import type { Metadata } from "next"
import { Header, Footer } from "@/app/lib/components"
import "./globals.css"

export const metadata: Metadata = {
	title: "San Diego DEVx",
	description: "All things Software Development"
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
