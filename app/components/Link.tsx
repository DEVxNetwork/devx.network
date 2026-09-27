"use client"
import { forwardRef } from "react"
import type { AnchorHTMLAttributes } from "react"

//
// Components
//

export const Link = forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement>>(
	function Link({ href, ...rest }, ref) {
		return <a ref={ref} href={href} {...rest} />
	}
)
