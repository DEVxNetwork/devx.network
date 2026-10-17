"use client"
import styled from "styled-components"
import { useState, useEffect, useRef } from "react"

type Link = {
	id: number
	url: string
}

type LinkInputProps = {
	selectedLinks: Link[]
	onLinksChange: (links: Link[]) => void
	disabled?: boolean
}

// Extract domain name from URL for display
const getDomainFromUrl = (url: string): string => {
	try {
		const urlObj = new URL(url.startsWith("http") ? url : `https://${url}`)
		return urlObj.hostname.replace(/^www\./, "")
	} catch {
		// If URL parsing fails, return the original string
		return url
	}
}

// Validate URL format
const isValidUrl = (url: string): boolean => {
	try {
		const urlStr = url.startsWith("http") ? url : `https://${url}`
		new URL(urlStr)
		return true
	} catch {
		return false
	}
}

// Normalize URL (add https:// if missing)
const normalizeUrl = (url: string): string => {
	const trimmed = url.trim()
	if (!trimmed) return trimmed
	return trimmed.startsWith("http://") || trimmed.startsWith("https://")
		? trimmed
		: `https://${trimmed}`
}

export const LinkInput = ({ selectedLinks, onLinksChange, disabled = false }: LinkInputProps) => {
	const [isAdding, setIsAdding] = useState(false)
	const [inputValue, setInputValue] = useState("")
	const [error, setError] = useState<string | null>(null)
	const [draggedLinkId, setDraggedLinkId] = useState<number | null>(null)
	const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
	const hasDraggedRef = useRef(false)
	const inputRef = useRef<HTMLInputElement>(null)
	const containerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
				setIsAdding(false)
				setInputValue("")
				setError(null)
			}
		}

		document.addEventListener("mousedown", handleClickOutside)
		return () => document.removeEventListener("mousedown", handleClickOutside)
	}, [])

	useEffect(() => {
		if (isAdding && inputRef.current) {
			inputRef.current.focus()
		}
	}, [isAdding])

	const handleAddLink = () => {
		if (!inputValue.trim()) {
			setIsAdding(false)
			setInputValue("")
			setError(null)
			return
		}

		const normalizedUrl = normalizeUrl(inputValue.trim())

		if (!isValidUrl(normalizedUrl)) {
			setError("Please enter a valid URL")
			return
		}

		// Check for duplicates
		if (selectedLinks.some((link) => link.url === normalizedUrl)) {
			setError("This link is already added")
			return
		}

		const newLink: Link = {
			id: Date.now(),
			url: normalizedUrl
		}

		onLinksChange([...selectedLinks, newLink])
		setInputValue("")
		setError(null)
		setIsAdding(false)
	}

	const handleRemoveLink = (linkId: number) => {
		onLinksChange(selectedLinks.filter((l) => l.id !== linkId))
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault()
			handleAddLink()
		} else if (e.key === "Escape") {
			setIsAdding(false)
			setInputValue("")
			setError(null)
		} else if (e.key === "Backspace" && !inputValue && selectedLinks.length > 0) {
			handleRemoveLink(selectedLinks[selectedLinks.length - 1].id)
		}
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value)
		setError(null)
	}

	const handleDragStart = (e: React.DragEvent, linkId: number) => {
		if (disabled) return
		setDraggedLinkId(linkId)
		hasDraggedRef.current = false
		e.dataTransfer.effectAllowed = "move"
		e.dataTransfer.setData("text/html", "")
	}

	const handleDragOver = (e: React.DragEvent, index: number) => {
		if (disabled || draggedLinkId === null) return
		e.preventDefault()
		e.dataTransfer.dropEffect = "move"
		setDragOverIndex(index)
		hasDraggedRef.current = true
	}

	const handleDragLeave = () => {
		setDragOverIndex(null)
	}

	const handleDrop = (e: React.DragEvent, dropIndex: number) => {
		if (disabled || draggedLinkId === null) return
		e.preventDefault()

		const draggedIndex = selectedLinks.findIndex((l) => l.id === draggedLinkId)
		if (draggedIndex === -1 || draggedIndex === dropIndex) {
			setDraggedLinkId(null)
			setDragOverIndex(null)
			hasDraggedRef.current = false
			return
		}

		const newLinks = [...selectedLinks]
		const [draggedLink] = newLinks.splice(draggedIndex, 1)
		newLinks.splice(dropIndex, 0, draggedLink)

		onLinksChange(newLinks)
		setDraggedLinkId(null)
		setDragOverIndex(null)
		hasDraggedRef.current = false
	}

	const handleDragEnd = () => {
		setDraggedLinkId(null)
		setDragOverIndex(null)
		// Reset hasDragged after a short delay to allow click handler to check it
		setTimeout(() => {
			hasDraggedRef.current = false
		}, 0)
	}

	const handleLinkClick = (url: string, e: React.MouseEvent) => {
		// Prevent click if we just dragged
		if (hasDraggedRef.current) {
			e.preventDefault()
			e.stopPropagation()
			return
		}
		window.open(url, "_blank", "noopener,noreferrer")
	}

	return (
		<Container ref={containerRef}>
			<LinkCloud>
				{selectedLinks.map((link, index) => (
					<LinkPill
						key={link.id}
						$isDragging={draggedLinkId === link.id}
						$dragOver={dragOverIndex === index}
						draggable={!disabled}
						onDragStart={(e) => handleDragStart(e, link.id)}
						onDragOver={(e) => handleDragOver(e, index)}
						onDragLeave={handleDragLeave}
						onDrop={(e) => handleDrop(e, index)}
						onDragEnd={handleDragEnd}
						onClick={(e) => handleLinkClick(link.url, e)}
						title={link.url}
					>
						{getDomainFromUrl(link.url)}
						{!disabled && (
							<RemoveButton
								onClick={(e) => {
									e.stopPropagation()
									handleRemoveLink(link.id)
								}}
							>
								×
							</RemoveButton>
						)}
					</LinkPill>
				))}
				{!disabled && (
					<>
						{!isAdding ? (
							<AddPill onClick={() => setIsAdding(true)}>
								<PlusIcon>+</PlusIcon>
								Add
							</AddPill>
						) : (
							<InputPill>
								<Input
									ref={inputRef}
									type="text"
									value={inputValue}
									onChange={handleInputChange}
									onKeyDown={handleKeyDown}
									placeholder="Enter URL..."
									disabled={disabled}
								/>
							</InputPill>
						)}
					</>
				)}
			</LinkCloud>
			{error && <ErrorText>{error}</ErrorText>}
		</Container>
	)
}

