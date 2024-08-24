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

			<section className="bg-gray-800 p-8 rounded-lg shadow-md mb-12">
				<h2 className="text-3xl font-bold mb-4 text-center">Current Events</h2>
				<div className="w-full flex flex-col items-center">
					<p className="mt-2  text-xl text-center max-w-screen-lg mb-12">
						Stay updated with our latest events, workshops, and meetups. Join us to network and
						learn with fellow developers.
					</p>
					<div className="flex justify-center gap-6 w-full">
						<div
							className="flex flex-col items-center flex-1 "
							style={{ flexBasis: "50%", height: "600px", overflow: "hidden" }}
						>
							<h2 className="text-3xl font-bold mb-4 text-center ">On Lu.ma</h2>
							<iframe
								src="https://lu.ma/embed/event/evt-UDB2YUh2bKH152P/simple"
								width="100%"
								height="100%"
								allowFullScreen
								aria-hidden="false"
							></iframe>
						</div>
						<div
							className="flex flex-col items-center flex-1"
							style={{ flexBasis: "50%", height: "600px", overflow: "hidden" }}
						>
							<h2 className="text-3xl font-bold mb-4 text-center">On Meetup.com</h2>
							<a href="https://www.meetup.com/san-diego-devx/events/301885439/?utm_medium=referral&utm_campaign=share-btn_savedevents_share_modal&utm_source=link">
								<img
									src="https://secure.meetupstatic.com/photos/event/5/0/b/c/600_519680668.webp?w=384"
									alt="Meetup Event"
									style={{
										width: "100%",
										height: "600px",
										objectFit: "cover"
									}}
								/>
							</a>
						</div>
					</div>
				</div>
				<h2 className="mt-12 text-3xl font-bold mb-4 text-center">Join Our Discord</h2>
				<div className="w-full flex flex-col items-center">
					<div className="flex justify-center">
						<a
							href="https://discord.gg/rmbT75CB"
							target="_blank"
							rel="noopener noreferrer"
							className="btn btn-primary"
							style={{
								backgroundColor: "#5865F2",
								color: "white",
								padding: "15px 20px",
								borderRadius: "1px",
								textDecoration: "none",
								display: "inline-block"
							}}
						>
							DEVx Discord
						</a>
					</div>
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
