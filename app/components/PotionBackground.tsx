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
				style={{ width: "100%", height: "100%" }}
			>
				<defs>
					<filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
						<feGaussianBlur in="SourceGraphic" stdDeviation="6" />
					</filter>
					<radialGradient id="gradient1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
						<stop offset="0%" stopColor="#E2ABFF71" />
						<stop offset="99%" stopColor="#3AF79B96" />
						<stop offset="100%" stopColor="#3AF79B00" />
					</radialGradient>
					<radialGradient id="gradient2" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
						<stop offset="0%" stopColor="#3B69FF4F" />
						<stop offset="72%" stopColor="#3A66F770" />
						<stop offset="100%" stopColor="#3A66F700" />
					</radialGradient>
					<radialGradient id="gradient3" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
						<stop offset="0%" stopColor="#FF3BEB" />
						<stop offset="72%" stopColor="#3A9EF7A8" />
						<stop offset="100%" stopColor="#3A9EF700" />
					</radialGradient>
				</defs>
				<g filter="url(#blur)" opacity={"60%"}>
					<circle cx="0" cy="0" r="70" fill="url(#gradient1)">
						<animateMotion
							path="M 90,10 m -15,0 a 15,15 0 1,1 30,0 a 15,15 0 1,1 -30,0"
							dur="16s"
							repeatCount="indefinite"
						/>
					</circle>
					<circle cx="0" cy="0" r="70" fill="url(#gradient2)">
						<animateMotion
							path="M 50,50 m -15,0 a 15,15 0 1,1 30,0 a 15,15 0 1,1 -30,0"
							dur="24s"
							repeatCount="indefinite"
						/>
					</circle>
					<circle cx="0" cy="0" r="70" fill="url(#gradient3)">
						<animateMotion
							path="M 10,90 m -15,0 a 15,15 0 1,1 30,0 a 15,15 0 1,1 -30,0"
							dur="32s"
							repeatCount="indefinite"
						/>
					</circle>
				</g>
			</svg>
		</div>
	)
}
