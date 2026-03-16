"use client"
import styled from "styled-components"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabaseClient } from "../../lib/supabaseClient"
import { PotionBackground } from "../components/PotionBackground"
import { Nametag } from "../components/Nametag"

type ProfileListItem = {
	id: number
	handle: string
	fullName: string
	title: string | null
	affiliation: string | null
	profilePhoto: string | null
	photoHash: string | null
}

const PAGE_SIZE = 20

export function ProfileList() {
	const router = useRouter()
	const [loading, setLoading] = useState(true)
	const [loadingMore, setLoadingMore] = useState(false)
	const [profiles, setProfiles] = useState<ProfileListItem[]>([])
	const [page, setPage] = useState(0)
	const [hasMore, setHasMore] = useState(true)

	const loadProfiles = async (pageNum: number, append: boolean = false) => {
		try {
			if (append) {
				setLoadingMore(true)
			}

			const from = pageNum * PAGE_SIZE
			const to = from + PAGE_SIZE - 1

			const { data: profilesData, error } = await supabaseClient
				.from("profiles")
				.select("id, handle, full_name, title, affiliation, profile_photo, photo_id")
				.not("handle", "is", null)
				.order("full_name", { ascending: true })
				.range(from, to)

			if (error) {
				console.error("Error fetching profiles:", error)
				if (!append) {
					setLoading(false)
				} else {
					setLoadingMore(false)
				}
				return
			}

			const formattedProfiles: ProfileListItem[] =
				profilesData?.map((profile: any) => ({
					id: profile.id,
					handle: profile.handle,
					fullName: profile.full_name,
					title: profile.title,
					affiliation: profile.affiliation,
					profilePhoto: profile.profile_photo,
					photoHash: profile.photo_id || null
				})) || []

			if (append) {
				setProfiles((prev) => [...prev, ...formattedProfiles])
			} else {
				setProfiles(formattedProfiles)
			}

			// Check if there are more profiles to load
			setHasMore(formattedProfiles.length === PAGE_SIZE)
		} catch (error) {
			console.error("Error loading profiles:", error)
		} finally {
			if (append) {
				setLoadingMore(false)
			} else {
				setLoading(false)
			}
		}
	}

	useEffect(() => {
		loadProfiles(0, false)
	}, [])

	useEffect(() => {
		const handleScroll = () => {
			// Check if user is near bottom of page
			const scrollTop = window.scrollY || document.documentElement.scrollTop
			const windowHeight = window.innerHeight
			const documentHeight = document.documentElement.scrollHeight

			// Load more when within 200px of bottom
			if (scrollTop + windowHeight >= documentHeight - 200) {
				if (hasMore && !loadingMore && !loading) {
					const nextPage = page + 1
					setPage(nextPage)
					loadProfiles(nextPage, true)
				}
			}
		}

		window.addEventListener("scroll", handleScroll)
		return () => window.removeEventListener("scroll", handleScroll)
	}, [hasMore, loadingMore, loading, page])

	const handleProfileClick = (handle: string) => {
		router.push(`/whois?${handle}`)
	}

	// No-op handlers for Nametag (read-only in list)
	const handleSave = async () => {}
	const handleImageUpload = async () => ""

	if (loading) {
		return (
			<>
				<BackgroundContainer>
					<PotionBackground />
				</BackgroundContainer>
				<Container>
					<LoadingText>Loading profiles...</LoadingText>
				</Container>
			</>
		)
	}

	return (
		<>
			<BackgroundContainer>
				<PotionBackground />
			</BackgroundContainer>
			<Container>
				<ContentWrapper>
					<Title>All Members</Title>
					{profiles.length === 0 ? (
						<EmptyState>No profiles found</EmptyState>
					) : (
						<>
							<ProfileListContainer>
								{profiles.map((profile) => (
									<ProfileListItem
										key={profile.id}
										onClick={() => handleProfileClick(profile.handle)}
									>
										<Nametag
											data={{
												fullName: profile.fullName,
												title: profile.title || "",
												affiliation: profile.affiliation || "",
												profilePhoto: profile.profilePhoto || "",
												photoHash: profile.photoHash
											}}
											onSave={handleSave}
											onImageUpload={handleImageUpload}
											readOnly={true}
										/>
									</ProfileListItem>
								))}
							</ProfileListContainer>
							{loadingMore && <LoadingMoreText>Loading more members...</LoadingMoreText>}
						</>
					)}
				</ContentWrapper>
			</Container>
		</>
	)
}

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
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
	padding: 2rem;
`

const ContentWrapper = styled.div`
	width: 100%;
	max-width: 700px;
	display: flex;
	flex-direction: column;
	gap: 2rem;
`

const Title = styled.h1`
	color: white;
	font-size: 2.5rem;
	font-weight: 700;
	margin: 0;
	text-align: center;
`

const EmptyState = styled.div`
	color: rgba(255, 255, 255, 0.7);
	font-size: 1.25rem;
	text-align: center;
	padding: 4rem 0;
`

const ProfileListContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 2rem;
	width: 100%;
`

const ProfileListItem = styled.div`
	cursor: pointer;
	transition: opacity 0.2s ease;

	&:hover {
		opacity: 0.8;
	}
`

const LoadingText = styled.div`
	color: white;
	font-size: 1.2rem;
`

const LoadingMoreText = styled.div`
	color: rgba(255, 255, 255, 0.7);
	font-size: 1rem;
	text-align: center;
	padding: 2rem 0;
`
