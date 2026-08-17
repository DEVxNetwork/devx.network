"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import styled from "styled-components"
import { links } from "../siteConfig"
import { GiveATalkCTA } from "./GiveATalkCTA"
import { Button } from "./Button"
import { supabaseClient } from "../../lib/supabaseClient"
import { getProfileFromCache } from "../../lib/profileCache"
import { checkIsAdmin } from "../../lib/adminCheck"

// Components //

export const Header = () => {
	const router = useRouter()
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)
	const [user, setUser] = useState<any>(null)
	const [userHandle, setUserHandle] = useState<string | null>(null)
	const [profilePhoto, setProfilePhoto] = useState<string | null>(null)
	const [userLoading, setUserLoading] = useState(true)
	const [isAdmin, setIsAdmin] = useState(false)

	useEffect(() => {
		// Check initial session and load handle and photo from cache
		const loadUserAndHandle = async () => {
			const {
				data: { user }
			} = await supabaseClient.auth.getUser()
			setUser(user)

			if (user) {
				const { handle, profilePhoto } = getProfileFromCache(user)
				setUserHandle(handle)
				setProfilePhoto(profilePhoto)
				checkIsAdmin().then(setIsAdmin)
			}

			setUserLoading(false)
		}

		loadUserAndHandle()

		// Listen for auth changes
		const {
			data: { subscription }
		} = supabaseClient.auth.onAuthStateChange(async (_event, session) => {
			setUser(session?.user ?? null)

			if (session?.user) {
				const { handle, profilePhoto } = getProfileFromCache(session.user)
				setUserHandle(handle)
				setProfilePhoto(profilePhoto)
			} else {
				setUserHandle(null)
				setProfilePhoto(null)
				setIsAdmin(false)
			}

			setUserLoading(false)
		})

		return () => {
			subscription.unsubscribe()
		}
	}, [])

	const handleSignOut = async () => {
		await supabaseClient.auth.signOut()
		setIsAccountMenuOpen(false)
		router.push("/")
	}

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen)
	}

	const closeMenu = () => {
		setIsMenuOpen(false)
	}

	const toggleAccountMenu = () => {
		setIsAccountMenuOpen(!isAccountMenuOpen)
	}

	const closeAccountMenu = () => {
		setIsAccountMenuOpen(false)
	}

	// Prevent body scroll when sidebar is open
	useEffect(() => {
		if (isMenuOpen || isAccountMenuOpen) {
			document.body.style.overflow = "hidden"
		} else {
			document.body.style.overflow = "unset"
		}

		return () => {
			document.body.style.overflow = "unset"
		}
	}, [isMenuOpen, isAccountMenuOpen])

	// Close left sidebar when resizing to desktop
	useEffect(() => {
		// Use matchMedia to detect the same breakpoint as CSS
		const mediaQuery = window.matchMedia("(min-width: 768px)")

		const handleMediaChange = (e: MediaQueryListEvent | MediaQueryList) => {
			// If we're at desktop size and left menu is open, close it
			// Right sidebar (account menu) should work on desktop
			if (e.matches && isMenuOpen) {
				setIsMenuOpen(false)
			}
		}

		// Check on mount
		handleMediaChange(mediaQuery)

		// Listen for changes
		mediaQuery.addEventListener("change", handleMediaChange)

		return () => {
			mediaQuery.removeEventListener("change", handleMediaChange)
		}
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
						<Logo href="/">
							DEV<LogoAccent>x</LogoAccent>
						</Logo>
					</NavStart>
					<NavCenter>
						<MenuList>
							<NavLinks />
						</MenuList>
					</NavCenter>
					<NavEnd>
						<ButtonGroup>
							<GiveATalkCTA />
							{!userLoading && (
								<>
									{user ? (
										<ProfileButton onClick={toggleAccountMenu}>
											{profilePhoto ? (
												<ProfileImage src={profilePhoto} alt="Profile" />
											) : (
												<ProfilePlaceholder>
													{userHandle ? userHandle.charAt(0).toUpperCase() : "?"}
												</ProfilePlaceholder>
											)}
										</ProfileButton>
									) : (
										<Button href="/login" variant="tertiary">
											Sign In
										</Button>
									)}
								</>
							)}
						</ButtonGroup>
					</NavEnd>
				</Nav>
			</Container>

			{/* Overlay for both sidebars */}
			<SidebarOverlay
				$isOpen={isMenuOpen || isAccountMenuOpen}
				onClick={() => {
					closeMenu()
					closeAccountMenu()
				}}
			/>

			{/* Left Sidebar (Navigation) */}
			<LeftSidebar $isOpen={isMenuOpen}>
				<SidebarHeader>
					<CloseButton onClick={closeMenu}>
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
					<NavLinks />
				</SidebarContent>
			</LeftSidebar>

			{/* Right Sidebar (Account Menu) */}
			<RightSidebar $isOpen={isAccountMenuOpen}>
				<RightSidebarHeader>
					<ProfileHeaderSection>
						{user && userHandle && profilePhoto && (
							<SidebarProfileImage src={profilePhoto} alt="Profile" />
						)}
						{userHandle && <ProfileHandle>@{userHandle}</ProfileHandle>}
					</ProfileHeaderSection>
					<CloseButton onClick={closeAccountMenu}>
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
				</RightSidebarHeader>
				<AccountMenuContent>
					{userHandle && (
						<>
							<AccountMenuItem>
								<AccountMenuLink href={`/whois?${userHandle}`} onClick={closeAccountMenu}>
									Nametag
								</AccountMenuLink>
							</AccountMenuItem>
							<AccountMenuItem>
								<AccountMenuLink href="/whois" onClick={closeAccountMenu}>
									All Members
								</AccountMenuLink>
							</AccountMenuItem>
						</>
					)}
					{!userHandle && (
						<AccountMenuItem>
							<AccountMenuLink href="/setup" onClick={closeAccountMenu}>
								Get Nametag
							</AccountMenuLink>
						</AccountMenuItem>
					)}
					{isAdmin && (
						<>
							<AccountMenuDivider />
							<AccountMenuItem>
								<AccountMenuLink href="/admin/talks" onClick={closeAccountMenu}>
									Admin: Talks
								</AccountMenuLink>
							</AccountMenuItem>
						</>
					)}
					<AccountMenuDivider />
					{user && (
						<AccountMenuItem>
							<AccountMenuButton onClick={handleSignOut}>Sign Out</AccountMenuButton>
						</AccountMenuItem>
					)}
				</AccountMenuContent>
			</RightSidebar>
		</>
	)
}

