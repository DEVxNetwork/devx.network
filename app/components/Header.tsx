"use client"

import { links } from "../siteConfig"
import styled, { css } from "styled-components"

const LogoImage = styled.img`
	border-radius: 0.25rem;
	width: 3rem;
`

const Anchor = styled.a<{
	ghost?: boolean
}>`
	display: inline-flex;
	justify-content: center;
	align-items: center;

	font-size: 0.875rem;
	text-align: center;
	border-radius: 0.5rem;
	transition: background 200ms ease-in-out;

	color: #a7adba;

	height: 3rem;
	padding: 0 1rem;
	font-weight: 600;
	line-height: 1em;

	${(props) => {
		const backgroundColor = props.ghost ? "transparent" : "#1a1e23"

		return css`
			background: ${backgroundColor};
			border: 1px solid ${backgroundColor};
		`
	}}

	&:hover {
		${(props) => {
			if (props.ghost)
				return css`
					background: color-mix(in srgb, white 5%, transparent 100%);
					border: 1px solid transparent;
				`
			else
				return css`
					background: #15181d;
					border: 1px solid #15181d;
				`
		}}
	}
`

const Button = styled.a<{
	ghost?: boolean
}>`
	display: inline-flex;
	justify-content: center;
	align-items: center;

	font-size: 0.875rem;
	text-align: center;
	border-radius: 0.5rem;
	transition: background 200ms ease-in-out;

	color: #a7adba;

	height: 3rem;
	padding: 0 1rem;
	font-weight: 600;
	line-height: 1em;

	${(props) => {
		const backgroundColor = props.ghost ? "transparent" : "#1a1e23"

		return css`
			background: ${backgroundColor};
			border: 1px solid ${backgroundColor};
		`
	}}

	&:hover {
		${(props) => {
			if (props.ghost)
				return css`
					background: color-mix(in srgb, white 5%, transparent 100%);
					border: 1px solid transparent;
				`
			else
				return css`
					background: #15181d;
					border: 1px solid #15181d;
				`
		}}
	}
`

const ImageAnchor = styled(Anchor)`
	padding: 0;
`

const NavLink = styled.a`
	display: inline-flex;
	justify-content: center;
	align-items: center;

	font-size: 0.875rem;
	text-align: center;
	border-radius: 0.5rem;
	transition: background 200ms ease-in-out;

	color: #a7adba;

	padding: 0.5rem 1rem;
	line-height: 1.4em;

	background: transparent;
	border: 1px solid transparent;

	&:hover {
		background: color-mix(in srgb, white 5%, transparent 100%);
		border: 1px solid transparent;
	}
`

const DropdownButton = styled(Button)`
	@media (min-width: 1024px) {
		display: none;
	}
`

const Header = () => {
	return (
		<header>
			<nav className="navbar bg-base-100">
				<div className="navbar-start">
					<div className="dropdown">
						<DropdownButton tabIndex={0} ghost>
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
						</DropdownButton>
						<ul
							tabIndex={0}
							className="menu menu-lg dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
						>
							<NavLinks />
						</ul>
					</div>
					<ImageAnchor ghost href="/">
						<LogoImage src="/images/logo.jpeg" />
					</ImageAnchor>
				</div>
				<div className="hidden navbar-center lg:flex">
					<ul className="px-1 menu menu-horizontal">
						<NavLinks />
					</ul>
				</div>
				<div className="navbar-end">
					<Anchor href={links.discord}>Join Us on Discord</Anchor>
				</div>
			</nav>
		</header>
	)
}

const NavLinks = () => {
	return (
		<>
			<li>
				<NavLink href="/">Home</NavLink>
			</li>
			<li>
				<NavLink href="/about">About</NavLink>
			</li>
			<li>
				<NavLink target="_blank" href={links.lumaUrl}>
					Event Calendar
				</NavLink>
			</li>
			<li>
				<NavLink target="_blank" href={links.talkSubmissionUrl}>
					Give a Talk!
				</NavLink>
			</li>
		</>
	)
}

export default Header
