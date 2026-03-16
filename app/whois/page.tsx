"use client"
import styled from "styled-components"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabaseClient } from "../../lib/supabaseClient"
import { PotionBackground } from "../components/PotionBackground"
import { ProfileDisplay } from "./ProfileDisplay"
import { ProfileNotFound } from "./ProfileNotFound"
import { ProfileList } from "./ProfileList"

type ProfileData = {
	id: number
	fullName: string
	email: string
	title: string
	affiliation: string
	profilePhoto: string
	photoHash: string | null
	interests: Tag[]
	skills: Tag[]
	links: Link[]
}

type Tag = {
	id: number
	name: string
	approved: boolean
	sort_order?: number
}

type Link = {
	id: number
	url: string
}

export default function Who() {
	const router = useRouter()

	const [loading, setLoading] = useState(true)
	const [handle, setHandle] = useState<string>("")
	const [profileId, setProfileId] = useState<number | null>(null)
	const [profile, setProfile] = useState<ProfileData | null>(null)
	const [isOwner, setIsOwner] = useState(false)
	const [email, setEmail] = useState("")
	const [notFound, setNotFound] = useState(false)

	// Extract handle from URL
	const getHandleFromUrl = () => {
		if (typeof window === "undefined") return ""
		const search = window.location.search
		if (search.startsWith("?")) {
			const firstParam = search.substring(1).split("&")[0]
			// Handle cases like "sam=" by splitting on = and taking the part before it
			return firstParam.split("=")[0]
		}
		return ""
	}

	useEffect(() => {
		const loadProfile = async () => {
			// Extract handle from query string
			// Format: /whois?sam or /whois?sam&other=params
			const extractedHandle = getHandleFromUrl()

			// Reset state when handle changes
			if (extractedHandle !== handle) {
				setNotFound(false)
				setProfile(null)
				setProfileId(null)
				setIsOwner(false)
				setLoading(true)
				setHandle(extractedHandle)
			}

			if (!extractedHandle) {
				// No handle provided, show profile list
				setLoading(false)
				return
			}

			// Clean up OAuth callback tokens from URL
			if (typeof window !== "undefined") {
				const hashParams = new URLSearchParams(window.location.hash.substring(1))
				if (hashParams.get("access_token") || hashParams.get("error")) {
					window.history.replaceState(null, "", window.location.pathname + window.location.search)
				}
			}

			// Get current user (if authenticated)
			const {
				data: { user }
			} = await supabaseClient.auth.getUser()

			if (user) {
				setEmail(user.email || "")
			}

			// Load profile by handle
			const { data: profileData, error: profileError } = await supabaseClient
				.from("profiles")
				.select("*")
				.eq("handle", extractedHandle.toLowerCase())
				.single()

			if (profileError) {
				if (profileError.code === "PGRST116") {
					// Profile not found - show 404
					setNotFound(true)
					setLoading(false)
					return
				}
				console.error("Error fetching profile:", profileError)
				setLoading(false)
				return
			}

			if (profileData) {
				setProfileId(profileData.id)

				// Check if current user is the owner
				const owner = user && user.id === profileData.user_id
				setIsOwner(owner || false)

				// Load interests
				const { data: interestsData } = await supabaseClient
					.from("profile_interests")
					.select(
						`
						interest_id,
						sort_order,
						interests (
							id,
							name,
							approved
						)
					`
					)
					.eq("profile_id", profileData.id)
					.order("sort_order", { ascending: true })

				const interests: Tag[] =
					interestsData?.map((item: any) => ({
						id: item.interests.id,
						name: item.interests.name,
						approved: item.interests.approved,
						sort_order: item.sort_order
					})) || []

				// Load skills
				const { data: skillsData } = await supabaseClient
					.from("profile_skills")
					.select(
						`
						skill_id,
						sort_order,
						skills (
							id,
							name,
							approved
						)
					`
					)
					.eq("profile_id", profileData.id)
					.order("sort_order", { ascending: true })

				const skills: Tag[] =
					skillsData?.map((item: any) => ({
						id: item.skills.id,
						name: item.skills.name,
						approved: item.skills.approved,
						sort_order: item.sort_order
					})) || []

				// Load links
				const { data: linksData } = await supabaseClient
					.from("profile_links")
					.select("id, url")
					.eq("profile_id", profileData.id)
					.order("created_at", { ascending: true })

				const links: Link[] =
					linksData?.map((item: any) => ({
						id: item.id,
						url: item.url
					})) || []

				setProfile({
					id: profileData.id,
					fullName: profileData.full_name,
					email: profileData.email,
					title: profileData.title || "",
					affiliation: profileData.affiliation || "",
					profilePhoto: profileData.profile_photo || "",
					photoHash: profileData.photo_id || null,
					interests,
					skills,
					links
				})
			}
			setLoading(false)
		}

		loadProfile()

		// Listen for URL changes
		const handleUrlChange = () => {
			const newHandle = getHandleFromUrl()
			if (newHandle !== handle) {
				setHandle(newHandle)
				loadProfile()
			}
		}

		// Check URL periodically to catch router.push() changes
		const intervalId = setInterval(() => {
			const currentHandle = getHandleFromUrl()
			if (currentHandle !== handle) {
				handleUrlChange()
			}
		}, 100)

		window.addEventListener("popstate", handleUrlChange)

		return () => {
			clearInterval(intervalId)
			window.removeEventListener("popstate", handleUrlChange)
		}
	}, [router, handle])

	if (loading) {
		return (
			<>
				<BackgroundContainer>
					<PotionBackground />
				</BackgroundContainer>
				<Container>
					<LoadingText>Loading...</LoadingText>
				</Container>
			</>
		)
	}

	// If no handle, show profile list
	if (!handle) {
		return <ProfileList />
	}

	if (notFound) {
		return <ProfileNotFound />
	}

	if (!profile || !profileId) {
		return null
	}

	return (
		<ProfileDisplay
			profile={profile}
			profileId={profileId}
			isOwner={isOwner}
			email={email}
			onProfileUpdate={setProfile}
		/>
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

const LoadingText = styled.div`
	color: white;
	font-size: 1.2rem;
`
