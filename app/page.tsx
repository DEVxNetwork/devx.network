import React from "react"

const Home: React.FC = () => {
	return (
		<main className="p-8 bg-gray-900 min-h-screen text-white">
			<section className="relative mb-12">
				<img
					src="/images/logo.jpeg"
					alt="Developer meetup hero"
					className="w-full h-[50rem] object-cover rounded-lg shadow-md opacity-75"
				/>
			</section>

			<section className="bg-gray-800 p-8 rounded-lg shadow-md mb-12">
				<h2 className="text-3xl font-bold mb-4 text-center">Join us</h2>
				<div className="w-full flex justify-center">
					<p className="mt-2 text-xl text-center max-w-screen-lg">
						Fostering developer community through meetups and open-source projects in California.
					</p>
				</div>
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

			<section className="bg-gray-800 p-8 rounded-lg shadow-md mb-12">
				<h2 className="text-3xl font-bold mb-4 text-center">Sponsors</h2>
				<div className="w-full flex justify-center">
					<p className="mt-2 text-xl text-center max-w-screen-lg">
						We are grateful for our sponsors who make our events possible. Interested in sponsoring?
						Reach out to us on Discord/Meetup or at the event.
					</p>
				</div>
			</section>
		</main>
	)
}

export default Home
