"use client"
import { useState, useEffect } from "react"
import type { FocusEvent, MouseEvent } from "react"
import { Button } from "./Button"
import { Link } from "./Link"
import { styled } from "styled-components"
import { links } from "../siteConfig"
import { DevxWordmark } from "../logo-lab/DevxWordmark"
import { headerSitJump } from "../logo-lab/sitJump"

//
// Components
//

export const Header = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false)

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen)
	}

	const closeMenu = () => {
		setIsMenuOpen(false)
	}

	useEffect(() => {
		document.body.style.overflow = isMenuOpen ? "hidden" : "unset"
		return () => {
			document.body.style.overflow = "unset"
		}
	}, [isMenuOpen])

	useEffect(() => {
		const mediaQuery = window.matchMedia("(min-width: 768px)")
		const handleMediaChange = (event: MediaQueryListEvent | MediaQueryList) => {
			if (event.matches && isMenuOpen) setIsMenuOpen(false)
		}

		handleMediaChange(mediaQuery)
		mediaQuery.addEventListener("change", handleMediaChange)
		return () => mediaQuery.removeEventListener("change", handleMediaChange)
	}, [isMenuOpen])

	return (
		<>
			<Container>
				<Nav>
					<NavStart>
						<MenuButton onClick={toggleMenu} aria-label="Open menu">
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
						<Brand href="/" aria-label="DEVx" onMouseEnter={replaySit} onFocus={replaySit}>
							<BrandMark />
						</Brand>
					</NavStart>
					<NavCenter>
						<MenuList>
							<NavLinks onNavigate={closeMenu} />
						</MenuList>
					</NavCenter>
				</Nav>
			</Container>

			<SidebarOverlay $isOpen={isMenuOpen} onClick={closeMenu} />

			<LeftSidebar $isOpen={isMenuOpen}>
				<SidebarHeader>
					<CloseButton onClick={closeMenu} aria-label="Close menu">
						<CloseIcon
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</CloseIcon>
					</CloseButton>
				</SidebarHeader>
				<SidebarContent>
					<NavLinks onNavigate={closeMenu} />
				</SidebarContent>
			</LeftSidebar>
		</>
	)
}

const NavLinks = ({ onNavigate }: { onNavigate: () => void }) => {
	return (
		<>
			<MenuItem>
				<MenuLink href="/" onClick={onNavigate}>
					Home
				</MenuLink>
			</MenuItem>
			<MenuItem>
				<MenuLink href="/who-we-are" onClick={onNavigate}>
					Who we are
				</MenuLink>
			</MenuItem>
			<MenuItem>
				<MenuLink href="/events" onClick={onNavigate}>
					Events
				</MenuLink>
			</MenuItem>
			<MenuItem>
				<MenuLink href="/watch" onClick={onNavigate}>
					Watch
				</MenuLink>
			</MenuItem>
			<MenuItem>
				<MenuAnchor href={links.discord} target="_blank" rel="noopener noreferrer">
					Discord
				</MenuAnchor>
			</MenuItem>
			<MenuItem>
				<Button href="/speak" size="small" onClick={onNavigate}>
					Speak at an Event
				</Button>
			</MenuItem>
		</>
	)
}

//
// Styled Components
//

const Container = styled.header`
	width: 100%;
	position: sticky;
	top: 0;
	background-color: var(--header-background);
	backdrop-filter: blur(16px);
	border-bottom: 1px solid var(--border);
	z-index: 100;

	body.full & {
		position: fixed;
	}
`

const Nav = styled.nav`
	display: flex;
	justify-content: space-between;
	align-items: center;
	position: relative;
	width: min(var(--column), calc(100% - 2.5rem));
	margin: 0 auto;
	padding: 0.85rem 0;
`

const NavStart = styled.div`
	display: flex;
	align-items: center;
	gap: 0.75rem;
`

