import { Component, ReactNode, ErrorInfo } from "react"

// Types //

interface ErrorBoundaryProps {
	children?: ReactNode
	fallback?: ReactNode
}

interface ErrorBoundaryState {
	hasError: boolean
}

// Components //

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props)
		this.state = { hasError: false }
	}

	static getDerivedStateFromError(_: Error): ErrorBoundaryState {
		// Update state so the next render will show the fallback UI
		return { hasError: true }
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error("ErrorBoundary caught an error:", error, errorInfo)
	}

	render() {
		if (this.state.hasError) {
			// Render fallback UI, default to black background for WebGL crashes
			return (
				this.props.fallback || (
					<div style={{ backgroundColor: "var(--background)", width: "100%", height: "100%" }} />
				)
			)
		}

		return this.props.children
	}
}