// Styled Components

const Container = styled.div`
	position: relative;
	width: 100%;
`

const LinkCloud = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
	align-items: center;
`

const LinkPill = styled.div<{ $isDragging?: boolean; $dragOver?: boolean }>`
	display: inline-flex;
	align-items: center;
	gap: 0.375rem;
	padding: 0.375rem 0.75rem;
	background-color: rgba(var(--foreground-rgb), 0.2);
	border: 1px solid rgba(var(--foreground-rgb), 0.3);
	border-radius: 9999px;
	font-size: 0.875rem;
	color: var(--foreground);
	font-weight: 500;
	transition: all 0.2s ease;
	cursor: ${(props) => (props.draggable ? "grab" : "pointer")};
	opacity: ${(props) => (props.$isDragging ? 0.5 : 1)};
	transform: ${(props) => (props.$isDragging ? "scale(0.95)" : "scale(1)")};
	border-color: ${(props) =>
		props.$dragOver ? "rgba(var(--foreground-rgb), 0.6)" : "rgba(var(--foreground-rgb), 0.3)"};

	&:hover {
		background-color: rgba(255, 255, 255, 0.25);
	}

	&:active {
		cursor: ${(props) => (props.draggable ? "grabbing" : "pointer")};
	}
`

const RemoveButton = styled.button`
	background: none;
	border: none;
	color: rgba(var(--foreground-rgb), 0.7);
	cursor: pointer;
	font-size: 1.2rem;
	line-height: 1;
	padding: 0;
	margin-left: -0.125rem;
	width: 16px;
	height: 16px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	transition: all 0.2s ease;

	&:hover {
		color: var(--foreground);
		background-color: rgba(var(--foreground-rgb), 0.2);
	}
`

const AddPill = styled.button`
	display: inline-flex;
	align-items: center;
	gap: 0.375rem;
	padding: 0.375rem 0.75rem;
	background-color: rgba(var(--foreground-rgb), 0.1);
	border: 1px dashed rgba(var(--foreground-rgb), 0.3);
	border-radius: 9999px;
	font-size: 0.875rem;
	color: rgba(var(--foreground-rgb), 0.7);
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s ease;

	&:hover {
		background-color: rgba(var(--foreground-rgb), 0.15);
		border-color: rgba(var(--foreground-rgb), 0.5);
		color: var(--foreground);
	}
`

const PlusIcon = styled.span`
	font-size: 1.1rem;
	line-height: 1;
	font-weight: 600;
`

const InputPill = styled.div`
	display: inline-flex;
	align-items: center;
	gap: 0.375rem;
	padding: 0.375rem 0.75rem;
	background-color: rgba(var(--foreground-rgb), 0.15);
	border: 1px solid rgba(var(--foreground-rgb), 0.3);
	border-radius: 9999px;
	min-width: 120px;
	position: relative;
`

const Input = styled.input`
	background: transparent;
	border: none;
	outline: none;
	color: var(--foreground);
	font-size: 0.875rem;
	font-weight: 500;
	font-family: inherit;
	width: 100%;
	min-width: 80px;
	padding: 0;

	&::placeholder {
		color: rgba(var(--foreground-rgb), 0.5);
	}

	&:disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}
`

const ErrorText = styled.div`
	margin-top: 0.5rem;
	color: rgba(255, 100, 100, 0.9);
	font-size: 0.875rem;
`