const NavLinks = () => {
	return (
		<>
			<MenuItem>
				<MenuLink href="/">Home</MenuLink>
			</MenuItem>
			<MenuItem>
				<MenuLink href="/events">Events</MenuLink>
			</MenuItem>
			<MenuItem>
				<MenuLink href="/watch">Watch</MenuLink>
			</MenuItem>
			<MenuItem>
				<Button href={links.discord} variant="tertiary" target="_blank" rel="noopener noreferrer">
					Join Our Discord
				</Button>
			</MenuItem>
		</>
	)
}

const Container = styled.header`
	width: 100%;
	position: sticky;
	top: 0;
	background-color: rgba(246, 243, 236, 0.85);
	backdrop-filter: blur(16px);
	border-bottom: 1px solid var(--color-border);
	z-index: 100;

	body.full & {
		position: fixed;
	}
`

const Nav = styled.nav`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 1rem 1.5rem;
	max-width: 1200px;
	margin: 0 auto;
`

const NavStart = styled.div`
	position: relative;
	display: flex;
	align-items: center;
	gap: 0.75rem;
`

const Logo = styled(Link)`
	font-size: 1.35rem;
	font-weight: 900;
	letter-spacing: -0.02em;
	color: var(--color-ink);
	text-decoration: none;
`

const LogoAccent = styled.span`
	color: var(--color-accent);
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
	color: var(--color-ink);

	&:hover {
		opacity: 0.7;
	}

	@media (min-width: 768px) {
		display: none;
	}
`

const NavCenter = styled.div`
	display: none;
	@media (min-width: 768px) {
		display: flex;
		justify-content: center;
	}
`

const NavEnd = styled.div`
	display: flex;
	justify-content: flex-end;
	align-items: center;
`

const ButtonGroup = styled.div`
	display: flex;
	align-items: center;
	gap: 1rem;
`

const MenuIcon = styled.svg`
	width: 1.25rem;
	height: 1.25rem;
`

const ProfileButton = styled.button`
	display: flex;
	align-items: center;
	justify-content: center;
	background: none;
	border: none;
	cursor: pointer;
	padding: 0;
	border-radius: 50%;
	overflow: hidden;
	width: 2.5rem;
	height: 2.5rem;
	transition: transform 0.2s ease;

	&:hover {
		transform: scale(1.05);
	}
`

