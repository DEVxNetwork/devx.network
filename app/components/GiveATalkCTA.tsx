import React from "react"
import { links } from "../siteConfig"

const GiveATalkCTA: React.FC = () => {
	return (
		<a
			href={links.talkSubmissionUrl}
			target="_blank"
			rel="noopener noreferrer"
			className="fixed flex items-center px-6 py-3 space-x-2 font-bold text-white transition-all duration-300 ease-in-out transform -translate-x-1/2 rounded-full shadow-lg bg-gradient-to-r from-purple-500 to-purple-600 sm:bottom-12 bottom-6 left-1/2 hover:from-purple-600 hover:to-purple-700 hover:scale-105 animate-pulse"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="w-6 h-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
				/>
			</svg>
			<span>Give a Talk!</span>
		</a>
	)
}

export default GiveATalkCTA
