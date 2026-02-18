"use client"
import Link from "next/link"
import styled from "styled-components"

// Types //

interface CardProps {
	href?: string
	image?: string
	imageAlt?: string
	showPlayButton?: boolean
	imageAspectRatio?: "16/9" | "1/1" | "auto"
	children: React.ReactNode
	className?: string
	target?: string
	rel?: string
}

// Components //

export const Card = ({
	href,
	image,
	imageAlt,
	showPlayButton,
	imageAspectRatio = "auto",
	children,
	className,
	target,
	rel
}: CardProps) => {
	const isExternalLink = href && (href.startsWith("http://") || href.startsWith("https://"))

	const imageContent = image && (
		<ImageContainer $aspectRatio={imageAspectRatio}>
			<CardImage src={image} alt={imageAlt || ""} $aspectRatio={imageAspectRatio} />
			{showPlayButton && <PlayButton>▶</PlayButton>}
		</ImageContainer>
	)

	if (href) {
		if (isExternalLink) {
			return (
				<StyledExternalLink
					href={href}
					target={target || "_blank"}
					rel={rel || "noopener noreferrer"}
					className={className}
				>
					{imageContent}
					{children}
				</StyledExternalLink>
			)
		}
		return (
			<StyledLink href={href} className={className}>
				{imageContent}
				{children}
			</StyledLink>
		)
	}

	return (
		<StyledDiv className={className}>
			{imageContent}
			{children}
		</StyledDiv>
	)
}

// Sub-components for flexible content structure //

export const CardContent = styled.div<{ $padding?: string }>`
	padding: ${(props) => props.$padding || "1.5rem"};
	flex: 1;
`

export const CardTitle = styled.h3<{ $size?: string }>`
	font-size: ${(props) => props.$size || "1.25rem"};
	font-weight: bold;
	color: white;
	margin-bottom: 0.5rem;
`

export const CardText = styled.p<{ $color?: string; $size?: string; $weight?: string }>`
	font-size: ${(props) => props.$size || "0.875rem"};
	color: ${(props) => props.$color || "#9ca3af"};
	margin-bottom: 0.5rem;
	font-weight: ${(props) => props.$weight || "normal"};
`

// Styled Components //

const StyledLink = styled(Link)`
	display: flex;
	flex-direction: column;
	background-color: rgba(21, 21, 28, 0.75);
	backdrop-filter: blur(10px);
	border-radius: 0.5rem;
	overflow: hidden;
	transition: transform 0.2s ease;
	text-decoration: none;
	color: inherit;

	&:hover {
		transform: translateY(-4px);
		box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
	}
`

const StyledExternalLink = styled.a`
	display: flex;
	flex-direction: column;
	background-color: rgba(21, 21, 28, 0.75);
	backdrop-filter: blur(10px);
	border-radius: 0.5rem;
	overflow: hidden;
	transition: transform 0.2s ease;
	text-decoration: none;
	color: inherit;

	&:hover {
		transform: translateY(-4px);
		box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
	}
`

const StyledDiv = styled.div`
	display: flex;
	flex-direction: column;
	background-color: rgba(21, 21, 28, 0.75);
	backdrop-filter: blur(10px);
	border-radius: 0.5rem;
	overflow: hidden;
	transition: transform 0.2s ease;

	&:hover {
		transform: translateY(-4px);
		box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
	}
`

const ImageContainer = styled.div<{ $aspectRatio?: "16/9" | "1/1" | "auto" }>`
	width: 100%;
	position: relative;
	overflow: hidden;
	${(props) => props.$aspectRatio === "16/9" && "aspect-ratio: 16/9;"}
	${(props) => props.$aspectRatio === "1/1" && "aspect-ratio: 1/1;"}
	background-color: ${(props) =>
		props.$aspectRatio !== "auto" ? "rgba(0, 0, 0, 0.8)" : "transparent"};
	border-radius: ${(props) => (props.$aspectRatio !== "auto" ? "0.5rem" : "0")};
`

const CardImage = styled.img<{ $aspectRatio?: "16/9" | "1/1" | "auto" }>`
	width: 100%;
	height: ${(props) => (props.$aspectRatio !== "auto" ? "100%" : "200px")};
	object-fit: cover;
	transition: opacity 0.2s ease;

	${StyledLink}:hover &,
	${StyledDiv}:hover &,
	${StyledExternalLink}:hover & {
		opacity: 0.8;
	}
`

const PlayButton = styled.div`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	background-color: rgba(255, 255, 255, 0.5);
	color: black;
	border-radius: 50%;
	width: 60px;
	height: 60px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 1.5rem;
	font-weight: bold;
	transition: all 0.2s ease;
	pointer-events: none;

	${StyledLink}:hover &,
	${StyledDiv}:hover &,
	${StyledExternalLink}:hover & {
		background-color: rgba(255, 255, 255, 0.8);
		transform: translate(-50%, -50%) scale(1.1);
	}
`
