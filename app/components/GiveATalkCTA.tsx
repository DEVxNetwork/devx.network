"use client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { supabaseClient } from "../../lib/supabaseClient"
import { Button } from "./Button"

//
// Components
//

export const GiveATalkCTA = () => {
	const router = useRouter()
	const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

	useEffect(() => {
		const checkAuth = async () => {
			const {
				data: { user }
			} = await supabaseClient.auth.getUser()
			setIsAuthenticated(!!user)
		}

		checkAuth()
	}, [])

	const handleClick = (event?: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
		if (isAuthenticated === false) {
			event?.preventDefault()
			const redirectUrl = encodeURIComponent("/submit-talk")
			router.push(`/login?redirect=${redirectUrl}`)
		}
	}

	return (
		<Button href="/submit-talk" onClick={handleClick} variant="secondary">
			Give a Talk
		</Button>
	)
}
