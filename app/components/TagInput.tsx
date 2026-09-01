"use client"
import styled from "styled-components"
import { useState, useEffect, useRef, useCallback } from "react"
import { supabaseClient } from "../../lib/supabaseClient"

type Tag = {
	id: number
	name: string
	approved: boolean
	sort_order?: number
}

type TagInputProps = {
	selectedTags: Tag[]
	onTagsChange: (tags: Tag[]) => void
	tableName: "interests" | "skills"
	disabled?: boolean
}

export const TagInput = ({
	selectedTags,
	onTagsChange,
	tableName,
	disabled = false
}: TagInputProps) => {
	const [isAdding, setIsAdding] = useState(false)
	const [searchQuery, setSearchQuery] = useState("")
	const [suggestions, setSuggestions] = useState<Tag[]>([])
	const [isSearching, setIsSearching] = useState(false)
	const [highlightedIndex, setHighlightedIndex] = useState(-1)
	const [draggedTagId, setDraggedTagId] = useState<number | null>(null)
	const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
	const inputRef = useRef<HTMLInputElement>(null)
	const containerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
				setIsAdding(false)
				setSearchQuery("")
				setSuggestions([])
				setHighlightedIndex(-1)
			}
		}

		document.addEventListener("mousedown", handleClickOutside)
		return () => document.removeEventListener("mousedown", handleClickOutside)
	}, [])

	const loadInitialSuggestions = useCallback(async () => {
		setIsSearching(true)
		try {
			const selectedIds = new Set(selectedTags.map((t) => t.id))

			// Fetch tags - simplified query that works reliably
			const { data, error } = await supabaseClient
				.from(tableName)
				.select("id, name, approved")
				.eq("approved", true)
				.limit(100)

			if (error) throw error

			// Filter out selected tags
			const tags = (data || []).filter((tag) => !selectedIds.has(tag.id))

			setSuggestions(tags)
		} catch (error) {
			console.error(`Error loading initial ${tableName}:`, error)
			setSuggestions([])
		} finally {
			setIsSearching(false)
		}
	}, [selectedTags, tableName])

	useEffect(() => {
		if (isAdding && inputRef.current) {
			inputRef.current.focus()
			// Load initial suggestions when adding starts
			loadInitialSuggestions()
		}
	}, [isAdding, loadInitialSuggestions])

	useEffect(() => {
		const searchTags = async () => {
			// If input is empty and we're adding, show initial suggestions
			if (!searchQuery.trim()) {
				if (isAdding) {
					loadInitialSuggestions()
				} else {
					setSuggestions([])
					setHighlightedIndex(-1)
				}
				return
			}

			setIsSearching(true)
			try {
				const query = searchQuery.trim().toLowerCase()
				const selectedIds = new Set(selectedTags.map((t) => t.id))

				// Fetch tags - simplified query that works reliably
				const { data, error } = await supabaseClient
					.from(tableName)
					.select("id, name, approved")
					.eq("approved", true)
					.limit(100)

				if (error) throw error

				// Filter out already selected tags
				const availableTags = (data || [])
					.map((tag) => ({
						id: tag.id,
						name: tag.name,
						approved: tag.approved,
						popularity: 0 // Will sort by match score only for now
					}))
					.filter((tag) => !selectedIds.has(tag.id))

				// Fuzzy matching: score tags by relevance
				const scoredTags = availableTags
					.map((tag) => {
						const tagName = tag.name.toLowerCase()
						let matchScore = 0

						// Exact match gets highest score
						if (tagName === query) {
							matchScore = 1000
						}
						// Starts with query gets high score
						else if (tagName.startsWith(query)) {
							matchScore = 500 + (tagName.length - query.length)
						}
						// Contains query gets medium score
						else if (tagName.includes(query)) {
							matchScore = 100 + (tagName.length - query.length)
						}
						// Fuzzy match: check if query characters appear in order
						else {
							let queryIndex = 0
							for (let i = 0; i < tagName.length && queryIndex < query.length; i++) {
								if (tagName[i] === query[queryIndex]) {
									queryIndex++
								}
							}
							if (queryIndex === query.length) {
								matchScore = 50
							}
						}

						return { ...tag, matchScore }
					})
					.filter((tag) => tag.matchScore > 0)
					// Sort by match score first (descending), then by popularity (descending)
					.sort((a, b) => {
						if (b.matchScore !== a.matchScore) {
							return b.matchScore - a.matchScore
						}
						return b.popularity - a.popularity
					})
					.map(({ matchScore, popularity, ...tag }) => tag)

				setSuggestions(scoredTags)
				setHighlightedIndex(-1)
			} catch (error) {
				console.error(`Error searching ${tableName}:`, error)
				setSuggestions([])
			} finally {
				setIsSearching(false)
			}
		}

		const debounceTimer = setTimeout(searchTags, 300)
		return () => clearTimeout(debounceTimer)
	}, [searchQuery, tableName, selectedTags, isAdding, loadInitialSuggestions])

	const handleAddTag = (tag: Tag) => {
		if (selectedTags.find((t) => t.id === tag.id)) return
		onTagsChange([...selectedTags, tag])
		setSearchQuery("")
		setIsAdding(false)
		setSuggestions([])
		setHighlightedIndex(-1)
	}

	const handleCreateTag = () => {
		if (!searchQuery.trim()) {
			setIsAdding(false)
			setSearchQuery("")
			return
		}

		const newTag: Tag = {
			id: Date.now(),
			name: searchQuery.trim(),
			approved: false
		}

		handleAddTag(newTag)
	}

	const handleRemoveTag = (tagId: number) => {
		onTagsChange(selectedTags.filter((t) => t.id !== tagId))
	}

	const handleDragStart = (e: React.DragEvent, tagId: number) => {
		if (disabled) return
		setDraggedTagId(tagId)
		e.dataTransfer.effectAllowed = "move"
		e.dataTransfer.setData("text/html", "")
	}

	const handleDragOver = (e: React.DragEvent, index: number) => {
		if (disabled || draggedTagId === null) return
		e.preventDefault()
		e.dataTransfer.dropEffect = "move"
		setDragOverIndex(index)
	}

	const handleDragLeave = () => {
		setDragOverIndex(null)
	}

	const handleDrop = (e: React.DragEvent, dropIndex: number) => {
		if (disabled || draggedTagId === null) return
		e.preventDefault()

		const draggedIndex = selectedTags.findIndex((t) => t.id === draggedTagId)
		if (draggedIndex === -1 || draggedIndex === dropIndex) {
			setDraggedTagId(null)
			setDragOverIndex(null)
			return
		}

		const newTags = [...selectedTags]
		const [draggedTag] = newTags.splice(draggedIndex, 1)
		newTags.splice(dropIndex, 0, draggedTag)

		// Update sort_order based on new position
		const tagsWithSortOrder = newTags.map((tag, index) => ({
			...tag,
			sort_order: index
		}))

		onTagsChange(tagsWithSortOrder)
		setDraggedTagId(null)
		setDragOverIndex(null)
	}

	const handleDragEnd = () => {
		setDraggedTagId(null)
		setDragOverIndex(null)
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault()
			if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
				handleAddTag(suggestions[highlightedIndex])
			} else if (suggestions.length > 0) {
				handleAddTag(suggestions[0])
			} else if (searchQuery.trim()) {
				handleCreateTag()
			}
		} else if (e.key === "Escape") {
			setIsAdding(false)
			setSearchQuery("")
			setSuggestions([])
			setHighlightedIndex(-1)
		} else if (e.key === "ArrowDown") {
			e.preventDefault()
			setHighlightedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev))
		} else if (e.key === "ArrowUp") {
			e.preventDefault()
			setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1))
		} else if (e.key === "Backspace" && !searchQuery && selectedTags.length > 0) {
			handleRemoveTag(selectedTags[selectedTags.length - 1].id)
		}
	}

	const hasExactMatch = suggestions.some(
		(tag) => tag.name.toLowerCase() === searchQuery.toLowerCase()
	)
	const canCreateNew = searchQuery.trim() && !hasExactMatch

	return (
		<Container ref={containerRef}>
			<TagCloud>
				{selectedTags.map((tag, index) => (
					<TagPill
						key={tag.id}
						$approved={tag.approved}
						$isDragging={draggedTagId === tag.id}
						$dragOver={dragOverIndex === index}
						draggable={!disabled}
						onDragStart={(e) => handleDragStart(e, tag.id)}
						onDragOver={(e) => handleDragOver(e, index)}
						onDragLeave={handleDragLeave}
						onDrop={(e) => handleDrop(e, index)}
						onDragEnd={handleDragEnd}
					>
						{tag.name}
						{!disabled && (
							<RemoveButton
								onClick={(e) => {
									e.stopPropagation()
									handleRemoveTag(tag.id)
								}}
							>
								×
							</RemoveButton>
						)}
					</TagPill>
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
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									onKeyDown={handleKeyDown}
									placeholder="Type to search..."
									disabled={disabled}
								/>
								{isSearching && <SearchIndicator>...</SearchIndicator>}
							</InputPill>
						)}
					</>
				)}
			</TagCloud>

			{isAdding && (suggestions.length > 0 || canCreateNew) && (
				<SuggestionsList>
					{suggestions.map((tag, index) => (
						<SuggestionItem
							key={tag.id}
							$highlighted={index === highlightedIndex}
							onClick={() => handleAddTag(tag)}
							onMouseEnter={() => setHighlightedIndex(index)}
						>
							{tag.name}
						</SuggestionItem>
					))}
					{canCreateNew && (
						<CreateItem
							$highlighted={highlightedIndex === suggestions.length}
							onClick={handleCreateTag}
							onMouseEnter={() => setHighlightedIndex(suggestions.length)}
						>
							Create &quot;{searchQuery.trim()}&quot;
						</CreateItem>
					)}
				</SuggestionsList>
			)}
		</Container>
	)
}

