"use client"
import styled from "styled-components"
import { useState, useRef, useEffect } from "react"
import { TextInput } from "./TextInput"
import { Button } from "./Button"
import { EditIcon, CameraIcon, QuestionIcon } from "./icons"

type NametagData = {
	fullName: string
	title: string
	affiliation: string
	profilePhoto: string
}

type NametagProps = {
	data: NametagData
	onSave: (data: NametagData) => Promise<void>
	onImageUpload: (file: File) => Promise<string>
	uploading?: boolean
	saving?: boolean
	initialEditing?: boolean
	forcedEditMode?: boolean
	onDataChange?: (data: NametagData) => void
	readOnly?: boolean
}

export const Nametag = ({
	data,
	onSave,
	onImageUpload,
	uploading = false,
	saving = false,
	initialEditing = false,
	forcedEditMode = false,
	onDataChange,
	readOnly = false
}: NametagProps) => {
	const [isEditing, setIsEditing] = useState(initialEditing || forcedEditMode)
	const [formData, setFormData] = useState<NametagData>(data)
	const [rotation, setRotation] = useState({ x: 0, y: 0 })
	const [openTooltip, setOpenTooltip] = useState<string | null>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)
	const containerRef = useRef<HTMLDivElement>(null)
	const tooltipRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
	const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null)
	const isTiltingRef = useRef(false)

	// In forced edit mode, always keep editing enabled (unless readOnly)
	// In readOnly mode, never allow editing
	const effectiveEditing = readOnly ? false : forcedEditMode ? true : isEditing

	// Notify parent of data changes in forced edit mode
	useEffect(() => {
		if (forcedEditMode && onDataChange) {
			onDataChange(formData)
		}
	}, [formData, forcedEditMode, onDataChange])

	// Update formData when data prop changes (e.g., after save)
	// Use a ref to track if we have a local photo upload that shouldn't be overwritten
	const hasLocalPhotoRef = useRef(false)

	useEffect(() => {
		// Don't overwrite form data if user is actively editing
		if (isEditing) {
			// Only update if we have a local photo upload that shouldn't be overwritten
			const currentFormData = formData
			if (hasLocalPhotoRef.current && currentFormData.profilePhoto && !data.profilePhoto) {
				return
			}
			// Preserve user's form input - don't overwrite during editing
			return
		}

		// When not editing, sync with data prop (e.g., after save or initial load)
		if (hasLocalPhotoRef.current && formData.profilePhoto && !data.profilePhoto) {
			return
		}
		hasLocalPhotoRef.current = false
		setFormData(data)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data, isEditing])

	// Close tooltip when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (openTooltip) {
				const tooltipElement = tooltipRefs.current[openTooltip]
				if (tooltipElement && !tooltipElement.contains(event.target as Node)) {
					setOpenTooltip(null)
				}
			}
		}

		if (openTooltip) {
			document.addEventListener("mousedown", handleClickOutside)
			return () => {
				document.removeEventListener("mousedown", handleClickOutside)
			}
		}
	}, [openTooltip])

	const toggleTooltip = (fieldName: string) => {
		setOpenTooltip(openTooltip === fieldName ? null : fieldName)
	}

	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		if (!containerRef.current) return

		const rect = containerRef.current.getBoundingClientRect()
		const x = e.clientX - rect.left
		const y = e.clientY - rect.top
		const centerX = rect.width / 2
		const centerY = rect.height / 2

		// Calculate rotation based on cursor position
		// RotateX: affects vertical tilt (tilting up/down)
		// RotateY: affects horizontal tilt (tilting left/right)
		// We want the nametag to tilt *towards* the cursor
		const rotateX = ((y - centerY) / centerY) * 10 // Max 10 degrees
		const rotateY = ((x - centerX) / centerX) * -10 // Max 10 degrees

		setRotation({ x: rotateX, y: rotateY })
	}

	const handleMouseLeave = () => {
		setRotation({ x: 0, y: 0 })
	}

	const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
		if (!containerRef.current) return

		const touch = e.touches[0]
		const rect = containerRef.current.getBoundingClientRect()
		const x = touch.clientX - rect.left
		const y = touch.clientY - rect.top

		touchStartRef.current = {
			x: touch.clientX,
			y: touch.clientY,
			time: Date.now()
		}
		isTiltingRef.current = false
	}

	const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
		if (!containerRef.current || !touchStartRef.current) return

		const touch = e.touches[0]
		const deltaX = Math.abs(touch.clientX - touchStartRef.current.x)
		const deltaY = Math.abs(touch.clientY - touchStartRef.current.y)
		const deltaTime = Date.now() - touchStartRef.current.time
		const totalDelta = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

		// Detect scroll gesture:
		// - Significant vertical movement (> 15px) that's primarily vertical
		// - Fast movement (indicates scroll intent)
		// - If already determined to be scrolling, continue scrolling
		const isVerticalScroll = deltaY > 15 && deltaY > deltaX * 2
		const isFastMovement = deltaTime < 150 && totalDelta > 20

		if (isVerticalScroll || (isFastMovement && deltaY > deltaX)) {
			// This is a scroll gesture, don't interfere
			isTiltingRef.current = false
			return
		}

		// This is a tilt gesture - apply tilt effect
		isTiltingRef.current = true
		const rect = containerRef.current.getBoundingClientRect()
		const x = touch.clientX - rect.left
		const y = touch.clientY - rect.top
		const centerX = rect.width / 2
		const centerY = rect.height / 2

		// Calculate rotation based on touch position
		const rotateX = ((y - centerY) / centerY) * 10 // Max 10 degrees
		const rotateY = ((x - centerX) / centerX) * -10 // Max 10 degrees

		setRotation({ x: rotateX, y: rotateY })
	}

	const handleTouchEnd = () => {
		if (isTiltingRef.current) {
			setRotation({ x: 0, y: 0 })
		}
		touchStartRef.current = null
		isTiltingRef.current = false
	}

	const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files || e.target.files.length === 0) return

		const file = e.target.files[0]

		try {
			const url = await onImageUpload(file)
			hasLocalPhotoRef.current = true
			const newData = { ...formData, profilePhoto: url }
			setFormData(newData)
			if (forcedEditMode && onDataChange) {
				onDataChange(newData)
			}
		} catch (error) {
			console.error("Error uploading image:", error)
			// Don't re-throw - just log the error
			// The uploading state will be reset by the parent component
		} finally {
			// Reset the input so the same file can be selected again if needed
			if (fileInputRef.current) {
				fileInputRef.current.value = ""
			}
		}
	}

	const handleSave = async (e?: React.FormEvent) => {
		if (e) {
			e.preventDefault()
		}
		if (!formData.profilePhoto || !formData.fullName.trim()) {
			return
		}
		await onSave(formData)
		setIsEditing(false)
	}

	// Read-only mode (skip if forced edit mode)
	if (!effectiveEditing) {
		return (
			<>
				<NametagContainer
					ref={containerRef}
					onMouseMove={handleMouseMove}
					onMouseLeave={handleMouseLeave}
					onTouchStart={handleTouchStart}
					onTouchMove={handleTouchMove}
					onTouchEnd={handleTouchEnd}
					style={{
						transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
					}}
				>
					<NametagHole />
					{!readOnly && (
						<EditButtonWrapper>
							<Button variant="tertiary" size="small" onClick={() => setIsEditing(true)}>
								<EditIcon />
								Edit
							</Button>
						</EditButtonWrapper>
					)}
					<NametagLeft>
						<PhotoFrame>
							{formData.profilePhoto ? (
								<Avatar src={formData.profilePhoto} alt="Profile" />
							) : (
								<PlaceholderAvatar>
									<CameraIcon color="rgba(255, 255, 255, 0.5)" />
								</PlaceholderAvatar>
							)}
						</PhotoFrame>
					</NametagLeft>

					<NametagRight>
						<NametagDisplayGroup>
							<NametagLabel>HELLO my name is</NametagLabel>
							<NametagDisplayText $fontSize="1.5rem" $fontWeight="700">
								{formData.fullName || "Your Name"}
							</NametagDisplayText>
						</NametagDisplayGroup>

						<NametagDisplayGroup>
							<NametagDisplayText $fontSize="1.1rem" $fontWeight="500">
								{formData.title || "Title"}
							</NametagDisplayText>
						</NametagDisplayGroup>

						<NametagDisplayGroup>
							<NametagDisplayText $fontSize="1.1rem" $fontWeight="400">
								{formData.affiliation || "Affiliation"}
							</NametagDisplayText>
						</NametagDisplayGroup>
					</NametagRight>
				</NametagContainer>
			</>
		)
	}

	// Edit mode
	const content = (
		<NametagContainer ref={containerRef}>
			<NametagHole />
			{!forcedEditMode && (
				<SaveButtonWrapper>
					<Button
						type="submit"
						variant="tertiary"
						size="small"
						disabled={saving || uploading || !formData.profilePhoto || !formData.fullName.trim()}
					>
						{saving ? "Saving..." : "Save"}
					</Button>
				</SaveButtonWrapper>
			)}
			<NametagLeft>
				<PhotoFrame onClick={readOnly ? undefined : () => fileInputRef.current?.click()}>
					{uploading ? (
						<PlaceholderAvatar>Loading...</PlaceholderAvatar>
					) : formData.profilePhoto ? (
						<Avatar src={formData.profilePhoto} alt="Profile" />
					) : (
						<PlaceholderAvatar>
							<CameraIcon color="rgba(255, 255, 255, 0.5)" />
						</PlaceholderAvatar>
					)}
					{!readOnly && (
						<PhotoOverlay>
							<CameraIcon color="white" />
						</PhotoOverlay>
					)}
				</PhotoFrame>
				{!readOnly && (
					<input
						type="file"
						ref={fileInputRef}
						onChange={handleImageUpload}
						accept="image/*"
						style={{ display: "none" }}
					/>
				)}
			</NametagLeft>

			<NametagRight>
				<NametagInputGroup>
					<NametagLabel>HELLO my name is</NametagLabel>
					<InputWithHelpContainer>
						<NametagInputWrapper $fontSize="1.5rem" $fontWeight="700">
							<TextInput
								variant="secondary"
								size="default"
								value={formData.fullName}
								onChange={(e) => {
									const newData = { ...formData, fullName: e.target.value }
									setFormData(newData)
									if (forcedEditMode && onDataChange) {
										onDataChange(newData)
									}
								}}
								placeholder="Your Name"
								required
							/>
						</NametagInputWrapper>
					</InputWithHelpContainer>
				</NametagInputGroup>

				<NametagInputGroup>
					<InputWithHelpContainer>
						<NametagInputWrapper $fontSize="1.1rem" $fontWeight="500">
							<TextInput
								variant="secondary"
								size="default"
								value={formData.title}
								onChange={(e) => {
									const newData = { ...formData, title: e.target.value }
									setFormData(newData)
									if (forcedEditMode && onDataChange) {
										onDataChange(newData)
									}
								}}
								placeholder="Title"
								required
							/>
						</NametagInputWrapper>
						<HelpIconWrapper onClick={() => toggleTooltip("title")}>
							<QuestionIcon />
							{openTooltip === "title" && (
								<Tooltip
									ref={(el) => {
										tooltipRefs.current["title"] = el
									}}
								>
									Your job title or role.
								</Tooltip>
							)}
						</HelpIconWrapper>
					</InputWithHelpContainer>
				</NametagInputGroup>

				<NametagInputGroup>
					<InputWithHelpContainer>
						<NametagInputWrapper $fontSize="1.1rem" $fontWeight="400">
							<TextInput
								variant="secondary"
								size="default"
								value={formData.affiliation}
								onChange={(e) => {
									const newData = { ...formData, affiliation: e.target.value }
									setFormData(newData)
									if (forcedEditMode && onDataChange) {
										onDataChange(newData)
									}
								}}
								placeholder="Affiliation"
								required
							/>
						</NametagInputWrapper>
						<HelpIconWrapper onClick={() => toggleTooltip("affiliation")}>
							<QuestionIcon />
							{openTooltip === "affiliation" && (
								<Tooltip
									ref={(el) => {
										tooltipRefs.current["affiliation"] = el
									}}
								>
									Your company, organization, or school name.
								</Tooltip>
							)}
						</HelpIconWrapper>
					</InputWithHelpContainer>
				</NametagInputGroup>
			</NametagRight>
		</NametagContainer>
	)

	// When forcedEditMode is true, don't wrap in form (parent form handles submission)
	if (forcedEditMode) {
		return content
	}

	// Otherwise, wrap in form for standalone editing
	return <Form onSubmit={handleSave}>{content}</Form>
}

