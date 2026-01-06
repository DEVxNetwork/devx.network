"use client"
import styled from "styled-components"
import { forwardRef } from "react"

// Types //

type BaseInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">

interface TextInputProps extends BaseInputProps {
	variant?: "primary" | "secondary"
	size?: "small" | "default"
	error?: boolean
}

// Components //

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
	({ variant = "secondary", size = "small", error = false, ...props }, ref) => {
		return <StyledInput ref={ref} $variant={variant} $size={size} $error={error} {...props} />
	}
)

TextInput.displayName = "TextInput"

// Styled Components //

const StyledInput = styled.input<{
	$variant: "primary" | "secondary"
	$size: "small" | "default"
	$error?: boolean
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
	background-color: ${(props) => (props.$variant === "primary" ? "white" : "transparent")};
	color: ${(props) => (props.$variant === "primary" ? "black" : "white")};
	border: ${(props) => {
		if (props.$error) {
			return "1px solid var(--error-color)"
		}

		if (props.$variant === "secondary") {
			return "1px solid rgba(255, 255, 255, 0.3)"
		}

		return "1px solid rgba(0, 0, 0, 0.2)"
	}};

	&:focus {
		outline: none;
		border-color: ${(props) => {
			if (props.$error) {
				return "var(--error-color)"
			}

			if (props.$variant === "secondary") {
				return "white"
			}

			return "rgba(0, 0, 0, 0.4)"
		}};
		background-color: ${(props) =>
			props.$variant === "primary" ? "white" : "rgba(255, 255, 255, 0.05)"};
	}

	&::placeholder {
		color: ${(props) =>
			props.$variant === "primary" ? "rgba(0, 0, 0, 0.5)" : "rgba(255, 255, 255, 0.5)"};
	}

	&:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
`
