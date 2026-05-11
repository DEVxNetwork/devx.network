import { ReactNode } from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Header } from "./components/Header"
import { Footer } from "./components/Footer"
import { siteConfig } from "./siteConfig"
import StyledComponentsRegistry from "./StyledComponentsRegistry"

console.log("well well well...")

// Constants //

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

// Components //

export default function RootLayout({
	children
}: Readonly<{
	children: ReactNode
}>) {
	return (
		<html lang="en">
			<head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
				<link
					href="https://fonts.googleapis.com/css2?family=Chivo:wght@300;400;700;900&display=swap"
					rel="stylesheet"
				/>
				<script async src="https://www.googletagmanager.com/gtag/js?id=G-L0X5333Q2X"></script>
				<script
					dangerouslySetInnerHTML={{
						__html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'G-L0X5333Q2X');
`
					}}
				/>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/images/favicon.png" />
			</head>
			<body>
				<StyledComponentsRegistry>
					<Header />
					{children}
					<Footer />
				</StyledComponentsRegistry>
			</body>
		</html>
	)
}
