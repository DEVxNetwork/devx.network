"use client"
import { useState, useRef, useEffect, type ReactNode } from "react"
import styled from "styled-components"
import { QuestionIcon } from "./icons"

type HelpInfoButtonProps = {
	children: ReactNode
	minWidth?: string
	maxWidth?: string
}

export const HelpInfoButton = ({ children, minWidth, maxWidth }: HelpInfoButtonProps) => {
	const [isOpen, setIsOpen] = useState(false)
	const wrapperRef = useRef<HTMLDivElement | null>(null)

	const handleToggle = () => {
		setIsOpen(!isOpen)
	}

	useEffect(() => {
		if (!isOpen) return

		const handleClickOutside = (event: MouseEvent) => {
			if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
				setIsOpen(false)
			}
		}

		document.addEventListener("mousedown", handleClickOutside)
		return () => {
			document.removeEventListener("mousedown", handleClickOutside)
		}
	}, [isOpen])

	return (
		<HelpIconWrapper ref={wrapperRef} onClick={handleToggle}>
			<QuestionIcon />
			{isOpen && (
				<Tooltip $minWidth={minWidth} $maxWidth={maxWidth}>
					{children}
				</Tooltip>
			)}
		</HelpIconWrapper>
	)
}

const HelpIconWrapper = styled.div`
	position: relative;
	cursor: pointer;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	color: rgba(var(--foreground-rgb), 0.6);
	transition: color 0.2s ease;
	flex-shrink: 0;

	&:hover {
		color: rgba(var(--foreground-rgb), 0.9);
	}
`

const Tooltip = styled.div<{ $minWidth?: string; $maxWidth?: string }>`
	position: absolute;
	bottom: calc(100% + 8px);
	right: 0;
	background: rgba(0, 0, 0, 0.95);
	color: rgba(var(--foreground-rgb), 0.95);
	padding: 0.75rem 1rem;
	border-radius: 8px;
	font-size: 0.875rem;
	line-height: 1.4;
	white-space: normal;
	min-width: ${(props) => props.$minWidth || "200px"};
	max-width: ${(props) => props.$maxWidth || "250px"};
	width: max-content;
	z-index: 1000;
	box-shadow:
		0 4px 12px rgba(0, 0, 0, 0.4),
		0 0 0 1px rgba(var(--foreground-rgb), 0.1);
	pointer-events: auto;

	&::after {
		content: "";
		position: absolute;
		top: 100%;
		right: 1rem;
		transform: translateX(50%);
		border: 6px solid transparent;
		border-top-color: rgba(0, 0, 0, 0.95);
	}
`
