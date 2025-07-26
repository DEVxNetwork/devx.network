"use client"
import { links } from "../siteConfig"
import styled from "styled-components"
import { useState } from "react"

export const Header = (props: any) => {
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const opacity = props.opacity ?? 1

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen)
	}

	return (
		<Container $opacity={opacity}>
			<Nav>
				<NavStart>
					<MenuButton onClick={toggleMenu}>
						<MenuIcon
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M4 6h16M4 12h8m-8 6h16"
							/>
						</MenuIcon>
					</MenuButton>
					<DropdownMenu $isOpen={isMenuOpen}>
						<NavLinks />
					</DropdownMenu>
				</NavStart>
				<NavCenter>
					<MenuList>
						<NavLinks />
					</MenuList>
				</NavCenter>
				<NavEnd>
					<DiscordButton href={links.discord}>Join Us on Discord</DiscordButton>
				</NavEnd>
			</Nav>
		</Container>
	)
}

const Container = styled.header<{ $opacity: number }>`
	width: 100%;
	opacity: ${(props) => props.$opacity};
	position: ${(props) => (props.$opacity === 1 ? "fixed" : "static")};
	pointer-events: ${(props) => (props.$opacity === 1 ? "auto" : "none")};
	background-color: rgba(0, 0, 0, 0.05);
	backdrop-filter: blur(38px);
	border-bottom: 1px solid rgba(0, 0, 0, 0.1);
	z-index: 100;
`

const Nav = styled.nav`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 1rem;
	max-width: 1200px;
	margin: 0 auto;
`

const NavStart = styled.div`
	@media (min-width: 1024px) {
		display: none;
	}
`

const NavCenter = styled.div`
	display: none;
	@media (min-width: 1024px) {
		display: flex;
		justify-content: center;
	}
`

const NavEnd = styled.div`
	display: flex;
	justify-content: flex-end;
`

const MenuButton = styled.button`
	display: flex;
	align-items: center;
	justify-content: center;
	background: none;
	border: none;
	cursor: pointer;
	padding: 0.5rem;
	color: white;

	&:hover {
		opacity: 0.8;
	}
`

const MenuIcon = styled.svg`
	width: 1.25rem;
	height: 1.25rem;
`

const DropdownMenu = styled.ul<{ $isOpen: boolean }>`
	position: absolute;
	top: 100%;
	left: 0;
	background-color: #333;
	border-radius: 0.5rem;
	padding: 0.5rem;
	width: 13rem;
	box-shadow:
		0 4px 6px -1px rgba(0, 0, 0, 0.1),
		0 2px 4px -1px rgba(0, 0, 0, 0.06);
	z-index: 10;
	display: ${(props) => (props.$isOpen ? "block" : "none")};
`

const MenuList = styled.ul`
	display: flex;
	list-style: none;
	padding: 0;
	margin: 0;

	@media (min-width: 1024px) {
		flex-direction: row;
		gap: 1.5rem;
	}
`

const MenuItem = styled.li`
	margin: 0.5rem 0;

	@media (min-width: 1024px) {
		margin: 0;
	}
`

const MenuLink = styled.a`
	display: block;
	padding: 0.5rem;
	color: white;
	text-decoration: none;

	&:hover {
		text-decoration: underline;
	}

	@media (min-width: 1024px) {
		padding: 0.5rem 0;
	}
`

const DiscordButton = styled.a`
	display: inline-block;
	padding: 0.5rem 1rem;
	background-color: white;
	color: black;
	text-decoration: none;
	border-radius: 0.25rem;
	font-weight: 500;

	&:hover {
		background-color: #ddd;
	}
`

const NavLinks = () => {
	return (
		<>
			<MenuItem>
				<MenuLink href="/">Home</MenuLink>
			</MenuItem>
			<MenuItem>
				<MenuLink target="_blank" href={links.lumaUrl}>
					Event Calendar
				</MenuLink>
			</MenuItem>
			{/* Hide Events until the page design is ready and finalized */}
			{/* <MenuItem>
				<MenuLink href="/events">Events</MenuLink>
			</MenuItem> */}
			<MenuItem>
				<MenuLink target="_blank" href={links.talkSubmissionUrl}>
					Give a Talk!
				</MenuLink>
			</MenuItem>
		</>
	)
}
