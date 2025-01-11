import React from "react"
import { PotionBackground } from "./components/PotionBackground"
import { DeepNote } from "./components/DeepNote"

const Home: React.FC = () => {
	return (
		<>
			<main className="p-8 text-white flex flex-col items-center justify-center">
				<DeepNote>
					<PotionBackground />
					<section className="relative">
						<img
							src="/images/sd-devx-brand.png"
							alt="Developer meetup hero"
							style={{
								width: "100%",
								maxWidth: "688px",
								margin: "0 auto"
							}}
						/>
					</section>

					<section className="p-12 rounded-lg">
						<p className="text-xl text-center max-w-screen-lg">
							Fostering developer community through events and open-source projects in San Diego,
							California.
						</p>
					</section>

					{/* <section className="bg-gray-800 p-8 rounded-lg shadow-md mb-12">
				<h2 className="text-3xl font-bold mb-4 text-center">Past Events</h2>
				<div className="w-full flex justify-center">
					<p className="mt-2 text-xl text-center max-w-screen-lg">
						Missed an event? Catch up on all the action from our previous meetups. From coding
						sessions to guest speakers, we have it all documented.
					</p>
				</div>
			</section> */}

					{/* <section className="bg-gray-800 p-8 rounded-lg shadow-md mb-12">
					<h2 className="text-3xl font-bold mb-4 text-center">Sponsors</h2>
					<div className="w-full flex justify-center">
						<p className="mt-2 text-xl text-center max-w-screen-lg">
							We are grateful for our sponsors who make our events possible. Interested in
							sponsoring? Reach out to us on Discord/Meetup or at the event.
						</p>
					</div>
				</section> */}
				</DeepNote>
			</main>
		</>
	)
}

export default Home
