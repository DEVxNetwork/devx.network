import { getAllSlides } from "./slidesData"
import SlidesListClient from "./SlidesListClient"

// Components //

export default function SlidesPage() {
	const slides = getAllSlides()
	return <SlidesListClient slides={slides} />
}
