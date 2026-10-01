"use client"
import { styled } from "styled-components"

//
// Types
//

type Mark = {
	src: string
	alt: string
	label: string
	use: string
}

type Swatch = {
	name: string
	hex: string
	note?: string
}

type ColorGroup = {
	title: string
	swatches: Swatch[]
}

//
// Constants
//

const marks: Mark[] = [
	{ src: "/images/logo/devx-thick.svg", alt: "DEVx", label: "DEVx", use: "Header and footer" },
	{ src: "/images/logo/x.svg", alt: "x", label: "x", use: "Favicon" },
	{ src: "/images/logo/devxsd-white.svg", alt: "DEVxSD", label: "DEVxSD", use: "Homepage" }
]

const colorGroups: ColorGroup[] = [
	{
		title: "Primary",
		swatches: [
			{ name: "Paper", hex: "#ffffff", note: "The page" },
			{ name: "Ink", hex: "#181818", note: "Type and buttons" },
			{ name: "Purple", hex: "#5010a0", note: "Behind the letters" }
		]
	},
	{
		title: "From the x",
		swatches: [
			{ name: "Blue", hex: "#2454e6", note: "In the x" },
			{ name: "Yellow", hex: "#f9e214" },
			{ name: "Magenta", hex: "#f010d7" },
			{ name: "Cyan", hex: "#3ce2c8" },
			{ name: "Orange", hex: "#ef5b30" },
			{ name: "Pink", hex: "#e52a51" }
		]
	}
]

//
// Components
//

export function BrandPage() {
	return (
		<Main>
			<Intro>
				<Title>Brand</Title>
				<Lead>The marks, and the colors they came with.</Lead>
				<Arrive href="/intro">See the new x arrive.</Arrive>
			</Intro>

			<Section>
				<SectionTitle>Marks</SectionTitle>
				<MarkGrid>
					{marks.map((mark) => (
						<MarkCard key={mark.label}>
							<Plate>
								<img src={mark.src} alt={mark.alt} />
							</Plate>
							<Plate $ink>
								<img src={mark.src} alt="" />
							</Plate>
							<MarkLabel>{mark.label}</MarkLabel>
							<MarkUse>{mark.use}</MarkUse>
						</MarkCard>
					))}
				</MarkGrid>
				<Note>
					White letters, black edge, so they still show up on a white page. The stripes stay. A #, a
					&gt;, an =, and a + sit on top of them.
				</Note>
			</Section>

			<Section>
				<SectionTitle>Colors</SectionTitle>
				{colorGroups.map((group) => (
					<ColorGroupBlock key={group.title}>
						<GroupTitle>{group.title}</GroupTitle>
						<SwatchGrid>
							{group.swatches.map((swatch) => (
								<SwatchCard key={swatch.hex}>
									<Chip $color={swatch.hex} />
									<SwatchName>{swatch.name}</SwatchName>
									<SwatchHex>{swatch.hex}</SwatchHex>
									{swatch.note ? <SwatchNote>{swatch.note}</SwatchNote> : null}
								</SwatchCard>
							))}
						</SwatchGrid>
					</ColorGroupBlock>
				))}
				<Note>Purple sits behind the letters and marks a phrase.</Note>
			</Section>
		</Main>
	)
}

const Main = styled.main`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
	padding-bottom: 4rem;
`

const Intro = styled.section`
	width: min(var(--column), calc(100% - 2.5rem));
	padding: 3.25rem 0 0.5rem;
`

const Title = styled.h1`
	margin: 0;
	font-family: "Chivo", sans-serif;
	font-weight: 800;
	font-size: clamp(3rem, 7vw, 5.4rem);
	line-height: 0.92;
	letter-spacing: -0.04em;
`

const Lead = styled.p`
	margin: 0.85rem 0 0;
	max-width: 36rem;
	font-size: 1.05rem;
	line-height: 1.55;
	color: var(--muted-foreground);
`

const Arrive = styled.a`
	display: inline-block;
	margin-top: 0.9rem;
	color: var(--accent);
	font-weight: 700;
	text-decoration: none;

	&:hover {
		text-decoration: underline;
	}
`

const Section = styled.section`
	width: min(var(--column), calc(100% - 2.5rem));
	padding: 2.25rem 0 0;
`

const SectionTitle = styled.h2`
	margin: 0 0 1.25rem;
	font-family: "Chivo", sans-serif;
	font-weight: 800;
	letter-spacing: -0.03em;
`

const MarkGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 1rem;

	@media (max-width: 800px) {
		grid-template-columns: 1fr;
	}
`

const MarkCard = styled.figure`
	display: flex;
	flex-direction: column;
	gap: 0.65rem;
	margin: 0;
`

const Plate = styled.div<{ $ink?: boolean }>`
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 6.5rem;
	padding: 1.1rem 1rem;
	background: ${(props) => (props.$ink ? "#181818" : "#ffffff")};
	border: 1px solid var(--border);
	border-radius: 0.75rem;

	img {
		display: block;
		width: auto;
		max-width: 100%;
		max-height: 3.4rem;
		height: auto;
	}
`

const MarkLabel = styled.figcaption`
	margin: 0.2rem 0 0;
	font-weight: 700;
	color: var(--foreground);
`

const MarkUse = styled.p`
	margin: -0.35rem 0 0;
	color: var(--muted-foreground);
	font-size: 0.92rem;
`

const Note = styled.p`
	margin: 1rem 0 0;
	max-width: 36rem;
	color: var(--muted-foreground);
`

const ColorGroupBlock = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.85rem;

	& + & {
		margin-top: 1.75rem;
	}
`

const GroupTitle = styled.h3`
	margin: 0;
	font-family: "Chivo", sans-serif;
	font-weight: 800;
	font-size: 1.15rem;
	letter-spacing: -0.03em;
`

const SwatchGrid = styled.ul`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(9.5rem, 1fr));
	gap: 1rem;
	margin: 0;
	padding: 0;
	list-style: none;
`

const SwatchCard = styled.li`
	display: flex;
	flex-direction: column;
	gap: 0.3rem;
`

const Chip = styled.span<{ $color: string }>`
	display: block;
	height: 4.5rem;
	border-radius: 0.75rem;
	background: ${(props) => props.$color};
	border: 1px solid var(--border);
`

const SwatchName = styled.p`
	margin: 0.35rem 0 0;
	font-weight: 700;
`

const SwatchHex = styled.p`
	margin: 0;
	font-family: "Chivo", sans-serif;
	font-size: 0.92rem;
	color: var(--foreground);
`

const SwatchNote = styled.p`
	margin: 0;
	font-size: 0.85rem;
	line-height: 1.4;
	color: var(--muted-foreground);
`
