"use client"
import Link from "next/link"
import styled from "styled-components"
import { useState, useEffect, useCallback } from "react"
import { supabaseClient } from "../../../lib/supabaseClient"
import { useRequireAdminAuth } from "../../hooks/useRequireAdminAuth"
import { PotionBackground } from "../../components/PotionBackground"
import { TalkThumbnail } from "../../components/TalkThumbnail"

// Types //

type TalkStatus =
	| "pending"
	| "under_review"
	| "approved"
	| "rejected"
	| "scheduled"
	| "completed"
	| "cancelled"

interface TalkSubmission {
	id: number
	talk_title: string
	talk_hook: string | null
	talk_synopsis: string
	slides_type: "url" | "upload"
	slides_url: string | null
	slides_file_path: string | null
	status: TalkStatus
	admin_notes: string | null
	created_at: string
	updated_at: string
	profiles: {
		full_name: string
		email: string
		phone_number: string | null
		handle: string | null
		profile_photo: string | null
	}
}

// Constants //

const TALK_STATUSES: TalkStatus[] = [
	"pending",
	"under_review",
	"approved",
	"rejected",
	"scheduled",
	"completed",
	"cancelled"
]

const DEFAULT_FILTER_STATUSES: TalkStatus[] = ["pending", "under_review", "approved", "scheduled"]

const STATUS_COLORS: Record<TalkStatus, string> = {
	pending: "#f59e0b",
	under_review: "#3b82f6",
	approved: "#10b981",
	rejected: "#ef4444",
	scheduled: "#8b5cf6",
	completed: "#6b7280",
	cancelled: "#9ca3af"
}

// Components //