const ProfileImage = styled.img`
	width: 100%;
	height: 100%;
	object-fit: cover;
	border-radius: 50%;
	border: 2px solid var(--color-border);
`

const ProfilePlaceholder = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: var(--color-accent);
	border-radius: 50%;
	border: 2px solid var(--color-border);
	color: var(--color-accent-ink);
	font-size: 1rem;
	font-weight: 600;
`

const AccountMenuContent = styled.ul`
	list-style: none;
	padding: 0 1rem;
	margin: 0;
`

const AccountMenuItem = styled.li`
	margin: 0.75rem 0;
`

const AccountMenuLink = styled.a`
	display: block;
	padding: 0.75rem 1rem;
	color: var(--color-ink);
	text-decoration: none;
	font-size: 1.1rem;
	border-radius: 0.375rem;
	transition: background-color 0.2s ease;

	&:hover {
		background-color: var(--color-border);
	}
`

const AccountMenuButton = styled.button`
	display: block;
	padding: 0.75rem 1rem;
	color: var(--color-ink);
	text-decoration: none;
	font-size: 1.1rem;
	border-radius: 0.375rem;
	transition: background-color 0.2s ease;
	border: none;
	width: 100%;
	text-align: left;
	background: none;
	cursor: pointer;

	&:hover {
		background-color: var(--color-border);
	}
`

const AccountMenuDivider = styled.hr`
	border: none;
	border-top: 1px solid var(--color-border);
	margin: 0.5rem 0;
`

const SidebarOverlay = styled.div<{ $isOpen: boolean }>`
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(23, 20, 15, 0.4);
	z-index: 200;
	display: ${(props) => (props.$isOpen ? "block" : "none")};
`

const LeftSidebar = styled.div<{ $isOpen: boolean }>`
	position: fixed;
	top: 0;
	left: 0;
	width: 280px;
	height: 100%;
	background-color: var(--color-bg-raised);
	border-right: 1px solid var(--color-border);
	z-index: 201;
	transform: translateX(${(props) => (props.$isOpen ? "0" : "-100%")});
	transition: transform 0.3s ease-in-out;
	box-shadow: 2px 0 20px rgba(23, 20, 15, 0.1);

	@media (min-width: 768px) {
		display: none;
	}
`

const RightSidebar = styled.div<{ $isOpen: boolean }>`
	position: fixed;
	top: 0;
	right: 0;
	width: 280px;
	height: 100%;
	background-color: var(--color-bg-raised);
	border-left: 1px solid var(--color-border);
	z-index: 201;
	transform: translateX(${(props) => (props.$isOpen ? "0" : "100%")});
	transition: transform 0.3s ease-in-out;
	box-shadow: -2px 0 20px rgba(23, 20, 15, 0.1);
`

const SidebarHeader = styled.div`
	display: flex;
	justify-content: flex-end;
	padding: 1rem;
`

const RightSidebarHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 1rem;
`

const ProfileHeaderSection = styled.div`
	display: flex;
	align-items: center;
	gap: 0.75rem;
`

const SidebarProfileImage = styled.img`
	width: 2.5rem;
	height: 2.5rem;
	object-fit: cover;
	border-radius: 50%;
	border: 2px solid var(--color-border);
	display: block;
	flex-shrink: 0;
`

const ProfileHandle = styled.span`
	color: var(--color-ink);
	font-size: 1rem;
	font-weight: 500;
`

const CloseButton = styled.button`
	display: flex;
	align-items: center;
	justify-content: center;
	background: none;
	border: none;
	cursor: pointer;
	padding: 0.5rem;
	color: var(--color-ink);

	&:hover {
		opacity: 0.7;
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
	list-style: none;
	padding: 0;
	margin: 0;

	@media (min-width: 768px) {
		flex-direction: row;
		gap: 1.5rem;
	}
`

const MenuItem = styled.li`
	margin: 0.75rem 0;

	@media (min-width: 768px) {
		margin: 0;
		position: relative;
	}
`

const MenuLink = styled.a`
	display: block;
	padding: 0.75rem 1rem;
	color: var(--color-ink);
	text-decoration: none;
	font-size: 1.1rem;
	font-weight: 500;
	border-radius: 0.375rem;
	transition: background-color 0.2s ease;

	&:hover {
		background-color: var(--color-border);
	}

	@media (min-width: 768px) {
		padding: 0.5rem 0;
		font-size: 1rem;

		&:hover {
			color: var(--color-accent);
			background-color: transparent;
			text-decoration: underline;
		}
	}
`
