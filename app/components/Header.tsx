"use client"

import { links } from "../siteConfig"
import styled from "styled-components"

const LogoImage = styled.img`
	border-radius: 0.25rem;
	width: 3rem;
`

const Header = () => {
	return (
		<header>
			<nav className="navbar bg-base-100">
				<div className="navbar-start">
					<div className="dropdown">
						<div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="w-5 h-5"
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
							</svg>
						</div>
						<ul
							tabIndex={0}
							className="menu menu-lg dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
						>
							<NavLinks />
						</ul>
					</div>
					<a className="inline p-0 btn btn-ghost" href="/">
						<LogoImage src="/images/logo.jpeg" />
					</a>
				</div>
				<div className="hidden navbar-center lg:flex">
					<ul className="px-1 menu menu-horizontal">
						<NavLinks />
					</ul>
				</div>
				<div className="navbar-end">
					<a className="btn" href={links.discord}>
						Join Us on Discord
					</a>
				</div>
			</nav>
		</header>
	)
}

const NavLinks = () => {
	return (
		<>
			<li>
				<a href="/">Home</a>
			</li>
			<li>
				<a href="/about">About</a>
			</li>
			<li>
				<a target="_blank" href={links.lumaUrl}>
					Event Calendar
				</a>
			</li>
			{/* Hide Events until the page design is ready and finalized */}
			{/* <li>
				<a href="/events">Events</a>
			</li> */}
			<li>
				<a target="_blank" href={links.talkSubmissionUrl}>
					Give a Talk!
				</a>
			</li>
		</>
	)
}

export default Header
