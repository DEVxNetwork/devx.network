"use client"
import { useId } from "react"
import { devxWordmarkMarkup } from "./devxWordmarkMarkup"

//
// Types
//

export type DevxWordmarkProps = {
	className?: string
}

//
// Components
//

export function DevxWordmark({ className }: DevxWordmarkProps) {
	const clipId = `devx-x-${useId().replace(/:/g, "")}`
	const markup = devxWordmarkMarkup.replaceAll("%%CLIP%%", clipId)

	return (
		<svg
			className={className}
			viewBox="0 0 1282.4 441.5"
			fill="none"
			overflow="visible"
			aria-hidden="true"
			dangerouslySetInnerHTML={{ __html: markup }}
		/>
	)
}
