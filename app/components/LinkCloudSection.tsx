"use client"
import styled from "styled-components"
import { useState, useEffect, useRef } from "react"
import { LinkInput } from "./LinkInput"

type Link = {
	id: number
	url: string
}

type LinkCloudSectionProps = {
	title: string
	selectedLinks: Link[]
	onLinksChange: (links: Link[]) => Promise<void>
	profileId: number
	disabled?: boolean
}

export const LinkCloudSection = ({
	title,
	selectedLinks,
	onLinksChange,
	profileId,
	disabled = false
}: LinkCloudSectionProps) => {
	const [localLinks, setLocalLinks] = useState<Link[]>(selectedLinks)
	const [saving, setSaving] = useState(false)
	const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

	useEffect(() => {
		setLocalLinks(selectedLinks)
	}, [selectedLinks])

	const handleLinksChange = async (links: Link[]) => {
		setLocalLinks(links)

		// Debounce saves to avoid too many API calls
		if (saveTimeoutRef.current) {
			clearTimeout(saveTimeoutRef.current)
		}

		saveTimeoutRef.current = setTimeout(async () => {
			setSaving(true)
			try {
				await onLinksChange(links)
			} catch (error) {
				console.error("Error saving links:", error)
				// Revert to previous links on error
				setLocalLinks(selectedLinks)
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
			<LinkInput selectedLinks={localLinks} onLinksChange={handleLinksChange} disabled={disabled} />
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
