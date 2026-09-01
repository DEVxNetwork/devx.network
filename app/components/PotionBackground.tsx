"use client"
import { useRef, useEffect, useState } from "react"
import styled from "styled-components"
import createFragmentShader from "../shaders/background"
import { FragmentShader } from "../shaders/types"

// Components //

export const PotionBackground = () => {
	const containerRef = useRef<HTMLDivElement>(null)
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const requestRef = useRef<number>()

	const [canvasDimensions, setCanvasDimensions] = useState({ width: 0, height: 0, top: 0, left: 0 })

	useEffect(() => {
		if (!containerRef.current) return

		const updateDimensions = (el: HTMLElement) => {
			const { width, height } = el.getBoundingClientRect()
			setCanvasDimensions({ width, height, top: 0, left: 0 })
		}

		// Initialize dimensions
		updateDimensions(containerRef.current)

		// Set up ResizeObserver
		const resizeObserver = new ResizeObserver((entries) => {
			if (entries.length > 0) {
				updateDimensions(entries[0].target as HTMLElement)
			}
		})

		resizeObserver.observe(containerRef.current)

		return () => {
			resizeObserver.disconnect()
		}
	}, [])

	useEffect(() => {
		if (!canvasRef.current || canvasDimensions.width === 0 || canvasDimensions.height === 0) return

		const canvas = canvasRef.current
		// Use a lower pixel ratio on mobile devices for better performance
		const isMobile = window.innerWidth <= 768
		const pixelRatio = isMobile
			? Math.min(window.devicePixelRatio, 1.0)
			: Math.min(window.devicePixelRatio, 1.5)
		canvas.width = Math.floor(canvasDimensions.width * pixelRatio)
		canvas.height = Math.floor(canvasDimensions.height * pixelRatio)

		// Initialize WebGL
		const gl =
			// Switch between webgl2 for performance benefits if available
			canvas.getContext("webgl2", {
				alpha: false,
				antialias: false,
				depth: false,
				stencil: false,
				preserveDrawingBuffer: false,
				powerPreference: "low-power"
			}) ||
			canvas.getContext("webgl", {
				alpha: false,
				antialias: false,
				depth: false,
				stencil: false,
				preserveDrawingBuffer: false,
				powerPreference: "low-power"
			})
		if (!gl) {
			console.error("WebGL not supported")
			return
		}

		// 3) Cap FPS ~30
		const FRAME_INTERVAL = 1000 / 30
		let lastDraw = 0

		// 4) Pause when hidden or not intersecting
		let playing = true
		const handleVisibilityChange = () => {
			playing = !document.hidden
		}
		document.addEventListener("visibilitychange", handleVisibilityChange)

		const io = new IntersectionObserver(
			([entry]) => {
				playing = entry.isIntersecting
			},
			{ threshold: 0 }
		)
		io.observe(canvas)

		// Set viewport to match canvas size
		gl.viewport(0, 0, canvas.width, canvas.height)

		// Setup blending for transparency
		// NOTE: Removed this for performance; no need for alpha channel
		// gl.enable(gl.BLEND)
		// gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

		// Create shader program
		const shaderResult = createFragmentShader({
			blurAmount: 1000
			// blurExponentRange: [0.2, 1]
		})
		// Check if result is a FragmentShader object
		if (typeof shaderResult === "string") {
			console.error("Expected FragmentShader object but got string")
			return
		}
		const { shader: fragmentShaderSource } = shaderResult as FragmentShader

		// Vertex shader - simple pass-through
		const vertexShaderSource = `
			attribute vec2 a_position;
			void main() {
				gl_Position = vec4(a_position, 0, 1);
			}
		`

		// Create and compile shaders
		const vertexShader = gl.createShader(gl.VERTEX_SHADER)
		const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)

		if (!vertexShader || !fragmentShader) {
			console.error("Could not create shaders")
			return
		}

		gl.shaderSource(vertexShader, vertexShaderSource)
		gl.shaderSource(fragmentShader, fragmentShaderSource)
		gl.compileShader(vertexShader)
		gl.compileShader(fragmentShader)

		// Check for compilation errors
		if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
			console.error("Vertex shader compilation error:", gl.getShaderInfoLog(vertexShader))
			return
		}
		if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
			console.error("Fragment shader compilation error:", gl.getShaderInfoLog(fragmentShader))
			return
		}

		// Create and link program
		const program = gl.createProgram()
		if (!program) {
			console.error("Could not create program")
			return
		}

		gl.attachShader(program, vertexShader)
		gl.attachShader(program, fragmentShader)
		gl.linkProgram(program)

		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			console.error("Program linking error:", gl.getProgramInfoLog(program))
			return
		}

		gl.useProgram(program)

		// Create a buffer for the positions
		const positionBuffer = gl.createBuffer()
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
		const positions = [-1, -1, 1, -1, -1, 1, 1, 1]
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

		// Get attribute location
		const positionLocation = gl.getAttribLocation(program, "a_position")
		gl.enableVertexAttribArray(positionLocation)
		gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

		// Get uniform locations
		const timeLocation = gl.getUniformLocation(program, "u_time")
		const widthLocation = gl.getUniformLocation(program, "u_w")
		const heightLocation = gl.getUniformLocation(program, "u_h")
		const gradientLocation = gl.getUniformLocation(program, "u_gradient")
		const pixelRatioLocation = gl.getUniformLocation(program, "u_pixelRatio")

		// Create gradient texture
		// Build a 1D gradient texture (change stops to taste)
		function makeGradientTexture() {
			const w = 512,
				h = 1
			const canvas = document.createElement("canvas")
			canvas.width = w
			canvas.height = h
			const ctx = canvas.getContext("2d")
			if (!ctx) return
			const g = ctx.createLinearGradient(0, 0, w, 0)
			// Add your gradient stops here:
			g.addColorStop(0.0, "#000001")
			g.addColorStop(0.25, "#08080a")
			g.addColorStop(0.45, "#15151c")
			g.addColorStop(0.65, "#0f0f16")
			g.addColorStop(0.85, "#000001")
			g.addColorStop(1.0, "#1c1c28")
			ctx.fillStyle = g
			ctx.fillRect(0, 0, w, h)

			if (!gl) return
			const tex = gl.createTexture()
			gl.bindTexture(gl.TEXTURE_2D, tex)
			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false)
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas)
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
			return tex
		}
		// const gradientTexture = gl.createTexture()
		const gradientTexture = makeGradientTexture()
		if (!gradientTexture) return
		gl.activeTexture(gl.TEXTURE0)
		gl.bindTexture(gl.TEXTURE_2D, gradientTexture)

		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

		// Set uniform values
		gl.uniform1i(gradientLocation, 0) // Use texture unit 0
		gl.uniform1f(widthLocation, canvasDimensions.width)
		gl.uniform1f(heightLocation, canvasDimensions.height / 3)
		gl.uniform1f(pixelRatioLocation, pixelRatio * 2)

		// Animation loop
		const render = (now: number) => {
			if (!playing) {
				requestRef.current = requestAnimationFrame(render)
				return
			}
			if (now - lastDraw < FRAME_INTERVAL) {
				requestRef.current = requestAnimationFrame(render)
				return
			}

			lastDraw = now

			const t = now * 0.001
			gl.uniform1f(timeLocation, t)
			gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

			requestRef.current = requestAnimationFrame(render)
		}

		requestRef.current = requestAnimationFrame(render)

		// Cleanup function
		return () => {
			if (requestRef.current) {
				cancelAnimationFrame(requestRef.current)
			}

			// Clean up event listeners and observer
			document.removeEventListener("visibilitychange", handleVisibilityChange)
			io.disconnect()

			// Clean up WebGL resources
			gl.deleteProgram(program)
			gl.deleteShader(vertexShader)
			gl.deleteShader(fragmentShader)
			gl.deleteBuffer(positionBuffer)
			gl.deleteTexture(gradientTexture)
		}
	}, [canvasDimensions])

	return (
		<BackgroundContainer ref={containerRef}>
			<Canvas
				ref={canvasRef}
				width={canvasDimensions.width}
				height={canvasDimensions.height}
				$width={canvasDimensions.width}
				$height={canvasDimensions.height}
				$top={canvasDimensions.top}
				$left={canvasDimensions.left}
			/>
		</BackgroundContainer>
	)
}

const BackgroundContainer = styled.div`
	background-color: var(--background);
	width: 100%;
	height: 100%;
	overflow: hidden;
	position: absolute;
	top: 0;
	left: 0;
	z-index: -1;
`

const Canvas = styled.canvas<{
	$width: number
	$height: number
	$top: number
	$left: number
}>`
	display: block;
	position: absolute;
	width: ${(props) => props.$width}px;
	height: ${(props) => props.$height}px;
	top: ${(props) => props.$top}px;
	left: ${(props) => props.$left}px;
	filter: invert(1);

	@media (prefers-color-scheme: dark) {
		filter: none;
	}
`
