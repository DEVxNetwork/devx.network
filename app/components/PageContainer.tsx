"use client"
import styled from "styled-components"

// Types //

interface PageContainerProps {
	children: React.ReactNode
	className?: string
	alignItems?: "center" | "stretch" | "flex-start" | "flex-end"
}

// Components //

export const PageContainer = ({
	children,
	className,
	alignItems = "stretch"
}: PageContainerProps) => {
	return (
		<StyledContainer className={className} $alignItems={alignItems}>
			{children}
		</StyledContainer>
	)
}

// Styled Components //

const StyledContainer = styled.div<{
	$alignItems: "center" | "stretch" | "flex-start" | "flex-end"
}>`
	background-color: var(--color-bg-raised);
	border: 1px solid var(--color-border);
	padding: 3rem;
	border-radius: 1rem;
	width: 100%;
	max-width: 600px;
	display: flex;
	flex-direction: column;
	align-items: ${(props) => props.$alignItems};
	gap: 2rem;
	box-shadow: 0 12px 40px rgba(23, 20, 15, 0.06);
`
