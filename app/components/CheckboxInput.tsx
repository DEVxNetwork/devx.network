"use client"
import styled from "styled-components"
import { forwardRef } from "react"

// Types //

type BaseCheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type">

interface CheckboxInputProps extends BaseCheckboxProps {
	variant?: "primary" | "secondary"
	size?: "small" | "default"
}

// Components //

export const CheckboxInput = forwardRef<HTMLInputElement, CheckboxInputProps>(
	({ variant = "secondary", size = "default", ...props }, ref) => {
		return <StyledCheckbox ref={ref} $variant={variant} $size={size} {...props} />
	}
)

CheckboxInput.displayName = "CheckboxInput"

// Styled Components //

const StyledCheckbox = styled.input.attrs({ type: "checkbox" })<{
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
			props.$variant === "secondary" ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)"};
	border-radius: 0.25rem;
	background-color: transparent;
	cursor: pointer;
	position: relative;
	transition: all 0.2s ease;
	margin: 0;
	flex-shrink: 0;

	&:hover {
		border-color: ${(props) =>
			props.$variant === "secondary" ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)"};
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
		transform: translate(-50%, -50%) rotate(45deg);
		width: ${(props) => (props.$size === "small" ? "0.25rem" : "0.375rem")};
		height: ${(props) => (props.$size === "small" ? "0.5rem" : "0.625rem")};
		border: solid white;
		border-width: 0 2px 2px 0;
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
