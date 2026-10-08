"use client"
import styled from "styled-components"
import { useState, useEffect, useRef } from "react"
import { TagInput } from "./TagInput"

type Tag = {
	id: number
	name: string
	approved: boolean
	sort_order?: number
}

type TagCloudSectionProps = {
	title: string
	selectedTags: Tag[]
	onTagsChange: (tags: Tag[]) => Promise<void>
	tableName: "interests" | "skills"
	profileId: number
	disabled?: boolean
}

export const TagCloudSection = ({
	title,
	selectedTags,
	onTagsChange,
	tableName,
	profileId,
	disabled = false
}: TagCloudSectionProps) => {
	const [localTags, setLocalTags] = useState<Tag[]>(selectedTags)
	const [saving, setSaving] = useState(false)
	const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

	useEffect(() => {
		setLocalTags(selectedTags)
	}, [selectedTags])

	const handleTagsChange = async (tags: Tag[]) => {
		setLocalTags(tags)

		// Debounce saves to avoid too many API calls
		if (saveTimeoutRef.current) {
			clearTimeout(saveTimeoutRef.current)
		}

		saveTimeoutRef.current = setTimeout(async () => {
			setSaving(true)
			try {
				await onTagsChange(tags)
			} catch (error) {
				console.error(`Error saving ${tableName}:`, error)
				// Revert to previous tags on error
				setLocalTags(selectedTags)
			} finally {
				setSaving(false)
			}
		}, 500)
	}

	useEffect(() => {
		return () => {
			if (saveTimeoutRef.current) {
				clearTimeout(saveTimeoutRef.current)
			}
		}
	}, [])

	return (
		<Section>
			<SectionHeader>
				<SectionTitle>{title}</SectionTitle>
				{saving && <SavingIndicator>Saving...</SavingIndicator>}
			</SectionHeader>
			<TagInput
				selectedTags={localTags}
				onTagsChange={handleTagsChange}
				tableName={tableName}
				disabled={disabled}
			/>
		</Section>
	)
}

const Section = styled.div`
	margin-top: 2rem;
	display: flex;
	flex-direction: column;
	gap: 1rem;
`

const SectionHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`

const SectionTitle = styled.h3`
	font-size: 1.25rem;
	font-weight: 600;
	color: var(--foreground);
	margin: 0;
`

const SavingIndicator = styled.span`
	font-size: 0.875rem;
	color: rgba(var(--foreground-rgb), 0.6);
	font-style: italic;
`