// Styled Components

const Form = styled.form`
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
	width: 100%;
`

const NametagContainer = styled.div`
	background: linear-gradient(
		135deg,
		rgba(28, 28, 40, 0.9) 0%,
		rgba(15, 15, 22, 0.95) 25%,
		rgba(0, 0, 1, 1) 50%,
		rgba(15, 15, 22, 0.95) 75%,
		rgba(28, 28, 40, 0.9) 100%
	);
	border-radius: 16px;
	padding: 2.5rem 2rem;
	box-shadow:
		0 0 20px rgba(156, 163, 255, 0.15),
		0 0 40px rgba(92, 107, 246, 0.1),
		0 0 60px rgba(28, 28, 40, 0.4),
		0 1px 3px rgba(0, 0, 0, 0.9),
		0 10px 20px -5px rgba(28, 28, 40, 0.5),
		inset 0 1px 0 rgba(156, 163, 255, 0.1);
	display: flex;
	flex-direction: row;
	gap: 2rem;
	width: 100%;
	position: relative;
	color: rgba(255, 255, 255, 0.95);
	border: 1px solid rgba(156, 163, 255, 0.5);
	overflow: hidden;
	animation: pulseGlow 3s ease-in-out infinite;
	transform-style: preserve-3d;
	transition: transform 0.1s ease-out;
	will-change: transform;
	touch-action: pan-y pan-x;
	/* Create see-through rectangular hole using mask - matches hole exactly */
	/* Hole is 60px wide x 8px tall, positioned at top: 12px, centered horizontally */
	/* Create see-through rounded rectangular hole using mask */
	/* Hole is 60px wide x 8px tall, positioned at top: 12px, centered horizontally */
	mask-image: url("data:image/svg+xml,%3Csvg width='60' height='8' viewBox='0 0 60 8' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='60' height='8' rx='4' fill='black'/%3E%3C/svg%3E"),
		linear-gradient(black, black);
	mask-position:
		center 12px,
		0 0;
	mask-size:
		60px 8px,
		100% 100%;
	mask-repeat: no-repeat, no-repeat;
	mask-composite: exclude;

	-webkit-mask-image: url("data:image/svg+xml,%3Csvg width='60' height='8' viewBox='0 0 60 8' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='60' height='8' rx='4' fill='black'/%3E%3C/svg%3E"),
		linear-gradient(black, black);
	-webkit-mask-position:
		center 12px,
		0 0;
	-webkit-mask-size:
		60px 8px,
		100% 100%;
	-webkit-mask-repeat: no-repeat, no-repeat;
	-webkit-mask-composite: destination-out;

	&::before {
		content: "";
		position: absolute;
		top: -200%;
		left: -100%;
		width: 300%;
		height: 400%;
		background: linear-gradient(
			115deg,
			transparent 40%,
			rgba(156, 163, 255, 0.15) 48%,
			rgba(255, 255, 255, 0.25) 50%,
			rgba(156, 163, 255, 0.15) 52%,
			transparent 60%
		);
		animation: shimmer 2.5s linear infinite;
	}

	&::after {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 1px;
		background: linear-gradient(
			90deg,
			transparent 0%,
			rgba(255, 255, 255, 0.4) 50%,
			transparent 100%
		);
		pointer-events: none;
	}

	@media (max-width: 600px) {
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding: 2rem 1.5rem;
	}

	@keyframes shimmer {
		0% {
			transform: translateX(-100%) translateY(-100%) rotate(45deg);
		}
		100% {
			transform: translateX(100%) translateY(100%) rotate(45deg);
		}
	}

	@keyframes pulseGlow {
		0%,
		100% {
			box-shadow:
				0 0 20px rgba(156, 163, 255, 0.15),
				0 0 40px rgba(92, 107, 246, 0.1),
				0 0 60px rgba(28, 28, 40, 0.4),
				0 1px 3px rgba(0, 0, 0, 0.9),
				0 10px 20px -5px rgba(28, 28, 40, 0.5),
				inset 0 1px 0 rgba(156, 163, 255, 0.1);
		}
		50% {
			box-shadow:
				0 0 35px rgba(156, 163, 255, 0.25),
				0 0 70px rgba(92, 107, 246, 0.18),
				0 0 100px rgba(28, 28, 40, 0.5),
				0 1px 3px rgba(0, 0, 0, 0.9),
				0 10px 20px -5px rgba(28, 28, 40, 0.5),
				inset 0 1px 0 rgba(156, 163, 255, 0.15);
		}
	}
`

