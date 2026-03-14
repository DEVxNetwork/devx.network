"use client"
import styled from "styled-components"
import { useState, useRef, useCallback, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { supabaseClient } from "../../lib/supabaseClient"
import { TalkThumbnail } from "../components/TalkThumbnail"
import { TextInput } from "../components/TextInput"
import { Button } from "../components/Button"
import { PotionBackground } from "../components/PotionBackground"
import { PageContainer } from "../components/PageContainer"

//
// Constants
//

const THUMBNAIL_WIDTH = 1280
const THUMBNAIL_HEIGHT = 720

//
// Components
//

export default function TalkThumbnailGen() {
	const searchParams = useSearchParams()
	const [hook, setHook] = useState("")
	const [speakerName, setSpeakerName] = useState("")
	const [handle, setHandle] = useState("")
	const [photoUrl, setPhotoUrl] = useState<string | null>(null)
	const [photoSource, setPhotoSource] = useState<"none" | "upload" | "handle" | "url">("none")
	const [handleLoading, setHandleLoading] = useState(false)
	const [handleError, setHandleError] = useState<string | null>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)
	const svgContainerRef = useRef<HTMLDivElement>(null)
	const didApplyQueryPrefill = useRef(false)

	// Revoke upload blob URL on unmount to prevent memory leaks
	useEffect(() => {
		return () => {
			if (photoUrl && photoSource === "upload") {
				URL.revokeObjectURL(photoUrl)
			}
		}
	}, [photoUrl, photoSource])

	useEffect(() => {
		if (didApplyQueryPrefill.current) return

		const hookFromUrl = searchParams.get("hook")
		const speakerNameFromUrl = searchParams.get("speakerName")
		const handleFromUrl = searchParams.get("handle")
		const profilePhotoUrlFromUrl = searchParams.get("profilePhotoUrl")

		if (hookFromUrl) {
			setHook(hookFromUrl)
		}
		if (speakerNameFromUrl) {
			setSpeakerName(speakerNameFromUrl)
		}
		if (handleFromUrl) {
			setHandle(handleFromUrl)
		}
		if (profilePhotoUrlFromUrl) {
			setPhotoUrl(profilePhotoUrlFromUrl)
			setPhotoSource("url")
		}

		didApplyQueryPrefill.current = true
	}, [searchParams])

	const handleFileUpload = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0]
			if (!file) return

			if (photoUrl && photoSource === "upload") {
				URL.revokeObjectURL(photoUrl)
			}

			const blobUrl = URL.createObjectURL(file)
			setPhotoUrl(blobUrl)
			setPhotoSource("upload")
			setHandle("")
			setHandleError(null)
		},
		[photoUrl, photoSource]
	)

	const handleLookup = useCallback(async () => {
		if (!handle.trim()) return

		setHandleLoading(true)
		setHandleError(null)

		try {
			const { data: profile, error } = await supabaseClient
				.from("profiles")
				.select("full_name, profile_photo")
				.eq("handle", handle.trim().toLowerCase())
				.single()

			if (error || !profile) {
				setHandleError(`No profile found for @${handle.trim()}`)
				return
			}

			if (profile.profile_photo) {
				if (photoUrl && photoSource === "upload") {
					URL.revokeObjectURL(photoUrl)
				}
				setPhotoUrl(profile.profile_photo)
				setPhotoSource("handle")
				// Clear stale file input so re-selecting the same file triggers onChange
				if (fileInputRef.current) {
					fileInputRef.current.value = ""
				}
			} else {
				setHandleError(`@${handle.trim()} has no profile photo`)
			}
		} catch {
			setHandleError("Failed to look up profile")
		} finally {
			setHandleLoading(false)
		}
	}, [handle, photoUrl, photoSource])

	const clearPhoto = useCallback(() => {
		if (photoUrl && photoSource === "upload") {
			URL.revokeObjectURL(photoUrl)
		}
		setPhotoUrl(null)
		setPhotoSource("none")
		if (fileInputRef.current) {
			fileInputRef.current.value = ""
		}
	}, [photoUrl, photoSource])

	const downloadRaster = useCallback(
		async (format: "png" | "jpg") => {
			const svgEl = svgContainerRef.current?.querySelector("svg")
			if (!svgEl) return

			const svgString = await buildEmbeddedSvgString(svgEl)
			const svgBlob = new Blob([svgString], { type: "image/svg+xml" })
			const svgBlobUrl = URL.createObjectURL(svgBlob)

			const img = new Image()
			img.width = THUMBNAIL_WIDTH
			img.height = THUMBNAIL_HEIGHT

			img.onload = () => {
				const canvas = document.createElement("canvas")
				canvas.width = THUMBNAIL_WIDTH
				canvas.height = THUMBNAIL_HEIGHT
				const ctx = canvas.getContext("2d")
				if (!ctx) {
					URL.revokeObjectURL(svgBlobUrl)
					return
				}

				// JPG has no transparency — fill white first
				if (format === "jpg") {
					ctx.fillStyle = "#000000"
					ctx.fillRect(0, 0, THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT)
				}

				ctx.drawImage(img, 0, 0, THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT)
				URL.revokeObjectURL(svgBlobUrl)

				const mimeType = format === "jpg" ? "image/jpeg" : "image/png"
				// Quality 0.92 for JPG keeps it well under 2 MB
				const quality = format === "jpg" ? 0.92 : undefined

				canvas.toBlob(
					(blob) => {
						if (!blob) return
						const url = URL.createObjectURL(blob)
						const a = document.createElement("a")
						a.href = url
						a.download = makeFilename(hook, format)
						a.click()
						URL.revokeObjectURL(url)
					},
					mimeType,
					quality
				)
			}

			img.onerror = () => {
				URL.revokeObjectURL(svgBlobUrl)
			}

			img.src = svgBlobUrl
		},
		[hook]
	)

	return (
		<>
			<BackgroundContainer>
				<PotionBackground />
			</BackgroundContainer>
			<Container>
				<WidePageContainer>
					<Title>Talk Thumbnail Generator</Title>
					<Subtitle>Create a YouTube thumbnail for your DEVx talk</Subtitle>

					<FormSection>
						<Field>
							<Label htmlFor="hook">Hook</Label>
							<TextInput
								id="hook"
								type="text"
								variant="secondary"
								size="default"
								value={hook}
								onChange={(e) => setHook(e.target.value)}
								placeholder="Enter the thumbnail hook text"
								maxLength={50}
							/>
						</Field>

						<PhotoRow>
							<Field>
								<Label htmlFor="photoUpload">Upload Photo</Label>
								<FileInput
									id="photoUpload"
									type="file"
									accept="image/*"
									ref={fileInputRef}
									onChange={handleFileUpload}
								/>
							</Field>

							<OrDivider>or</OrDivider>

							<Field>
								<Label htmlFor="handle">Nametag Handle</Label>
								<HandleRow>
									<HandlePrefix>@</HandlePrefix>
									<TextInput
										id="handle"
										type="text"
										variant="secondary"
										size="default"
										value={handle}
										onChange={(e) => setHandle(e.target.value)}
										placeholder="username"
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												e.preventDefault()
												handleLookup()
											}
										}}
									/>
									<Button
										type="button"
										variant="secondary"
										size="small"
										onClick={handleLookup}
										disabled={handleLoading || !handle.trim()}
									>
										{handleLoading ? "..." : "Look up"}
									</Button>
								</HandleRow>
								{handleError && <ErrorText>{handleError}</ErrorText>}
							</Field>
						</PhotoRow>

						{photoUrl && (
							<PhotoStatusRow>
								<PhotoStatus>
									Photo loaded
									{photoSource === "handle"
										? ` from @${handle}`
										: photoSource === "upload"
											? " from upload"
											: " from URL"}
								</PhotoStatus>
								<Button type="button" variant="tertiary" size="small" onClick={clearPhoto}>
									Clear photo
								</Button>
							</PhotoStatusRow>
						)}
					</FormSection>

					<Preview ref={svgContainerRef}>
						<TalkThumbnail
							hook={hook || "Your Hook"}
							speakerName={speakerName}
							profilePhotoUrl={photoUrl || undefined}
							width={THUMBNAIL_WIDTH}
						/>
					</Preview>

					<DownloadRow>
						<Button
							type="button"
							variant="primary"
							size="default"
							onClick={() => downloadRaster("png")}
						>
							Download PNG
						</Button>
						<Button
							type="button"
							variant="secondary"
							size="default"
							onClick={() => downloadRaster("jpg")}
						>
							Download JPG
						</Button>
					</DownloadRow>
					<SpecNote>1280 x 720 px &middot; under 2 MB &middot; YouTube ready</SpecNote>
				</WidePageContainer>
			</Container>
		</>
	)
}