const Brand = styled(Link)`
	display: flex;
	align-items: center;
	line-height: 0;
	text-decoration: none;
	position: absolute;
	left: 50%;
	transform: translateX(-50%);

	@media (min-width: 768px) {
		position: static;
		left: auto;
		transform: none;
	}
`

const BrandMark = styled(DevxWordmark)`
	display: block;
	height: 1.85rem;
	width: auto;
	overflow: visible;

	.x-all {
		transform-box: fill-box;
		transform-origin: 50% 0%;
		animation: ${headerSitJump} 1.4s forwards;
	}

	@media (prefers-reduced-motion: reduce) {
		.x-all {
			animation: none;
		}
	}
`

const MenuButton = styled.button`
	display: flex;
	align-items: center;
	justify-content: center;
	background: none;
	border: none;
	cursor: pointer;
	padding: 0.5rem;
	margin-left: -0.5rem;
	color: var(--chrome-ink);

	&:hover {
		opacity: 0.8;
	}

	@media (min-width: 768px) {
		display: none;
	}
`

const NavCenter = styled.div`
	display: none;

	@media (min-width: 768px) {
		display: flex;
		justify-content: flex-end;
		flex: 1;
	}
`

const MenuIcon = styled.svg`
	width: 1.25rem;
	height: 1.25rem;
`

const SidebarOverlay = styled.div<{ $isOpen: boolean }>`
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	z-index: 200;
	display: ${(props) => (props.$isOpen ? "block" : "none")};
`

const LeftSidebar = styled.div<{ $isOpen: boolean }>`
	position: fixed;
	top: 0;
	left: 0;
	width: 280px;
	height: 100%;
	background-color: var(--sidebar-background);
	backdrop-filter: blur(38px);
	border-right: 1px solid var(--border);
	z-index: 201;
	transform: translateX(${(props) => (props.$isOpen ? "0" : "-100%")});
	transition: transform 0.3s ease-in-out;
	box-shadow: 2px 0 20px rgba(0, 0, 0, 0.3);

	@media (min-width: 768px) {
		display: none;
	}
`

const SidebarHeader = styled.div`
	display: flex;
	justify-content: flex-end;
	padding: 1rem;
`

const CloseButton = styled.button`
	display: flex;
	align-items: center;
	justify-content: center;
	background: none;
	border: none;
	cursor: pointer;
	padding: 0.5rem;
	color: var(--chrome-ink);

	&:hover {
		opacity: 0.8;
	}
`

const CloseIcon = styled.svg`
	width: 1.5rem;
	height: 1.5rem;
`

const SidebarContent = styled.ul`
	list-style: none;
	padding: 0 1rem;
	margin: 0;
`

const MenuList = styled.ul`
	display: flex;
	flex-direction: column;
	list-style: none;
	padding: 0;
	margin: 0;

	@media (min-width: 768px) {
		flex-direction: row;
		align-items: center;
		gap: 1.5rem;
	}
`

const MenuItem = styled.li`
	margin: 0.75rem 0;

	@media (min-width: 768px) {
		margin: 0;
	}
`

const linkStyles = `
	display: block;
	padding: 0.75rem 1rem;
	color: var(--chrome-ink);
	text-decoration: none;
	font-size: 1.1rem;
	font-weight: 500;
	border-radius: 0.375rem;
	transition: color 0.2s ease;

	&:hover {
		color: var(--chrome-accent);
	}

	@media (min-width: 768px) {
		padding: 0.5rem 0;
		font-size: 1rem;
	}
`

const MenuLink = styled(Link)`
	${linkStyles}
`

const MenuAnchor = styled.a`
	${linkStyles}
`

//
// Functions
//

const replaySit = (event: MouseEvent<HTMLAnchorElement> | FocusEvent<HTMLAnchorElement>) => {
	if (event.type === "focus" && !event.currentTarget.matches(":focus-visible")) return
	if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

	const x = event.currentTarget.querySelector(".x-all")
	if (!(x instanceof SVGElement)) return
	x.style.animation = "none"
	void x.getBoundingClientRect()
	x.style.animation = ""
}