export default function AdminTalks() {
	const { loading, isAdmin } = useRequireAdminAuth()
	const [talks, setTalks] = useState<TalkSubmission[]>([])
	const [filterStatuses, setFilterStatuses] = useState<TalkStatus[]>(DEFAULT_FILTER_STATUSES)
	const [updatingId, setUpdatingId] = useState<number | null>(null)
	const [downloadingId, setDownloadingId] = useState<number | null>(null)
	const [error, setError] = useState<string | null>(null)

	const fetchTalks = useCallback(async () => {
		let query = supabaseClient
			.from("talk_submissions")
			.select(
				`
				id,
				talk_title,
				talk_hook,
				talk_synopsis,
				slides_type,
				slides_url,
				slides_file_path,
				status,
				admin_notes,
				created_at,
				updated_at,
				profiles (
					full_name,
					email,
					phone_number,
					handle,
					profile_photo
				)
			`
			)
			.order("created_at", { ascending: false })

		if (filterStatuses.length === 0) {
			setTalks([])
			return
		}

		if (filterStatuses.length !== TALK_STATUSES.length) {
			query = query.in("status", filterStatuses)
		}

		const { data, error: fetchError } = await query

		if (fetchError) {
			setError(fetchError.message)
			return
		}

		setTalks((data as unknown as TalkSubmission[]) || [])
	}, [filterStatuses])

	useEffect(() => {
		if (isAdmin) {
			fetchTalks()
		}
	}, [isAdmin, fetchTalks])

	const handleStatusChange = async (talkId: number, newStatus: TalkStatus) => {
		setUpdatingId(talkId)
		setError(null)

		try {
			const {
				data: { user }
			} = await supabaseClient.auth.getUser()

			const { error: updateError } = await supabaseClient
				.from("talk_submissions")
				.update({
					status: newStatus,
					reviewed_by: user?.id,
					reviewed_at: new Date().toISOString()
				})
				.eq("id", talkId)

			if (updateError) throw updateError

			await fetchTalks()
		} catch (err: any) {
			setError(err.message || "Failed to update status")
		} finally {
			setUpdatingId(null)
		}
	}

	const handleFilterStatusToggle = (status: TalkStatus, withOptionKey: boolean) => {
		setFilterStatuses((previousStatuses) => {
			if (withOptionKey) {
				const hasOtherEnabledStatuses = previousStatuses.some(
					(enabledStatus) => enabledStatus !== status
				)
				return hasOtherEnabledStatuses ? [status] : TALK_STATUSES
			}

			if (previousStatuses.includes(status)) {
				return previousStatuses.filter((enabledStatus) => enabledStatus !== status)
			}

			return TALK_STATUSES.filter(
				(candidateStatus) =>
					candidateStatus === status || previousStatuses.includes(candidateStatus)
			)
		})
	}

	const getFileNameFromPath = (filePath: string) => {
		const pathSegments = filePath.split("/")
		return pathSegments[pathSegments.length - 1] || filePath
	}

	const getStatusLabel = (status: TalkStatus) => status.replace("_", " ")

	const getStatusWidthCh = (status: TalkStatus) =>
		Math.max(Math.ceil(getStatusLabel(status).length * 1.05) + 3, 10)

	const buildThumbnailGeneratorUrl = (talk: TalkSubmission) => {
		const params = new URLSearchParams()
		params.set("hook", talk.talk_hook || talk.talk_title)
		params.set("speakerName", talk.profiles.full_name)
		if (talk.profiles.handle) {
			params.set("handle", talk.profiles.handle)
		}
		if (talk.profiles.profile_photo) {
			params.set("profilePhotoUrl", talk.profiles.profile_photo)
		}
		return `/admin/thumbnails?${params.toString()}`
	}

	const handleSlidesDownload = async (talkId: number, filePath: string) => {
		setDownloadingId(talkId)
		setError(null)

		try {
			const { data: fileData, error: downloadError } = await supabaseClient.storage
				.from("talk-slides")
				.download(filePath)

			if (downloadError) throw downloadError

			const fileUrl = window.URL.createObjectURL(fileData)
			const linkElement = document.createElement("a")
			linkElement.href = fileUrl
			linkElement.download = getFileNameFromPath(filePath)
			document.body.appendChild(linkElement)
			linkElement.click()
			document.body.removeChild(linkElement)
			window.URL.revokeObjectURL(fileUrl)
		} catch (err: any) {
			setError(err.message || "Failed to download slides")
		} finally {
			setDownloadingId(null)
		}
	}

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit"
		})
	}

	if (loading) {
		return (
			<>
				<BackgroundContainer>
					<PotionBackground />
				</BackgroundContainer>
				<Container>
					<LoadingText>Verifying admin access...</LoadingText>
				</Container>
			</>
		)
	}

	if (!isAdmin) return null

	return (
		<>
			<BackgroundContainer>
				<PotionBackground />
			</BackgroundContainer>
			<Container>
				<ContentWrapper>
					<PageHeader>
						<Title>Talk Submissions</Title>
						<Subtitle>
							{talks.length} submission{talks.length !== 1 ? "s" : ""}
							{filterStatuses.length !== TALK_STATUSES.length
								? ` (${filterStatuses.length} status filter${filterStatuses.length !== 1 ? "s" : ""})`
								: ""}
						</Subtitle>
					</PageHeader>

					{error && <ErrorMessage>{error}</ErrorMessage>}

					<FilterBar>
						<FilterLabel>Filter by status:</FilterLabel>
						<FilterButtons>
							{TALK_STATUSES.map((status) => (
								<FilterButton
									key={status}
									$active={filterStatuses.includes(status)}
									$color={STATUS_COLORS[status]}
									onClick={(event) => handleFilterStatusToggle(status, event.altKey)}
								>
									{status.replace("_", " ")}
								</FilterButton>
							))}
						</FilterButtons>
					</FilterBar>

					{talks.length === 0 ? (
						<EmptyState>No submissions found.</EmptyState>
					) : (
						<TalkList>
							{talks.map((talk) => (
								<TalkCard key={talk.id}>
									<CardHeader>
										<TalkTitle>{talk.talk_title}</TalkTitle>
										<StatusPillWrap>
											<StatusPillSelect
												$color={STATUS_COLORS[talk.status]}
												$widthCh={getStatusWidthCh(talk.status)}
												value={talk.status}
												onChange={(e) => handleStatusChange(talk.id, e.target.value as TalkStatus)}
												disabled={updatingId === talk.id}
												aria-label={`Change status for ${talk.talk_title}`}
											>
												{TALK_STATUSES.map((status) => (
													<option key={status} value={status}>
														{getStatusLabel(status)}
													</option>
												))}
											</StatusPillSelect>
											<StatusChevron $color={STATUS_COLORS[talk.status]} aria-hidden="true" />
										</StatusPillWrap>
									</CardHeader>

									<DetailsGrid>
										<ThumbnailColumn>
											<ThumbnailLink
												href={buildThumbnailGeneratorUrl(talk)}
												aria-label={`Edit and download thumbnail for ${talk.talk_title}`}
											>
												<TalkThumbnail
													speakerName={talk.profiles.full_name}
													hook={talk.talk_hook || talk.talk_title}
													profilePhotoUrl={talk.profiles.profile_photo || undefined}
													width={1000}
												/>
											</ThumbnailLink>
										</ThumbnailColumn>
										<DetailsColumn>
											<Synopsis>{talk.talk_synopsis}</Synopsis>

											{(talk.slides_url || talk.slides_file_path) && (
												<SlidesInfo>
													Slides: {talk.slides_type === "url" ? "URL" : "Uploaded file"}
													{talk.slides_url && (
														<>
															{" — "}
															<SlidesLink
																href={talk.slides_url}
																target="_blank"
																rel="noopener noreferrer"
															>
																{talk.slides_url}
															</SlidesLink>
														</>
													)}
													{talk.slides_file_path && (
														<>
															{" — "}
															<SlidesDownloadButton
																type="button"
																onClick={() =>
																	handleSlidesDownload(talk.id, talk.slides_file_path as string)
																}
																disabled={downloadingId === talk.id}
															>
																{downloadingId === talk.id
																	? "Downloading..."
																	: `Download ${getFileNameFromPath(talk.slides_file_path)}`}
															</SlidesDownloadButton>
														</>
													)}
												</SlidesInfo>
											)}
										</DetailsColumn>
									</DetailsGrid>
									<MetaRow>
										<MetaItem>
											<MetaLabel>Submitter</MetaLabel>
											<MetaValue>
												{talk.profiles.full_name}
												{talk.profiles.handle && (
													<HandleLink href={`/whois?${talk.profiles.handle}`}>
														@{talk.profiles.handle}
													</HandleLink>
												)}
											</MetaValue>
										</MetaItem>
										<MetaItem>
											<MetaLabel>Email</MetaLabel>
											<MetaValue>{talk.profiles.email}</MetaValue>
										</MetaItem>
										<MetaItem>
											<MetaLabel>Phone</MetaLabel>
											<MetaValue>{talk.profiles.phone_number || "Not provided"}</MetaValue>
										</MetaItem>
										<MetaItem>
											<MetaLabel>Submitted</MetaLabel>
											<MetaValue>{formatDate(talk.created_at)}</MetaValue>
										</MetaItem>
										<MetaItem>
											<MetaLabel>Updated</MetaLabel>
											<MetaValue>{formatDate(talk.updated_at)}</MetaValue>
										</MetaItem>
									</MetaRow>
								</TalkCard>
							))}
						</TalkList>
					)}
				</ContentWrapper>
			</Container>
		</>
	)
}

