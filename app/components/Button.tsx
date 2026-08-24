"use client"
import Link from "next/link"
import styled from "styled-components"

// Types //

interface ButtonProps {
	variant?: "primary" | "secondary" | "tertiary"
	size?: "small" | "default"
	href?: string
	children: React.ReactNode
	className?: string
	target?: string
	rel?: string
	type?: "button" | "submit" | "reset"
	disabled?: boolean
	onClick?: (e?: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void
}

// Components //

export const Button = ({
	variant = "primary",
	size = "small",
	href,
	children,
	className,
	target,
	rel,
	type,
	disabled,
	onClick
}: ButtonProps) => {
	const commonProps = {
		className,
		disabled,
		onClick,
		$variant: variant,
		$size: size
	}

	if (href) {
		const isExternal = href.startsWith("http://") || href.startsWith("https://")
		const isTelLink = href.startsWith("tel:")
		if (isExternal || isTelLink) {
			return (
				<StyledExternalLink
					href={href}
					target={isTelLink ? target : target || "_blank"}
					rel={isTelLink ? rel : rel || "noopener noreferrer"}
					{...commonProps}
				>
					{children}
				</StyledExternalLink>
			)
		}
		return (
			<StyledLink href={href} {...commonProps}>
				{children}
			</StyledLink>
		)
	}

	return (
		<StyledButton type={type || "button"} {...commonProps}>
			{children}
		</StyledButton>
	)
}

// Styled Components //

const StyledButton = styled.button<{
	$variant: "primary" | "secondary" | "tertiary"
	$size: "small" | "default"
}>`
	padding: ${(props) => (props.$size === "small" ? "0.5rem 1.1rem" : "0.85rem 1.75rem")};
	border-radius: 999px;
	font-weight: ${(props) => (props.$size === "small" ? "600" : "700")};
	font-size: ${(props) => (props.$size === "small" ? "0.9rem" : "1.05rem")};
	cursor: pointer;
	transition: all 0.2s ease;
	text-decoration: none;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	border: none;
	font-family: inherit;
	line-height: 1.5;
	white-space: nowrap;
	background-color: ${(props) =>
		props.$variant === "primary"
			? "var(--foreground)"
			: props.$variant === "tertiary"
				? "transparent"
				: "transparent"};
	color: ${(props) => (props.$variant === "primary" ? "var(--background)" : "var(--foreground)")};
	border: ${(props) =>
		props.$variant === "secondary" ? "1.5px solid var(--foreground)" : "1.5px solid transparent"};
	position: ${(props) => (props.$variant === "tertiary" ? "relative" : "static")};
	overflow: ${(props) => (props.$variant === "tertiary" ? "hidden" : "visible")};

	${(props) =>
		props.$variant === "tertiary" &&
		`
		&::before {
			content: "";
			position: absolute;
			top: 0;
			left: -100%;
			width: 100%;
			height: 100%;
			background: linear-gradient(
				90deg,
				transparent,
				rgba(var(--foreground-rgb), 0.1),
				transparent
			);
			transition: left 0.5s ease;
		}
	`}

	&:hover:not(:disabled) {
		background-color: ${(props) => {
			if (props.$variant === "primary") return "rgba(var(--foreground-rgb), 0.82)"
			if (props.$variant === "tertiary") return "rgba(var(--foreground-rgb), 0.05)"
			return "rgba(var(--foreground-rgb), 0.1)"
		}};
		border-radius: 999px;

		${(props) =>
			props.$variant === "tertiary" &&
			`
			&::before {
				left: 100%;
			}
		`}
	}

	&:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
`

const StyledLink = styled(Link)<{
	$variant: "primary" | "secondary" | "tertiary"
	$size: "small" | "default"
}>`
	padding: ${(props) => (props.$size === "small" ? "0.5rem 1.1rem" : "0.85rem 1.75rem")};
	border-radius: 999px;
	font-weight: ${(props) => (props.$size === "small" ? "600" : "700")};
	font-size: ${(props) => (props.$size === "small" ? "0.9rem" : "1.05rem")};
	cursor: pointer;
	transition: all 0.2s ease;
	text-decoration: none;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	border: none;
	font-family: inherit;
	line-height: 1.5;
	white-space: nowrap;
	background-color: ${(props) =>
		props.$variant === "primary"
			? "var(--foreground)"
			: props.$variant === "tertiary"
				? "transparent"
				: "transparent"};
	color: ${(props) => (props.$variant === "primary" ? "var(--background)" : "var(--foreground)")};
	border: ${(props) =>
		props.$variant === "secondary" ? "1.5px solid var(--foreground)" : "1.5px solid transparent"};
	position: ${(props) => (props.$variant === "tertiary" ? "relative" : "static")};
	overflow: ${(props) => (props.$variant === "tertiary" ? "hidden" : "visible")};

	${(props) =>
		props.$variant === "tertiary" &&
		`
		&::before {
			content: "";
			position: absolute;
			top: 0;
			left: -100%;
			width: 100%;
			height: 100%;
			background: linear-gradient(
				90deg,
				transparent,
				rgba(var(--foreground-rgb), 0.1),
				transparent
			);
			transition: left 0.5s ease;
		}
	`}

	&:hover {
		background-color: ${(props) => {
			if (props.$variant === "primary") return "rgba(var(--foreground-rgb), 0.82)"
			if (props.$variant === "tertiary") return "rgba(var(--foreground-rgb), 0.05)"
			return "rgba(var(--foreground-rgb), 0.1)"
		}};
		border-radius: 999px;

		${(props) =>
			props.$variant === "tertiary" &&
			`
			&::before {
				left: 100%;
			}
		`}
	}
`

const StyledExternalLink = styled.a<{
	$variant: "primary" | "secondary" | "tertiary"
	$size: "small" | "default"
}>`
	padding: ${(props) => (props.$size === "small" ? "0.5rem 1.1rem" : "0.85rem 1.75rem")};
	border-radius: 999px;
	font-weight: ${(props) => (props.$size === "small" ? "600" : "700")};
	font-size: ${(props) => (props.$size === "small" ? "0.9rem" : "1.05rem")};
	cursor: pointer;
	transition: all 0.2s ease;
	text-decoration: none;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	border: none;
	font-family: inherit;
	line-height: 1.5;
	white-space: nowrap;
	background-color: ${(props) =>
		props.$variant === "primary"
			? "var(--foreground)"
			: props.$variant === "tertiary"
				? "transparent"
				: "transparent"};
	color: ${(props) => (props.$variant === "primary" ? "var(--background)" : "var(--foreground)")};
	border: ${(props) =>
		props.$variant === "secondary" ? "1.5px solid var(--foreground)" : "1.5px solid transparent"};
	position: ${(props) => (props.$variant === "tertiary" ? "relative" : "static")};
	overflow: ${(props) => (props.$variant === "tertiary" ? "hidden" : "visible")};

	${(props) =>
		props.$variant === "tertiary" &&
		`
		&::before {
			content: "";
			position: absolute;
			top: 0;
			left: -100%;
			width: 100%;
			height: 100%;
			background: linear-gradient(
				90deg,
				transparent,
				rgba(var(--foreground-rgb), 0.1),
				transparent
			);
			transition: left 0.5s ease;
		}
	`}

	&:hover {
		background-color: ${(props) => {
			if (props.$variant === "primary") return "rgba(var(--foreground-rgb), 0.82)"
			if (props.$variant === "tertiary") return "rgba(var(--foreground-rgb), 0.05)"
			return "rgba(var(--foreground-rgb), 0.1)"
		}};
		border-radius: 999px;

		${(props) =>
			props.$variant === "tertiary" &&
			`
			&::before {
				left: 100%;
			}
		`}
	}
`
