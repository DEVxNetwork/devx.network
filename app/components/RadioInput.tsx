"use client"
import styled from "styled-components"
import { forwardRef } from "react"

// Types //

type BaseRadioProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type">

interface RadioInputProps extends BaseRadioProps {
	variant?: "primary" | "secondary"
	size?: "small" | "default"
}

// Components //

export const RadioInput = forwardRef<HTMLInputElement, RadioInputProps>(
	({ variant = "secondary", size = "default", ...props }, ref) => {
		return <StyledRadio ref={ref} $variant={variant} $size={size} {...props} />
	}
)

RadioInput.displayName = "RadioInput"

// Styled Components //

const StyledRadio = styled.input.attrs({ type: "radio" })<{
	$variant: "primary" | "secondary"
	$size: "small" | "default"
}>`
	appearance: none;
	-webkit-appearance: none;
	-moz-appearance: none;
	width: ${(props) => (props.$size === "small" ? "1rem" : "1.25rem")};
	height: ${(props) => (props.$size === "small" ? "1rem" : "1.25rem")};
	border: 2px solid
		${(props) =>
			props.$variant === "secondary" ? "rgba(var(--foreground-rgb), 0.3)" : "rgba(0, 0, 0, 0.3)"};
	border-radius: 50%;
	background-color: transparent;
	cursor: pointer;
	position: relative;
	transition: all 0.2s ease;
	margin: 0;
	flex-shrink: 0;

	&:hover {
		border-color: ${(props) =>
			props.$variant === "secondary" ? "rgba(var(--foreground-rgb), 0.5)" : "rgba(0, 0, 0, 0.5)"};
	}

	&:checked {
		border-color: ${(props) =>
			props.$variant === "secondary" ? "rgba(156, 163, 255, 0.9)" : "rgba(0, 0, 0, 0.7)"};
		background-color: ${(props) =>
			props.$variant === "secondary" ? "rgba(156, 163, 255, 0.9)" : "rgba(0, 0, 0, 0.7)"};
	}

	&:checked::after {
		content: "";
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: ${(props) => (props.$size === "small" ? "0.375rem" : "0.5rem")};
		height: ${(props) => (props.$size === "small" ? "0.375rem" : "0.5rem")};
		border-radius: 50%;
		background-color: var(--foreground);
	}

	&:focus {
		outline: 2px solid
			${(props) =>
				props.$variant === "secondary" ? "rgba(156, 163, 255, 0.5)" : "rgba(0, 0, 0, 0.3)"};
		outline-offset: 2px;
	}

	&:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
`
