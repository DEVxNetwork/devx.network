"use client"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { supabaseClient } from "../../lib/supabaseClient"
import { checkIsAdmin } from "../../lib/adminCheck"

//
// Types
//

type UseRequireAdminAuthResult = {
	loading: boolean
	isAdmin: boolean
}

//
// Hooks
//

export function useRequireAdminAuth(): UseRequireAdminAuthResult {
	const router = useRouter()
	const pathname = usePathname()
	const [loading, setLoading] = useState(true)
	const [isAdmin, setIsAdmin] = useState(false)

	useEffect(() => {
		const verifyAdminAccess = async () => {
			const {
				data: { user }
			} = await supabaseClient.auth.getUser()

			if (!user) {
				const redirectPath = encodeURIComponent(pathname || "/")
				router.push(`/login?redirect=${redirectPath}`)
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

		verifyAdminAccess()
	}, [pathname, router])

	return { loading, isAdmin }
}
