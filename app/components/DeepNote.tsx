"use client"

let hasPlayed = false

export function DeepNote({ children }: { children: React.ReactNode }) {
	const handleMouseEnter = () => {
		if (!hasPlayed) {
			playDeepNote()
			hasPlayed = true
		}
	}

	return <div onMouseMove={handleMouseEnter}>{children}</div>
}

function playDeepNote() {
	const audioContext = new (window.AudioContext || window.AudioContext)()
	const duration = 6 // Duration of the frequency sweep in seconds
	const fadeDuration = 2 // Duration of the fade-out in seconds
	const totalDuration = duration + fadeDuration
	const numOscillators = 30 // Number of oscillators to simulate the original effect
	const initialMinFreq = 50 // Initial minimum frequency in Hz (two octaves lower)
	const initialMaxFreq = 100 // Initial maximum frequency in Hz (two octaves lower)
	const finalMinFreq = 18.75 // Final minimum frequency in Hz (D0, two octaves lower)
	const finalMaxFreq = 450 // Final maximum frequency in Hz (A4, two octaves lower)

	// Create a gain node for volume control
	const gainNode = audioContext.createGain()
	gainNode.gain.setValueAtTime(0.05, audioContext.currentTime) // Start with low volume
	gainNode.connect(audioContext.destination)

	// Function to generate a random frequency within a specified range
	function randomFrequency(min: number, max: number) {
		return Math.random() * (max - min) + min
	}

	// Function to generate a random detune value
	function randomDetune(cents: number) {
		return (Math.random() - 0.5) * cents
	}

	// Create oscillators with random initial frequencies and sweeping to target frequencies
	for (let i = 0; i < numOscillators; i++) {
		const oscillator = audioContext.createOscillator()
		const startFrequency = randomFrequency(initialMinFreq, initialMaxFreq)
		const endFrequency = randomFrequency(finalMinFreq, finalMaxFreq)
		const detune = randomDetune(20) // Detune by up to ±10 cents

		oscillator.type = "sawtooth" // Richer harmonic content
		oscillator.frequency.setValueAtTime(startFrequency, audioContext.currentTime)
		oscillator.frequency.linearRampToValueAtTime(endFrequency, audioContext.currentTime + duration)
		oscillator.detune.setValueAtTime(detune, audioContext.currentTime)

		// Apply subtle vibrato
		const vibrato = audioContext.createOscillator()
		vibrato.frequency.setValueAtTime(5, audioContext.currentTime) // 5 Hz vibrato rate
		const vibratoGain = audioContext.createGain()
		vibratoGain.gain.setValueAtTime(2, audioContext.currentTime) // ±2 Hz vibrato depth
		vibrato.connect(vibratoGain)
		vibratoGain.connect(oscillator.frequency)
		vibrato.start()
		vibrato.stop(audioContext.currentTime + totalDuration)

		// Connect oscillator to the gain node
		oscillator.connect(gainNode)
		oscillator.start()
		oscillator.stop(audioContext.currentTime + totalDuration)
	}

	// Create a gain envelope for fade-in and fade-out
	gainNode.gain.linearRampToValueAtTime(0.4, audioContext.currentTime + 2) // Gradual fade-in
	gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + duration) // Sustain moderate volume
	gainNode.gain.linearRampToValueAtTime(0.0, audioContext.currentTime + totalDuration) // Smooth fade-out
}