const NametagHole = styled.div`
	position: absolute;
	top: 10px;
	left: 50%;
	box-sizing: content-box;
	transform: translateX(-50%);
	width: 60px;
	height: 8px;
	/* Border matching the nametag container */
	border: 1px solid rgba(156, 163, 255, 0.5);
	border-radius: 4px;
	pointer-events: none;
	z-index: 1;
	/* Add inner shadow to enhance the cutout effect */
	box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.5);
	background: radial-gradient(
		ellipse 30px 4px,
		transparent 0%,
		transparent 40%,
		rgba(0, 0, 0, 0.2) 100%
	);
`

const EditButtonWrapper = styled.div`
	position: absolute;
	top: 1rem;
	right: 1rem;
	z-index: 10;

	svg {
		width: 14px;
		height: 14px;
	}
`

const SaveButtonWrapper = styled.div`
	position: absolute;
	top: 1rem;
	right: 1rem;
	z-index: 10;
`

const NametagLeft = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 1rem;
	flex-shrink: 0;
	width: 140px;
`

const NametagRight = styled.div`
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	justify-content: center;
	width: 100%;
`

const PhotoOverlay = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	opacity: 0;
	transition: opacity 0.2s;
	color: white;
	z-index: 1;
	pointer-events: none;
`

const PhotoFrame = styled.div`
	width: 120px;
	height: 120px;
	border-radius: 8px;
	overflow: hidden;
	background-color: rgba(255, 255, 255, 0.1);
	border: 2px solid rgba(255, 255, 255, 0.3);
	box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
	cursor: pointer;
	position: relative;

	&:hover ${PhotoOverlay} {
		opacity: 1;
	}
`

