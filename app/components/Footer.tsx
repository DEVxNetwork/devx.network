"use client"
import { styled } from "styled-components"
import { Link } from "./Link"
import { links } from "../siteConfig"
import { DevxWordmark } from "../logo-lab/DevxWordmark"

//
// Types
//

type FooterLink = {
	label: string
	href: string
	external?: boolean
}

//
// Constants
//

const siteLinks: FooterLink[] = [
	{ label: "Home", href: "/" },
	{ label: "Our Story", href: "/about" },
	{ label: "Events", href: "/events" },
	{ label: "Watch", href: "/watch" },
	{ label: "Slides", href: "/slides" },
	{ label: "Speak", href: "/speak" },
	{ label: "Brand", href: "/brand" },
	{ label: "Event terms", href: "/event-terms" }
]

const elsewhereLinks: FooterLink[] = [
	{ label: "Discord", href: links.discord, external: true },
	{ label: "Calendar", href: links.lumaUrl, external: true },
	{ label: "YouTube", href: links.youtube, external: true },
	{ label: "X", href: links.x, external: true },
	{ label: "LinkedIn", href: links.linkedInUrl, external: true },
	{ label: "GitHub", href: links.github, external: true },
	{ label: "TikTok", href: links.tiktok, external: true }
]

//
// Components
//

export const Footer = () => {
	const year = new Date().getFullYear()

	return (
		<FooterContainer>
			<FooterContent>
				<BrandBlock>
					<BrandHome href="/" aria-label="DEVx">
						<Wordmark />
					</BrandHome>
					<Tagline>San Diego, laptops open.</Tagline>
					<Copyright>© {year} DEVx</Copyright>
				</BrandBlock>
				<Columns>
					<Column aria-labelledby="footer-visit">
						<ColumnTitle id="footer-visit">Visit</ColumnTitle>
						<LinkList>
							{siteLinks.map((item) => (
								<li key={item.href}>
									<FooterAnchor href={item.href}>{item.label}</FooterAnchor>
								</li>
							))}
						</LinkList>
					</Column>
					<Column aria-labelledby="footer-find">
						<ColumnTitle id="footer-find">Find us</ColumnTitle>
						<LinkList>
							{elsewhereLinks.map((item) => (
								<li key={item.href}>
									<FooterAnchor
										href={item.href}
										target={item.external ? "_blank" : undefined}
										rel={item.external ? "noopener noreferrer" : undefined}
									>
										{item.label}
									</FooterAnchor>
								</li>
							))}
						</LinkList>
					</Column>
				</Columns>
			</FooterContent>
		</FooterContainer>
	)
}

const FooterContainer = styled.footer`
	width: 100%;
	margin-top: auto;
	background-color: var(--footer-background);
	border-top: 1px solid var(--border);
`

const FooterContent = styled.div`
	display: grid;
	grid-template-columns: 1fr;
	gap: 2rem;
	width: min(var(--column), calc(100% - 2.5rem));
	margin: 0 auto;
	padding: 2.5rem 0 2rem;

	@media (min-width: 768px) {
		grid-template-columns: minmax(16rem, 1fr) minmax(0, 1.35fr);
		align-items: start;
		column-gap: 3rem;
	}
`

const BrandBlock = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 1rem;
`

const BrandHome = styled(Link)`
	display: block;
	line-height: 0;
	text-decoration: none;

	&:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 4px;
	}
`

const Wordmark = styled(DevxWordmark)`
	display: block;
	height: 2.15rem;
	width: auto;
	overflow: visible;
`

const Tagline = styled.p`
	margin: 0;
	max-width: 16rem;
	color: var(--subtle-foreground);
	font-size: 0.95rem;
	line-height: 1.45;
`

const Copyright = styled.p`
	margin: 0;
	color: var(--subtle-foreground);
	font-size: 0.875rem;
	line-height: 1.4;
`

const Columns = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 1.5rem 2rem;
`

const Column = styled.nav`
	min-width: 0;
`

const ColumnTitle = styled.h2`
	margin: 0 0 1rem;
	color: var(--foreground);
	font-size: 1.15rem;
	line-height: 1.2;
	font-weight: 560;
`

const LinkList = styled.ul`
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	margin: 0;
	padding: 0;
	list-style: none;
`

const FooterAnchor = styled(Link)`
	color: var(--muted-foreground);
	font-size: 0.95rem;
	line-height: 1.35;
	text-decoration: none;

	&:hover {
		color: var(--foreground);
		text-decoration: underline;
		text-underline-offset: 0.18em;
	}

	&:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 3px;
	}
`
