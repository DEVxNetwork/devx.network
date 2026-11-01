// The footer x (public/images/logo/x.svg), split so the face can leave its extrusion.
// %%CLIP%% is replaced with a unique clip id. Gradient ids use that prefix. x-pattern is the hot glow.
// The group this markup is placed in flips Y, so a positive translateY on .x-face goes up.

//
// Constants
//

export const xDudeMarkup = `<g class="x-shadow"><polygon points="516.87,457.33 387.54,241.33 463.54,109.33 592.87,325.33" fill="#5010a0" stroke="#5010a0" stroke-width="1.6" stroke-linejoin="round"/><polygon points="290.87,142.00 288.20,142.00 364.20,10.00 366.87,10.00" fill="#5010a0" stroke="#5010a0" stroke-width="1.6" stroke-linejoin="round"/><polygon points="288.20,142.00 211.54,0.00 287.54,-132.00 364.20,10.00" fill="#5010a0" stroke="#5010a0" stroke-width="1.6" stroke-linejoin="round"/><polygon points="211.54,0.00 60.87,0.00 136.87,-132.00 287.54,-132.00" fill="#5010a0" stroke="#5010a0" stroke-width="1.6" stroke-linejoin="round"/><polygon points="530.87,0.00 368.20,0.00 444.20,-132.00 606.87,-132.00" fill="#5010a0" stroke="#5010a0" stroke-width="1.6" stroke-linejoin="round"/><path d="M592.87,325.33L463.54,109.33" fill="none" stroke="#181818" stroke-width="15" stroke-linejoin="round" stroke-linecap="round"/><path d="M606.87,-132.00L444.20,-132.00" fill="none" stroke="#181818" stroke-width="15" stroke-linejoin="round" stroke-linecap="round"/><path d="M366.87,10.00L364.20,10.00L287.54,-132.00L136.87,-132.00" fill="none" stroke="#181818" stroke-width="15" stroke-linejoin="round" stroke-linecap="round"/><path d="M516.87,457.33L592.87,325.33" fill="none" stroke="#181818" stroke-width="15" stroke-linejoin="round" stroke-linecap="round"/><path d="M387.54,241.33L463.54,109.33" fill="none" stroke="#181818" stroke-width="15" stroke-linejoin="round" stroke-linecap="round"/><path d="M530.87,0.00L606.87,-132.00" fill="none" stroke="#181818" stroke-width="15" stroke-linejoin="round" stroke-linecap="round"/><path d="M368.20,0.00L444.20,-132.00" fill="none" stroke="#181818" stroke-width="15" stroke-linejoin="round" stroke-linecap="round"/><path d="M290.87,142.00L366.87,10.00" fill="none" stroke="#181818" stroke-width="15" stroke-linejoin="round" stroke-linecap="round"/><path d="M60.87,0.00L136.87,-132.00" fill="none" stroke="#181818" stroke-width="15" stroke-linejoin="round" stroke-linecap="round"/></g><g class="x-face"><g transform="translate(70.87,0) scale(0.6666666666666666)">
		<clipPath id="%%CLIP%%" clipPathUnits="userSpaceOnUse"><path d="M-15 0L200 363L7 686L250 686L345 511L349 511L444 686L669 686L475 362L690 0L446 0L330 213L326 213L211 0Z"/></clipPath>
		<g clip-path="url(#%%CLIP%%)"><g class="x-pattern">
			<rect x="-180" y="-140" width="1100" height="1040" fill="#ffe200"/>
			<radialGradient id="%%CLIP%%-tr" gradientUnits="userSpaceOnUse" cx="560" cy="600" r="460">
				<stop offset="0" stop-color="#ff22d0"/>
				<stop offset="0.38" stop-color="#ff22d0"/>
				<stop offset="1" stop-color="#ff22d0" stop-opacity="0"/>
			</radialGradient>
			<circle cx="560" cy="600" r="460" fill="url(#%%CLIP%%-tr)"/>
			<radialGradient id="%%CLIP%%-bl" gradientUnits="userSpaceOnUse" cx="110" cy="100" r="450">
				<stop offset="0" stop-color="#2aefd2"/>
				<stop offset="0.38" stop-color="#2aefd2"/>
				<stop offset="1" stop-color="#2aefd2" stop-opacity="0"/>
			</radialGradient>
			<circle cx="110" cy="100" r="450" fill="url(#%%CLIP%%-bl)"/>
			<radialGradient id="%%CLIP%%-br" gradientUnits="userSpaceOnUse" cx="570" cy="100" r="440">
				<stop offset="0" stop-color="#ff6b2d"/>
				<stop offset="0.38" stop-color="#ff6b2d"/>
				<stop offset="1" stop-color="#ff6b2d" stop-opacity="0"/>
			</radialGradient>
			<circle cx="570" cy="100" r="440" fill="url(#%%CLIP%%-br)"/>
			<radialGradient id="%%CLIP%%-tl" gradientUnits="userSpaceOnUse" cx="150" cy="590" r="420">
				<stop offset="0" stop-color="#ffe200"/>
				<stop offset="0.38" stop-color="#ffe200"/>
				<stop offset="1" stop-color="#ffe200" stop-opacity="0"/>
			</radialGradient>
			<circle cx="150" cy="590" r="420" fill="url(#%%CLIP%%-tl)"/>
			</g>
		</g>
		<path d="M-15 0L200 363L7 686L250 686L345 511L349 511L444 686L669 686L475 362L690 0L446 0L330 213L326 213L211 0Z" fill="none" stroke="#181818" stroke-width="22.50" stroke-linejoin="round" stroke-linecap="round"/>
		</g></g>`
