import { notFound } from "next/navigation"
import { getAllSlideSlugs, getSlideData } from "../slidesData"
import SlideDetailClient from "./SlideDetailClient"

// Static Generation //

export async function generateStaticParams() {
	const slugs = getAllSlideSlugs()
	return slugs.map((slug) => ({ slug }))
}

// Components //

export default async function SlideDetail({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params
	const slideData = getSlideData(slug)

	if (!slideData) {
		notFound()
	}

	return <SlideDetailClient slideData={slideData} />
}
