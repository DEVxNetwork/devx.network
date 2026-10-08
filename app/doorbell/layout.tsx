"use client"

import { ReactNode } from "react"
import styled from "styled-components"
import Link from "next/link"

// Components //

export default function DoorbellLayout({
	children
}: Readonly<{
	children: ReactNode
}>) {
	return (
		<>
			{children}
			<MinimalFooter>
				<FooterLink href="/">Go to DEVx.network</FooterLink>
			</MinimalFooter>
		</>
	)
}

// Styled Components //

const MinimalFooter = styled.div.attrs({ className: "doorbell-footer" })`
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 1.5rem;
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 10;
`

const FooterLink = styled(Link)`
	color: rgba(var(--foreground-rgb), 0.6);
	font-size: 0.875rem;
	text-decoration: none;
	transition: color 0.2s ease;

	&:hover {
		color: rgba(var(--foreground-rgb), 0.9);
	}
`
