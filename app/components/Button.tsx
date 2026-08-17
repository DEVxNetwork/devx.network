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

// Shared visual rules for all three DOM variants (button/Link/anchor) —
// kept as one template so the three renderers below can't drift apart.
const sharedButtonCss = (props: {
	$variant: "primary" | "secondary" | "tertiary"
	$size: "small" | "default"
}) => `
	padding: ${props.$size === "small" ? "0.5rem 1.1rem" : "0.85rem 1.75rem"};
	border-radius: 999px;
	font-weight: ${props.$size === "small" ? "600" : "700"};
	font-size: ${props.$size === "small" ? "0.9rem" : "1.05rem"};
	cursor: pointer;
	transition: all 0.2s ease;
	text-decoration: none;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	font-family: inherit;
	line-height: 1.5;
	white-space: nowrap;
	background-color: ${
		props.$variant === "primary"
			? "var(--color-accent)"
			: props.$variant === "secondary"
				? "transparent"
				: "transparent"
	};
	color: ${
		props.$variant === "primary"
			? "var(--color-accent-ink)"
			: props.$variant === "secondary"
				? "var(--color-ink)"
				: "var(--color-ink-muted)"
	};
	border: ${props.$variant === "secondary" ? "1.5px solid var(--color-ink)" : "1.5px solid transparent"};
`

const sharedButtonHoverCss = (props: { $variant: "primary" | "secondary" | "tertiary" }) => `
	&:hover:not(:disabled) {
		background-color: ${
			props.$variant === "primary"
				? "var(--color-accent-hover)"
				: props.$variant === "secondary"
					? "var(--color-ink)"
					: "transparent"
		};
		color: ${props.$variant === "secondary" ? "var(--color-bg)" : props.$variant === "tertiary" ? "var(--color-ink)" : "var(--color-accent-ink)"};
	}

	&:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
`

const StyledButton = styled.button<{
	$variant: "primary" | "secondary" | "tertiary"
	$size: "small" | "default"
}>`
	${sharedButtonCss}
	${sharedButtonHoverCss}
`

const StyledLink = styled(Link)<{
	$variant: "primary" | "secondary" | "tertiary"
	$size: "small" | "default"
}>`
	${sharedButtonCss}
	${sharedButtonHoverCss}
`

const StyledExternalLink = styled.a<{
	$variant: "primary" | "secondary" | "tertiary"
	$size: "small" | "default"
}>`
	${sharedButtonCss}
	${sharedButtonHoverCss}
`