//
// Styled Components
//

const BackgroundContainer = styled.section`
	background-color: #0a0a0a;
	position: fixed;
	height: 100vh;
	width: 100vw;
	top: 0;
	left: 0;
	z-index: -1;
`

const WidePageContainer = styled(PageContainer)`
	max-width: 960px;
`

const Container = styled.main`
	min-height: 100vh;
	display: flex;
	align-items: flex-start;
	justify-content: center;
	padding: 2rem 1rem;
`

const Title = styled.h1`
	font-size: 2rem;
	font-weight: 700;
	color: white;
	margin: 0;
	text-align: center;
`

const Subtitle = styled.p`
	color: rgba(255, 255, 255, 0.7);
	margin: -1rem 0 0 0;
	text-align: center;
`

const FormSection = styled.div`
	display: flex;
	flex-direction: column;
	gap: 1rem;
	width: 100%;
`

const PhotoRow = styled.div`
	display: flex;
	align-items: flex-end;
	gap: 1.5rem;
	width: 100%;

	& > div {
		flex: 1;
	}

	@media (max-width: 600px) {
		flex-direction: column;
		align-items: stretch;
	}
`

const PhotoStatusRow = styled.div`
	display: flex;
	align-items: center;
	gap: 1rem;
`

const Preview = styled.div`
	width: 100%;
	border-radius: 0.5rem;
	overflow: hidden;

	& > div {
		width: 100% !important;
	}
`