const Avatar = styled.img`
	width: 100%;
	height: 100%;
	object-fit: cover;
	position: relative;
	z-index: 0;
`

const PlaceholderAvatar = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: rgba(255, 255, 255, 0.5);
	font-size: 0.8rem;
	font-weight: 500;
	background-color: rgba(255, 255, 255, 0.05);
	position: relative;
	z-index: 0;
`

const NametagInputGroup = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
`

const NametagDisplayGroup = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
`

const NametagLabel = styled.div`
	font-size: 0.75rem;
	font-weight: 900;
	letter-spacing: 0.1em;
	text-transform: uppercase;
	color: rgba(255, 255, 255, 0.7);
	margin-bottom: 0.25rem;
`

const InputWithHelpContainer = styled.div`
	display: flex;
	align-items: center;
	gap: 0.5rem;
	width: 100%;
	position: relative;
`

const NametagInputWrapper = styled.div<{ $fontSize?: string; $fontWeight?: string }>`
	flex: 1;
	width: 100%;

	input {
		background: transparent;
		border: none;
		border-bottom: 2px solid rgba(255, 255, 255, 0.2);
		padding: 0.25rem 0;
		font-size: ${(props) => props.$fontSize || "1rem"};
		font-weight: ${(props) => props.$fontWeight || "normal"};
		color: rgba(255, 255, 255, 0.95);
		width: 100%;

		&::placeholder {
			color: rgba(255, 255, 255, 0.5);
		}

		&:focus {
			outline: none;
			border-bottom-color: rgba(156, 163, 255, 0.8);
			background: rgba(255, 255, 255, 0.05);
		}
	}
