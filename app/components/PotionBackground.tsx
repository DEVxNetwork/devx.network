import React from "react"

export const PotionBackground = () => {
	return (
		<div
			style={{
				backgroundColor: "black",
				width: "100%",
				height: "100%",
				overflow: "hidden",
				position: "absolute",
				top: 0,
				left: 0,
				zIndex: -1
			}}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 100 100"
				preserveAspectRatio="none"
				style={{ aspectRatio: 1, minWidth: "100%", minHeight: "100%" }}
			>
				<defs>
					<filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
						<feGaussianBlur in="SourceGraphic" stdDeviation="6" />
					</filter>
					<radialGradient id="gradient1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
						<stop offset="0%" stop-color="#80008066"></stop>
						<stop offset="90%" stop-color="#ffffff22"></stop>
						<stop offset="100%" stop-color="#ffffff66"></stop>
					</radialGradient>
					<radialGradient id="gradient2" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
						<stop offset="0%" stop-color="#ffffff99"></stop>
						<stop offset="72%" stop-color="#80008033"></stop>
						<stop offset="100%" stop-color="#80008000"></stop>
					</radialGradient>
					<radialGradient id="gradient3" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
						<stop offset="0%" stop-color="#80008066"></stop>
						<stop offset="50%" stop-color="#80008000"></stop>
						<stop offset="100%" stop-color="#ffffff66"></stop>
					</radialGradient>
				</defs>
				<g filter="url(#blur)" opacity="60%">
					<circle cx="0" cy="0" r="70" opacity="0" fill="url(#gradient1)">
						<animate
							attributeName="opacity"
							values="0;1;0"
							keyTimes="0;0.5;1"
							dur="13s"
							repeatCount="indefinite"
						/>
						<animateMotion
							path="M 90,10 m -15,0 a 15,15 0 1,1 30,0 a 15,15 0 1,1 -30,0"
							dur="21s"
							repeatCount="indefinite"
						/>
					</circle>
					<circle cx="0" cy="0" r="70" opacity="0" fill="url(#gradient2)">
						<animate
							attributeName="opacity"
							values="0;1;0"
							keyTimes="0;0.5;1"
							dur="34s"
							repeatCount="indefinite"
						/>
						<animateMotion
							path="M 50,50 m -15,0 a 15,15 0 1,1 30,0 a 15,15 0 1,1 -30,0"
							dur="13s"
							repeatCount="indefinite"
						/>
					</circle>
					<circle cx="0" cy="0" r="70" opacity="0" fill="url(#gradient3)">
						<animate
							attributeName="opacity"
							values="0;1;0"
							keyTimes="0;0.5;1"
							dur="21s"
							repeatCount="indefinite"
						/>
						<animateMotion
							path="M 10,90 m -15,0 a 15,15 0 1,1 30,0 a 15,15 0 1,1 -30,0"
							dur="34s"
							repeatCount="indefinite"
						/>
					</circle>
				</g>
			</svg>
		</div>
	)
}