const Field = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.375rem;
`

const Label = styled.label`
	font-size: 0.875rem;
	font-weight: 700;
	color: rgba(255, 255, 255, 0.9);
`

const FileInput = styled.input`
	padding: 0.5rem;
	background-color: rgba(255, 255, 255, 0.1);
	border: 1px solid rgba(255, 255, 255, 0.2);
	border-radius: 0.5rem;
	color: white;
	font-size: 0.875rem;
	cursor: pointer;

	&::file-selector-button {
		padding: 0.375rem 0.75rem;
		margin-right: 0.75rem;
		background-color: rgba(156, 163, 255, 0.2);
		border: 1px solid rgba(156, 163, 255, 0.4);
		border-radius: 0.375rem;
		color: white;
		cursor: pointer;
		font-size: 0.8125rem;
		transition: all 0.2s ease;

		&:hover {
			background-color: rgba(156, 163, 255, 0.3);
		}
	}
`

const HandleRow = styled.div`
	display: flex;
	align-items: center;
	gap: 0.5rem;

	input {
		flex: 1;
	}
`

const HandlePrefix = styled.span`
	color: rgba(255, 255, 255, 0.5);
	font-size: 1rem;
	font-weight: 600;
	flex-shrink: 0;
`

const ErrorText = styled.p`
	margin: 0;
	color: #ff6b6b;
	font-size: 0.8125rem;
`

const PhotoStatus = styled.p`
	margin: 0;
	color: rgba(156, 163, 255, 0.9);
	font-size: 0.8125rem;
`

const OrDivider = styled.div`
	text-align: center;
	color: rgba(255, 255, 255, 0.4);
	font-size: 0.75rem;
	text-transform: uppercase;
	letter-spacing: 0.1em;
	flex-shrink: 0;
	padding-bottom: 0.5rem;

	@media (max-width: 600px) {
		padding-bottom: 0;
	}
`

const DownloadRow = styled.div`
	display: flex;
	justify-content: center;
	gap: 0.75rem;
`

const SpecNote = styled.p`
	margin: -1rem 0 0 0;
	text-align: center;
	color: rgba(255, 255, 255, 0.4);
	font-size: 0.75rem;
`

//
// Functions
//

function makeFilename(title: string, ext: string): string {
	const slug =
		(title || "")
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-|-$/g, "")
			.slice(0, 50) || "talk"
	return `${slug}-thumbnail.${ext}`
}

/**
 * Convert an image URL (relative, absolute, or blob) to a base64 data URL
 * by drawing it onto a temporary canvas.
 */
async function urlToDataUrl(src: string): Promise<string> {
	// Already a data URL — return as-is
	if (src.startsWith("data:")) return src

	// Resolve relative paths to absolute
	const resolved = src.startsWith("/") ? `${window.location.origin}${src}` : src

	const response = await fetch(resolved)
	const blob = await response.blob()

	return new Promise<string>((resolve, reject) => {
		const reader = new FileReader()
		reader.onloadend = () => resolve(reader.result as string)
		reader.onerror = reject
		reader.readAsDataURL(blob)
	})
}

/**
 * Clone the live SVG element, convert every `<image href="...">` to an
 * embedded base64 data URL, and return the serialized SVG string.
 * This makes the exported SVG/PNG fully self-contained.
 */
async function buildEmbeddedSvgString(svgEl: SVGSVGElement): Promise<string> {
	const clone = svgEl.cloneNode(true) as SVGSVGElement

	// Set explicit pixel dimensions so the SVG rasterizes at full resolution
	// when loaded as a standalone image via blob URL (percentage dimensions have
	// no parent to resolve against and fall back to 300x150).
	const viewBox = clone.getAttribute("viewBox")
	if (viewBox) {
		const [, , w, h] = viewBox.split(/\s+/)
		clone.setAttribute("width", w)
		clone.setAttribute("height", h)
	}

	const images = clone.querySelectorAll("image")

	await Promise.all(
		Array.from(images).map(async (img) => {
			const href =
				img.getAttribute("href") || img.getAttributeNS("http://www.w3.org/1999/xlink", "href")
			if (!href || href.startsWith("data:")) return
			try {
				const dataUrl = await urlToDataUrl(href)
				img.setAttribute("href", dataUrl)
				// Remove xlink:href if present to avoid duplicates
				img.removeAttributeNS("http://www.w3.org/1999/xlink", "href")
			} catch {
				// If an image fails to convert, leave the original href
			}
		})
	)

	const serializer = new XMLSerializer()
	return serializer.serializeToString(clone)
}