`

const HelpIconWrapper = styled.div`
	position: relative;
	cursor: pointer;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	color: rgba(255, 255, 255, 0.6);
	transition: color 0.2s ease;
	flex-shrink: 0;

	&:hover {
		color: rgba(255, 255, 255, 0.9);
	}
`

const Tooltip = styled.div`
	position: absolute;
	bottom: calc(100% + 8px);
	right: 0;
	background: rgba(0, 0, 0, 0.95);
	color: rgba(255, 255, 255, 0.95);
	padding: 0.75rem 1rem;
	border-radius: 8px;
	font-size: 0.875rem;
	line-height: 1.4;
	white-space: normal;
	min-width: 200px;
	max-width: 250px;
	width: max-content;
	z-index: 1000;
	box-shadow:
		0 4px 12px rgba(0, 0, 0, 0.4),
		0 0 0 1px rgba(255, 255, 255, 0.1);
	pointer-events: auto;

	&::after {
		content: "";
		position: absolute;
		top: 100%;
		right: 1rem;
		transform: translateX(50%);
		border: 6px solid transparent;
		border-top-color: rgba(0, 0, 0, 0.95);
	}
`

const NametagDisplayText = styled.div<{ $fontSize?: string; $fontWeight?: string }>`
	font-size: ${(props) => props.$fontSize || "1rem"};
	font-weight: ${(props) => props.$fontWeight || "normal"};
	color: rgba(255, 255, 255, 0.95);
	padding: 0.25rem 0;
`