// Styled Components

const Container = styled.div`
	position: relative;
	width: 100%;
`

const TagCloud = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
	align-items: center;
`

const TagPill = styled.div<{ $approved: boolean; $isDragging?: boolean; $dragOver?: boolean }>`
	display: inline-flex;
	align-items: center;
	gap: 0.375rem;
	padding: 0.375rem 0.75rem;
	background-color: ${(props) =>
		props.$approved ? "rgba(var(--foreground-rgb), 0.2)" : "rgba(255, 243, 205, 0.3)"};
	border: 1px solid
		${(props) => (props.$approved ? "rgba(var(--foreground-rgb), 0.3)" : "rgba(255, 193, 7, 0.5)")};
	border-radius: 9999px;
	font-size: 0.875rem;
	color: var(--foreground);
	font-weight: 500;
	transition: all 0.2s ease;
	cursor: ${(props) => (props.draggable ? "grab" : "default")};
	opacity: ${(props) => (props.$isDragging ? 0.5 : 1)};
	transform: ${(props) => (props.$isDragging ? "scale(0.95)" : "scale(1)")};
	border-color: ${(props) =>
		props.$dragOver
			? props.$approved
				? "rgba(var(--foreground-rgb), 0.6)"
				: "rgba(255, 193, 7, 0.8)"
			: props.$approved
				? "rgba(var(--foreground-rgb), 0.3)"
				: "rgba(255, 193, 7, 0.5)"};

	&:hover {
		background-color: ${(props) =>
			props.$approved ? "rgba(255, 255, 255, 0.25)" : "rgba(255, 243, 205, 0.4)"};
	}

	&:active {
		cursor: ${(props) => (props.draggable ? "grabbing" : "default")};
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

const SearchIndicator = styled.div`
	position: absolute;
	right: 0.75rem;
	color: rgba(var(--foreground-rgb), 0.5);
	font-size: 0.875rem;
`

const SuggestionsList = styled.div`
	position: absolute;
	top: calc(100% + 0.5rem);
	left: 0;
	right: 0;
	background-color: rgba(0, 0, 0, 0.9);
	backdrop-filter: blur(10px);
	border: 1px solid rgba(var(--foreground-rgb), 0.2);
	border-radius: 0.5rem;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
	max-height: 200px;
	overflow-y: auto;
	z-index: 100;
`

const SuggestionItem = styled.div<{ $highlighted: boolean }>`
	padding: 0.625rem 1rem;
	cursor: pointer;
	font-size: 0.875rem;
	color: var(--foreground);
	background-color: ${(props) =>
		props.$highlighted ? "rgba(var(--foreground-rgb), 0.1)" : "transparent"};
	transition: background-color 0.15s ease;

	&:hover {
		background-color: rgba(var(--foreground-rgb), 0.1);
	}

	&:first-child {
		border-top-left-radius: 0.5rem;
		border-top-right-radius: 0.5rem;
	}

	&:last-child {
		border-bottom-left-radius: 0.5rem;
		border-bottom-right-radius: 0.5rem;
	}
`

const CreateItem = styled(SuggestionItem)`
	color: rgba(var(--foreground-rgb), 0.7);
	font-style: italic;
	border-top: 1px solid var(--border);
`