// Styled Components //

const BackgroundContainer = styled.section`
	background-color: var(--background);
	position: fixed;
	height: 100vh;
	width: 100vw;
	top: 0;
	left: 0;
	z-index: -1;
`

const Container = styled.main`
	min-height: 100vh;
	display: flex;
	justify-content: center;
	padding: 2rem 1rem;
`

const ContentWrapper = styled.div`
	width: 100%;
	max-width: 960px;
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
`

const PageHeader = styled.div`
	text-align: center;
`

const Title = styled.h1`
	font-size: 2rem;
	font-weight: 700;
	color: var(--foreground);
	margin: 0;
`

const Subtitle = styled.p`
	color: rgba(var(--foreground-rgb), 0.6);
	margin: 0.5rem 0 0 0;
`

const FilterBar = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
`

const FilterLabel = styled.span`
	color: rgba(var(--foreground-rgb), 0.7);
	font-size: 0.875rem;
	font-weight: 600;
`

const FilterButtons = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
`

const FilterButton = styled.button<{ $active: boolean; $color?: string }>`
	padding: 0.375rem 0.75rem;
	border-radius: 1rem;
	font-size: 0.8125rem;
	font-family: inherit;
	cursor: pointer;
	transition: all 0.2s ease;
	text-transform: capitalize;
	border: 1px solid
		${(props) => (props.$active ? props.$color || "white" : "rgba(var(--foreground-rgb), 0.2)")};
	background-color: ${(props) =>
		props.$active ? (props.$color || "white") + "22" : "transparent"};
	color: ${(props) =>
		props.$active ? props.$color || "white" : "rgba(var(--foreground-rgb), 0.6)"};

	&:hover {
		border-color: ${(props) => props.$color || "white"};
		color: ${(props) => props.$color || "white"};
	}
`

const TalkList = styled.div`
	display: flex;
	flex-direction: column;
	gap: 1rem;
`

const TalkCard = styled.div`
	background-color: var(--surface);
	-webkit-backdrop-filter: blur(20px);
	backdrop-filter: blur(20px);
	border: 1px solid var(--border);
	border-radius: 0.75rem;
	padding: 1.5rem;
	display: flex;
	flex-direction: column;
	gap: 1rem;
`

const CardHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	gap: 1rem;
`

const TalkTitle = styled.h2`
	font-size: 1.125rem;
	font-weight: 600;
	color: var(--foreground);
	margin: 0;
	flex: 1;
`

const DetailsGrid = styled.div`
	display: grid;
	grid-template-columns: minmax(280px, 420px) minmax(0, 1fr);
	gap: 1rem;
	align-items: start;

	@media (max-width: 900px) {
		grid-template-columns: 1fr;
	}
`

const ThumbnailColumn = styled.div`
	max-width: 420px;
	width: 100%;
	min-width: 0;

	@media (max-width: 900px) {
		max-width: none;
		justify-self: stretch;
	}
