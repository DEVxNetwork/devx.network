"use client"
import { useEffect } from "react"
import { createPortal } from "react-dom"
import styled from "styled-components"

// Types //

interface ModalProps {
	isOpen: boolean
	onClose: () => void
	children: React.ReactNode
}

// Components //

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onClose()
			}
		}

		if (isOpen) {
			document.addEventListener("keydown", handleEscape)
			document.body.style.overflow = "hidden"
		}

		return () => {
			document.removeEventListener("keydown", handleEscape)
			document.body.style.overflow = "unset"
		}
	}, [isOpen, onClose])

	if (!isOpen) return null

	if (typeof document === "undefined") return null

	return createPortal(
		<Backdrop onClick={onClose}>
			<ModalContent onClick={(e) => e.stopPropagation()}>
				<CloseButton onClick={onClose} aria-label="Close modal">
					✕
				</CloseButton>
				{children}
			</ModalContent>
		</Backdrop>,
		document.body
	)
}

// Styled Components //

const Backdrop = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background-color: rgba(0, 0, 0, 0.8);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;
	padding: 1rem;
`

const ModalContent = styled.div`
	background-color: rgba(20, 20, 20, 0.95);
	border: 1px solid rgba(255, 255, 255, 0.2);
	border-radius: 0.5rem;
	padding: 2rem;
	max-width: 500px;
	width: 100%;
	position: relative;
	box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
`

const CloseButton = styled.button`
	position: absolute;
	top: 1rem;
	right: 1rem;
	background: transparent;
	border: none;
	color: white;
	font-size: 1.5rem;
	cursor: pointer;
	padding: 0.25rem;
	line-height: 1;
	transition: opacity 0.2s ease;

	&:hover {
		opacity: 0.7;
	}
`
