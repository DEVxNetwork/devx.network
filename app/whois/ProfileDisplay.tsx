"use client"
import styled from "styled-components"
import { useState } from "react"
import { supabaseClient } from "../../lib/supabaseClient"
import { updateProfileCache } from "../../lib/profileCache"
import { PotionBackground } from "../components/PotionBackground"
import { Nametag } from "../components/Nametag"
import { TagCloudSection } from "../components/TagCloudSection"
import { LinkCloudSection } from "../components/LinkCloudSection"

type ProfileData = {
	id: number
	fullName: string
	email: string
	title: string
	affiliation: string
	profilePhoto: string
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

type NametagData = {
	fullName: string
	title: string
	affiliation: string
	profilePhoto: string
}

type ProfileDisplayProps = {
	profile: ProfileData
	profileId: number
	isOwner: boolean
	email: string
	onProfileUpdate: (updatedProfile: ProfileData) => void
}

export function ProfileDisplay({
	profile,
	profileId,
	isOwner,
	email,
	onProfileUpdate
}: ProfileDisplayProps) {
	const [saving, setSaving] = useState(false)
	const [uploading, setUploading] = useState(false)

	const handleImageUpload = async (file: File): Promise<string> => {
		setUploading(true)

		try {
			const fileExt = file.name.split(".").pop()
			const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
			const filePath = `${fileName}`

			const { error: uploadError } = await supabaseClient.storage
				.from("avatars")
				.upload(filePath, file)

			if (uploadError) throw uploadError

			const {
				data: { publicUrl }
			} = supabaseClient.storage.from("avatars").getPublicUrl(filePath)

			return publicUrl
		} catch (error: any) {
			console.error("Error uploading image:", error)
			throw error
		} finally {
			setUploading(false)
		}
	}

	const saveTags = async (tags: Tag[], tableName: "interests" | "skills", profileId: number) => {
		const junctionTable = tableName === "interests" ? "profile_interests" : "profile_skills"
		const foreignKey = tableName === "interests" ? "interest_id" : "skill_id"

		// Delete existing links
		await supabaseClient.from(junctionTable).delete().eq("profile_id", profileId)

		if (tags.length === 0) return

		// Get or create tags and collect their IDs
		const tagIds: number[] = []

		for (const tag of tags) {
			let tagId = tag.id

			// If tag has a temporary ID (negative or very large), it's new - create it
			if (tag.id > 1000000000 || tag.id < 0) {
				// Check if tag already exists by name
				const { data: existing } = await supabaseClient
					.from(tableName)
					.select("id")
					.eq("name", tag.name)
					.single()

				if (existing) {
					tagId = existing.id
				} else {
					// Create new tag (not approved)
					const { data: newTag, error } = await supabaseClient
						.from(tableName)
						.insert({ name: tag.name, approved: false })
						.select("id")
						.single()

					if (error) throw error
					tagId = newTag.id
				}
			}

			tagIds.push(tagId)
		}

		// Create links with sort_order
		if (tagIds.length > 0) {
			const links = tagIds.map((tagId, index) => ({
				profile_id: profileId,
				[foreignKey]: tagId,
				sort_order: tags[index]?.sort_order ?? index
			}))

			const { error } = await supabaseClient.from(junctionTable).insert(links)
			if (error) throw error
		}
	}

	const handleSave = async (data: NametagData) => {
		if (!isOwner) return

		if (!data.profilePhoto) {
			return
		}

		setSaving(true)

		try {
			const {
				data: { user }
			} = await supabaseClient.auth.getUser()

			if (!user) throw new Error("User not authenticated")

			const profileDataToSave = {
				email: email,
				full_name: data.fullName,
				profile_photo: data.profilePhoto,
				title: data.title,
				affiliation: data.affiliation
			}

			if (profileId) {
				const { error } = await supabaseClient
					.from("profiles")
					.update(profileDataToSave)
					.eq("id", profileId)
				if (error) throw error

				// Reload profile
				const { data: profileData } = await supabaseClient
					.from("profiles")
					.select("*")
					.eq("id", profileId)
					.single()

				if (profileData) {
					// Update cache with latest profile info
					await updateProfileCache(profileData.handle || null, profileData.profile_photo || null)
					// Reload interests and skills
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
						.eq("profile_id", profileId)
						.order("sort_order", { ascending: true })

					const interests: Tag[] =
						interestsData?.map((item: any) => ({
							id: item.interests.id,
							name: item.interests.name,
							approved: item.interests.approved,
							sort_order: item.sort_order
						})) || []

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
						.eq("profile_id", profileId)
						.order("sort_order", { ascending: true })

					const skills: Tag[] =
						skillsData?.map((item: any) => ({
							id: item.skills.id,
							name: item.skills.name,
							approved: item.skills.approved,
							sort_order: item.sort_order
						})) || []

					// Reload links
					const { data: linksData } = await supabaseClient
						.from("profile_links")
						.select("id, url")
						.eq("profile_id", profileId)
						.order("created_at", { ascending: true })

					const links: Link[] =
						linksData?.map((item: any) => ({
							id: item.id,
							url: item.url
						})) || []

					onProfileUpdate({
						id: profileData.id,
						fullName: profileData.full_name,
						email: profileData.email,
						title: profileData.title || "",
						affiliation: profileData.affiliation || "",
						profilePhoto: profileData.profile_photo || "",
						interests,
						skills,
						links
					})
				}
			}
		} catch (err: any) {
			throw err
		} finally {
			setSaving(false)
		}
	}

	const handleSaveInterests = async (tags: Tag[]) => {
		if (!profileId || !isOwner) return

		await saveTags(tags, "interests", profileId)

		// Reload interests
		const { data: interestsData } = await supabaseClient
			.from("profile_interests")
			.select(
				`
				interest_id,
				interests (
					id,
					name,
					approved
				)
			`
			)
			.eq("profile_id", profileId)

		const interests: Tag[] =
			interestsData?.map((item: any) => ({
				id: item.interests.id,
				name: item.interests.name,
				approved: item.interests.approved
			})) || []

		onProfileUpdate({ ...profile, interests })
	}

	const handleSaveSkills = async (tags: Tag[]) => {
		if (!profileId || !isOwner) return

		await saveTags(tags, "skills", profileId)

		// Reload skills
		const { data: skillsData } = await supabaseClient
			.from("profile_skills")
			.select(
				`
				skill_id,
				skills (
					id,
					name,
					approved
				)
			`
			)
			.eq("profile_id", profileId)

		const skills: Tag[] =
			skillsData?.map((item: any) => ({
				id: item.skills.id,
				name: item.skills.name,
				approved: item.skills.approved
			})) || []

		onProfileUpdate({ ...profile, skills })
	}

	const handleSaveLinks = async (links: Link[]) => {
		if (!profileId || !isOwner) return

		// Delete existing links
		await supabaseClient.from("profile_links").delete().eq("profile_id", profileId)

		// Insert new links
		if (links.length > 0) {
			const linksToInsert = links.map((link) => ({
				profile_id: profileId,
				url: link.url
			}))

			const { error } = await supabaseClient.from("profile_links").insert(linksToInsert)
			if (error) throw error
		}

		// Reload links
		const { data: linksData } = await supabaseClient
			.from("profile_links")
			.select("id, url")
			.eq("profile_id", profileId)
			.order("created_at", { ascending: true })

		const updatedLinks: Link[] =
			linksData?.map((item: any) => ({
				id: item.id,
				url: item.url
			})) || []

		onProfileUpdate({ ...profile, links: updatedLinks })
	}

	const nametagData: NametagData = {
		fullName: profile.fullName,
		title: profile.title,
		affiliation: profile.affiliation,
		profilePhoto: profile.profilePhoto
	}

	return (
		<>
			<BackgroundContainer>
				<PotionBackground />
			</BackgroundContainer>
			<Container>
				<ContentWrapper>
					<Nametag
						data={nametagData}
						onSave={handleSave}
						onImageUpload={handleImageUpload}
						uploading={uploading}
						saving={saving}
						initialEditing={false}
						readOnly={!isOwner}
					/>
					<LinkCloudSection
						title="Links"
						selectedLinks={profile.links || []}
						onLinksChange={handleSaveLinks}
						profileId={profileId}
						disabled={!isOwner}
					/>
					<TagCloudSection
						title="Interests"
						selectedTags={profile.interests || []}
						onTagsChange={handleSaveInterests}
						tableName="interests"
						profileId={profileId}
						disabled={!isOwner}
					/>
					<TagCloudSection
						title="Skills"
						selectedTags={profile.skills || []}
						onTagsChange={handleSaveSkills}
						tableName="skills"
						profileId={profileId}
						disabled={!isOwner}
					/>
				</ContentWrapper>
			</Container>
		</>
	)
}

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
