"use client"
import styled from "styled-components"
import { forwardRef } from "react"

// Types //

type BaseTextareaProps = Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size">

interface TextareaInputProps extends BaseTextareaProps {
	variant?: "primary" | "secondary"
	size?: "small" | "default"
}

// Components //

export const TextareaInput = forwardRef<HTMLTextAreaElement, TextareaInputProps>(
	({ variant = "secondary", size = "default", ...props }, ref) => {
		return <StyledTextarea ref={ref} $variant={variant} $size={size} {...props} />
	}
)

TextareaInput.displayName = "TextareaInput"

// Styled Components //

const StyledTextarea = styled.textarea<{
	$variant: "primary" | "secondary"
	$size: "small" | "default"
}>`
	padding: ${(props) => (props.$size === "small" ? "0.5rem 1rem" : "0.75rem 1.5rem")};
	border-radius: 0.25rem;
	font-weight: ${(props) => (props.$size === "small" ? "500" : "600")};
	font-size: ${(props) => (props.$size === "small" ? "inherit" : "1.1rem")};
	font-family: inherit;
	line-height: 1.5;
	transition: all 0.2s ease;
	width: 100%;
	box-sizing: border-box;
	resize: vertical;
	background-color: ${(props) => (props.$variant === "primary" ? "white" : "transparent")};
	color: ${(props) => (props.$variant === "primary" ? "black" : "var(--foreground)")};
	border: ${(props) =>
		props.$variant === "secondary"
			? "1px solid rgba(var(--foreground-rgb), 0.3)"
			: "1px solid rgba(0, 0, 0, 0.2)"};

	&:focus {
		outline: none;
		border-color: ${(props) =>
			props.$variant === "secondary" ? "var(--foreground)" : "rgba(0, 0, 0, 0.4)"};
		background-color: ${(props) =>
			props.$variant === "primary" ? "white" : "rgba(var(--foreground-rgb), 0.05)"};
	}

	&::placeholder {
		color: ${(props) =>
			props.$variant === "primary" ? "rgba(0, 0, 0, 0.5)" : "rgba(var(--foreground-rgb), 0.5)"};
	}

	&:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
`
