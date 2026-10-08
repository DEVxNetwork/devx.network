import { NextRequest, NextResponse } from "next/server"
import { AvatarImageError, processAvatarImage, validateAvatarInput } from "@/lib/processAvatarImage"
import { getAuthenticatedUser } from "@/lib/supabaseServer"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
	try {
		const authHeader = request.headers.get("Authorization")
		const accessToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null

		if (!accessToken) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const auth = await getAuthenticatedUser(accessToken)
		if (!auth) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const formData = await request.formData()
		const file = formData.get("file")

		if (!file || !(file instanceof File)) {
			return NextResponse.json({ error: "No image file provided" }, { status: 400 })
		}

		validateAvatarInput(file)

		const inputBuffer = Buffer.from(await file.arrayBuffer())
		const processedBuffer = await processAvatarImage(inputBuffer)

		const fileName = `${crypto.randomUUID()}.webp`
		const { error: uploadError } = await auth.supabase.storage
			.from("avatars")
			.upload(fileName, processedBuffer, {
				contentType: "image/webp",
				upsert: false
			})

		if (uploadError) {
			console.error("Avatar upload error:", uploadError)
			return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
		}

		const {
			data: { publicUrl }
		} = auth.supabase.storage.from("avatars").getPublicUrl(fileName)

		return NextResponse.json({ url: publicUrl })
	} catch (error) {
		if (error instanceof AvatarImageError) {
			return NextResponse.json({ error: error.message }, { status: error.statusCode })
		}

		console.error("Avatar upload error:", error)
		return NextResponse.json({ error: "Internal server error" }, { status: 500 })
	}
}
