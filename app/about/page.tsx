import React from "react"

const communityDescription = `
	We're a community of developers of all skill levels, dedicated to fostering a fun and
	educational environment. Hosted by Sam Holmes and a team of passionate organizers, our
	monthly meetups offer an opportunity to network, learn, and showcase your projects. At
	each event, you'll enjoy complimentary food and drinks during our networking lunch,
	followed by a series of engaging presentations on various developer and engineering
	topics. After the talks, we break into groups for casual networking, project showcases,
	and coding help. Whether you're a seasoned developer or just starting out, there's
	something for everyone. Be sure to bring your laptop if you'd like to share your latest
	project or give a presentation. We look forward to meeting you and seeing what you're
	excited about!
`

export default function About() {
	return (
		<main className="p-8 bg-gray-900 min-h-screen text-white">
			<section className="relative mb-12">
				<img
					src="/images/crowd.jpg"
					alt="Big crowd"
					className="w-full h-[40rem] object-cover rounded-lg shadow-md opacity-75"
				/>
			</section>
			<section className="bg-gray-800 p-8 rounded-lg shadow-md mb-12">
				<h2 className="text-3xl font-bold mb-4 text-center">About us</h2>
				<div className="w-full flex justify-center">
					<p className="mt-2 text-xl text-center max-w-screen-lg">{communityDescription}</p>
				</div>
			</section>

			<section className="bg-gray-800 p-8 rounded-lg shadow-md">
				<h2 className="text-2xl font-bold mb-6 text-center">Organizers</h2>
				<div className="flex flex-wrap justify-center gap-6">
					<div className="bg-gray-700 p-6 rounded-lg text-center">
						<img
							src="/images/sam-about.jpeg"
							alt="Sam Holmes"
							className="w-40 h-40 object-cover  mx-auto mb-4"
						/>
						<h3 className="text-xl font-bold">Sam Holmes</h3>
						<a
							href="https://www.linkedin.com/in/sammyholmes/"
							target="_blank"
							rel="noopener noreferrer"
							className="mt-2 text-lg text-blue-400 hover:underline inline-flex items-center"
						>
							<img
								src="/images/linkedin-logo.webp"
								alt="LinkedIn Logo"
								className="h-12 w-12 ml-2"
							/>
						</a>
					</div>
					<div className="bg-gray-700 p-6 rounded-lg text-center">
						<img
							src="/images/trystan-about.jpeg"
							alt="Tryston Perry"
							className="w-40 h-40 object-cover  mx-auto mb-4"
						/>
						<h3 className="text-xl font-bold">Tryston Perry</h3>
						<a
							href="https://www.linkedin.com/in/trystonperry/"
							target="_blank"
							rel="noopener noreferrer"
							className="mt-2 text-lg text-blue-400 hover:underline inline-flex items-center"
						>
							<img
								src="/images/linkedin-logo.webp"
								alt="LinkedIn Logo"
								className="h-12 w-12 ml-2"
							/>
						</a>
					</div>
					<div className="bg-gray-700 p-6 rounded-lg text-center">
						<img
							src="/images/aj-about.jpeg"
							alt="AJ Caldwell"
							className="w-40 h-40 object-cover  mx-auto mb-4"
						/>
						<h3 className="text-xl font-bold">AJ Caldwell</h3>
						<a
							href="https://www.linkedin.com/in/aj-caldwell/"
							target="_blank"
							rel="noopener noreferrer"
							className="mt-2 text-lg text-blue-400 hover:underline inline-flex items-center"
						>
							<img
								src="/images/linkedin-logo.webp"
								alt="LinkedIn Logo"
								className="h-12 w-12 ml-2"
							/>
						</a>
					</div>
					<div className="bg-gray-700 p-6 rounded-lg text-center">
						<img
							src="/images/zane-about.jpeg"
							alt="Zane Prunella"
							className="w-40 h-40 object-cover  mx-auto mb-4"
						/>
						<h3 className="text-xl font-bold">Zane Prunella</h3>
						<a
							href="https://www.linkedin.com/in/zprunella/"
							target="_blank"
							rel="noopener noreferrer"
							className="mt-2 text-lg text-blue-400 hover:underline inline-flex items-center"
						>
							<img
								src="/images/linkedin-logo.webp"
								alt="LinkedIn Logo"
								className="h-12 w-12 ml-2"
							/>
						</a>
					</div>
				</div>
			</section>
		</main>
	)
}
