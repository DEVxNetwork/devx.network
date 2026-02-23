"use client"
import styled from "styled-components"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { supabaseClient } from "../../../lib/supabaseClient"
import { checkIsAdmin } from "../../../lib/adminCheck"
import { PotionBackground } from "../../components/PotionBackground"
import { Button } from "../../components/Button"

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
		handle: string | null
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
	const router = useRouter()
	const [loading, setLoading] = useState(true)
	const [isAdmin, setIsAdmin] = useState(false)
	const [talks, setTalks] = useState<TalkSubmission[]>([])
	const [filterStatus, setFilterStatus] = useState<TalkStatus | "all">("all")
	const [updatingId, setUpdatingId] = useState<number | null>(null)
	const [error, setError] = useState<string | null>(null)

	const fetchTalks = useCallback(async () => {
		let query = supabaseClient
			.from("talk_submissions")
			.select(
				`
				id,
				talk_title,
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
					handle
				)
			`
			)
			.order("created_at", { ascending: false })

		if (filterStatus !== "all") {
			query = query.eq("status", filterStatus)
		}

		const { data, error: fetchError } = await query

		if (fetchError) {
			setError(fetchError.message)
			return
		}

		setTalks((data as unknown as TalkSubmission[]) || [])
	}, [filterStatus])

	useEffect(() => {
		const init = async () => {
			const {
				data: { user }
			} = await supabaseClient.auth.getUser()

			if (!user) {
				router.push("/login?redirect=%2Fadmin%2Ftalks")
				return
			}

			const admin = await checkIsAdmin()
			if (!admin) {
				router.push("/")
				return
			}

			setIsAdmin(true)
			setLoading(false)
		}

		init()
	}, [router])

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
							{filterStatus !== "all" ? ` (${filterStatus})` : ""}
						</Subtitle>
					</PageHeader>

					{error && <ErrorMessage>{error}</ErrorMessage>}

					<FilterBar>
						<FilterLabel>Filter by status:</FilterLabel>
						<FilterButtons>
							<FilterButton $active={filterStatus === "all"} onClick={() => setFilterStatus("all")}>
								All
							</FilterButton>
							{TALK_STATUSES.map((status) => (
								<FilterButton
									key={status}
									$active={filterStatus === status}
									$color={STATUS_COLORS[status]}
									onClick={() => setFilterStatus(status)}
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
										<StatusBadge $color={STATUS_COLORS[talk.status]}>
											{talk.status.replace("_", " ")}
										</StatusBadge>
									</CardHeader>

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
											<MetaLabel>Submitted</MetaLabel>
											<MetaValue>{formatDate(talk.created_at)}</MetaValue>
										</MetaItem>
										<MetaItem>
											<MetaLabel>Updated</MetaLabel>
											<MetaValue>{formatDate(talk.updated_at)}</MetaValue>
										</MetaItem>
									</MetaRow>

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
											{talk.slides_file_path && <> — {talk.slides_file_path}</>}
										</SlidesInfo>
									)}

									<CardActions>
										<ActionLabel>Change status:</ActionLabel>
										<StatusSelect
											value={talk.status}
											onChange={(e) => handleStatusChange(talk.id, e.target.value as TalkStatus)}
											disabled={updatingId === talk.id}
										>
											{TALK_STATUSES.map((s) => (
												<option key={s} value={s}>
													{s.replace("_", " ")}
												</option>
											))}
										</StatusSelect>
										{updatingId === talk.id && <UpdatingText>Saving...</UpdatingText>}
									</CardActions>
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
	background-color: #0a0a0a;
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
	color: white;
	margin: 0;
`

const Subtitle = styled.p`
	color: rgba(255, 255, 255, 0.6);
	margin: 0.5rem 0 0 0;
`

const FilterBar = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
`

const FilterLabel = styled.span`
	color: rgba(255, 255, 255, 0.7);
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
		${(props) => (props.$active ? props.$color || "white" : "rgba(255, 255, 255, 0.2)")};
	background-color: ${(props) =>
		props.$active ? (props.$color || "white") + "22" : "transparent"};
	color: ${(props) => (props.$active ? props.$color || "white" : "rgba(255, 255, 255, 0.6)")};

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
	background-color: rgba(21, 21, 28, 0.75);
	backdrop-filter: blur(10px);
	border: 1px solid rgba(255, 255, 255, 0.1);
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
	color: white;
	margin: 0;
	flex: 1;
`

const StatusBadge = styled.span<{ $color: string }>`
	padding: 0.25rem 0.625rem;
	border-radius: 1rem;
	font-size: 0.75rem;
	font-weight: 600;
	text-transform: capitalize;
	white-space: nowrap;
	color: ${(props) => props.$color};
	background-color: ${(props) => props.$color}22;
	border: 1px solid ${(props) => props.$color}44;
`

const MetaRow = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
	gap: 0.75rem;
`

const MetaItem = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.125rem;
`

const MetaLabel = styled.span`
	font-size: 0.6875rem;
	font-weight: 600;
	color: rgba(255, 255, 255, 0.5);
	text-transform: uppercase;
	letter-spacing: 0.05em;
`

const MetaValue = styled.span`
	font-size: 0.875rem;
	color: rgba(255, 255, 255, 0.9);
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
	color: rgba(255, 255, 255, 0.7);
	font-size: 0.875rem;
	line-height: 1.6;
	margin: 0;
	white-space: pre-wrap;
`

const SlidesInfo = styled.div`
	font-size: 0.8125rem;
	color: rgba(255, 255, 255, 0.5);
`

const SlidesLink = styled.a`
	color: rgba(156, 163, 255, 0.9);
	text-decoration: none;
	word-break: break-all;

	&:hover {
		text-decoration: underline;
	}
`

const CardActions = styled.div`
	display: flex;
	align-items: center;
	gap: 0.75rem;
	padding-top: 0.75rem;
	border-top: 1px solid rgba(255, 255, 255, 0.1);
`

const ActionLabel = styled.span`
	font-size: 0.8125rem;
	color: rgba(255, 255, 255, 0.6);
	white-space: nowrap;
`

const StatusSelect = styled.select`
	padding: 0.375rem 0.75rem;
	border-radius: 0.375rem;
	background-color: rgba(255, 255, 255, 0.1);
	border: 1px solid rgba(255, 255, 255, 0.2);
	color: white;
	font-size: 0.8125rem;
	font-family: inherit;
	cursor: pointer;
	text-transform: capitalize;

	&:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	option {
		background-color: #1a1a2e;
		color: white;
	}
`

const UpdatingText = styled.span`
	font-size: 0.75rem;
	color: rgba(255, 255, 255, 0.5);
	font-style: italic;
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
	color: rgba(255, 255, 255, 0.5);
	padding: 3rem;
	font-size: 1rem;
`

const LoadingText = styled.div`
	color: white;
	font-size: 1.25rem;
	text-align: center;
	margin-top: 4rem;
`