`

const ThumbnailLink = styled(Link)`
	display: block;
	border-radius: 0.5rem;
	text-decoration: none;

	&:hover {
		opacity: 0.95;
	}

	&:focus-visible {
		outline: 2px solid rgba(156, 163, 255, 0.9);
		outline-offset: 2px;
	}
`

const DetailsColumn = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	background-color: rgba(255, 255, 255, 0.035);
	border-radius: 0.75rem;
	padding: 0.875rem;
`

const StatusPillWrap = styled.div`
	position: relative;
	display: inline-flex;
	align-items: center;
`

const StatusPillSelect = styled.select<{ $color: string; $widthCh: number }>`
	width: ${(props) => `${props.$widthCh}ch`};
	padding: 0.28rem 1.65rem 0.28rem 0.72rem;
	border-radius: 999px;
	font-size: 0.75rem;
	font-weight: 600;
	text-transform: capitalize;
	white-space: nowrap;
	text-align: center;
	text-align-last: center;
	font-family: inherit;
	color: ${(props) => props.$color};
	background-color: ${(props) => props.$color}22;
	border: 1px solid ${(props) => props.$color}44;
	cursor: pointer;
	appearance: none !important;
	-webkit-appearance: none !important;
	-moz-appearance: none !important;
	background-image: none;
	line-height: 1.15;
	transition:
		background-color 0.2s ease,
		border-color 0.2s ease,
		box-shadow 0.2s ease;

	&:hover:not(:disabled) {
		background-color: ${(props) => props.$color}2c;
		border-color: ${(props) => props.$color}66;
	}

	&:focus-visible {
		outline: none;
		box-shadow: 0 0 0 2px ${(props) => props.$color}55;
	}

	&:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	&::-ms-expand {
		display: none;
	}

	option {
		background-color: #1a1a2e;
		color: var(--foreground);
	}
`

const StatusChevron = styled.span<{ $color: string }>`
	position: absolute;
	right: 0.62rem;
	top: 50%;
	transform: translateY(-58%) rotate(45deg);
	width: 0.5rem;
	height: 0.5rem;
	border-right: 2px solid ${(props) => props.$color};
	border-bottom: 2px solid ${(props) => props.$color};
	pointer-events: none;
`

const MetaRow = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
	gap: 0.75rem;
	background-color: rgba(var(--foreground-rgb), 0.03);
	border-radius: 0.75rem;
	padding: 0.75rem;

	@media (max-width: 900px) {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	@media (max-width: 560px) {
		grid-template-columns: 1fr;
	}
`

const MetaItem = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.125rem;
`

const MetaLabel = styled.span`
	font-size: 0.6875rem;
	font-weight: 600;
	color: rgba(var(--foreground-rgb), 0.5);
	text-transform: uppercase;
	letter-spacing: 0.05em;
`

const MetaValue = styled.span`
	font-size: 0.875rem;
	color: rgba(var(--foreground-rgb), 0.9);
	display: flex;
	align-items: center;
	gap: 0.5rem;
`

const HandleLink = styled.a`
	color: rgba(156, 163, 255, 0.9);
	text-decoration: none;
	font-size: 0.8125rem;

	&:hover {
		text-decoration: underline;
	}
`

const Synopsis = styled.p`
	color: rgba(var(--foreground-rgb), 0.7);
	font-size: 0.875rem;
	line-height: 1.6;
	margin: 0;
	white-space: pre-wrap;
`

const SlidesInfo = styled.div`
	font-size: 0.8125rem;
	color: rgba(var(--foreground-rgb), 0.5);
`

const SlidesLink = styled.a`
	color: rgba(156, 163, 255, 0.9);
	text-decoration: none;
	word-break: break-all;

	&:hover {
		text-decoration: underline;
	}
`

const SlidesDownloadButton = styled.button`
	background: none;
	border: none;
	padding: 0;
	color: rgba(156, 163, 255, 0.9);
	font-size: 0.8125rem;
	font-family: inherit;
	text-decoration: underline;
	cursor: pointer;

	&:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		text-decoration: none;
	}

	&:hover:not(:disabled) {
		color: rgba(156, 163, 255, 1);
	}
`

const ErrorMessage = styled.div`
	color: #ff6b6b;
	background-color: rgba(255, 107, 107, 0.1);
	padding: 0.75rem;
	border-radius: 0.5rem;
	font-size: 0.875rem;
	text-align: center;
`

const EmptyState = styled.div`
	text-align: center;
	color: rgba(var(--foreground-rgb), 0.5);
	padding: 3rem;
	font-size: 1rem;
`

const LoadingText = styled.div`
	color: var(--foreground);
	font-size: 1.25rem;
	text-align: center;
	margin-top: 4rem;
`
